import { TableCell, TableRow } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { IoIosArrowBack } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config'

const SalaryDetail = () => {
  const { id } = useParams();
  const [Emplpoyees, setEmplpoyees] = useState<any>([]);


  const fetchEmployee = async () => {
    const token = localStorage.getItem("authtoken");

    try {
      // Make the API call to get pending location change requests
      const response = await axios.get(`${API_URL}/api/employee/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, "response");
      setEmplpoyees(response.data);
      console.log(Emplpoyees, "Employee");

    } catch (err) {
      console.log(err);

    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const navigate = useNavigate()
  const handleedit = () => {
    navigate(`/EditTeam/${id}`)
  }

  return (
    <>
      <section className="py-2">
        <Container>
          <div>
            <h6 className="mb-0">
              <Link
                to="/Team"
                style={{ textDecoration: "none", color: "#353535" }}
              >
                <IoIosArrowBack className="mb-1" />
                View Salary
              </Link>
            </h6>
          </div>
        </Container>
        <hr className="mt-1" />
        <Container>
          <div className="text-end pb-2">
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#353535",
                textDecoration: "underLine",
                textDecorationStyle: "dotted",
              }}
              onClick={handleedit}
            >
              Edit
              <MdEdit className="mb-1" />
            </span>
          </div>

          <div className="shadow">
            <div className="row px-4 py-3 m-0 justify-content-between align-items-center">
              <div className="col-lg-2">
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <div style={{ borderRadius: "50%", position: "relative" }}>
                      <img
                        src={Emplpoyees?.profileimage || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                        style={{
                          width: "134px",
                          height: "134px",
                          borderRadius: "50%",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                        }}
                      />
                      <div className="hourly text-center">
                        <span>{Emplpoyees?.employeeId}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-3">
                  <p
                    className="mb-0"
                    style={{ fontSize: "1rem", fontWeight: 600 }}
                  >{Emplpoyees?.firstName} {Emplpoyees?.lastName} </p>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    {Emplpoyees?.jobInfo?.position}
                  </span>
                </div>
              </div>
              <div className="col-lg-2 px-0">
                <div>
                  <p
                    className="mb-1"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Salary information
                  </p>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Payment type
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      {Emplpoyees?.jobInfo?.paymentType}{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ {Emplpoyees?.jobInfo?.paymentAmount}
                    </TableCell>
                  </TableRow>

                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ -
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ 10,000
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ 10,000
                    </TableCell>
                  </TableRow>

                </div>
              </div>
              <div className="col-lg-2 px-0">
                <div>
                  <p
                    className="mb-1"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Loan information
                  </p>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Loan amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Loan interest
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Total months
                    </TableCell>
                    <TableCell
                      className=" py-1"
                      style={{ border: "none" }}
                    >
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      EMIamount
                    </TableCell>
                    <TableCell
                      className=" py-1"
                      style={{ border: "none" }}
                    >
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Total amount
                    </TableCell>
                    <TableCell
                      className=" py-1"
                      style={{ border: "none" }}
                    >
                      -
                    </TableCell>
                  </TableRow>



                </div>
              </div>
              <div className="col-lg-2 px-0">
                <div>
                  <p
                    className="mb-1"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Penalty
                  </p>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Penalty name
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ 10,000
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ 10,000
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ 10,000
                    </TableCell>
                  </TableRow>

                </div>
              </div>
              <div className="col-lg-2 px-0">
                <div>
                  <p
                    className="mb-1"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Expense
                  </p>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Expense name
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ 10,000
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ visibility: "hidden" }}>
                    <TableCell
                      className="px-0 py-1"
                      style={{
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell className=" py-1" style={{ border: "none" }}>
                      ₹ 10,000
                    </TableCell>
                  </TableRow>

                </div>
              </div>
            </div>
          </div>

<div className="shadow mt-4 p-4 rounded bg-white">
  <div className="row">
    {/* Earnings Section */}
    <div className="col-md-6 px-5">
      <p className="mb-3" style={{ fontSize: "18px", fontWeight: 500 }}>Earnings</p>

      {[
        // ✅ Always add "Basic Salary" first
        { name: "Basic Salary", period: "Monthly", INR: Emplpoyees?.jobInfo?.paymentAmount || 0, isDefault: true },
        ...(Emplpoyees?.salaryBreakdown?.earnings?.filter((e: any) => e.isSelected) || []),
      ].map((earning: any, idx: number) => (
        <div key={idx} className="d-flex justify-content-between mb-2">
          <span>
            {earning.name}
            {earning.period ? ` (${earning.period})` : ""}
          </span>
          <span>₹ {earning.INR?.toFixed(2) || "0.00"}</span>
        </div>
      ))}
    </div>

    {/* Deduction Section */}
    <div className="col-md-6 px-5">
      <p className="mb-3" style={{ fontSize: "18px", fontWeight: 500 }}>Deduction</p>

      {Emplpoyees?.salaryBreakdown?.deductions
        ?.filter((d: any) => d.isSelected)
        .map((deduction: any, idx: number) => {
          // ✅ Detect percentage vs fixed amount using "unit"
          const totalEarningsBeforeDeduction =
            (Emplpoyees?.jobInfo?.paymentAmount || 0) +
            (Emplpoyees?.salaryBreakdown?.earnings
              ?.filter((e: any) => e.isSelected)
              .reduce((t: number, e: any) => t + e.INR, 0) || 0);

          const deductionValue =
            deduction.unit === "%"
              ? (deduction.INR / 100) * totalEarningsBeforeDeduction
              : deduction.INR;

          return (
            <div key={idx} className="d-flex justify-content-between mb-2">
              <span>
                {deduction.name} ({deduction.period})
                {deduction.unit === "%" && ` (${deduction.INR}%)`}
              </span>
              <span>₹ {deductionValue.toFixed(2)}</span>
            </div>
          );
        })}
    </div>
  </div>

  {/* Totals */}
  <div className="row pt-3 fw-bold">
    {/* Earnings Total */}
    <div className="col-md-6 px-5 d-flex justify-content-between">
      <span>Total</span>
      <span>
        ₹{" "}
        {(
          (Emplpoyees?.jobInfo?.paymentAmount || 0) +
          (Emplpoyees?.salaryBreakdown?.earnings
            ?.filter((e: any) => e.isSelected)
            .reduce((total: number, e: any) => total + e.INR, 0) || 0)
        ).toFixed(2)}
      </span>
    </div>

    {/* Deductions Total */}
    <div className="col-md-6 px-5 d-flex justify-content-between">
      <span>Total</span>
      <span>
        ₹{" "}
        {(() => {
          const totalEarningsBeforeDeduction =
            (Emplpoyees?.jobInfo?.paymentAmount || 0) +
            (Emplpoyees?.salaryBreakdown?.earnings
              ?.filter((e: any) => e.isSelected)
              .reduce((t: number, e: any) => t + e.INR, 0) || 0);

          return (
            Emplpoyees?.salaryBreakdown?.deductions
              ?.filter((d: any) => d.isSelected)
              .reduce((total: number, d: any) => {
                const deductionValue =
                  d.unit === "%"
                    ? (d.INR / 100) * totalEarningsBeforeDeduction
                    : d.INR;
                return total + deductionValue;
              }, 0) || 0
          ).toFixed(2);
        })()}
      </span>
    </div>
  </div>

  {/* Net Pay */}
  <div className="row mt-4 ms-4">
    <div className="col-md-12 text-start">
      <p className="fw-bold m-0" style={{ fontSize: "18px" }}>
        Net Pay&nbsp;
        <span style={{ color: "#353535", paddingLeft: "300px" }}>
          ₹{" "}
          {(() => {
            const totalEarnings =
              (Emplpoyees?.jobInfo?.paymentAmount || 0) +
              (Emplpoyees?.salaryBreakdown?.earnings
                ?.filter((e: any) => e.isSelected)
                .reduce((total: number, e: any) => total + e.INR, 0) || 0);

            const totalDeductions =
              (Emplpoyees?.salaryBreakdown?.deductions
                ?.filter((d: any) => d.isSelected)
                .reduce((total: number, d: any) => {
                  const deductionValue =
                    d.unit === "%"
                      ? (d.INR / 100) * totalEarnings
                      : d.INR;
                  return total + deductionValue;
                }, 0) || 0);

            return (totalEarnings - totalDeductions).toFixed(2);
          })()}
        </span>
      </p>
    </div>
  </div>
</div>

        </Container>
      </section>
    </>
  )
}

export default SalaryDetail