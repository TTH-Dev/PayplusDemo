import { Button } from "@mui/material";
import {
  DatePicker,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  TimePicker,
  Upload,
  UploadProps,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { API_URL } from "../config";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import moment from "moment";

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
    Startdate: string;
    Enddate: string;
  };
}
interface ICompany {
  OrganizationLogo: File | null;
  OrganizationName: string;
  websiteLink?: string;
  address: IAddress;
  contactInformation: IContact;
  taxDetails: ITaxDetails;
  branches: string[];
  industry: string;
  Currency: string;
  subIndustry: string[];
  departments: string[];
  payroll: IPayroll;
  Form16ResponsibleUser: string;
  BusinessOwnerName: string;
  leavesetup: ILeaveSetup[];
  businessDocuments: File | null;
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

const props: UploadProps = {
  onChange({ file, fileList }) {
    if (file.status !== "uploading") {
      console.log(file, fileList);
    }
  },
};

const { Option } = Select;

const OrganizationDetails = () => {
  const [input, setInput] = useState<number[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [imagePreview, setImagePreview] = useState({
    OrganizationLogoprview: "",
    businessDocumentspreview: "",
    signatureStampDocumentpreview: "",
    signatureForm16Documentpreview: "",
  });
  const [ogData, setogData] = useState<ICompany>({
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
    Currency: "INR",
    Form16ResponsibleUser: "",
    BusinessOwnerName: "",
    branches: [],
    industry: "",
    subIndustry: [],
    departments: [],
    payroll: {
      payrollType: "Monthly",
      payrollDates: {
        Startdate: "",
        Enddate: "",
      },
    },
    leavesetup: [
      {
        categoryName: "",
        TotalDays: 0,
        ToatalDaysInMonths: 0,
      },
    ],
    businessDocuments: null,
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

  const handleImageChangeForSignature = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setogData((prev) => ({
        ...prev,
        signatureDocuments: {
          ...prev.signatureDocuments, // Preserve other fields
          signatureStampDocument: file, // Update the specific document
        },
      }));
      setImagePreview((prev) => ({
        ...prev,
        signatureStampDocumentpreview: URL.createObjectURL(file), // Update the specific document
      }));
    }
  };

  const handleImageChangeForSignatureform = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setogData((prev) => ({
        ...prev,
        signatureDocuments: {
          ...prev.signatureDocuments, // Preserve other fields
          signatureForm16Document: file, // Update the specific document
        },
      }));
      setImagePreview((prev) => ({
        ...prev,
        signatureForm16Documentpreview: URL.createObjectURL(file), // Update the specific document
      }));
    }
  };

