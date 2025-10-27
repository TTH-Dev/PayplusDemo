import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../src/config";

const AttendanceReport: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState("");

  // Current month and year
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const todayDate = today.getDate();

  const days = Array.from({ length: todayDate }, (_, i) => i + 1);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.companyId, "userdata");
      setCompanyId(res.data.companyId); // <-- only set state
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchAttendance = async () => {
    if (!companyId) return; // avoid running with empty id
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");

      const response = await axios.get(
        `${API_URL}/api/employee/getAllEmployeesMonthlyAttendance?month=${month}&year=${year}&companyId=${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const employees = response.data.data;

      const mappedData = employees.map((emp: any) => {
        const attendanceByDay = days.map((day) => {
          const d = new Date(year, month - 1, day);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

          const dayRecord = emp.attendance.find(
            (att: any) => att.date.split("T")[0] === dateStr
          );

          if (!dayRecord) return { status: "-", leaveReason: null };
          if (dayRecord.activityStatus === "Present")
            return { status: "P", leaveReason: null };
          if (dayRecord.activityStatus === "Absent")
            return { status: "A", leaveReason: null };
          return {
            status: dayRecord.activityStatus,
            leaveReason: dayRecord.leaveReason,
          };
        });

        // Combine consecutive leave days
        const combined: any[] = [];
        let i = 0;
        while (i < attendanceByDay.length) {
          const att = attendanceByDay[i];
          if (
            att.status === "Leave" ||
            att.status === "Sick Leave" ||
            att.status === "Unpaid Leave"
          ) {
            let span = 1;
            while (
              i + span < attendanceByDay.length &&
              attendanceByDay[i + span].status === att.status
            ) {
              span++;
            }
            combined.push({ ...att, colspan: span });
            i += span;
          } else {
            combined.push({ ...att, colspan: 1 });
            i++;
          }
        }

        return {
          empId: emp.attendance[0]?.empId || emp.employee._id,
          name: emp.employee.name,
          attendance: combined,
        };
      });

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);


  useEffect(() => {
    if (companyId) {
      fetchAttendance();
    }
  }, [companyId, month, year, todayDate]);

  if (loading) return <p>Loading attendance...</p>;


  const firstDay = new Date(year, month - 1, 1);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const firstDayStr = firstDay.toLocaleDateString("en-US", options);

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <Link
          to="/attendance"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <FaChevronLeft size={20} />
          <span
            style={{ fontSize: "20px", fontWeight: 700, color: "#353535" }}
          >
            Attendance Report
          </span>
        </Link>
      </div>

      <hr className="m-0 p-0" />
      <div className="m-2">
        <p
          style={{
            margin: 0,
            color: "#353535",
            fontSize: "24px",
            fontWeight: 400,
          }}
        >
          {firstDayStr} - up to date
        </p>

        <small style={{ color: "#999" }}>Attendance Date</small>
      </div>

      <div className="m-2">
        <p
          style={{ fontWeight: 600, fontSize: "14px", color: "#353535" }}
        >
          Monthly report (Up to date)
        </p>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          textAlign: "center",
          // borderRadius:"10px"
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Emp Id</th>
            <th style={thStyle}>Name</th>
            {days.map((day, i) => (
              <th key={i} style={thStyle}>
                <div>{day}</div>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  {weekdays[new Date(year, month - 1, day).getDay()]}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((emp, rowIndex) => (
            <tr key={rowIndex}>
              <td style={tdStyle}>{rowIndex + 1}</td>
              <td style={tdStyle}>{emp.empId}</td>
              <td style={tdStyle}>{emp.name}</td>
              {emp.attendance.map((att: any, i: number) => {
                if (att.colspan === 0) return null;
                return (
                  <td key={i} style={tdStyle} colSpan={att.colspan}>
                    {att.status === "P" ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        P
                      </span>
                    ) : att.status === "A" ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        A
                      </span>
                    ) : att.status === "-" ? (
                      "-"
                    ) : (
                      <div
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          color: "#444",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {att.leaveReason || att.status}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "6px",
  fontSize: "13px",
  backgroundColor: "#f9f9f9",

};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "6px",
  fontSize: "13px",
};

export default AttendanceReport;
