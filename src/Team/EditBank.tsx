import { Button } from "@mui/material";
import { Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";

const EditBank = ({
  onNext,
  onPrev,
}: {
  onNext: (data: any) => void;
  onPrev: () => void;
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bankData, setBankData] = useState({
    accountHolderName: "",
    accountType: "",
    pfNo: "",
    esicNo: "",
    accountNo: "",
    ifscCode: "",
    uanNo: "",
    panCardNo: "",
  });

  const handleNext = () => {
    const formData = new FormData();
    formData.append("accountHolderName", bankData.accountHolderName);
    formData.append("accountType", bankData.accountType);
    formData.append("pfNo", bankData.pfNo);
    formData.append("esicNo", bankData.esicNo);
    formData.append("accountNo", bankData.accountNo);
    formData.append("ifscCode", bankData.ifscCode);
    formData.append("uanNo", bankData.uanNo);
    formData.append("panCardNo", bankData.panCardNo);

    onNext(bankData);
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployee();
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(
        `${API_URL}/api/employee/getById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data; 
      setBankData(data.bankDetails);
      setLoading(false); 
    } catch (err) {
      setError("Failed to fetch employee data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <section>
        <div>
          <h6 className="mb-0">Bank Detail </h6>
        </div>
        <div className="row mx-0">
          <div className="col-lg-6">
            <div>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Account holder name
              </label>
              <br />
              <Input
                value={bankData.accountHolderName}
                onChange={(e) =>
                  setBankData({
                    ...bankData,
                    accountHolderName: e.target.value,
                  })
                }
              />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Account Type
              </label>
              <br />
              <Select
                style={{ width: 450, height: 40 }}
                value={bankData.accountType} 
                onChange={(value) =>
                  setBankData({ ...bankData, accountType: value })
                }
                options={[
                  { value: "Savings", label: "Savings" },
                  { value: "Current", label: "Current" },
                ]}
              />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                PF No
              </label>
              <br />
              <Input
                value={bankData.pfNo}
                onChange={(e) =>
                  setBankData({ ...bankData, pfNo: e.target.value })
                }
              />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                ESIC No
              </label>
              <br />
              <Input
                value={bankData.esicNo}
                onChange={(e) =>
                  setBankData({ ...bankData, esicNo: e.target.value })
                }
              />
              <br />
            </div>
          </div>
          <div className="col-lg-6">
            <div>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Account No
              </label>
              <br />
              <Input
                value={bankData.accountNo}
                onChange={(e) =>
                  setBankData({ ...bankData, accountNo: e.target.value })
                }
              />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                IFSC Code
              </label>
              <br />
              <Input
                value={bankData.ifscCode}
                onChange={(e) =>
                  setBankData({ ...bankData, ifscCode: e.target.value })
                }
              />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                UAN No
              </label>
              <br />
              <Input
                value={bankData.uanNo}
                onChange={(e) =>
                  setBankData({ ...bankData, uanNo: e.target.value })
                }
              />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                PAN Card No
              </label>
              <br />
              <Input
                value={bankData.panCardNo}
                onChange={(e) =>
                  setBankData({ ...bankData, panCardNo: e.target.value })
                }
              />
              <br />
            </div>
          </div>
        </div>
        <div className="py-3 d-flex justify-content-between align-items-center">
          <a
          className="skipbtn
                    "
          onClick={onPrev}
        >
          Back
        </a>
          <Button variant="contained" className="nextBtn me-3" onClick={handleNext}>
            Finish
          </Button>
        </div>
      </section>
    </>
  );
};
export default EditBank;
