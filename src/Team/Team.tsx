import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import { DatePicker, Input, Select } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import "./Team.css";
import Modal from "react-bootstrap/Modal";
import { IoCloudUploadOutline } from "react-icons/io5";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import { addemployee, uploadFiles } from "../Home/Orgsetup_services";
import { ApiEndPoints } from "../providers/api_endpoints";
import {
  editSingleEmployee,
  getEmployeeinfo,
  getSalaryDetails,
  getSingleEmployee,
} from "./Team_services";
import moment from "moment";

interface Rate {
  rateValue: number;
}

interface DepartmentDetail {
  departmentName: string;
  rates: Rate[];
}

interface SalaryDetail {
  employeeId: string;
  employeeName: string;
  overallRate: string;
  employeePaymentTyp: string;
  workMode: string;
  departmentDetails: DepartmentDetail[];
}

interface AdditionalField {
  fieldName: string;
  fieldValue: string;
}

interface Role {
  department: string;
  jobCategory: string;
  position: string;
  rate: string;
  overtimeRate: string;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  profileUrl: string;
  employeeId: string;
  employeeSsn: string;
  dob: string;
  married: boolean;
  unMarried: boolean;
  overTimeRatePerHour: string;
  documentUrl: string;
  employeeTax: boolean;
  employeePaymentTypeDTO: {
    hourly: boolean;
    biWeekly: boolean;
    monthly: boolean;
  };
  workModeDTO: {
    workFromHome: boolean;
    workFromOffice: boolean;
  };
  workTypeDTO: {
    fullTime: boolean;
    partTime: boolean;
  };
  empDeptAssociations: {
    departmentDTO: {
      departmentName: string;
    };
    jobCategoryDTOS: {
      categoryName: string;
      positions: {
        positionName: string;
        rateDTO: {
          rateValue: number;
        };
      }[];
    }[];
  }[];
  additionalFields: any[];
}

type DepartmentDTO = {
  departmentName: string;
};

type EmpDeptAssociation = {
  departmentDTO: DepartmentDTO;
};

interface addEmployeeInfo {
  employeeId: string;
  firstName: string;
  emailId: string;
  contactNumber: string;
  gender: string;
  dob: string;
  employeeSsn: string;
  empDeptAssociations: EmpDeptAssociation[];
}

