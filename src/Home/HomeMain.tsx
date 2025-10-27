import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { IoIosArrowForward } from "react-icons/io";
import { PiBankFill } from "react-icons/pi";
import { IoAddCircleOutline, IoCloudUploadOutline } from "react-icons/io5";
import { FaRegNewspaper } from "react-icons/fa6";
import { IoFingerPrintSharp } from "react-icons/io5";
import { TextField } from "@mui/material";
import { DatePicker, Select, InputNumber, message } from "antd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import Modal from "react-bootstrap/Modal";
import Schedule from "./Schedule";
import Team from "./Team";

import Container from "react-bootstrap/esm/Container";
import { State, City, IState, ICity } from "country-state-city";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    label: "Organization setup",
    description: "Here you can set up your organization details with your own customization.",
  },
  {
    label: "Add employee",
    description: "Add your employee details to setup your organization.",
  },
  {
    label: "Schedule",
    description: "Schedule the upcoming working hours for your employee.",
  },
];


// Define the address interface for the state
interface IAddress {
  address: string;
  state: string;
  city: string;
  pincode: string;
}

// Define the signature documents interface for the state
interface ISignatureDocuments {
  signatureStampDocument?: File | string | null;
  signatureForm16Document?: File | string | null;
}

// Define the bank details interface for the state
interface IBankDetails {
  accountHolderName: string;
  accountNumber: number;
  IFSCCode: string;
}

// Define the contact information interface for the state
interface IContact {
  contactNo?: string;
  emailId?: string;
}

// Define the tax details interface for the state
interface ITaxDetails {
  gstNo: string;
  tan: string;
  pan: string;
}

// Define the leave setup interface for the state
interface ILeaveSetup {
  categoryName: string;
  TotalDays: number;
  ToatalDaysInMonths: number;
}

// Define the payroll interface for the state
interface IPayroll {
  payrollType: "Monthly" | "Bi-Weekly" | "Weekly";
  payrollDates: {
    Startdate: Date;
    Enddate: Date;
  };
}

// Define the company interface for the state
interface ICompany {
  OrganizationLogo: File | null;
  OrganizationName: string;
  websiteLink?: string;
  address: IAddress;
  contactInformation: IContact;
  taxDetails: ITaxDetails;
  branches: string[];
  industry: string;
  subIndustry: string[];
  departments: string[];
  payroll: IPayroll;
  leavesetup: ILeaveSetup[];
  businessDocuments?: string;
  signatureDocuments: ISignatureDocuments;
  bankDetails: IBankDetails;
  businessLicenseCompleted: boolean;
  signatureDocumentCompleted: boolean;
  bankDetailsCompleted: boolean;
  companyDetailsCompleted: boolean;
  attendanceLocation: {
    branch: string;
    location: string;
    range: number;
  }[];
}
interface PayrollDates {
  Startdate: Date; // full Date object
  Enddate: Date;   // full Date object
}




