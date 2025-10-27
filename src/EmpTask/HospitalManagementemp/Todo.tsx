import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, Tabs, Tab } from "@mui/material";
import { FaChevronLeft, FaListOl, FaListUl } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { API_URL } from "../../config";
import dayjs from "dayjs";

interface TodoPageProps {
  setIsTodo: (value: boolean) => void;
  task: {
    _id: string;
    name: string;
    priority?: string;
    status?: string;
    createdDate: string;
    dueDate: string;
    projectId?: string;
    assignee?: {
      _id?: string;
      firstName: string;
      lastName?: string;
    };
    reporter?: {
      _id?: string;
      firstName: string;
      lastName?: string;
    };
    boardId?: {
      _id?: string;
      name: string;
      order?: number;
    };
    comments: any[];
    attachments?: any[];
    history?: {
      message: string;
      createdBy: string;
      createdAt: string;
      _id: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  };
  boards: { _id: string; title: string; jobCategory?: string }[];
  onTaskMove: (targetBoardName: string) => Promise<void> | void;
}

const TodoPage: React.FC<TodoPageProps> = ({
  setIsTodo,
  task,
  boards,
  onTaskMove,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [activityTab, setActivityTab] = useState(0);
  const [showAddModal1, setShowAddModal1] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<{ [taskId: string]: any[] }>(
    {}
  );
  const [issues, setIssues] = useState<any[]>([]); // all issues (Created only)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]); // checkboxes

  const boardNames = boards.map((b) => b.title);

  useEffect(() => {
    const getUserAndEmployees = async () => {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        console.warn("⚠️ No token found");
        return;
      }

      try {
        // 🔹 Step 1: Get logged-in user
        const userRes = await axios.get(`${API_URL}/api/auth/getMe`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = userRes.data?.data || userRes.data;
        setUserData(user);

        const company =
          user.companyId?._id || user.company?._id || user.companyId || null;

        console.log("🏢 Company ID from getMe:", company);

        if (!company) {
          console.warn("⚠️ No company ID found in user data");
          return;
        }

        // 🔹 Step 2: Fetch employees using that company ID
        const empRes = await axios.get(
          `${API_URL}/api/employee/getEmployeesByCompany?companyId=${company}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Employee API Response:", empRes.data);

        // 🔹 Step 3: Safely extract employees
        const employeeList =
          empRes.data?.data || empRes.data?.employees || empRes.data || [];

        setEmployees(employeeList);
      } catch (err: any) {
        console.error(
          "❌ Error fetching employees:",
          err.response?.data || err
        );
      }
    };

    getUserAndEmployees();
  }, []);

  // ✅ Sync current tab with board name
  useEffect(() => {
    const currentBoardIndex = boardNames.findIndex(
      (name) => name.toLowerCase() === task.boardId?.name?.toLowerCase()
    );
    if (currentBoardIndex !== -1) {
      setTabValue(currentBoardIndex);
    } else {
      const todoIndex = boardNames.findIndex((n) =>
        n.toLowerCase().includes("to do")
      );
      setTabValue(todoIndex !== -1 ? todoIndex : 0);
    }
  }, [task, boards]);

  const handleBoardChange = async (i: number) => {
    const newBoard = boardNames[i];
    setTabValue(i);
    if (newBoard && newBoard !== task.boardId?.name) {
      await onTaskMove(newBoard);
    }
  };

  // Reassign task API
  const handleReassignTask = async (taskId: string, newAssigneeId: string) => {
    if (!taskId || !newAssigneeId) {
      return alert("Please select an assignee.");
    }

    try {
      const token = localStorage.getItem("authtoken");

      // Get current assignee and reporter names for history
      const oldAssigneeName = task?.assignee
        ? `${task.assignee.firstName || ""} ${
            task.assignee.lastName || ""
          }`.trim()
        : "Unassigned";

      const newAssignee = employees.find(
        (emp: any) => emp.id === newAssigneeId
      );
      const newAssigneeName = newAssignee
        ? `${newAssignee.firstName || ""} ${newAssignee.lastName || ""}`.trim()
        : "Unknown";

      const reporterName = task?.reporter
        ? `${task.reporter.firstName || ""} ${
            task.reporter.lastName || ""
          }`.trim()
        : "Unassigned";

      // ✅ Updated API endpoint and payload
      await axios.patch(
        `${API_URL}/api/task/${taskId}/ree`,
        {
          newAssigneeId: newAssigneeId,
          newReporterId: task?.reporter?._id || null,
          createdBy: userData?.id,
          newAssigneeName: newAssigneeName,
          newReporterName: reporterName,
          oldAssigneeName: oldAssigneeName,
          oldReporterName: reporterName,
          status: task?.status || "To Do",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Task reassigned successfully!");
      setShowAddModal1(false);

      // Optionally refresh task data
      // await fetchTaskDetails(); // if you have this function
    } catch (err: any) {
      console.error("Error reassigning task:", err);
      alert(err.response?.data?.message || "Failed to reassign task");
    }
  };

  const saveComment = async () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerHTML.trim();
    if (!text) return alert("Comment cannot be empty");

    try {
      const token = localStorage.getItem("authtoken");

      const res = await axios.patch(
        `${API_URL}/api/task/${task?._id}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Create new comment object
      const newComment = {
        text,
        createdBy: userData?.firstName || "You",
        createdAt: new Date().toISOString(),
        _id: res.data?._id || Math.random().toString(36).substring(2, 9), // temporary id
      };

      // ✅ Instantly show comment in UI
      setComments((prev) => [...prev, newComment]);

      // ✅ Clear editor
      editorRef.current.innerHTML = "";
      updateActiveFormats();

      // ✅ Optionally sync again from backend to keep timestamps accurate
      setTimeout(fetchComments, 500);
    } catch (err) {
      console.error("❌ Error saving comment:", err);
    }
  };

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });

  // Update active format buttons
  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  const applyFormat = (command: string) => {
    if (command === "createLink") {
      const url = prompt("Enter URL");
      if (url) document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, "");
    }
    editorRef.current?.focus();
    updateActiveFormats();
  };

  const fetchComments = async (projectId?: string) => {
    if (!projectId) return; // ✅ guard

    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      // ✅ Fetch all tasks under this project
      const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = res.data?.data?.tasks || [];

      // ✅ Find the current task from the list
      const currentTask = tasks.find((t: any) => t._id === task?._id);

      // ✅ Set comments if found
      if (currentTask?.comments) {
        setComments(currentTask.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // ✅ Call it when task changes
  useEffect(() => {
    if (task?.projectId && task?._id) {
      fetchComments(task.projectId);
    }
  }, [task?.projectId, task?._id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("authtoken");
      await axios.patch(
        `${API_URL}/api/task/${task?._id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Only re-fetch comments (do not append locally)
      await fetchComments();

      // Clear the input box
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getInitials = (assignee: any) => {
    if (!assignee) return "";
    const first = assignee.firstName ? assignee.firstName[0] : "";
    const last = assignee.lastName ? assignee.lastName[0] : "";
    return (first + last).toUpperCase();
  };

  const fetchAttachments = async (projectId?: string) => {
    if (!projectId) return; // ✅ guard
    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = res.data?.data?.tasks || [];

      const newAttachments: { [taskId: string]: any[] } = {};
      tasks.forEach((t: any) => {
        newAttachments[t._id] = t.attachments || [];
      });

      setAttachments(newAttachments);
    } catch (err) {
      console.error("Error fetching attachments:", err);
    }
  };

  useEffect(() => {
    if (task?.projectId) fetchAttachments(task.projectId);
  }, [task?.projectId]);

  interface Attachment {
    fileName: string;
    fileUrl: string;
  }

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (!e.target.files || !task?._id) return;

    const token = localStorage.getItem("authtoken");
    if (!token) return;

    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("attachments", file);
        formData.append("name", file.name);

        await axios.patch(
          `${API_URL}/api/task/${task._id}/attachments/upload-multiple`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (task?.projectId) fetchAttachments(task.projectId);
      } catch (err: any) {
        console.error("Error uploading attachment:", err.response?.data || err);
      }
    }

    e.target.value = "";
  };

  const fetchIssues = async (projectId?: string) => {
    if (!projectId) return; // guard

    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = res.data?.data?.tasks || [];
      const allIssues = tasks.flatMap((t: any) =>
        (t.issues || []).map((issue: any) => ({
          ...issue,
          taskId: t._id, // keep reference to update later
        }))
      );

      // ✅ filter only "Created" issues
      setIssues(allIssues.filter((issue: any) => issue.status === "Created"));
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const handleMarkAsDone = async () => {
    if (selectedIssues.length === 0) return;

    if (!userData?.id) {
      console.error("User not authenticated");
      return;
    }

    const token = localStorage.getItem("authtoken");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    // Capture the issues that are being marked as Done
    const issuesToUpdate = issues.filter((issue) =>
      selectedIssues.includes(issue._id)
    );

    // Optimistically remove them from UI
    setIssues((prev) =>
      prev.filter((issue) => !selectedIssues.includes(issue._id))
    );
    setSelectedIssues([]);

    try {
      await Promise.all(
        issuesToUpdate.map(async (issue) => {
          if (!issue?.taskId) return;

          await axios.patch(
            `${API_URL}/api/task/issue/${issue.taskId}/${issue._id}`,
            { status: "Done", updatedBy: userData._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
    } catch (err) {
      console.error("Error updating issue status:", err);

      // Re-fetch issues if API fails
      if (task?.projectId) fetchIssues(task.projectId);
    }
  };

  const toggleIssueSelection = (id: string) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (task?.projectId) fetchIssues(task?.projectId);
  }, [task?.projectId]);

  const [startTime, setStartTime] = useState<string>("");

  useEffect(() => {
    const now = dayjs().format("HH:mm");
    setStartTime(now);
    console.log("🟢 Page entered at:", now);
  }, []);

  const handleBackClick = async () => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      console.error("❌ No auth token");
      setIsTodo(false);
      return;
    }

    if (!task?._id) {
      console.error("❌ No task ID");
      setIsTodo(false);
      return;
    }

    const workDate = dayjs().format("YYYY-MM-DD");
    const endTime = dayjs().format("HH:mm");

    const payload = {
      workDate,
      startTime,
      endTime,
    };

    try {
      console.log("📦 Sending payload:", payload);
      await axios.post(`${API_URL}/api/task/${task._id}/timelogs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Timelog saved successfully");
    } catch (err) {
      console.error("❌ Error sending timelog:", err);
    } finally {
      setIsTodo(false);
    }
  };

  return (
    <>
      <div className="p-3">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={handleBackClick}
        >
          <FaChevronLeft size={20} />
          <Typography variant="h6">
            {task.boardId?.name || "To Do List"}
          </Typography>
        </div>

        {/* Board Tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          {boardNames.map((tab, i) => (
            <div
              key={i}
              onClick={() => handleBoardChange(i)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px",
                fontSize: "16px",
                color: i === tabValue ? "white" : "#1784A2",
                border: "2px solid #1784A2",
                backgroundColor: i === tabValue ? "#1784A2" : "white",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab}
            </div>
          ))}

          {/* ⋯ More Icon Tab */}
          <div
            onClick={() => setShowAddModal1(true)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#1784A2",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              border: "2px solid #1784A2",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ⋯
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {/* Left Column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Project Detail
                </Typography>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    rowGap: "16px",
                    columnGap: "24px",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Task Name:</span>
                  <span>{task.name}</span>

                  <span style={{ fontWeight: 600 }}>Created Date:</span>
                  <span>{new Date(task.createdDate).toLocaleDateString()}</span>

                  <span style={{ fontWeight: 600 }}>Assignee:</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "28px",
                        height: "28px",
                        fontSize: "14px",
                      }}
                    >
                      {task?.assignee?.firstName
                        ? task.assignee.firstName.charAt(0).toUpperCase()
                        : "N"}
                    </div>
                    <span>
                      {" "}
                      {task?.assignee
                        ? `${task.assignee.firstName} ${task.assignee.lastName}`
                        : "N/A"}
                    </span>
                  </div>

                  <span style={{ fontWeight: 600 }}>Reporter:</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "28px",
                        height: "28px",
                        fontSize: "14px",
                      }}
                    >
                      {task?.reporter?.firstName
                        ? task.reporter.firstName.charAt(0).toUpperCase()
                        : "N"}
                    </div>
                    <span>
                      {" "}
                      {task?.reporter
                        ? `${task.reporter.firstName} ${task.reporter.lastName}`
                        : "N/A"}
                    </span>
                  </div>
                  <span style={{ fontWeight: 600 }}>Priority:</span>
                  <span>{task?.priority}</span>
                  <span style={{ fontWeight: 600 }}>Due Date:</span>
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <Card style={{ flex: 1.5 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activities
              </Typography>
              <Tabs
                value={activityTab}
                onChange={(_, v) => setActivityTab(v)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Description" />
                <Tab label="History" />
                <Tab label="Comments" />
                <Tab label="Attachment" />
                <Tab label="Issues" />
              </Tabs>

              {activityTab === 0 && <p>no description is here!!!</p>}

              {/* History */}
              {activityTab === 1 && (
                <div style={{ marginTop: "20px" }}>
                  {(task?.history ?? []).length > 0 ? (
                    task?.history?.map((entry: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: "24px",
                              height: "24px",
                              fontSize: "12px",
                            }}
                          >
                            {typeof entry.createdBy === "string"
                              ? entry.createdBy.charAt(0).toUpperCase()
                              : entry.createdBy?.firstName
                              ? entry.createdBy.firstName
                                  .charAt(0)
                                  .toUpperCase()
                              : "N"}
                          </div>
                          <span>{entry.message}</span>
                        </div>
                        <span style={{ fontSize: "14px", color: "#888" }}>
                          {new Date(entry.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ marginTop: "8px", color: "#888" }}>
                      No history available
                    </div>
                  )}
                </div>
              )}

              {/* Comments */}
              {activityTab === 2 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "400px",
                    marginTop: "20px",
                  }}
                >
                  {/* Comments Section */}
                  <div
                    style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}
                  >
                    {task?.comments && task.comments.length > 0 ? (
                      task.comments.map((comment) => {
                        const createdBy =
                          typeof comment.createdBy === "string"
                            ? comment.createdBy
                            : comment.createdBy?._id || "NA";

                        const initials =
                          typeof comment.createdBy === "string"
                            ? comment.createdBy.charAt(0).toUpperCase()
                            : comment.createdBy?.firstName
                            ? comment.createdBy.firstName
                                .charAt(0)
                                .toUpperCase()
                            : "N";

                        return (
                          <div
                            key={comment._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: "24px",
                                height: "24px",
                                fontSize: "12px",
                              }}
                            >
                              {initials}
                            </div>

                            <span>{comment.text}</span>

                            <span
                              style={{
                                marginLeft: "auto",
                                fontSize: "12px",
                                color: "#888",
                              }}
                            >
                              {new Date(comment.createdAt).toLocaleString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ color: "#888" }}>No comments yet</div>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div style={{ marginTop: "auto" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <button
                        onClick={() => applyFormat("bold")}
                        style={{
                          border: "none",
                          background: activeFormats.bold ? "#ddd" : "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        B
                      </button>
                      <button
                        onClick={() => applyFormat("italic")}
                        style={{
                          border: "none",
                          background: activeFormats.italic ? "#ddd" : "none",
                          cursor: "pointer",
                          fontStyle: "italic",
                        }}
                      >
                        I
                      </button>
                      <button
                        onClick={() => applyFormat("underline")}
                        style={{
                          border: "none",
                          background: activeFormats.underline ? "#ddd" : "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        U
                      </button>
                      <button
                        onClick={() => applyFormat("createLink")}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        🔗
                      </button>
                      <button
                        onClick={() => applyFormat("insertUnorderedList")}
                        style={{
                          border: "none",
                          background: activeFormats.insertUnorderedList
                            ? "#ddd"
                            : "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "4px",
                        }}
                      >
                        <FaListUl size={18} />
                      </button>
                      <button
                        onClick={() => applyFormat("insertOrderedList")}
                        style={{
                          border: "none",
                          background: activeFormats.insertOrderedList
                            ? "#ddd"
                            : "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "4px",
                        }}
                      >
                        <FaListOl size={18} />
                      </button>
                    </div>

                    {/* Editable Div */}
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={updateActiveFormats}
                      onKeyUp={updateActiveFormats}
                      onMouseUp={updateActiveFormats}
                      style={{
                        minHeight: "100px",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        outline: "none",
                        overflowY: "auto",
                        color: "#000",
                      }}
                      data-placeholder="Type here....."
                      className="editable-div"
                      suppressContentEditableWarning={true}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "8px",
                      }}
                    >
                      <button
                        style={{
                          color: "#555",
                          border: "none",
                          borderBottom: "1px dotted #555",
                        }}
                        onClick={() => {
                          if (editorRef.current) {
                            editorRef.current.innerHTML = "";
                            updateActiveFormats();
                          }
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        style={{
                          minWidth: "120px",
                          background: "#1784A2",
                          color: "white",
                          padding: "4px 12px",
                          border: "none",
                          borderRadius: "4px",
                        }}
                        onClick={saveComment}
                        disabled={!task?._id}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {activityTab === 3 && task && (
                <div className="attachments-section">
                  <div className="row g-4 mb-4 justify-content-start">
                    {(attachments[task._id] || []).map(
                      (file: any, i: number) => (
                        <div
                          key={file._id || file.name}
                          className="col-12 col-md-6"
                        >
                          <div className="card h-100 shadow-sm">
                            <div
                              className="p-3 position-relative d-flex align-items-center justify-content-center"
                              style={{ height: "120px" }}
                            >
                              {/* Wrap preview in clickable link */}
                              <a
                                href={`${API_URL}${file.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {(() => {
                                  const ext = file.name
                                    ?.split(".")
                                    .pop()
                                    ?.toLowerCase();
                                  if (
                                    ["png", "jpg", "jpeg", "gif"].includes(ext)
                                  ) {
                                    return (
                                      <img
                                        src={`${API_URL}${file.url}`}
                                        alt={file.name}
                                        style={{
                                          maxHeight: "100%",
                                          maxWidth: "100%",
                                          objectFit: "contain",
                                        }}
                                      />
                                    );
                                  }
                                  if (ext === "pdf") {
                                    return (
                                      <img
                                        src="/icons/pdf-icon.png"
                                        alt="PDF"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                      />
                                    );
                                  }
                                  if (["doc", "docx"].includes(ext)) {
                                    return (
                                      <img
                                        src="/icons/doc-icon.png"
                                        alt="DOC"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                      />
                                    );
                                  }
                                  return (
                                    <img
                                      src="/icons/file-icon.png"
                                      alt="File"
                                      style={{ width: "40px", height: "40px" }}
                                    />
                                  );
                                })()}
                              </a>
                            </div>

                            <hr className="m-0" />

                            <div className="card-body p-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column">
                                  <a
                                    href={`${API_URL}${file.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card-title text-primary small fw-medium mb-1 text-truncate"
                                  >
                                    Attachment- {i + 1}
                                  </a>
                                  <p className="text-muted small fs-6 mb-0">
                                    {new Date(
                                      file.uploadedAt || Date.now()
                                    ).toLocaleString()}
                                  </p>
                                </div>

                                <div
                                  className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {file.uploadedBy?.charAt(0).toUpperCase() ||
                                    "U"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Upload box */}
                  <div
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    style={{
                      border: "1px solid #E9E9E9",
                      borderRadius: "8px",
                      padding: "30px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      width: "100%",
                      maxWidth: "400px",
                      margin: "0 auto",
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f8ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fafafa")
                    }
                  >
                    <div style={{ fontWeight: 600, color: "#7A7A7A" }}>
                      Upload File Or Drag file here
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      style={{ display: "none" }}
                      multiple
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}

              {activityTab === 4 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "400px",
                    marginTop: "20px",
                    border: "1px solid #eee", // optional styling
                    borderRadius: "6px",
                    overflow: "hidden", // keep inner scrollable area confined
                  }}
                >
                  {/* Scrollable issues list */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "10px",
                    }}
                  >
                    <h6>New Issues</h6>

                    {issues.length > 0 ? (
                      issues.map((issue) => (
                        <div
                          key={issue._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIssues.includes(issue._id)}
                            onChange={() => toggleIssueSelection(issue._id)}
                            style={{ marginRight: "8px" }}
                          />
                          <div style={{ flex: 1 }}>{issue.title}</div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#888",
                              marginLeft: "16px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {new Date(issue.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#888", fontSize: "12px" }}>
                        No new issues yet.
                      </p>
                    )}
                  </div>

                  {/* Buttons outside scrollable div */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderTop: "1px solid #ccc",
                      background: "#fff",
                      zIndex: 10,
                    }}
                  >
                    <button
                      style={{
                        color: "#555",
                        border: "none",
                        borderBottom: "1px dotted #555",
                        cursor: "pointer",
                        padding: "4px 8px",
                        background: "none",
                      }}
                      onClick={() => setSelectedIssues([])}
                    >
                      Cancel
                    </button>

                    <button
                      style={{
                        minWidth: "120px",
                        background: "#1784A2",
                        color: "white",
                        padding: "6px 14px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={handleMarkAsDone}
                      disabled={selectedIssues.length === 0}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ Task Reassign Modal */}
      {showAddModal1 && (
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
          {/* Backdrop */}
          <div
            onClick={() => setShowAddModal1(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: "min(85vw, 380px)",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "25px",
              boxSizing: "border-box",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              fontSize: "0.85rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "1rem" }}>Task Reassign To</h5>
              <button
                onClick={() => setShowAddModal1(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
              >
                ×
              </button>
            </div>

            <hr style={{ margin: "8px 0" }} />

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>
                  Assignee Name
                </label>
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                  }}
                >
                  <option value="">-- Select Employee --</option>

                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {`${emp.firstName || ""} ${emp.lastName || ""}`.trim()}
                      </option>
                    ))
                  ) : (
                    <option disabled>No employees found</option>
                  )}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#1784A2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    width: "120px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReassignTask(task._id, selectedAssignee)} // ✅ fixed
                >
                  Reassign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoPage;
