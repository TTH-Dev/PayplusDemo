import {
  Box,
  Button,
  Modal,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs, 
} from "@mui/material";
import { Empty, Input, InputNumber, message, Select } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { MdFilterAlt } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import EditLocation from "./EditLocation";
import axios from "axios";
import { API_URL } from "../../config";
import { IoIosCloseCircleOutline } from "react-icons/io";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AttendanceLocation = () => {
  const [value, setValue] = useState("Add Location");
  const [editloc, setEditloc] = useState(false);
  const navigate = useNavigate();
  const handleViewEmp = (id: any) => {
    navigate(`/EmployeeDetails/${id}`);
  };

  const handleEditloc = () => {
    setEditloc(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [leaveReqData, setleaveReqData] = useState<any[]>([]);
  const [userData, setuserData] = useState({
    companyId: "",
  });
  const getEmployee = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/employee/filter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeData(res.data.data);
      await getMe();
      await getLocationReq();
    } catch (error) {
      console.log(error);
    }
  };

  const getLocationReq = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(
        `${API_URL}/api/company/locationChnagingReq`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resData = res.data.data.filter(
        (val: any) => val.status === "Pending"
      );
      setleaveReqData(resData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateLocation = async (val: any, id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.patch(
        `${API_URL}/api/company/locationChnagingAdmin`,
        { status: val, requestId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await getLocationReq();
      message.success("Updated successfully!");
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message || "Something went wrong");
    }
  };

  const [dropvalue, setDropValue] = useState({
    branches: [],
    departments: [],
    jobCategories: [],
    EmpId: [],
    EmpLocation: [],
    EmpName: [],
  });

  const getDropmenu = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(
        `${API_URL}/api/company/dmDeatails?companyId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res, "dsadsadsadsadsa");

      setDropValue(res.data);
    } catch (error) {
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
      setuserData(res.data);
      getDropmenu(res.data.companyId);
      await getCompany(res.data.companyId);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  const branchOptions = (dropvalue.branches || [])
  .filter((branches) => branches)
  .map((branches) => ({
    value: branches,
    label: branches,
  }));

  const categoryOptions = (dropvalue.jobCategories || [])
    .filter((category) => category)
    .map((category) => ({
      value: category,
      label: category,
    }));

  const departmentOptions = (dropvalue.departments || [])
    .filter((department) => department)
    .map((department) => ({
      value: department,
      label: department,
    }));

  const locationOptions = Array.from(new Set(dropvalue.EmpLocation || []))
    .filter((EmpLocation) => EmpLocation)
    .map((EmpLocation) => ({
      value: EmpLocation,
      label: EmpLocation,
    }));

  const EmpIdOptions = (dropvalue.EmpId || [])
    .filter((EmpId) => EmpId)
    .map((EmpId) => ({
      value: EmpId,
      label: EmpId,
    }));

  const nameOptions = Array.from(new Set(dropvalue.EmpName || []))
    .filter((EmpName) => EmpName)
    .map((EmpName) => ({
      value: EmpName,
      label: EmpName,
    }));

  const [locationDropValue, setLocationDropValue] = useState({
    dept: "",
    categ: "",
    name: "",
  });

  const [employeefilter, setemployeeFilter] = useState({
    location: "",
    empId: "",
    empName: "",
  });

  const getEmpfilter = async () => {
    const token = localStorage.getItem("authtoken");

    const queryParams: string[] = [];
    if (employeefilter.empId)
      queryParams.push(
        `employeeId=${encodeURIComponent(employeefilter.empId)}`
      );
    if (employeefilter.empName)
      queryParams.push(`empName=${encodeURIComponent(employeefilter.empName)}`);
    if (employeefilter.location)
      queryParams.push(
        `attendanceLocation=${encodeURIComponent(employeefilter.location)}`
      );

    // Combine query parameters
    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

    try {
      const res = await axios.get(
        `${API_URL}/api/employee/filter${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.data, "dasdas");
      setEmployeeData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLocationfilter = async () => {
    const token = localStorage.getItem("authtoken");

    const queryParams: string[] = [];
    if (locationDropValue.categ)
      queryParams.push(
        `jobCategory=${encodeURIComponent(locationDropValue.categ)}`
      );
    if (locationDropValue.name)
      queryParams.push(`empName=${encodeURIComponent(locationDropValue.name)}`);
    if (locationDropValue.dept)
      queryParams.push(
        `department=${encodeURIComponent(locationDropValue.dept)}`
      );

    // Combine query parameters
    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

    try {
      const res = await axios.get(
        `${API_URL}/api/company/locationChnagingReq${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = res.data.data.filter(
        (val: any) => val.status === "Pending"
      );
      setleaveReqData(resData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleresetEmployee = () => {
    setemployeeFilter({
      location: "",
      empId: "",
      empName: "",
    });
    getEmployee();
  };

  const handleresetLocation = () => {
    setLocationDropValue({
      dept: "",
      categ: "",
      name: "",
    });
    getLocationReq();
  };

  const [locateData, setLocateData] = useState<any>([]);
  const getCompany = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocateData(res.data.data.attendanceLocation);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      employeefilter.empId ||
      employeefilter.empName ||
      employeefilter.location
    ) {
      getEmpfilter();
    }
    if (
      locationDropValue.categ ||
      locationDropValue.dept ||
      locationDropValue.name
    ) {
      getLocationfilter();
    }
  }, [employeefilter, locationDropValue]);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [locationEdit,setLocationEdit]=useState({
    location:"",
    range:0,
    branch:"",
    _id:""
  })

  const handleEdit = (val: any, i: any) => {
    setLocationEdit(val)
    setOpen(true);
  };

  const updateLocation=async()=>{
    try{
     const token=localStorage.getItem("authtoken")
      const res=await axios.patch(`${API_URL}/api/company/${userData.companyId}`,{companyId:userData.companyId,attendanceLocationId:locationEdit._id,attendanceLocation:{
        location:locationEdit.location,
        range:locationEdit.range,
        branch:locationEdit.branch,
      }},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setOpen(false)
      await getCompany(userData.companyId)
    }catch(error:any){
      console.log(error);
      
    }
  }

  

  return (
    <>
      {editloc ? (
        <div>
          <EditLocation />
        </div>
      ) : (
        <div>
          {" "}
          <section>
            <Container>
              <div>
                {(value === "Add Location" ||
                  value === "Employees" ||
                  value === "Location Request") && (
                  <div
                    className="pt-3"
                    style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#353535",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    Attendance Location
                    <hr className="mt-1" />
                  </div>
                )}

                <div className="d-flex">
                  <Box sx={{ width: "100%" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="wrapped label tabs example"
                    >
                      <Tab value="Add Location" label="Add Location" />
                      <Tab value="Employees" label="Employees" />
                      <Tab value="Location Request" label="Location Request" />
                    </Tabs>
                  </Box>
                </div>

                {value === "Add Location" && (
                  <div>
                    <div>
                      <div className="text-end">
                        <Link to="/NewLocation" className="skipbtn">
                          Add New +
                        </Link>
                      </div>
                      {locateData.length > 0 ? (
                        locateData.map((val: any, i: any) => (
                          <div key={i}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                marginTop: "20px",
                                marginBottom: "-15px",
                                marginLeft: "20px",
                              }}
                            >
                              {val.branch || "Branch Name"}
                            </div>
                            <div className="d-flex justify-content-between align-items-center loc-box">
                              <div className="px-4 py-2">
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    marginBottom: "3px",
                                  }}
                                >
                                  Location
                                </p>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  {val.location ||
                                    "Location details not available"}
                                </p>
                              </div>
                              {/* Range Details */}
                              <div className="px-4 py-3">
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    marginBottom: "3px",
                                  }}
                                >
                                  Range
                                </p>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  {val.range
                                    ? `${val.range} Meters`
                                    : "Range not specified"}
                                </p>
                              </div>
                              {/* Image Section */}
                              <div className="px-4 py-5">
                                <img
                                  src={
                                    val.image ||
                                    "/assests/Google Maps Widget.png"
                                  }
                                  alt="Location"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>

                              <div
                                className="px-4 py-5"
                                style={{ cursor: "pointer" }}
                                // onClick={() => handleEdit(val, i)}
                              >
                                <i
                                  className="fi fi-ss-pencil"
                                  onClick={() => handleEdit(val, i)}
                                ></i>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center">
                          <Empty description="No Location Data Available" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {value === "Location Request" && (
                  <div>
                    <br />
                    <span
                      style={{
                        color: "#1784A2",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Filter
                      <MdFilterAlt />
                    </span>
                    <div className="d-flex justify-content-between align-items-center filter-box">
                      <div style={{ width: "70%" }}>
                        <div className="d-flex justify-content-start align-items-center">
                          <div className="me-4">
                            <label
                              style={{
                                marginBottom: "10px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#666666",
                              }}
                            >
                              Search by Department
                            </label>
                            <br />
                            <Select
                              style={{ width: 150, height: 35 }}
                              options={departmentOptions}
                              value={locationDropValue.dept}
                              onChange={(value) =>
                                setLocationDropValue({
                                  ...locationDropValue,
                                  dept: value,
                                })
                              }
                            />
                            <br />
                          </div>
                          <div className="me-4">
                            <label
                              style={{
                                marginBottom: "10px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#666666",
                              }}
                            >
                              Search by job category
                            </label>
                            <br />
                            <Select
                              style={{ width: 150, height: 35 }}
                              options={categoryOptions}
                              value={locationDropValue.categ}
                              onChange={(value) =>
                                setLocationDropValue({
                                  ...locationDropValue,
                                  categ: value,
                                })
                              }
                            />
                            <br />
                          </div>
                          <div className="me-4">
                            <label
                              style={{
                                marginBottom: "10px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#666666",
                              }}
                            >
                              Search by Emp Name
                            </label>
                            <br />
                            <Select
                              style={{ width: 150, height: 35 }}
                              options={nameOptions}
                              value={locationDropValue.name}
                              onChange={(value) =>
                                setLocationDropValue({
                                  ...locationDropValue,
                                  name: value,
                                })
                              }
                            />
                            <br />
                          </div>
                        </div>
                      </div>
                      <div className="me-3">
                        <Button
                          variant="contained"
                          className="newBtn"
                          onClick={handleresetLocation}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                    <div className=" py-2 mt-4 mb-2">
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Employee Id
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Name
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Job Type
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Department
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Current Location
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Request Location
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Approval
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {leaveReqData.map((val, i) => (
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  onClick={() =>
                                    handleViewEmp(val.employeeId._id)
                                  }
                                  component="th"
                                  scope="row"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                >
                                  {val.employeeId.employeeId || "-"}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() =>
                                    handleViewEmp(val.employeeId._id)
                                  }
                                >
                                  {val.employeeId.firstName +
                                    " " +
                                    val.employeeId.lastName || "-"}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() =>
                                    handleViewEmp(val.employeeId._id)
                                  }
                                >
                                  {val.employeeId.workType || "-"}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() =>
                                    handleViewEmp(val.employeeId._id)
                                  }
                                >
                                  {val.employeeId.jobInfo.department || "-"}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() =>
                                    handleViewEmp(val.employeeId._id)
                                  }
                                >
                                  {val.employeeId.jobInfo.branch || "-"}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() =>
                                    handleViewEmp(val.employeeId._id)
                                  }
                                >
                                  {val.newBranch || "-"}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                    display: "flex",
                                  }}
                                >
                                  <CloseCircleOutlined
                                    style={{
                                      color: "red",
                                      cursor: "pointer",
                                      fontSize: "18px",
                                    }}
                                    id="dd"
                                    onClick={() =>
                                      handleUpdateLocation("Rejected", val._id)
                                    }
                                  />
                                  <CheckCircleOutlined
                                    className="ms-2 ff"
                                    style={{
                                      color: "green",
                                      cursor: "pointer",
                                      fontSize: "18px",
                                    }}
                                    onClick={() =>
                                      handleUpdateLocation("Approved", val._id)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                )}

                {value === "Employees" && (
                  <div>
                    <br />
                    <span
                      style={{
                        color: "#1784A2",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Filter
                      <MdFilterAlt />
                    </span>
                    <div className="d-flex justify-content-between align-items-center filter-box">
                      <div style={{ width: "70%" }}>
                        <div className="d-flex justify-content-start align-items-center">
                          <div className="me-4">
                            <label
                              style={{
                                marginBottom: "10px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#666666",
                              }}
                            >
                              Search by Location
                            </label>
                            <br />
                            <Select
                              style={{ width: 150, height: 35 }}
                              options={locationOptions}
                              value={employeefilter.location}
                              onChange={(value) =>
                                setemployeeFilter({
                                  ...employeefilter,
                                  location: value,
                                })
                              }
                            />
                            <br />
                          </div>
                          <div className="me-4">
                            <label
                              style={{
                                marginBottom: "10px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#666666",
                              }}
                            >
                              Search by Emp Id
                            </label>
                            <br />
                            <Select
                              style={{ width: 150, height: 35 }}
                              options={EmpIdOptions}
                              value={employeefilter.empId}
                              onChange={(value) =>
                                setemployeeFilter({
                                  ...employeefilter,
                                  empId: value,
                                })
                              }
                            />
                            <br />
                          </div>
                          <div className="me-4">
                            <label
                              style={{
                                marginBottom: "10px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#666666",
                              }}
                            >
                              Search by Emp Name
                            </label>
                            <br />
                            <Select
                              style={{ width: 150, height: 35 }}
                              options={nameOptions}
                              value={employeefilter.empName}
                              onChange={(value) =>
                                setemployeeFilter({
                                  ...employeefilter,
                                  empName: value,
                                })
                              }
                            />
                            <br />
                          </div>
                        </div>
                      </div>
                      <div className="me-3">
                        <Button
                          variant="contained"
                          className="newBtn"
                          onClick={handleresetEmployee}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                    <div className="py-2 mt-4 mb-2">
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Employee Id
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Name
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Job Type
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Department
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#666666",
                                }}
                              >
                                Location Status
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {employeeData.map((val, i) => (
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  onClick={() => handleViewEmp(val._id)}
                                  component="th"
                                  scope="row"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                >
                                  {val.employeeId}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() => handleViewEmp(val._id)}
                                >
                                  {val.firstName}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() => handleViewEmp(val._id)}
                                >
                                  {val.workType}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() => handleViewEmp(val._id)}
                                >
                                  {val?.jobInfo?.department}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#353535",
                                  }}
                                  onClick={() => handleViewEmp(val._id)}
                                >
                                  {val?.jobInfo?.attendanceLocation}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                )}
              </div>
            </Container>
          </section>{" "}
        </div>
      )}

      <div>
        <Modal
          open={open}
          style={{ zIndex: 1500 }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <p style={{fontSize:"18px",fontWeight:600}}>Edit Location</p>
              <span><IoIosCloseCircleOutline onClick={handleClose} style={{fontSize:"20px"}}/>
              </span>
              </div>
              <Container>
                <div className="d-flex flex-column ">
                  <div className="d-flex flex-column justify-content-center align-items-center ">
                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Enter Location
                      </label>
                      <br />
                      <Input className="inp-org" value={locationEdit?.location} onChange={(e)=>setLocationEdit({...locationEdit,location:e.target.value})}/>
                    </div>

                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Enter Range 
                      </label>
                      <br />
                      <InputNumber type="number" className="inp-org" suffix={"Meter"}  value={locationEdit?.range} onChange={(value)=>setLocationEdit({...locationEdit,range:value||0})}/>
                    </div>

                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Branch 
                      </label>
                      <br />
                      <Select
                              style={{ width: 400, height: 35 }}
                              options={branchOptions}
                              value={locationEdit.branch}
                              dropdownStyle={{ zIndex: 2050 }} 
                              onChange={(value)=>setLocationEdit({...locationEdit,branch:value})}
                            />
                    
                    </div>
                  </div>
                </div>
                <div
                  className="text-center pt-3"
                >
                  <Button variant="contained" className="nextBtn" onClick={updateLocation}>
                    Save
                  </Button>
                </div>
              </Container>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default AttendanceLocation;
