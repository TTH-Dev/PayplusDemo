import React, { useState } from "react";

const Summary: React.FC = () => {
  const stats = [
    { title: "Total Task", value: 10, color: "#BADBE4" },  // Light Blue
    { title: "Due Task", value: 10, color: "#FE5353" },    // Red
    { title: "Total Time Spent", value: 10, color: "#FFA600" }, // Orange
    { title: "Today Day Spent", value: 10, color: "#FFA600" },  // Orange
  ];

  const tasks = [
    { name: "To design the static website for dev", date: "10-11-2025", reporter: "John Kumar", progress: 10 },
    { name: "To design the static website for dev", date: "14-09-2025", reporter: "Edward", progress: 53 },
    { name: "To design the static website for dev", date: "10-11-2025", reporter: "Jasmin", progress: 80 },
    { name: "To design the static website for dev", date: "14-09-2025", reporter: "Emma Snow", progress: 93 },
  ];
   const [selectedOption, setSelectedOption] = useState("thisWeek");

  return (
    <div className="container my-4">
      {/* First Row - 4 Equal Columns */}
        <div className="row g-4">
        {stats.map((item, idx) => (
            <div className="col-12 col-sm-6 col-lg-3" key={idx}>
            <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                
                {/* Title row */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <p className="fw-bold mb-0 me-2 text-wrap" style={{ maxWidth: "70%" }}>
                    {item.title}
                    </p>
                        <select
      style={{
        color: "#BFBFBF",
        fontWeight: 400,
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
    >
      <option value="today">Today</option>
      <option value="thisWeek">This Week</option>
      <option value="thisMonth">This Month</option>
    </select>
                </div>

                {/* Circle + Text side by side */}
                <div className="d-flex align-items-center mt-auto">
                    <div
                    className="text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                        width: "60px",
                        height: "60px",
                        fontSize: "1.2rem",
                        backgroundColor: item.color,
                    }}
                    >
                    {item.value}
                    </div>
                    <div className="ms-3">
                    <small className="text-muted">Task</small>
                    </div>
                </div>

                </div>
            </div>
            </div>
        ))}
        </div>


      {/* Second Row - 2 Columns */}
      <div className="row g-4 mt-3">
        {/* Left Big Table */}
        <div className="col-lg-8">
        <div className="card shadow-sm h-100">
            <div className="card-body p-4">
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">My Task</h6>
                    <select
      style={{
        color: "#BFBFBF",
        fontWeight: 500,
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
    >
      <option value="today">Today</option>
      <option value="thisWeek">This Week</option>
      <option value="thisMonth">This Month</option>
    </select>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-hover table-sm align-middle mb-0">
                <thead className="bg-light">
                    <tr className="text-muted small">
                    <th className="px-0">Task Name</th>
                    <th className="px-3">Due Date</th>
                    <th className="px-3">Reporter</th>
                    <th className="px-3 text-center" style={{ width: "200px" }}>Completed %</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, idx) => (
                    <tr key={idx}>
                        <td className="px-0">{task.name}</td>
                        <td className="px-3">{task.date}</td>
                        <td className="px-3">{task.reporter}</td>
                        <td className="px-3">
                        <div
                            style={{
                            height: "20px",           // rectangle height
                            width: "200px",           // rectangle width
                            borderRadius: "8px",
                            backgroundColor: "#e9ecef",
                            position: "relative",
                            overflow: "hidden",
                            }}
                        >
                            <div
                            style={{
                                width: `${task.progress}%`,
                                height: "100%",
                                backgroundColor: "#1784A2",
                                borderRadius: "8px 0 0 8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                color: "#000",
                            }}
                            >
                            {task.progress}%
                            </div>
                        </div>
                        </td>

                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>


        {/* Right Small List */}

        <div className="col-lg-4">
        <div className="card shadow-sm h-100">
            <div className="card-body p-4">
            {/* Header */}
            <div className="d-flex justify-content-between mb-3">
                <h6 className="fw-bold mb-0">My Task</h6>
                    <select
      style={{
        color: "#BFBFBF",
        fontWeight: 500,
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
    >
      <option value="today">Today</option>
      <option value="thisWeek">This Week</option>
      <option value="thisMonth">This Month</option>
    </select>
            </div>

            {/* Table (same style as first div) */}
            <div className="table-responsive">
                <table className="table table-hover table-sm align-middle mb-0">
                <thead className="bg-light">
                    <tr className="text-muted small">
                    <th className="px-0">Task Name</th>
                    <th className="px-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, idx) => (
                    <tr key={idx}>
                        <td className="px-0">{task.name}</td>
                        <td className="px-3 text-muted">{task.date}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>



      </div>
    </div>
  );
};

export default Summary;
