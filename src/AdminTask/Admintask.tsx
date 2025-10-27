// import React, { useState, useEffect } from "react";
// import { Link, Outlet, useLocation, Navigate, useSearchParams, useNavigate } from "react-router-dom";
// import { FaPlus } from "react-icons/fa";
// import axios from "axios";
// import { API_URL } from "../../src/config";
// import "./Admintask.css";

// interface Project {
//   _id: string;
//   name: string;
//   path: string;
// }

// interface UserData {
//   _id: string;
//   companyId: string;
//   [key: string]: any;
// }

// const Admintask: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [projectName, setProjectName] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [companyId, setCompanyId] = useState<string>("");
//   const [loadingProjects, setLoadingProjects] = useState(true);
// const [refreshKey, setRefreshKey] = useState(0);

//   const projectId = searchParams.get("projectId");

//   // 🔹 Get logged-in user
//   const getMe = async () => {
//     const token = localStorage.getItem("authtoken");
//     if (!token) return;

//     try {
//       const res = await axios.get(`${API_URL}/api/auth/getMe`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const user = res.data?.data || res.data;
//       setUserData(user);
//       setCompanyId(user.companyId?._id || user.companyId || "");
//     } catch (error: any) {
//       console.error("❌ Error fetching user data:", error);
//     }
//   };
//  const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem("authtoken");
//         if (!token || !companyId) return;

//         const res = await axios.get(
//           `${API_URL}/api/task/project?companyId=${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const projectList: Project[] =
//           res.data?.data?.projects?.map((proj: any) => ({
//             _id: proj._id,
//             name: proj.name,
//             path: proj.name.toLowerCase().replace(/\s+/g, "-"),
//           })) || [];

//         setProjects(projectList);

//         // ✅ Auto-navigate to first project if not already selected
//         if (
//           projectList.length > 0 &&
//           (location.pathname === "/admintask" || !projectId)
//         ) {
//           navigate(
//             `/admintask/${projectList[0].path}?projectId=${projectList[0]._id}`,
//             { replace: true }
//           );
//         }
//       } catch (error) {
//         console.error("❌ Error fetching projects:", error);
//       } finally {
//         setLoadingProjects(false);
//       }
//     };
//   // 🔹 Fetch projects dynamically
//   useEffect(() => {
   

//     if (companyId) fetchProjects();
//   }, [companyId]);

//   useEffect(() => {
//     getMe();
//   }, []);

//   // 🔹 Handle creating new project
//   const handleCreateProject = async () => {
//     if (!projectName.trim()) {
//       alert("Please enter a project name");
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authtoken");
//       if (!token) {
//         alert("Not authorized. Please log in.");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.post(
//         `${API_URL}/api/task/project`,
//         { name: projectName.trim(), endDate, companyId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newProject: Project = {
//         _id: res.data.data._id,
//         name: res.data.data.name,
//         path: res.data.data.name.toLowerCase().replace(/\s+/g, "-"),
//       };

//       setProjects((prev) => [...prev, newProject]);
//       setProjectName("");
//       setEndDate("");
//       setShowFilterModal(false);
//       fetchProjects()
//       alert("Project created successfully!");
// setRefreshKey((prev) => prev + 1);
     
//     } catch (error: any) {
//       console.error(error);
//       // alert(error.response?.data?.message || "Something went wrong");
//     } finally {
//       setRefreshKey((prev) => prev + 1);
//       setLoading(false);
//     }
//   };

//   return (
//     <div  key={refreshKey} className="d-flex">
//       {/* Sidebar */}
//       <div
//         style={{
//           background: "#F6F6F6",
//           width: "200px",
//           height: "100vh",
//           position: "fixed",
//           marginLeft: "-17px",
//           marginRight: 0,
//           overflowY: "auto",
//         }}
//         className="sidebar-scroll"
//       >
//         {/* Header + Add button */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: "1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "25px",
//               fontWeight: 600,
//               color: "#353535",
//               margin: "13px",
//               paddingLeft: "10px",
//             }}
//           >
//             Project
//           </p>
//           <button
//             onClick={() => setShowFilterModal(true)}
//             style={{
//               width: "30px",
//               height: "30px",
//               backgroundColor: "#1784A2",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "20px",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginRight: "20px",
//             }}
//           >
//             <FaPlus />
//           </button>
//         </div>

//         {/* Project Links */}
//         <div className="settings-sidebar" style={{ overflowY: "auto" }}>
//           {loadingProjects ? (
//             <p>Loading projects...</p>
//           ) : projects.length === 0 ? (
//             <p>No projects available</p>
//           ) : (
//             projects.map((project, idx) => (
//               <Link
//                 key={project._id}
//                 to={`/admintask/${project.path}?projectId=${project._id}`}
//                 className={`sidebar-link ${
//                   projectId === project._id ||
//                   (!projectId && idx === 0) ? "active" : ""
//                 }`}
//               >
//                 {project.name}
//               </Link>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={{ marginLeft: "200px",marginRight: "20px", width: "100%" }}>
//         <Outlet key={location.pathname} />
//       </div>

