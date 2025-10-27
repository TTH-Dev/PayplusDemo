import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function Settings() {
  const location = useLocation();

  const isRootPath = location.pathname === "/Sales";

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
        <p style={{ fontSize: "20px", fontWeight: "600", color: "#353535", marginLeft: "1.5rem" }}>
          Sales
        </p>
        <div className="settings-sidebar">
          <Link
            to="/sales/customer"
            className={`sidebar-link ${isRootPath || location.pathname.includes("customer") ? "active" : ""}`}
          >
           Customer
          </Link>
        
          <Link
            to="/sales/quotation"
            className={`sidebar-link ${location.pathname.includes("quotation") ? "active" : ""}`}
          >
          Quotation
          </Link>
          <Link
            to="/sales/invoice"
            className={`sidebar-link ${location.pathname.includes("invoice") ? "active" : ""}`}
          >
          Invoice
          </Link>
          <Link
            to="/sales/payment-received"
            className={`sidebar-link ${location.pathname.includes("payment-received") ? "active" : ""}`}
          >
          Payment Received
          </Link>
          <Link
            to="/sales/payment-statement"
            className={`sidebar-link ${location.pathname.includes("payment-statement") ? "active" : ""}`}
          >
          Payment Statement
          </Link>
          {/* <Link
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
          </Link> */}
        </div>
      </div>
      <div style={{ marginLeft: "180px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Settings;
