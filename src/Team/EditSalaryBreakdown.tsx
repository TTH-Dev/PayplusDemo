import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

interface SalaryItem {
  name: string;
  period: string;
  INR: number;
  unit: string;
  isSelected: boolean;
}

interface SalaryBreakdownData {
  earnings: SalaryItem[];
  deductions: SalaryItem[];
  totalEarnings: number;
  totalDeduction: number;
  netSalary: number;
}

interface Props {
  onNext: (data: SalaryBreakdownData) => void;
  onPrev: () => void;
}

const EditSalaryBreakdown: React.FC<Props> = ({ onNext, onPrev }) => {
  const { id } = useParams();
  const [salaryData, setSalaryData] = useState<Record<string, string | number>>({});
  const [enabledRows, setEnabledRows] = useState<Record<string, boolean>>({});
  const [basicSalary, setBasicSalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
  gross: 0,
  deductions: 0,
  netSalary: 0,
});


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

  const handleChange = (key: string, value: string | number) => {
    setSalaryData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleRow = (key: string) => {
    setEnabledRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
  if (loading) return; // avoid running before data load

  const { gross, deductions, netSalary } = getSummary();
  setSummary({ gross, deductions, netSalary });
}, [salaryData, enabledRows, basicSalary]);


const fetchSalaryBreakdown = async () => {
  const token = localStorage.getItem("authtoken");
  try {
    const res = await axios.get(`${API_URL}/api/employee/getById/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const employee = res.data;
    const breakdown: SalaryBreakdownData = employee.salaryBreakdown;

    const basic = breakdown.earnings.find((e) => e.name === "Basic")?.INR ?? 0;
    setBasicSalary(basic); // ✅ set first

    const tempData: Record<string, string | number> = {};
    const tempEnabled: Record<string, boolean> = {};

    // ✅ Fill after knowing basic
    breakdown.earnings.forEach((e) => {
      tempData[`${e.name}-Period`] = e.period ?? "Monthly";
      if (e.unit === "%") {
        const percentage = basic > 0 ? (e.INR / basic) * 100 : 0;
        tempData[`${e.name}-Amount-value`] = percentage;
      } else {
        tempData[`${e.name}-Amount-value`] = e.INR ?? 0;
      }
      tempData[`${e.name}-Amount-type`] = e.unit ?? "%";
      tempEnabled[e.name] = e.isSelected ?? false;
    });

    breakdown.deductions.forEach((d) => {
      tempData[`${d.name}-Period`] = d.period ?? "Monthly";
      if (d.unit === "%") {
        const percentage = basic > 0 ? (d.INR / basic) * 100 : 0;
        tempData[`${d.name}-Amount-value`] = percentage;
      } else {
        tempData[`${d.name}-Amount-value`] = d.INR ?? 0;
      }
      tempData[`${d.name}-Amount-type`] = d.unit ?? "%";
      tempEnabled[d.name] = d.isSelected ?? false;
    });

    setSalaryData(tempData);
    setEnabledRows(tempEnabled);
    setLoading(false);
  } catch (err) {
    setError("Failed to fetch salary breakdown.");
    setLoading(false);
  }
};


  useEffect(() => {
    fetchSalaryBreakdown();
  }, [id]);

  /** 🔹 Calculation logic same as Jobinfo */
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
        amt = (parseNumber(basicSalary) * value) / 100;
      } else if (row.title === "Employee State Insurance (ESI)") {
        if (gross <= 21000) amt = (gross * 0.75) / 100;
      } else {
        amt = type === "%" ? (gross * value) / 100 : value;
      }
      total += amt;
      breakdown[row.title] = amt;
    });

    return { total, breakdown };
  };

  const getSummary = () => {
    const { gross, breakdown: earnings } = calculateEarnings();
    const { total: deductions, breakdown: deductionsBreakdown } = calculateDeductions(gross);
    const netSalary = gross - deductions;
    return { basicSalary, gross, deductions, netSalary, earnings, deductionsBreakdown };
  };

  const handleNext = () => {
    const summary = getSummary();

    const earningsArray: SalaryItem[] = Object.keys(summary.earnings).map((key) => ({
      name: key,
      period: String(salaryData[`${key}-Period`] || "Monthly"), // ✅ ensure string
      INR: summary.earnings[key] || 0,
      unit: String(salaryData[`${key}-Amount-type`] || "%"), // ✅ ensure string
      isSelected: enabledRows[key] || key === "Basic",
    }));

    const deductionsArray: SalaryItem[] = Object.keys(summary.deductionsBreakdown).map((key) => ({
      name: key,
      period: String(salaryData[`${key}-Period`] || "Monthly"), // ✅ ensure string
      INR: summary.deductionsBreakdown[key] || 0,
      unit: String(salaryData[`${key}-Amount-type`] || "%"), // ✅ ensure string
      isSelected: enabledRows[key] || false,
    }));


    const salaryBreakdownToSend: SalaryBreakdownData = {
      earnings: earningsArray,
      deductions: deductionsArray,
      totalEarnings: summary.gross,
      totalDeduction: summary.deductions,
      netSalary: summary.netSalary,
    };

    onNext(salaryBreakdownToSend);
  };

  /** 🔹 render same as Jobinfo */
  const renderCardRows = (rows: typeof earningRows) =>
    rows.map((row, idx) => {
      const isEnabled = enabledRows[row.title] || false;

      return (
        <div key={idx} className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ fontSize: 14, fontWeight: 600 }}>{row.title}</span>
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
            {row.fields.map((field, index) => {
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
                      <Form.Label>{'label' in field ? field.label : "Hours"}</Form.Label>

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
                      <Form.Label>{'label' in field ? field.label : "Amount"}</Form.Label>

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

  if (loading) return <div>Loading salary data...</div>;
  if (error) return <div>{error}</div>;

  // const summary = getSummary();

  return (
    <div className="container mt-4">
      <h5>Edit Salary Breakdown</h5>

      <div className="row">
        {/* Earnings */}
        <div className="col-12 col-md-6 d-flex flex-column">
          <Card className="p-3 h-100">
            <Card.Title>Earnings</Card.Title>
            <hr className="my-2" />
            {renderCardRows(earningRows)}
          </Card>
          <div className="d-flex justify-content-between mt-3 px-2">
            <span>Total Earnings</span>
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
          <div className="d-flex justify-content-between mt-3 px-2">
            <span>Total Deductions</span>
            <span>{summary.deductions.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <strong>Net Salary</strong>
        <span>{summary.netSalary.toFixed(2)}</span>
      </div>

        <div className="py-3 d-flex justify-content-between align-items-center">
          <a
            className="skipbtn
              "
            onClick={onPrev}
          >
            Back
          </a>
          <Button variant="contained" className="nextBtn me-3 text-white" onClick={handleNext}>
            Next
          </Button>
        </div>
    </div>
  );
};

export default EditSalaryBreakdown;
