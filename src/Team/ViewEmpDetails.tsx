import { Box, Tab, TableCell, TableRow, Tabs } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import {
  BsCreditCard2Back,
  BsHandbag,
  BsPersonExclamation,
  BsWifiOff,
} from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { API_URL } from "../config";
import { useParams } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ViewEmpDetails = () => {
  const [value, setValue] = React.useState(0);


  const { id } = useParams(); // Extract 'id' from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [Emplpoyees, setEmplpoyees] = useState<any>([]);

  const fetchEmployee = async () => {
    try {
      const token = localStorage.getItem("authtoken")
      // Make the API call to get pending location change requests
      const response = await axios.get(`${API_URL}/api/employee/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEmplpoyees(response.data);


    } catch (err) {
      setError('Failed to fetch location change requests.'); // Set error if API call fails

    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  // const selectedEmployee = Emplpoyees.find(emp => emp.id === id);



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const formatDate = (date: any) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };
  return (
    <>
      <div className="shadow px-4 my-4">
        <Container>
          <Box sx={{ width: "100%" }}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  style={{ display: "flow" }}
                  label={
                    <>
                      <span>Basic info</span>
                      <BsPersonExclamation className="mb-1" />
                    </>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  style={{ display: "flow" }}
                  label={
                    <>
                      <span>Job info</span> <BsHandbag className="mb-1" />
                    </>
                  }
                  {...a11yProps(1)}
                />

                <Tab
                  style={{ display: "flow" }}
                  label={
                    <>
                      <span>Document </span>{" "}
                      <IoDocumentTextOutline className="mb-1" />
                    </>
                  }
                  {...a11yProps(2)}
                />
                <Tab
                  style={{ display: "flow" }}
                  label={
                    <>
                      <span>Bank detail</span>{" "}
                      <BsCreditCard2Back className="mb-1" />
                    </>
                  }
                  {...a11yProps(3)}
                />
                <Tab
                  style={{ display: "flow" }}
                  label={
                    <>
                      <span>Leave </span> <BsWifiOff className="mb-1" />
                    </>
                  }
                  {...a11yProps(4)}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="row">
                <div className="col-lg-6">
                  <div>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Employee Id
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.employeeId}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        First name
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.firstName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Email Id
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.emailId}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Date of birth
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.dateOfBirth
                          ? new Date(Emplpoyees.dateOfBirth).toLocaleDateString("en-GB") // DD/MM/YYYY format
                          : "-"}
                      </TableCell>

                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Gender
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.gender}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Permanent address
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.permanentAddress}

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <TableRow style={{ visibility: "hidden" }}>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Permanent address
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.permanentAddress}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Last name
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.lastName}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Phone no
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.phoneNo}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Blood group
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bloodGroup}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Material status
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.maritalStatus}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Current address
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.currentAddress}

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="row">
                <div className="col-lg-6">
                  <div>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Department
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.department}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Position
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.position}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Over time (Per hours)
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.overtimePerHr}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Branch
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.branch}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Work type
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.workMode}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Date of joining
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {formatDate(Emplpoyees?.jobInfo?.dateOfJoining)}

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Resume
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        <a target="_blank" style={{ color: "#1784A2", textDecoration: "none" }} href={`${API_URL}/public/images/${Emplpoyees?.jobInfo?.resume}`}>Resume</a>


                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Job Category
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.jobCategory}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Annual CTC
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.paymentAmount}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Work mode
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.workMode}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Payment type
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.paymentType}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Probation period
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.jobInfo?.paymentType}

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <div className="row">
                <div className="col-lg-6">
                  <div>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        ID proof
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        <a target="_blank" style={{ color: "#1784A2", textDecoration: "none" }} href={`${API_URL}/public/images/${Emplpoyees?.documents?.idProof}`}>IdProof</a>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        School Tc
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >

                        <a target="_blank" style={{ color: "#1784A2", textDecoration: "none" }} href={`${API_URL}/public/images/${Emplpoyees?.documents?.schoolTC}`}>SchoolTC</a>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Experience certificate
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >

                        <a target="_blank" style={{ color: "#1784A2", textDecoration: "none" }} href={`${API_URL}/public/images/${Emplpoyees?.documents?.experienceCertificate}`}>ExperienceCertificate</a>

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Pan Card
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >

                        <a target="_blank" style={{ color: "#1784A2", textDecoration: "none" }} href={`${API_URL}/public/images/${Emplpoyees?.documents?.panCard}`}>PanCard</a>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        College Tc
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >

                        <a target="_blank" style={{ color: "#1784A2", textDecoration: "none" }} href={`${API_URL}/public/images/${Emplpoyees?.documents?.collegeTC}`}>CollegeTC</a>

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Pay slip
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >

                        <a target="_blank" style={{ color: "#1784A2", textDecoration: "none" }} href={`${API_URL}/public/images/${Emplpoyees?.documents?.paySlip}`}>PaySlip</a>

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <div className="row">
                <div className="col-lg-6">
                  <div>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Acc holder name
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.accountHolderName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Acc type
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.accountType}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        PF no
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.pfNo}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        ESIC no
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.esicNo}

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        Acc number
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.accountNo}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        IFDC Code
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.ifscCode}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        UAN no
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.uanNo}

                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        PAN card no
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {Emplpoyees?.bankDetails?.panCardNo}

                      </TableCell>
                    </TableRow>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
<div className="row">
  <div className="col-lg-6">
    <div>
      {Emplpoyees?.companyId?.leavesetup?.map((item: any, index: number) => (
        <TableRow key={index}>
          <TableCell
            style={{
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
            }}
          >
            {item.categoryName}
          </TableCell>
          <TableCell
            style={{
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
            }}
          >
            {item.ToatalDaysInMonths} Days / Month
          </TableCell>
        </TableRow>
      ))}
    </div>
  </div>

  <div className="col-lg-6">
    <div>
      {Emplpoyees?.companyId?.leavesetup?.map((item: any, index: number) => (
        <TableRow key={index}>
          <TableCell
            style={{
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
            }}
          >
            Total Leaves
          </TableCell>
          <TableCell
            style={{
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
            }}
          >
            {item.TotalDays} Days / Year
          </TableCell>
        </TableRow>
      ))}
    </div>
  </div>
</div>

            </CustomTabPanel>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default ViewEmpDetails;