  const handleImageChangeOgLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setogData((prev) => ({
        ...prev,
        OrganizationLogo: file, // Update the specific document
      }));
      setImagePreview((prev) => ({
        ...prev,
        OrganizationLogoprview: URL.createObjectURL(file), // Update the specific document
      }));
    }
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setogData((prev) => ({
        ...prev,
        businessDocuments: file, // Update the specific document
      }));
      setImagePreview((prev) => ({
        ...prev,
        businessDocumentspreview: URL.createObjectURL(file), // Update the specific document
      }));
    }
  };

  const handleButtonClick = (value:any) => {
    if(value=="signatureform16") {
      document.getElementById('signatureform16fileInput')?.click();
    }
    if(value=="signaturestamp") {
      document.getElementById('signaturestampfileInput')?.click();
    }
    if(value=="oranizationLogo") {
      document.getElementById('oranizationLogofileInput')?.click();
    }
    if(value=="business") {
      document.getElementById('businessfileInput')?.click();
    }
    
  };
  const handleaadInput = () => {
    setInput([...input, 0]);
  };

  const getCompany = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setogData(res.data.data);
    } catch (error: any) {
      console.log(error);
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

      setCompanyId(res.data.companyId);
      getCompany(res.data.companyId);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleTagsChangeInternal = (newTags: string[]) => {
    setogData((prevData) => ({
      ...prevData,
      branches: newTags,
    }));
  };

  const handleSubIndustryChangeInternal = (newTags: string[]) => {
    setogData((prevData) => ({
      ...prevData,
      subIndustry: newTags,
    }));
  };
  const handleDepartmentChangeInternal = (newTags: string[]) => {
    setogData((prevData) => ({
      ...prevData,
      departments: newTags,
    }));
  };
  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: string,
    nestedField?: string
  ) => {
    const { value } = e.target;

    setogData((prevData: any) => {
      if (nestedField) {
        return {
          ...prevData,
          [field]: {
            ...prevData[field],
            [nestedField]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [field]: value,
        };
      }
    });
  };

  const handleTagsChange = (tags: any) => {
    setogData((prev: any) => ({ ...prev, subIndustry: tags }));
  };

  const editCompanyDetails = async () => {
    const token = localStorage.getItem("authtoken");

    console.log(ogData, "ogData");

    const formData = new FormData();

    formData.append("OrganizationName", ogData.OrganizationName);
    formData.append("websiteLink", ogData.websiteLink || "");
    formData.append("industry", ogData.industry);

    ogData.subIndustry.forEach((subIndustry, i) => {
      formData.append(`subIndustry[${i}]`, subIndustry);
    })
    ogData.departments.forEach((department, i) => {
      formData.append(`departments[${i}]`, department);
    });
    ogData.branches.forEach((branches, i) => {
      formData.append(`branches[${i}]`, branches);
    });
    formData.append("address[address]", ogData.address.address);
    formData.append("address[state]", ogData.address.state);
    formData.append("address[city]", ogData.address.city);
    formData.append("address[pincode]", ogData.address.pincode);

    const startDate = moment(
      ogData.payroll.payrollDates.Startdate,
      "DD-MM-YYYY"
    );
    if (startDate.isValid()) {
      formData.append(
        "payroll[payrollDates][Startdate]",
        startDate.toISOString()
      );
    } else {
      console.error("Invalid start date format");
    }

    const endDate = moment(ogData.payroll.payrollDates.Enddate, "DD-MM-YYYY");
    if (endDate.isValid()) {
      formData.append("payroll[payrollDates][Enddate]", endDate.toISOString());
    } else {
      console.error("Invalid start date format");
    }

    formData.append("payroll[payrollType]", ogData.payroll.payrollType);

    formData.append(
      "contactInformation[contactNo]",
      ogData.contactInformation.contactNo || ""
    );
    formData.append(
      "contactInformation[emailId]",
      ogData.contactInformation.emailId || ""
    );

    // Add tax details
    formData.append("taxDetails[gstNo]", ogData.taxDetails.gstNo);
    formData.append("taxDetails[tan]", ogData.taxDetails.tan);
    formData.append("taxDetails[pan]", ogData.taxDetails.pan);

    // Handle the `leavesetup` array
    ogData.leavesetup.forEach((leave, index) => {
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
    formData.append("BusinessOwnerName", ogData?.BusinessOwnerName);
    // Adding other fields as empty strings or based on your data
    formData.append("Currency", ogData.Currency);
    formData.append("Form16ResponsibleUser", ogData?.Form16ResponsibleUser);
    if (ogData.businessDocuments) {
      formData.append("businessDocuments", ogData?.businessDocuments);
    }
    if (ogData.OrganizationLogo) {
      formData.append("OrganizationLogo", ogData?.OrganizationLogo);
    }
    if (ogData.signatureDocuments.signatureForm16Document) {
      formData.append("signatureForm16Document", ogData?.signatureDocuments.signatureForm16Document);
    }
    if (ogData.signatureDocuments.signatureStampDocument) {
      formData.append("signatureStampDocument", ogData?.signatureDocuments.signatureStampDocument);
    }

    try {
      console.log(ogData, "ogDatacompanyId");

      const res = await axios.patch(
        `${API_URL}/api/company/${companyId}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Company details updated successfully");
      setImagePreview((prev) => ({
        ...prev,
        OrganizationLogoprview: "", 
        signatureForm16Documentpreview: "",
        signatureStampDocumentpreview: "",
        businessDocumentspreview: ""
      }));
    } catch (error: any) {
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <div className="pt-3">
        <Container>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#353535",
              cursor: "pointer",
            }}
          >
            Organization Detail
          </span>
        </Container>
        <hr className="mt-1" />
      </div>
      <div>
        <Container>
          <div className="row">
            <div className="col-lg-6">
              <p
                className=""
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Company Details
              </p>
              <div>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Organization Logo
                </label>
                <br />
                {ogData?.OrganizationLogo ? (
                  <>
                    <img
                      style={{ width: "150px" }}
                      className="img-fluid py-2"
                      src={imagePreview.OrganizationLogoprview || `${API_URL}/public/images/${ogData?.OrganizationLogo}`}
                    />
                    <br />
                  </>
                ) : (
                  <Button
                  onClick={() => handleButtonClick("oranizationLogo")}
                  variant="contained"
                    style={{
                      background: "#1784A2",
                      borderRadius: "10px",
                      width: "120px",
                    }}
                  >
                    <input
                      type="file"
                      id="oranizationLogofileInput"
                      style={{ display: 'none' }}
                      onChange={handleImageChangeOgLogo}
                    />
                    Upload
                  </Button>
                )}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Organization Name
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.OrganizationName}
                  onChange={(e) => onChange(e, "OrganizationName")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Organization Address
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.address?.address}
                  onChange={(e) => onChange(e, "address", "address")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  City
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.address?.city}
                  onChange={(e) => onChange(e, "address", "city")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Org Contact Number
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.contactInformation?.contactNo}
                  onChange={(e) =>
                    onChange(e, "contactInformation", "contactNo")
                  }
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  GST Number
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.taxDetails?.gstNo}
                  onChange={(e) => onChange(e, "taxDetails", "gstNo")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  TAN
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.taxDetails?.tan}
                  onChange={(e) => onChange(e, "taxDetails", "tan")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Form 16 Signature
                </label>
                <br />
                {ogData?.signatureDocuments?.signatureForm16Document ? (
                  <>
                    <a
                      style={{ color: "#1784A2" }}
                      href={imagePreview.signatureForm16Documentpreview || `${API_URL}/public/images/${ogData.signatureDocuments.signatureForm16Document}`}
                    >
                      {" "}
                      Form 16 Signature file
                    </a>
                    <br />
                  </>
                ) : (
                  <>
                    <Button
                  onClick={() => handleButtonClick("signatureform16")}
                  variant="contained"
                      style={{
                        background: "#1784A2",
                        borderRadius: "10px",
                        width: "120px",
                      }}
                    >
                      <input
                        type="file"
                        id="signatureform16fileInput"
                        style={{ display: 'none' }}
                        onChange={handleImageChangeForSignatureform}
                      />
                      Upload
                    </Button>
                    <br />
                  </>
                )}
                {/* <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  No of branches
                </label>
                <br />
                <InputNumber
                  className="inp-org"
                  min={0}
                  style={{ width: "480px", height: "40px" }}
                  value={ogData?.branches.length}
                />{" "}
                <br /> */}
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Currency
                </label>
                <br />
                <Input
                  placeholder="Currency"
                  prefix={"₹"}
                  className="inp-org"
                  value={ogData?.Currency || ""}
                  onChange={(e) => onChange(e, "Currency")}
                />

                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Industries (Sub Categories)
                </label>
                <br />
                <TagsInput
                  value={ogData?.subIndustry || []}
                  onChange={handleSubIndustryChangeInternal}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Website Link(URL)
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.websiteLink}
                  onChange={(e) => onChange(e, "websiteLink")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  State
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.address?.state}
                  onChange={(e) => onChange(e, "address", "state")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Pincode
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.address?.pincode}
                  onChange={(e) => onChange(e, "address", "pincode")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Org Email Id
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.contactInformation?.emailId}
                  onChange={(e) => onChange(e, "contactInformation", "emailId")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  PAN Number
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.taxDetails?.pan}
                  onChange={(e) => onChange(e, "taxDetails", "pan")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Salary Stamp/Signature
                </label>
                <br />
                {ogData?.signatureDocuments?.signatureStampDocument ? (
                  <>
                    <a
                      style={{ color: "#1784A2" }}
                      href={imagePreview.signatureStampDocumentpreview || `${API_URL}/public/images/${ogData.signatureDocuments.signatureStampDocument}`}
                    >
                      {" "}
                      Salary Stamp/Signature file
                    </a>
                    <br />
                  </>
                ) : (
                  <>
                    <Button
                  onClick={() => handleButtonClick("signaturestamp")}
                  variant="contained"
                      style={{
                        background: "#1784A2",
                        borderRadius: "10px",
                        width: "120px",
                      }}
                    >
                      <input
                        type="file"
                        id="signaturestampfileInput"
                        style={{ display: 'none' }}
                        onChange={handleImageChangeForSignature}
                      />
                      Upload
                    </Button>
                    <br />
                  </>
                )}
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Form16 Responsible User
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={ogData?.Form16ResponsibleUser || ""}
                  onChange={(e) => onChange(e, "Form16ResponsibleUser")}
                />{" "}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Branch Name
                </label>
                <br />
                <TagsInput
                  value={ogData?.branches || []}
                  onChange={handleTagsChangeInternal}
                />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Industires
                </label>
                <br />
                <Input className="inp-org" value={ogData?.industry} />
                <br />
                <label
                  className="py-2"
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Department (Add all department of your organization){" "}
                </label>
                <br />
                <TagsInput
                  value={ogData?.departments || []}
                  onChange={handleDepartmentChangeInternal}
                />{" "}
                <br />
              </div>
            </div>
            <p
              className="pt-2"
              style={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Payment method
            </p>
            <div className="col-lg-6">
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Payment type
              </label>
              <br />
              <Radio.Group
                value={ogData?.payroll?.payrollType}
                onChange={(e) =>
                  setogData({
                    ...ogData,
                    payroll: {
                      ...ogData.payroll,
                      payrollType: e.target.value,
                    },
                  })
                }
              >
                <Radio value={"Bi-Weekly"}>Bi-weekly</Radio>
                <Radio value={"Monthly"}>Monthly</Radio>
              </Radio.Group>
            </div>
            <div className="col-lg-6">
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Payroll dates
              </label>{" "}
              <br />
              <div className="d-flex">
                <div>
                  <label
                    className="py-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Start Date
                  </label>{" "}
                  <br />
                  <DatePicker
                    className="date-input"
                    format="DD-MM-YYYY"
                    style={{ marginRight: 22 }}
                    placeholder="Enter the Start Date"
                    value={
                      ogData?.payroll?.payrollDates?.Startdate
                        ? moment(ogData.payroll.payrollDates.Startdate, "DD-MM-YYYY")
                        : null
                    }
                    onChange={(date) => {
                      if (date) {
                        setogData({
                          ...ogData,
                          payroll: {
                            ...ogData?.payroll,
                            payrollDates: {
                              ...ogData?.payroll?.payrollDates,
                              Startdate: date.format("DD-MM-YYYY"),
                            },
                          },
                        });
                        message.success(
                          `Selected Start Date: ${date.format("DD-MM-YYYY")}`
                        );
                      }
                    }}
                  />
                </div>
                <div>
                  <label
                    className="py-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    End Date
                  </label>{" "}
                  <br />
                  <DatePicker
                    className="date-input"
                    format="DD-MM-YYYY"
                    style={{ marginRight: 22 }}
                    placeholder="Enter the End Date"
                    value={
                      ogData?.payroll?.payrollDates?.Enddate
                        ? moment(ogData.payroll.payrollDates.Enddate, "DD-MM-YYYY")
                        : null
                    }
                    onChange={(date) => {
                      if (date) {
                        setogData({
                          ...ogData,
                          payroll: {
                            ...ogData?.payroll,
                            payrollDates: {
                              ...ogData?.payroll?.payrollDates,
                              Enddate: date.format("DD-MM-YYYY"),
                            },
                          },
                        });
                        message.success(
                          `Selected Start Date: ${date.format("DD-MM-YYYY")}`
                        );
                      }
                    }}
                  />



                </div>
              </div>
            </div>
          </div>
          <p
            className="pt-3"
            style={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Leave Setup
          </p>

          {ogData?.leavesetup.map((val: any, i: any) => (
            <div className=" my-3" key={i}>
              <div >
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Leave Categories
                </label>
                <br />
                <Select
                  style={{ width: 450, height: 40 }}
                  placeholder="Select an option"
                  value={val.categoryName} // Access value from the current item
                  onChange={(value) => {
                    const updatedLeaveSetup = [...ogData.leavesetup];
                    updatedLeaveSetup[i].categoryName = value;
                    setogData({ ...ogData, leavesetup: updatedLeaveSetup });
                  }}
                >
                  <Option value="Sick Leave (SL)">Sick Leave (SL)</Option>
                  <Option value="Casual Leave (CL)">Casual Leave (CL)</Option>
                  <Option value="Marriage Leave (ML)">
                    Marriage Leave (ML)
                  </Option>
                  <Option value="Maternity Leave (ML)">
                    Maternity Leave (ML)
                  </Option>
                  <Option value="Paternity Leave (PL)">
                    Paternity Leave (PL)
                  </Option>
                  <Option value="Compensatory Leave (PL)">
                    Compensatory Leave (PL)
                  </Option>
                </Select>
              </div>
              <div className="">
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Total days
                </label>
                <br />
                <InputNumber
                  className="num-input"
                  value={val.TotalDays}
                  onChange={(value) => {
                    const updatedLeaveSetup = [...ogData.leavesetup];
                    updatedLeaveSetup[i].TotalDays = value || 0;
                    setogData({ ...ogData, leavesetup: updatedLeaveSetup });
                  }}
                  min={0}
                />
              </div>
              <div>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Total no of days in month
                </label>
                <br />
                <InputNumber
                  className="num-input"
                  value={val.ToatalDaysInMonths}
                  onChange={(value) => {
                    const updatedLeaveSetup = [...ogData.leavesetup];
                    updatedLeaveSetup[i].ToatalDaysInMonths = value || 0;
                    setogData({ ...ogData, leavesetup: updatedLeaveSetup });
                  }}
                  min={0}
                />
              </div>
            </div>
          ))}

          <div className="add-txt">
            <span
              style={{
                marginTop: "10px",
                fontSize: "12px",
                fontWeight: 400,
                color: "#666666",
                cursor: "pointer",
              }}
              onClick={() => {
                const newLeave = {
                  categoryName: "",
                  TotalDays: 0,
                  ToatalDaysInMonths: 0,
                };
                setogData({
                  ...ogData,
                  leavesetup: [...ogData.leavesetup, newLeave],
                });
              }}
            >
              <i className="fi fi-ss-add me-2"></i>Add Another Field
            </span>
          </div>

          <p
            className="pt-5"
            style={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Business Document
          </p>
          <div className=" row ">
            <div className="col-lg-6">
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Business Owner Name
              </label>
              <br />
              <Input
                className="inp-org"
                style={{ marginRight: "125px" }}
                value={ogData?.BusinessOwnerName ?? ""}
                onChange={(e) => onChange(e, "BusinessOwnerName")}
              />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Business license
              </label>
              <br />

              {ogData?.businessDocuments ? (
                <>
                  <a
                    style={{ color: "#1784A2" }}
                    href={imagePreview.businessDocumentspreview || `${API_URL}/public/images/${ogData.businessDocuments}`}
                  >
                    {" "}
                    Business license file
                  </a>
                  <br />
                </>
              ) : (
                <>
                  <Button
                  onClick={() => handleButtonClick("business")}
                  variant="contained"
                    style={{
                      background: "#1784A2",
                      borderRadius: "10px",
                      width: "120px",
                    }}
                  >
                    <input
                      type="file"
                      id="businessfileInput"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    Upload
                  </Button>
                  <br />
                </>
              )}
            </div>
            <div className="col-lg-6">
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Contact Number
              </label>
              <br />

              <Input
                className="inp-org "
                value={ogData?.contactInformation?.contactNo}
                onChange={(e) => onChange(e, "contactInformation", "contactNo")}
              />
              <br />

              {/* <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Id Proof
              </label>
              <br />
              <Upload {...props}>
                <Button
                  variant="contained"
                  style={{
                    background: "#1784A2",
                    borderRadius: "10px",
                    width: "120px",
                  }}
                >
                  Upload
                </Button>
              </Upload> */}
            </div>
          </div>
          <p
            className="pt-5"
            style={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Bank Account
          </p>
          <div className=" d-flex">
            <div>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Account Holder Name
              </label>
              <br />
              <Input
                className="inp-org"
                style={{ marginRight: "85px" }}
                value={ogData?.bankDetails?.accountHolderName}
                onChange={(e) =>
                  onChange(e, "bankDetails", "accountHolderName")
                }
              />{" "}
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                IFSC Code
              </label>
              <br />
              <Input
                className="inp-org"
                value={ogData?.bankDetails?.IFSCCode}
                onChange={(e) => onChange(e, "bankDetails", "IFSCCode")}
              />
            </div>
            <div style={{ marginRight: "2rem" }}>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Account Number
              </label>
              <br />
              <Input
                className="inp-org"
                value={ogData?.bankDetails?.accountNumber}
                onChange={(e) => onChange(e, "bankDetails", "accountNumber")}
              />
            </div>
          </div>
          {/* <p
            className="pt-5"
            style={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Company Location
          </p> */}
          <div className="d-flex pb-5">
            <div>
              {/* <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Enter Location
              </label> */}
              <br />
              {/* <Input className="inp-org" /> */}
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center py-3">
            {/* <a className="skipbtn ">Cancel</a> */}
            <Button
              variant="contained"
              className="nextBtn"
              onClick={editCompanyDetails}
            >
              Save
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default OrganizationDetails;