const Team = () => {
  //Variable declaration

  const initialformData = {
    firstName: "",
    gender: "",
    phone: "",
    lastName: "",
    employeeId: "",
    email: "",
    profileUrl: "",
    employeeSsn: "",
    married: false,
    unMarried: false,
    overTimeRatePerHour: "",
    documentUrl: "",
    dob: "",
    employeeTax: false,
    employeePaymentTypeDTO: {
      hourly: false,
      biWeekly: false,
      monthly: false,
    },
    workModeDTO: {
      workFromHome: false,
      workFromOffice: false,
    },
    workTypeDTO: {
      fullTime: false,
      partTime: false,
    },
    empDeptAssociations: [],
    additionalFields: [],
  };

  //UseState
  const [value, setValue] = useState("EmployeeInfo");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [uploadImage, setuploadImage] = useState(null);
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    []
  );
  const [newFieldName, setNewFieldName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  const [addemployeeInfo, setaddEmployeeInfo] = useState<addEmployeeInfo[]>([]);
  const [isSalaryInfo, setIssalaryInfo] = useState<SalaryDetail[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isPhone, setisPhone] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>(initialformData);
  const [isError, setIserror] = useState("");
  const [roles, setRoles] = useState<Role[]>([
    {
      department: "",
      jobCategory: "",
      position: "",
      rate: "",
      overtimeRate: "",
    },
  ]);

  //Functions
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  //Get All employee
  const getAllsubindustry = async () => {
    try {
      const fetchGetemployeeinfo = await getEmployeeinfo(
        ApiEndPoints("getAllemployeeTeam")
      );
      setaddEmployeeInfo(fetchGetemployeeinfo.data);
    } catch (error) {
      console.log(error);
    }
  };

  //getSalaryDetails
  const getSalarydetails = async () => {
    try {
      const fetchGetSalaryinfo = await getSalaryDetails(
        ApiEndPoints("getSalaryDetailsTeam")
      );
      setIssalaryInfo(fetchGetSalaryinfo.data);
    } catch (error) {
      console.log(error);
    }
  };

  //Images uploads
  const handleImageupload = async (event: any) => {
    event.preventDefault();
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const validExtensions = ["png", "jpg", "jpeg"];
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension && validExtensions.includes(fileExtension)) {
        if (selectedFile.size <= 15 * 1024 * 1024) {
          const { name, files } = event.target;
          setuploadImage(selectedFile);
          const fileData = new FormData();
          fileData.append("file", selectedFile);
          try {
            const response = await uploadFiles(
              ApiEndPoints("fileUploads"),
              fileData
            );
            setFormData({ ...formData, profileUrl: response });
          } catch (error) {
            console.log(error);
            alert("error");
          }
        } else {
          alert("Upload at maximum size of 1MB ");
          console.error(
            "File size exceeds 1MB limit. Please select a smaller file."
          );
        }
      } else {
        alert("Upload at maximum size of 1MB ");
        console.error(
          "Invalid file type. Please select a PNG, JPG, or JPEG file."
        );
      }
    }
  };

  const handleInputChange = (
    index: number,
    name: keyof Role,
    value: string
  ) => {
    const updatedRoles = [...roles];
    updatedRoles[index][name] = value;
    setRoles(updatedRoles);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: keyof EmployeeFormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addNewRole = () => {
    setRoles([
      ...roles,
      {
        department: "",
        jobCategory: "",
        position: "",
        rate: "",
        overtimeRate: "",
      },
    ]);
  };

  const handleCreateField = () => {
    if (newFieldName.trim() !== "") {
      const newField = { fieldName: newFieldName, fieldValue: "" };
      setAdditionalFields([...additionalFields, newField]);
      setNewFieldName("");
      setShow(false);
    }
  };

  const validateFormattedData = async (data: any) => {
    if (!data.firstName.trim()) {
      setIserror("First name required");
    } else if (!data.married && !data.unMarried) {
      setIserror("Marital status required");
    } else if (!data.employeeSsn.trim()) {
      setIserror("Social security number required");
    } else if (!data.email.trim()) {
      setIserror("Email required");
    } else if (!data.phone.trim()) {
      setIserror("Phone number required");
    } else if (
      !data.workModeDTO.workFromHome &&
      !data.workModeDTO.workFromOffice
    ) {
      setIserror("Work mode required");
    } else if (!data.workTypeDTO.fullTime && !data.workTypeDTO.partTime) {
      setIserror("Work type required");
    } else if (
      !data.employeePaymentTypeDTO.biWeekly &&
      !data.employeePaymentTypeDTO.hourly &&
      !data.employeePaymentTypeDTO.monthly
    ) {
      setIserror("Payment type required");
    }
    // else if(data.empDeptAssociations.length>0){
    //     data.empDeptAssociations.forEach((role: any, index: number) => {
    //         // if (!role.departmentDTO.departmentName.trim()) {
    //         //     setIserror("Department required")
    //         //     console.log(role.departmentDTO.departmentName);
    //         //     console.log(role,"role");
    //         // }
    //         role.jobCategoryDTOS.forEach((jobCategory: any, jobIndex: number) => {
    //           if (!jobCategory.categoryName.trim()) {
    //             setIserror("Job Category required")
    //           }
    //           jobCategory.positions.forEach((position: any, posIndex: number) => {
    //             if (!position.positionName.trim()) {
    //                 setIserror("Position name required")
    //             }
    //             if (!position.rateDTO.rateValue && position.rateDTO.rateValue !== null) {
    //                 setIserror("Rate required")
    //             }
    //           });
    //         });
    //       });
    // }
    else {
      setIserror("");
      try {
        const response = await addemployee(ApiEndPoints("addEmployee"), data);
        if (response.resultStatus) {
          setisPhone(false);
          setValue("EmployeeInfo");
          setFormData(initialformData);
        } else {
          setisPhone(true);
        }
      } catch (error) {
        console.log(error);
        alert("error");
      }
    }
  };

  //Add employee
  const handleAddemployeeSubmit = async (e: any) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      additionalFields: additionalFields,
      empDeptAssociations: roles.map((role) => ({
        departmentDTO: {
          departmentName: role.department,
        },
        jobCategoryDTOS: [
          {
            categoryName: role.jobCategory,
            positions: [
              {
                positionName: role.position,
                rateDTO: {
                  rateValue: parseFloat(role.rate),
                },
              },
            ],
          },
        ],
      })),
    };

    validateFormattedData(formattedData);
  };

  const handleEditemployeeSubmit = async (e: any) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      additionalFields: additionalFields,
      empDeptAssociations: roles.map((role) => ({
        departmentDTO: {
          departmentName: role.department,
        },
        jobCategoryDTOS: [
          {
            categoryName: role.jobCategory,
            positions: [
              {
                positionName: role.position,
                rateDTO: {
                  rateValue: parseFloat(role.rate),
                },
              },
            ],
          },
        ],
      })),
    };

    try {
      await editSingleEmployee(
        ApiEndPoints("editEmployee"),
        formattedData.employeeId,
        formattedData
      );
      setFormData(initialformData);
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  const handleIconClick = (event: any) => {
    event.stopPropagation();
    const fileInput = document.getElementById("hiddenFileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleEditemployee = async (id: any) => {
    try {
      const fetchsingleEmployee = await getSingleEmployee(
        ApiEndPoints("getsingleemployee"),
        id
      );
      const employeeData = fetchsingleEmployee.data;
      // Update the form data state with the fetched employee data
      setFormData({
        firstName: employeeData.firstName || "",
        lastName: employeeData.lastName || "",
        gender: employeeData.gender || "",
        email: employeeData.email || "",
        phone: employeeData.phone || "",
        employeeId: employeeData.employeeId || "",
        employeeSsn: employeeData.employeeSsn || "",
        dob: employeeData.dob || "",
        overTimeRatePerHour: employeeData.overTimeRatePerHour || "",
        employeeTax: employeeData.employeeTax || false,
        workModeDTO: employeeData.workModeDTO || {
          workFromHome: false,
          workFromOffice: false,
        },
        workTypeDTO: employeeData.workTypeDTO || {
          fullTime: false,
          partTime: false,
        },
        employeePaymentTypeDTO: employeeData.employeePaymentTypeDTO || {
          hourly: false,
          biWeekly: false,
          monthly: false,
        },
        additionalFields: employeeData.additionalFields || [],
        empDeptAssociations: employeeData.empDeptAssociations || [],
        profileUrl: employeeData.profileUrl || "",
        married: employeeData.married || false,
        unMarried: employeeData.unMarried || false,
        documentUrl: employeeData.documentUrl || "",
      });

      // Set roles based on empDeptAssociations
      setRoles(
        employeeData.empDeptAssociations.map((association: any) => ({
          department: association.departmentDTO.departmentName,
          jobCategory: association.jobCategoryDTOS[0].categoryName,
          position: association.jobCategoryDTOS[0].positions[0].positionName,
          rate: association.jobCategoryDTOS[0].positions[0].rateDTO.rateValue.toString(),
          overtimeRate: employeeData.overTimeRatePerHour,
        }))
      );

      // Set additional fields if available
      // setAdditionalFields(employeeData.additionalFields);

      // Handle the profile image
      if (employeeData.profileUrl) {
        setIsEdit(true);
        setuploadImage(employeeData.profileUrl);
      }

      setValue("AddEmployee");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (value === "EmployeeInfo") {
      getAllsubindustry();
      setFormData(initialformData);
      setuploadImage(null);
      setRoles([
        {
          department: "",
          jobCategory: "",
          position: "",
          rate: "",
          overtimeRate: "",
        },
      ]);
    } else if (value === "Salarydetails") {
      getSalarydetails();
      setFormData(initialformData);
      setuploadImage(null);
      setRoles([
        {
          department: "",
          jobCategory: "",
          position: "",
          rate: "",
          overtimeRate: "",
        },
      ]);
    } else {
      getSalarydetails();
    }
  }, [value]);

  return (
    <>
      <section className="p-4">
        <div>
          <h2
            style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }}
            className="m-0 p-1"
          >
            Team
          </h2>
        </div>
        <hr className="m-0" />

        <div className="d-flex">
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
            >
              <Tab value="EmployeeInfo" label="Employee Info" />
              <Tab value="Salarydetails" label="Salary Details" />
              <Tab value="AddEmployee" label="Add Employee" />
            </Tabs>
          </Box>
        </div>
        <hr className="m-0" />
        {value === "AddEmployee" ? (
          <section>
            <div className="p-4">
              <h6 className="">Employee Info</h6>
              <div>
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Profile photo{" "}
                </label>
                <div
                  onClick={handleIconClick}
                  style={{
                    height: "95px",
                    width: "200px",
                    borderStyle: "dotted",
                    borderRadius: "8px",
                  }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImageupload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    id="hiddenFileInput"
                  />
                  {uploadImage == null ? (
                    <div
                      onClick={handleIconClick}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        {" "}
                        <IoCloudUploadOutline style={{ fontSize: "1.5rem" }} />
                      </div>
                      <div className="d-flex justify-content-center align-items-center">
                        <p
                          className="pt-2"
                          style={{ fontSize: "10px", fontWeight: "400" }}
                        >
                          Click to upload profile image
                          <span style={{ color: "red", fontSize: "1rem" }}>
                            *
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isEdit ? (
                        <img
                          src={uploadImage}
                          className="img-fluid p-1"
                          style={{ height: "16vh" }}
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(uploadImage)}
                          className="img-fluid p-1"
                          style={{ height: "16vh" }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center pt-2">
                <div style={{ width: "450px", marginRight: "10px" }}>
                  <label className="pb-2" style={{ fontSize: "14px" }}>
                    First Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    size="large"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    suffix={<UserOutlined />}
                    required
                    style={{ height: "45px" }}
                  />
                </div>
                <div style={{ width: "450px" }}>
                  <label className="pb-2" style={{ fontSize: "14px" }}>
                    Last Name
                  </label>
                  <Input
                    size="large"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    suffix={<UserOutlined />}
                    style={{ height: "45px" }}
                  />
                </div>
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Gender
                </label>
                <Input
                  size="large"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  suffix={<UserOutlined />}
                  style={{ height: "45px" }}
                />
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Marital status<span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <input
                  type="radio"
                  name="marriedStatus"
                  checked={formData.married}
                  style={{ width: "20px", height: "20px" }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      married: true,
                      unMarried: false,
                    })
                  }
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Married
                </span>
                <input
                  type="radio"
                  name="marriedStatus"
                  checked={formData.unMarried}
                  style={{ width: "20px", height: "20px" }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      married: false,
                      unMarried: true,
                    })
                  }
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Unmarried
                </span>
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Social Security Number <span style={{ color: "red" }}>*</span>
                </label>
                <Input.Password
                  name="employeeSsn"
                  value={formData.employeeSsn}
                  onChange={handleFormChange}
                  style={{ height: "45px" }}
                  required
                />
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Date of birth
                </label>
                <br />
                <DatePicker
                  placeholder=""
                  value={formData.dob ? moment(formData.dob) : null}
                  onChange={(date, dateString) =>
                    handleSelectChange("dob", dateString.toString())
                  }
                  style={{ width: "100%", height: "45px" }}
                />
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Email Id <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  size="large"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  suffix={<MailOutlined />}
                  style={{ height: "45px" }}
                />
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Phone No <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  size="large"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  style={{ height: "45px" }}
                />
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Employee Id <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  size="large"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  required
                  style={{ height: "45px" }}
                />
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Work mode <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <input
                  type="radio"
                  className="radio"
                  required
                  name="workMode"
                  checked={formData.workModeDTO.workFromHome}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      workModeDTO: {
                        ...formData.workModeDTO,
                        workFromHome: true,
                        workFromOffice: false,
                      },
                    })
                  }
                  style={{ width: "20px", height: "20px" }}
                />
                <span
                  className="mx-2 mb-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Work from home
                </span>
                <input
                  type="radio"
                  className="radio"
                  required
                  name="workMode"
                  checked={formData.workModeDTO.workFromOffice}
                  style={{ width: "20px", height: "20px" }}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      workModeDTO: {
                        ...formData.workModeDTO,
                        workFromHome: false,
                        workFromOffice: true,
                      },
                    })
                  }
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Work from office
                </span>
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Work type <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <input
                  className="radio"
                  type="radio"
                  name="workType"
                  checked={formData.workTypeDTO.fullTime}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      workTypeDTO: {
                        ...formData.workTypeDTO,
                        fullTime: true,
                        partTime: false,
                      },
                    })
                  }
                  style={{ width: "20px", height: "20px" }}
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Full time
                </span>
                <input
                  className="radio"
                  type="radio"
                  name="workType"
                  checked={formData.workTypeDTO.partTime}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      workTypeDTO: {
                        ...formData.workTypeDTO,
                        fullTime: false,
                        partTime: true,
                      },
                    })
                  }
                  style={{ width: "20px", height: "20px" }}
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Part time
                </span>
              </div>
              <div
                className="pt-2"
                style={{ width: "450px", marginRight: "10px" }}
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  Payment type <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <input
                  className="radio"
                  type="radio"
                  name="paymentType"
                  value="daily"
                  style={{ width: "20px", height: "20px" }}
                  checked={formData.employeePaymentTypeDTO.hourly}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      employeePaymentTypeDTO: {
                        ...formData.employeePaymentTypeDTO,
                        hourly: true,
                        biWeekly: false,
                        monthly: false,
                      },
                    })
                  }
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Hourly
                </span>
                <input
                  className="radio"
                  type="radio"
                  name="paymentType"
                  value="weekly"
                  style={{ width: "20px", height: "20px" }}
                  checked={formData.employeePaymentTypeDTO.biWeekly}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      employeePaymentTypeDTO: {
                        ...formData.employeePaymentTypeDTO,
                        hourly: false,
                        biWeekly: true,
                        monthly: false,
                      },
                    })
                  }
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Biweekly
                </span>
                <input
                  className="radio"
                  type="radio"
                  name="paymentType"
                  value="monthly"
                  style={{ width: "20px", height: "20px" }}
                  checked={formData.employeePaymentTypeDTO.monthly}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      employeePaymentTypeDTO: {
                        ...formData.employeePaymentTypeDTO,
                        hourly: false,
                        biWeekly: false,
                        monthly: true,
                      },
                    })
                  }
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Monthly
                </span>
              </div>

              {roles &&
                roles.map((role, index) => (
                  <div key={index}>
                    <div className="d-flex align-items-center pt-2">
                      <div style={{ width: "450px", marginRight: "10px" }}>
                        <label className="pb-2" style={{ fontSize: "14px" }}>
                          Department <span style={{ color: "red" }}>*</span>
                        </label>
                        <br />
                        <Select
                          style={{ width: "100%", height: 45 }}
                          onChange={(value) =>
                            handleInputChange(index, "department", value)
                          }
                          options={[
                            { value: "jack", label: "Jack" },
                            { value: "lucy", label: "Lucy" },
                            { value: "Yiminghe", label: "yiminghe" },
                            { value: "disabled", label: "Disabled" },
                          ]}
                          value={role.department}
                        />
                      </div>
                    </div>
                    <div
                      style={{ width: "450px", marginRight: "10px" }}
                      className="pt-2"
                    >
                      <label className="pb-2" style={{ fontSize: "14px" }}>
                        Job Category <span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        size="large"
                        value={role.jobCategory}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "jobCategory",
                            e.target.value
                          )
                        }
                        style={{ height: "45px" }}
                      />
                    </div>
                    <div className="d-flex align-items-center pt-2">
                      <div style={{ width: "481px", marginRight: "10px" }}>
                        <label className="pb-2" style={{ fontSize: "14px" }}>
                          Position <span style={{ color: "red" }}>*</span>
                        </label>
                        <br />
                        <Input
                          size="large"
                          value={role.position}
                          onChange={(e) =>
                            handleInputChange(index, "position", e.target.value)
                          }
                          style={{ height: "45px" }}
                        />
                      </div>
                      <div style={{ width: "450px" }} className="pt-2">
                        <label className="pb-2" style={{ fontSize: "14px" }}>
                          Rate <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          size="large"
                          value={role.rate}
                          onChange={(e) =>
                            handleInputChange(index, "rate", e.target.value)
                          }
                          style={{ height: "45px" }}
                        />
                      </div>
                    </div>
                    <div
                      className="pt-2"
                      style={{ width: "450px", marginRight: "10px" }}
                    >
                      <label className="pb-2" style={{ fontSize: "14px" }}>
                        Over time rate <span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        size="large"
                        value={
                          role.overtimeRate
                            ? role.overtimeRate
                            : formData.overTimeRatePerHour
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            overTimeRatePerHour: e.target.value,
                          })
                        }
                        style={{ height: "45px" }}
                      />
                      <div className="pt-2">
                        <div
                          className="d-flex justify-content-end"
                          onClick={addNewRole}
                        >
                          <AddCircleOutlineOutlinedIcon />
                          You can add another role
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div
                style={{ width: "450px", marginRight: "10px" }}
                className="pt-2"
              >
                <label className="pb-2" style={{ fontSize: "14px" }}>
                  TAX
                </label>
                <br />
                <input
                  className="radio"
                  type="radio"
                  checked={formData.employeeTax}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeTax: e.target.checked })
                  }
                  style={{ width: "20px", height: "20px" }}
                />
                <span
                  className="mx-2"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Employee tax
                </span>
              </div>
              {additionalFields.map((field, index) => (
                <div
                  key={index}
                  style={{ width: "450px", marginRight: "10px" }}
                >
                  <label className="pb-2" style={{ fontSize: "14px" }}>
                    {field.fieldName}
                  </label>
                  <Input
                    size="large"
                    value={field.fieldValue}
                    onChange={(e) => {
                      const updatedFields = [...additionalFields];
                      updatedFields[index].fieldValue = e.target.value;
                      setAdditionalFields(updatedFields);
                    }}
                    style={{ height: "45px" }}
                  />
                </div>
              ))}

              <div
                style={{ width: "450px", marginRight: "10px" }}
                className="pt-2"
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-1">Add new field</p>
                    <Button
                      onClick={handleShow}
                      variant="outlined"
                      style={{
                        width: "140px",
                        fontSize: "1rem",
                        borderStyle: "dotted",
                        borderColor: "#000",
                        color: "#000",
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                  {/* <div>
                        <p className='mb-1'>Add doc field</p>
                        <Button variant="outlined" style={{width:"140px",fontSize:"1rem",borderStyle:"dotted",borderColor:"#000",color:"#000"}}>
                            <CloudUploadOutlinedIcon/>
                        </Button>
                    </div> */}
                </div>
              </div>

              <div className="row pt-3 pb-5">
                <div className="d-flex justify-content-between align-items-center">
                  <a
                    style={{ fontSize: "14px", cursor: "pointer" }}
                    onClick={() => setValue("EmployeeInfo")}
                  >
                    Cancel
                  </a>
                  <Button
                    variant="contained"
                    className="nextBtn"
                    type="submit"
                    onClick={
                      !isEdit
                        ? handleAddemployeeSubmit
                        : handleEditemployeeSubmit
                    }
                  >
                    Save
                  </Button>
                </div>
                <div>
                  <Snackbar
                    open={isPhone}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message={"Email or Phone number already in use"}
                  />
                </div>
                <div>
                  <Snackbar
                    open={isError !== ""}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message={isError}
                  />
                </div>
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Create Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <TextField
                    id="standard-basic"
                    label="Field Name"
                    onChange={(e) => setNewFieldName(e.target.value)}
                    variant="standard"
                    style={{ width: "100%" }}
                  />
                </Modal.Body>
                <Modal.Footer className="text-center justify-content-center">
                  <Button
                    variant="contained"
                    className="nextBtn"
                    onClick={handleCreateField}
                  >
                    Create
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </section>
        ) : (
          ""
        )}

        {value === "EmployeeInfo" ? (
          <section className="pt-4">
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                style={{ border: "1px solid #1784A2" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell className="tableHead">Employee Id</TableCell>
                    <TableCell className="tableHead">Name</TableCell>
                    <TableCell className="tableHead">Email id </TableCell>
                    <TableCell className="tableHead">Phone No</TableCell>
                    <TableCell className="tableHead">Gender</TableCell>
                    <TableCell className="tableHead">Date of birth</TableCell>
                    <TableCell className="tableHead">SSN </TableCell>
                    <TableCell className="tableHead">Department </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addemployeeInfo
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow
                        hover
                        onClick={() => handleEditemployee(row.employeeId)}
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          className="tablebody"
                        >
                          {row.employeeId}
                        </TableCell>
                        <TableCell className="tablebody">
                          {row.firstName}
                        </TableCell>
                        <TableCell className="tablebody">
                          {row.emailId}
                        </TableCell>
                        <TableCell className="tablebody">
                          {row.contactNumber}
                        </TableCell>
                        <TableCell className="tablebody">
                          {row.gender}
                        </TableCell>
                        <TableCell className="tablebody">{row.dob}</TableCell>
                        <TableCell className="tablebody">
                          {row.employeeSsn.replace(/./g, "*")}
                        </TableCell>
                        <TableCell className="tablebody">
                          {row.empDeptAssociations.map((association, index) => (
                            <div key={index}>
                              {association.departmentDTO.departmentName}
                            </div>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={addemployeeInfo.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="pt-4 px-4"
              />
            </TableContainer>
          </section>
        ) : (
          ""
        )}

        {value === "Salarydetails" ? (
          <section className="pt-4">
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                style={{ border: "1px solid #1784A2" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell className="tableHead">Employee Id</TableCell>
                    <TableCell className="tableHead">Name</TableCell>
                    <TableCell className="tableHead">Department</TableCell>
                    <TableCell className="tableHead">Pay period</TableCell>
                    <TableCell className="tableHead">Work type</TableCell>
                    <TableCell className="tableHead">Rate</TableCell>
                    <TableCell className="tableHead">Overtime Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isSalaryInfo
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <>
                        {Array.isArray(row.departmentDetails) &&
                        row.departmentDetails.length > 0 ? (
                          <React.Fragment key={i}>
                            <TableRow
                              onClick={() => handleEditemployee(row.employeeId)}
                              style={{ cursor: "pointer" }}
                              sx={{ "&:hover": { backgroundColor: "" } }}
                            >
                              <TableCell
                                component="th"
                                rowSpan={row.departmentDetails.length}
                                scope="row"
                                className="tablebody"
                              >
                                {row.employeeId}
                              </TableCell>
                              <TableCell
                                rowSpan={row.departmentDetails.length}
                                className="tablebody"
                              >
                                {row.employeeName}
                              </TableCell>
                              <TableCell
                                className="tablebody"
                                style={{ borderLeft: "1px solid #A7A7A7" }}
                              >
                                {row.departmentDetails[0]?.departmentName}
                              </TableCell>
                              <TableCell className="tablebody">
                                {row.employeePaymentTyp}
                              </TableCell>
                              <TableCell className="tablebody">
                                {row.workMode}
                              </TableCell>
                              <TableCell className="tablebody">
                                ${" "}
                                {row.departmentDetails[0]?.rates[0]?.rateValue}
                              </TableCell>
                              <TableCell className="tablebody">
                                $ {row.overallRate}
                              </TableCell>
                            </TableRow>
                            {row.departmentDetails.slice(1).map((val, j) => (
                              <TableRow
                                key={`${i}-${j}`}
                                style={{ cursor: "pointer" }}
                                sx={{ "&:hover": { backgroundColor: "" } }}
                              >
                                <TableCell
                                  className="tablebody"
                                  style={{ borderLeft: "1px solid #A7A7A7" }}
                                >
                                  {val?.departmentName}
                                </TableCell>
                                <TableCell className="tablebody">
                                  {row.employeePaymentTyp}
                                </TableCell>
                                <TableCell className="tablebody">
                                  {row.workMode}
                                </TableCell>
                                <TableCell className="tablebody">
                                  $ {val?.rates[0]?.rateValue}
                                </TableCell>
                                <TableCell className="tablebody">
                                  $ {row.overallRate}
                                </TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ) : (
                          <TableRow
                            key={i}
                            onClick={() => handleEditemployee(row.employeeId)}
                            style={{ cursor: "pointer" }}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              "&:hover": { backgroundColor: "" },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              className="tablebody"
                            >
                              {row.employeeId}
                            </TableCell>
                            <TableCell className="tablebody">
                              {row.employeeName}
                            </TableCell>
                            <TableCell className="tablebody">
                              {row.departmentDetails[0]?.departmentName}
                            </TableCell>
                            <TableCell className="tablebody">
                              {row.employeePaymentTyp}
                            </TableCell>
                            <TableCell className="tablebody">
                              {row.workMode}
                            </TableCell>
                            <TableCell className="tablebody">
                              $ {row.departmentDetails[0]?.rates[0]?.rateValue}
                            </TableCell>
                            <TableCell className="tablebody">
                              $ {row.overallRate}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={isSalaryInfo.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="pt-4 px-4"
              />
            </TableContainer>
          </section>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default Team;
