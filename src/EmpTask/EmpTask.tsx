import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../src/config";

interface Project {
  _id: string;
  name: string;
  path: string;
}

interface User {
  _id: string;
  name: string;
  companyId: string;
}

function EmpTask() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // 1️⃣ Get logged-in user
  const getMe = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data?.data || res.data;
      setUserData(user);
      setCompanyId(user.companyId?._id || user.companyId || user.company?._id || null);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  // 2️⃣ Fetch projects dynamically
  useEffect(() => {
    const fetchProjects = async () => {
      if (!companyId) return;

      try {
        const token = localStorage.getItem("authtoken");
        if (!token) return;

        const res = await axios.get(
          `${API_URL}/api/task/project?companyId=${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const projectList: Project[] =
          res.data?.data?.projects?.map((proj: any) => ({
            _id: proj._id,
            name: proj.name,
            path: proj.name.toLowerCase().replace(/\s+/g, "-"),
          })) || [];

        setProjects(projectList);

        // ✅ Auto-navigate to first project if not already on a project route
        if (projectList.length > 0 && !location.pathname.includes("/emptask/")) {
          navigate(`/emptask/${projectList[0].path}`, {
            state: { projectId: projectList[0]._id },
            replace: true,
          });
        }
      } catch (error) {
        console.error("❌ Error fetching employee projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [companyId]);

  useEffect(() => {
    getMe();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        style={{
          background: "#F6F6F6",
          width: "200px",
          height: "100vh",
          marginLeft: "-20px",
          position: "fixed",
          padding: "0.5rem",
        }}
      >
        <h2 style={{ margin: "1rem 0", fontSize: "25px", fontWeight: 600 }}>Projects</h2>

        <div className="settings-sidebar">
          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects assigned</p>
          ) : (
            projects.map((project) => (
              <Link
                key={project._id}
                to={`/emptask/${project.path}`}
                state={{ projectId: project._id }}
                className={`sidebar-link ${
                  location.pathname.includes(project.path) ? "active" : ""
                }`}
              >
                {project.name}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "180px", width: "100%" }}>
       <Outlet key={location.pathname} />
      </div>
    </div>
  );
}

export default EmpTask;
