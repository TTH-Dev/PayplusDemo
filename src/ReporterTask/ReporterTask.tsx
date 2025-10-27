import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";


function ReporterTask() {
  const location = useLocation();
  const isRootPath = location.pathname === "/reportertask";

  return (
    <div className="d-flex">
      <div
        style={{
          background: "#F6F6F6",
          width: "200px",
          height: "100vh",
          marginLeft: "-20px",
          position: "fixed",
          padding: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "25px",
              fontWeight: "600",
              color: "#353535",
              margin: "13px",
            }}
          >
            Project
          </p>
        </div>

        <div className="settings-sidebar">
          <Link
            to="/emptask/hospital-management"
            className={`sidebar-link ${
              isRootPath || location.pathname.includes("hospital-management")
                ? "active"
                : ""
            }`}
          >
            Hospital Management
          </Link>

          <Link
            to="/emptask/solar-crm"
            className={`sidebar-link ${
              location.pathname.includes("solar-crm") ? "active" : ""
            }`}
          >
            Solar CRM
          </Link>
        </div>
      </div>

      <div style={{ marginLeft: "180px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default ReporterTask;
