import CircularProgress from "@mui/joy/CircularProgress";
import React, { useState } from "react";
import { FaPlus, FaRegCirclePlay } from "react-icons/fa6";
import "./Home.css";
import { Button } from "@mui/material";
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
} from "devextreme-react/pie-chart";

const Home = () => {
  const [isShowCustimze, setCoustimze] = useState(false);

  const navCustmize = () => {
    setCoustimze(true);
  };

  const areas = [
    {
      country: "Russia",
      area: 12,
    },
    {
      country: "Canada",
      area: 7,
    },
    {
      country: "USA",
      area: 7,
    },
    {
      country: "China",
      area: 7,
    },
    {
      country: "Brazil",
      area: 6,
    },
    {
      country: "Australia",
      area: 5,
    },
    {
      country: "India",
      area: 2,
    },
    {
      country: "Others",
      area: 55,
    },
  ];

  function formatLabel(arg: { argumentText: string; valueText: string }) {
    return `${arg.valueText}%`;
  }

  return (
    <>
      {!isShowCustimze ? (
        <>
          <div style={{ backgroundColor: "#FFF4EC" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2
                  style={{ fontSize: "1.2rem", fontWeight: "600" }}
                  className="m-0 p-3"
                >
                  Welcome John !
                </h2>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ paddingRight: "24px" }}
              >
                <FaRegCirclePlay />
                <p className="m-0 px-2">Demo Video</p>
              </div>
            </div>
            <hr className="m-0" />
          </div>
          <section
            style={{ height: "100vh", backgroundColor: "#FFF4EC " }}
            className="p-4"
          >
            <div className="d-flex justify-content-center align-items-center pt-5">
              <img
                className="img-fluid"
                src="/assests/get costomize.png"
                style={{ width: "30%" }}
              />
            </div>
            <div className="text-center pt-3">
              <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                Hey ! Lets design your dashboard
              </p>
              <Button
                variant="contained"
                style={{ backgroundColor: "#000" }}
                onClick={navCustmize}
              >
                Customize
              </Button>
            </div>
          </section>
        </>
      ) : (
        <>
          {isShowCustimze ? (
            <>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#FFF4EC" }}
              >
                <div>
                  <h2
                    style={{ fontSize: "1.2rem", fontWeight: "600" }}
                    className="m-0 p-4"
                  >
                    Welcome John !
                  </h2>
                </div>
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ paddingRight: "24px" }}
                >
                  <FaRegCirclePlay />
                  <p className="m-0 px-2">Demo Video</p>
                </div>
              </div>
              <hr className="m-0" />
            </>
          ) : (
            <>
              <div style={{ backgroundColor: "#FFF4EC" }}>
                <h2
                  style={{ fontSize: "1.2rem", fontWeight: "600" }}
                  className="m-0 p-4"
                >
                  Customize your dashboard
                </h2>
                <hr className="m-0" />
              </div>
            </>
          )}

          <section
            style={{ height: "100vh", backgroundColor: "#FFF4EC " }}
            className="p-4"
          >
            <div className="row">
              <div
                className="col-lg-4 d-flex justify-content-around align-items-center p-3"
                style={{ backgroundColor: "white", borderRadius: "10px" }}
              >
                <div>
                  <h2
                    style={{ fontSize: "1rem", fontWeight: "600" }}
                    className="pb-4"
                  >
                    Employee setup
                  </h2>
                  <CircularProgress
                    size="lg"
                    determinate
                    value={75}
                    style={{ color: "#686F7B" }}
                  >
                    75%
                  </CircularProgress>
                </div>
                <div style={{ marginLeft: "1rem" }}>
                  <div className="d-flex justify-content-center align-items-center">
                    <div>
                      <div
                        style={{
                          width: "1%",
                          height: "1%",
                          backgroundColor: "#1E1E2C",
                          padding: "1rem",
                        }}
                      ></div>
                    </div>
                    <div>
                      <p className="m-0 px-2">
                        No of employee setup is completed
                      </p>
                    </div>
                  </div>
                  <div className="d-flex  align-items-center mt-3">
                    <div>
                      <div
                        style={{
                          width: "1%",
                          height: "1%",
                          backgroundColor: "#E2E2E2",
                          padding: "1rem",
                        }}
                      ></div>
                    </div>
                    <div>
                      <p className="m-0 px-2">
                        No of employee setup is pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-4 d-flex justify-content-around align-items-center p-3"
                style={{ backgroundColor: "white", borderRadius: "10px" }}
              >
                <div>
                  <h2
                    style={{ fontSize: "1rem", fontWeight: "600" }}
                    className="pb-4"
                  >
                    Employee setup
                  </h2>
                  <PieChart id="pie" dataSource={areas} palette="Bright">
                    <Series argumentField="country" valueField="area">
                      <Label visible={true}>
                        <Connector visible={true} width={1} />
                      </Label>
                    </Series>

                    <Size width={300} />
                  </PieChart>
                </div>
                <div style={{ marginLeft: "1rem" }}>
                  <div className="d-flex justify-content-center align-items-center">
                    <div>
                      <div
                        style={{
                          width: "1%",
                          height: "1%",
                          backgroundColor: "#1E1E2C",
                          padding: "1rem",
                        }}
                      ></div>
                    </div>
                    <div>
                      <p className="m-0 px-2">
                        No of employee setup is completed
                      </p>
                    </div>
                  </div>
                  <div className="d-flex  align-items-center mt-3">
                    <div>
                      <div
                        style={{
                          width: "1%",
                          height: "1%",
                          backgroundColor: "#E2E2E2",
                          padding: "1rem",
                        }}
                      ></div>
                    </div>
                    <div>
                      <p className="m-0 px-2">
                        No of employee setup is pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie chart */}
              <div
                className="col-lg-4 d-flex justify-content-around align-items-center p-3"
                style={{ backgroundColor: "white", borderRadius: "10px" }}
              >
                <div>
                  <h2
                    style={{ fontSize: "1rem", fontWeight: "600" }}
                    className="pb-4"
                  >
                    Employee setup
                  </h2>
                  <PieChart id="pie" dataSource={areas} palette="Bright">
                    <Series argumentField="country" valueField="area">
                      <Label visible={true} customizeText={formatLabel}>
                        <Connector visible={true} width={1} />
                      </Label>
                    </Series>

                    <Size width={300} />
                  </PieChart>
                </div>
              </div>

              {/* ADD symbol */}
              <div
                style={{
                  backgroundColor: "#fff",
                  height: "40%",
                  padding: "5rem",
                  borderRadius: "10px",
                }}
                className="col-lg-4"
              >
                <div className="d-flex justify-content-center align-items-center">
                  <FaPlus style={{ fontSize: "2rem", fontWeight: "600" }} />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Home;
