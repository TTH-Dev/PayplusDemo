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

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const [invoiceData, setinvoiceData] = useState<any[]>([]);
  const [companyNamedrop, setCompanyNameDrop] = useState<
    { label: string; value: string }[]
  >([]);
  const [customerNamedrop, setcustomerNameDrop] = useState<
    { label: string; value: string }[]
  >([]);
  const [invoiceNodrop, setInvoiceNoDrop] = useState<
    { label: string; value: string }[]
  >([]);
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

  console.log(invoiceData, "invoiceData");

  const handleAddInvoice = () => {
    navigate("/sales/invoice/add-invoice");
  };
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
      const res = await axios.get(`${API_URL}/api/invoice/dmenu`, {
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
        label: val.invoiceNo,
        value: val.invoiceNo,
      }));
      setCompanyNameDrop(companyNames);
      setcustomerNameDrop(customerNames);
      setInvoiceNoDrop(invoiceNo);
    } catch (error) {
      message.error("Something went wrong!");
      console.log(error);
    }
  };

  const handleViewEmp = (id: string) => {
    navigate(`/sales/invoice/invoice-receipt/${id}`);
  };

  const handlegetCustomer = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(
        `${API_URL}/api/invoice?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const res = await axios.get(
        `${API_URL}/api/invoice/filter?invoiceNo=${invoicefilter.invoiceNo}&companyName=${invoicefilter.companyName}&customerName=${invoicefilter.customerName}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.data.customers, "res");
      setinvoiceData(res.data.data.invoice);
      setTotalRows(res.data.data.totalCustomer);
      getDropMenu();
    } catch (error) {
      console.log(error);
      message.error("Something went wrong!");
    }
  };

  useEffect(() => {
    handlegetCustomer();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [invoicefilter]);

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
            Invoice
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
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Company Name",
                  " Customer Name",
                  "Invoice no",
                  "Amount",
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
              {invoiceData.map((val) => (
                <TableRow key={val._id}>
                  <TableCell
                    onClick={() => handleViewEmp(val._id)}
                    style={cellStyle}
                  >
                    {val.invoiceDate.slice(0, 10)}
                  </TableCell>
                  <TableCell
                    onClick={() => handleViewEmp(val._id)}
                    style={cellStyle}
                  >
                    {val.companyName}
                  </TableCell>
                  <TableCell
                    onClick={() => handleViewEmp(val._id)}
                    style={cellStyle}
                  >
                    {val.customer.contactPersonDetail.ContactName}
                  </TableCell>
                  <TableCell
                    onClick={() => handleViewEmp(val._id)}
                    style={cellStyle}
                  >
                    {val.invoiceNo}
                  </TableCell>
                  <TableCell
                    onClick={() => handleViewEmp(val._id)}
                    style={cellStyle}
                  >
                    {val.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {invoiceData.length === 0 && <Empty />}
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

export default Invoice;
