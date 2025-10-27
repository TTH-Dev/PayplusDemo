import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Empty, message } from "antd";
import { API_URL } from "../../config";
import Container from "react-bootstrap/esm/Container";


const PaymentStatement: React.FC = () => {
  const navigate = useNavigate()
    const [data, setData] = useState<any[]>([]);
  const [companyNamedrop, setCompanyNameDrop] = useState<{ label: string; value: string }[]>([]);
  const [customerNamedrop, setcustomerNameDrop] = useState<{ label: string; value: string }[]>([]);
  const [invoiceNodrop, setInvoiceNoDrop] = useState<{ label: string; value: string }[]>([]);
  const [invoicefilter, setInvoiceFilter] = useState({
    companyName: "",
    customerName: "",
    invoiceNo: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const handleChange = (field: string, value: string) => {
    setInvoiceFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleAddInvoice = () => {
    navigate("/sales/payment-statement/add-payment-statement")

  }
  const handleresetEmployee = () => {
    setInvoiceFilter({
      companyName: "",
      customerName: "",
      invoiceNo: "",
    });
  };

  const getDropMenu = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(`${API_URL}/api/statement/dmenu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const companyNames = res.data.data.invoice.map((val: any) => ({
        label: val.companyName,
        value: val.companyName,
      }));
      const customerNames = res.data.data.invoice.map((val: any) => ({
        label: val.customer.contactPersonDetail.ContactName,
        value: val.customer.contactPersonDetail.ContactName,
      }));
      const invoiceNo = res.data.data.invoice.map((val: any) => ({
        label: val.statementNo,
        value: val.statementNo,
      }));
      setCompanyNameDrop(companyNames);
      setcustomerNameDrop(customerNames);
      setInvoiceNoDrop(invoiceNo);
    }
    catch (error) {
      message.error("Something went wrong!");
      console.log(error);
    }
  }


  const handleViewEmp = (id: string) => {
    console.log("View Employee:", id);
    navigate(`/Sales/Invoice/InvTemp/${id}`)
  };
  const statementData = [
    {
      _id: "1",
      statementDate: "2024-03-10T12:00:00Z",
      companyName: "ABC Pvt Ltd",
      customer: {
        contactPersonDetail: { ContactName: "John Doe" },
      },
      statementNo: "STMT-2024-001",
      balanceAmount: 10500.75,
    },
    {
      _id: "2",
      statementDate: "2024-03-11T12:00:00Z",
      companyName: "XYZ Enterprises",
      customer: {
        contactPersonDetail: { ContactName: "Jane Smith" },
      },
      statementNo: "STMT-2024-002",
      balanceAmount: 20500.5,
    },
    {
      _id: "3",
      statementDate: "2024-03-12T12:00:00Z",
      companyName: "Tech Solutions Ltd",
      customer: {
        contactPersonDetail: { ContactName: "Mike Johnson" },
      },
      statementNo: "STMT-2024-003",
      balanceAmount: 30500.0,
    },
    {
      _id: "4",
      statementDate: "2024-03-13T12:00:00Z",
      companyName: "Global Traders",
      customer: {
        contactPersonDetail: { ContactName: "Emily Davis" },
      },
      statementNo: "STMT-2024-004",
      balanceAmount: 40500.99,
    },
  ];


  const handlegetCustomer = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(`${API_URL}/api/statement?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data.invoice.map((val: any) => {
        return {
          _id: val._id,
          statementDate:val.statementDate,
          companyName: val.customer.companyDetail.companyName,
          customer : val.customer.contactPersonDetail.ContactName,
          statementNo: val.statementNo,
          balanceAmount: val.totalBalnceAmount,
        }
      });
      setData(data);
      getDropMenu();
      setTotalRows(res.data.result);
    } catch (error) {
      message.error("Something went wrong!");
    }
  };


  const handleFilter = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(`${API_URL}/api/statement/filter?statementNo=${invoicefilter.invoiceNo}&companyName=${invoicefilter.companyName}&customerName=${invoicefilter.customerName}&page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data.invoice.map((val: any) => {
        return {
          _id: val._id,
          statementDate:val.statementDate,
          companyName: val.customer.companyDetail.companyName,
          customer : val.customer.contactPersonDetail.ContactName,
          statementNo: val.statementNo,
          balanceAmount: val.totalBalnceAmount,
        }
      });
      setData(data);
      setTotalRows(res.data.data.totalCustomer);
    } catch (error) {
      console.log(error);
      message.error("Something went wrong!")
    }
  }


  const navStatement=(id:any)=>{
    navigate(`/sales/payment-statement/payment-statement-receipt/${id}`)
  }

  useEffect(() => {
    getDropMenu();
    handlegetCustomer();
  }, []);

  useEffect(() => {
    handleFilter()
  }, [invoicefilter])

  useEffect(() => {
    handlegetCustomer();
  }, [page, limit]);


  return (
    <div>
      <div className="pt-3">
        <Container>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#353535",
              cursor: "pointer",
            }}
          >
            Payment Statement
          </span>
        </Container>
        <hr className="mt-1" />
      </div>
      <div className="d-flex justify-content-end">
        <p
          className="d-flex align-items-center  px-1 py-2 mx-4  cursor-pointer"
          style={{ cursor: "pointer", borderBottom: "1px dashed" }}
          onClick={handleAddInvoice}
        >
          Add New <FaPlus className="mx-2" />
        </p>
      </div>
      <br />
      <span
        className="ms-3"
        style={{
          color: "#1784A2",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Filter
        <MdFilterAlt />
      </span>

      {/* Filters */}
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
                Search by Company Name
              </label>
              <br />
              <Select
                value={invoicefilter.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                displayEmpty
                style={{ width: 150, height: 35 }}
              >
                {companyNamedrop.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Search by Name */}
            <div className="me-4">
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Search by Name
              </label>
              <br />
              <Select
                value={invoicefilter.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                displayEmpty
                style={{ width: 150, height: 35 }}
              >
                {customerNamedrop.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Search by Email Id */}
            <div className="me-4">
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Search by Invoice no
              </label>
              <br />
              <Select
                value={invoicefilter.invoiceNo}
                onChange={(e: any) => handleChange("invoiceNo", e.target.value)}
                displayEmpty
                style={{ width: 150, height: 35 }}
              >
                {invoiceNodrop.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="me-3">
          <Button
            variant="contained"
            className="newBtn"
            onClick={handleresetEmployee}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="py-2 mt-4 mx-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="statement table">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Company Name",
                  "Customer Name",
                  "Statement No",
                  "Balance Amt",
                ].map((head) => (
                  <TableCell
                    key={head}
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#666666",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((val:any) => (
                <TableRow key={val._id} onClick={()=>navStatement(val._id)}>
                  <TableCell style={cellStyle}>
                    {val.statementDate.slice(0, 10)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val.companyName}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val.customer}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val.statementNo}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    ₹{val.balanceAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </div>
      {data.length === 0 && <Empty />}
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={totalRows}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={(event, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(event) => {
          setLimit(parseInt(event.target.value, 10));
          setPage(1);
        }}
      />
    </div>
  );
};

// Reusable cell styles
const cellStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#353535",
  cursor: "pointer",
};

export default PaymentStatement;
