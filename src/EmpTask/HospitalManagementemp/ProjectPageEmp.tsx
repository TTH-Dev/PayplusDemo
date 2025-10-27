import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Board from "./Board";
import Summary from "./Summary";
import Issue from "./Issue";
import { useLocation, useParams } from "react-router-dom";

interface Project {
  _id: string;
  name: string;
  path: string;
}

const ProjectPageEmp: React.FC<{ projects?: Project[] }> = ({ projects = [] }) => {
  const { projectPath } = useParams<{ projectPath: string }>();
  const location = useLocation();
  const state = location.state as { projectId?: string } | null;

  // State for active tab
  const [value, setValue] = useState("Board");
  const [isTodo, setIsTodo] = useState(false);

  // Use state first, fallback to projectPath lookup
  const [projectId, setProjectId] = useState<string | undefined>(state?.projectId);

  useEffect(() => {
    if (!projectId && projectPath && projects.length > 0) {
      const proj = projects.find((p) => p.path === projectPath);
      setProjectId(proj?._id);
    }
  }, [projectPath, projects, projectId]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!projectId) {
    return (
      <div style={{ padding: "20px", color: "red", fontWeight: 600 }}>
        Project ID is missing! Please select a project from the sidebar.
      </div>
    );
  }

return (
  <div>
    {isTodo ? (
      <Board projectId={projectId} isTodo={isTodo} setIsTodo={setIsTodo} />
    ) : (
      <>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            margin: "0 0 10px 0",
            padding: "20px",
          }}
        >
          Project
        </h2>

        <Box sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab value="Board" label="Board" sx={{ textTransform: "capitalize" }} />
            <Tab value="Summary" label="Summary" sx={{ textTransform: "capitalize" }} />
            <Tab value="Issue" label="Issue" sx={{ textTransform: "capitalize" }} />
          </Tabs>
        </Box>

        {value === "Board" && <Board projectId={projectId} isTodo={isTodo} setIsTodo={setIsTodo} />}
        {value === "Summary" && <Summary projectId={projectId} />}
        {value === "Issue" && <Issue projectId={projectId} />}
      </>
    )}
  </div>
);

};

export default ProjectPageEmp;
