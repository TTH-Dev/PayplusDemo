import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Input, Select } from "antd";
import { MdEdit, MdFilterAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Salaryinfo = () => {
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

  const navigate = useNavigate();
  const handleViewEmp = (EmployeeId: any) => {
    navigate(`/SalaryDetails/${EmployeeId}`);
  };
  const handleEditClick = (EmployeeId: any) => {
    navigate(`/EditTeam/${EmployeeId}`);
  };

  const handleReset = () => {
    setEmpname("");
    setDepartment("");
    setjobCategories("");
  };

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
    try {
      const token = localStorage.getItem("authtoken")
      // Make the API call to get pending location change requests
      const response = await axios.get(
        `${API_URL}/api/company/dmDeatails?companyId=${CompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );

      setdmValueBranches(response.data.branches);
      setdmValueDepartment(response.data.departments);
      setdmValuejobCategories(response.data.jobCategories);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch location change requests.");
      setLoading(false);
    }
  };

  const fetchEmployee = async () => {
    try {
      const token = localStorage.getItem("authtoken")
      // Make the API call to get pending location change requests
      const response = await axios.get(
        `${API_URL}/api/employee/filter?empName=${Empname}&jobCategory=${jobCategories}&department=${Department}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      setEmplpoyees(response.data.data);
      console.log(response.data, "response.data");
      console.log(Emplpoyees, "Emplpoyees");
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch location change requests.");
      setLoading(false);
    }
  };

  const generateOptions = (data: any) => {
    return data.map((item: any) => ({
      value: item,
      label: item,
    }));
  };

  const formatDate = (date: any) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };
  useEffect(() => {
    getMe();
    fetchEmployee();
  }, []);

  useEffect(() => {
    getMe();
    fetchEmployee();
  }, [Department, jobCategories, Empname]);
  useEffect(() => {
    if (CompanyId) {
      fetchDropMenu();
    }
  }, [CompanyId]);


  console.log(Emplpoyees, "Emplpoyees");


  return (
    <>
      <section>
        <Container>
          <div>
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
                      onChange={(value) => setDepartment(value)}
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
                      onChange={(value) => setjobCategories(value)}
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
                      onChange={(e) => setEmpname(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="me-3">
                <Button
                  variant="contained"
                  className="newBtn"
                  onClick={handleReset}
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
                        Department{" "}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#666666",
                        }}
                      >
                        Work type
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#666666",
                        }}
                      >
                        Payment type
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#666666",
                        }}
                      >
                        Salary
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#666666",
                        }}
                      >
                        Overtime Rate
                      </TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Emplpoyees.map((employee: any, index: any) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        // Attach the click handler to the entire row
                        style={{ cursor: "pointer" }} // Change the cursor to indicate clickable rows
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          onClick={() => handleViewEmp(employee._id)}
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {employee.employeeId}
                        </TableCell>
                        <TableCell
                          onClick={() => handleViewEmp(employee._id)}
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {employee.firstName + " " + employee.lastName}
                        </TableCell>
                        <TableCell
                          onClick={() => handleViewEmp(employee._id)}
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {employee?.jobInfo?.department || "-"}
                        </TableCell>
                        <TableCell
                          onClick={() => handleViewEmp(employee._id)}
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {employee?.jobInfo?.workMode || "-"}
                        </TableCell>
                        <TableCell
                          onClick={() => handleViewEmp(employee._id)}
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {employee?.jobInfo?.paymentType || "-"}
                        </TableCell>
                        <TableCell
                          onClick={() => handleViewEmp(employee._id)}
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {employee?.jobInfo?.paymentAmount
                            ? `₹${employee?.jobInfo?.paymentAmount}`
                            : "-"}
                        </TableCell>
                        <TableCell
                          onClick={() => handleViewEmp(employee._id)}
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {employee?.jobInfo?.overtimeRate
                            ? `₹${employee?.jobInfo?.overtimeRate}`
                            : "-"}
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

export default Salaryinfo;
