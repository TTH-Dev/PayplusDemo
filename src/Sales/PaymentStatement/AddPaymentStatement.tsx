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
import { DatePicker, message, Select } from "antd";
import moment from "moment";

const { Option } = Select;
type InvoiceItem = {
  id: number;
  date: string;
  Transaction: string;
  Status: string;
  Mode: string;
  Amount: number;
  BalanceAmt: number;
  payment: number;
  invoiceNumber?: string;
  paymentNumber?: string;
};

const AddPaymentStatement = () => {

  const [filterValue, setFilterValue] = useState({
    trans: "Transaction",
    from: "",
    to: ""

  });
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [companyDropData, setCompanyDropData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState<any>("");
  const [total, setTotal] = useState({
    totalAmount: 0,
    paymentAmount: 0,
    balanceAmount: 0,
  })

  const handleCompanyChange = (value: any) => {
    setSelectedCompany(companyDropData.find((comp: any) => comp.value === value));
  };

  const fetchInvoiceData = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(
        `${API_URL}/api/customer/overallTrans/${selectedCompany.id}?trans=${filterValue.trans}&from=${filterValue.from}&to=${filterValue.to}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data.data.map((val: any) => {
        return {
          id: val._id,
          date: moment(val.invoiceDate).format("YYYY-MM-DD") || moment(val.receiptDate).format("YYYY-MM-DD"),
          invoiceNumber: val.invoiceNo,
          paymentNumber: val.receiptNo,
          number: val.invoiceNo || val.receiptNo,
          Transaction: "",
          Amount: val.total || "",
          BalanceAmt: val.latestAmount || "",
          payment: val.totalReceivedAmount || "",
          Status: val.status || "",
          Mode: val.paymentMode || "",
        }
      });

      const totals = data.reduce(
        (acc: any, curr: any) => {
          acc.totalAmount += curr.Amount;
          acc.paymentAmount += curr.payment;
          acc.balanceAmount += curr.BalanceAmt;
          return acc;
        },
        { totalAmount: 0, paymentAmount: 0, balanceAmount: 0 }
      );

      setTotal(totals);
      setData(data);
    } catch (error: any) {
      console.log(error);
    }
  }

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
        id: val._id,
        label: val.companyDetail.companyName,
        value: val.companyDetail.companyName,
      }));
      setCompanyDropData(companyNames);
    } catch (error) {
      console.log(error);
    }
  };
  


  const handlegetAddPaymentStatement = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      console.log(total, "total");
      console.log(data, "data")
      
      const tableData = data.map((val:any) => {
        return {
          date:val.date,
          dateType:filterValue.trans,
          amount: val.Amount || "",
          balanceAmount: val.BalanceAmt || "",
          payment: val.payment || "",
          status: val.Status || "",
          mode: val.Mode || "",
        }
      })
      const res = await axios.post(`${API_URL}/api/statement`,
        {
          companyName:selectedCompany.label,
          fromDate:filterValue.from,
          toDate:filterValue.to,
          total:total,
          totalReceivedAmount:total.totalAmount,
          totalBalnceAmount:total.balanceAmount,
          customerId:selectedCompany.id,
          tableData: tableData
        }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/sales/payment-statement/payment-statement-receipt/${res.data.data.invoice._id}`);
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  useEffect(() => {
    fetchInvoiceData();
  }, [selectedCompany, filterValue]);

  return (
    <>
      <div>
        <h6 className="mb-0 py-2">
          <Link
            to="/sales/payment-statement"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Add Statement
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
                width: "80%",
                height: "40px",
                borderRadius: "15px",
              }}
              className="custom-select-addq"
              placeholder="Select a company"
              // suffixIcon={<IoIosArrowDown style={{fontSize:"20px",color:"black"}} />}
              options={companyDropData.map((company: any) => ({
                value: company.value,
                label: company.label,
                style: { fontSize: "14px", color: "#333", padding: "8px" },
              }))}
              onChange={handleCompanyChange}
            ></Select>

            <br />
          </div>
        </div>
        <div className="col-lg-2">
          <div>
            <label
              className="py-2"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              From Date
            </label>
            <br />
            <DatePicker
              className="custom-date-addq"
              placeholder="Select a date"
              format="YYYY-MM-DD"
              onChange={(date, dateString: any) => setFilterValue(prev => ({
                ...prev,
                from: dateString
              }))}
            />
            <br />
          </div>
        </div>
        <div className="col-lg-1"></div>
        <div className="col-lg-2">
          <div>
            <label
              className="py-2"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              To Date
            </label>
            <br />
            <DatePicker
              className="custom-date-addq"
              placeholder="Select a date"
              format="YYYY-MM-DD"
              onChange={(date, dateString: any) => setFilterValue(prev => ({
                ...prev,
                to: dateString
              }))}
            />
            <br />
          </div>
        </div>
      </div>
      <div className="py-2 mt-4 mx-3">
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="invoice table">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Transaction",
                  "Status",
                  "Mode",
                  "Amount",
                  "Payment",
                  "Balance Amt",
                ].map((head, index) => (
                  <TableCell
                    key={head}
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#666666",
                    }}
                  >
                    {index === 1 ? (
                      <Select
                        value={filterValue.trans}
                        onChange={(value: any) => setFilterValue(prev => ({
                          ...prev,
                          trans: value
                        }))}
                        style={{
                          width: "100%",
                          border: "none",
                          boxShadow: "none",
                        }}
                        bordered={false}
                      >
                        <Option value="Transaction">Transaction</Option>
                        <Option value="Invoice">Invoice Rec</Option>
                        <Option value="Receipt">Payment Rec</Option>
                      </Select>
                    ) : (
                      head
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((val: any, index) => (
                <TableRow key={val.id}>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.date}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell>
                    {filterValue.trans === "Invoice" ? (
                      <TextField
                        value={val.invoiceNumber}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                    ) : filterValue.trans === "Receipt" ? (
                      <TextField
                        value={val.paymentNumber}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                    ) : (
                      <TextField
                        value={val.number}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                    )}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.Status}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.Mode}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>

                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.Amount}
                      variant="standard"
                      type="number"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.payment}
                      variant="standard"
                      type="number"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>

                  <TableCell style={cellStyle}>
                    <TextField
                      value={val.BalanceAmt}
                      variant="standard"
                      type="number"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow style={{ backgroundColor: "#F1F1F1" }}>
                <TableCell
                  colSpan={4}
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#353535",
                    textAlign: "left",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  className="ps-4"
                  colSpan={1}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "left",
                  }}
                >
                  {total.totalAmount}
                </TableCell>
                <TableCell
                  className="ps-4"
                  colSpan={1}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "left",
                  }}
                >
                  {total.paymentAmount}
                </TableCell>
                <TableCell
                  className="ps-4"
                  colSpan={1}
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#353535",
                    textAlign: "left",
                  }}
                >
                  {total.balanceAmount}
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
                  Received Amount:
                </TableCell>
                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    value={total.paymentAmount}
                    InputProps={{ disableUnderline: true }}
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
                  Balanced Amount
                </TableCell>
                <TableCell style={cellStyle}>
                  <TextField
                    variant="standard"
                    value={total.totalAmount}
                    InputProps={{ disableUnderline: true }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="d-flex justify-content-between">
        <span className="skipbtn-pre mb-2 pt-3">Cancel</span>
        {/* <Link
          to={
            "/sales/payment-statement/payment-statement-receipt/67d2bc38379b727843507e6e"
          }
        > */}
          <Button onClick={handlegetAddPaymentStatement} variant="contained" className="nextBtn mx-3 mb-4">
            Save
          </Button>
        {/* </Link> */}
      </div>
    </>
  );
};

const cellStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#353535",
};


export default AddPaymentStatement;