//       {/* Add Project Modal */}
//       {showFilterModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             onClick={() => setShowFilterModal(false)}
//             style={{
//               position: "absolute",
//               inset: 0,
//               backgroundColor: "rgba(0,0,0,0.4)",
//             }}
//           />
//           <div
//             style={{
//               position: "relative",
//               width: "min(85vw, 380px)",
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               padding: "25px",
//               boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <h5 style={{ margin: 0 }}>Add Project</h5>
//               <button
//                 onClick={() => setShowFilterModal(false)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   fontSize: "18px",
//                   cursor: "pointer",
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <hr />

//             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//               <label>Project Name</label>
//               <input
//                 type="text"
//                  style={{
//                     width: "100%",
//                     padding: "6px 10px",
//                     borderRadius: "6px",
//                     border: "1px solid #ccc",
//                     outline: "none",
//                     fontSize: "0.85rem",
//                   }}
//                 value={projectName}
//                 onChange={(e) => setProjectName(e.target.value)}
//               />
//               <label>End Date</label>
//               <input
//                style={{
//                     width: "100%",
//                     padding: "6px 10px",
//                     borderRadius: "6px",
//                     border: "1px solid #ccc",
//                     outline: "none",
//                     fontSize: "0.85rem",
//                   }}
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//               <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
//               <button  style={{
//                     padding: "8px 16px",
//                     backgroundColor: "#1784A2",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "5px",
//                     width: "120px",
//                     fontWeight: 600,
//                     fontSize: "0.85rem",
//                     cursor: "pointer",
//                   }} onClick={handleCreateProject}>
//                 {loading ? "Creating..." : "Create"}
//               </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Admintask;
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../src/config";
import "./Admintask.css";

interface Project {
  _id: string;
  name: string;
  path: string;
}

interface UserData {
  _id: string;
  companyId: string;
  [key: string]: any;
}

const Admintask: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const projectId = searchParams.get("projectId");

  // Get logged-in user
  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data?.data || res.data;
      setUserData(user);
      setCompanyId(user.companyId?._id || user.companyId || "");
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const token = localStorage.getItem("authtoken");
      if (!token || !companyId) return;

      const res = await axios.get(`${API_URL}/api/task/project?companyId=${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projectList: Project[] =
        res.data?.data?.projects?.map((proj: any) => ({
          _id: proj._id,
          name: proj.name,
          path: proj.name.toLowerCase().replace(/\s+/g, "-"),
        })) || [];

      setProjects(projectList);

      // Navigate to first project if none selected
      if (projectList.length > 0 && (!projectId || location.pathname === "/admintask")) {
        navigate(`/admintask/${projectList[0].path}?projectId=${projectList[0]._id}`, { replace: true });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (companyId) fetchProjects();
  }, [companyId, refreshKey]);

  // Create new project
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        alert("Not authorized. Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/task/project`,
        { name: projectName.trim(), endDate, companyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjectName("");
      setEndDate("");
      setShowFilterModal(false);

      // Force rerender and refetch projects
      setRefreshKey((prev) => prev + 1);

      const newProject = res.data.data;
      navigate(`/admintask/${newProject.name.toLowerCase().replace(/\s+/g, "-")}?projectId=${newProject._id}`, {
        replace: true,
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key={refreshKey} className="d-flex">
      {/* Sidebar */}
      <div
        style={{
          background: "#F6F6F6",
          width: "200px",
          height: "100vh",
          position: "fixed",
          marginLeft: "-17px",
          marginRight: 0,
          overflowY: "auto",
        }}
        className="sidebar-scroll"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <p style={{ fontSize: "25px", fontWeight: 600, color: "#353535", margin: "13px", paddingLeft: "10px" }}>Project</p>
          <button
            onClick={() => setShowFilterModal(true)}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#1784A2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <FaPlus />
          </button>
        </div>

        <div className="settings-sidebar" style={{ overflowY: "auto" }}>
          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects available</p>
          ) : (
            projects.map((project, idx) => (
              <Link
                key={project._id}
                to={`/admintask/${project.path}?projectId=${project._id}`}
                className={`sidebar-link ${projectId === project._id || (!projectId && idx === 0) ? "active" : ""}`}
              >
                {project.name}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "200px", marginRight: "20px", width: "100%" }}>
        <Outlet key={location.pathname} />
      </div>

      {/* Add Project Modal */}
      {showFilterModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div onClick={() => setShowFilterModal(false)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <div
            style={{
              position: "relative",
              width: "min(85vw, 380px)",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "25px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ margin: 0 }}>Add Project</h5>
              <button onClick={() => setShowFilterModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>
                ×
              </button>
            </div>

            <hr />

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label>Project Name</label>
              <input
                type="text"
                style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", fontSize: "0.85rem" }}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <label>End Date</label>
              <input
                type="date"
                style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", fontSize: "0.85rem" }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
                <button
                  style={{ padding: "8px 16px", backgroundColor: "#1784A2", color: "#fff", border: "none", borderRadius: "5px", width: "120px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
                  onClick={handleCreateProject}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admintask;
