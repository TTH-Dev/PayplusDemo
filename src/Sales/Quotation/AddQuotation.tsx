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
import { CiCirclePlus } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import { DatePicker, message, Select } from "antd";
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

const AddQuotation = () => {
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

  const [data, setData] = useState({
    companyName: "",
    quotationDate: dayjs(new Date()).format("YYYY-MM-DD"),
    paymentMode: "",
    customerId: "",
    expiryDate: dayjs(new Date()).format("YYYY-MM-DD"),
    notes: "",
    termsAndConditions: "",
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
    discount: "",
    anyCharges: 0,
    total: 0,
    status: "Sent",
  });

  const [additionalData, setAdditionalData] = useState({
    discount: 0,
    anyCharges: 0,
    total: 0,
    subTotal: 0,
  });

  const [companyDrop, setCompanyDrop] = useState<any[]>([]);
  const [disCountWay, setDisCountWay] = useState("percentage");

  const [companyNamedrop, setCompanyNameDrop] = useState<
    { label: string; value: string }[]
  >([]);

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
    if (field === "serviceCharges" || field === "tax") {
      const serviceCharges = updatedData[index].serviceCharges || 0;
      const tax = updatedData[index].tax || 0;
      updatedData[index].taxAmount = (serviceCharges * tax) / 100;
    }
    const {
      serviceCharges = 0,
      taxAmount = 0,
      discount = 0,
      additionalCharges = 0,
    } = updatedData[index];

    updatedData[index].totalAmount =
      serviceCharges + taxAmount + additionalCharges - discount;
    setInvoiceData(updatedData);
  };

  const calculateTaxAmount = (serviceCharges: number, tax: number) => {
    return (serviceCharges * tax) / 100;
  };

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
      const companyNames = res.data.data.customer.map((val: any) => ({
        label: val.companyDetail.companyName,
        value: val.companyDetail.companyName,
      }));

      setCompanyNameDrop(companyNames);
    } catch (error: any) {
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
      (val) => val.companyDetail.companyName === data.companyName
    );

    const updatedData = {
      ...data,
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
      discount: String(additionalData?.discount),
      anyCharges: additionalData?.anyCharges,
      total: additionalData?.total,
      discountType:disCountWay
    };

    if (!updatedData.companyName) {
      message.error("Required company name!");
      return;
    }

    try {
      const res=await axios.post(`${API_URL}/api/quotation`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Added successfully");
      navigate(`/sales/quotation/quotation-receipt/${res.data.data.quotatation._id}`);
    } catch (error: any) {
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
      const res = await axios.get(`${API_URL}/api/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await getMenu();
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  useEffect(() => {
    handlegetCustomer();
  }, []);

  const calculateTotalAmount = () => {
    const subTotal = invoiceData.reduce(
      (acc, item) => acc + (item.totalAmount || 0),
      0
    );

    let discountAmount = 0;

    if (disCountWay === "percentage") {
      discountAmount = (subTotal * additionalData.discount) / 100;
    } else if (disCountWay === "rupees") {
      discountAmount = additionalData.discount;
    }

    const total = subTotal - discountAmount;

    setAdditionalData((prev) => ({
      ...prev,
      total,
    }));
  };

  // Trigger recalculation when discount or method changes
  useEffect(() => {
    calculateTotalAmount();
  }, [invoiceData, additionalData.discount, disCountWay]);

  return (
    <>
      <div>
        <h6 className="mb-0 py-2">
          <Link
            to="/sales/quotation"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Add Quotation
          </Link>
        </h6>
        <hr className="m-0" />
      </div>

      <div className="row mx-0 py-2">
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
              options={companyNamedrop}
              onChange={(value) => setData({ ...data, companyName: value })}
            ></Select>
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
              Quotation Date
            </label>
            <br />
            <DatePicker
              className="custom-date-addq"
              placeholder="Select a date"
              format="YYYY-MM-DD"
              value={data.quotationDate ? dayjs(data.quotationDate) : null}
              onChange={(date, dateString) =>
                setData({
                  ...data,
                  quotationDate: Array.isArray(dateString)
                    ? dateString[0]
                    : dateString,
                })
              }
            />
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
              Expiry Date
            </label>
            <br />
            <DatePicker
              className="custom-date-addq"
              placeholder="Select a date"
              format="YYYY-MM-DD"
              value={data.expiryDate ? dayjs(data.expiryDate) : null}
              onChange={(date, dateString) =>
                setData({
                  ...data,
                  expiryDate: Array.isArray(dateString)
                    ? dateString[0]
                    : dateString,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="row mx-0 py-2">
        <div className="col-lg-6">
          <div>
            <label
              className="py-2"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              Notes
            </label>
            <br />
            <textarea
              className="p-2"
              rows={3}
              style={{ width: "90%", borderRadius: "10px" }}
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
            ></textarea>
          </div>
        </div>
        <div className="col-lg-6">
          <div>
            <label
              className="py-2"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              Terms and Condition
            </label>
            <br />
            <textarea
              className="p-2"
              rows={3}
              style={{ width: "90%", borderRadius: "10px" }}
              value={data.termsAndConditions}
              onChange={(e) =>
                setData({ ...data, termsAndConditions: e.target.value })
              }
            ></textarea>
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
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={invoiceData[index].taxAmount}
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
                      value={invoiceData[index].totalAmount}
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
                  Sub Total:
                </TableCell>

                <TableCell style={cellStyle}>
                  <TextField
                    style={{ visibility: "hidden" }}
                    variant="standard"
                    value={additionalData.discount}
                    InputProps={{ disableUnderline: true }}
                    onChange={(e) =>
                      setAdditionalData({
                        ...additionalData,
                        discount: Number(e.target.value),
                      })
                    }
                  />
                </TableCell>
                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    value={invoiceData.reduce(
                      (acc, val) => acc + val.totalAmount,
                      0
                    )}
                    InputProps={{ disableUnderline: true }}
                    // onChange={(e) =>
                    //   setAdditionalData({
                    //     ...additionalData,
                    //     subTotal: Number(e.target.value),
                    //   })
                    // }
                    disabled
                  />
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
                  Discount:
                </TableCell>

                <TableCell style={cellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <TextField
                      variant="standard"
                      value={additionalData.discount}
                      InputProps={{ disableUnderline: true }}
                      onChange={(e) =>
                        setAdditionalData({
                          ...additionalData,
                          discount: Number(e.target.value),
                        })
                      }
                    />
                    <Select
                      style={{ minWidth: "60px" }}
                      options={[
                        { value: "percentage", label: "%" },
                        { value: "rupees", label: "₹" },
                      ]}
                      value={disCountWay}
                      onChange={(value) => setDisCountWay(value)}
                    />
                  </div>
                </TableCell>

                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    value={
                      invoiceData.reduce(
                        (acc, val) => acc + val.totalAmount,
                        0
                      ) - additionalData.total
                    }
                    InputProps={{ disableUnderline: true }}
                    onChange={(e) =>
                      setAdditionalData({
                        ...additionalData,
                        total: Number(e.target.value),
                      })
                    }
                    disabled
                  />
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
                  Total:
                </TableCell>
                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    style={{ visibility: "hidden" }}
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
                    disabled
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

export default AddQuotation;
