import React, { useEffect, useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { Gauge } from "@mui/x-charts/Gauge";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { MdKeyboardArrowRight } from "react-icons/md";
import Container from "react-bootstrap/esm/Container";
import axios from "axios";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

const HomeView = () => {
  const [userData, setuserData] = useState({
    id: "",
    name: "",
    email: "",
    companyId: "",
  });

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setuserData(res.data);
      getOverview(res.data.companyId);
      await getMissingfield(res.data.companyId);
      await getCompany(res.data.companyId);
    } catch (error: any) {
      console.log(error);
    }
  };


  const [overView, setOverview] = useState({
    totalBranches: 0,
    totalDepartments: 0,
    totalEmployees: 0,
    totalFullTimeEmployees: 0,
    totalPartTimeEmployees: 0,
    totalShiftEmployees: 0,
    teamAvailability: {
      todaysShiftEmployees: 0,
      presentEmployees: 0,
      absentEmployees: 0,
    },
    leavesType: {
      paidLeaves: 0,
      unpaidLeaves: 0,
      totalLeaves: 0,
      paidLeavePercent: 0,
      unpaidLeavePercent: 0,
    },
  });

  const getOverview = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/overview/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOverview(res.data.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const [missingField, setMissingField] = useState({
    filledFields: 0,
    missingFieldDetails: [],
    missingFields: 0,
    missingPercentage: "",
    totalFields: 0,
  });

  const getMissingfield = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/progress/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setMissingField(res.data);
      await getLeavefield(id);
    } catch (error: any) {
      console.log(error);
    }
  };

  const [leaveData, setLeaveData] = useState({
    overall: {
      Approved: 0,
      Pending: 0,
      Rejected: 0,
    },
  });

  const getLeavefield = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/leave/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaveData(res.data.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const [company, setCompany] = useState<any>([]);

  console.log(company, "company");

  const getCompany = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompany(res.data.data.leavesetup);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <section>
        <Container>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <h3
                style={{ fontSize: "20px", fontWeight: 600, color: "#353535" }}
              >
                Welcome {userData.name || ""} !
              </h3>
              <p
                style={{ fontSize: "14px", fontWeight: 400, color: "#353535" }}
              >
                <FaRegPlayCircle className="me-1" />
                Demo Video{" "}
              </p>
            </div>
            <hr className="mt-0" />
            <div className="row">
              <div className="col-lg-7">
                <div className="p-2 shadow" style={{ height: "150px" }}>
                  <div className=" d-flex justify-content-between align-items-center">
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      Company overview{" "}
                    </p>
                    <img
                      src="/assests/Mask group.png"
                      className="img-fluid"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center  pt-3"
                    style={{ width: "100%" }}
                  >
                    <div style={{ width: "20%" }}>
                      <div>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#666666",
                          }}
                        >
                          Total Branch
                        </p>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {overView.totalBranches || 0}
                        </span>
                      </div>
                    </div>
                    <div style={{ width: "20%" }}>
                      <div>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#666666",
                          }}
                        >
                          Total employee
                        </p>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {overView.totalEmployees || 0}
                        </span>
                      </div>
                    </div>
                    <div style={{ width: "20%" }}>
                      <div>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#666666",
                          }}
                        >
                          Total department{" "}
                        </p>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {overView.totalDepartments || 0}
                        </span>
                      </div>
                    </div>
                    <div style={{ width: "20%" }}>
                      <div>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#666666",
                          }}
                        >
                          Total full time emp
                        </p>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {overView.totalFullTimeEmployees || 0}
                        </span>
                      </div>
                    </div>
                    <div style={{ width: "20%" }}>
                      <div>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#666666",
                          }}
                        >
                          Total part time emp
                        </p>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#353535",
                          }}
                        >
                          {overView.totalPartTimeEmployees || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="p-2 shadow" style={{ height: "150px" }}>
                  <div className=" d-flex justify-content-between align-items-center">
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      Leaves{" "}
                    </p>
                    <img
                      src="/assests/Mask group.png"
                      className="img-fluid"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center pt-3"
                    style={{ width: "100%" }}
                  >
                    {company.map((val: any, i: any) => (
                      <div style={{ width: "25%" }}>
                        <div>
                          <p
                            className="mb-1"
                            style={{
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#666666",
                            }}
                          >
                            {val.categoryName}
                          </p>
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: 600,
                              color: "#353535",
                            }}
                          >
                            {val.TotalDays}/yr
                          </span>
                        </div>
                      </div>
                    ))}

                   
                  </div>
                </div>
              </div>
            </div>

            <div className="row py-3">
              <div className="col-lg-4">
                <div className="shadow p-2" style={{ height: "260px" }}>
                  <div className=" d-flex justify-content-between align-items-center pb-3">
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      Team availability
                    </p>
                    <img
                      src="/assests/Mask group (1).png"
                      className="img-fluid"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div className="d-flex flex-wrap">
                    <div style={{ width: "50%" }}>
                      <p
                        className="mb-1"
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#666666",
                        }}
                      >
                        Today’s shift employee
                      </p>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#353535",
                        }}
                      >
                        {overView.teamAvailability?.todaysShiftEmployees || 0}
                      </span>
                    </div>
                    <div style={{ width: "50%" }}>
                      <p
                        className="mb-1"
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#666666",
                        }}
                      >
                        Present employee
                      </p>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#353535",
                        }}
                      >
                        {overView.teamAvailability?.presentEmployees}
                      </span>
                    </div>

                    <div style={{ width: "50%" }} className="pt-3">
                      <p
                        className="mb-1"
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#666666",
                        }}
                      >
                        Absent employee
                      </p>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#353535",
                        }}
                      >
                        {overView.teamAvailability?.absentEmployees}
                      </span>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="shadow p-2" style={{ height: "260px" }}>
                  <div className="d-flex justify-content-between align-items-center pb-3">
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      Leaves Type
                    </p>
                    <img
                      src="/assests/Mask group (2).png"
                      className="img-fluid"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>

                  <div className="position-relative">
                    <Gauge
                      width={170}
                      height={170}
                      // ✅ show total leave percentage correctly
                      value={overView?.leavesType?.paidLeavePercent || 0}
                      valueMin={0}
                      valueMax={100}
                    />

                    <div className="gauge-move">
                      <span
                        className="d-flex justify-content-start align-items-center"
                        style={{ fontSize: "14px", fontWeight: 400 }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            background: "#1784A2",
                          }}
                        ></div>
                        Paid Leaves
                      </span>

                      <span
                        className="d-flex justify-content-start align-items-center"
                        style={{ fontSize: "14px", fontWeight: 400 }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            background: "#64DEFF",
                          }}
                        ></div>
                        Unpaid Leaves
                      </span>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-lg-4">
                <div
                  className="shadow p-2"
                  style={{ height: "260px", overflowY: "scroll" }}
                >
                  <div className="d-flex justify-content-between align-items-center pb-3">
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#353535",
                      }}
                    >
                      Pending organization setup
                    </p>
                    <img
                      src="/assests/Mask group (3).png"
                      className="img-fluid"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p
                        className="mb-0"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Pending
                      </p>
                      <p
                        className="mb-0"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        {missingField?.missingPercentage || ""}
                      </p>
                    </div>
                    <ProgressBar
                      now={
                        100 -
                        Number(missingField?.missingPercentage.replace("%", ""))
                      }
                    />
                    {missingField.missingFieldDetails.map((val, i) => (
                      <div className="d-flex justify-content-between align-items-center py-3">
                        <p
                          className="mb-0"
                          style={{
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: 400,
                          }}
                        >
                          {val}
                        </p>
                        <Link
                          to="/Settings/OrganizationDetails"
                          style={{
                            color: "#1784A2",
                            fontSize: "14px",
                            fontWeight: 400,
                          }}
                        >
                          view
                          <MdKeyboardArrowRight />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default HomeView;
