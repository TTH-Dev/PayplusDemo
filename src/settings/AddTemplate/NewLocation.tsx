import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Input, message } from "antd";
import Container from "react-bootstrap/esm/Container";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const NewLocation = () => {
  const [userData, setuserData] = useState({
    companyId: "",
  });

  const [data, setData] = useState<any[]>([]);
  const [newData, setNewData] = useState({
    location: "",
    range: 0,
    branch:""
  });

  const navigate=useNavigate()

  const getCompany = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data.data.attendanceLocation);
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
      await getCompany(res.data.companyId);
      setuserData(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authtoken");
    const ff = [...data, newData];

    try {
      const res = await axios.patch(
        `${API_URL}/api/company/${userData.companyId}`,
        { attendanceLocation: ff },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Updated successfully!")
      navigate("/Settings/AttendanceLocation")
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <div className="pt-3">
        <Container>
          <Link
            to="/Settings/AttendanceLocation"
            style={{
              marginLeft: "2rem",
              fontSize: "20px",
              fontWeight: 600,
              color: "#353535",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <IoIosArrowBack className="mb-1" />
            Add Location
          </Link>
        </Container>
        <hr className="mt-1" />
      </div>
      <div>
        <Container>
        <div className="notice-left ">
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Enter Branch <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={newData.branch}
                  onChange={(e) =>
                    setNewData({ ...newData, branch: e.target.value })
                  }
                />
              </div>
          <div className="d-flex flex-column">
            <div className="d-flex flex-wrap notice-left ">
              <div>
            
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
                  Enter Location <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={newData.location}
                  onChange={(e) =>
                    setNewData({ ...newData, location: e.target.value })
                  }
                />
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
                  Enter Range <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <Input
                  type="number"
                  className="inp-org"
                  value={newData.range}
                  onChange={(e) =>
                    setNewData({ ...newData, range: Number(e.target.value) })
                  }
                  suffix={"Meter"}
                />
              </div>
            </div>
          </div>
          <div className="p-5 d-flex justify-content-between align-items-center">
            <a className="skipbtn">Cancel</a>
            <Button
              variant="contained"
              className="nextBtn"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default NewLocation;
