import React, { useState, useEffect, } from "react";
import styled from "styled-components";
import { Box, Button, Modal, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Typography } from "@mui/material";
import "./Attendance.css";
import { FaPlus } from "react-icons/fa6";
import { FaCaretLeft, FaCheckCircle, FaDownload, FaTimesCircle } from "react-icons/fa";
import { FaCaretRight, FaChartLine } from "react-icons/fa";
import { format, addDays, subDays, subYears, addYears, parseISO } from 'date-fns';
import { FaChevronLeft } from "react-icons/fa";
import { MdFilterAlt, MdPublishedWithChanges } from "react-icons/md";
import { Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import axios from "axios";
import { API_URL } from "../../src/config";
import { Checkbox, message } from "antd";


const commonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  color: "#000",
  marginRight: "15px",
  borderBottom: "1px dotted #000",
  paddingBottom: "2px",
};


const Attendance = () => {
  const [value, setValue] = useState("Daily");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isAttedance, setIsAttedance] = useState(false)
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);


  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("");
  const [leaveReason, setLeaveReason] = useState("");

  const [Emplpoyees, setEmplpoyees] = useState<any[]>([]);
  const [dmValueDepartment, setdmValueDepartment] = useState([]);
  const [dmValuejobCategories, setdmValuejobCategories] = useState([]);
  const [dmValueactiveStatus, setdmValueactiveStatus] = useState([]);
  const [Department, setDepartment] = useState("");
  const [jobCategory, setjobCategory] = useState("");
  const [activityStatus, setactivityStatus] = useState("");
  const [leaveModal, setLeaveModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [CompanyId, setCompanyId] = useState("");
  const [userData, setuserData] = useState({
    id: "",
    name: "",
    email: "",
    companyId: "",
  });
  const [rows, setRows] = useState<any[]>([]);

  const handleRowSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === Emplpoyees.length) {
      setSelected([]);
    } else {
      setSelected(Emplpoyees.map((e: any) => e.employee));
    }
  };

  const handleReset = () => {
    setactivityStatus("");
    setDepartment(""); // Reset Empname to an empty string
    setjobCategory("");
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data, " userdata");
      setuserData(res.data);
      setCompanyId(res.data.companyId);
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchDropMenu = async () => {
    const token = localStorage.getItem("authtoken");
    const formattedDate = format(selectedDate || new Date(), "yyyy-MM-dd");

    try {
      const response = await axios.get(
        `${API_URL}/api/employee/records?date=${formattedDate}&companyId=${CompanyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setdmValueDepartment(response.data.filters.departments || []);
      setdmValuejobCategories(response.data.filters.jobCategories || []);
      setdmValueactiveStatus(response.data.filters.activityStatuses || []);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch dropdown filters.");
      setLoading(false);
    }
  };


  useEffect(() => {
    getMe();
  }, []);


  useEffect(() => {
    if (CompanyId) {
      fetchDropMenu();
      fetchEmployee(1, rowsPerPage);
    }
  }, [CompanyId]);


  useEffect(() => {
    if (!CompanyId) return;
    fetchEmployee(1, rowsPerPage);
  }, [CompanyId, Department, jobCategory, activityStatus, selectedDate, rowsPerPage]);

  const fetchEmployee = async (page = 1, limit = 10) => {
    if (!CompanyId) return;

    const token = localStorage.getItem("authtoken");
    const formattedDate = format(selectedDate || new Date(), "yyyy-MM-dd");

    let url = `${API_URL}/api/employee/records?date=${formattedDate}&limit=${limit}&page=${page}&download=false&companyId=${CompanyId}`;

    if (Department) url += `&department=${encodeURIComponent(Department)}`;
    if (jobCategory) url += `&jobCategory=${encodeURIComponent(jobCategory)}`;
    if (activityStatus) url += `&activityStatus=${encodeURIComponent(activityStatus)}`;

    console.log("Request URL:", url);

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmplpoyees(response.data.data || []);
      setLoading(false);
    } catch (err: any) {
      console.error("API Error:", err.response?.data || err.message);
      setError("Failed to fetch employees.");
      setLoading(false);
    }
  };

  const handleActivity = (
    empId: string,
    activityStatus: "Present" | "Absent" | "Leave"
  ) => {
    if (activityStatus === "Absent" || activityStatus === "Leave") {
      setSelectedEmpId(empId);
      setShowAddModal(true);
      return;
    }

    setEmplpoyees(prev =>
      prev.map(emp =>
        emp.employee === empId ? { ...emp, activityStatus: "Present" } : emp
      )
    );

    updateActivityApi(empId, "Present");
  };


  const updateActivityApi = async (
    empId: string,
    activityStatus: "Present" | "Absent" | "Leave",
    leaveType?: string
  ) => {
    try {
      const token = localStorage.getItem("authtoken");

      // ✅ Find employee to get its shiftId dynamically
      const currentEmp = Emplpoyees.find(e => e.employee === empId);
      const shiftId = currentEmp?.shiftId?._id || currentEmp?.shiftId || null;

      if (!shiftId) {
        message.error("Shift ID not found for this employee");
        return;
      }

      const payload: any = {
        empId,
        date: selectedDate,
        shiftId,
        activityStatus,
      };

      if (activityStatus === "Leave") {
        payload.leaveType = "Leave";
      } else if (activityStatus === "Absent" && leaveType) {
        payload.leaveType = leaveType;
      }

      console.log("Sending payload:", payload);

      await axios.post(
        `${API_URL}/api/employee/createAttendance/${empId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Employee updated successfully");

      setEmplpoyees(prev =>
        prev.map(emp =>
          emp.employee === empId
            ? { ...emp, activityStatus, leaveType: payload.leaveType }
            : emp
        )
      );
    } catch (err: any) {
      console.error("Error updating activity", err);
      const backendMessage = err.response?.data?.message;
      let customMessage = "Failed to update employee";

      if (backendMessage?.includes("No shift found for Sunday")) {
        customMessage = "Sunday is a weekly off — no shift scheduled.";
      } else if (backendMessage) {
        customMessage = backendMessage;
      }

      message.error(customMessage);

      setEmplpoyees(prev =>
        prev.map(emp =>
          emp.employee === empId
            ? { ...emp, activityStatus: "", leaveType: undefined }
            : emp
        )
      );
    }
  };



  const handleBulkAttendance = async (type: "Leave" | "Present", reason?: string) => {
    try {
      const token = localStorage.getItem("authtoken");

      const employeesToUpdate = Emplpoyees.filter(
        emp =>
          selected.includes(emp.employee) &&
          !["Present", "Absent", "Leave"].includes(emp.activityStatus)
      );

      if (employeesToUpdate.length === 0) {
        message.warning("Selected employees already have attendance marked");
        return;
      }

      // show loading spinner
      setLoading(true);

      // Prepare payload
      const payload = employeesToUpdate.map(emp => ({
        empId: emp.employee,
        date: selectedDate,
        shiftId: emp.shiftId,
        activityStatus: type,
        leaveType: type === "Leave" ? "Leave" : undefined,
        leaveReason: type === "Leave" ? reason : undefined,
      }));

      const res = await axios.post(
        `${API_URL}/api/employee/createBulkAttendance`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      const { success = [], failed = [] } = res.data;

      // ✅ Update only successful employees
      setEmplpoyees(prev =>
        prev.map(emp => {
          if (success.some((s: any) => s.empId === emp.employee)) {
            return {
              ...emp,
              activityStatus: type,
              leaveType: type === "Leave" ? "Leave" : undefined,
              leaveReason: type === "Leave" ? reason : undefined,
            };
          }
          return emp; // keep others unchanged
        })
      );

      if (failed.length > 0) {
        const failedNames = failed.map((f: any) => f.empId).join(", ");
        message.warning(`Attendance update failed`);
      }

      if (success.length > 0) {
        message.success(`${success.length} attendances updated successfully`);
      }

    } catch (error) {
      console.error("Error creating bulk attendance:", error);
      message.error("Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (employee: string) => {
    setIsAttedance(true);
    setSelectedEmpId(employee);

    try {
      const token = localStorage.getItem("authtoken");
      const month = new Date(selectedDate).getMonth() + 1;
      const year = new Date(selectedDate).getFullYear();
      const response = await axios.get(
        `${API_URL}/api/employee/employeeDashboard?empId=${employee}&month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAttendanceData(response.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };


  const handlePrevDate = () => {
    setSelectedDate((prevDate) => {
      const dateObj = parseISO(prevDate);
      return format(subDays(dateObj, 1), "yyyy-MM-dd");
    });
  };

  const handleNextDate = () => {
    setSelectedDate((prevDate) => {
      const dateObj = parseISO(prevDate);
      return format(addDays(dateObj, 1), "yyyy-MM-dd");
    });
  };

  const handlePrevEmployee = () => {
    setCurrentEmployeeIndex((prevIndex) => {
      if (prevIndex === 0) return prevIndex;
      return prevIndex - 1;
    });
  };

  const handleNextEmployee = () => {
    setCurrentEmployeeIndex((prevIndex) => {
      if (prevIndex === Emplpoyees.length - 1) return prevIndex;
      return prevIndex + 1;
    });
  };


  const handleDownloadExcel = () => {
    // Prepare data for export
    const exportData = Emplpoyees.map((employee: any) => ({
      "Emp ID": employee.empId,
      Name: employee.name,
      "Attendance Location": "Chennai",
      Shift: employee.shift,
      Department: employee.department,
      "Check-in": employee.punchIn,
      "Check-out": employee.punchOut,
      Break: employee.break,
      "Work Hours": employee.workHours,
      Overtime: employee.overTime,
      Activity: employee.activityStatus || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "EmployeeData.xlsx");
  };


  return (
    <>
      <section className="p-4">
        <div>
          {isAttedance ? <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className="m-0 p-1" onClick={() => setIsAttedance(false)}><FaChevronLeft /> Attendance</h2> : <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className="m-0 p-1">Attendance</h2>}
        </div>
        <hr className="m-0" />
        {!isAttedance ? <><div className="d-flex justify-content-between align-items-center">
          <div>
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={value}
                // onChange={handleChange}
                aria-label="wrapped label tabs example"
              >
                <Tab value="Daily" label="Full Time" />
                {/* <Tab value="Monthly" label="Monthly" /> */}
                {/* <Tab value="Yearly" label="Yearly" /> */}
              </Tabs>
            </Box>
          </div>

        </div><hr className="m-0" />

          <br />
          <div style={{ display: "flex", alignItems: "end", gap: "10px", justifyContent: "flex-end" }}>
            {/* Report Link */}
            <Link
              to="/attendance/report"
              style={{
                ...commonStyle,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                height: "36px", // match height for all
                padding: "0 16px",
              }}
            >
              Report <FaChartLine style={{ marginLeft: "5px" }} />
            </Link>

            {/* Bulk Update Button */}
            <Button
              onClick={() => setShowModal(true)}
              style={{
                ...commonStyle,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "none",
                height: "36px",
                padding: "0 16px",
                lineHeight: "1.5",
                minWidth: "auto",
              }}
            >
              Bulk Update <FaPlus style={{ marginLeft: "5px" }} />
            </Button>

            <Button
              onClick={handleDownloadExcel}
              style={{
                ...commonStyle,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "none",
                height: "36px",
                padding: "0 16px",
                lineHeight: "1.5",
                minWidth: "auto",
              }}
            >
              Download <FaDownload style={{ marginLeft: "5px" }} />
            </Button>
          </div>


          <span
            className="ms-3"
            style={{
              color: "#1784A2",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Filter <MdFilterAlt />
          </span>
          <div className="d-flex justify-content-between align-items-center filter-box mx-3">
            <div style={{ width: "70%" }}>
              <div className="d-flex justify-content-start align-items-center">
                <div className="me-4">
                  <label
                    style={{
                      marginBottom: "10px",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Search by Department
                  </label>
                  <br />
                  <Select
                    value={Department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: 150, height: 35 }}
                  >
                    {Array.isArray(dmValueDepartment) && dmValueDepartment.map((dept, i) => (
                      <MenuItem key={i} value={dept}>{dept}</MenuItem>
                    ))}

                  </Select>

                </div>

                <div className="me-4">
                  <label
                    style={{
                      marginBottom: "10px",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Search by Job Category
                  </label>
                  <br />
                  <Select
                    value={jobCategory}
                    onChange={(e) => setjobCategory(e.target.value)}
                    style={{ width: 150, height: 35 }}
                  >
                    {Array.isArray(dmValuejobCategories) && dmValuejobCategories.map((job, i) => (
                      <MenuItem key={i} value={job}>{job}</MenuItem>
                    ))}
                  </Select>

                </div>

                <div className="me-4">
                  <label
                    style={{
                      marginBottom: "10px",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    Search by Active
                  </label>
                  <br />
                  <Select
                    value={activityStatus}
                    onChange={(e) => setactivityStatus(e.target.value)}
                    style={{ width: 150, height: 35 }}
                  >
                    {Array.isArray(dmValueactiveStatus) && dmValueactiveStatus.map((act, i) => (
                      <MenuItem key={i} value={act}>{act}</MenuItem>
                    ))}
                  </Select>

                </div>
              </div>
            </div>

            <div className="me-3">
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                  visibility: "hidden",
                }}
              >
                Reset btn
              </label>
              <br />
              <Button variant="contained" onClick={handleReset} className="newBtn" >
                Reset
              </Button>
            </div>
          </div>
        </> : ""}
        {!isAttedance ?
          <div>
            {value === "Daily" ? <div className="App pt-4">
              <div className="pb-4">
                <div className="d-flex justify-content-start align-items-center">
                  <div><FaCaretLeft onClick={handlePrevDate} style={{ fontSize: "20px", fontWeight: 600, cursor: "pointer" }} /></div>
                  <div className="mx-3">
                    <span style={{ fontSize: "20px", fontWeight: 600 }}>
                      {format(selectedDate || new Date(), 'yyyy-MM-dd')}
                    </span>
                  </div>

                  <div><FaCaretRight onClick={handleNextDate} style={{ fontSize: "20px", fontWeight: 600, cursor: "pointer" }} /></div>
                </div>
              </div>
              <div className="dragTable-container">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="employee table">
                    <TableHead>
                      <TableRow>
                        {/* Checkbox header */}
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={
                              selected.length > 0 && selected.length < Emplpoyees.length
                            }
                            checked={Emplpoyees.length > 0 && selected.length === Emplpoyees.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>

                        <TableCell className="tableHead">Emp Id</TableCell>
                        <TableCell className="tableHead">Name</TableCell>
                        <TableCell className="tableHead">Attendance Location</TableCell>
                        <TableCell className="tableHead">Shift</TableCell>
                        <TableCell className="tableHead">Department</TableCell>
                        <TableCell className="tableHead">Check-in</TableCell>
                        <TableCell className="tableHead">Check-out</TableCell>
                        <TableCell className="tableHead">Work Hours</TableCell>
                        <TableCell className="tableHead">Overtime</TableCell>
                        <TableCell className="tableHead">Activity</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {Emplpoyees.map((employee: any, index: number) => (
                        <TableRow
                          key={employee._id}
                          onClick={() => fetchAttendance(employee.employee)}
                          sx={{

                            "&:last-child td, &:last-child th": { border: 0 },
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#E8F3F6" },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selected.includes(employee.employee)}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleRowSelect(employee.employee)}

                            />
                          </TableCell>

                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.empId}
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.name}
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            Chennai
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.shift}
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.department}
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.punchIn}
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.punchOut}
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.workHours}
                          </TableCell>
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            {employee.overTime}
                          </TableCell>

                          {/* Activity */}
                          <TableCell style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              {employee.activityStatus === "Present" ? (
                                <span style={{ color: "green" }}>Present</span>
                              ) : employee.activityStatus === "Absent" ? (
                                <span style={{ color: "red" }}>
                                  Absent
                                </span>
                              ) : employee.activityStatus === "Leave" ? (
                                <span style={{ color: "orange" }}>
                                  Leave
                                </span>
                              ) : (
                                <>
                                  <FaCheckCircle
                                    size={22}
                                    color="green"
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActivity(employee.employee, "Present");
                                    }}
                                  />
                                  <FaTimesCircle
                                    size={22}
                                    color="red"
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActivity(employee.employee, "Absent");
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </TableCell>


                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className='pt-4 px-4'
              />
            </div> : ""}
          </div> : ""}

        {isAttedance && attendanceData && (
          <div className="pt-4">
            <div
              style={{ border: "1px solid #1784A2", borderRadius: "10px" }}
              className="row px-4 py-3 m-0 justify-content-between align-items-center"
            >
              {/* Employee Profile */}
              <div className="col-lg-3 text-center">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="mx-3 fs-3"
                    style={{ cursor: currentEmployeeIndex === 0 ? "not-allowed" : "pointer", opacity: currentEmployeeIndex === 0 ? 0.4 : 1 }}
                    onClick={() => {
                      if (currentEmployeeIndex > 0) {
                        handlePrevEmployee();
                        fetchAttendance(Emplpoyees[currentEmployeeIndex - 1].employee);
                      }
                    }}

                  ><FaCaretLeft /></div>
                  <div style={{ position: "relative" }}>
                    <img
                      src={
                        attendanceData.employee?.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="Profile"
                      style={{
                        width: "134px",
                        height: "134px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        backgroundColor: "#f4f4f4",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                      }}
                    />

                    <div className="hourly">
                      <span>{attendanceData.employee?.employeeId}</span>
                    </div>
                  </div>
                  <div className="mx-3 fs-3"
                    style={{ cursor: currentEmployeeIndex === Emplpoyees.length - 1 ? "not-allowed" : "pointer", opacity: currentEmployeeIndex === Emplpoyees.length - 1 ? 0.4 : 1 }}
                    onClick={() => {
                      if (currentEmployeeIndex < Emplpoyees.length - 1) {
                        handleNextEmployee();
                        fetchAttendance(Emplpoyees[currentEmployeeIndex + 1].employee);
                      }
                    }}
                  ><FaCaretRight /></div>
                </div>
                <div className="pt-3">
                  <p className="mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    {attendanceData.employee?.name}
                  </p>
                  <span style={{ fontSize: "0.9rem", fontWeight: 400, color: "#666666" }}>
                    {attendanceData.employee?.department}
                  </span>
                </div>
              </div>

              <div className="col-lg-9">
                <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
                  {[
                    { key: "totalDays", label: "Total Days", color: "#00C853" },
                    { key: "workingDays", label: "Working Days", color: "#00C853" },
                    { key: "overtimeHours", label: "Over Time", color: "#2196F3" },
                    { key: "breakHours", label: "Break", color: "#F44336" },
                    { key: "leaveDays", label: "Leave Days", color: "#FFC107" },
                  ].map((stat, idx) => {
                    const value = attendanceData.summary[stat.key];
                    return (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "80px" }}>
                        <h2 className="m-0" style={{ fontSize: "20px", fontWeight: 600 }}>{value}</h2>
                        <span style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}>{stat.label}</span>
                        <div style={{ marginTop: "4px", width: "100%", height: "4px", backgroundColor: "#E0E0E0", borderRadius: "2px" }}>
                          <div
                            style={{
                              width: `${value * 4}%`,
                              height: "100%",
                              backgroundColor: stat.color,
                              borderRadius: "2px",
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="my-3">
              <p style={{ fontWeight: "600", color: "#353535" }}>Monthly Report (Up to Date)</p>
            </div>
            <TableContainer component={Paper} className="mt-3">
              <Table sx={{ width: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableCell className="tableHead">Date</TableCell>
                  <TableCell className="tableHead">Shift</TableCell>
                  <TableCell className="tableHead">Punch-in</TableCell>
                  <TableCell className="tableHead">Punch-out</TableCell>
                  <TableCell className="tableHead">Break 1</TableCell>
                  <TableCell className="tableHead">Lunch Break</TableCell>
                  <TableCell className="tableHead">Break 2</TableCell>
                  <TableCell className="tableHead">Work Hours</TableCell>
                  <TableCell className="tableHead">Pending working Hours</TableCell>
                  <TableCell className="tableHead">Overtime</TableCell>

                </TableHead>
                <TableBody>
                  {attendanceData.dailyRecords
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((att: any, index: number) => {
                      if (att.status === "Absent") {
                        return (
                          <TableRow key={index} hover style={{ backgroundColor: "#E8F3F6" }}>

                            <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>

                            <TableCell
                              colSpan={9}
                              style={{ textAlign: "center", fontWeight: 400, fontSize: "14px", color: "#666666" }}
                            >
                              Type{" "}
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "#353535",
                                  fontWeight: 600,
                                  marginLeft: "4px",
                                }}
                              >
                                {att.leaveType || "Absent"}
                              </span>
                            </TableCell>

                          </TableRow>
                        );
                      }

                      return (
                        <TableRow key={index} hover>
                          <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                          <TableCell className="tableBody">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span >{att.shift}</span>
                              <span style={{ fontSize: "12px", color: "#666" }}>
                                {att.shiftTiming || ""}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="tableBody">{att.punchIn}</TableCell>
                          <TableCell className="tableBody">{att.punchOut}</TableCell>
                          <TableCell className="tableBody">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span >{att.break}</span>
                              <span style={{ fontSize: "12px", color: "#666" }}>
                                {att.breakTimeOut && att.breakTimeIn
                                  ? `${att.breakTimeOut} - ${att.breakTimeIn}`
                                  : "0:00 0:00"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="tableBody">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span >{att.lunchBreak || ""}</span>
                              <span style={{ fontSize: "12px", color: "#666" }}>
                                {att.lunch || "00:00 00:00"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="tableBody">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span >{att.break2}</span>
                              <span style={{ fontSize: "12px", color: "#666" }}>
                                {att.breakTimeOut && att.breakTimeIn
                                  ? `${att.breakTimeOut} - ${att.breakTimeIn}`
                                  : "0:00 0:00"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="tableBody">{att.workHours}</TableCell>
                          <TableCell className="tableBody">{att.pendingWorkHours}</TableCell>
                          <TableCell className="tableBody">{att.overTime}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>


              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={attendanceData.dailyRecords.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="pt-4 px-4"
              />
            </TableContainer>
          </div>
        )}
        {showAddModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              onClick={() => setShowAddModal(false)}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            />

            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: "relative",
                width: "min(85vw, 380px)",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "25px",
                boxSizing: "border-box",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                fontSize: "0.85rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5 style={{ margin: 0, fontSize: "1rem" }}>Select Leave Type</h5>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  ×
                </button>
              </div>

              <hr style={{ margin: "8px 0" }} />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "4px", fontWeight: 500 }}>
                    Leave Type
                  </label>
                  <select
                    value={selectedLeaveType}
                    onChange={(e) => setSelectedLeaveType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    <option value="">-- Select Leave Type --</option>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#1784A2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      width: "120px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (!selectedEmpId) return;

                      const finalLeaveType =
                        selectedLeaveType || "Leave";

                      updateActivityApi(selectedEmpId, "Absent", finalLeaveType);
                      setShowAddModal(false);
                      setSelectedLeaveType("");
                      setSelectedEmpId(null);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                position: "relative",
                background: "white",
                borderRadius: "8px",
                padding: "30px",
                width: "541px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  fontSize: "15px",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                ✖
              </button>

              {/* Icon Circle */}
              <div
                style={{
                  background: "#E6F5F8",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <MdPublishedWithChanges size={24} color="#1784A2" />
              </div>

              {/* Text */}
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "30px",
                  fontWeight: 600,
                  color: "#353535",
                }}
              >
                Are you sure you want to update the attendance in bulk?
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
              >
                {/* ✅ Holiday opens second modal for leave reason */}
                <button
                  onClick={() => {
                    setShowModal(false); // close this confirm modal
                    setLeaveModal(true); // open leave modal
                  }}
                  style={{
                    padding: "10px 50px",
                    borderRadius: "6px",
                    border: "1px solid #1784A2",
                    background: "white",
                    color: "#1784A2",
                    cursor: "pointer",
                  }}
                >
                  Holiday
                </button>

                {/* ✅ Directly call Present attendance */}
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleBulkAttendance("Present");
                  }}
                  style={{
                    padding: "10px 50px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#1784A2",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Present
                </button>
              </div>
            </div>
          </div>
        )}

        {leaveModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            {/* Backdrop */}
            <div
              onClick={() => setLeaveModal(false)}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            />

            {/* Compact modal */}
            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: "relative",
                width: "min(85vw, 380px)",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "25px",
                boxSizing: "border-box",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                fontSize: "0.85rem",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5 style={{ margin: 0, fontSize: "1rem" }}>Leave Reason</h5>
                <button
                  onClick={() => setLeaveModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  ×
                </button>
              </div>

              <hr style={{ margin: "8px 0" }} />

              {/* Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "4px", fontWeight: 500 }}>Reason</label>
                  <input
                    type="text"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Enter leave reason"
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>

                {/* Save Button */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#1784A2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      width: "120px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (!leaveReason) return;

                      // Call API for Leave + reason
                      handleBulkAttendance("Leave", leaveReason);

                      // Close modal & reset
                      setLeaveModal(false);
                      setLeaveReason("");
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </section>


    </>
  );
};




export default Attendance;
