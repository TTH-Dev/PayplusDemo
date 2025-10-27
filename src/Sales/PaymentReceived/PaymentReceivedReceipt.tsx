import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Row, Col, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { HiDownload } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { IoIosArrowBack } from "react-icons/io";
import { API_URL } from "../../config";

const PaymentReceivedReceipt = () => {
  const { id } = useParams();

  const invoiceRef = useRef<HTMLDivElement>(null);
  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save("Payment Statement.pdf");
  };

  const [customerDta, setCoustomerDta] = useState<any>({
    companyId: "",
    companyName: "",
    customer: {
      billingAddress: {
        organizationAddress: "",
        city: "",
        pincode: 0,
        state: "",
      },
      companyDetail: {
        companyEmailId: "",
        companyName: "",
        companyNumber: "",
        gstNumber: "",
      },
    },
    customerId: "",
    invoiceDetails: [
      {
        balancedAmount: 0,
        invoiceAmount: 0,
        receivedAmount: 0,
        _id: "",
        invoiceId: {
          invoiceNo: "",
          paymentMode: "",
        },
      },
    ],
    receiptNo: "",
  });

  const getDetails = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      message.error("Login");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/api/payment-receipt/getById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoustomerDta(res.data.data.paymentReceipt);
      await getMe();
    } catch (error) {
      console.log(error);
    }
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      message.error("Login");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     await getCompany(res.data.companyId);
    } catch (error) {
      console.log(error);
    }
  };

  const [companyData, setCompanyData] = useState<any>();

  const getCompany = async (id: any) => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      message.error("Login");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanyData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [df, setDf] = useState({
    totalReci: 0,
    totalBal: 0,
  });

  const calculateBal = () => {
    const totalReceived = customerDta.invoiceDetails.reduce(
      (total: any, item: any) => total + (item.receivedAmount || 0),
      0
    );

    const totalBalanced = customerDta.invoiceDetails.reduce(
      (total: any, item: any) => total + (item.balancedAmount || 0),
      0
    );

    setDf((prev) => ({
      ...prev,
      totalReci: totalReceived,
      totalBal: totalBalanced,
    }));
  };

  useEffect(() => {
    getDetails();
  }, []);


  useEffect(() => {
    if (customerDta.invoiceDetails.length > 0) {
      calculateBal();
    }
  }, [customerDta.invoiceDetails]);
  

  return (
    <>
      {" "}
      <div>
        <span className="mb-0 py-2">
          <Link
            to="/sales/payment-received/add-payment-received"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Back
          </Link>
        </span>
        <hr className="m-0" />
      </div>
      <Container>
        <div
          className="text-end inv-paper mx-5 py-3"
          style={{ border: "none" }}
        >
          <a
            className=""
            onClick={downloadPDF}
            style={{ cursor: "pointer", color: "black" }}
          >
            <span className="px-2 t-text">
              Download
              <HiDownload />
            </span>
          </a>
        </div>
        <div className="inv-paper mx-5 mt-2 mb-5 p-4" ref={invoiceRef}>
          <Row gutter={[16, 16]} align="top">
            <Col span={12} style={{ textAlign: "left" }}>
              <img
                src={`${API_URL}/public/images/${companyData?.OrganizationLogo}`}
                alt="Company Logo"
                style={{ width: "6rem", height: "auto" }}
              />
            </Col>
            <Col span={12} style={{ textAlign: "left", paddingLeft: "7rem" }}>
              <p className="inv-title">
                {companyData?.OrganizationName || "-"}
              </p>
              <p
                style={{
                  maxWidth: "10rem",
                  wordWrap: "break-word",
                  marginLeft: "0px",
                  textAlign: "left",
                }}
                className="inv-p"
              >
                {companyData?.address?.address +
                  "," +
                  companyData?.address?.city +
                  "," +
                  companyData?.address?.state +
                  "," +
                  companyData?.address?.pincode}
              </p>

              <p className="inv-p">
                <span>GST No:</span>{" "}
                <span>{companyData?.taxDetails?.gstNo || "-"}</span>
              </p>
            </Col>
          </Row>

          <p className="text-center inv-head">Receipt</p>
          <Row gutter={[16, 16]} align="top">
            <Col span={12} style={{ textAlign: "left", paddingLeft: "2rem" }}>
              <p className="inv-title">
                {customerDta?.customer?.companyDetail?.companyName}
              </p>
              <p
                style={{
                  maxWidth: "10rem",
                  wordWrap: "break-word",
                  marginLeft: "0px",
                  textAlign: "left",
                }}
                className="inv-p"
              >
                {customerDta?.customer?.billingAddress?.organizationAddress +
                  "," +
                  customerDta?.customer?.billingAddress?.city +
                  "," +
                  customerDta?.customer?.billingAddress?.state +
                  "," +
                  customerDta?.customer?.billingAddress?.pincode}
              </p>

              <p className="inv-p">
                <span>GST No:</span>{" "}
                <span>{customerDta?.customer?.companyDetail?.gstNumber}</span>
              </p>
            </Col>
            <Col span={12} style={{ paddingLeft: "4rem" }}>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Receipt No :</span>
                <span className="inv-p">{customerDta?.receiptNo}</span>
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Receipt Date :</span>
                <span className="inv-p">
                  {" "}
                  {moment(customerDta?.receiptDate).format("DD-MM-YYYY")}{" "}
                </span>{" "}
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Payment Mode :</span>
                <span className="inv-p">{customerDta?.paymentMode}</span>
              </p>
            </Col>
          </Row>
          <Row className="mt-2 ">
            <TableContainer>
              <Table sx={{ minWidth: 450 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Invoice No</TableCell>
                    <TableCell>Invoice Amt</TableCell>
                    <TableCell>Received Amt</TableCell>
                    <TableCell>Balance Amt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerDta.invoiceDetails.map((row: any, i: any) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {i + 1}
                      </TableCell>
                      <TableCell>{row?.invoiceId?.invoiceNo || "-"}</TableCell>
                      <TableCell>₹ {row?.invoiceAmount || "-"}</TableCell>
                      <TableCell>₹ {row?.receivedAmount || ""}</TableCell>
                      <TableCell>₹ {row?.balancedAmount || ""}</TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell style={{ border: "none" }}></TableCell>
                    <TableCell style={{ border: "none" }}></TableCell>
                    <TableCell style={{ border: "none" }}></TableCell>
                    <TableCell style={{ border: "none" }}>
                      Received amt
                    </TableCell>
                    <TableCell style={{ border: "none" }}>
                      {" "}
                      ₹ {df.totalReci || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ border: "none" }}></TableCell>
                    <TableCell style={{ border: "none" }}></TableCell>
                    <TableCell style={{ border: "none" }}></TableCell>
                    <TableCell style={{ border: "none" }}>Bal amt</TableCell>
                    <TableCell style={{ border: "none" }}>
                      {" "}
                      ₹ {df.totalBal || 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Row>

          <div>
            <>
              <span
                style={{
                  fontWeight: "500",
                  fontSize: "8px",
                  color: "#353535",
                }}
              >
                Description :{" "}
              </span>
              <span
                style={{
                  fontWeight: "400",
                  fontSize: "8px",
                  color: "#656565",
                }}
              >
                Kindly Use this receipt for personal reference only
              </span>
            </>
          </div>

          <div className="mx-5 text-end" style={{ marginTop: "3rem" }}>
            <img
              style={{ width: "70px" }}
              src={`${API_URL}/public/images/${companyData?.signatureDocuments?.signatureStampDocument}`}
              alt="sign"
              className="img-fluid"
              loading="lazy"
            />
            <p className="auth-text">Authorized Signature </p>
          </div>
          <Row justify="center" style={{ margin: "3rem 0 2rem 0" }}>
            <p className="auth-text">Thank you for your business With us ! </p>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default PaymentReceivedReceipt;
