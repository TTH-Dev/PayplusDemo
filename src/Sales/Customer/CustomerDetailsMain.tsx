import { Tabs, Tab, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import CDOverview from "./CDOverview";
import CDTransaction from "./CDTransaction";
import Container from "react-bootstrap/esm/Container";
import { IoIosArrowBack } from "react-icons/io";
import { useState } from "react";

const CustomerDetailsMain = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="pt-3">
        <Container>
          <Link
            to={"/sales/customer"}
            style={{
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#353535",
                cursor: "pointer",
              }}
            >
              <IoIosArrowBack className="mb-1" /> Customers
            </span>
          </Link>
        </Container>

        <hr className="mt-1" />
      </div>
      <div className="ps-3">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Overview" />
          <Tab label="Transaction" />
        </Tabs>
        {activeTab === 0 && <CDOverview id={id} />}
        {activeTab === 1 && <CDTransaction id={id} />}
      </div>
    </>
  );
};

export default CustomerDetailsMain;
