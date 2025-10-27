import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, Avatar, Tabs, Tab } from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaTable, FaList, FaExclamationCircle, FaTrash, FaEllipsisV, FaComment, FaExclamationTriangle, FaChalkboard, FaEdit, FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FaEllipsisH, FaListUl, FaListOl } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../config";
import { useLocation, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";

  import { useNavigate } from "react-router-dom";


import "./Board.css";
import { message } from "antd";
import { Button } from "react-bootstrap";

interface BoardProps {
  isTodo: boolean;
  setIsTodo: (value: boolean) => void;
}
interface Board {
  _id: string;
  name: string;
  // add any other fields returned by your API
}

interface Project {
  _id: string;
  name: string;
  path: string;
}

interface Task {
  id: string;
  name: string;
  createdDate: string;
  assignee?: { name: string };
  reporter?: { name: string };
  priority?: string;
  dueDate?: string;
  tracking?: { workDate: string; startTime: string; endTime: string }[];
  boardId?: { name: string };
  attachments?: { id: string; name: string; img: string; time: string }[];
}

interface Props {
  currentProjectId: string;
}

const Board: React.FC<BoardProps> = ({ isTodo, setIsTodo }) => {
  const [activeTable, setActiveTable] = useState<"A" | "B">("A");
  const [activeBoard, setActiveBoard] = useState<string>("To Do"); // default board
  const [tabValue, setTabValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showOptions, setShowOptions] = useState(false);
  const [showAddModal1, setShowAddModal1] = useState(false);
  const [showTodoTooltip, setShowTodoTooltip] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]); // fetched boards for current project
  const [loading, setLoading] = useState(false);
  const [newBoardName, setNewBoardName] = useState(""); // input for new board
  const [newDesignation, setNewDesignation] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchParams] = useSearchParams();
  const currentProjectId = searchParams.get("projectId");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<OuterCard | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format as YYYY-MM-DD
  });
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState("");
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksByBoard, setTasksByBoard] = useState<{ [key: string]: any[] }>({});
  const [jobCategories, setJobCategories] = useState([]);
  const [selectedTask, setSelectedTask] = useState<OuterCard | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<Record<string, any[]>>({});
  const [issues, setIssues] = useState<any[]>([]);          // List of issues
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDescription, setNewIssueDescription] = useState(""); // this will store editor content
  const [editTask, setEditTask] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

