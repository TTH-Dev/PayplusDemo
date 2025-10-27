import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payroll.css";
import { API_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  TextField,
} from "@mui/material";

export type EmployeeRow = {
  name: string;
  department: string;
  rate: string;
  workingDays: number;
  leaveDays: number;
  bonus: string;
  incentive: string;
  deduction: number;
  salaryAmount: number;
};

const PayrollTable: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract rows from navigation state
  const { rows: initialRows = [] } = location.state || {};

  const [rows, setRows] = useState<EmployeeRow[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ✅ Fetched from getMe
  const [companyId, setCompanyId] = useState("");
  const [generatedById, setGeneratedById] = useState("");

  // ✅ Fetch admin info
  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGeneratedById(res.data.id);
      setCompanyId(res.data.companyId);
      console.log("User data:", res.data);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  // ✅ Editable fields
  const handleChange = (
    index: number,
    key: keyof EmployeeRow,
    value: string
  ) => {
    const updated = [...rows];
    (updated[index][key] as any) =
      key === "workingDays" || key === "leaveDays" ? Number(value) : value;
    setRows(updated);
  };

  // ✅ Totals
  const totalWorkingDays = rows.reduce(
    (sum, r) => sum + (isNaN(r.workingDays) ? 0 : r.workingDays),
    0
  );
  const totalLeaveDays = rows.reduce(
    (sum, r) => sum + (isNaN(r.leaveDays) ? 0 : r.leaveDays),
    0
  );
  const totalDeduction = rows.reduce(
    (sum, r) => sum + (isNaN(r.deduction) ? 0 : r.deduction),
    0
  );
  const totalSalary = rows.reduce(
    (sum, r) => sum + (isNaN(r.salaryAmount) ? 0 : r.salaryAmount),
    0
  );

  // ✅ POST handler for Done
  const handleBulkPayslipPost = async () => {
    if (!companyId || !generatedById) {
      alert("Missing companyId or generatedById — please check your login.");
      return;
    }

    try {
      const totalDays = rows[0]?.workingDays ?? 0;

      const body = {
        companyId,
        generatedById,
        totalDays,
        rows, // Optional: include employee data if backend expects
      };

      const response = await axios.post(
        `${API_URL}/api/payroll/postcustomPayrollbulk`,
        body
      );

      if (response.status === 201 && response.data.payrolls) {
        alert("Bulk payslips created successfully!");
      } else {
        alert("Unexpected response: " + JSON.stringify(response.data));
      }
    } catch (error: any) {
      alert(
        "Bulk payslip creation failed: " +
        (error?.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="payroll-container">
      <h2 style={{ marginBottom: "4px" }}>Payroll</h2>
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: 500, fontSize: "18px" }}>
          Feb 01 - 30 2024
        </div>
        <div style={{ fontSize: "13px", color: "#686868" }}>Payroll Dates</div>
      </div>

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="payroll table"
          style={{ border: "1px solid #A7A7A7" }}
        >
          <TableHead>
            <TableRow>
              <TableCell className="tableHead">Name</TableCell>
              <TableCell className="tableHead">Department</TableCell>
              <TableCell className="tableHead">Gross Salary</TableCell>
              <TableCell className="tableHead">Working Days</TableCell>
              <TableCell className="tableHead">Leave Days</TableCell>
              <TableCell className="tableHead">Bonus</TableCell>
              <TableCell className="tableHead">Incentive</TableCell>
              <TableCell className="tableHead">Deduction</TableCell>
              <TableCell className="tableHead">Net Salary</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell className="tablebody">{row.name}</TableCell>
                  <TableCell className="tablebody">{row.department}</TableCell>

                  {/* ✅ Editable Gross Salary */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.rate}
                      onChange={(e) => handleChange(i, "rate", e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          style: { width: "90px", fontWeight: 500 },
                        },
                      }}
                    />
                  </TableCell>

                  {/* ✅ Editable Working Days */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.workingDays}
                      onChange={(e) => handleChange(i, "workingDays", e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          style: { width: "80px", fontWeight: 500 },
                        },
                      }}
                    />
                  </TableCell>

                  {/* ✅ Editable Leave Days */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.leaveDays}
                      onChange={(e) => handleChange(i, "leaveDays", e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          style: { width: "80px", fontWeight: 500 },
                        },
                      }}
                    />
                  </TableCell>

                  {/* Editable Bonus */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.bonus}
                      onChange={(e) => handleChange(i, "bonus", e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          style: { width: "80px", fontWeight: 500 },
                        },
                      }}
                    />
                  </TableCell>

                  {/* Editable Incentive */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.incentive}
                      onChange={(e) => handleChange(i, "incentive", e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          style: { width: "80px", fontWeight: 500 },
                        },
                      }}
                    />
                  </TableCell>

                  {/* ✅ Editable Deduction */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.deduction}
                      onChange={(e) => handleChange(i, "deduction", e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          style: { width: "80px", fontWeight: 500 },
                        },
                      }}
                    />
                  </TableCell>

                  {/* ✅ Editable Net Pay */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.salaryAmount}
                      onChange={(e) => handleChange(i, "salaryAmount", e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          style: { width: "100px", fontWeight: 500 },
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          className="pt-4 px-4"
        />

        {/* Footer Buttons */}
        <div className="d-flex justify-content-between align-items-center px-4 p-3">
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            sx={{
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              color: "#1784A2",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1784A2" }}
            onClick={handleBulkPayslipPost}
          >
            Done
          </Button>
        </div>
      </TableContainer>
    </div>
  );
};

export default PayrollTable;
