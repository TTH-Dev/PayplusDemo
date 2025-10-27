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
} from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Empty, message } from "antd";
import axios from "axios";
import { API_URL } from "../../config";
import Container from "react-bootstrap/esm/Container";

const Customer: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [companyNamedrop, setCompanyNameDrop] = useState<{ label: string; value: string }[]>([]);
  const [customerNamedrop, setcustomerNameDrop] = useState<{ label: string; value: string }[]>([]);
  const [customerEmaildrop, setcustomerEmailDrop] = useState<{ label: string; value: string }[]>([]);
  const [companyfilter, setCompanyFilter] = useState({
    companyName: "",
    emailId: "",
    empName: "",
  });
  const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
const [totalRows, setTotalRows] = useState(0);


const navigate = useNavigate();

const handleRowClick = (id: any) => {
  navigate(`/sales/customer/customer-details/${id}`); 
};

  const handleChange = (field: string, value: string) => {
    setCompanyFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleresetEmployee = () => {
    setCompanyFilter({
      companyName: "",
      emailId: "",
      empName: "",
    });

  };

  
  const handlegetCustomer = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(`${API_URL}/api/customer?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data.customer);
      const companyNames = res.data.data.customer.map((val: any) => ({
        label: val.companyDetail.companyName,
        value: val.companyDetail.companyName,
      }));
      const customerNames = res.data.data.customer.map((val: any) => ({
        label: val.contactPersonDetail.ContactName,
        value: val.contactPersonDetail.ContactName,
      }));
      const customerEmail = res.data.data.customer.map((val: any) => ({
        label: val.contactPersonDetail.emialId,
        value: val.contactPersonDetail.emialId,
      }));
  
      setCompanyNameDrop(companyNames);
      setcustomerNameDrop(customerNames)
      setcustomerEmailDrop(customerEmail)
      // setTotalRows(Math.ceil(res.data.data.totalCustomer / limit))
      setTotalRows(res.data.data.totalCustomer);
    } catch (error) {
      message.error("Something went wrong!");
    }
  };


  const handleFilter=async()=>{
    
    try{
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res=await axios.get(`${API_URL}/api/customer/filter?emailId=${companyfilter.emailId}&companyName=${companyfilter.companyName}&customerName=${companyfilter.empName}&page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(res.data.data.customers,"res");
      setData(res.data.data.customers);
      // setTotalRows(Math.ceil(res.data.data.totalCustomer / limit))
      setTotalRows(res.data.data.totalCustomer);

    }catch(error){
      console.log(error);
      message.error("Something went wrong!")
    }
  }

  useEffect(() => {
    handlegetCustomer();
  }, []);

  useEffect(()=>{
    handleFilter()
  },[companyfilter])

  useEffect(() => {
    handlegetCustomer();
  }, [page, limit]);
  
  

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
                Customer
              </span>
            </Container>
            <hr className="mt-1" />
          </div>
      <div className="d-flex justify-content-end">
        <Link
          to="/sales/add-customer"
          className="d-flex align-items-center  px-1 py-2 mx-4  cursor-pointer"
          style={{
            cursor: "pointer",
            borderBottom: "1px dashed",
            textDecoration: "none",
            color: "#000",
          }}
        >
          Add New <FaPlus className="mx-2" />
        </Link>
      </div>
      <br />
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
                value={companyfilter.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                displayEmpty
                style={{ width: 200, height: 40 }}
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
                value={companyfilter.empName}
                onChange={(e) => handleChange("empName", e.target.value)}
                displayEmpty
                style={{ width: 200, height: 40 }}
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
                Search by Email Id
              </label>
              <br />
              <Select
                value={companyfilter.emailId}
                onChange={(e) => handleChange("emailId", e.target.value)}
                displayEmpty
                style={{ width: 200, height: 40 }}
              >
                {customerEmaildrop.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="me-3">
          <label
            style={{
              marginBottom: "10px",
              fontSize: "14px",
              fontWeight: 400,
              color: "#666666",
              visibility: "hidden",
            }}
          >
            Reset btn
          </label>
          <br />
          <Button
            variant="contained"
            className="newBtn"
            onClick={handleresetEmployee}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="py-2 mt-4 mx-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
              >
                {[
                  "Company Name",
                  "Contact Person Name",
                  "Email Id",
                  "Phone no",
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
              {data.map((val) => (
                <TableRow key={val._id}
                onClick={() => handleRowClick(val._id)}
                
                >
                  <TableCell style={cellStyle}>
                    {val?.companyDetail?.companyName}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val?.contactPersonDetail?.ContactName}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val?.contactPersonDetail?.emialId}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {val?.contactPersonDetail?.phoneNumber}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {data.length===0&&<Empty/>}
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
<Outlet />

    </div>
  );
};

// Reusable cell styles
const cellStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#353535",
  cursor: "pointer",
};


export default Customer;