const HomeMain = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [show, setShow] = useState(false);
  const [subShow, setsubShow] = useState(false);
  const [isOrgcompletesetup, setIsOrgcompletesetup] = useState({
    businessLicense: false,
    identityProof: false,
    bankDetails: false,
  });
  const [isStepper, setIsstepper] = useState({
    mainpage: true,
    isorgSetup: false,
    isAddemployee: false,
    isSchedule: false,
  });

  const [payrollDates, setPayrollDates] = useState<PayrollDates>({
    Startdate: new Date(),
    Enddate: new Date(),
  });


  const [company, setCompany] = useState<ICompany>({
    OrganizationLogo: null,
    OrganizationName: "",
    websiteLink: "",
    address: {
      address: "",
      state: "",
      city: "",
      pincode: "",
    },
    contactInformation: {
      contactNo: "",
      emailId: "",
    },
    taxDetails: {
      gstNo: "",
      tan: "",
      pan: "",
    },
    branches: [],
    industry: "",
    subIndustry: [],
    departments: [],
    payroll: {
      payrollType: "Monthly",
      payrollDates: {
        Startdate: new Date(),
        Enddate: new Date(),
      },
    },
    leavesetup: [
      {
        categoryName: "",
        TotalDays: 0,
        ToatalDaysInMonths: 0,
      },
    ],
    businessDocuments: "",
    signatureDocuments: {
      signatureStampDocument: null,
      signatureForm16Document: null,
    },
    bankDetails: {
      accountHolderName: "",
      accountNumber: 0,
      IFSCCode: "",
    },
    businessLicenseCompleted: false,
    signatureDocumentCompleted: false,
    bankDetailsCompleted: false,
    companyDetailsCompleted: true,
    attendanceLocation: [],
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);
  const fileInputRef3 = useRef<HTMLInputElement | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [colorValue, setColorvalue] = useState(null);
  const [industryArray, setIndustryArray] = useState([]);
  const [allindustryData, setAllindustryData] = useState<any[]>([]);
  const [addsubIndustry, setAddsubIndustry] = useState<any[]>([]);
  const [userData, setuserData] = useState({
    id: "",
    name: "",
    email: "",
    companyId: "",
    role: ""
  });

  const [forms, setForms] = useState([
    {
      categoryName: "",
      TotalDays: 0,
      ToatalDaysInMonths: 0,
    },
  ]);

  const addForm = () => {
    const ff = [
      ...forms,
      {
        categoryName: "",
        TotalDays: 0,
        ToatalDaysInMonths: 0,
      },
    ];
    setForms(ff);
  };

  const handleFormChange = (index: number, field: string, value: any) => {
    const updatedForms = forms.map((form, idx) =>
      idx === index ? { ...form, [field]: value } : form
    );
    setCompany({ ...company, leavesetup: updatedForms });
    setForms(updatedForms);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlesubShow = () => setsubShow(true);
  const handlesubClose = () => setsubShow(false);

  const handleComplete = (val: any, num: any) => {

    if (val == "Organization setup") {
      setCurrentSection(num + 1);
      setIsstepper({
        mainpage: false,
        isorgSetup: true,
        isAddemployee: false,
        isSchedule: false,
      });
    } else if (val == "Add employee") {
      setIsstepper({
        mainpage: false,
        isorgSetup: false,
        isAddemployee: false,
        isSchedule: true,
      });
    } else if (val == "Schedule") {
      setIsstepper({
        mainpage: false,
        isorgSetup: false,
        isAddemployee: true,
        isSchedule: false,
      });
    } else {
      setIsstepper({
        mainpage: true,
        isorgSetup: false,
        isAddemployee: false,
        isSchedule: false,
      });
    }
  };

  const handleLastSkip = async (e: any) => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!userData.companyId) {
        // Create a new company first
        await postCompanyDetails();
      }
      const formData = new FormData();
      formData.append("organizationSetupCompleted", "true");

      const res = await axios.patch(
        `${API_URL}/api/company/${userData.companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsstepper({
        mainpage: true,
        isorgSetup: false,
        isAddemployee: false,
        isSchedule: false,
      });
      await getCompanysetup(userData.companyId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLastDone = async (e: any) => {
    try {
      const token = localStorage.getItem("authtoken");

      if (!token) {
        message.error("Authentication token not found. Please log in again.");
        return;
      }
      if (!userData.companyId) {
        // Create a new company first
        await postCompanyDetails();
      }
      console.log(company, "companydat");


      // Validate setup completion
      if (
        company.businessLicenseCompleted &&
        company.bankDetailsCompleted &&
        company.signatureDocumentCompleted
      ) {
        const formData = new FormData();
        formData.append("organizationSetupCompleted", "true");

        // Show loading feedback
        message.loading("Completing setup...");

        // Send PATCH request
        const res = await axios.patch(
          `${API_URL}/api/company/${userData.companyId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Success feedback
        message.success("Organization setup completed successfully!");

        // Update stepper state
        setIsstepper({
          mainpage: true,
          isorgSetup: false,
          isAddemployee: false,
          isSchedule: false,
        });

        // Refresh company setup data
        await getCompanysetup(userData.companyId);
      } else {
        message.error("Please complete all setup steps!");
      }
    } catch (error: any) {
      console.error("Error completing setup:", error);

      // Provide meaningful error feedback
      message.error(
        error.response?.data?.message || "An error occurred while completing the setup."
      );
    }
  };


  const initialPage = (currentPage: any) => {
    console.log(currentPage, "dsad");

    setCurrentSection(currentPage);
    setIsstepper({
      mainpage: true,
      isorgSetup: false,
      isAddemployee: false,
      isSchedule: false,
    });
  };

  const [newIndustry, setnewIndustry] = useState("");

  const handleCreateClose = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.post(
        `${API_URL}/api/industries`,
        { industry: newIndustry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setnewIndustry("");
      setShow(false);
      await getIndustry();
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  // Generalized file input change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files ? files[0] : null;
    if (file) {
      setCompany((prevCompany) => ({
        ...prevCompany,
        [name]: file,
      }));
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClickUpload2 = () => {
    if (fileInputRef3.current) {
      fileInputRef3.current.click();
    }
  };

  useEffect(() => {
    // Fetch all states of India
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  const handleStateChange = (stateCode: string) => {
    const selected = states.find((state) => state.isoCode === stateCode);
    setCompany({
      ...company,
      address: {
        ...company.address,
        state: selected?.name ? selected?.name : "",
      },
    });
    const cities = City.getCitiesOfState("IN", stateCode);
    setCities(cities);
    setSelectedCity(null);
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setCompany({
      ...company,
      address: {
        ...company.address,
        city: cityName,
      },
    });
  };

  const handleChangeTag = (tags: string[]) => {
    setTags(tags);
    setCompany({
      ...company,
      branches: tags,
    });
  };

  const handleSubChangeTag = (tags: string[]) => {
    setAddsubIndustry(tags);
  };

  const getIndustry = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(
        `${API_URL}/api/industries`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const industryValues = res.data.data.map(
        (item: { industry: string }) => item.industry
      );
      console.log(res);
      setAllindustryData(res.data.data);
      setIndustryArray(industryValues);
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleColor = (val: any, i: any) => {
    setColorvalue(i);
    setCompany({ ...company, industry: val });
  };

  const [subindustryData, setsubIndustryData] = useState<any[]>([]);

  const handleNavsubIndustry = () => {
    const dd = allindustryData.filter(
      (val: any) => val.industry === company.industry
    );
    setsubIndustryData(dd[0].subIndustries);
    setCurrentSection(9);
  };

  const handlesubCreateClose = async () => {
    const token = localStorage.getItem("authtoken");

    // Find the industry object that matches the selected industry
    const industry = allindustryData.find(
      (val: any) => val.industry === company.industry
    );

    if (!industry) {
      console.error("Industry not found");
      return;
    }

    try {
      // Update the subIndustries by appending the new industry to the existing list
      const updatedSubIndustries: string[] = [
        ...(industry.subIndustries as string[]),
        ...(Array.isArray(addsubIndustry) ? addsubIndustry : [addsubIndustry]),
      ];
      const res = await axios.patch(
        `${API_URL}/api/industries/${industry._id}`,
        { subIndustries: updatedSubIndustries },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setsubIndustryData(updatedSubIndustries);

      // Call the getIndustry function to update your industry data
      await getIndustry();

      // Clear the input and close the modal
      setAddsubIndustry([]);
      handlesubClose();

      console.log("Response:", res.data);
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  const handlesubColor = (val: any, i: number) => {
    let updatedIndices = [...selectedIndices];
    let updatedValues = [...selectedValues];

    if (selectedIndices.includes(i)) {
      // If the index is already selected, remove it
      updatedIndices = selectedIndices.filter((index) => index !== i);
      updatedValues = selectedValues.filter((value) => value !== val);
    } else {
      // If the index is not selected, add it
      updatedIndices.push(i);
      updatedValues.push(val);
    }

    // Update states
    setSelectedIndices(updatedIndices);
    setSelectedValues(updatedValues);

    // Update company with the latest subIndustry values
    setCompany({ ...company, subIndustry: updatedValues });
  };

  useEffect(() => {
    getIndustry();
  }, []);

  const handleInputChange = (
    index: number,
    field: "location" | "range",
    value: string | number
  ) => {
    const updatedAttendanceLocation = [...company.attendanceLocation];
    updatedAttendanceLocation[index] = {
      ...updatedAttendanceLocation[index],
      branch: company.branches[index],
      [field]: value,
    };
    setCompany({
      ...company,
      attendanceLocation: updatedAttendanceLocation,
    });
  };

  const postCompanyDetails = async () => {
    const token = localStorage.getItem("authtoken");



    // Create a new FormData object
    const formData = new FormData();

    // Append fields to the FormData object (excluding File types for simplicity)
    formData.append("OrganizationName", company.OrganizationName);
    formData.append("websiteLink", company.websiteLink || "");
    formData.append("industry", company.industry);

    if (company.subIndustry) {
      company.subIndustry.forEach((val, i) => {
        formData.append(`subIndustry[${i}]`, val)
      })
    }




    if (company.departments) {
      company.departments.forEach((val, i) => {
        formData.append(`departments[${i}]`, val)
      })
    }

    // Loop through the `address` object and append each field
    formData.append("address[address]", company.address.address);
    formData.append("address[state]", company.address.state);
    formData.append("address[city]", company.address.city);
    formData.append("address[pincode]", company.address.pincode);

    // Similarly, add the contact information
    formData.append(
      "contactInformation[contactNo]",
      company.contactInformation.contactNo || ""
    );
    formData.append(
      "contactInformation[emailId]",
      company.contactInformation.emailId || ""
    );



    formData.append("payroll[payrollType]", company.payroll.payrollType);
    formData.append("payroll[payrollDates][Startdate]", company.payroll.payrollDates.Startdate.toISOString());
    formData.append("payroll[payrollDates][Enddate]", company.payroll.payrollDates.Enddate.toISOString());


    // Add tax details
    formData.append("taxDetails[gstNo]", company.taxDetails.gstNo);
    formData.append("taxDetails[tan]", company.taxDetails.tan);
    formData.append("taxDetails[pan]", company.taxDetails.pan);
    formData.append("AdminId", userData.id);


    formData.append(
      "companyDetailsCompleted",
      company.companyDetailsCompleted.toString()
    );

    // Handle the `leavesetup` array, if necessary
    company.leavesetup.forEach((leave, index) => {
      formData.append(`leavesetup[${index}][categoryName]`, leave.categoryName);
      formData.append(
        `leavesetup[${index}][TotalDays]`,
        leave.TotalDays.toString()
      );
      formData.append(
        `leavesetup[${index}][ToatalDaysInMonths]`,
        leave.ToatalDaysInMonths.toString()
      );
    });

    // Add attendance location array
    company.attendanceLocation.forEach((location, index) => {
      formData.append(`attendanceLocation[${index}][branch]`, location.branch);
      formData.append(
        `attendanceLocation[${index}][location]`,
        location.location
      );
      formData.append(
        `attendanceLocation[${index}][range]`,
        location.range.toString()
      );
    });

    // Append files (if any)
    if (company.OrganizationLogo) {
      formData.append("OrganizationLogo", company.OrganizationLogo);
    }


    if (company.branches) {
      company.branches.forEach((val, i) => {
        formData.append(`branches[${i}]`, val)
      })
    }


    try {
      const res = await axios.post(`${API_URL}/api/company`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await getMe()
      setCurrentSection(14);
    } catch (error: any) {
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  const handleFileChange2 = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompany((prev) => ({
        ...prev,
        signatureDocuments: {
          ...prev.signatureDocuments,
          [field]: file,
        },
      }));
    }
  };

  const handleBusinessdocupload = async () => {
    const token = localStorage.getItem("authtoken");
    const formData = new FormData();

    if (company.businessDocuments) {
      formData.append("businessDocuments", company.businessDocuments);
    }
    formData.append("businessLicenseCompleted", "true");
    try {
      const res = await axios.patch(
        `${API_URL}/api/company/${userData.companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Document uploaded successfully!");
      setCompany({ ...company, businessLicenseCompleted: true })
      await getMe()
      setCurrentSection(14);
    } catch (error: any) {
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  const handlesignatureDocuments = async () => {
    const token = localStorage.getItem("authtoken");
    const formData = new FormData();

    if (company.signatureDocuments.signatureStampDocument) {
      formData.append(
        "signatureStampDocument",
        company.signatureDocuments.signatureStampDocument
      );
    }

    if (company.signatureDocuments.signatureForm16Document) {
      formData.append(
        "signatureForm16Document",
        company.signatureDocuments.signatureForm16Document
      );
    }

    formData.append("signatureDocumentCompleted", "true");

    try {
      const res = await axios.patch(
        `${API_URL}/api/company/${userData.companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Document uploaded successfully!");
      await getMe()
      setCompany({ ...company, signatureDocumentCompleted: true })
      setCurrentSection(14);
    } catch (error: any) {
      console.log(error);

      // message.error(error.response.data.message || "Something went wrong");
    }
  };

  const handleBankdetail = async () => {
    const token = localStorage.getItem("authtoken");
    const formData = new FormData();

    if (company.bankDetails.IFSCCode) {
      formData.append("bankDetails[IFSCCode]", company.bankDetails.IFSCCode);
    }

    if (company.bankDetails.accountHolderName) {
      formData.append(
        "bankDetails[accountHolderName]",
        company.bankDetails.accountHolderName
      );
    }
    if (company.bankDetails.accountNumber) {
      formData.append(
        "bankDetails[accountNumber]",
        String(company.bankDetails.accountNumber)
      );
    }

    formData.append("bankDetailsCompleted", "true");

    try {
      const res = await axios.patch(
        `${API_URL}/api/company/${userData.companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Updated successfully!");
      setCompany({ ...company, bankDetailsCompleted: true })
      await getMe()
      setCurrentSection(14);
    } catch (error: any) {
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setuserData(res.data);
      if (userData.role === "employee") {
        navigate("/emptask")
      }
      console.log(userData + "-----------")
      await getCompany(res.data.companyId);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getCompany = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await getCompanysetup(id);
    } catch (error: any) {
      console.log(error);
    }
  };

  const [markupData, setMarkupData] = useState<any>();

  const navigate = useNavigate()
  const getCompanysetup = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMarkupData(res.data.data);

      if (res.data.data.addEmployeeCompleted && res.data.data.scheduleCompleted && res.data.data.organizationSetupCompleted) {
        navigate("/Home")
        window.location.reload()
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  const getStepText = (stepLabel: string) => {
    if (
      stepLabel === "Organization setup" &&
      markupData?.organizationSetupCompleted
    ) {
      return "Completed";
    }
    if (stepLabel === "Add employee" && markupData?.addEmployeeCompleted) {
      return "Completed";
    }
    if (stepLabel === "Schedule" && markupData?.scheduleCompleted) {
      return "Completed";
    }
    return "Complete";
  };

  const getActiveStep = () => {
    if (markupData?.organizationSetupCompleted && markupData?.scheduleCompleted) {
      return 2;
    }
    if (markupData?.organizationSetupCompleted) {
      return 1;
    }
    if (markupData?.scheduleCompleted) {
      return 2;
    }
    if (markupData?.addEmployeeCompleted) {
      return 3;
    }
    return 0;
  };


  console.log(currentSection, "currentSection");



  return (
    <>
      {isStepper.mainpage && (
        <section
          style={{ height: "80vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="row m-0">
            <div className="col-lg-12 d-flex justify-content-center align-items-center">
              <div>
                <h6 style={{ paddingBottom: "0.6rem" }}>
                  Completed this to start your organization
                </h6>
                <div
                  style={{
                    border: "1px solid #1784A2",
                    padding: "1.5rem",
                    borderRadius: "8px",
                  }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <Box sx={{ maxWidth: 500 }}>
                    {/* <Stepper
                      orientation="vertical"
                      activeStep={getActiveStep()}
                    >
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel style={{ width: "80%" }}>
                            <p
                              className="m-0"
                              style={{ fontSize: "18px", fontWeight: "400" }}
                            >
                              {step.label} <IoIosArrowForward />
                            </p>
                            <p
                              className="m-0"
                              style={{ fontSize: "12px", fontWeight: "400" }}
                            >
                              {step.description}
                            </p>
                          </StepLabel>
                          <a
                            className="completeHomebtn"
                            style={{
                              cursor: "pointer",
                              color:
                                getStepText(step.label) === "Completed"
                                  ? "#00D715"
                                  : "",
                            }}
                            onClick={() =>
                              getStepText(step.label) !== "Completed" &&
                              handleComplete(step.label, index)
                            }

                          // onClick={() => handleComplete(step.label, index)}
                          >
                            {getStepText(step.label)}
                          </a>
                        </Step>
                      ))}
                    </Stepper> */}
                    <Stepper orientation="vertical" activeStep={getActiveStep()}>
                      {steps.map((step, index) => (
                        <Step
                          key={step.label}
                          completed={
                            (step.label === "Organization setup" && markupData?.organizationSetupCompleted) ||
                            (step.label === "Add employee" && markupData?.addEmployeeCompleted) ||
                            (step.label === "Schedule" && markupData?.scheduleCompleted)
                          }
                        >
                          <StepLabel>
                            <p className="m-0" style={{ fontSize: "18px", fontWeight: "400" }}>
                              {step.label} <IoIosArrowForward />
                            </p>
                            <p className="m-0" style={{ fontSize: "12px", fontWeight: "400" }}>
                              {step.description}
                            </p>
                          </StepLabel>
                          <a
                            className="completeHomebtn"
                            style={{
                              cursor: "pointer",
                              color:
                                getStepText(step.label) === "Completed" ? "#00D715" : "",
                            }}
                            onClick={() =>
                              getStepText(step.label) !== "Completed" &&
                              handleComplete(step.label, index)
                            }
                          >
                            {getStepText(step.label)}
                          </a>
                        </Step>
                      ))}
                    </Stepper>

                  </Box>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OrgSetup */}

      {isStepper.isorgSetup && (
        <>
          <section
            style={{
              height: "80vh",
              display: currentSection === 1 ? "block" : "none",
            }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "600px" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Upload the logo
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Organization Logo
                        </label>
                        <div
                          style={{
                            height: "95px",
                            borderStyle: "dotted",
                            borderRadius: "10px",
                          }}
                          onClick={handleClickUpload2}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <input
                            type="file"
                            name="OrganizationLogo"
                            accept=".png"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            ref={fileInputRef3}
                          />

                          <div style={{ cursor: "pointer" }}>
                            {company.OrganizationLogo ? (
                              <img
                                src={URL.createObjectURL(
                                  company.OrganizationLogo
                                )}
                                alt="Organization Logo"
                                style={{
                                  width: "150px",
                                  height: "auto",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <>
                                <div className="d-flex justify-content-center align-items-center">
                                  <IoCloudUploadOutline
                                    style={{ fontSize: "1.5rem" }}
                                  />
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                  <p
                                    className="pt-2"
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Click here to upload your .png logo{" "}
                                    <span
                                      style={{ color: "red", fontSize: "1rem" }}
                                    >
                                      *
                                    </span>
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => initialPage(1)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            {/* <a
                              className="skipbtn me-3"
                              onClick={() => setCurrentSection(2)}
                            >
                              Skip
                            </a> */}

                            <Button
                              disabled={!company.OrganizationLogo}
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(2)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ display: currentSection === 2 ? "block" : "none" }}>
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Enter the organization name <span style={{ color: "red" }}>*</span>
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Organization Name
                        </label>

                        <input
                          name="OrganizationName"
                          value={company.OrganizationName}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            height: "45px",
                            borderRadius: "10px",
                            border: "1px solid #000",
                          }}
                        />

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(1)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(3)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ display: currentSection === 3 ? "block" : "none" }}>
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Paster the website link (URL)
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Link
                        </label>

                        <input
                          style={{
                            width: "100%",
                            height: "45px",
                            borderRadius: "10px",
                            border: "1px solid #000",
                          }}
                          name="websiteLink"
                          value={company.websiteLink}
                          onChange={handleChange}
                        />

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(2)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <a
                              className="skipbtn me-3"
                              onClick={() => setCurrentSection(4)}
                            >
                              Skip
                            </a>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(4)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ display: currentSection === 4 ? "block" : "none" }}>
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Enter the organization address{" "}
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Organization Address  <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          style={{
                            width: "100%",
                            height: "45px",
                            borderRadius: "10px",
                            border: "1px solid #000",
                          }}
                          value={company.address.address}
                          onChange={(e) =>
                            setCompany({
                              ...company,
                              address: {
                                ...company.address,
                                address: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="pt-3 d-flex justify-content-between align-items-center">
                          <div>
                            <div>
                              <label className="pb-2">State <span style={{ color: "red" }}>*</span></label>
                            </div>
                            <Select
                              showSearch
                              style={{ width: 150, height: 43 }}
                              placeholder="Select a state"
                              onChange={handleStateChange}
                              options={states.map((state) => ({
                                value: state.isoCode,
                                label: state.name,
                              }))}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                            />
                          </div>
                          <div>
                            <div>
                              <label className="pb-2">City <span style={{ color: "red" }}>*</span></label>
                            </div>
                            <Select
                              showSearch
                              style={{ width: 150, height: 43 }}
                              placeholder="Select a city"
                              value={selectedCity || undefined}
                              onChange={handleCityChange}
                              disabled={!cities.length}
                              options={cities.map((city) => ({
                                value: city.name,
                                label: city.name,
                              }))}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                            />
                          </div>
                          <div>
                            <div>
                              <label className="pb-2">Pin code <span style={{ color: "red" }}>*</span></label>
                            </div>
                            <input
                              style={{
                                width: 150,
                                height: 43,
                                borderRadius: "10px",
                                border: "1px solid #000",
                              }}
                              value={company.address.pincode}
                              onChange={(e) =>
                                setCompany({
                                  ...company,
                                  address: {
                                    ...company.address,
                                    pincode: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(3)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(5)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 5 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Enter the Contact Information
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "auto" }}
                      className="logoboxupload py-2"
                    >
                      <div style={{ width: "70%" }}>
                        <div className="d-flex justify-content-between">
                          <div style={{ width: "50%", paddingRight: "10px" }}>
                            <label
                              className="d-block pb-2"
                              style={{ fontWeight: "400", fontSize: "0.9rem" }}
                            >
                              Contact no{" "}
                            </label>
                            <input
                              style={{
                                width: "100%",
                                height: "45px",
                                borderRadius: "8px",
                                border: "1px solid #000",
                              }}
                              value={company.contactInformation.contactNo}
                              onChange={(e) =>
                                setCompany({
                                  ...company,
                                  contactInformation: {
                                    ...company.contactInformation,
                                    contactNo: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div style={{ width: "50%", paddingLeft: "10px" }}>
                            <label
                              className="d-block pb-2"
                              style={{ fontWeight: "400", fontSize: "0.9rem" }}
                            >
                              Email id{" "}
                            </label>
                            <input
                              style={{
                                width: "100%",
                                height: "45px",
                                borderRadius: "8px",
                                border: "1px solid #000",
                              }}
                              value={company.contactInformation.emailId}
                              onChange={(e) =>
                                setCompany({
                                  ...company,
                                  contactInformation: {
                                    ...company.contactInformation,
                                    emailId: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(4)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(6)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 6 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Enter the Tax detail
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "auto" }}
                      className="logoboxupload py-2"
                    >
                      <div style={{ width: "70%" }}>
                        <div className="">
                          <label
                            className="d-block pt-2"
                            style={{ fontWeight: "400", fontSize: "0.9rem" }}
                          >
                            GST Number  <span style={{ color: "red" }}>*</span>{" "}
                          </label>
                          <input
                            style={{
                              width: "100%",
                              height: "45px",
                              borderRadius: "8px",
                              border: "1px solid #000",
                            }}
                            value={company.taxDetails.gstNo}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                taxDetails: {
                                  ...company.taxDetails,
                                  gstNo: e.target.value,
                                },
                              })
                            }
                          />
                          <label
                            className="d-block pt-2"
                            style={{ fontWeight: "400", fontSize: "0.9rem" }}
                          >
                            TAN{" "}
                          </label>
                          <input
                            style={{
                              width: "100%",
                              height: "45px",
                              borderRadius: "8px",
                              border: "1px solid #000",
                            }}
                            value={company.taxDetails.tan}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                taxDetails: {
                                  ...company.taxDetails,
                                  tan: e.target.value,
                                },
                              })
                            }
                          />
                          <label
                            className="d-block pt-2"
                            style={{ fontWeight: "400", fontSize: "0.9rem" }}
                          >
                            PAN{" "}
                          </label>
                          <input
                            style={{
                              width: "100%",
                              height: "45px",
                              borderRadius: "8px",
                              border: "1px solid #000",
                            }}
                            value={company.taxDetails.pan}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                taxDetails: {
                                  ...company.taxDetails,
                                  pan: e.target.value,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(5)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(7)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 7 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Enter all your branch of your organization
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Branch
                        </label>

                        <TagsInput value={tags} onChange={handleChangeTag} />

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(6)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <span
                              onClick={() => setCurrentSection(8)}
                              className="me-3 skipbtn"
                            >
                              Skip
                            </span>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(8)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 8 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Select the industries types  <span style={{ color: "red" }}>*</span>
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "auto" }}
                      className="logoboxupload py-2"
                    >
                      <div style={{ width: "70%" }}>
                        <div className="itemsList">
                          <>
                            {industryArray.map((val, i) => (
                              <div
                                key={i}
                                style={{
                                  border: "1px solid black",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  padding: "10px 20px",
                                  borderRadius: "10px",
                                  color: `${colorValue === i ? "#fff" : ""}`,
                                  background: `${colorValue === i ? "#1784A2" : ""
                                    }`,
                                  borderColor: `${colorValue === i ? "#1784A2" : ""
                                    }`,
                                }}
                                onClick={() => handleColor(val, i)}
                              >
                                <span style={{ fontWeight: 600 }}>{val}</span>
                              </div>
                            ))}
                          </>

                          <div
                            onClick={handleShow}
                            style={{
                              border: "1px solid black",
                              display: "inline-block",
                              cursor: "pointer",
                              borderRadius: "10px",
                              padding: "10px 20px",
                            }}
                          >
                            <AddIcon className="me-2" />
                            <span>Add new</span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(7)}
                            >
                              Back
                            </a>
                          </div>
                          {company.industry && (
                            <div>
                              <Button
                                variant="contained"
                                className="nextBtn"
                                onClick={() => handleNavsubIndustry()}
                              >
                                Next
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add industry</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <TextField id="standard-basic" label="Code" variant="standard" style={{width:"100%"}} onChange={(e)=>setaddindustryData({...addindustryData,industryTypeCode:e.target.value})}/> */}
                {/* <TextField id="standard-basic" label="State" variant="standard" style={{width:"100%"}} onChange={(e)=>setaddindustryData({...addindustryData,industryTypeState:e.target.value})}/> */}
                <TextField
                  id="standard-basic"
                  label="Name"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={newIndustry}
                  onChange={(e) => setnewIndustry(e.target.value)}
                />
                {/* <TextField id="standard-basic" label="Country" variant="standard" style={{width:"100%"}} onChange={(e)=>setaddindustryData({...addindustryData,industryTypeCountry:e.target.value})}/> */}
              </Modal.Body>
              <Modal.Footer className="text-center justify-content-center">
                <Button
                  variant="contained"
                  className="nextBtn"
                  onClick={handleCreateClose}
                >
                  Create
                </Button>
              </Modal.Footer>
            </Modal>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 9 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Select the sub industries types  <span style={{ color: "red" }}>*</span>
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "auto" }}
                      className="logoboxupload py-2"
                    >
                      <div style={{ width: "70%" }}>
                        <div className="itemsList">
                          <>
                            {subindustryData.map((val, i) => (
                              <div
                                key={i}
                                style={{
                                  border: "1px solid black",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  padding: "10px 20px",
                                  borderRadius: "10px",
                                  color: selectedIndices.includes(i)
                                    ? "#fff"
                                    : "",
                                  background: selectedIndices.includes(i)
                                    ? "#1784A2"
                                    : "",
                                  borderColor: selectedIndices.includes(i)
                                    ? "#1784A2"
                                    : "",
                                }}
                                onClick={() => handlesubColor(val, i)}
                              >
                                <span style={{ fontWeight: 600 }}>{val}</span>
                              </div>
                            ))}
                          </>

                          <div
                            onClick={handlesubShow}
                            style={{
                              border: "1px solid black",
                              display: "inline-block",
                              cursor: "pointer",
                              padding: "10px 20px",
                              borderRadius: "10px",
                            }}
                          >
                            <AddIcon className="me-2" />
                            <span>Add new</span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(8)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(10)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Modal show={subShow} onHide={handlesubClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add sub industry</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <TextField id="standard-basic" label="Code" variant="standard" style={{width:"100%"}} onChange={(e)=>setaddindustryData({...addindustryData,industryTypeCode:e.target.value})}/> */}
                {/* <TextField id="standard-basic" label="State" variant="standard" style={{width:"100%"}} onChange={(e)=>setaddindustryData({...addindustryData,industryTypeState:e.target.value})}/> */}
                {/* <TextField
                  id="standard-basic"
                  label="Name"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={addsubIndustry}
                  
                /> */}
                <TagsInput
                  value={addsubIndustry}
                  onChange={handleSubChangeTag}
                />
                {/* <TextField id="standard-basic" label="Country" variant="standard" style={{width:"100%"}} onChange={(e)=>setaddindustryData({...addindustryData,industryTypeCountry:e.target.value})}/> */}
              </Modal.Body>
              <Modal.Footer className="text-center justify-content-center">
                <Button
                  variant="contained"
                  className="nextBtn"
                  onClick={handlesubCreateClose}
                >
                  Create
                </Button>
              </Modal.Footer>
            </Modal>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 10 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Enter all your department of your organization
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Department (Eg: Hr dep , accounts dept ) <span style={{ color: "red" }}>*</span>
                        </label>
                        <TagsInput
                          value={company.departments}
                          onChange={(val: any) =>
                            setCompany({ ...company, departments: val })
                          }
                        />

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(9)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            {/* onClick={handleOrgSubmit} */}
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(11)}
                            >
                              {" "}
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 11 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Payroll dates
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Payment type <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex justify-content-start align-items-center">
                          <input
                            type="radio"
                            name="payment"
                            value="Bi-Weekly"
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                payroll: {
                                  ...company.payroll,
                                  payrollType: "Bi-Weekly",
                                },
                              })
                            }
                            className="checkbox-custom"
                          />

                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              marginRight: "1rem",
                            }}
                          >
                            Biweekly
                          </span>
                          <input
                            type="radio"
                            name="payment"
                            value="Monthly"
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                payroll: {
                                  ...company.payroll,
                                  payrollType: "Monthly",
                                },
                              })
                            }
                            className="checkbox-custom"
                          />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>
                            Monthly
                          </span>
                        </div>
                        <div className="pt-3">
                          <label
                            className="d-block pb-2"
                            style={{ fontWeight: "400", fontSize: "0.9rem" }}
                          >
                            Payroll dates <span style={{ color: "red" }}>*</span>
                          </label>
                          <div className="d-flex justify-content-between align-items-center">

                            {/* Start Date */}
                            <select
                              style={{ width: "49%", height: "45px", borderRadius: "8px" }}
                              value={payrollDates.Startdate.getDate()} // show current day
                              onChange={(e) =>
                                setPayrollDates({
                                  ...payrollDates,
                                  Startdate: new Date(
                                    payrollDates.Startdate.setDate(parseInt(e.target.value))
                                  ),
                                })
                              }
                            >
                              {[...Array(30)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>

                            {/* End Date */}
                            <select
                              style={{ width: "49%", height: "45px", borderRadius: "8px" }}
                              value={payrollDates.Enddate.getDate()} // show current day
                              onChange={(e) =>
                                setPayrollDates({
                                  ...payrollDates,
                                  Enddate: new Date(
                                    payrollDates.Enddate.setDate(parseInt(e.target.value))
                                  ),
                                })
                              }
                            >
                              {[...Array(30)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>

                          </div>

                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(10)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            {/* onClick={handleOrgSubmit} */}
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(12)}
                            >
                              {" "}
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 12 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Leave setup
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "auto" }}
                      className="logoboxupload py-3"
                    >
                      <div style={{ width: "70%" }}>
                        <div>
                          {forms.map((form, index) => (
                            <div
                              className="d-flex justify-content-between"
                              key={index}
                              style={{ marginBottom: "1rem" }}
                            >
                              <div>
                                <label
                                  className="d-block pb-2"
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Leave Categories <span style={{ color: "red" }}>*</span>
                                </label>
                                <Select
                                  style={{ width: 200 }}
                                  value={form.categoryName}
                                  onChange={(value) =>
                                    handleFormChange(
                                      index,
                                      "categoryName",
                                      value
                                    )
                                  }
                                  options={[
                                    {
                                      value: "Sick Leave (SL)",
                                      label: "Sick Leave (SL)",
                                    },
                                    {
                                      value: "Casual Leave (CL)",
                                      label: "Casual Leave (CL)",
                                    },
                                    {
                                      value: "Marriage Leave (ML)",
                                      label: "Marriage Leave (ML)",
                                    },
                                    {
                                      value: "Maternity Leave (ML)",
                                      label: "Maternity Leave (ML)",
                                    },
                                    {
                                      value: "Paternity Leave (PL)",
                                      label: "Paternity Leave (PL)",
                                    },
                                    {
                                      value: "Compensatory Leave (PL)",
                                      label: "Compensatory Leave (PL)",
                                    },
                                  ]}
                                />
                              </div>
                              <div className="mx-2">
                                <label
                                  className="d-block pb-2"
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Total days <span style={{ color: "red" }}>*</span>
                                </label>
                                <InputNumber
                                  type="number"
                                  id="small-input"
                                  min={1}
                                  value={form.TotalDays}
                                  onChange={(value) =>
                                    handleFormChange(index, "TotalDays", value)
                                  }
                                />
                              </div>
                              <div>
                                <label
                                  className="d-block pb-2"
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Total no of days in month <span style={{ color: "red" }}>*</span>
                                </label>
                                <InputNumber
                                  type="number"
                                  min={1}
                                  max={31}
                                  value={form.ToatalDaysInMonths}
                                  onChange={(value) =>
                                    handleFormChange(
                                      index,
                                      "ToatalDaysInMonths",
                                      value
                                    )
                                  }
                                  style={{ width: 200 }}
                                />
                              </div>
                            </div>
                          ))}
                          <div className="text-end">
                            <a
                              onClick={addForm}
                              style={{
                                cursor: "pointer",
                                fontSize: "12px",
                                color: "#666666",
                              }}
                            >
                              <IoAddCircleOutline />
                              You can add the another
                            </a>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(11)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={() => setCurrentSection(13)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 13 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Attendance location
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "auto" }}
                      className="logoboxupload py-3"
                    >
                      <div style={{ width: "70%" }}>
                        {company.branches.map((val, i) => (
                          <>
                            <label
                              className="d-block pb-2"
                              style={{ fontWeight: "400", fontSize: "0.9rem" }}
                            >
                              {val} Branch
                            </label>
                            <div className="d-flex justify-content-between">
                              <div style={{ width: "49%" }}>
                                <label
                                  className="d-block pb-2"
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Enter location
                                </label>
                                <input
                                  type="text"
                                  style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    height: "45px",
                                  }}
                                  value={
                                    company.attendanceLocation[i]?.location ||
                                    ""
                                  } // Bind the input value
                                  onChange={(e) =>
                                    handleInputChange(
                                      i,
                                      "location",
                                      e.target.value
                                    )
                                  } // Call handleInputChange
                                />
                              </div>
                              <div style={{ width: "49%" }}>
                                <label
                                  className="d-block pb-2"
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Enter range
                                </label>

                                <input
                                  type="number"
                                  min={0}
                                  style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    height: "45px",
                                  }}
                                  value={
                                    company.attendanceLocation[i]?.range || 0
                                  } // Bind the input value
                                  onChange={(e) =>
                                    handleInputChange(
                                      i,
                                      "range",
                                      Number(e.target.value)
                                    )
                                  } // Call handleInputChange
                                />
                              </div>
                            </div>
                          </>
                        ))}
                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(12)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <span
                              onClick={() => setCurrentSection(14)}
                              className="me-3 skipbtn"
                            >
                              Skip
                            </span>

                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={postCompanyDetails}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 14 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Complete your setup
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "304px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            style={{
                              width: "230px",
                              height: "73px",
                              border: "1px solid black",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!company.businessLicenseCompleted) {
                                setCurrentSection(16);
                              }
                            }}
                            className="d-flex justify-content-between align-items-center p-3"
                          >
                            <p
                              className="mb-0"
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              Business license{" "}
                            </p>
                            {company.businessDocuments || company.businessLicenseCompleted ? <CheckCircleIcon
                              style={{ fontSize: "2rem", color: "#00DD09" }}
                            /> :
                              <FaRegNewspaper
                                style={{ fontSize: "2rem" }}
                                className={`${company.businessLicenseCompleted &&
                                  "orgsetupColor"
                                  }`}
                              />}
                          </div>
                          <div
                            style={{
                              width: "230px",
                              height: "73px",
                              border: "1px solid black",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!company.signatureDocumentCompleted) {
                                setCurrentSection(17);
                              }
                            }}
                            className="d-flex justify-content-between align-items-center p-3"
                          >
                            <p
                              className="mb-0"
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              Signature document
                            </p>
                            {company?.signatureDocuments?.signatureForm16Document && company?.signatureDocuments?.signatureStampDocument || company.signatureDocumentCompleted ? <CheckCircleIcon
                              style={{ fontSize: "2rem", color: "#00DD09" }}
                            /> :
                              <IoFingerPrintSharp
                                style={{ fontSize: "2rem" }}
                                className={`${company.signatureDocumentCompleted &&
                                  "orgsetupColor"
                                  }`}
                              />}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div
                            style={{
                              width: "230px",
                              height: "73px",
                              border: "1px solid black",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!company.bankDetailsCompleted) {
                                setCurrentSection(18);
                              }
                            }}
                            className="d-flex justify-content-between align-items-center p-3"
                          >
                            <p
                              className="mb-0"
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              Bank detail{" "}
                            </p>
                            {company.bankDetails.IFSCCode && company.bankDetails.accountHolderName && company.bankDetails.accountNumber || company.bankDetailsCompleted ? <CheckCircleIcon
                              style={{ fontSize: "2rem", color: "#00DD09" }}
                            /> :
                              <PiBankFill
                                style={{ fontSize: "2rem" }}
                                className={`${company.bankDetailsCompleted && "orgsetupColor"
                                  }`}
                              />}
                          </div>
                          <div
                            style={{
                              width: "230px",
                              height: "73px",
                              border: "1px solid black",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!company.companyDetailsCompleted) {
                                setCurrentSection(15);
                              }
                            }}
                            className="d-flex justify-content-between align-items-center p-3"
                          >
                            <p
                              className="mb-0"
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              Basic detail{" "}
                            </p>
                            <CheckCircleIcon
                              style={{ fontSize: "2rem", color: "#00DD09" }}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(13)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <a
                              className="skipbtn me-3"
                              onClick={handleLastSkip}
                            >
                              Skip
                            </a>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={handleLastDone}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 16 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Upload the documents
                  </h6>
                  <div>
                    <div className="logoboxupload">
                      <div className="py-3" style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Business document
                        </label>

                        <div
                          style={{
                            height: "95px",
                            borderStyle: "dotted",
                            borderRadius: "10px",
                          }}
                          onClick={handleClickUpload}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <input
                            type="file"
                            name="businessDocuments"
                            accept=".png, .jpg, .jpeg, .gif, .pdf"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />

                          <div style={{ cursor: "pointer" }}>
                            {company.businessDocuments ? (
                              <>
                                <p style={{ color: "green" }}>Updated documents</p>
                              </>
                            ) : (
                              <>
                                <div className="d-flex justify-content-center align-items-center">
                                  <IoCloudUploadOutline
                                    style={{ fontSize: "1.5rem" }}
                                  />
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                  <p
                                    className="pt-2"
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Click here to upload{" "}
                                    <span
                                      style={{ color: "red", fontSize: "1rem" }}
                                    >
                                      *
                                    </span>
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(14)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={handleBusinessdocupload}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 17 ? "block" : "none" }}
          >
            <div
              style={{ width: "100%", height: "80vh" }}
              className="d-flex justify-content-center align-items-center row m-0"
            >
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Upload the signature documents
                  </h6>
                  <div>
                    <div className="logoboxupload">
                      <div className="py-3" style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Signature stamp / signature document
                        </label>

                        <div
                          style={{
                            height: "95px",
                            borderStyle: "dotted",
                            borderRadius: "10px",
                          }}
                          //  onClick={handleClickUpload2}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <input
                            type="file"
                            accept=".png, .jpg, .jpeg,.pdf"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleFileChange2(e, "signatureStampDocument")
                            }
                            ref={fileInputRef1}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => fileInputRef1.current?.click()}
                          >
                            {company.signatureDocuments
                              .signatureStampDocument ? (
                              <>
                                <p style={{ color: "green" }}>File updated</p>
                              </>
                            ) : (
                              <>
                                <div className="d-flex justify-content-center align-items-center">
                                  <IoCloudUploadOutline
                                    style={{ fontSize: "1.5rem" }}
                                  />
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                  <p
                                    className="pt-2"
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Upload at size of 250x250 pixel and maximum
                                    size of 1MB
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <label
                          className="d-block py-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Signature Form16 signature document (Within India)
                        </label>

                        <div
                          style={{
                            height: "95px",
                            borderStyle: "dotted",
                            borderRadius: "10px",
                          }}
                          //  onClick={handleClickUpload2}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <input
                            type="file"
                            accept=".png, .jpg, .jpeg, .pdf"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleFileChange2(e, "signatureForm16Document")
                            }
                            ref={fileInputRef2}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => fileInputRef2.current?.click()}
                          >
                            {company.signatureDocuments
                              .signatureForm16Document ? (
                              <>
                                <p style={{ color: "green" }}>File updated</p>
                              </>
                            ) : (
                              <>
                                <div className="d-flex justify-content-center align-items-center">
                                  <IoCloudUploadOutline
                                    style={{ fontSize: "1.5rem" }}
                                  />
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                  <p
                                    className="pt-2"
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Upload at size of 250x250 pixel and maximum
                                    size of 1MB
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(14)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={handlesignatureDocuments}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="pb-5"
            style={{ display: currentSection === 18 ? "block" : "none" }}
          >
            <div className="row m-0">
              <div className="col-lg-12 d-flex justify-content-center align-items-center">
                <div style={{ width: "58%" }}>
                  <h6
                    style={{
                      paddingBottom: "0.6rem",
                      paddingTop: "0.6rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Bank Detail{" "}
                  </h6>
                  <div>
                    <div
                      style={{ width: "100%", height: "458px" }}
                      className="logoboxupload"
                    >
                      <div style={{ width: "70%" }}>
                        <label
                          className="d-block pb-2"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Account holder Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          style={{
                            width: "100%",
                            height: "45px",
                            borderRadius: "8px",
                            border: "1px solid #000",
                          }}
                          value={company.bankDetails.accountHolderName}
                          onChange={(e) =>
                            setCompany((prevCompany) => ({
                              ...prevCompany,
                              bankDetails: {
                                ...prevCompany.bankDetails,
                                accountHolderName: e.target.value,
                              },
                            }))
                          }
                        />

                        <label
                          className="d-block pb-2 pt-3"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          Account Number <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          style={{
                            width: "100%",
                            height: "45px",
                            borderRadius: "8px",
                            border: "1px solid #000",
                          }}
                          value={company.bankDetails.accountNumber}
                          onChange={(e) =>
                            setCompany((prevCompany) => ({
                              ...prevCompany,
                              bankDetails: {
                                ...prevCompany.bankDetails,
                                accountNumber: Number(e.target.value),
                              },
                            }))
                          }
                        />
                        <label
                          className="d-block pb-2 pt-3"
                          style={{ fontWeight: "400", fontSize: "0.9rem" }}
                        >
                          IFSC Code <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          style={{
                            width: "100%",
                            height: "45px",
                            borderRadius: "8px",
                            border: "1px solid #000",
                          }}
                          value={company.bankDetails.IFSCCode}
                          onChange={(e) =>
                            setCompany((prevCompany) => ({
                              ...prevCompany,
                              bankDetails: {
                                ...prevCompany.bankDetails,
                                IFSCCode: e.target.value,
                              },
                            }))
                          }
                        />
                        <div className="d-flex justify-content-between align-items-center pt-5">
                          <div>
                            <a
                              className="skipbtn"
                              onClick={() => setCurrentSection(14)}
                            >
                              Back
                            </a>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className="nextBtn"
                              onClick={handleBankdetail}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Add employee */}

      <>
        {isStepper.isAddemployee && (
          <>
            <section>
              <Container>
                <Schedule />
              </Container>
            </section>
          </>
        )}
      </>

      {/* Schedule */}

      {isStepper.isSchedule && (
        <>
          <div className="pt-3">
            <Container>
              <h3
                style={{ fontSize: "20px", fontWeight: 600, color: "#353535" }}
              >
                Team
              </h3>
            </Container>
            <hr className="mt-1" />
          </div>
          <Team />
        </>
      )}
    </>
  );
};

export default HomeMain;
