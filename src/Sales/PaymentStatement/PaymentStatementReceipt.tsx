import { Container } from "@mui/material";
import { Row, Col, Table, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { HiDownload } from "react-icons/hi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { IoIosArrowBack } from "react-icons/io";
import { API_URL } from "../../config";

const PaymentStatementReceipt = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState({
    totalAmount: "",
    paymentAmount: "",
    balanceAmount: ""
  });


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
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{moment(text).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      title: "Transaction",
      dataIndex: "dateType",
      key: "transaction",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Balance Amt",
      dataIndex: "balanceAmount",
      key: "balanceamt",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
  ];

  const [tableData, setTableData] = useState<any[]>([]);
  const fetchdata = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        console.error("No token found, redirecting to login...");
        return;
      }
      const response = await axios.get(`${API_URL}/api/statement/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTableData(response.data.data.invoice.tableData);
      setData(response.data.data.invoice);
      setTotal(response.data.data.invoice.total);
    } catch (error: any) {
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

      getCompany(res.data.companyId);
    } catch (error) {
      console.log(error);
    }
  };


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

  useEffect(() => {
    getMe();
    fetchdata();
  }, []);

  return (
    <>
      {" "}
      <div>
        <h6 className="mb-0 py-2">
          <Link
            to="/sales/payment-statement"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Back
          </Link>
        </h6>
        <hr className="m-0" />
      </div>
      <Container>
        <div className="text-end py-3  mx-5 inv-paper" style={{border:"none"}}>
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
              {/*             <img
              src={`${API_URL}/public/images/${companyData?.OrganizationLogo}`}
              alt="Company Logo"
              style={{ width: "6rem", height: "auto" }}
            /> */}
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
              {/* <p className="inv-p">
              <span>TRN No:</span> <span>3456</span>
            </p> */}
              <p className="inv-p">
                <span>GST No:</span>{" "}
                <span>{companyData?.taxDetails?.gstNo || "-"}</span>
              </p>
            </Col>
          </Row>

          <p className="text-center inv-head">Statement</p>
          <Row gutter={[16, 16]} align="top">
            <Col span={12} style={{ textAlign: "left", paddingLeft: "2rem" }}>
              <p className="inv-title">
                {data?.customer?.companyDetail?.companyName || "-"}
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
                {data?.customer?.billingAddress?.organizationAddress +
                  "," +
                  data?.customer?.billingAddress?.city +
                  "," +
                  data?.customer?.billingAddress?.state +
                  "," +
                  data?.customer?.billingAddress?.pincode}
              </p>

              <p className="inv-p">
                <span>GST No:</span>{" "}
                <span>{data?.customer?.companyDetail?.gstNumber || "0"}</span>
              </p>
            </Col>
            <Col span={12} style={{ paddingLeft: "4rem" }}>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Statement No :</span>
                <span className="inv-p">{data?.statementNo}</span>
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> From Date :</span>
                <span className="inv-p">
                  {moment(data?.fromDate).format("DD-MM-YYYY")}
                </span>
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> To Date :</span>
                <span className="inv-p"> {moment(data?.toDate).format("DD-MM-YYYY")} </span>{" "}
              </p>
            </Col>
          </Row>
          <Row className="mt-2 ">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              style={{ width: "100%" }}
              className="custom-table"
            />
          </Row>
          <Row justify="end" className="px-5 my-2">
            <Col span={8} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{}} className="me-3 inv-title">
                Invoiced Amt :
              </span>
              <span className="inv-p"> ₹ {total.totalAmount} </span>
            </Col>
          </Row>
          <Row justify="end" className="px-5 my-2">
            <Col span={8} style={{display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{}} className="me-3 inv-title">
                Received Amt
              </span>
              <span className="inv-p">
                ₹{total.paymentAmount}
              </span>
            </Col>
          </Row>
          <Row justify="end" className="px-5 my-2">
            <Col span={8} style={{display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{}} className="me-3 inv-title">
                Bal amt:
              </span>{" "}
              <span className="inv-title"> ₹ {total.balanceAmount} </span>
            </Col>
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

export default PaymentStatementReceipt;
