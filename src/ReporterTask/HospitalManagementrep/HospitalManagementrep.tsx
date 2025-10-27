import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Board from "./Board";
import Summary from "./Summary";
import Issue from "./Issue";
import { FaChevronLeft } from "react-icons/fa";

interface HospitalManagementrepProps {
  defaultTab?: string;
}

const HospitalManagementEmp: React.FC<HospitalManagementrepProps> = ({ defaultTab = "Board" }) => {
  const [value, setValue] = useState(defaultTab);
  const [isTodo, setIsTodo] = useState(false); // Todo state

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div >
      {!isTodo && (
        <>
          {/* Hospital Management Title */}
          <h2 style={{ fontSize: "1.2rem", fontWeight: "600", margin: "0 0 10px 0", padding:"20px" }}>
            Hospital Management
          </h2>

          <hr className="m-0" />

          {/* Tabs */}
        <div
          className="d-flex justify-content-between align-items-center pt-3 fw-bold"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          <Box sx={{ width: "100%" }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab value="Board" label="Board" sx={{ textTransform: "capitalize" }} />
              <Tab value="Summary" label="Summary" sx={{ textTransform: "capitalize" }} />

              <Tab value="Issue" label="Issue" sx={{ textTransform: "capitalize" }} />
            </Tabs>
          </Box>
        </div>

          <hr className="m-0" />
          <br />

          {/* Tab content */}
          {value === "Board" && <Board isTodo={isTodo} setIsTodo={setIsTodo} />}
          {value === "Summary" && <Summary />}
          {value === "Issue" && <Issue />}
          
        </>
      )}

      {/* Only show Todo page */}
      {isTodo && <Board isTodo={isTodo} setIsTodo={setIsTodo} />}
    </div>
  );
};

export default HospitalManagementEmp;
