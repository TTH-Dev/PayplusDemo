import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import { DatePicker, DatePickerProps, message, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";

type InvoiceItem = {
  id: number;
  date: string;
  invoiceNumber: string;
  invoiceAmount: number;
  outstandingAmount: number;
  payment: number;
};

const Customer = () => {
  const nameOptions = [
    { label: "cash", value: "cash" },
    { label: "card", value: "card" },
    { label: "upi", value: "upi" },
    { label: "cheque", value: "cheque" },
  ];

  const [invoiceData, setInvoiceData] = useState<InvoiceItem[]>([
    {
      id: 1,
      date: "10-2-2025",
      invoiceNumber: "201",
      invoiceAmount: 20000,
      outstandingAmount: 1000,
      payment: 3000,
    },
  ]);

  const [companyNamedrop, setCompanyNameDrop] = useState<
    { label: string; value: string }[]
  >([]);

  const getMenu = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(
        `${API_URL}/api/customer/dmenu?fields=companyDetail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const companyNames = res.data.data.customer.map((val: any) => ({
        label: val.companyDetail.companyName,
        value: val.companyDetail.companyName,
      }));

      setCompanyNameDrop(companyNames);
    } catch (error) {
      console.log(error);
    }
  };

  const handlegetCustomer = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      await axios.get(`${API_URL}/api/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await getMenu();
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  const [data, setData] = useState({
    companyName: "",
  });

  const [invoiceGetData, setInvoiceGetData] = useState<any[]>([]);

  const [postData, setPostData] = useState({
    companyName: "",
    receiptDate: dayjs(new Date()).format("YYYY-MM-DD"),
    paymentMode: "",
    customerId: "",
    receivedFullAmount: false,
    invoiceDetails: [
      {
        invoiceId: "",
        receivedAmount: 0,
        invoiceAmount: 0,
        balancedAmount: 0,
      },
    ],
    totalBalancedAmount: 0,
    totalReceivedAmount: 0,
  });

  console.log(postData, "postData");

  const getCompanyInvices = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      message.error("Please login!");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/api/invoice/filter?companyName=${data.companyName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPostData({
        ...postData,
        customerId: res.data.data.invoice[0].customerId,
      });

      const invoices = res.data.data.invoice.map((invoice: any) => {
        const serviceCharges = invoice.services?.reduce(
          (acc: number, service: any) => acc + (service.serviceCharges || 0),
          0
        );
        const taxAmount = invoice.services?.reduce(
          (acc: number, service: any) => acc + (service.taxAmount || 0),
          0
        );

        const total =
          (serviceCharges || 0) +
          (taxAmount || 0) -
          (invoice.discount || 0) +
          (invoice.anyCharges || 0);

        return {
          ...invoice,
          total: total,
          receivedAmount: invoice.receivedAmount || 0,
          balancedAmount: total - (invoice.receivedAmount || 0),
        };
      });

      setInvoiceGetData(invoices);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCellChange = (
    index: number,
    field: keyof InvoiceItem,
    value: number
  ) => {
    const updatedInvoices = [...invoiceGetData];
    updatedInvoices[index][field] = value;

    // Update received and balanced amounts dynamically
    updatedInvoices[index].receivedAmount = value;
    updatedInvoices[index].balancedAmount =
      updatedInvoices[index].total - value;

    // Recalculate total received and balanced amounts
    const totalReceivedAmount = updatedInvoices.reduce(
      (sum, invoice) => sum + (invoice.receivedAmount || 0),
      0
    );
    const totalBalancedAmount = updatedInvoices.reduce(
      (sum, invoice) => sum + (invoice.balancedAmount || 0),
      0
    );

    setInvoiceGetData(updatedInvoices);

    setPostData((prev) => ({
      ...prev,
      invoiceDetails: updatedInvoices.map((invoice) => ({
        invoiceId: invoice._id,
        receivedAmount: invoice.receivedAmount || 0,
        invoiceAmount: invoice.total || 0,
        balancedAmount: invoice.balancedAmount || 0,
      })),
      totalReceivedAmount,
      totalBalancedAmount,
    }));
  };

  const navigate=useNavigate()

  const handleRecptSave = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Login Required!");
        return;
      }
      await axios.post(`${API_URL}/api/payment-receipt`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/sales/payment-received")
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyInvices();
  }, [data]);

  useEffect(() => {
    handlegetCustomer();
  }, []);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (typeof dateString === "string") {
      setPostData({
        ...postData,
        receiptDate: dateString,
      });
    }
  };

  return (
    <>
      <div>
        <h6 className="mb-0 py-2">
          <Link
            to="/sales/payment-received"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Add Receipt
          </Link>
        </h6>
        <hr className="m-0" />
      </div>
      <div className="row mx-0 py-2">
        <div className="col-lg-3">
          <div>
            <label
              className="py-2 "
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              Company Name
            </label>
            <br />
            <Select
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "15px",
              }}
              className="custom-select-addq"
              placeholder="Select a company"
              value={data.companyName}
              onChange={(value) => {
                setData({ ...data, companyName: value });
                setPostData({ ...postData, companyName: value });
              }}
              options={companyNamedrop}
            ></Select>
            <br />
          </div>
        </div>
        <div className="col-lg-3">
          <div>
            <label
              className="py-2"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              Payment Date
            </label>
            <br />
            <DatePicker
              className="custom-date-addq"
              placeholder="Select a date"
              format="YYYY-MM-DD"
              value={postData.receiptDate ? dayjs(postData.receiptDate) : null}
              onChange={onChange}
            />
            <br />
          </div>
        </div>
        <div className="col-lg-3">
          <div>
            <label
              className="py-2"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              Payment Mode
            </label>
            <br />
            <Select
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "15px",
              }}
              className="custom-select-addq"
              placeholder="Payment Mode"
              options={nameOptions}
              value={postData.paymentMode}
              onChange={(value) =>
                setPostData({ ...postData, paymentMode: value })
              }
            ></Select>
            <br />
          </div>
        </div>
      </div>
      <p
        style={{ fontWeight: "600", fontSize: "14px", color: "#353535" }}
        className="ms-2"
      >
        Unpaid invoices
      </p>
      <div className="py-2 mt-4 mx-3">
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="invoice table">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Invoice Number",
                  "Invoice Amount",
                  "Outstanding Amount",
                  "Payment",
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
              {invoiceGetData.map((val, index) => (
                <TableRow key={val.id}>
                  <TableCell style={cellStyle}>
                    {moment(val.invoiceDate).format("DD-MM-YYYY") || "-"}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val.invoiceNo || "-"}
                  </TableCell>
                  <TableCell style={cellStyle}>{val.total}</TableCell>
                  <TableCell style={cellStyle}>{val.total}</TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.receivedAmount || 0}
                      onChange={(e) =>
                        handleCellChange(
                          index,
                          "payment",
                          Number(e.target.value) || 0
                        )
                      }
                      variant="standard"
                      type="number"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={4}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "right",
                  }}
                >
                  Received Amount:
                </TableCell>
                <TableCell style={cellStyle}>
                  ₹{postData.totalReceivedAmount?.toFixed(2) || "0.00"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "right",
                  }}
                >
                  Balanced Amount
                </TableCell>
                <TableCell style={cellStyle}>
                  ₹{postData.totalBalancedAmount?.toFixed(2) || "0.00"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="d-flex justify-content-between">
        <span className="skipbtn-pre mb-2 pt-3">Cancel</span>

        <Button
          variant="contained"
          className="nextBtn mx-3 mb-4"
          onClick={handleRecptSave}
        >
          Save
        </Button>
      </div>
    </>
  );
};

const cellStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#353535",
};

export default Customer;
