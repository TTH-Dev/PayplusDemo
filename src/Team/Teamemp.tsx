import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import Empinfo from "./Empinfo";
import Container from 'react-bootstrap/Container';
import Salaryinfo from "./Salaryinfo";
import Team from "../Home/Team";


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

const Teamemp = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Container>
        <div>
          <h6 className="mb-0">Team</h6>
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
                  <Tab label="Employee Info" {...a11yProps(0)} />
                  <Tab label="Salary details" {...a11yProps(1)} />
                  <Tab label="Add Employee" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Empinfo />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Salaryinfo/>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Team/>
              </CustomTabPanel>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Teamemp;
