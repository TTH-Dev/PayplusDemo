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
  TextField,
} from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Empty, message } from "antd";
import { API_URL } from "../../config";
import Container from "react-bootstrap/esm/Container";
import moment from "moment";

const Paymentreceived: React.FC = () => {
  const navigate = useNavigate();
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


  const handleAddInvoice = () => {
    navigate("/sales/payment-received/add-payment-received");
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
      const res = await axios.get(`${API_URL}/api/payment-receipt/dmenu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const companyNames = res.data.data.paymentReceipt.map((val: any) => ({
        label: val.companyName,
        value: val.companyName,
      }));
      const customerNames = res.data.data.paymentReceipt.map((val: any) => ({
        label: val.customer.contactPersonDetail.ContactName,
        value: val.customer.contactPersonDetail.ContactName,
      }));
      const invoiceNo = res.data.data.paymentReceipt.map((val: any) => ({
        label: val.receiptNo,
        value: val.receiptNo,
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
    navigate(`/sales/payment-received/payment-received-receipt/${id}`);
  };

  const [receiptData, setReceiptData] = useState<any[]>([]);

  const handlegetReceipt = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(
        `${API_URL}/api/payment-receipt/filter?companyName=${invoicefilter.companyName}&customerName=${invoicefilter.customerName}&receiptNo=${invoicefilter.invoiceNo}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.data.paymentReceipt);
      setReceiptData(res.data.data.paymentReceipt);
      setTotalRows(res.data.data.totalCustomer);
      await getDropMenu();
     
    } catch (error) {
      message.error("Something went wrong!");
    }
  };



  useEffect(() => {
    handlegetReceipt();
  }, []);



  useEffect(() => {
    handlegetReceipt();
  }, [page, limit,invoicefilter]);

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
            Payment Received
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
                Search by Rec No
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
          <Table sx={{ minWidth: 650 }} aria-label="invoice table">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Receipt No",
                  "Company Name",
                  "Customer Name",
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
              {receiptData.map((val) => (
                <TableRow key={val._id} onClick={() => handleViewEmp(val._id)}>
                <TableCell style={cellStyle}>
                    {moment(val.receiptDate).format("DD-MM-YYYY") || "-"}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val.receiptNo || "N/A"}
                  </TableCell>
                  <TableCell style={cellStyle}>{val.companyName}</TableCell>
                  <TableCell style={cellStyle}>
                    {val.customer.contactPersonDetail.ContactName}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    ₹{val.totalReceivedAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {receiptData.length === 0 && <Empty />}
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

const cellStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#353535",
  cursor: "pointer",
};

export default Paymentreceived;
