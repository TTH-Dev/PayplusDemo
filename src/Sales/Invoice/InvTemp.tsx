import { Container } from "@mui/material";
import { Row, Col, Table, message } from "antd";
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

const InvTemp = () => {
  const { id } = useParams();

  const invoiceRef = useRef<HTMLDivElement>(null);
  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    console.log(imgData, "imgData");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save("invoice.pdf");
  };
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Service Description",
      dataIndex: "service",
      key: "service",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Charges",
      dataIndex: "charges",
      key: "charges",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Tax Amt",
      dataIndex: "taxamt",
      key: "taxAmount",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
    {
      title: "Total Amt",
      dataIndex: "totalamt",
      key: "totalAmount",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text}</span>
      ),
    },
  ];

  const [customerDta, setCoustomerDta] = useState({
    anyCharges: 0,
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
    discount: 0,
    invoiceDate: "",
    invoiceNo: "",
    paymentMode: "",
    total: 0,
    services: [
      {
        duration: "",
        serviceCharges: 0,
        serviceDescription: "",
        tax: "",
        taxAmount: 0,
        totalAmount: 0,
      },
    ],
  });

  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const [tableData, setTableData] = useState<any[]>([]);
  const fetchdata = async () => {
    const token = localStorage.getItem("authtoken");

    const response = await axios.get(`${API_URL}/api/invoice/getById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setTotal(response.data.data.invoice.total);

    const subtotal = response.data.data.invoice.services.reduce(
      (acc: number, service: any) => acc + service.totalAmount,
      0
    );
    console.log(subtotal, "subtotal");

    setSubTotal(subtotal);
    const customers = response.data.data.invoice.services.map(
      (customer: any, index: number) => ({
        sno: (index + 1).toString(),
        service: customer.serviceDescription,
        duration: customer.duration,
        charges: customer.serviceCharges,
        tax: customer.tax,
        taxamt: customer.taxAmount,
        totalamt: customer.totalAmount,
        action: "",
      })
    );
    setTableData(customers);
  };

  const getDetails = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      message.error("Login");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/invoice/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoustomerDta(res.data.data.invoice);
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

  useEffect(() => {
    fetchdata();
    getDetails();
  }, []);

  return (
    <>
      {" "}
      <div>
        <h6 className="mb-0 py-2">
          <Link
            to="/Sales/Invoice"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Back
          </Link>
        </h6>
        <hr className="m-0" />
      </div>
      <Container>
        <div
          className="text-end py-3 inv-paper mx-5"
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
              {/* <p className="inv-p">
              <span>TRN No:</span> <span>3456</span>
            </p> */}
              <p className="inv-p">
                <span>GST No:</span>{" "}
                <span>{companyData?.taxDetails?.gstNo || "-"}</span>
              </p>
            </Col>
          </Row>

          <p className="text-center inv-head">Invoice</p>
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
                <span className="inv-title"> Invoice No :</span>
                <span className="inv-p">{customerDta?.invoiceNo}</span>
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Invoice Date :</span>
                <span className="inv-p">
                  {moment(customerDta?.invoiceDate).format("DD-MM-YYYY")}
                </span>
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Payment Mode :</span>
                <span className="inv-p"> {customerDta?.paymentMode} </span>{" "}
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
            <Col span={12} style={{ textAlign: "right" }}>
              <span style={{}} className="me-3 inv-title">
                Total Tax:
              </span>
              <span className="inv-p">
                ₹{" "}
                {customerDta.services.reduce(
                  (acc, item) => acc + item.taxAmount,
                  0
                )}
              </span>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <span style={{}} className="me-3 inv-title">
                Sub Total:
              </span>
              <span className="inv-p"> ₹ {subTotal} </span>
            </Col>
          </Row>
          <Row justify="end" className="px-5 my-2">
            <Col span={24} style={{ textAlign: "right" }}>
              <span style={{}} className="me-3 inv-head">
                Total:
              </span>{" "}
              <span className="inv-title"> ₹ {total} </span>
            </Col>
          </Row>

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

export default InvTemp;
