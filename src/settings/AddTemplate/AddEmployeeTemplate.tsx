import { Button, Container } from "@mui/material";
import { Input, Radio, Steps, UploadProps } from "antd";
import React, { useState } from "react";
import Jobinfo from "./JobInfoTemp";
import Document from "./DocumentTemp";
import Bank from "./BankTemp";
import Basicinfo from "./BasicInfoTemp";
import Team from "../../Home/Team";


const AddEmployeeTemplate = () => {
  const [currentItem, setCurrentItem] = useState(0);

  const handleNext = () => {
    setCurrentItem((prev) => (prev < 3 ? prev + 1 : prev)); 
  };

  const handlePrev = () => {
    setCurrentItem((prev) => (prev > 0 ? prev - 1 : prev)); 
  };

  return (
    <>
     
      <section style={{padding:"2rem"}}>
        <Container>
          {/* <div className="py-3">
            <div className="d-flex justify-content-center align-items-center">
              <div style={{ width: "70%" }}>
                <Steps
                  current={currentItem}
                  labelPlacement="vertical"
                  items={[
                    {
                      title: "Basic info",
                    },
                    {
                      title: "Job info",
                    },
                    {
                      title: "Document ",
                    },
                    {
                      title: "Bank detail ",
                    },
                  ]}
                />
              </div>
            </div>
            {currentItem === 0 ? (
             <Basicinfo onNext={handleNext} />
            ) : currentItem === 1 ? (
              <Jobinfo onNext={handleNext} onPrev={handlePrev}/>
            ) : currentItem === 2 ? (
              <Document onNext={handleNext} onPrev={handlePrev}/>
            ) : (
              <Bank onPrev={handlePrev} onNext={handleNext}/>
            )}
          </div> */}
          <Team/>
        </Container>
      </section>
    </>
  );
};

export default AddEmployeeTemplate;
