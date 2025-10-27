import { Button, Container } from "@mui/material";
import React from "react";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { Link } from "react-router-dom";

const Subscription = () => {
  return (
    <>
    <div className="px-3 pt-3">
      <Container>
        <div>
          <h6 className="mb-0">My Subscription </h6>
        </div>
      </Container>
      <hr />
      <section>
        <Container>
          <div className="row">
            <div className="col-lg-6">
              <div className="shadow p-4">
                <div className="d-flex justify-content-between align-items-center">
                    <p style={{fontSize:"20px",fontWeight:600,color:"#353535"}}>Current plan</p>
                    <p style={{fontSize:"14px",fontWeight:400,color:"#1C1C1C"}}><span style={{fontSize:"25px",fontWeight:500,color:"#1C1C1C"}}>$30</span>/Month</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p style={{fontSize:"14px",fontWeight:500,color:"#1C1C1C"}}>Standard Plan</p>
                    <span style={{fontSize:"14px",fontWeight:500,color:"#1C1C1C",textDecoration:"underline",textDecorationStyle:"dotted"}}>Download<MdOutlineFileDownload className="mb-1"/>
                    </span>
                </div>
                <div>
                    <ul>
                        <li>Admin - 1</li>
                        <li>Sub Admin - 10</li>
                        <li>Employee - 10</li>
                    </ul>
                    <p className="mb-1" style={{fontSize:"14px",fontWeight:500,color:"#1C1C1C"}}>Next payment date </p>
                    <p style={{fontSize:"12px",fontWeight:400,color:"#1C1C1C"}}>10 July 2024 </p>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button variant="outlined" style={{borderColor:"#1784A2",color:"#1784A2"}}>Cancel Plan </Button>
                        <Button variant="contained" style={{background:"#1784A2",borderColor:"#1784A2",color:"#fff"}}>Upgrade plan  </Button>
                    </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="shadow p-4" style={{height:"100%"}}>
                <div className="d-flex justify-content-between align-items-center">
                    <p style={{fontSize:"20px",fontWeight:600,color:"#353535"}}>Usage</p>
                </div>
                <div className="d-flex justify-content-between align-items-center" style={{width:"450px"}}>
                    <p className="mb-1" style={{fontSize:"14px",fontWeight:400,color:"#949596"}}>Admin</p>
                    <p className="mb-1 " style={{fontSize:"14px",fontWeight:400,color:"#949596"}}>1/1</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                <ProgressBar now={60} className="mb-2" style={{width:"450px"}}/><a style={{visibility:"hidden"}}> View</a>
                </div>
                <div className="d-flex justify-content-between align-items-center" style={{width:"450px"}}>
                    <p className="mb-1" style={{fontSize:"14px",fontWeight:400,color:"#949596"}}>Sub Admin</p>
                    <p className="mb-1" style={{fontSize:"14px",fontWeight:400,color:"#949596"}}>1/10</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                <ProgressBar now={60} className="mb-2" style={{width:"450px"}}/><Link to="/Accountaccess" className="mb-2" style={{cursor:"pointer",textDecoration:"underline",textDecorationStyle:"dotted",fontSize:"12px",fontWeight:400,color:"#1784A2"}}>View <IoIosArrowForward /></Link>
                </div>
                <div className="d-flex justify-content-between align-items-center" style={{width:"450px"}}>
                    <p  className="mb-1" style={{fontSize:"14px",fontWeight:400,color:"#949596"}}>Employees</p>
                    <p className="mb-1" style={{fontSize:"14px",fontWeight:400,color:"#949596"}}>1/10</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                <ProgressBar now={60} className="mb-2" style={{width:"450px"}}/><Link to="/Accountaccess"className="mb-2" style={{cursor:"pointer",textDecoration:"underline",textDecorationStyle:"dotted",fontSize:"12px",fontWeight:400,color:"#1784A2"}}>View <IoIosArrowForward />
                </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      </div>
    </>
  );
};

export default Subscription;
