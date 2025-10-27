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
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import { DatePicker, DatePickerProps, message } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";

type InvoiceItem = {
  id: number;
  serviceDescription: string;
  duration: string;
  serviceCharges: number;
  tax: number;
  taxAmount: number;
  totalAmount: number;
  discount: number;
  additionalCharges: number;
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
      serviceDescription: "",
      duration: "",
      serviceCharges: 0,
      tax: 0,
      taxAmount: 0,
      totalAmount: 0,
      discount: 0,
      additionalCharges: 0,
    },
  ]);

  const handleAddRow = () => {
    setInvoiceData([
      ...invoiceData,
      {
        id: invoiceData.length + 1,
        serviceDescription: "",
        duration: "",
        serviceCharges: 0,
        tax: 0,
        taxAmount: 0,
        totalAmount: 0,
        discount: 0,
        additionalCharges: 0,
      },
    ]);
  };

  const handleCellChange = <K extends keyof InvoiceItem>(
    index: number,
    field: K,
    value: InvoiceItem[K]
  ) => {
    const updatedData = [...invoiceData];
    updatedData[index][field] = value;
    setInvoiceData(updatedData);
  };

  const calculateTaxAmount = (serviceCharges: number, tax: number) => {
    return (serviceCharges * tax) / 100;
  };

  // Calculate total discount, additional charges and total sum for the summary row
  const calculateSummary = () => {
    const totalDiscount = invoiceData.reduce(
      (sum, row) => sum + row.discount,
      0
    );
    const totalAdditionalCharges = invoiceData.reduce(
      (sum, row) => sum + row.additionalCharges,
      0
    );
    const totalAmount = invoiceData.reduce(
      (sum, row) => sum + row.totalAmount,
      0
    );
    return { totalDiscount, totalAdditionalCharges, totalAmount };
  };

  const [data, setData] = useState([
    {
      companyName: "",
      invoiceDate: "",
      paymentMode: "",
      customerId: "",
      services: [
        {
          serviceDescription: "",
          duration: "",
          serviceCharges: 0,
          tax: "",
          taxAmount: 0,
          totalAmount: 0,
        },
      ],
      discount: 0,
      anyCharges: 0,
      total: 0,
    },
  ]);

  const [dropData, setDropData] = useState<{
    companyName: String;
    invoiceDate: Date | null;
    paymentMode: String;
  }>({
    companyName: "",
    invoiceDate: null,
    paymentMode: "",
  });

  const [additionalData, setAdditionalData] = useState({
    discount: 0,
    anyCharges: 0,
    total: 0,
    discountType: "percentage",
  });

  const [companyDrop, setCompanyDrop] = useState<any[]>([]);

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
      setCompanyDrop(res.data.data.customer);
      console.log(res.data.data.customer, "resresres");
      const companyNames = res.data.data.customer.map((val: any) => ({
        label: val.companyDetail.companyName,
        value: val.companyDetail.companyName,
      }));

      setCompanyNameDrop(companyNames);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const hanldeSave = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      message.error("Please login !");
      return;
    }

    const dfd = companyDrop.filter(
      (val) => val.companyDetail.companyName === dropData.companyName
    );

    const updatedData = {
      ...data[0],
      companyName: dropData?.companyName,
      invoiceDate: dropData?.invoiceDate,
      paymentMode: dropData?.paymentMode,
      customerId: dfd[0]?._id,
      services: invoiceData.map((item) => ({
        serviceDescription: item?.serviceDescription,
        duration: item?.duration,
        serviceCharges: item?.serviceCharges,
        tax: item?.tax,
        taxAmount: calculateTaxAmount(item?.serviceCharges, item?.tax),
        totalAmount:
          calculateTaxAmount(item?.serviceCharges, item?.tax) +
          item?.serviceCharges,
      })),
      discount: additionalData?.discount,
      anyCharges: additionalData?.anyCharges,
      total: additionalData?.total,
    };

    if (
      !updatedData.companyName ||
      !updatedData.invoiceDate ||
      !updatedData.paymentMode
    ) {
      message.error("Required company name,invoiceDate,paymentMode!");
      return;
    }

    if (
      invoiceData.some(
        (item) =>
          !item.duration ||
          isNaN(Number(item.duration)) ||
          Number(item.duration) <= 0
      )
    ) {
      message.error("Please enter duration!");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/invoice`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Added successfully");
      navigate("/sales/invoice/invoice-receipt/67d2bc10379b727843507e2d");
    } catch (error) {
      console.log(error);
    }
  };

  const [companyNamedrop, setCompanyNameDrop] = useState<
    { label: string; value: string }[]
  >([]);

  const handlegetCustomer = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(`${API_URL}/api/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data.data.customer, "ress");

      await getMenu();
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDropData({ ...dropData, invoiceDate: date ? date.toDate() : null });
  };

  useEffect(() => {
    handlegetCustomer();
  }, []);

  return (
    <>
      <div>
        <h6 className="mb-0 py-2">
          <Link
            to="/Sales/Invoice"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Add invoice
          </Link>
        </h6>
        <hr className="m-0" />
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-start align-items-center">
            <div className="mx-4">
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Company Name
              </label>
              <br />
              <Select
                value={dropData.companyName}
                onChange={(e) =>
                  setDropData({ ...dropData, companyName: e.target.value })
                }
                displayEmpty
                style={{ width: 200, height: 35 }}
              >
                {companyNamedrop.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Search by Email Id */}
            <div className="mx-4">
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Invoice Date
              </label>
              <br />
              <div
                style={{
                  width: "200px",
                  overflow: "hidden",
                  border: "1px solid #000",
                  borderRadius: "5px",
                }}
              >
                <DatePicker
                  onChange={onChange}
                  value={
                    dropData.invoiceDate ? dayjs(dropData.invoiceDate) : null
                  }
                />
              </div>
            </div>
            <div className="mx-4">
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Payment Mode
              </label>
              <br />
              <Select
                value={dropData.paymentMode}
                onChange={(e) =>
                  setDropData({ ...dropData, paymentMode: e.target.value })
                }
                displayEmpty
                style={{ width: 200, height: 35 }}
              >
                {nameOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 mt-4 mx-3">
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="invoice table">
            <TableHead>
              <TableRow>
                {[
                  "S.No",
                  "Service Description",
                  "Duration *",
                  "Service Charges",
                  "Tax",
                  "Tax Amount",
                  "Total Amount",
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
              {invoiceData.map((val, index) => (
                <TableRow key={val.id}>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.id}
                      onChange={(e) =>
                        handleCellChange(index, "id", +e.target.value)
                      }
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.serviceDescription}
                      onChange={(e) =>
                        handleCellChange(
                          index,
                          "serviceDescription",
                          e.target.value
                        )
                      }
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.duration}
                      onChange={(e) =>
                        handleCellChange(index, "duration", e.target.value)
                      }
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.serviceCharges}
                      onChange={(e) =>
                        handleCellChange(
                          index,
                          "serviceCharges",
                          +e.target.value
                        )
                      }
                      variant="standard"
                      type="number"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.tax}
                      onChange={(e) =>
                        handleCellChange(index, "tax", +e.target.value)
                      }
                      variant="standard"
                      type="number"
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={calculateTaxAmount(val.serviceCharges, val.tax)}
                      onChange={(e) =>
                        handleCellChange(index, "taxAmount", +e.target.value)
                      }
                      variant="standard"
                      type="number"
                      InputProps={{ disableUnderline: true }}
                      disabled
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={
                        calculateTaxAmount(val.serviceCharges, val.tax) +
                        val.serviceCharges
                      }
                      onChange={(e) =>
                        handleCellChange(index, "totalAmount", +e.target.value)
                      }
                      variant="standard"
                      type="number"
                      InputProps={{ disableUnderline: true }}
                      disabled
                    />
                  </TableCell>
                </TableRow>
              ))}

              {/* Summary Rows */}
              {/* Summary Rows for Total Amount */}
              <TableRow>
                <TableCell
                  colSpan={6}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "right",
                  }}
                >
                  Discount:
                </TableCell>

                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    value={additionalData.discount}
                    InputProps={{
                      disableUnderline: true,
                      // endAdornment: (
                      //   // <InputAdornment position="end">
                      //   //   {additionalData.discountType === "percentage" ? "%" : "₹"}
                      //   // </InputAdornment>
                      // ),
                    }}
                    onChange={(e) =>
                      setAdditionalData({
                        ...additionalData,
                        discount: Number(e.target.value),
                      })
                    }
                  />
                </TableCell>
                {/* <TableCell style={cellStyle}>
  <Select
    value={additionalData.discountType}
    // onChange={(e) =>
    //   setAdditionalData({
    //     ...additionalData,
    //     discountType: e.target.value as "percentage" | "rupees",
    //   })
    // }
    disableUnderline
    variant="standard"
    style={{ minWidth: "60px", marginLeft: "8px" }} // Adjust spacing
  >
    <MenuItem value="percentage">%</MenuItem>
    <MenuItem value="rupees">₹</MenuItem>
  </Select>
</TableCell> */}
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={6}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "right",
                  }}
                >
                  Additional Charges:
                </TableCell>
                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    value={additionalData.anyCharges}
                    InputProps={{ disableUnderline: true }}
                    onChange={(e) =>
                      setAdditionalData({
                        ...additionalData,
                        anyCharges: Number(e.target.value),
                      })
                    }
                  />
                </TableCell>
              </TableRow>

              <TableRow> 
                <TableCell
                  colSpan={6}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "right",
                  }}
                >
                  Total:
                </TableCell>
                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    value={additionalData.total}
                    InputProps={{ disableUnderline: true }}
                    onChange={(e) =>
                      setAdditionalData({
                        ...additionalData,
                        total: Number(e.target.value),
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <p onClick={handleAddRow} className="ms-4" style={{ cursor: "pointer" }}>
        <CiCirclePlus style={{ fontSize: "24px" }} className="pb-1" /> Add New
        Row
      </p>

      <div className="d-flex justify-content-between">
        <span className="skipbtn-pre mb-2 pt-3">Cancel</span>
        <Button
          variant="contained"
          className="nextBtn mx-3 mb-4"
          onClick={hanldeSave}
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

const datepick: React.CSSProperties = {
  width: "100px",
};

export default Customer;
