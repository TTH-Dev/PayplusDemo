import { TableCell, TableRow } from "@mui/material";
import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import ViewEmpDetails from "./ViewEmpDetails";
import { API_URL } from "../config";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewEmp = () => {
  const { id } = useParams();
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
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch location change requests.");
      setLoading(false);
    }
  };

  const formatDate = (date: any) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };
  useEffect(() => {
    fetchEmployee();
  }, []);
  const navigate = useNavigate()
  const handleedit = () => {
    navigate(`/EditTeam/${id}`)
  }

  return (
    <>
      <section className="py-2">
        <Container>
          <div>
            <h6 className="mb-0">
              <Link
                to="/Team"
                style={{ textDecoration: "none", color: "#353535" }}
              >
                <IoIosArrowBack className="mb-1" />
                View Employee
              </Link>
            </h6>
          </div>
        </Container>
        <hr className="mt-1" />
        <Container>
          <div className="text-end pb-2">
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#353535",
                textDecoration: "underLine",
                textDecorationStyle: "dotted",
                cursor: "pointer"
              }}
              onClick={handleedit}
            >
              Edit
              <MdEdit className="mb-1" />
            </span>
          </div>
          <div className="shadow">
            <div className="row px-4 py-3 m-0 justify-content-between align-items-center">
              <div className="col-lg-3">
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <div style={{ borderRadius: "50%", position: "relative" }}>
                      <img
                        src={
                          `${API_URL}/public/images/${Emplpoyees?.profileimage}` ||
                          "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        style={{
                          width: "134px",
                          height: "134px",
                          borderRadius: "50%",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                        }}
                      />
                      <div className="hourly text-center">
                        <span>{Emplpoyees?.employeeId}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-3">
                  <p
                    className="mb-0"
                    style={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    {Emplpoyees?.firstName} {Emplpoyees?.lastName}
                  </p>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    {Emplpoyees?.jobInfo?.position}
                  </span>
                </div>
              </div>
              <div className="col-lg-4">
                <div>
                  <p
                    className="mb-1"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Basic information
                  </p>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Branch
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      {Emplpoyees?.jobInfo?.branch}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Shift
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      {Emplpoyees?.shift?.shiftName}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Shift Dates
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      {formatDate(Emplpoyees?.shift?.startDate)}-{" "}
                      {formatDate(Emplpoyees?.shift?.endDate)}{" "}
                    </TableCell>
                  </TableRow>
                </div>
              </div>
              <div className="col-lg-4">
                <div>
                  <p
                    className="mb-1"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Application information
                  </p>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Employee app active{" "}
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      <Switch defaultChecked />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Finger print attendance{" "}
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      <Switch defaultChecked />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                        visibility: "hidden",
                      }}
                    >
                      sdas{" "}
                    </TableCell>
                    <TableCell
                      className=" py-1"
                      style={{ border: "none", visibility: "hidden" }}
                    >
                      dsd
                    </TableCell>
                  </TableRow>
                </div>
              </div>
            </div>
          </div>
          <ViewEmpDetails />
        </Container>
      </section>
    </>
  );
};

export default ViewEmp;
