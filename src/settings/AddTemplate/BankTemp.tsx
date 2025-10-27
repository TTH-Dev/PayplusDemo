import { Button } from "@mui/material";
import { Input } from "antd";
import React from "react";

const Bank = ({
    onNext,
    onPrev,
  }: {
    onNext: () => void;
    onPrev: () => void;
  }) => {
  return (
    <>
      <section>
        <div>
          <h6 className="mb-0">Bank Detail </h6>
        </div>
        <div className="row">
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
              <Input className="inp-org"/>
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
              <Input className="inp-org"/>
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
              <Input className="inp-org"/>
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
              <Input className="inp-org"/>
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
              <Input className="inp-org"/>
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
              <Input className="inp-org"/>
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
              <Input className="inp-org"/>
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                PAN Catd No
              </label>
              <br />
              <Input  className="inp-org"/>
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
                    Cancel
                  </a>
                  <div className="d-flex" >
                    <p onClick={onPrev} className="skipbtn-pre">Previous</p>
                  
                 
                  <Button variant="contained" className="nextBtn" onClick={onNext}>
                    Next
                  </Button>
                  </div>
                </div>
      </section>
    </>
  );
};

export default Bank;
