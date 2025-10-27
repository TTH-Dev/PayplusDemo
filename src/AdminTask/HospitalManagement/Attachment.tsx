import React, { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MdFilterAlt } from "react-icons/md";
import axios from "axios";
import { API_URL } from "../../config";

interface AttachmentItem {
  originalName: string;
  _id: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Task {
  _id: string;
  name: string;
  attachments: AttachmentItem[];
}

interface AttachmentProps {
  projectId: string; // pass current project ID
}

const Attachment: React.FC<AttachmentProps> = ({ projectId }) => {
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");

  // 🔹 Fetch attachments from all tasks for this project
  useEffect(() => {
    if (!projectId) return;

    const fetchAttachments = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/task/filter/attachment`, {
          params: { projectId, assignee: assigneeFilter || undefined },
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks: Task[] = res.data.data.tasks || [];
        const allAttachments: AttachmentItem[] = tasks.flatMap((task) =>
          task.attachments.map((att) => ({
            _id: att._id,
            originalName: att.originalName,
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            uploadedBy: att.uploadedBy,
            uploadedAt: att.uploadedAt,
          }))
        );

        setAttachments(allAttachments);
      } catch (err) {
        console.error("Error fetching attachments:", err);
      }
    };

    fetchAttachments();
  }, [projectId, assigneeFilter]);

  const uniqueAssignees = Array.from(new Set(attachments.map((a) => a.uploadedBy))).filter(Boolean);

  return (
    <div className="container py-4">
      {/* Top bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          onClick={() => setShowFilterModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            backgroundColor: "white",
            color: "#1784A2",
            border: "none",
            borderRadius: "6px",
            fontSize: "17px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Filter <MdFilterAlt />
        </button>
      </div>

      {/* Attachments Grid */}
      {/* Attachments Grid */}
<div className="row g-4">
  {attachments.map((file, index) => (
    <div key={file._id} className="col-6 col-sm-4 col-md-3 col-lg-3">
      <div className="card h-100 shadow-sm">
        <div
          className="p-3 position-relative d-flex align-items-center justify-content-center"
          style={{ height: "120px" }}
        >
          {/* Wrap image in clickable link */}
                  <a
                    href={`${API_URL}${file.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-title text-primary small fw-medium mb-1 text-truncate"
                  >
                    Attachment- {index+1}
                  </a>

          <div
            className="position-absolute"
            style={{ top: "8px", right: "8px", cursor: "pointer" }}
          >
            <MoreVertIcon style={{ color: "#000000ff", fontSize: "20px" }} />
          </div>
        </div>

        <hr className="m-0" />

        <div className="card-body p-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column">
              <p className="card-title text-primary small fw-medium mb-1 text-truncate">
                {`${file.originalName}${index + 1}`}
              </p>
              <p className="text-muted small fs-6 mb-0" style={{ whiteSpace: "nowrap" }}>
                {new Date(file.uploadedAt).toLocaleString()}
              </p>
            </div>

            <div
              className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "32px", height: "32px", fontSize: "14px" }}
            >
              {file.uploadedBy?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Filter Modal */}
      {showFilterModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h6 style={{ margin: 0, fontSize: "14px" }}>Filter</h6>
              <button
                onClick={() => setShowFilterModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <hr style={{ margin: "8px 0" }} />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>Assignee</label>
                <select
                  style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {uniqueAssignees.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>
              <button
                style={{
                  padding: "6px 14px",
                  width: "100px",
                  border: "1px solid #1784A2",
                  borderRadius: "4px",
                  color: "#1784A2",
                  fontSize: "12px",
                }}
                onClick={() => setAssigneeFilter("")}
              >
                Reset
              </button>
              <button
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#1784A2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  width: "100px",
                  fontSize: "12px",
                }}
                onClick={() => setShowFilterModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attachment;
