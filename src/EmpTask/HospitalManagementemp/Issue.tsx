import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";
import { FaComment } from "react-icons/fa";
import { API_URL } from "../../../src/config"; // adjust import if needed

interface IssueProps {
  projectId: string;
}

interface IssueItem {
  title: string;
  status: string;
  taskName: string;
  assignee: string;
  createdAt: string;
  commentsCount: number;
}

const Issue: React.FC<IssueProps> = ({ projectId }) => {
  const [completedIssues, setCompletedIssues] = useState<IssueItem[]>([]);
  const [newIssues, setNewIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetchIssues();
  }, [projectId]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = res.data?.data?.tasks || [];

      // Flatten all issues from each task
      const allIssues: IssueItem[] = tasks.flatMap((task: any) =>
        (task.issues || []).map((issue: any) => ({
          title: issue.title || "Untitled issue",
          status: issue.status,
          taskName: task.name,
          assignee: task.assignee?.firstName || "Unknown",
          createdAt: new Date(issue.createdAt).toLocaleDateString(),
          commentsCount: task.comments?.length || 0,
        }))
      );

      // Categorize issues
      setCompletedIssues(allIssues.filter((i) => i.status === "Done"));
      setNewIssues(allIssues.filter((i) => i.status !== "Done"));
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderIssueCard = (issue: IssueItem, index: number) => (
    <Card
      key={index}
      style={{
        borderRadius: 8,
        padding: 12,
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* Title */}
      <Typography
        variant="body2"
        sx={{
          color: "rgba(0,0,0,0.7)",
          fontWeight: 500,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          marginBottom: "25px",
        }}
      >
        {issue.title}
      </Typography>

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "#353535", fontWeight: 500 }}>
          {issue.createdAt}
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <FaComment size={20} color="#00BA00" />
            {issue.commentsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "1px",
                  right: "6px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
              >
                {issue.commentsCount}
              </span>
            )}
          </div>

          <div
            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "28px",
              height: "28px",
              fontSize: "12px",
            }}
          >
            {issue.assignee.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 20 }}>
      {loading ? (
        <Typography>Loading issues...</Typography>
      ) : (
        <div style={{ display: "flex", gap: 20 }}>
          {/* Completed Issue Card */}
          <Card
            style={{
              flex: 1,
              borderRadius: 16,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography
                style={{
                  marginBottom: 8,
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#353535",
                }}
              >
                Completed Issue
              </Typography>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
              >
                {completedIssues.length > 0
                  ? completedIssues.map(renderIssueCard)
                  : <Typography>No completed issues</Typography>}
              </div>
            </CardContent>
          </Card>

          {/* New Issue Card */}
          <Card
            style={{
              flex: 1,
              borderRadius: 16,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography
                style={{
                  marginBottom: 8,
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#353535",
                }}
              >
                New Issue
              </Typography>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
              >
                {newIssues.length > 0
                  ? newIssues.map(renderIssueCard)
                  : <Typography>No new issues</Typography>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Issue;
