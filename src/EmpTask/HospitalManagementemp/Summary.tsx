import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../src/config";
import "./Summary.css";

interface SummaryProps {
  projectId?: string;
}

const Summary: React.FC<SummaryProps> = ({ projectId }) => {
  const [stats, setStats] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState("thisWeek");

  useEffect(() => {
    if (projectId) fetchData(selectedOption, projectId);
  }, [selectedOption, projectId]);

  const fetchData = async (filter: string, projectId: string) => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) return;

      // 🟩 Use your general task API to get all project tasks
      const res = await axios.get(`${API_URL}/api/task/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allTasks = res.data?.data?.tasks || [];

      // 🧮 Filter tasks based on the selected date range (for demo)
      const now = new Date();
      const filteredTasks = allTasks.filter((task: any) => {
        const taskDate = new Date(task.createdDate);
        if (filter === "today") {
          return (
            taskDate.getDate() === now.getDate() &&
            taskDate.getMonth() === now.getMonth() &&
            taskDate.getFullYear() === now.getFullYear()
          );
        }
        if (filter === "thisWeek") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return taskDate >= weekAgo && taskDate <= now;
        }
        if (filter === "thisMonth") {
          return (
            taskDate.getMonth() === now.getMonth() &&
            taskDate.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });

      const totalTask = filteredTasks.length;
      const dueTask = filteredTasks.filter((t: any) => {
        const dueDate = new Date(t.dueDate);
        return dueDate < now && t.status !== "Done";
      }).length;
      const totalTimeSpent = filteredTasks.reduce(
        (sum: number, t: any) => sum + (t.timeSpent || 0),
        0
      );
      const todayDaySpent = filteredTasks
        .filter((t: any) => new Date(t.createdDate).toDateString() === now.toDateString())
        .reduce((sum: number, t: any) => sum + (t.timeSpent || 0), 0);

      setStats([
        { title: "Total Task", value: totalTask, color: "#BADBE4" },
        { title: "Due Task", value: dueTask, color: "#FE5353" },
        { title: "Total Time Spent", value: totalTimeSpent, color: "#FFA600" },
        { title: "Today Day Spent", value: todayDaySpent, color: "#4CAF50" },
      ]);

      const taskList = filteredTasks.map((t: any) => ({
        _id: t._id,
        name: t.name,
        date: new Date(t.dueDate).toLocaleDateString(),
        reporter: t.reporter?.firstName || "N/A",
        progress:
          t.status === "Done"
            ? 100
            : t.status === "In Progress"
              ? 60
              : t.status === "Generated"
                ? 30
                : 0,
      }));

      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  
  return (
  <div className="summary-wrapper">
    {/* Stats Cards */}
    <div className="summary-stats-row">
      {stats.map((item, idx) => (
        <div className="summary-stats-card" key={idx}>
          <div className="summary-stats-title">
            {item.title}
            <select
              className="summary-dropdown"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
          <div className="summary-stats-circle" style={{ background: item.color || "#BADBE4" }}>
            {item.value}
          </div>
          <div className="summary-stat-label">
            Task
          </div>
        </div>
      ))}
    </div>

    {/* Task Table Rows */}
    <div className="summary-tasks-row">
      {/* Main Table */}
      <div className="summary-table-card">
        <div className="summary-table-header">My Task</div>
        <div className="table-responsive">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Due Date</th>
                <th>Reporter</th>
                <th className="text-center">Completed %</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.date}</td>
                  <td>{task.reporter}</td>
                  <td>
                    <div className="summary-progress-bar-container">
                      <div 
                        className="summary-progress-bar" 
                        style={{ width: `${100 -(task.progress)}%` }} 
                      ></div>
                      <div className="summary-progress-bar-text">
                        {100 -(task.progress)}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-3">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="summary-table-card small">
        <div className="summary-table-header">Recent Tasks</div>
        <div className="table-responsive">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.date}</td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-muted py-3">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};

export default Summary;
