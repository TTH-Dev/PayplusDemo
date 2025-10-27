import React, { useEffect, useState } from 'react'
import "./Payroll.css"
import { Box, Button, Checkbox, Modal, Tab, TablePagination, Tabs, TextField, IconButton, Typography, Input } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FaArrowLeft } from "react-icons/fa6";
import History from './History';
import PaymentSuccess from './PaymentSuccess';
import { HiDownload } from "react-icons/hi";
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { type } from 'node:os';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { API_URL } from "../../src/config";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";

import { saveAs } from "file-saver";
import { toWords } from "number-to-words";
import { MdFilterAlt } from 'react-icons/md';
import  PayrollTable  from './custompayroll';
import { message } from 'antd';

interface Employee {
  Name: string;
  EmpId: string;
  Department: string;
  Designation: string;

}

interface EarningsItem {
  name: string;
  amount?: number; // optional, fallback to INR
  INR?: number;
  isSelected: boolean;
}

interface DeductionsItem {
  name: string;
  amount?: number;
  INR?: number;
  isSelected: boolean;
}

interface EmployeePayslip {
  lop: number,
  salary: number,
  leaveDays: number;
  Deduction: number;
  GrossPay: number,
  Name: string;
  EmpId: string;
  Department: string;
  Designation: string;
  PeriodStart: string;
  PeriodEnd: string;
  WorkingDays: number;
  Earnings: EarningsItem[];
  Deductions: DeductionsItem[];
  NetPay: number;
  PaySlipMonth: string; // Add this to store month/year string
  AmountInWords: string;
}

const Payroll = () => {
  const [CompanyId, setCompanyId] = useState("");
  const [year, setYear] = useState<any>(new Date().getFullYear());
  const [value, setValue] = useState<"Unpaid" | "Paid">("Unpaid");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isPreview, setIsPreview] = useState(false)
  const [isHistory, setIshistory] = useState("preview")
  const [currentStep, setCurrentStep] = useState(1);
  const [openCreateModal, setOpenCreateModal] = useState(false); // Modal 1
  const [openDateModal, setOpenDateModal] = useState(false);     // Modal 2
  const [unpaidData, setUnpaidData] = useState<PayrollRow[]>([]);
  const [startDate, setStartDate] = useState(""); // string
  const [endDate, setEndDate] = useState("");     // string
  const [openPayslip, setOpenPayslip] = useState(false);
  const [selectedEmployee1, setSelectedEmployee1] = useState<EmployeePayslip | null>(null);
  const [downloadPDF, setDownloadPDF] = useState(false);
  const [currentUserId, setCurrentuserId] = useState("");
  const [month, setMonth] = useState<any>(1);
  const [totalDays, setTotalDays] = useState<any>(0);
  const [paymentDate, setPaymentDate] = useState("");
  const [openCustomiseModal, setOpenCustomiseModal] = useState(false);
  const [payrollRange, setPayrollRange] = useState(""); // e.g. Feb 01 - 30 2024
  const [previewPayroll1, setPreviewPayroll1] = useState<Payroll1[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [previewPayroll2, setPreviewPayroll2] = useState<any[]>([]);
  const [totalPreview2, setTotalPreview2] = useState({
    workingDays: 0,
    grossPay: 0,
    deduction: 0,
    netPay: 0,
    bonus: 0
  });

  const [paidData, setPaidData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const handleReset = () => {
    setYear("");
    setMonth("");
    setName("");
  };
  interface EmployeeInfo {
    _id: string;
    firstName: string;
    lastName?: string;
    employeeId: string;
    workType: string;
    jobInfo?: {
      department?: string;
      paymentType?: string;
    };
  }

  interface PayrollRow {
    _id: string;
    employee?: EmployeeInfo;
    workType?: string;
    payType?: string;
  }
  interface Payroll1 {
    _id: any;
    netPay: any;
    name: string;
    department: string;
    rate: number;
    workingDays: number;
    leaveDays: number;
    bonus: number;
    incentive: number;
    deduction: number;
    salaryAmount: number;
  }

  interface Payroll2 {
    empname: string;
    department: string;
    workingDays: number;
    grossPay: number;
    deduction: number;
    netPay: number;
    bonus: number;
  }
  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data, " userdata");
      setCurrentuserId(res.data._id);
      setCompanyId(res.data.companyId);
      setUserRole(res.data?.role);

    } catch (error: any) {
      console.log(error);
    }
  };
const navigate = useNavigate();

  useEffect(() => {
    getMe();
  }, []);
  const [generatedPayslipData, setGeneratedPayslipData] = useState([]);
  const handleBulkGeneratePayslip = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/payroll/generateBulkPayslips`,
        {
          companyId: CompanyId,
          year,
          month: parseInt(month),// Month as 1-based index if using month name/array
          totalDays,
          paymentDate
        }
      );
      setGeneratedPayslipData(response.data.payslips);
          if (response.data?.payslips) {
      setOpenCustomiseModal(false);
      navigate("/payroll-customize", {
        state: {
          rows: response.data.payslips,
          companyId: CompanyId,
          generatedById: currentUserId,
        },
      });
    } else {
      message.error("Unexpected response from server.");
    }

    } catch (error) {
      console.error("Bulk Payslip Generation Failed", error);
      // Show error to user
    }
  };

const checkPayrollStatus = async () => {
  try {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const companyId = CompanyId; // from state or context

    const formatDate = (y: number, m: number, d: number) =>
      `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const daysInMonth = new Date(year, month, 0).getDate();
    const fromDate = formatDate(year, month, 1);
    const toDate = formatDate(year, month, daysInMonth);

    console.log("📅 API Payload:", { fromDate, toDate, companyId, year, month });

    const res = await axios.get(
      `${API_URL}/api/payroll/downloadPayrollExcel?companyId=${companyId}`
    );

    const payrolls = res.data?.payrolls || [];
    const generatedPayrolls = payrolls.filter((p: any) =>  p.status === "Paid" || p.status === "Generated");

    if (generatedPayrolls.length > 0) {
      setValue("Paid");
      setPaidData(generatedPayrolls);
      setOpenCreateModal(false);
      return;
    }

    // if no generated payroll yet
    if (date > 24) {
      setOpenCreateModal(true);
      setStartDate(fromDate);
      setEndDate(toDate);
      fetchPayrollData();
    }
  } catch (err: any) {
    console.error("Error checking payroll status:", err.response?.data || err.message);
  }
};

