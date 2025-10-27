import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import Board from "./Board";
import Summary from "./Summary";
import Calendar from "./CalendarPage";
import Issue from "./Issue";
import Attachment from "./Attachment";
import Timeline from "./TImeline";
import { useLocation } from "react-router-dom";


interface ProjectPageProps {
  defaultTab?: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ defaultTab = "Board" }) => {
  const { projectName } = useParams<{ projectName: string }>(); // ← get from URL
  const [value, setValue] = useState(defaultTab);
  const [isTodo, setIsTodo] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const projectId = query.get("projectId");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div
>
      {!isTodo && (
        <>
          <div
            style={{
              position: "sticky",
              top: "64px",
              background: "#fff",
              zIndex: 1000, // make sure it stays on top
              borderBottom: "1px solid #e0e0e0",
              paddingBottom: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                margin: "0 0 10px 5px",
                paddingLeft: "12px",
              }}
            >
              {projectName || "Project"}
            </h2>

            <hr className="m-0" />

            <div
              className="d-flex justify-content-between align-items-center pt-3 fw-bold"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleChange}>
                  <Tab value="Board" label="Board" sx={{ textTransform: "capitalize" }} />
                  <Tab value="Summary" label="Summary" sx={{ textTransform: "capitalize" }} />
                  <Tab value="Calendar" label="Calendar" sx={{ textTransform: "capitalize" }} />
                  <Tab value="Timeline" label="Timeline" sx={{ textTransform: "capitalize" }} />
                  <Tab value="Attachment" label="Attachment" sx={{ textTransform: "capitalize" }} />
                  <Tab value="Issue" label="Issue" sx={{ textTransform: "capitalize" }} />
                </Tabs>
              </Box>
            </div>
          </div>


          <hr className="m-0" />
          <br />
        </>
      )}

      {value === "Board" && <Board isTodo={isTodo} setIsTodo={setIsTodo} />}
      {value === "Summary" && <Summary projectId={projectId || ""} />}
      {value === "Calendar" && <Calendar projectId={projectId || ""} />}
      {value === "Timeline" && <Timeline projectId={projectId || ""}/>}
      {value === "Attachment" && <Attachment projectId={projectId || ""} />}
      {value === "Issue" && <Issue projectId={projectId || ""} />}

    </div>
  );
};

export default ProjectPage;
