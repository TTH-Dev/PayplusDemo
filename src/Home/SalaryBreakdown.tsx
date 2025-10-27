import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

interface JobInfo {
  paymentAmount: any;
  paymentType?: number | string; // can be number or string
}

interface SalaryBreakdownProps {
  jobInfo: JobInfo; // coming from parent
  onNext: (data: any) => void;
  onPrev: () => void;
}

const SalaryBreakdown: React.FC<SalaryBreakdownProps> = ({ jobInfo, onNext, onPrev }) => {
  const [salaryData, setSalaryData] = useState<any>({});
  const [enabledRows, setEnabledRows] = useState<{ [key: string]: boolean }>({});
  const [basicSalary, setBasicSalary] = useState(0);

  // set basic salary from jobInfo.paymentType
useEffect(() => {
  if (jobInfo?.paymentAmount) {
    const basic = Number(jobInfo.paymentAmount);
    setBasicSalary(basic);

    setSalaryData((prev: any) => ({
      ...prev,
      "Basic-Period": prev["Basic-Period"] || "Monthly",
      "Basic-Amount-value": basic.toString(),  // convert to string for input
      "Basic-Amount-type": "INR",
    }));

    setEnabledRows((prev) => ({ ...prev, Basic: true })); // Always enabled
  } else {
    setBasicSalary(0);
  }
}, [jobInfo]);


  const handleChange = (key: string, value: string) => {
    setSalaryData((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleRow = (rowKey: string) => {
    setEnabledRows((prev) => ({ ...prev, [rowKey]: !prev[rowKey] }));
  };

  // earnings rows
  const earningRows = [
    { title: "Basic", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "House Rent Allowance", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Conveyance Allowance", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Dearness Allowance", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Leave Travel Allowance", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Medical Allowance", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Overtime Pay", fields: [{ key: "OvertimeHours", label: "Hours" }, { key: "Amount", label: "Rate (INR/hr)" }] },
    { title: "Gratuity", fields: [{ key: "Period" }, { key: "Amount" }] },
  ];

  // deduction rows
  const deductionRows = [
    { title: "Provident Fund", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Professional Tax", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Income Tax (TDS)", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Employee State Insurance (ESI)", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Loan Repayments", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Advance Salary Deductions", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Health/Medical Insurance", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "Education Loan", fields: [{ key: "Period" }, { key: "Amount" }] },
    { title: "House Loan", fields: [{ key: "Period" }, { key: "Amount" }] },
  ];

  const parseNumber = (v: any) => {
    if (v === undefined || v === null || v === "") return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };

  const calculateEarnings = () => {
    let gross = parseNumber(basicSalary);
    const breakdown: Record<string, number> = { Basic: parseNumber(basicSalary) };

    earningRows.forEach((row) => {
      if (!enabledRows[row.title]) return;
      if (row.title === "Basic") return;

      if (row.title === "Overtime Pay") {
        const hours = parseNumber(salaryData["Overtime Pay-OvertimeHours"]);
        const rate = parseNumber(salaryData["Overtime Pay-Amount-value"]);
        const amt = hours * rate;
        gross += amt;
        breakdown[row.title] = amt;
      } else {
        const value = parseNumber(salaryData[`${row.title}-Amount-value`]);
        const type = salaryData[`${row.title}-Amount-type`] || "%";
        const amt = type === "%" ? (parseNumber(basicSalary) * value) / 100 : value;
        gross += amt;
        breakdown[row.title] = amt;
      }
    });

    return { gross, breakdown };
  };

const calculateDeductions = (gross: number) => {
  let total = 0;
  const breakdown: Record<string, number> = {};

  deductionRows.forEach((row) => {
    if (!enabledRows[row.title]) return;

    const value = parseNumber(salaryData[`${row.title}-Amount-value`]);
    const type = salaryData[`${row.title}-Amount-type`] || "%";
    let amt = 0;

    if (row.title === "Provident Fund") {
      // PF is always % of basic
      amt = (parseNumber(basicSalary) * value) / 100;
    } 
    else if (row.title === "Employee State Insurance (ESI)") {
      // Apply only if gross <= 21000
      if (gross <= 21000) {
        amt = (gross * 0.75) / 100; // 0.75% of gross
      }
    } 
    else {
      // General deduction: % of gross or fixed
      amt = type === "%" ? (gross * value) / 100 : value;
    }

    total += amt;
    breakdown[row.title] = amt; // Always record value (even if 0)
  });

  return { total, breakdown };
};


  const getSummary = () => {
    const { gross, breakdown: earnings } = calculateEarnings();
    const { total: deductions, breakdown: deductionsBreakdown } = calculateDeductions(gross);
    const netSalary = gross - deductions;
    return { basicSalary, gross, deductions, netSalary, earnings, deductionsBreakdown };
  };

const handleNextStep = () => {
  const summary = getSummary();

  // Transform earnings
  const earningsArray = Object.keys(summary.earnings)
  .filter((key) => key !== "Basic")
  .map((key) => ({
    name: key,
    period: salaryData[`${key}-Period`] || "Monthly", // fallback
    INR: summary.earnings[key] || 0,
    unit: salaryData[`${key}-Amount-type`] || "%",
    isSelected: enabledRows[key] || key === "Basic", // Basic is always selected
  }));

  // Transform deductions
  const deductionsArray = Object.keys(summary.deductionsBreakdown).map((key) => ({
    name: key,
    period: salaryData[`${key}-Period`] || "Monthly",
    INR: parseNumber(salaryData[`${key}-Amount-value`]) || 0,
    unit: salaryData[`${key}-Amount-type`] || "%",
    isSelected: enabledRows[key] || false,
  }));

  const salaryBreakdownToSend = {
    earnings: earningsArray,
    deductions: deductionsArray,
    totalEarnings: summary.gross,
    totalDeduction: summary.deductions,
    netSalary: summary.netSalary,
  };

  onNext(salaryBreakdownToSend);
};


  const renderCardRows = (rows: typeof earningRows) =>
    rows.map((row, idx) => {
      const isEnabled = enabledRows[row.title] || false;

      return (
        <div key={idx} className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ fontSize: 14, fontWeight: 600, color: "#353535" }}>{row.title}</span>
            {row.title === "Basic" ? (
              <span style={{ fontSize: 12, color: "#777" }}>Fixed</span>
            ) : (
              <Form.Check
                type="switch"
                id={`${row.title}-${idx}-switch`}
                checked={isEnabled}
                onChange={() => toggleRow(row.title)}
              />
            )}
          </div>

          <div className="row g-3">
            {row.fields.map((field: any, index: number) => {
              const idBase = `${row.title}-${field.key}`;

              if (field.key === "Period") {
                return (
                  <div className="col-12 col-md-6" key={index}>
                    <Form.Group>
                      <Form.Label>{field.key}</Form.Label>
                      <Form.Select
                        disabled={row.title !== "Basic" && !isEnabled}
                        value={salaryData[`${row.title}-Period`] || ""}
                        onChange={(e) => handleChange(`${row.title}-Period`, e.target.value)}
                      >
                        <option value="">Select Period</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Daily">Daily</option>
                        <option value="Yearly">Yearly</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                );
              }

              if (field.key === "OvertimeHours") {
                return (
                  <div className="col-12 col-md-6" key={index}>
                    <Form.Group>
                      <Form.Label>{field.label || "Hours"}</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        disabled={!isEnabled}
                        value={salaryData[idBase] || ""}
                        onChange={(e) => handleChange(idBase, e.target.value)}
                        placeholder="Enter overtime hours"
                      />
                    </Form.Group>
                  </div>
                );
              }

              if (field.key === "Amount") {
                return (
                  <div className="col-12 col-md-6" key={index}>
                    <Form.Group>
                      <Form.Label>{field.label || "Amount"}</Form.Label>
                      <div style={{ position: "relative", width: "100%" }}>
                        <Form.Control
                          type="text"
                          inputMode="decimal"
                          placeholder={row.title === "Overtime Pay" ? "Rate per hour (INR)" : "Enter value"}
                          disabled={row.title !== "Basic" && !isEnabled}
                          value={salaryData[`${row.title}-Amount-value`] || ""}
                          onChange={(e) => handleChange(`${row.title}-Amount-value`, e.target.value)}
                          style={{ paddingRight: 110 }}
                        />

                        {row.title !== "Overtime Pay" ? (
                          <Form.Select
                            disabled={row.title !== "Basic" && !isEnabled}
                            value={salaryData[`${row.title}-Amount-type`] || "%"}
                            onChange={(e) => handleChange(`${row.title}-Amount-type`, e.target.value)}
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              height: "100%",
                              width: 100,
                              border: "none",
                              background: "transparent",
                              fontWeight: 600,
                            }}
                          >
                            <option value="%">%</option>
                            <option value="INR">INR</option>
                          </Form.Select>
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              height: "100%",
                              width: 100,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                            }}
                          >
                            INR/hr
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </div>
                );
              }

              return (
                <div className="col-12 col-md-6" key={index}>
                  <Form.Group>
                    <Form.Label>{field.key}</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={row.title !== "Basic" && !isEnabled}
                      value={salaryData[idBase] || ""}
                      onChange={(e) => handleChange(idBase, e.target.value)}
                    />
                  </Form.Group>
                </div>
              );
            })}
          </div>
        </div>
      );
    });

  const summary = getSummary();

  return (
    <div className="container mt-4">
      <p className="mb-4">Salary Breakdown</p>

      <div className="row">
        {/* Earnings */}
        <div className="col-12 col-md-6 d-flex flex-column">
          <Card className="p-3 h-100">
            <Card.Title>Earnings</Card.Title>
            <hr className="my-2" />
            {renderCardRows(earningRows)}
          </Card>

          <div className="d-flex justify-content-between align-items-center mt-3 px-2">
            <span>Total Earnings (Gross)</span>
            <span>{summary.gross.toFixed(2)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="col-12 col-md-6 d-flex flex-column">
          <Card className="p-3 h-100">
            <Card.Title>Deductions</Card.Title>
            <hr className="my-2" />
            {renderCardRows(deductionRows)}
          </Card>

          <div className="d-flex justify-content-between align-items-center mt-3 px-2">
            <span>Total Deductions</span>
            <span>{summary.deductions.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="d-flex justify-content-between align-items-center mt-4 px-2">
        <span>Net Salary</span>
        <span>{summary.netSalary.toFixed(2)}</span>
      </div>

      <div className="py-3 d-flex justify-content-between align-items-center mt-3">
        <a className="skipbtn" onClick={onPrev}>
          Back
        </a>
          <Button
            variant="contained"
            className="nextBtn me-3 text-white"
            onClick={handleNextStep}
          >
            Next
          </Button>
      </div>
    </div>
  );
};

export default SalaryBreakdown;
