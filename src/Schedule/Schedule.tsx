import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

import Container from 'react-bootstrap/Container';
import Scheduler from "../Home/Schedule";
import Calender from "./Calender";
import ShiftManage from "./ShiftManage";
import AssignEmp from "./AssignEmp";




interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Schedule = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Container>
        <div>
          <h6 className="mb-0">Schedule</h6>
        </div>
      </Container>
      <hr />
      <section>
        <Container>
          <div>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Calendar" {...a11yProps(0)} />
                  <Tab label="Shift management " {...a11yProps(1)} />
                  <Tab label="Assign employees" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
             <Calender/>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
              <ShiftManage/>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
              <AssignEmp/>
              </CustomTabPanel>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Schedule