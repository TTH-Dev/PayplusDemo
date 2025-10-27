import React, { useEffect, useState } from "react";
import { TableRow, TableCell } from "@mui/material";
import { Tabs, message } from "antd";
import Container from "react-bootstrap/esm/Container";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

interface WeekInfoType {
  maxPunchinTime: string;
  break2: string;
  lunchBreak: string;
  break1: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  breakTimeOut?: string;
  breakTimeIn?: string;
  lunchTimeOut?: string;
  lunchTimeIn?: string;
  minPunchTime?: string;
  maxPunchTime?: string;
  totalWorkingHours?: number;
}

interface ShiftDetails {
  shiftName: string;
  branch: string;
  isCustomized: boolean;
  shiftRepetition: string;
  weekInfo: WeekInfoType[];
}

const ViewShift: React.FC = () => {
  const navigate = useNavigate();
  const { shiftId } = useParams<{ shiftId: string }>();
  const [shiftDetails, setShiftDetails] = useState<ShiftDetails | null>(null);

  useEffect(() => {
    getShiftDetails();
  }, []);

  async function getShiftDetails() {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/shift/getById/${shiftId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const shift = res.data?.data;
      setShiftDetails({
        shiftName: shift.shiftName || "General",
        branch: shift.branch || "-",
        isCustomized: shift.isCustomized || false,
        shiftRepetition: shift.isRepeat ? "Repeat" : "No Repeat",
        weekInfo: shift.weekInfo || [],
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to load shift details");
    }
  }

  const renderWeekSchedule = (week: WeekInfoType) => (
    <div className="mt-3">
      {week.workingDays.map((day) => {
        const isHoliday = day === "Sunday";
        return (
          <div key={day} className="mb-4">
            <div
              style={{
                fontWeight: 600,
                fontSize: "15px",
                color: isHoliday ? "#888" : "#000",
              }}
            >
              {day} {isHoliday && <span style={{ color: "#888" }}>(Holiday)</span>}
            </div>

            {!isHoliday && (
              <div className="mt-2">
                <div
                  className="d-flex flex-wrap"
                  style={{ fontSize: "14px", color: "#333" }}
                >
                  <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <strong>Start Time</strong> &nbsp; {week.startTime}
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <strong>Max Punch In Time</strong> &nbsp; {week.maxPunchinTime || "-"}
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <strong>Break 1 Time</strong> &nbsp; {week.break1 || "-"} 
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <strong>Lunch Time</strong> &nbsp; {week.lunchBreak || "-"} 
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <strong>End Time</strong> &nbsp; {week.endTime}
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <strong>Min Punch Out Time</strong> &nbsp; {week.minPunchTime || "-"}
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <strong>Break 2 Time</strong> &nbsp; {week.break2 || "-"} 
                  </div>

                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="pt-3" style={{ minHeight: "100vh" }}>
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#353535",
              cursor: "pointer",
            }}
            onClick={() => navigate("/Schedule")}
          >
            <IoIosArrowBack className="mb-1" /> View Shift Management
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#353535",
              cursor: "pointer",
              textDecoration: "underline dotted",
            }}
          >
            Edit <MdEdit className="mb-1" />
          </div>
        </div>

        <hr className="mt-2 mb-4" />

        {/* Main card */}
        <div className="shadow-sm rounded-3 p-4 bg-white">
          {/* Shift Info */}
          <div className="mb-3">
            <p className="mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>
              Shift information
            </p>

            {shiftDetails && (
              <>
                <TableRow>
                  <TableCell sx={{ border: "none", fontWeight: 500 }}>Shift Name</TableCell>
                  <TableCell sx={{ border: "none" }}>{shiftDetails.shiftName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: "none", fontWeight: 500 }}>Branch</TableCell>
                  <TableCell sx={{ border: "none" }}>{shiftDetails.branch}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: "none", fontWeight: 500 }}>Shift type</TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {shiftDetails.isCustomized ? "Customized" : "Standard"}
                  </TableCell>
                </TableRow>
              </>
            )}
          </div>

          {/* Tabs for Weeks */}
          <Tabs
            defaultActiveKey="0"
            items={
              shiftDetails?.weekInfo.map((week, index) => ({
                key: index.toString(),
                label: `Week ${index + 1}`,
                children: renderWeekSchedule(week),
              })) || []
            }
          />
        </div>
      </Container>
    </div>
  );
};

export default ViewShift;
