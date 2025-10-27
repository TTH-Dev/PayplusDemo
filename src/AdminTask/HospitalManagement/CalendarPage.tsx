import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import "./CalendarPage.css";
import { MdFilterAlt } from "react-icons/md";
import { API_URL } from "../../config";


interface User {
  _id: string;
  firstName: string;
  lastName: string;
}


interface Task {
  id: string;
  name: string;
  assignee: User | null; // can be null if unassigned
  reporter: User | null;
  priority: string;
  date: string; // YYYY-MM-DD
}
interface CalendarPageProps {
  projectId: string | null;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ projectId }) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState({ assignee: "", reporter: "", priority: "" });

  const startDay = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();
  const monthDays: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) monthDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) monthDays.push(d);

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const formattedSelectedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";

  useEffect(() => {
     if (!selectedDate || !projectId) return;

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authtoken");

        const res = await axios.get(`${API_URL}/api/task/filter/calendar`, {
          params: {
            projectId,
            startDate: selectedDate.startOf("day").toISOString(),
            endDate: selectedDate.endOf("day").toISOString(),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Access tasks from response correctly
        const fetchedTasks: Task[] = res.data.data.tasks.map((t: any) => ({
          id: t._id,
          name: t.name,
          assignee: t.assignee, // or t.assignee_id if backend uses it
          reporter: t.reporter, // or t.reporter_id
          priority: t.priority,
          date: dayjs(t.startDate).format("YYYY-MM-DD"),
        }));

        setTasks(fetchedTasks);
      } catch (err: any) {
        console.error("Error fetching tasks:", err.response?.data || err.message);
      }
    };

    fetchTasks();
  }, [selectedDate]);
  
    useEffect(() => {
    setSelectedDate(null);
    setTasks([]);
    setFilter({ assignee: "", reporter: "", priority: "" });
  }, [projectId]);

  // Apply filter to tasks
  const filteredTasks = tasks.filter((task) => {
    const assigneeMatch = filter.assignee
      ? task.assignee &&
      `${task.assignee.firstName} ${task.assignee.lastName}`
        .toLowerCase()
        .includes(filter.assignee.toLowerCase())
      : true;

    const reporterMatch = filter.reporter
      ? task.reporter &&
      `${task.reporter.firstName} ${task.reporter.lastName}`
        .toLowerCase()
        .includes(filter.reporter.toLowerCase())
      : true;

    const priorityMatch = filter.priority
      ? task.priority.toLowerCase().includes(filter.priority.toLowerCase())
      : true;

    return assigneeMatch && reporterMatch && priorityMatch;
  });

  // Get unique assignees and reporters from tasks
  const assigneeOptions: User[] = Array.from(
    new Map(
      tasks
        .filter((t) => t.assignee)
        .map((t) => [t.assignee!._id, t.assignee!])
    ).values()
  );

  const reporterOptions: User[] = Array.from(
    new Map(
      tasks
        .filter((t) => t.reporter)
        .map((t) => [t.reporter!._id, t.reporter!])
    ).values()
  );

  // Unique priority values
  const priorityOptions: string[] = Array.from(new Set(tasks.map((t) => t.priority)));



  return (
    <div className="calendar-table-wrapper">
      {/* Header */}
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

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
            style={{ width: "40px", height: "40px", zIndex: 1, backgroundColor: "white" }}
          >
            M
          </div>
          <div
            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
            style={{ width: "40px", height: "40px", marginLeft: "-13px", zIndex: 2, backgroundColor: "white" }}
          >
            K
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <h3>{currentMonth.format("MMMM YYYY")}</h3>
          <button onClick={nextMonth}>&gt;</button>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}

          {monthDays.map((day, idx) => {
            if (day === null) return <div key={idx} className="calendar-cell empty"></div>;

            const dateObj = dayjs(currentMonth).date(day);
            const isSelected = selectedDate?.isSame(dateObj, "day");
            const isToday = dayjs().isSame(dateObj, "day");

            return (
              <div
                key={idx}
                className={`calendar-cell ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                onClick={() => setSelectedDate(dateObj)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Table */}
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h6 className="mb-3">{formattedSelectedDate ? `Tasks on ${formattedSelectedDate}` : "Due Task"}</h6>
          <div className="table-responsive">
            <table className="table table-hover table-bordered rounded align-middle">
              <thead className="table-light">
                <tr>
                  <th>S. No</th>
                  <th>Task Name</th>
                  <th>Assignee</th>
                  <th>Reporter</th>
                  <th>Priority</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>{task.name}</td>
                    <td>
                      {task.assignee
                        ? `${task.assignee.firstName} ${task.assignee.lastName}`
                        : "-"}
                    </td>
                    <td>
                      {task.reporter
                        ? `${task.reporter.firstName} ${task.reporter.lastName}`
                        : "-"}
                    </td>
                    <td>{task.priority}</td>
                    <td>{task.date}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
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
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", lineHeight: "1" }}
              >
                ×
              </button>
            </div>

            <hr style={{ margin: "8px 0" }} />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>Assignee</label>
                <select
                  style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}
                  value={filter.assignee}
                  onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
                >
                  <option value="">All</option>
                  {assigneeOptions.map((a) => (
                    <option key={a._id} value={`${a.firstName} ${a.lastName}`}>
                      {a.firstName} {a.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>Reporter</label>
                <select
                  style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}
                  value={filter.reporter}
                  onChange={(e) => setFilter({ ...filter, reporter: e.target.value })}
                >
                  <option value="">All</option>
                  {reporterOptions.map((r) => (
                    <option key={r._id} value={`${r.firstName} ${r.lastName}`}>
                      {r.firstName} {r.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "3px", fontSize: "12px" }}>Priority</label>
                <select
                  style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}
                  value={filter.priority}
                  onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                >
                  <option value="">All</option>
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>
              <button
                style={{ padding: "6px 14px", width: "100px", border: "1px solid #1784A2", borderRadius: "4px", color: "#1784A2", fontSize: "12px" }}
                onClick={() => setFilter({ assignee: "", reporter: "", priority: "" })}
              >
                Reset
              </button>
              <button
                style={{ padding: "6px 14px", backgroundColor: "#1784A2", color: "#fff", border: "none", borderRadius: "4px", width: "100px", fontSize: "12px" }}
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

export default CalendarPage;
