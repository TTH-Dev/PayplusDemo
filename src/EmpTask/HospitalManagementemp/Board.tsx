import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaComment } from "react-icons/fa";
import axios from "axios";
import Todo from "./Todo";
import { API_URL } from "../../config";

interface BoardProps {
  projectId?: string;
  isTodo: boolean;
  setIsTodo: (value: boolean) => void;
}

interface BoardData {
  _id: string;
  title: string;
  count: string;
  jobCategory: string;
}

interface UserData {
  id: any;
  role: any;
  _id?: string;
  jobCategory?: string;
}

interface TaskData {
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
}

const Board: React.FC<BoardProps> = ({ projectId, isTodo, setIsTodo }) => {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [tasksByBoard, setTasksByBoard] = useState<Record<string, TaskData[]>>({});
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch logged-in user
  useEffect(() => {
    const getMe = async () => {
      const token = localStorage.getItem("authtoken");
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/auth/getMe`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    getMe();
  }, []);

  // Fetch boards
  useEffect(() => {
    if (!projectId || !userData) return;

    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/task/${projectId}/board`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allBoards = res.data.data.boards;
        const jobCategoryToUse = userData.jobCategory ?? "Developer";

        const defaultBoard = allBoards.find(
          (b: any) => b.boardFor === "all" || b.name.toLowerCase().includes("to do")
        );

        const jobBoards = allBoards.filter((b: any) => b.jobCategory === jobCategoryToUse);

        const finalBoards: BoardData[] = [];
        if (defaultBoard) {
          finalBoards.push({
            _id: defaultBoard._id,
            title: defaultBoard.name.trim(),
            count: "0",
            jobCategory: "",
          });
        }
        for (const jb of jobBoards) {
          finalBoards.push({
            _id: jb._id,
            title: jb.name.trim(),
            count: "0",
            jobCategory: jb.jobCategory,
          });
        }

        setBoards(finalBoards);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    fetchBoards();
  }, [projectId, userData, isTodo]);

  // Fetch tasks grouped by board
  useEffect(() => {
    if (!projectId || !userData || boards.length === 0) return;

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks: TaskData[] = res.data?.data?.tasks || [];

        const grouped: Record<string, TaskData[]> = {};
        boards.forEach((b) => (grouped[b.title] = []));

        // Filter tasks based on role
        const visibleTasks =
          userData.role?.toLowerCase() === "admin"
            ? tasks
            : tasks.filter(
              (t) =>
                t.assignee?._id === userData.id?.toString() ||
                t.reporter?._id === userData.id?.toString()
            );

        // Group by boardId
        visibleTasks.forEach((task) => {
          const board = boards.find((b) => b._id === task.boardId?._id);
          if (board) grouped[board.title].push(task);
          else grouped[boards[0].title].push(task); // fallback
        });

        setTasksByBoard(grouped);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [projectId, userData, boards, isTodo]);

  // Move task to another board
  const handleTaskMove = async (targetBoard: BoardData) => {
    if (!selectedTask?._id) return;

    try {
      const token = localStorage.getItem("authtoken");
      if (!token) return;

      // Update backend with new boardId
      await axios.patch(
        `${API_URL}/api/task/${selectedTask._id}`,
        { boardId: targetBoard._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local UI
      setTasksByBoard((prev) => {
        const updated = { ...prev };
        let movedTask: TaskData | null = null;

        for (const key of Object.keys(updated)) {
          const idx = updated[key].findIndex((t) => t._id === selectedTask._id);
          if (idx !== -1) {
            movedTask = updated[key][idx];
            updated[key].splice(idx, 1);
            break;
          }
        }

        if (movedTask) {
          movedTask.boardId = { _id: targetBoard._id, name: targetBoard.title };
          updated[targetBoard.title] = [...(updated[targetBoard.title] || []), movedTask];
        }

        return updated;
      });

      setSelectedTask((prev) =>
        prev ? { ...prev, boardId: { _id: targetBoard._id, name: targetBoard.title } } : prev
      );
    } catch (err) {
      console.error("Error moving task:", err);
    }
  };

  // Show Todo page if a task is selected
  if (selectedTask) {
    return (
      <Todo
        setIsTodo={() => setSelectedTask(null)}
        task={selectedTask}
        boards={boards}
        onTaskMove={(boardName: string) => {
          const board = boards.find((b) => b.title === boardName);
          if (board) handleTaskMove(board);
        }}
      />

    );
  }

  // Render boards
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2 p-2">
        <button
          ref={buttonRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 20px",
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

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
          overflowX: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {boards.map((board) => {
          const boardTasks = tasksByBoard[board.title] || [];
          return (
            <Card
              key={board._id}
              style={{
                flex: "0 0 calc((100% - 40px) / 3)",
                borderRadius: "16px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Typography style={{ fontWeight: 600, fontSize: "14px", color: "#353535" }}>
                    {board.title}
                  </Typography>
                  <Typography variant="subtitle1">{boardTasks.length}</Typography>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {boardTasks.map((task) => (
                    <Card
                      key={task._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                      style={{
                        borderRadius: "12px",
                        padding: "12px",
                        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        style={{
                          marginBottom: "8px",
                          fontWeight: 500,
                          color: "#7A7A7A",
                        }}
                      >
                        {task.name}
                      </Typography>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "14px",
                          paddingTop: "10px",
                        }}
                      >
                        <Typography variant="caption" style={{ fontWeight: "500", color: "#353535" }}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ position: "relative", display: "inline-block", width: 20, height: 20 }}>
                            <FaComment
                              size={20}
                              color={task.status === "In Progress" ? "#FFA500" : task.status === "Completed" ? "green" : "#BFBFBF"}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: "4px",
                                right: "5px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              !!!
                            </span>
                          </div>

                          <div
                            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: "20px", height: "20px", fontSize: "12px" }}
                            title={task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName || ""}` : "Unassigned"}
                          >
                            {task.assignee?.firstName ? task.assignee.firstName[0].toUpperCase() : "?"}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
