import { Container } from "@mui/material";
import { Row, Col, Table, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { HiDownload } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { IoIosArrowBack } from "react-icons/io";
import { API_URL } from "../../config";
import { RxLoop } from "react-icons/rx";

const QuotationReceipt = () => {
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
    pdf.save("Payment Statement.pdf");
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
      title: "Charges",
      dataIndex: "charges",
      key: "charges",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>₹ {text}</span>
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>{text} %</span>
      ),
    },
    {
      title: "Tax Amount",
      dataIndex: "taxamt",
      key: "taxamt",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400" }}>₹ {text}</span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalamt",
      key: "totalamt",
      render: (text: string) => (
        <span style={{ fontSize: "9px", fontWeight: "400"}}>₹ {text}</span>
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
    discount: "",
    quotationDate: "",
    quotationNo: "",
    expiryDate: "",
    discountType:"",
    total: 0,
    notes: "",
    termsAndConditions: "",
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
  const [invoiceConvert,setInvoiceConvert]=useState({
    companyName:"",
    invoiceDate:new Date(),
    paymentMode:"",
    customerId:"",
    services:[{
        serviceDescription:"",
        duration:"",
        serviceCharges:0,
        tax:"",
        taxAmount:0,
        totalAmount:0
    }],
    discount:"",
    anyCharges:0,
    total:0
  })

  
  const fetchdata = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const response = await axios.get(
        `${API_URL}/api/quotation/getById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setInvoiceConvert(response.data.data.quotatation);

      setTotal(response.data.data.quotatation.total);

      const subtotal = response.data.data.quotatation.services.reduce(
        (acc: number, service: any) => acc + service.totalAmount,
        0
      );

      setSubTotal(subtotal);
      const customers = response.data.data.quotatation.services.map(
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
      setCoustomerDta(response.data.data.quotatation);
      await getMe();
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

const navigate=useNavigate()

  const handleConvertInvoice = () => {
   const dfs={
      companyName: invoiceConvert.companyName,
      invoiceDate: new Date(), 
      paymentMode: "", 
      customerId: invoiceConvert.customerId,
      services: invoiceConvert.services.map((service) => ({
        serviceDescription: service.serviceDescription,
        duration: service.duration || "", 
        serviceCharges: service.serviceCharges,
        tax: service.tax,
        taxAmount: service.taxAmount,
        totalAmount: service.totalAmount,
      })),
      discount: invoiceConvert.discount,
      total: invoiceConvert.total,
      anyCharges: 0,
    };
    sessionStorage.setItem("editInvoiceData",JSON.stringify(dfs))
    navigate("/sales/invoice/edit-invoice")
  };
  

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <>
      {" "}
      <div>
        <h6 className="mb-0 py-2">
          <Link
            to="/sales/quotation"
            style={{ textDecoration: "none", color: "#000" }}
          >
            <IoIosArrowBack className="mb-1" />
            Back
          </Link>
        </h6>
        <hr className="m-0" />
      </div>
      <Container>
        <div className="text-end py-3 inv-paper mx-5" style={{border:"none"}}>

          <a
            className=""
            onClick={downloadPDF}
            style={{ cursor: "pointer", color: "black",borderBottom: "1px dashed black",textDecoration:"none" }}
          >
            <span className="t-text">
              Download
              <HiDownload className="ms-1"/>
            </span>
          </a>
          <a
            className="ms-3"
            onClick={handleConvertInvoice}
            style={{ cursor: "pointer", color: "black",borderBottom: "1px dashed black",textDecoration:"none" }}
          >
            <span className=" t-text">
            Convert to invoice
            <RxLoop className="ms-1"/>
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

          <p className="text-center inv-head">Quotation</p>
          <Row gutter={[16, 16]} align="top">
            <Col span={12} style={{ textAlign: "left", paddingLeft: "2rem" }}>
              <p className="inv-title">{customerDta?.companyName}</p>
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
                <span className="inv-title"> Quote No :</span>
                <span className="inv-p">{customerDta?.quotationNo}</span>
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Quote Date :</span>
                <span className="inv-p">
                  {moment(customerDta?.quotationDate).format("DD-MM-YYYY")}
                </span>
              </p>
              <p style={{ textAlign: "left" }} className="ps-5 mar">
                <span className="inv-title"> Expiry Date :</span>
                <span className="inv-p">
                  {" "}
                  {moment(customerDta?.expiryDate).format("DD-MM-YYYY")}{" "}
                </span>{" "}
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
          <Row className=" my-2 justify-content-between px-1">
            <Col span={12} style={{ textAlign: "left" }}>
              <span
                style={{
                  fontWeight: "500",
                  fontSize: "10px",
                  color: "#353535",
                }}
              >
                Note:
              </span>
              <br />
              <span
                style={{ fontWeight: "400", fontSize: "9px", color: "#656565" }}
              >
                {customerDta?.notes}
              </span>
              <br />
              <span
                style={{
                  fontWeight: "500",
                  fontSize: "10px",
                  color: "#353535",
                }}
              >
                Terms & Condition:
              </span>
              <br />
              <span
                style={{ fontWeight: "400", fontSize: "9px", color: "#656565" }}
              >
                {customerDta?.termsAndConditions}
              </span>
            </Col>

            {/* Wrapping all financial details in one column to maintain alignment */}
            <Col span={8} style={{ textAlign: "right" }}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="me-3 inv-title">Sub Total:</span>
                <span className="inv-p me-5"> ₹ {subTotal} </span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span className="me-3 inv-title">Discount:</span>
                <span className="inv-p me-5">
                 {customerDta.discount} {customerDta.discountType==="rupees"?"₹":"%"}
                </span>
              </div>
              {/* <div>
                <span className="me-3 inv-title">Tax Amt:</span>
                <span className="inv-p">
                  ₹{" "}
                  {customerDta.services.reduce(
                    (acc, item) => acc + item.taxAmount,
                    0
                  )}
                </span>
              </div> */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="me-3" style={{fontSize:"12px",fontWeight:600}}>Total Amt:</span>
                <span className="inv-title me-5"> ₹ {total} </span>
              </div>
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

export default QuotationReceipt;