useEffect(() => {
  if (!CompanyId) return; // ⏳ Wait until companyId is loaded

  const today = new Date();
  const currentPeriod = `${today.getFullYear()}-${today.getMonth() + 1}`;

  const savedPaid = localStorage.getItem(`lastPaidPayroll-${currentPeriod}`);
  const status = localStorage.getItem("status");
  const period = localStorage.getItem("payrollPeriod");

  console.log("🟡 On Mount — LocalStorage data:");
  console.log("savedPaid:", savedPaid ? JSON.parse(savedPaid) : null);
  console.log("status:", status);
  console.log("period:", period);

  if (savedPaid) {
    const parsedPaid = JSON.parse(savedPaid);
    setPaidData(parsedPaid);

    if (status === "Paid") {
      setValue("Paid");
      setIsPreview(false);
    }

    if (parsedPaid.length > 0) {
      setIshistory("preview");
    }
  } else {
    console.log("🟢 No saved data found → calling API");
    checkPayrollStatus(); // now runs only after CompanyId is available
  }
}, [CompanyId]); // 👈 runs again once getMe() finishes





  type Payroll = Payroll1 | Payroll2;
  const handleChange = (event: React.SyntheticEvent, newValue: "Unpaid" | "Paid") => {
    setValue(newValue);

    if (newValue === "Unpaid") {
      setOpenCreateModal(true);
    }
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadPayslipPDF = () => {
    const input = document.getElementById("payslip-content");
    if (!input) {
      console.error("Payslip content not found");
      return;
    }

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Payslip.pdf");
    });
  };

  const handleChange1 = (index: number, field: "bonus" | "incentive", value: string) => {
    const updated = [...previewPayroll1];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    const bonusNum = Number(updated[index].bonus) || 0;
    const incentiveNum = Number(updated[index].incentive) || 0;
    updated[index].salaryAmount = updated[index].rate + bonusNum + incentiveNum - updated[index].deduction;

    setPreviewPayroll1(updated);
  };


  const [totalPreview1, setTotalPreview1] = useState({
    workingDays: 0,
    leaveDays: 0,
    bonus: 0,
    incentive: 0,
    deduction: 0,
    salaryAmount: 0
  });


  const calculateTotal = (
    data: any[],
    fields: string[],
    setFn: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const totals: any = {};
    fields.forEach((field) => {
      totals[field] = data.reduce(
        (sum, row) => sum + (row[field] || 0),
        0
      );
    });
    setFn(totals);
  };

  useEffect(() => {
    calculateTotal(previewPayroll1, ["workingDays", "leaveDays", "bonus", "incentive", "deduction", "salaryAmount"], setTotalPreview1);
  }, [previewPayroll1]);

  const [selected, setSelected] = useState<string[]>([]);

  const currentPageIds = paidData
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row) => row.employee?.employeeId); // Use employeeId instead of EmpId

  const isAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selected.includes(id));

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected((prev) => Array.from(new Set([...prev, ...currentPageIds]))); // ✅ convert Set → Array
    } else {
      setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    }
  };

  const handleSelectRow = (empId: string) => {
    setSelected((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId) // uncheck
        : [...prev, empId] // check
    );
  };

  const fetchPayrollData = async () => {
    try {
      if (!startDate || !endDate) {
        message.error("Please select start and end date");
        return;
      }

      const companyId = CompanyId;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");

      // Ensure YYYY-MM-DD format
      const periodStart =
        startDate.length === 10 ? startDate : `${year}-${month}-${String(startDate).padStart(2, "0")}`;
      const periodEnd =
        endDate.length === 10 ? endDate : `${year}-${month}-${String(endDate).padStart(2, "0")}`;

      // Fetch payroll data
      const res = await axios.get(
        `${API_URL}/api/payroll/downloadPayrollExcel?fromDate=${periodStart}&toDate=${periodEnd}&companyId=${companyId}&year=${year}&month=${month}`
      );

      // Map backend response safely
      const payrollData = (res.data.payrolls || []).map((p: any) => ({
        _id: p._id,
        name: p.employee ? `${p.employee.firstName} ${p.employee.lastName || ""}`.trim() : "N/A",
        department: p.employee?.jobInfo?.department || "N/A",
        rate: p.grossPay || 0,
        workingDays: p.workingDays || 0,
        leaveDays: p.leaveDays || 0,
        bonus: "",
        incentive: "",
        deduction: p.totalDeduction || 0,
        salaryAmount: p.netPay || 0,
      }));

      setPreviewPayroll1(payrollData); // update state
      setPage(0);           // reset pagination
      setIsPreview(true);   // show preview table

    } catch (error) {
      console.error("Error fetching payroll:", error);
    }
  };

  const updatePayrollBackend = async () => {
    try {
      for (const row of previewPayroll1) {
        await axios.patch(
          `${API_URL}/api/payroll/updatePayroll/${row._id}`,  // ✅ ID in URL
          {
            bonus: Number(row.bonus) || 0,
            incentive: Number(row.incentive) || 0,
            netPay: Number(row.salaryAmount) || 0,
          }
        );
      }

      setCurrentStep(2);
      fetchPayrollDataStep2();
    } catch (error) {
      console.error("Error updating payroll:", error);
      message.error("Failed to update payroll.");
    }
  };

  // Your actual company ID should come from props, context, etc.

  const fetchPayrollDataStep2 = async () => {
    try {
      if (!startDate || !endDate) {
        message.error("Please select start and end date");
        return;
      }

      const companyId = CompanyId;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");

      const periodStart =
        startDate.length === 10 ? startDate : `${year}-${month}-${String(startDate).padStart(2, "0")}`;
      const periodEnd =
        endDate.length === 10 ? endDate : `${year}-${month}-${String(endDate).padStart(2, "0")}`;

      const res = await axios.get(
        `${API_URL}/api/payroll/downloadPayrollExcel?fromDate=${periodStart}&toDate=${periodEnd}&companyId=${companyId}&year=${year}&month=${month}`
      );

      const payrollData: Payroll2[] = (res.data.payrolls || []).map((p: any) => ({
        empname: p.employee ? `${p.employee.firstName} ${p.employee.lastName || ""}`.trim() : "N/A",
        department: p.employee?.jobInfo?.department || "N/A",
        workingDays: p.workingDays || 0,
        grossPay: p.grossPay || 0,
        deduction: p.totalDeduction || 0,
        netPay: p.netPay || 0,
        bonus: p.bonus || 0,
      }));

      setPreviewPayroll2(payrollData);

      const totals: Payroll2 = payrollData.reduce(
        (acc: Payroll2, cur: Payroll2) => {
          acc.workingDays += cur.workingDays;
          acc.grossPay += cur.grossPay;
          acc.deduction += cur.deduction;
          acc.netPay += cur.netPay;
          acc.bonus += cur.bonus;
          return acc;
        },
        { empname: "", department: "", workingDays: 0, grossPay: 0, deduction: 0, netPay: 0, bonus: 0 });

      setTotalPreview2(totals);
    } catch (error) {
      console.error("Error fetching step 2 payroll:", error);
    }
  };

  const handleDownload = () => {
    const data = previewPayroll2.map((row) => ({
      "Emp Name": row.empname,
      "Department": row.department,
      "Working Days": row.workingDays,
      "Gross Pay": row.grossPay,
      "Deduction": row.deduction,
      "Net Pay": row.netPay,
    }));

    data.push({
      "Emp Name": "Total",
      "Department": "",
      "Working Days": totalPreview2.workingDays,
      "Gross Pay": totalPreview2.grossPay,
      "Deduction": totalPreview2.deduction,
      "Net Pay": totalPreview2.netPay,
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Payroll.xlsx");
  };


  const filteredPaidData = paidData.filter((row) => {
    const employeeName = `${row.employee?.firstName || ""} ${row.employee?.lastName || ""}`.toLowerCase();
    const yearMatch = year ? new Date(row.paymentDate).getFullYear() === Number(year) : true;
    const monthMatch = month ? (new Date(row.paymentDate).getMonth() + 1) === Number(month) : true;
    const nameMatch = name ? employeeName.includes(name.toLowerCase()) : true;
    return yearMatch && monthMatch && nameMatch;
  });
  const handleDownloadClick = async (empId: string) => {
    try {
      const companyId = CompanyId;

      // ✅ Always use full current month if startDate/endDate not selected
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");

      // Calculate proper month range (1st → last day)
      const daysInMonth = new Date(year, parseInt(month), 0).getDate();

      // If user selected custom range, use it — otherwise full month
      const periodStart =
        startDate && startDate.length === 10
          ? startDate
          : `${year}-${month}-01`;

      const periodEnd =
        endDate && endDate.length === 10
          ? endDate
          : `${year}-${month}-${String(daysInMonth).padStart(2, "0")}`;

      console.log("✅ fromDate:", periodStart);
      console.log("✅ toDate:", periodEnd);

      const response = await axios.get(`${API_URL}/api/payroll/downloadPayrollExcel`, {
        params: {
          fromDate: periodStart,
          toDate: periodEnd,
          companyId: companyId,
          year: year,
          month: month,
        },
      });

      if (response.data.success) {
        const employeePayroll = response.data.payrolls.find(
          (payroll: any) => payroll.employee.employeeId === empId
        );

        if (employeePayroll) {
          const period = new Date(employeePayroll.periodEnd);
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];

          setSelectedEmployee1({
            Name: `${employeePayroll.employee.firstName} ${employeePayroll.employee.lastName || ""}`,
            EmpId: employeePayroll.employee.employeeId,
            Department: employeePayroll.employee.jobInfo.department,
            Designation: employeePayroll.employee.jobInfo.jobCategory || "-",
            PeriodStart: employeePayroll.periodStart,
            PeriodEnd: employeePayroll.periodEnd,
            WorkingDays: employeePayroll.workingDays,
            leaveDays: employeePayroll.leaveDays,
            salary: employeePayroll.salary,
            lop: employeePayroll.lop,
            GrossPay: employeePayroll.grossPay || "",
            Deduction: employeePayroll.totalDeduction,
            Earnings: (employeePayroll.earnings || []).map((e: any) => ({
              name: e.name,
              amount: e.amount
            })),
            Deductions: (employeePayroll.deductions || []).map((d: any) => ({
              name: d.name,
              amount: d.amount
            })),
            NetPay: employeePayroll.netPay,
            PaySlipMonth: `${monthNames[period.getMonth()]} ${period.getFullYear()}`,
            AmountInWords: toWords(Math.floor(employeePayroll.netPay)).toUpperCase(),
          });

          setOpenPayslip(true);
          setTimeout(() => downloadPayslipPDF(), 500);
        } else {
          console.error("Payroll not found for employee:", empId);
        }
      }
    } catch (error) {
      console.error("Error fetching payslip:", error);
    }
  };

  const handleDownloadExcel2 = () => {
    const table = document.querySelector("#employee-table"); // ✅ use correct table ID
    if (!table) return message.error("Employee table not found!");

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Payroll_Report.xlsx");
  };

// 🔹 Update payroll status via backend
const handlePayrollStatusUpdate = async (status: "Requested" | "Paid") => {
  try {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      message.error("User not authenticated.");
      return;
    }

    // Update all unpaid payrolls
    for (const row of unpaidData) {
      await axios.patch(
        `${API_URL}/api/payroll/updatePayroll/${row._id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // Local UI + localStorage update
    const updated = unpaidData.map(emp => ({ ...emp, status }));
    setPaidData(updated);
    setUnpaidData([]);

    const currentPeriod = `${year}-${month}`;
    localStorage.setItem(`lastPaidPayroll-${currentPeriod}`, JSON.stringify(updated));
    localStorage.setItem("status", status);
    localStorage.setItem("payrollPeriod", currentPeriod);

    if (status === "Paid") {
      message.success("Payrolls approved successfully!");
      navigate("/payroll", { state: { defaultTab: "Paid" } });
    } else {
      message.success("Payroll approval request sent to Admin.");
    }

  } catch (error: any) {
    console.error("Status update failed:", error);
    message.error(error?.response?.data?.message || "Failed to update payroll status");
  }
};


  return (
    <>{isHistory === "preview" ? <>{!isPreview ? <div style={{ backgroundColor: "#FFF" }}>
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600" }} className='m-0 p-4'>Payroll</h2>
      </div>
      <hr className='m-0' />
    </div> : <><div>
      <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-4' onClick={() => setIsPreview(false)}><FaArrowLeft className='mx-2' />Preview Payroll</h2>
    </div><hr className='m-0' /></>}

      <div className='ms-3 ps-1 pt-2'>
        <p style={{ fontWeight: 400, fontSize: "24px", color: "#353535" }}>{payrollRange}</p>
        <p style={{ fontWeight: 400, fontSize: "15px", color: "#666666" }}>Payroll Dates </p>
      </div>

      {!isPreview ? <section className='p-4 pt-3 ' style={{ backgroundColor: "#FFF", height: "100vh" }} >
        <div className='d-flex'>
          <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab value="Unpaid" label="Unpaid" />
              <Tab value="Paid" label="Paid" />
            </Tabs>

          </Box>

          {value === "Unpaid" ? (
            <Button
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#1784A2",   // teal blue
                color: "#fff",                // white text
                borderRadius: "12px",         // rounded corners
                padding: "6px 24px",          // spacing
                fontWeight: 600,              // bold text
                textTransform: "none",
                whiteSpace: "nowrap"      // keep "Run Payroll" as-is

              }}
              onClick={fetchPayrollData}
            >
              Run Payroll
            </Button>
          ) : (
            <div style={{ display: "flex", gap: "14px" }}>
              {/* Customize Button */}
              {/* <Button
                variant="contained"
                style={{
                  backgroundColor: "#1784A2",   // orange
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "4px 30px",
                  fontWeight: 600,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setOpenCustomiseModal(true)}

              >
                Customize
              </Button> */}

              <Button
                variant="contained"
                style={{
                  backgroundColor: "#1784A2",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "4px 30px",
                  fontWeight: 600,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setOpenCustomiseModal(true)}
              >
                Customize
              </Button>


              <Button
                variant="contained"
                style={{
                  backgroundColor: "#1784A2",   // teal blue
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "6px 24px",
                  fontWeight: 600,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Download
              </Button>
            </div>

          )}
        </div>
        <hr className='m-0' />

        {value === "Unpaid" && unpaidData.length > 0 && (
          <Box sx={{ mt: 3 }}>  {/* mt:3 means margin-top = 24px approx */}
            <TableContainer component={Paper}
              sx={{
                boxShadow: "0px 0px 2px 1px #00000040", // your custom shadow
                borderRadius: 2,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Emp Id</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Pay Type</TableCell>
                    <TableCell>Work Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unpaidData.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#E8F3F6", // change background on hover
                        },
                      }}
                    >
                      <TableCell>{row.employee?.firstName} {row.employee?.lastName || ""}</TableCell>
                      <TableCell>{row.employee?.employeeId}</TableCell>
                      <TableCell>{row.employee?.jobInfo?.department}</TableCell>
                      <TableCell>{row.employee?.jobInfo?.paymentType}</TableCell>
                      <TableCell>{row.employee?.workType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {value === "Paid" && paidData.length > 0 && (
          <Box sx={{ mt: 3 }}>

            <span
              style={{ color: "#1784A2", fontSize: "14px", fontWeight: 600 }}
            >
              Filter
              <MdFilterAlt />
            </span>

            <div className="d-flex justify-content-between align-items-center filter-box mb-4">
              <div style={{ width: "60%" }}>
                <div className="d-flex justify-content-start align-items-center">
                  <div className="me-2">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
                      Search by year
                    </label>
                    <br />
                    <Input
                      disableUnderline
                      value={year}
                      onChange={(e) => setYear(e.target.value)} // input for department
                      style={{
                        width: 150,
                        height: 35,
                        border: "1px solid #ccc",
                        borderRadius: "10px",  // makes it look like Select
                        padding: "0 12px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <div className="me-2">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
                      Search by month
                    </label>
                    <br />
                    <Input
                      disableUnderline
                      value={month}
                      onChange={(e) => setMonth(e.target.value)} // input for job categories
                      style={{
                        width: 150,
                        height: 35,
                        border: "1px solid #ccc",
                        borderRadius: "10px",  // makes it look like Select
                        padding: "0 12px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <div className="me-2">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
                      Search by emp name
                    </label>
                    <br />
                    <Input
                      disableUnderline
                      value={name}
                      onChange={(e) => setName(e.target.value)} // input for emp name
                      style={{
                        width: 150,
                        height: 35,
                        border: "1px solid #ccc",
                        borderRadius: "10px",  // makes it look like Select
                        padding: "0 12px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                </div>
              </div>
              <div className="me-3">
                <Button variant="contained" className="newBtn" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>

            <TableContainer component={Paper}
              sx={{
                boxShadow: "0px 0px 2px 1px #00000040",
                borderRadius: 2,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Emp Id</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Pay Type</TableCell>
                    <TableCell>Work Type</TableCell>
                    <TableCell>Pay slip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPaidData.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:hover": { backgroundColor: "#E8F3F6" } }}
                    >
                      <TableCell>{row.employee?.firstName} {row.employee?.lastName || ""}</TableCell>
                      <TableCell>{row.employee?.employeeId}</TableCell>
                      <TableCell>{row.employee?.jobInfo?.department}</TableCell>
                      <TableCell>{row.employee?.jobInfo?.paymentType}</TableCell>
                      <TableCell>{row.employee?.workType}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() => {
                            handleDownloadClick(row.employee?.employeeId)

                          }}
                          sx={{
                            color: "#353535",
                            textTransform: "none",
                            borderBottom: "1px dotted #353535",
                            padding: 0,
                            minWidth: 0,
                            fontWeight: 500,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          Download <HiDownload size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Box>
        )}

        <Modal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 700,
              height: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <IconButton
              onClick={() => setOpenCreateModal(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src="/assests//payroll/payroll.png"
              alt="Payroll"
              style={{ width: 305, height: 300, marginBottom: 16 }}
            />
            <Typography style={{ fontWeight: 400, fontSize: "18px", marginBottom: 16, marginLeft: 90, marginRight: 90 }}>
              Hey ! This month’s payroll isn’t generated yet — run it now to stay on track
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setOpenCreateModal(false);
                setOpenDateModal(true);
              }}
              style={{ backgroundColor: "#1784A2", borderRadius: "10px" }}
              className='px-4 py-2 mt-1'
            >
              Create Now
            </Button>
          </Box>
        </Modal>

        {openDateModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "#fff",
                borderRadius: "6px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                fontSize: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h6 style={{ margin: 0, fontSize: "14px" }}>Select Payroll Dates</h6>
                <button
                  onClick={() => setOpenDateModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
              <hr style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "3px", fontSize: "12px" }}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "3px", fontSize: "12px" }}>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  
                }}
              >
                <button
                  style={{
                    padding: "6px 14px",
                    width: "100px",
                    border: "1px solid #1784A2",
                    borderRadius: "4px",
                    color: "#1784A2",
                    fontSize: "12px",
                    marginLeft:"10px"
                  }}
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Reset
                </button>

                <button
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#1784A2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    width: "100px",
                    fontSize: "12px",
                    marginRight:"10px"
                  }}
                  onClick={async () => {
                    try {
                      const companyId = CompanyId;
                      if (!startDate || !endDate) {
                        message.error("Please select start and end date");
                        return;
                      }
                      const today = new Date();
                      const year = today.getFullYear();
                      const month = String(today.getMonth() + 1).padStart(2, "0");
                      const periodStart = startDate.length === 10 ? startDate : `${year}-${month}-${String(startDate).padStart(2, "0")}`;
                      const periodEnd = endDate.length === 10 ? endDate : `${year}-${month}-${String(endDate).padStart(2, "0")}`;
                      const start = new Date(periodStart);
                      const end = new Date(periodEnd);
                      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
                      const startStr = start.toLocaleDateString("en-US", options); // e.g., "Feb 24"
                      const endStr = end.toLocaleDateString("en-US", options);     // e.g., "Mar 24"
                      const yearStr = end.getFullYear();
                      const rangeStr = `${startStr} - ${endStr} ${yearStr}`;
                      await axios.post(`${API_URL}/api/payroll/generateMonthlyPayrolls`, {
                        companyId,
                        generatedBy: "68c3e59c1e21451c0529b31c",
                        periodStart,
                        periodEnd,
                      });
                      const res = await axios.get(
                        `${API_URL}/api/payroll/downloadPayrollExcel?fromDate=${periodStart}&toDate=${periodEnd}&companyId=${companyId}&year=${year}&month=${month}`
                      );

                      setUnpaidData(res.data.payrolls || []);

                      setPayrollRange(rangeStr);
                      setOpenDateModal(false);

                    } catch (error) {
                      console.error(error);
                    }
                  }}

                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {openCustomiseModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              fontSize: "12px",
            }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h6 style={{ margin: 0, fontSize: "14px" }}>Customise Payroll</h6>
                <button style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  lineHeight: 1,
                }} onClick={() => setOpenCustomiseModal(false)}>×</button>
              </div>
              <hr style={{ margin: "8px 0" }} />
              {/* ...inputs below... */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "3px", fontSize: "12px" }}>Year</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y =>
                      <option key={y} value={y}>{y}</option>
                    )}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "3px", fontSize: "12px" }}>Month</label>
                  <select
                    value={month}
                    onChange={e => setMonth(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                  >
                    {["January", "February", "March", "April", "May", "June", "July",
                      "August", "September", "October", "November", "December"].map((m, i) =>
                        <option key={i + 1} value={i + 1}>{m}</option>
                      )}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "3px", fontSize: "12px" }}>Total Days</label>
                  <input
                    type="number"
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                    value={totalDays}
                    onChange={e => setTotalDays(Number(e.target.value))}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "3px", fontSize: "12px" }}>Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                    onChange={e => setPaymentDate(e.target.value)}
                  />
                </div>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}>
                <button style={{
                  padding: "6px 14px",
                  width: "100px",
                  border: "1px solid #1784A2",
                  borderRadius: "4px",
                  color: "#1784A2",
                  fontSize: "12px",
                }} onClick={() => {
                  setYear(''); setMonth(''); setTotalDays(''); setPaymentDate('');
                }}>Reset</button>
                <button
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#1784A2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    width: "100px",
                    fontSize: "12px",
                  }}
                  onClick={handleBulkGeneratePayslip}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {/* {generatedPayslipData && generatedPayslipData.length > 0 && (
          <PayrollTable
            rows={generatedPayslipData}
            companyId={CompanyId}
            generatedById={currentUserId}
          />
        )} */}


        <Modal
          open={openPayslip}
          onClose={() => setOpenPayslip(false)}
          aria-labelledby="payslip-modal"
          aria-describedby="employee-payslip"
          sx={{
            display: "flex",
            justifyContent: "center",
            overflow: "auto",
            p: 1,
          }}
        >
          <Box
            id="payslip-content"
            sx={{
              width: "595px",       // A4 width
              height: "842px",      // A4 height
              bgcolor: "white",
              boxShadow: 24,
              borderRadius: 1,
              position: "relative",
              overflowY: "auto",    // scroll inside modal if content exceeds A4
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif",
              display: "flex",
              flexDirection: "column",
              padding: "30px",
              mt: 2,
            }}
          >
            <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="d-flex justify-content-between align-items-center  ">
                <img
                  src="/assests/payroll/tth logo.png"
                  style={{ maxWidth: "123px", maxHeight: "58px", objectFit: "contain" }}
                />
                <div className="text-end" >
                  <p className="fw-bold pb-1" style={{ margin: 0, fontSize: "12px" }}>The Tech Horse</p>
                  <p style={{ margin: 0, fontSize: "10px" }}>292, Royapettah High Rd, Ganapathy Colony, Royapettah,</p>
                  <p style={{ margin: 0, fontSize: "10px" }}> Chennai, Tamil Nadu 600014</p>

                  <p style={{ margin: 0, fontSize: "10px" }}>Phone: 8680817600, 8925790019</p>
                </div>
              </div>
              <hr style={{ border: "0", height: "1px", backgroundColor: "#5a5a5aff", margin: "5px 0" }} />

              {selectedEmployee1 && (
                <div className="d-flex flex-column" style={{ fontSize: "10px" }}>
                  <div className="d-flex justify-content-between my-2">
                    <div style={{ flex: 2, paddingRight: "10px" }}>
                      <p className="fw-bold mb-2" style={{ fontWeight: 700 }}>Employee Summary</p>
                      <div className="row mb-2">
                        <div className="col-4" style={{ fontWeight: 400 }}>Employee Name</div>
                        <div className="col-6" style={{ fontWeight: 400, color: "#666666" }}>
                          : {selectedEmployee1.Name}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4" style={{ fontWeight: 400 }}>Employee Id</div>
                        <div className="col-6" style={{ fontWeight: 400, color: "#666666" }}>
                          : {selectedEmployee1.EmpId}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4" style={{ fontWeight: 400 }}>Department</div>
                        <div className="col-6" style={{ fontWeight: 400, color: "#666666" }}>
                          : {selectedEmployee1.Department}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4" style={{ fontWeight: 400 }}>Designation</div>
                        <div className="col-6" style={{ fontWeight: 400, color: "#666666" }}>
                          : {selectedEmployee1.Designation}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4" style={{ fontWeight: 400 }}>Payment Date</div>
                        <div className="col-6" style={{ fontWeight: 400, color: "#666666" }}>
                          : {new Date(selectedEmployee1.PeriodEnd).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4" style={{ fontWeight: 400 }}>No Of Working Days</div>
                        <div className="col-6" style={{ fontWeight: 400, color: "#666666" }}>
                          : {selectedEmployee1.WorkingDays} Days
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4" style={{ fontWeight: 400 }}>No Of Leave Days</div>
                        <div className="col-6" style={{ fontWeight: 400, color: "#666666" }}>
                          : {selectedEmployee1.leaveDays} Days
                        </div>
                      </div>
                    </div>

                    <div className="text-end" style={{ flex: 1, fontSize: "10px" }}>
                      <p style={{ margin: 0, color: "#666666" }}>Pay Slip Month</p>
                      <p className="fw-bold" style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>
                        {selectedEmployee1.PaySlipMonth ?? "-"}
                      </p>
                    </div>
                  </div>
                  <table
                    className="custom-table1"
                    style={{ fontSize: "10px", width: "100%", marginBottom: "5px" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: "18px" }}>Earnings</th>
                        <th style={{ paddingRight: "18px" }}>Amount</th>
                        <th style={{ paddingLeft: "18px" }}>Deductions</th>
                        <th style={{ paddingRight: "18px" }}>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(() => {
                        // ✅ Always add "Basic" as first earning
                        const earnings = [
                          { name: "Basic", amount: selectedEmployee1?.salary || 0 },
                          ...(selectedEmployee1?.Earnings || []),
                        ];

                        // ✅ Always add "Loss of Pay" as first deduction
                        const deductions = [
                          { name: "Loss of Pay", amount: selectedEmployee1?.lop || 0 },
                          ...(selectedEmployee1?.Deductions || []),
                        ];

                        // ✅ Calculate totals
                        const totalEarnings = earnings.reduce(
                          (sum, e) => sum + (Number(e.amount) || 0),
                          0
                        );
                        const totalDeductions = deductions.reduce(
                          (sum, d) => sum + (Number(d.amount) || 0),
                          0
                        );

                        const rowCount = Math.max(earnings.length, deductions.length);

                        return (
                          <>
                            {Array.from({ length: rowCount }).map((_, idx) => {
                              const earning = earnings[idx];
                              const deduction = deductions[idx];
                              return (
                                <tr key={idx}>
                                  {/* Earnings */}
                                  <td style={{ paddingLeft: "18px" }}>{earning?.name || ""}</td>
                                  <td style={{ paddingRight: "18px" }}>
                                    {earning?.amount?.toLocaleString?.() ?? ""}
                                  </td>

                                  {/* Deductions */}
                                  <td style={{ paddingLeft: "18px" }}>{deduction?.name || ""}</td>
                                  <td style={{ paddingRight: "18px" }}>
                                    {deduction?.amount?.toLocaleString?.() ?? ""}
                                  </td>
                                </tr>
                              );
                            })}

                            <tr
                              style={{
                                fontWeight: "bold",
                                borderTop: "1px solid #ccc",
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <td style={{ paddingLeft: "18px" }}>Total</td>
                              <td style={{ paddingRight: "18px" }}>
                                {totalEarnings.toLocaleString()}
                              </td>
                              <td style={{ paddingLeft: "18px" }}>Total</td>
                              <td style={{ paddingRight: "18px" }}>
                                {totalDeductions.toLocaleString()}
                              </td>
                            </tr>
                          </>
                        );
                      })()}

                      {/* Show message if no data */}
                      {(selectedEmployee1?.Earnings?.length === 0 &&
                        selectedEmployee1?.Deductions?.length === 0) && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: "center" }}>
                              No earnings or deductions
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>



                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "10px",
                      marginTop: "10px",
                      lineHeight: "1.6",
                      width: "50%", // keeps it tidy and aligned
                    }}
                  >
                    <div className="d-flex justify-content-between mb-2" >
                      <span>Earnings</span>
                      <span>{selectedEmployee1?.GrossPay || "—"}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Deductions</span>
                      <span>{selectedEmployee1?.Deduction || "—"}</span>
                    </div>


                    <div className="d-flex justify-content-between mb-2" >
                      <span>Net Pay</span>
                      <span>{selectedEmployee1.NetPay ?? "0.00"}</span>
                    </div>

                    {/* Small gap before "Amount in Words" */}

                  </div>
                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "10px",
                      marginTop: "10px",
                      lineHeight: "1.6",
                      width: "87%", // keeps it tidy and aligned
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <span>Amount in Words:</span>
                      <span>{selectedEmployee1?.AmountInWords || "Zero"}</span>
                    </div>
                  </div>


                  <div
                    className="fw-bold text-center"
                    style={{
                      marginTop: "200px",        // adds spacing before signature
                      paddingTop: "60px",       // optional for extra gap
                      position: "relative",
                      bottom: 0,
                      width: "100%",
                    }}
                  >
                    <p style={{ margin: 0, color: "#666666" }}>****This is a system generated****</p>
                  </div>

                </div>
              )}

            </div>

          </Box>
        </Modal>

      </section> :

        <section className='p-4 pt-0'>
          {currentStep === 1 && (
            <div>
              <div className="mt-2 fw-bold">
                <p>Employees</p>
              </div>

              <div>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell className='tableHead'>Name</TableCell>
                        <TableCell className='tableHead'>Department</TableCell>
                        <TableCell className='tableHead'>Gross Salary </TableCell>
                        <TableCell className='tableHead'>Working Days</TableCell>
                        <TableCell className='tableHead'>Leave Days</TableCell>
                        <TableCell className='tableHead'>Bonus</TableCell>
                        <TableCell className='tableHead'>Incentive</TableCell>
                        <TableCell className='tableHead'>Deduction</TableCell>
                        <TableCell className='tableHead'>Net Salary</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewPayroll1
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, i) => (
                          <TableRow
                            hover
                            key={i}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell component="th" scope="row" className="tablebody">
                              {row.name}
                            </TableCell>
                            <TableCell className="tablebody">{row.department}</TableCell>
                            <TableCell className="tablebody">₹ {row.rate}</TableCell>
                            <TableCell className="tablebody">{row.workingDays}</TableCell>
                            <TableCell className="tablebody">{row.leaveDays}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={row.bonus}
                                placeholder="-"      // shows default -
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleChange1(i, "bonus", val);  // keep as string for now
                                }}
                                variant="standard"
                                InputProps={{
                                  disableUnderline: true,
                                  inputProps: { style: { width: "80px", fontWeight: 500 } },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={row.incentive}
                                placeholder="-"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleChange1(i, "incentive", val);
                                }}
                                variant="standard"
                                InputProps={{
                                  disableUnderline: true,
                                  inputProps: { style: { width: "80px", fontWeight: 500 } },
                                }}
                              />
                            </TableCell>
                            <TableCell className="tablebody">₹ {row.deduction}</TableCell>
                            <TableCell className="tablebody">₹ {row.salaryAmount}</TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell className="tablebody" style={{ border: "none" }}>
                          Total
                        </TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}></TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}></TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}>
                          {totalPreview1.workingDays}
                        </TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}>
                          {totalPreview1.leaveDays}
                        </TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}>
                        </TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}>
                        </TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}>
                          ₹ {totalPreview1.deduction}
                        </TableCell>
                        <TableCell className="tablebody" style={{ border: "none" }}>
                          ₹ {totalPreview1.salaryAmount}
                        </TableCell>
                      </TableRow>
                    </TableBody>

                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={previewPayroll1.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                  />
                  <div className='d-flex justify-content-between align-items-center px-4 p-3'>
                    <a style={{ textDecoration: "underline", textDecorationStyle: "dotted", cursor: "pointer" }}>Cancel</a>
                    <Button variant="contained" style={{ backgroundColor: "#1784A2" }} onClick={updatePayrollBackend}>Next</Button>
                  </div>
                </TableContainer>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div style={{ marginTop: "20px" }}>
                {[
                  { label: "Total Salary Amount", value: `₹ ${totalPreview2.grossPay.toFixed(2)}` },
                  { label: "Total tax", value: `₹ ${totalPreview2.bonus.toFixed(2)}` },
                  { label: "Total amount", value: `₹ ${totalPreview2.grossPay.toFixed(2)}` },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: i !== 2 ? "1px dotted #A7A7A7" : "none", // dotted line except last
                      padding: "8px 0",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 600, color: i === 2 ? "#353535" : "#666666", }}>{item.label}</p>
                    <p style={{ margin: 0, fontWeight: 600, color: i === 2 ? "#353535" : "#666666", }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 fw-bold">
                <p>Employees</p>
              </div>
              <div>
                <TableContainer component={Paper}>
                  <Table id="employee-table" sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell className='tableHead'>Emp Name</TableCell>
                        <TableCell className='tableHead'>Department</TableCell>
                        <TableCell className='tableHead'>Working Days</TableCell>
                        <TableCell className='tableHead'>Gross Pay</TableCell>
                        <TableCell className='tableHead'>Deduction</TableCell>
                        <TableCell className='tableHead'>Net Pay</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewPayroll2.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                        <TableRow
                          hover
                          key={i}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" className='tablebody'>
                            {row.empname}
                          </TableCell>
                          <TableCell className="tablebody">{row.department}</TableCell>
                          <TableCell className="tablebody">{row.workingDays}</TableCell>
                          <TableCell className="tablebody">₹ {row.grossPay}</TableCell>
                          <TableCell className="tablebody">₹ {row.deduction}</TableCell>
                          <TableCell className="tablebody">₹ {row.netPay}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className='tablebody' style={{ border: "none" }}>Total</TableCell>
                        <TableCell className='tablebody' style={{ border: "none" }}></TableCell>
                        <TableCell className='tablebody' style={{ border: "none" }}>₹ {totalPreview2.workingDays}</TableCell>
                        <TableCell className='tablebody' style={{ border: "none" }}>₹ {totalPreview2.grossPay}</TableCell>
                        <TableCell className='tablebody' style={{ border: "none" }}>₹ {totalPreview2.deduction}</TableCell>
                        <TableCell className='tablebody' style={{ border: "none" }}>₹ {totalPreview2.netPay}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={previewPayroll2.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                  />
<div className='d-flex justify-content-between align-items-center px-4 p-3'>
  <a
    style={{
      textDecoration: "underline",
      textDecorationStyle: "dotted",
      cursor: "pointer",
    }}
  >
    Cancel
  </a>
  <div>
    <a
      onClick={handleDownloadExcel2}
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        cursor: "pointer",
        paddingRight: "20px",
      }}
    >
      Download
    </a>

{userRole === "admin" ? (
  <Button
    variant="contained"
    onClick={() => handlePayrollStatusUpdate("Paid")}
  >
    Approve
  </Button>
) : (
  <Button
    variant="contained"
    color="secondary"
    onClick={() => handlePayrollStatusUpdate("Requested")}
  >
    Request
  </Button>
)}

  </div>
</div>

                </TableContainer>

              </div>
            </div>
          )}

        </section>}
    </> : isHistory === "history" ? <><div>
      <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-4' onClick={() => setIshistory("preview")}><FaArrowLeft className='mx-2' />History</h2>
    </div><hr className='m-0' />
      <History /></> : <><div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-4' onClick={() => setIshistory("preview")}><FaArrowLeft className='mx-2' />Payment successful</h2>
      </div><hr className='m-0' /><PaymentSuccess /></>}
    </>
  )
}

export default Payroll;
