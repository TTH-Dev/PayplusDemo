import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function Settings() {
  const location = useLocation();

  // Check if current path matches the root /Settings path
  const isRootPath = location.pathname === "/Settings";

  return (
    <div className="d-flex">
      <div
        style={{
          background: "#F6F6F6",
          width: "200px",
          height: "100vh",
          marginLeft: "-20px",
          position: "fixed",
        }}
        className="p-2"
      >
        <p style={{ fontSize: "20px", fontWeight: "600", color: "#353535", marginLeft: "2rem" }}>
          Settings
        </p>
        <div className="settings-sidebar">
          <Link
            to="/Settings/OrganizationDetails"
            className={`sidebar-link ${isRootPath || location.pathname.includes("OrganizationDetails") ? "active" : ""}`}
          >
            Organization Details
          </Link>
          <Link
            to="/Settings/AttendanceLocation"
            className={`sidebar-link ${location.pathname.includes("AttendanceLocation") ? "active" : ""}`}
          >
            Attendance Location
          </Link>
          <Link
            to="/Settings/Notice"
            className={`sidebar-link ${location.pathname.includes("Notice") ? "active" : ""}`}
          >
            Notice
          </Link>
          <Link
            to="/Settings/AddEmployeeTemplate"
            className={`sidebar-link ${location.pathname.includes("AddEmployeeTemplate") ? "active" : ""}`}
          >
            Add Employee
          </Link>
        </div>
      </div>
      <div style={{ marginLeft: "180px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Settings;
