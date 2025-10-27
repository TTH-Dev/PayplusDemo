import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdEdit, MdFilterAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { log } from "node:console";

const Empinfo = () => {



  const [dmValueBranches, setdmValueBranches] = useState([]);
  const [dmValueDepartment, setdmValueDepartment] = useState([]);
  const [dmValuejobCategories, setdmValuejobCategories] = useState([]);
  const [Emplpoyees, setEmplpoyees] = useState([]);
  const [Department, setDepartment] = useState("");
  const [jobCategories, setjobCategories] = useState("");
  const [Empname, setEmpname] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [CompanyId, setCompanyId] = useState("");
  const [userData, setuserData] = useState({
    id: "",
    name: "",
    email: "",
    companyId: "",
  });

  const handleReset = () => {
    setEmpname("");
    setDepartment(""); // Reset Empname to an empty string
    setjobCategories("");
  };

  const navigate = useNavigate()
  const handleViewEmp = (EmployeeId: any) => {
    navigate(`/EmployeeDetails/${EmployeeId}`)
  }


  const handleEditClick = (EmployeeId: any) => {
    navigate(`/EditTeam/${EmployeeId}`);
  }


  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data, " userdata");
      setuserData(res.data);
      setCompanyId(res.data.companyId);
    
    } catch (error: any) {
      console.log(error);
    }
  };
  const fetchDropMenu = async () => {
    const token = localStorage.getItem("authtoken")
    getMe()
    try {
      // Make the API call to get pending location change requests
      const response = await axios.get(`${API_URL}/api/company/dmDeatails?companyId=${CompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      setdmValueBranches(response.data.branches); // Set the data to state
      setdmValueDepartment(response.data.departments);
      setdmValuejobCategories(response.data.jobCategories);
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      setError('Failed to fetch location change requests.'); // Set error if API call fails
      setLoading(false); // Set loading to false after error
    }
  };

  const fetchEmployee = async () => {
    const token = localStorage.getItem("authtoken")
    getMe()
    try {
      // Make the API call to get pending location change requests
      const response = await axios.get(`${API_URL}/api/employee/filter?empName=${Empname}&jobCategory=${jobCategories}&department=${Department}&companyId=${CompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmplpoyees(response.data.data);
      console.log(response.data, "response.data");
      console.log(Emplpoyees, "Emplpoyees");
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      setError('Failed to fetch location change requests.'); // Set error if API call fails
      setLoading(false); // Set loading to false after error
    }
  };

  const generateOptions = (data: any) => {
    return data.map((item: any) => ({
      value: item,  // Set value to the branch name
      label: item,  // Set label to the branch name
    }));
  };

  const formatDate = (date: any) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };

  useEffect(() => {
    getMe(); // Fetch user data
    fetchEmployee();
  }, []);


  useEffect(() => {
    getMe(); // Fetch user data
    fetchEmployee();
  }, [Department, jobCategories, Empname]);
  useEffect(() => {
    getMe()
    if (CompanyId) {
      fetchDropMenu(); // Fetch the dropdown menu data once CompanyId is available
    }
  }, [CompanyId]); // Trigger fetchDropMenu when CompanyId changes

  return (
    <>
      <section>
        <Container>
          <div >
            <span
              style={{ color: "#1784A2", fontSize: "14px", fontWeight: 600 }}
            >
              Filter
              <MdFilterAlt />
            </span>
            <div className="d-flex justify-content-between align-items-center filter-box">
              <div style={{ width: "60%" }}>
                <div className="d-flex justify-content-start align-items-center">
                  <div className="me-2">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
                      Search by department
                    </label>
                    <br />
                    <Select
                      style={{ width: 150, height: 35 }}
                      options={generateOptions(dmValueDepartment)}
                      value={Department}
                      onChange={(value) => setDepartment(value)} // Use an arrow function to set the value
                    />
                    <br />
                  </div>
                  <div className="me-2">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
                      Search by job categories{" "}
                    </label>
                    <br />
                    <Select
                      style={{ width: 150, height: 35 }}
                      options={generateOptions(dmValuejobCategories)}
                      value={jobCategories}
                      onChange={(value) => setjobCategories(value)} // Use an arrow function to set the value
                    />
                    <br />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
                      Search by emp name{" "}
                    </label>
                    <br />
                    <Input
                      className="dsds"
                      value={Empname}
                      onChange={(e) => setEmpname(e.target.value)} // Use e.target.value to get the input value
                    />
                  </div>
                </div>
              </div>
              <div className="me-3">
                <Button variant="contained" className="newBtn" onClick={handleReset}>Reset</Button>
              </div>
            </div>
            <div className=" py-2 mt-4 mb-2">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Employee Id</TableCell>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Name</TableCell>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Email id </TableCell>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Phone No</TableCell>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Gender</TableCell>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Date of birth</TableCell>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Department</TableCell>
                      <TableCell style={{ fontSize: "14px", fontWeight: 700, color: "#666666" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Emplpoyees.map((employee: any, index: any) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        // Attach the click handler to the entire row
                        style={{ cursor: "pointer" }} // Change the cursor to indicate clickable rows
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          onClick={() => handleViewEmp(employee._id)}
                          style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}
                        >
                          {employee.employeeId}
                        </TableCell>
                        <TableCell onClick={() => handleViewEmp(employee._id)} style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                          {employee.firstName + " " + employee.lastName}
                        </TableCell>
                        <TableCell onClick={() => handleViewEmp(employee._id)} style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                          {employee.emailId}
                        </TableCell>
                        <TableCell onClick={() => handleViewEmp(employee._id)} style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                          {employee.phoneNo}
                        </TableCell>
                        <TableCell onClick={() => handleViewEmp(employee._id)} style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                          {employee.gender}
                        </TableCell>
                        <TableCell onClick={() => handleViewEmp(employee._id)} style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                          {formatDate(employee.dateOfBirth)}
                        </TableCell>
                        <TableCell onClick={() => handleViewEmp(employee._id)} style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                          {employee?.jobInfo?.department}
                        </TableCell>
                        <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                          <MdEdit onClick={() => handleEditClick(employee._id)}
                            style={{ fontSize: "20px", cursor: "pointer" }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Empinfo;