// Inside your component
const navigate = useNavigate();
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


  interface TimeLog {
    workDate: string;
    startTime: string;
    endTime: string;
    hours?: number;
    loggedBy?: string;
  }


  interface OuterCard {
    attachments: any;
    // timeLogs: any;
    allowAdd: boolean;
    count: any;
    _id: string;
    name: string;
    boardId: { name: string, _id: any };
    assignee?: {
      _id(_id: any): unknown; firstName: string; lastName: string
    };
    reporter?: { firstName: string; lastName: string };
    priority?: string;
    dueDate?: string;
    createdDate: any
    timeLogs?: TimeLog[];
    history?: {
      message: string;
      createdBy: { firstName: string; lastName: string } | string;
      createdAt: string;
    }[];
    comments?: {
      _id: string;
      text: string;
      createdBy: string | { firstName: string; lastName: string };
      createdAt: string;
    }[];
    projectId: any;
  }


  const [outerCards, setOuterCards] = useState<OuterCard[]>([]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      setCompanyId(res.data.companyId);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);


  const handleDelete = () => {
    console.log("Task deleted ✅");
    setShowModal(false);
  };

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setActiveTooltip(null); // close tooltip
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getMe = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        const res = await axios.get(`${API_URL}/api/auth/getMe`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
        setCompanyId(res.data.companyId); // store companyId
      } catch (err) {
        console.error(err);
      }
    };
    getMe();
  }, []);

  const fetchBoards = async (projectId: string) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/task/${projectId}/board`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map API data into outerCards structure
      const cards: OuterCard[] = res.data.data.boards.map((board: any) => ({
        _id: board._id,
        name: board.name,   // <-- FIXED (was board.title)
        count: board.tasks?.length?.toString() || "0",

        allowAdd: board.allowAdd ?? true,
        projectId: board.projectId,
      }));

      setOuterCards(cards);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showAddModal1) {
      const fetchJobCategories = async () => {
        try {
          const token = localStorage.getItem("authtoken");
          const res = await axios.get(
            `${API_URL}/api/employee/jobCategories?companyId=${companyId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setJobCategories(res.data.data); // <-- fix here
        } catch (err) {
          console.error("Failed to fetch job categories", err);
        }
      };
      fetchJobCategories();
    }
  }, [showAddModal1]);

  const location = useLocation();
 const createBoard = async () => {
  if (loading) return; // prevent multiple clicks
  if (!newBoardName.trim()) return alert("Enter board name");
  if (!currentProjectId) return alert("No project selected");

  setLoading(true); // start loading
  try {
    const token = localStorage.getItem("authtoken");
    if (!token) return alert("User not authenticated");

    await axios.post(
      `${API_URL}/api/task/board`,
      { projectId: currentProjectId, name: newBoardName, jobCategory: newDesignation || "all" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Refresh boards for the current project
    await fetchBoards(currentProjectId);

    // Clear inputs and close modal
    setNewBoardName("");
    setShowAddModal1(false); // ✅ closes the modal
    message.success("Board Created Successfully");
  } catch (err: any) {
    console.error("Error creating board:", err);
    alert(err.response?.data?.message || "Failed to create board");
  } finally {
    setLoading(false); // stop loading
  }
};



  useEffect(() => {
    if (currentProjectId) {
      fetchBoards(currentProjectId);
    }
  }, [currentProjectId, location.key]);

  const toggleTooltip = (boardName: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setActiveTooltip(activeTooltip === boardName ? "" : boardName);
  };
  useEffect(() => {
    const handleAnyClick = () => {
      setActiveTooltip(""); // close tooltip
    };

    document.addEventListener("click", handleAnyClick);

    return () => {
      document.removeEventListener("click", handleAnyClick);
    };
  }, []);


  const handleAddTaskClick = (board: OuterCard) => {
    setModalMode("add");
    setCurrentTask(null);       // reset form
    setNewTaskName("");
    setAssignee("");
    setReporter("");
    setPriority("");
    setDueDate("");

    setCurrentBoard(board);     // assign the clicked board

    setShowAddModal(true);
  };

  const handleEditTaskClick = (task: any) => {
    setModalMode("edit");
    setCurrentTask(task);
    setNewTaskName(task.title || "");
    setAssignee(task.assignee?._id || "");
    setReporter(task.reporter?._id || "");
    setPriority(task.priority || "");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setShowAddModal(true);
  };

  const submitTask = async () => {
    if (!currentBoard) {
      alert("No board selected");
      return;
    }

    const token = localStorage.getItem("authtoken");
    if (!token) {
      alert("No token found, please log in again");
      return;
    }

    const payload = {
      name: newTaskName,
      projectId: currentProjectId, // required by backend
      boardId: currentBoard._id,   // selected board
      assignee,
      reporter,
      priority,
      dueDate,
      status: "In Progress",       // default or your modal’s value
    };

    try {
      if (modalMode === "add") {
        await axios.post(`${API_URL}/api/task`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Task Created!");
      } else if (modalMode === "edit" && currentTask?._id) {
        await axios.put(`${API_URL}/api/task/${currentTask._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Task updated!");
      }

      // Close modal
      setShowAddModal(false);

      // ✅ Immediately fetch latest tasks so UI updates
      if (currentProjectId) {
        await fetchTasks(currentProjectId);
      }
    } catch (err: any) {
      console.error("❌ Task error:", err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };


  useEffect(() => {
    if (!companyId) return;

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await axios.get(`${API_URL}/api/employee/filter?companyId=${companyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployeeList(res.data.data); // adjust according to API response
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, [companyId]);

  const fetchTasks = async (projectId: string) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasksData = res.data.data.tasks || [];
      setTasks(tasksData);

      // Group tasks by board name
      const grouped: { [key: string]: any[] } = {};
      tasksData.forEach((task: any) => {
        const boardName = task.boardId?.name || "Unassigned";
        if (!grouped[boardName]) grouped[boardName] = [];
        grouped[boardName].push(task);
      });

      setTasksByBoard(grouped);

      // Select first task if none is selected
      if (tasksData.length > 0 && !selectedTask) {
        setSelectedTask(tasksData[0]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };


  useEffect(() => {
    if (currentProjectId) {
      fetchTasks(currentProjectId);
    }
  }, [currentProjectId]);

  const handleMoveTasksToBoard = async (board: any, direction: "left" | "right") => {
    const tasksToMove = tasksByBoard[board.name] || [];

    if (tasksToMove.length === 0) {
      console.warn("No tasks to move in this board");
      return;
    }

    const boardIndex = outerCards.findIndex(b => b._id === board._id);
    if (boardIndex === -1) return;

    // Determine target board name
    let targetBoardName = "";
    if (direction === "left" && boardIndex > 0) {
      targetBoardName = outerCards[boardIndex - 1].name;
    } else if (direction === "right" && boardIndex < outerCards.length - 1) {
      targetBoardName = outerCards[boardIndex + 1].name;
    } else {
      console.warn("Cannot move tasks further in this direction");
      return;
    }

    try {
      const token = localStorage.getItem("authtoken");
      if (!token) throw new Error("No auth token found");

      // Call the PATCH API for each task
      await Promise.all(
        tasksToMove.map(task =>
          axios.patch(
            `${API_URL}/api/task/${task._id}/move`,
            { targetBoardName }, // send target board name
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      console.log(`Tasks from board "${board.name}" moved to "${targetBoardName}"`);

      // Refresh tasks after moving
      if (currentProjectId) fetchTasks(currentProjectId);
    } catch (err) {
      console.error("Error moving tasks:", err);
    }
  };

  const handleEditBoard = async (board: any) => {
    const newName = prompt("Enter new board name:", board.name);
    if (!newName) return;

    try {
      const token = localStorage.getItem("authtoken");
      if (!token) throw new Error("No auth token found");

      await axios.patch(
        `${API_URL}/api/task/board/${board._id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (currentProjectId) fetchBoards(currentProjectId);
      console.log("Board edited successfully");
    } catch (err) {
      console.error("Error editing board:", err);
    }
  };

  const handleDeleteBoard = async (board: any) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      const token = localStorage.getItem("authtoken");
      if (!token) throw new Error("No auth token found");

      await axios.delete(`${API_URL}/api/task/board/${board._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (currentProjectId) fetchBoards(currentProjectId);
      console.log("Board deleted successfully");
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  const handleMoveTask = async (targetBoardName: string) => {
    if (!selectedTask?._id) return;

    try {
      const token = localStorage.getItem("authtoken");
      await axios.patch(
        `${API_URL}/api/task/${selectedTask._id}/move`,
        { targetBoardName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update selectedTask
      setSelectedTask((prev) =>
        prev ? { ...prev, boardId: { ...prev.boardId, name: targetBoardName } } : prev
      );

      // Update tasks array
      setTasks(prev =>
        prev.map(t =>
          t._id === selectedTask._id
            ? { ...t, boardId: { name: targetBoardName } }
            : t
        )
      );

      // Update tasksByBoard
      setTasksByBoard(prev => {
        const oldBoardName = selectedTask.boardId.name; // original board
        const newBoardName = targetBoardName;

        const newPrev: { [key: string]: any[] } = {};

        // Copy all boards
        Object.keys(prev).forEach(board => {
          // Remove the moved task from its old board
          if (board === oldBoardName) {
            newPrev[board] = prev[board].filter(t => t._id !== selectedTask._id);
          } else {
            newPrev[board] = [...prev[board]];
          }
        });

        // Add the task to the new board
        if (!newPrev[newBoardName]) newPrev[newBoardName] = [];
        newPrev[newBoardName].push({ ...selectedTask, boardId: { name: newBoardName } });

        return newPrev;
      });


    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const saveComment = async () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerHTML.trim();
    if (!text) return alert("Comment cannot be empty");

    try {
      const token = localStorage.getItem("authtoken");

      const res = await axios.patch(
        `${API_URL}/api/task/${selectedTask?._id}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Construct the comment for immediate display
      const newComment = {
        _id: res.data._id,
        text: res.data.text,
        createdAt: res.data.createdAt,
        // Use logged-in user info
        createdBy: {
          _id: userData._id, // make sure you have userData in context or state
          firstName: userData.firstName,
          lastName: userData.lastName || "",
        },
      };

      setSelectedTask((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...(prev.comments || []), newComment],
        };
      });

      editorRef.current.innerHTML = "";
      updateActiveFormats();
    } catch (err) {
      console.error("Error saving comment:", err);
    }
  };



const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  taskId: string
) => {
  if (!e.target.files || !taskId) return;

  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  const formData = new FormData();
  files.forEach((file) => formData.append("attachments", file)); // backend expects "attachments"

  try {
    const token = localStorage.getItem("authtoken");
    if (!token) throw new Error("Not authorized");

    await axios.patch(
      `${API_URL}/api/task/${taskId}/attachments/upload-multiple`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    message.success("Files uploaded successfully!");
    fetchAttachments(selectedTask?.projectId); // refresh attachments list
  } catch (err) {
    console.error("Error uploading files:", err);
    message.error("Failed to upload files");
  } finally {
    e.target.value = ""; // reset input
  }
};

  const fetchAttachments = async (projectId: string) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Group attachments by task
      const grouped: Record<string, any[]> = {};
      res.data.data.tasks.forEach((task: any) => {
        grouped[task._id] = task.attachments || [];
      });

      setAttachments(grouped); // attachments will now be { [taskId]: Attachment[] }
    } catch (err) {
      console.error("Error fetching attachments:", err);
    }
  };



  useEffect(() => {
    if (selectedTask?.projectId) {
      fetchAttachments(selectedTask.projectId);
    }
  }, [selectedTask?.projectId]);


  const createIssue = async () => {
    if (!selectedTask?._id || !newIssueDescription) return;

    try {
      const token = localStorage.getItem("authtoken");
      await axios.post(`${API_URL}/api/task/${selectedTask._id}/issues`, {
        title: newIssueDescription,
        description: "",
        status: "Created",
      }, { headers: { Authorization: `Bearer ${token}` } });

      // Clear editor
      setNewIssueDescription("");
      if (editorRef.current) editorRef.current.innerHTML = "";

      // Fetch updated issues for this task
      fetchIssues(selectedTask._id);
    } catch (err) {
      console.error("Error creating issue:", err);
    }
  };


  const fetchIssues = async (taskId: string) => {
    if (!taskId) return;

    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${API_URL}/api/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const task = res.data.data.task;
      setIssues(task.issues || []); // store all issues
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  useEffect(() => {
    if (selectedTask?._id) {
      fetchIssues(selectedTask._id);
    }
  }, [selectedTask?._id]);

  const deleteTask = async (taskId: string, projectId: string) => {
    if (!taskId) return;

    try {
      const token = localStorage.getItem("authtoken");

      await axios.delete(`${API_URL}/api/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Task deleted successfully");

      setShowModal(false);

      // Refresh tasks
      fetchTasks(projectId);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

  const handleTaskCompleted = async (taskId?: string) => {
    console.log("--------------")
    if (!taskId) return; // exit if taskId is undefined
    try {
      const token = localStorage.getItem("authtoken");
      await axios.patch(`${API_URL}/api/task/${taskId}`, { status: "Completed" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("clicked--------------")
      fetchBoards(selectedTask?.projectId);
      message.success("Task completed.")
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // ✅ optional chaining
    if (!file) {
      console.log("No file selected");
      return;
    }
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedTask) return alert("Select a task and file");

    const boardId = selectedTask?._id || "";
    const projectId =
      typeof selectedTask?.projectId === "object"
        ? selectedTask.projectId._id
        : selectedTask.projectId;

    if (!projectId) return alert("Project ID is missing");

    const token = localStorage.getItem("authtoken");
    if (!token) return alert("User not authenticated");

    // Use 'id' from getMe response
    let userId = userData?.id;
    if (!userId) {
      try {
        const res = await axios.get(`${API_URL}/api/auth/getMe`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userId = res.data.id;   // ✅ use 'id' instead of '_id'
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        return alert("Failed to load user data");
      }
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("boardId", boardId);
    formData.append("projectId", projectId);
    formData.append("createdBy", userId); // logged-in user's id
    formData.append("id", userId);        // same id

    try {
      await axios.post(`${API_URL}/api/task/upload-tasks`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("File uploaded successfully");
      setShowExcelModal(false);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error details:", error.response?.data || error.message);
      alert("Error uploading tasks: " + (error.response?.data?.message || error.message));
    }
  };

  const getInitials = (assignee: any) => {
    if (!assignee) return "";
    const first = assignee.firstName ? assignee.firstName[0] : "";
    const last = assignee.lastName ? assignee.lastName[0] : "";
    return (first + last).toUpperCase();
  };


  return (
    <>
      <div style={{ margin: 0 }}>
        {!isTodo ? (
          <>
            {/* Board Filter + View */}
            <div className="d-flex justify-content-between align-items-center mb-2 p-2">
              <div className="ms-3 mt-2 d-flex gap-3 align-items-center">
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
                <FaTable size={20} style={{ cursor: "pointer", color: activeTable === "A" ? "#1784A2" : "#555" }} onClick={() => setActiveTable("A")} />
                <FaList size={20} style={{ cursor: "pointer", color: activeTable === "B" ? "#1784A2" : "#555" }} onClick={() => setActiveTable("B")} />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                {(selectedTask?.assignee
                  ? [selectedTask.assignee] // wrap single assignee into array
                  : []
                ).slice(0, 2) // show only first 2
                  .map((assignee, index) => (
                    <div
                      key={index}
                      className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginLeft: index === 0 ? 0 : "-13px",
                        zIndex: 2 - index,
                        backgroundColor: "white",
                      }}
                    >
                      {assignee.firstName[0].toUpperCase()}
                    </div>
                  ))}

                {selectedTask?.assignee && ([selectedTask.assignee].length > 2) && (
                  <div
                    className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginLeft: "-13px",
                      zIndex: 0,
                      backgroundColor: "white",
                    }}
                  >
                    +{[selectedTask.assignee].length - 2}
                  </div>
                )}
              </div>

            </div>

            {/* Table A */}
            {activeTable === "A" && (
              <div style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                overflowX: "auto",      // horizontal scroll
                overflowY: "hidden",    // hide vertical scroll
                scrollBehavior: "smooth",
                msOverflowStyle: "none", // hide scrollbar in IE/Edge
                scrollbarWidth: "none",  // hide scrollbar in Firefox
              }}
                className="card-carousel" >
                {outerCards.map((outer, i) => (
                  <Card
                    key={i}
                    style={{
                      flex: "0 0 calc((100% - 40px) / 3)",// 3 cards visible
                      borderRadius: "16px",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <CardContent>
                      {/* Board header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <Typography style={{ fontWeight: 600, fontSize: "14px", color: "#353535" }}>
                          {outer.name}
                        </Typography>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Typography variant="subtitle1">{outer.count}</Typography>
                          <div style={{ position: "relative" }}>
                            <button

                              style={{
                                border: "none",
                                cursor: "pointer",
                                padding: "5px",
                                borderRadius: "4px",
                                color: "black",
                                backgroundColor: "white",
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // prevent parent Card click
                                toggleTooltip(outer.name, e);
                              }}
                            >
                              <FaEllipsisH size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tasks for this board */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {(tasksByBoard[outer.name] || []).map((task: any, j: number) => (
                          <Card
                            key={task._id || j}
                            style={{
                              borderRadius: "12px",
                              padding: "12px",
                              boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSelectedTask(task); // select this task
                              setIsTodo(true);       // show detail view
                            }}
                          >
                            {/* Task Title */}
                            <Typography
                              variant="body2"
                              style={{
                                marginBottom: "8px",
                                fontWeight: 500,
                                color: "#353535",
                              }}
                            >
                              {task.name}
                            </Typography>

                            {/* Bottom Row: Date, Status, Assignee */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "14px",
                                paddingTop: "10px"
                              }}
                            >
                              {/* Due Date */}
                              <Typography
                                variant="caption"
                                style={{ fontWeight: "500", color: "#7A7A7A" }}
                              >
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}
                              </Typography>

                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {/* Status indicator */}
                                <div style={{ position: "relative", display: "inline-block", width: 20, height: 20 }}>
                                  <FaComment
                                    size={20}
                                    color={
                                      task.status === "In Progress"
                                        ? "#FFA500"
                                        : task.status === "Completed"
                                          ? "green"
                                          : "#BFBFBF"
                                    }
                                  />
                                  <span
                                    style={{
                                      position: "absolute",
                                      top: "4px",      // adjust vertical position
                                      right: "5px",    // adjust horizontal position
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                      color: "white",
                                    }}
                                  >
                                    !!!
                                  </span>
                                </div>



                                {/* Assignee initials (first name only) */}
                                <div
                                  className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                                  style={{ width: "20px", height: "20px", fontSize: "12px" }}
                                  title={
                                    task.assignee
                                      ? `${task.assignee.firstName} ${task.assignee.lastName || ""}`
                                      : "Unassigned"
                                  }
                                >
                                  {task.assignee?.firstName ? task.assignee.firstName[0].toUpperCase() : "?"}
                                </div>

                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>


                    </CardContent>

                    {activeTooltip === outer.name && createPortal(
                      <div
                        style={{
                          position: "absolute",
                          top: tooltipPosition.top,
                          left: tooltipPosition.left,
                          background: "white",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
                          padding: "10px",
                          minWidth: "160px",
                          zIndex: 9999,
                          pointerEvents: "auto",
                        }}
                      >
                        <div
                          style={{ padding: "5px 10px", cursor: "pointer" }}
                          onClick={(e) => { e.stopPropagation(); setShowExcelModal(true); setSelectedTask(outer) }}
                        >
                          Upload from Excel
                        </div>
                        <div
                          style={{ padding: "5px 10px", cursor: "pointer" }}
                          onClick={(e) => { e.stopPropagation(); handleMoveTasksToBoard(outer, "left"); }}
                        >
                          Move to Left
                        </div>
                        <div
                          style={{ padding: "5px 10px", cursor: "pointer" }}
                          onClick={(e) => { e.stopPropagation(); handleMoveTasksToBoard(outer, "right"); }}
                        >
                          Move to Right
                        </div>
                        <div
                          style={{ padding: "5px 10px", cursor: "pointer" }}
                          onClick={(e) => { e.stopPropagation(); handleEditBoard(outer); }}
                        >
                          Edit
                        </div>
                        <div
                          style={{ padding: "5px 10px", cursor: "pointer" }}
                          onClick={(e) => { e.stopPropagation(); handleDeleteBoard(outer); }}
                        >
                          Delete
                        </div>
                      </div>,
                      document.body
                    )}

                    {outer.allowAdd && i === 0 && (
                      <div style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
                        <button
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "2px dotted #1784A2",
                            background: "transparent",
                            color: "#1784A2",
                            fontSize: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => handleAddTaskClick(outer)}
                          disabled={!currentProjectId}
                        >
                          +
                        </button>
                      </div>
                    )}

                  </Card>
                ))}



                {outerCards.length < 3 &&
                  Array.from({ length: 3 - outerCards.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} />
                  ))}
                <div
                  style={{
                    flex: "0 0 calc((100% - 40px) / 3)",// same width as other cards
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      position: "fixed",   // stays on screen
                      right: "20px",       // 20px from right edge
                      // stick to bottom-right (you can remove this if you want vertically aligned center)
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      border: "2px dotted #1784A2",
                      background: "white",
                      color: "#1784A2",
                      fontSize: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: currentProjectId ? "pointer" : "not-allowed",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      zIndex: 2000,
                    }}
                    onClick={() => currentProjectId && setShowAddModal1(true)}
                    disabled={!currentProjectId}
                  >
                    +
                  </button>
                </div>

              </div>
            )}


            {/* Table B */}
            {activeTable === "B" && (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Task Name</th>
                      <th>Status</th>
                      <th>Assignee</th>
                      <th>Reporter</th>
                      <th>Priority</th>
                      <th>Created Date</th>
                      <th>Issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks?.map((row: any, index: number) => (
                      <tr key={index}>
                        <td>{row.name}</td>
                        <td>{row.status}</td>
                        <td>{row.assignee?.firstName} {row.assignee?.lastName}</td>
                        <td>{row.reporter?.firstName} {row.reporter?.lastName}</td>
                        <td>{row.priority}</td>
                        <td>{new Date(row.createdDate).toLocaleDateString()}</td>
                        <td>{row.issues?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}


          </>
        ) : (

          /* Todo Page Content */

          <div>
            {/* Header */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
              onClick={() => {
                setSelectedTask(null);
                setIsTodo(false);
                if (currentProjectId) {
                  fetchBoards(currentProjectId);
                }
              }}
            >
              <FaChevronLeft size={20} style={{ cursor: "pointer" }} />
              <Typography variant="h6">{selectedTask ? selectedTask.boardId.name : "Select a task to view details"}</Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "20px", gap: "10px" }}>
              <div style={{ display: "flex", flex: 1, gap: "10px" }}>
                {outerCards.map((board, i) => (
                  <div
                    key={board._id || i}
                    onClick={() => handleMoveTask(board.name)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "10px",
                      fontSize: "16px",
                      color: selectedTask?.boardId?.name === board.name ? "white" : "#1784A2",
                      border: "2px solid #1784A2",
                      backgroundColor: selectedTask?.boardId?.name === board.name ? "#1784A2" : "white",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    {board.name}
                  </div>
                ))}
              </div>


              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                <button
                  title="Delete"
                  style={{
                    backgroundColor: "#1784A2",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "4px",
                    color: "white",
                  }}
                  onClick={() => setShowModal(true)}
                >
                  <FaTrash size={18} />
                </button>

                <div style={{ display: "flex", gap: "10px", }}>
                  {/* Button to toggle menu */}
                  <button
                    title="Complete"
                    style={{
                      backgroundColor: "#1784A2",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px",
                      borderRadius: "4px",
                      color: "white",
                    }}
                    onClick={() => handleTaskCompleted(selectedTask?._id)}
                  >
                    <FaCheckCircle size={18} />
                  </button>

                  <button
                    title="C"
                    style={{
                      backgroundColor: "#1784A2",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px",
                      borderRadius: "4px",
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Edit clicked");
                      setEditTask(tasks);
                      setShowAddModal(true);
                      setShowOptions(false);
                    }}
                  >
                    <FaEdit size={18} />
                  </button>

                </div>


              </div>
            </div>


            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              {/* Left Side: Project Details & Task Tracking */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Project Details Card */}
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
                        alignItems: "center",
                        color: "#3f3d3d",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>Task Name:</span>
                      <span>{selectedTask?.name}</span>

                      <span style={{ fontWeight: 600 }}>Created Date:</span>
                      <span>{selectedTask?.dueDate
                        ? new Date(selectedTask?.createdDate).toLocaleDateString("en-GB") // DD/MM/YYYY
                        : "N/A"}</span>

                      <span style={{ fontWeight: 600 }}>Assignee:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "28px", height: "28px", fontSize: "14px" }}
                        >
                          {selectedTask?.assignee?.firstName
                            ? selectedTask.assignee.firstName.charAt(0).toUpperCase()
                            : "N"}

                        </div>
                        <span>  {selectedTask?.assignee
                          ? `${selectedTask.assignee.firstName} ${selectedTask.assignee.lastName}`
                          : "N/A"}
                        </span>
                      </div>

                      <span style={{ fontWeight: 600 }}>Reporter:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "28px", height: "28px", fontSize: "14px" }}
                        >
                          {selectedTask?.reporter?.firstName
                            ? selectedTask.reporter.firstName.charAt(0).toUpperCase()
                            : "N"}
                        </div>
                        <span>  {selectedTask?.reporter
                          ? `${selectedTask.reporter.firstName} ${selectedTask.reporter.lastName}`
                          : "N/A"}</span>
                      </div>

                      <span style={{ fontWeight: 600 }}>Priority:</span>
                      <span>{selectedTask?.priority}</span>

                      <span style={{ fontWeight: 600 }}>Due Date:</span>
                      <span>  {selectedTask?.dueDate
                        ? new Date(selectedTask.dueDate).toLocaleDateString("en-GB") // DD/MM/YYYY
                        : "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>


                {/* Task Tracking Card */}
                {selectedTask && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Task Tracking
                      </Typography>

                      <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f5f5f5" }}>
                            {["Work Date", "Start Time", "End Time"].map((th, i) => (
                              <th
                                key={i}
                                style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #ddd", fontWeight: 600 }}
                              >
                                {th}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTask?.timeLogs?.map((log: TimeLog, index: number) => (
                            <tr key={index}>
                              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                                {new Date(log.workDate).toLocaleDateString("en-GB")}
                              </td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                                {log.startTime}
                              </td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                                {log.endTime}
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                )}


              </div>

              {/* Right Side: Activities */}
              <Card style={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Activities
                  </Typography>
                  <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Description" />
                    <Tab label="History" />
                    <Tab label="Comments" />
                    <Tab label="Attachment" />
                    <Tab label="Issue" />
                  </Tabs>

                  {/* Tab Content */}
                  <div style={{ marginTop: "20px" }}>
                    {/* {tabValue === 0 && (
    <div style={{ fontSize: "15px", color: "#353535", lineHeight: "1.6" }}>
      {selectedTask?.description?.trim() ? (
        <p style={{ whiteSpace: "pre-wrap" }}>{selectedTask.description}</p>
      ) : (
        <p style={{ color: "#888", fontStyle: "italic" }}>No description here</p>
      )}
    </div>
  )} */}


                    {tabValue === 1 &&
                      selectedTask?.history?.map((entry, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "8px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: "24px", height: "24px", fontSize: "12px" }}
                            >
                              {/* First letter from createdBy (if available) */}
                              {entry.createdBy
                                ? (typeof entry.createdBy === "string"
                                  ? entry.createdBy.charAt(0).toUpperCase()
                                  : entry.createdBy.firstName
                                    ? entry.createdBy.firstName.charAt(0).toUpperCase()
                                    : "N")
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
                      ))}

                    {/* Optional fallback if history is empty */}
                    {tabValue === 1 && !selectedTask?.history?.length && (
                      <div style={{ marginTop: "8px", color: "#888" }}>No history available</div>
                    )}

                    {/* Comments Tab */}
                    {tabValue === 2 && (
                      <div style={{ display: "flex", flexDirection: "column", height: "400px", marginTop: "20px" }}>
                        {/* Map existing comments safely */}
                        {(selectedTask?.comments ?? []).map((comment, index) => {
                          const initials =
                            typeof comment.createdBy === "string"
                              ? comment.createdBy.charAt(0).toUpperCase()
                              : comment.createdBy?.firstName
                                ? comment.createdBy.firstName.charAt(0).toUpperCase()
                                : "N";

                          return (
                            <div key={comment._id || index} style={{ marginBottom: "12px" }}>
                              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div
                                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                  <div
                                    className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: "24px", height: "24px", fontSize: "12px" }}
                                  >
                                    {initials}
                                  </div>
                                  <span dangerouslySetInnerHTML={{ __html: comment.text }} />
                                  <span style={{ marginLeft: "auto", fontSize: "12px", color: "#888" }}>
                                    {new Date(comment.createdAt).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "4px 0" }} />
                            </div>
                          );
                        })}


                        {/* Fallback message if no comments */}
                        {(!selectedTask?.comments || selectedTask.comments.length === 0) && (
                          <div style={{ marginBottom: "12px", color: "#888" }}>No comments yet</div>
                        )}

                        {/* New comment input */}
                        <div style={{ marginTop: "auto" }}>
                          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
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
                              onClick={() => applyFormat('insertUnorderedList')}
                              style={{
                                border: 'none',
                                background: activeFormats.insertUnorderedList ? '#ddd' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                              }}
                            >
                              <FaListUl size={18} />
                            </button>
                            <button
                              onClick={() => applyFormat('insertOrderedList')}
                              style={{
                                border: 'none',
                                background: activeFormats.insertOrderedList ? '#ddd' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                              }}
                            >
                              <FaListOl size={18} />
                            </button>



                          </div>

                          {/* Editable div */}
                          <div
                            ref={editorRef}
                            contentEditable
                            onInput={updateActiveFormats} // reuse your existing function
                            onKeyUp={updateActiveFormats}
                            onMouseUp={updateActiveFormats}
                            style={{
                              minHeight: "100px",
                              padding: "8px",
                              borderRadius: "4px",
                              // border: "1px solid #ccc",
                              outline: "none",
                              overflowY: "auto",
                              color: "#000",
                            }}
                            data-placeholder="Type here....."
                            className="editable-div"
                            suppressContentEditableWarning={true}
                          />

                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                            <button
                              style={{
                                color: "#555",
                                border: "none",
                                borderBottom: "1px dotted #555"
                              }}
                              onClick={() => {
                                if (editorRef.current) {
                                  editorRef.current.innerHTML = "";
                                  updateActiveFormats(); // reset toolbar
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
                              disabled={!selectedTask?._id}
                            >
                              Save
                            </button>


                          </div>
                        </div>
                      </div>
                    )}

                    {/* Attachments Tab */}
                   {tabValue === 3 && selectedTask && (
  <div className="attachments-section">
    <div className="row g-4 mb-4 justify-content-start">
      {(attachments[selectedTask._id] || []).map((file: any, i:number) => (
        <div key={file._id} className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div
              className="p-3 position-relative d-flex align-items-center justify-content-center"
              style={{ height: "120px" }}
            >
              {/* Wrap the file preview in clickable link */}
              <a
                href={`${API_URL}${file.fileUrl}`} // make sure fileUrl points to your backend
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {(() => {
                  const ext = file.fileName?.split(".").pop().toLowerCase();
                  if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
                    return (
                      <img
                        src={`${API_URL}${file.fileUrl}`}
                        alt={file.fileName}
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      />
                    );
                  }
                  if (["pdf"].includes(ext)) {
                    return <img src="/icons/pdf-icon.png" alt="PDF" style={{ width: "40px", height: "40px" }} />;
                  }
                  if (["doc", "docx"].includes(ext)) {
                    return <img src="/icons/doc-icon.png" alt="DOC" style={{ width: "40px", height: "40px" }} />;
                  }
                  return <img src="/icons/file-icon.png" alt="File" style={{ width: "40px", height: "40px" }} />;
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
                    Attachment- {i+1}
                  </a>
                  <p className="text-muted small fs-6 mb-0">
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

    {/* Upload section */}
    <div
      onClick={() => document.getElementById("fileInput")?.click()}
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
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f8ff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
    >
      <div style={{ fontWeight: 600, color: "#7A7A7A" }}>Upload File Or Drag file here</div>

      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        multiple
        onChange={(e) => selectedTask && handleFileUpload(e, selectedTask._id)}
      />
    </div>
  </div>
)}



                    {/* Issue Tab */}
                    {tabValue === 4 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "400px",
                          gap: "10px",
                          overflowY: "auto",
                          marginTop: "20px",
                        }}
                      >
                        {/* Created Issues */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "8px" }}>


                          {/* Done Issues */}
                          <div>
                            <h6>Done Issues</h6>
                            {issues.filter(issue => issue.status === "Done").length > 0 ? (
                              issues
                                .filter(issue => issue.status === "Done")
                                .map((issue) => (
                                  <div
                                    key={issue._id}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <input type="checkbox"  style={{ marginRight: "8px" }} />
                                    <div style={{ flex: 1 }}>{issue.title}</div>
                                    <span style={{ fontSize: "12px", color: "#888", marginLeft: "16px", whiteSpace: "nowrap" }}>
                                      {new Date(issue.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                ))
                            ) : (
                              <p style={{ color: "#888", fontSize: "12px" }}>No done issues yet.</p>
                            )}
                          </div>

                          {/* Created Issues */}
                          <div>
                            <h6>Created Issues</h6>
                            {issues.filter(issue => issue.status === "Created").length > 0 ? (
                              issues
                                .filter(issue => issue.status === "Created")
                                .map((issue) => (
                                  <div
                                    key={issue._id}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>{issue.title}</div>
                                    <span style={{ fontSize: "12px", color: "#888", marginLeft: "16px", whiteSpace: "nowrap" }}>
                                      {new Date(issue.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                ))
                            ) : (
                              <p style={{ color: "#888", fontSize: "12px" }}>No created issues yet.</p>
                            )}
                          </div>

                        </div>


                        <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: 0 }} />

                        {/* Comment editor */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
                          {/* Toolbar */}
                          <div style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
                            <button onClick={() => applyFormat("bold")} style={{ border: "none", background: activeFormats.bold ? "#ddd" : "none", cursor: "pointer", fontWeight: "bold" }}>B</button>
                            <button onClick={() => applyFormat("italic")} style={{ border: "none", background: activeFormats.italic ? "#ddd" : "none", cursor: "pointer", fontStyle: "italic" }}>I</button>
                            <button onClick={() => applyFormat("underline")} style={{ border: "none", background: activeFormats.underline ? "#ddd" : "none", cursor: "pointer", textDecoration: "underline" }}>U</button>
                            <button onClick={() => applyFormat("createLink")} style={{ border: "none", background: "none", cursor: "pointer" }}>🔗</button>
                            <button onClick={() => applyFormat("insertUnorderedList")} style={{ border: "none", background: activeFormats.insertUnorderedList ? "#ddd" : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                              <FaListUl size={18} />
                            </button>
                            <button onClick={() => applyFormat("insertOrderedList")} style={{ border: "none", background: activeFormats.insertOrderedList ? "#ddd" : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                              <FaListOl size={18} />
                            </button>
                          </div>

                          {/* Editable div */}
                          <div
                            ref={editorRef}
                            contentEditable
                            onInput={() => setNewIssueDescription(editorRef.current?.innerText || "")}
                            onKeyUp={() => setNewIssueDescription(editorRef.current?.innerText || "")}
                            onMouseUp={() => setNewIssueDescription(editorRef.current?.innerText || "")}
                            style={{ minHeight: "120px", padding: "8px", borderRadius: "4px", outline: "none", overflowY: "auto", color: "#000" }}
                            data-placeholder="Type here....."
                            className="editable-div"
                            suppressContentEditableWarning
                          />

                          {/* Buttons */}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                            <button
                              style={{ color: "#555", border: "none", borderBottom: "1px dotted #555" }}
                              onClick={() => {
                                if (editorRef.current) editorRef.current.innerHTML = "";
                                updateActiveFormats();
                                setNewIssueDescription("");
                              }}
                            >
                              Cancel
                            </button>

                            <button
                              style={{ minWidth: "120px", background: "#1784A2", color: "white", padding: "4px 12px", border: "none", borderRadius: "4px" }}
                              onClick={createIssue}
                              disabled={!selectedTask?._id || !newIssueDescription}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "30px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            {/* Trash Icon Circle */}
            <div
              style={{
                background: "#E6F5F8",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <FaTrash size={24} color="#1784A2" />
            </div>

            {/* Text */}
            <p style={{ fontSize: "16px", marginBottom: "30px" }}>
              Are you sure you want to delete this task?
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 50px",
                  borderRadius: "6px",
                  border: "1px solid #1784A2",
                  background: "white",
                  color: "#1784A2",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (selectedTask?._id && selectedTask?.projectId) {
                    deleteTask(selectedTask._id, selectedTask?.projectId);
                  }
                }}
                style={{
                  padding: "10px 50px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#1784A2",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showOptions && (
        <div
          style={{
            position: "absolute",
            top: "120%", // below button
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
            padding: "10px",
            zIndex: 9999,
            minWidth: "160px",
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid white",
              filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.1))",
            }}
          />
          {/* Menu options */}
          <div style={{ padding: "5px 10px", cursor: "pointer" }}>
            Task Completed
          </div>
          <div style={{ padding: "5px 10px", cursor: "pointer" }}>
            Edit Task Info
          </div>
        </div>
      )}

      {showAddModal && (
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
            onClick={() => setShowAddModal(false)}
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
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ margin: 0, fontSize: "1rem" }}>Add Task</h5>
              <button
                onClick={() => setShowAddModal(false)}
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

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Task Name */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>Task Name</label>
                <input
                  type="text"
                  value={editTask ? editTask.name : newTaskName}
                  onChange={(e) =>
                    editTask
                      ? setEditTask({ ...editTask, name: e.target.value })
                      : setNewTaskName(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              {/* Assignee Dropdown */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>Assignee</label>
                <select
                  value={editTask ? editTask.assignee?._id : assignee}
                  onChange={(e) =>
                    editTask
                      ? setEditTask({ ...editTask, assignee: { _id: e.target.value } })
                      : setAssignee(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                    background: "#fff",
                    color: "black"
                  }}
                >
                  <option value="">Select Assignee</option>
                  {employeeList && employeeList.length > 0 ? (
                    employeeList.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No employees available</option>
                  )}
                </select>
              </div>


              {/* Reporter Dropdown */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>Reporter</label>
                <select
                  value={editTask ? editTask.reporter?._id : reporter}
                  onChange={(e) =>
                    editTask
                      ? setEditTask({ ...editTask, reporter: { _id: e.target.value } })
                      : setReporter(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                    background: "#fff",
                    color: "black"
                  }}
                >
                  <option value="">Select Reporter</option> {/* placeholder */}
                  {employeeList && employeeList.length > 0 ? (
                    employeeList.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No employees available</option>
                  )}
                </select>
              </div>


              {/* Priority Dropdown */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>Priority</label>
                <select
                  value={editTask ? editTask.priority : priority}
                  onChange={(e) =>
                    editTask
                      ? setEditTask({ ...editTask, priority: e.target.value })
                      : setPriority(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                    background: "#fff",
                  }}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>Due Date</label>
                <input
                  type="date"
                  value={editTask ? editTask.dueDate?.split("T")[0] : dueDate}
                  onChange={(e) =>
                    editTask
                      ? setEditTask({ ...editTask, dueDate: e.target.value })
                      : setDueDate(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              {/* Create Button */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
                <button
                  onClick={submitTask}
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
                >
                  {modalMode === "add" ? "Create" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



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
              maxWidth: "400px",   // smaller width
              backgroundColor: "#fff",
              borderRadius: "6px",
              padding: "25px",     // reduced padding
              display: "flex",
              flexDirection: "column",
              position: "relative",
              fontSize: "12px",    // reduced font size
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h6 style={{ margin: 0, fontSize: "14px" }}>Filter</h6>
              <button
                onClick={() => setShowFilterModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  lineHeight: "1",
                }}
              >
                ×
              </button>
            </div>

            <hr style={{ margin: "8px 0" }} />

            {/* Form Fields */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>
                  Assignee Name
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "12px",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>
                  Reporter Name
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "12px",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>
                  Priority
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "12px",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>
                  Issue
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "25px",
              }}
            >
              <button
                style={{
                  padding: "6px 14px",
                  width: "100px",
                  border: "1px solid #1784A2",
                  borderRadius: "4px",
                  color: "#1784A2",
                  fontSize: "12px",
                }}
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
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

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

          {/* Compact modal */}
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: "min(85vw, 380px)", // smaller width
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "25px", // compact padding
              boxSizing: "border-box",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              fontSize: "0.85rem",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "1rem" }}>Add Board</h5>
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

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Board Name */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>Board Name</label>
                <input
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  type="text"
                  placeholder="Enter board name"
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                  }}
                />
              </div>


              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "4px", fontWeight: 500 }}>Designation</label>
                <select
                  value={newDesignation}
                  onChange={(e) => {
                    const selectedDesignation = e.target.value;
                    setNewDesignation(selectedDesignation);

                    if (selectedDesignation) {
                      setNewBoardName(`${selectedDesignation} `);
                    } else {
                      setNewBoardName("");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "0.85rem",
                  }}
                >
                  <option value="all">All</option>
                  {jobCategories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>


              </div>


              {/* Button */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
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
                   disabled={loading}
                  onClick={() => createBoard()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExcelModal && (
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
            onClick={() => setShowExcelModal(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />

          {/* Modal box */}
          <div
            style={{
              position: "relative",
              width: "min(90vw, 500px)",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ margin: 0, fontSize: "1rem" }}>Import Excel</h5>
              <button
                onClick={() => setShowExcelModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <hr style={{ margin: "10px 0" }} />

            {/* Upload area */}
            <div
              style={{
                border: "1px dashed #ccc",
                borderRadius: "6px",
                padding: "40px 20px",
                marginBottom: "20px",
              }}
            >
              <p>📂 Import data from a spreadsheet (CSV, XLS, XLSX)</p>
              <p>
                Download a sample file (
                <a href="/sample.xls" style={{ color: "#1784A2" }}>
                  .XLS
                </a>
                ,{" "}
                <a href="/sample.csv" style={{ color: "#1784A2" }}>
                  .CSV
                </a>
                )
              </p>

              <input
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileChange}
              />

            </div>

            {/* Save button */}
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#1784A2",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontWeight: 600,
                cursor: userData ? "pointer" : "not-allowed",
                opacity: userData ? 1 : 0.5, // visually indicate disabled
              }}
              onClick={handleUpload}
              disabled={!userData} // ✅ disable until userData is loaded
            >
              Save
            </button>

          </div>
        </div>
      )}


    </>
  );
};

export default Board;
