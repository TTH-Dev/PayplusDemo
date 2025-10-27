import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Checkbox } from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaComment } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../config";

interface IssueItem {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdByName: string;
  createdAt: string;
  isRead?: boolean;
}

interface ApiResponse {
  status: string;
  totalIssues: number;
  createdCount: number;
  doneCount: number;
  data: {
    createdIssues: IssueItem[];
    doneIssues: IssueItem[];
  };
}

interface IssueProps {
  projectId: string;
}

const Issue: React.FC<IssueProps> = ({ projectId }) => {
  const [createdIssues, setCreatedIssues] = useState<IssueItem[]>([]);
  const [doneIssues, setDoneIssues] = useState<IssueItem[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Fetch issues and filter out read ones
  useEffect(() => {
    if (!projectId) return;

    const fetchIssues = async () => {
      try {
        const res = await axios.get<ApiResponse>(`${API_URL}/api/task/filter/issue`, {
          params: { projectId },
          headers: { Authorization: `Bearer ${localStorage.getItem("authtoken")}` },
        });

        setCreatedIssues((res.data.data.createdIssues || []).filter((i) => !i.isRead));
        setDoneIssues((res.data.data.doneIssues || []).filter((i) => !i.isRead));
      } catch (err) {
        console.error("Error fetching issues", err);
      }
    };

    fetchIssues();
  }, [projectId]);

  // Handle marking an issue as read
  const handleMarkRead = async (issueId: string, list: "created" | "done") => {
    try {
      await axios.patch(
        `${API_URL}/api/task/issue/${issueId}`,
        { isRead: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authtoken")}` },
        }
      );

      // Remove the issue from the state after marking as read
      if (list === "created") {
        setCreatedIssues((prev) => prev.filter((i) => i._id !== issueId));
      } else {
        setDoneIssues((prev) => prev.filter((i) => i._id !== issueId));
      }
    } catch (err) {
      console.error("Error updating issue read state", err);
    }
  };

const renderIssueCards = (issues: IssueItem[], list: "created" | "done") => (
  <div style={{ display: "grid", gap: 12 }}>
    {issues.length > 0 ? (
      issues.map((issue) => (
        <Card
          key={issue._id}
          style={{
            borderRadius: 8,
            padding: 12,
            boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0,0,0,0.7)",
                fontWeight: 500,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                wordBreak: "break-word",
                lineHeight: 1.3,
                minHeight: "2.4em",
                marginBottom: "12px",
              }}
            >
              {issue.title}
            </Typography>

            {/* Corrected Checkbox */}
            <Checkbox
              checked={!!issue.isRead}
              onChange={() => handleMarkRead(issue._id, list)}
              color="primary"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <Typography variant="caption" sx={{ color: "#353535", fontWeight: 500 }}>
              {new Date(issue.createdAt).toLocaleDateString()}
            </Typography>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <FaComment size={22} color="#00BA00" />
                <span
                  style={{
                    position: "absolute",
                    top: "1px",
                    right: "6px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                >
                  !!!
                </span>
              </div>

              <div
                className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "28px", height: "28px" }}
              >
                {(issue.createdByName && issue.createdByName.charAt(0).toUpperCase()) || "U"}
              </div>
            </div>
          </div>
        </Card>
      ))
    ) : (
      <Typography variant="body2" sx={{ color: "gray" }}>
        No issues found
      </Typography>
    )}
  </div>
);


  return (
    <div style={{ padding: 20 }}>
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

      <div style={{ display: "flex", gap: 20 }}>
        <Card style={{ flex: 1, borderRadius: 16, boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography style={{ marginBottom: 8, fontWeight: 700, fontSize: "14px", color: "#353535" }}>
              Done Issues ({doneIssues.length})
            </Typography>
            {renderIssueCards(doneIssues, "done")}
          </CardContent>
        </Card>

        <Card style={{ flex: 1, borderRadius: 16, boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography style={{ marginBottom: 8, fontWeight: 700, fontSize: "14px", color: "#353535" }}>
              Created Issues ({createdIssues.length})
            </Typography>
            {renderIssueCards(createdIssues, "created")}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Issue;
