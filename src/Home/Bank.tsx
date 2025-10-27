import { Button } from "@mui/material";
import { Input, message, Select } from "antd";
import React, { useState } from "react";

const Bank = ({
  onNext,
  onPrev,
  onFinalCall
}: {
  onNext: (data: any) => void;
  onPrev: () => void;
  onFinalCall: (data: {
    accountHolderName: string;
    accountType: string;
    pfNo: string;
    esicNo: string;
    accountNo: string;
    ifscCode: string;
    uanNo: string;
    panCardNo: string;
  }) => void; // ← change here
}) => {

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

  const [isClick,setisClick]=useState(false)
  const handleNext = () => {
    onNext(bankData);
    setisClick(true)
  };

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
              className="input-dd"
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
              className="input-dd"
                style={{ width: 450, height: 40 }}
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
              className="input-dd"
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
              className="input-dd"
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
              className="input-dd"
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
              className="input-dd"
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
              className="input-dd"
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
              className="input-dd"
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
            className="skipbtn"
            onClick={onPrev}
          >
            Back
          </a>
          {!isClick?
          <Button variant="contained" className="nextBtn me-3" onClick={handleNext}>
            Next
          </Button>:
          <Button variant="contained" className="nextBtn me-3" onClick={() => onFinalCall(bankData)}>
            Done
          </Button>}
        </div>
      </section>
    </>
  );
};

export default Bank;
