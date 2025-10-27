import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timeline.css";
import { MdFilterAlt } from "react-icons/md";
import { API_URL } from "../../config";

type PinColor = "red" | "green" | "yellow" | "blue" | "hollow";

type Milestone = {
  date: string;
  label: string;
  color: PinColor;
};

type TaskRow = {
  id: string;
  title: string;
  subtitle: string;
  start: string;
  end: string;
  due: string;
  timeTaken: number;
  milestones: Milestone[];
  status: string;
};

interface TimelineProps {
  projectId: string;
}

const Timeline: React.FC<TimelineProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [timelineWindow, setTimelineWindow] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(),
    end: new Date(),
  });
  const [activeRange, setActiveRange] = useState<"last6" | "this6" | "month">(
    "this6"
  );
  const [filterTaskName, setFilterTaskName] = useState<string>("");
  const [filterLineStatus, setFilterLineStatus] = useState<string>("");

  // Fetch tasks
  const fetchTasks = async (filters?: {
    taskName?: string;
    lineStatus?: string;
  }): Promise<void> => {
    if (!projectId) return;

    try {
      const token = localStorage.getItem("authtoken");
      if (!token) return;

      const params: any = { projectId };
      if (filters?.taskName?.trim()) params.name = filters.taskName.trim();
      if (filters?.lineStatus?.trim())
        params.status = filters.lineStatus.trim();

      const res = await axios.get(`${API_URL}/api/task/filter/timeline`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const data: TaskRow[] = res.data.data.tasks.map((t: any) => {
        // Total time worked
        const totalTime =
          t.durations?.reduce(
            (sum: number, d: any) => sum + (d.durationHours || 0),
            0
          ) || 0;

        // Start date = first assignedAt or createdDate
        const startDate = t.durations?.[0]?.assignedAt || t.createdDate;

        // End date = completedAt OR current date if not completed
        const endDate = t.completedAt || new Date().toISOString();

        // Assignee name
        const assigneeName =
          t.assignee && t.assignee.firstName
            ? `${t.assignee.firstName} ${t.assignee.lastName || ""}`.trim()
            : "Unassigned";

        return {
          id: t._id,
          title: t.name,
          subtitle: assigneeName,
          start: startDate,
          end: endDate,
          due: t.dueDate,
          timeTaken: totalTime,
          milestones: t.milestones || [],
          status: t.status,
        };
      });

      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (projectId) {
      updateRange(activeRange);
      fetchTasks();
    }
  }, [projectId]);

  // Update range when activeRange changes
  useEffect(() => {
    updateRange(activeRange);
  }, [activeRange]);

  // Set timeline window based on range
  const updateRange = (type: "last6" | "this6" | "month"): void => {
    const now = new Date();
    const year = now.getFullYear();
    let start: Date, end: Date;

    if (type === "last6") {
      start = new Date(year, 0, 1);
      end = new Date(year, 5, 30, 23, 59, 59);
    } else if (type === "this6") {
      start = new Date(year, 6, 1);
      end = new Date(year, 11, 31, 23, 59, 59);
    } else {
      start = new Date(year, now.getMonth(), 1);
      end = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);
    }

    setTimelineWindow({ start, end });
  };

  // Convert date to percentage of timeline
  const pct = (dateStr: string): number => {
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    const range = timelineWindow.end.getTime() - timelineWindow.start.getTime();
    const val = ((t - timelineWindow.start.getTime()) / range) * 100;
    return Math.min(100, Math.max(0, val));
  };

  // Generate months for display
  const getMonths = (): string[] => {
    const months: string[] = [];
    const start = timelineWindow.start;
    const end = timelineWindow.end;
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();

    for (let m = startMonth; m <= endMonth; m++) {
      const d = new Date(start.getFullYear(), m, 1);
      months.push(d.toLocaleString("default", { month: "short" }));
    }

    return months;
  };

  const months = getMonths();

  return (
    <div className="tl-wrap">
      {/* Toolbar */}
      <div className="tl-toolbar">
        <button
          onClick={() => setShowFilterModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            backgroundColor: "white",
            color: "#1784A2",
            border: "1px solid #1784A2",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Filter <MdFilterAlt />
        </button>

        <div className="tl-range">
          <button
            className={
              activeRange === "last6" ? "tl-pill tl-pill--active" : "tl-pill"
            }
            onClick={() => setActiveRange("last6")}
          >
            Last 6 Mnt
          </button>
          <button
            className={
              activeRange === "this6" ? "tl-pill tl-pill--active" : "tl-pill"
            }
            onClick={() => setActiveRange("this6")}
          >
            This 6 Mnt
          </button>
          <button
            className={
              activeRange === "month" ? "tl-pill tl-pill--active" : "tl-pill"
            }
            onClick={() => setActiveRange("month")}
          >
            Month
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="tl-grid tl-header">
        <div className="tl-cell tl-task-head">Task Name</div>
        {months.map((m, idx) => (
          <div key={idx} className="tl-cell tl-month-head">
            {m}
          </div>
        ))}
      </div>

      {/* Task Rows */}
      {tasks.map((row) => {
        const startPct = pct(row.start);
        const endPct = pct(row.end);
        const widthPct = Math.max(1, endPct - startPct);

        return (
          <div key={row.id} className="tl-grid tl-row">
            <div className="tl-cell tl-task">
              <span className="tl-task-title">{row.title}</span>
              <span className="tl-task-sub">- {row.subtitle}</span>
              <div
                style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}
              ></div>
            </div>

            <div className="tl-timeline-container">
              {/* Month slots for grid */}
              {months.map((m, i) => (
                <div
                  key={i}
                  className={`tl-month-slot ${
                    i === months.length - 1 ? "last" : ""
                  }`}
                />
              ))}

              {/* Timeline bar */}
              <div
                className="tl-bar"
                style={{
                  left: `${startPct}%`,
                  width: `${widthPct}%`,
                }}
              />

              {/* Start Pin */}
              <div
                className="tl-pin tl-pin--green"
                style={{ left: `${pct(row.start) - 0.25}%` }}
              >
                <span className="tl-pin-label">
                  {new Date(row.start).toLocaleDateString()}
                </span>
              </div>
              {/* End Pin - Blue */}
              <div
                className="tl-pin tl-pin--blue"
                style={{ left: `${pct(row.end) - 0.25}%` }}
              >
                <span className="tl-pin-label">
                  {new Date(row.end).toLocaleDateString()}
                </span>
              </div>

              {/* Due Pin - Red */}
              <div
                className="tl-pin tl-pin--red"
                style={{ left: `${pct(row.due) + 0.25}%` }}
              >
                <span className="tl-pin-label">
                  {new Date(row.due).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="tl-footer">
        <span>
          {tasks.length
            ? `1-${tasks.length} of ${tasks.length} items`
            : "No tasks"}
        </span>
      </div>
    </div>
  );
};

export default Timeline;
