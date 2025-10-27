import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { Input, Select } from "antd";

import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { IoIosArrowBack } from "react-icons/io";
import { MdFilterAlt, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const Accountaccess = () => {
  const [value, setValue] = useState("Dashboard Usage");
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const handleViewEmp = () => {
    navigate("/EmployeeDetails/123");
  };

  const handletoggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
    <section>
      <Container>
    <div>
    {(value === "Dashboard Usage" || value === "Application Usage") && (
  <div className="pt-3">
    <Link to="/Subscription" 
      style={{ fontSize: "20px", fontWeight: 600, color: "#353535", cursor: "pointer",textDecoration:"none" }}
      
    >
      <IoIosArrowBack className="mb-1" />
      Account access
    </Link>
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
            <Tab value="Dashboard Usage" label="Dashboard Usage" />
            <Tab value="Application Usage" label="Application Usage" />
          </Tabs>
        </Box>
      </div>
      {value === "Dashboard Usage" && (
        <div>
          <br/>

          <span style={{ color: "#1784A2", fontSize: "14px", fontWeight: 600 }}>
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
                    Search by emp name{" "}
                  </label>
                  <br />
                  <Input className="dsds" />
                </div>
                <div className="me-2">
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#666666",
                    }}
                  >
                    Search by Emp Id{" "}
                  </label>
                  <br />
                  <Input className="dsds"></Input>
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
                    Search by Position
                  </label>
                  <br />
                  <Select
                    style={{ width: 150, height: 35 }}
                    options={[
                      { value: "Hr", label: "Hr" },
                      { value: "Developer", label: "Developer" },
                      { value: "Tester", label: "Tester" },
                      { value: "disabled", label: "Disabled", disabled: true },
                    ]}
                  />
                  <br />
                </div>
              </div>
            </div>
            <div className="me-3">
              <Button variant="contained" className="newBtn">
                Reset
              </Button>
            </div>
          </div>
          <div className="shadow py-2 mt-4 mb-2">
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
                      Position
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#666666",
                      }}
                    >
                      Email id{" "}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#666666",
                      }}
                    >
                      Password
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#666666",
                      }}
                    >
                      Access
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#666666",
                      }}
                    >
                      Account
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      onClick={handleViewEmp}
                      component="th"
                      scope="row"
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      85553655
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      Calisaya John
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      Hr
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      calisaya@gmail.com
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      ********
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      <FormControlLabel
                      
                      label=""
                     
                        control={
                          <Switch checked={checked} onChange={handletoggle} />
                        }
                      />
                    </TableCell>
                 
                    <TableCell
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      <i className="fi fi-ss-trash"></i>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}

      {value === "Application Usage" && (
        <div>
          <br/>
        <span style={{ color: "#1784A2", fontSize: "14px", fontWeight: 600 }}>
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
                  Search by emp name{" "}
                </label>
                <br />
                <Input className="dsds" />
              </div>
              <div className="me-2">
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#666666",
                  }}
                >
                  Search by Emp Id{" "}
                </label>
                <br />
                <Input className="dsds"></Input>
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
                  Search by Department
                </label>
                <br />
                <Select
                  style={{ width: 150, height: 35 }}
                  options={[
                    { value: "Hr", label: "Hr" },
                    { value: "Developer", label: "Developer" },
                    { value: "Tester", label: "Tester" },
                    { value: "disabled", label: "Disabled", disabled: true },
                  ]}
                />
                <br />
              </div>
            </div>
          </div>
          <div className="me-3">
            <Button variant="contained" className="newBtn">
              Reset
            </Button>
          </div>
        </div>
        <div className="shadow py-2 mt-4 mb-2">
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
                    Position
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#666666",
                    }}
                  >
                    Email id{" "}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#666666",
                    }}
                  >
                    Password
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#666666",
                    }}
                  >
                    Access
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#666666",
                    }}
                  >
                    Account
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    onClick={handleViewEmp}
                    component="th"
                    scope="row"
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353535",
                    }}
                  >
                    85553655
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353535",
                    }}
                  >
                    Calisaya John
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353535",
                    }}
                  >
                    Management
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353535",
                    }}
                  >
                    calisaya@gmail.com
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353535",
                    }}
                  >
                    ********
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353535",
                    }}
                  >
                    <FormControlLabel
                    
                    label=""
                   
                      control={
                        <Switch checked={checked} onChange={handletoggle} />
                      }
                    />
                  </TableCell>
               
                  <TableCell
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353535",
                    }}
                  >
                    <i className="fi fi-ss-trash"></i>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      )}
      
    </div>
    </Container>
    </section>
    </>
  );
};

export default Accountaccess;
