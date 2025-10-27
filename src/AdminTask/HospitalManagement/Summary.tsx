import { Card } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import { Line, Column} from '@ant-design/charts'
import { Margin } from "devextreme-react/cjs/pie-chart";

interface SummaryData {
  projectTimePeriod: {
    startDate: string;
    endDate: string;
    noOfAssignee: number;
    noOfReporter: number;
    totalHrsSpent: number;
    totalDaysSpent: number;
  };
  completedTaskStats: number[];
  timeSpentPerDay: number[];
  pendingTasksPerUser: Record<string, number>;
  priorityStats: Record<string, number>;
}
interface SummaryProps {
  projectId?: string; 
}

const Summary: React.FC<SummaryProps> = ({ projectId }) => {

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("thisWeek");
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authtoken");
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/api/auth/getMe`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanyId(res.data.companyId);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!projectId) return;

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/task/summary/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authtoken")}` },
        });
        setSummary(res.data.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [projectId]); 

  if (loading) return <p>Loading...</p>;
  if (!summary) return <p>No data available</p>;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const project = summary.projectTimePeriod;

   const completedLineData = weekDays.map((day, idx) => ({
    day,
     value: Math.round(summary.completedTaskStats[idx] || 0),
  }));

  const timeSpentBarData = weekDays.map((day, idx) => ({
    day,
    value: summary.timeSpentPerDay[idx] || 0,
  }));
  const lineConfig = {
    data: completedLineData,
    xField: 'day',
    yField: 'value',
    height: 250,
    point: { size: 5, shape: "circle" },
    smooth: true,
     area: {
   style: {
      fill: 'l(95) 1:#1784A2 0.5:#88d5e2  0:#ffffff',
    },
  },
    xAxis: { title: { text: "Week" } },
    yAxis: { title: { text: "Count" }, min: 0, max: 1000 },
    tooltip: { showMarkers: false },
    color: "#88d5e2ff",
    animation: false
  };

const columnConfig = {
  data: timeSpentBarData,
  xField: 'day',
  yField: 'value',
  height: 300,
  color: () => '#147e91ff', // ✅ function form ensures color overrides theme
  label: {
    position: 'top',
    style: {
      fill: '#000',
      fontSize: 12,
    },
  },
  xAxis: { title: { text: 'Week' } },
  yAxis: { title: { text: 'Hrs' }, min: 0, max: 1000 },
  tooltip: {},
  columnWidthRatio: 0.6,
  legend: false,
  style: { fill: '#1784A2' },
};
  const pieData = Object.entries(summary.pendingTasksPerUser).map(([name, value]) => ({
    name: name.trim(),
    value,
  }));

  const priorityStats = Object.entries(summary.priorityStats).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#2C93D9", "#51B3DC", "#78C7E3", "#A5DCEB"];
  const NEW_COLORS = ["#FF2020", "#FFA600", "#00BA00"];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };

  return (
    <div className="container mt-2">
      <div className="row g-4">
    
        <div className="col-md-6 d-flex">
          <Card className="flex-fill">
            <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="fw-semibold mb-3">Project Time Period</h5>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <select
                style={{
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
            </div>

            <div className="row text-sm">
              <div className="col-6 mb-2">
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#7A7A7A" }}>Start Date</p>
                <p style={{ fontWeight: 600, fontSize: "26px", color: "#7A7A7A" }}>{formatDate(project.startDate)}</p>
              </div>
              <div className="col-6 mb-2">
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#7A7A7A" }}>Estimated End Date</p>
                <p style={{ fontWeight: 600, fontSize: "26px", color: "#7A7A7A" }}>{formatDate(project.endDate)}</p>
              </div>
              <div className="col-6 mb-2">
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#7A7A7A" }}>No Of Assignee</p>
                <p style={{ fontWeight: 600, fontSize: "26px", color: "#7A7A7A" }}>{project.noOfAssignee}</p>
              </div>
              <div className="col-6 mb-2">
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#7A7A7A" }}>No Of Reporter</p>
                <p style={{ fontWeight: 600, fontSize: "26px", color: "#7A7A7A" }}>{project.noOfReporter}</p>
              </div>
              <div className="col-6 mb-2">
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#7A7A7A" }}>Total Hrs Spent</p>
                <p style={{ fontWeight: 600, fontSize: "26px", color: "#7A7A7A" }}>{project.totalHrsSpent} Hrs</p>
              </div>
              <div className="col-6 mb-2">
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#7A7A7A" }}>Total Days Spent</p>
                <p style={{ fontWeight: 600, fontSize: "26px", color: "#7A7A7A" }}>{project.totalDaysSpent} Days</p>
              </div>
            </div>
          </Card>
        </div>


        <div className="col-md-6 d-flex">
          <Card className="flex-fill">
            <h5 className="fw-semibold mb-3">Completed Task</h5>
            <Line {...lineConfig} />
          </Card>
        </div>
      </div>

      <div className="row g-4 mt-2">

        <div className="col-md-6 d-flex flex-column">
          <Card className="mb-4 flex-fill">
            <h5 className="fw-semibold mb-3">Priority Stats</h5>
            <div className="d-flex justify-content-between align-items-center">
              {priorityStats.map((stat, idx) => (
                <div key={idx} className="d-flex align-items-center">
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: NEW_COLORS[idx % NEW_COLORS.length],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ marginLeft: 10 }}>{stat.name}</div>
                </div>
              ))}
            </div>
          </Card>


          <Card className="flex-fill">
            <h5 className="fw-semibold mb-3">Pending Task</h5>
            <div className="d-flex align-items-center">
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={70}>
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginLeft: 20 }}>
                {pieData.map((entry, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-2">
                    <div style={{ width: 14, height: 14, backgroundColor: COLORS[idx % COLORS.length], marginRight: 8 }} />
                    {entry.name}: {entry.value}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="col-md-6 d-flex">
          <Card className="flex-fill">
           <h5 className="fw-semibold mb-3">Time Spent</h5>
            <Column {...columnConfig} theme={{ colors10: ['#1784A2'], colors20: ['#1784A2'] }} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;
