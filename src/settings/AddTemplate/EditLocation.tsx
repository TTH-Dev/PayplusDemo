import React, { useState } from "react";
import { Button } from "@mui/material";
import { Input } from "antd";
import Container from "react-bootstrap/esm/Container";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const EditLoc = () => {
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
            Edit Location
          </Link>
        </Container>
        <hr className="mt-1" />
      </div>
      <div>
        <Container>
          <div className="d-flex flex-column ">
            <div className="d-flex flex-wrap notice-left ">
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
                <Input className="inp-org" />
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
                <Input className="inp-org" suffix={"Meter"} />
              </div>
            </div>
          </div>
          <div className="p-5 d-flex justify-content-between align-items-center">
            <a
              className="skipbtn"
            >
              Cancel
            </a>
            <Button variant="contained" className="nextBtn">
              Save
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default EditLoc;
