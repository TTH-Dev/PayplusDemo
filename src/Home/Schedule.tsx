import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { TimePicker, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "../config";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";

interface DayData {
  name?: string;
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
  break1: string;
  break2: string;
  lunch: string;
  maxIn: string;
  maxOut: string;
  checked: boolean;
}

// Utility to get ordinal for Saturdays
const getOrdinal = (n: number) => {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  if (n === 4) return "4th";
  if (n === 5) return "5th";
  return `${n}th`;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Schedule: React.FC = () => {
  const [customizeWeeks, setCustomizeWeeks] = useState(false);
    const [companyId, setCompanyId] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);
  const [shiftName, setShiftName] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  // Initial week structure
  const initialWeek: DayData[] = days.map(() => ({
    startTime: null,
    endTime: null,
    break1: "",
    break2: "",
    lunch: "",
    maxIn: "",
    maxOut: "",
    checked: false,
    name: "",
  }));

  // Initialize 5 weeks
  const [shiftData, setShiftData] = useState<DayData[][]>(
    Array.from({ length: 5 }, () => initialWeek.map(d => ({ ...d })))
  );
  
  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setCompanyId(res.data.companyId);


    } catch (error: any) {
      console.log(error);
    }
  };
    useEffect(() => {
      getMe();
    }, []);

  const handleInputChange = (
    weekIdx: number,
    dayIdx: number,
    field: keyof DayData,
    value: string | dayjs.Dayjs | null
  ) => {
    setShiftData(prev => {
      const newData = [...prev];
      newData[weekIdx] = [...newData[weekIdx]];
      newData[weekIdx][dayIdx] = { ...newData[weekIdx][dayIdx], [field]: value };
      return newData;
    });
  };

  const handleDayCheck = (weekIndex: number, dayIndex: number, isChecked: boolean, internalValue: string) => {
    setShiftData(prev => {
      const newData = prev.map(week => week.map(day => ({ ...day })));

      let name = days[dayIndex];
      if (dayIndex === 5 && customizeWeeks) name = internalValue; // Saturday

      newData[weekIndex][dayIndex].checked = isChecked;
      newData[weekIndex][dayIndex].name = name;

      return newData;
    });
  };

  // Handle repeat functionality
  useEffect(() => {
    if (!repeat) return;

    setShiftData(prev => {
      const newData = prev.map(week => week.map(d => ({ ...d })));

      for (let w = 0; w < newData.length; w++) {
        const checkedDays = newData[w].filter(d => d.checked);
        if (checkedDays.length === 0) continue;

        const sourceDay = checkedDays[0];
        newData[w] = newData[w].map(d =>
          d.checked
            ? {
                ...d,
                startTime: sourceDay.startTime,
                endTime: sourceDay.endTime,
                break1: sourceDay.break1,
                break2: sourceDay.break2,
                lunch: sourceDay.lunch,
                maxIn: sourceDay.maxIn,
                maxOut: sourceDay.maxOut,
              }
            : d
        );
      }

      return newData;
    });
    getMe()
  }, [repeat]);

  // Build payload for API
  const buildShiftPayload = () => {

    const weekInfo: any[] = [];

    if (customizeWeeks) {
      for (let weekIdx = 0; weekIdx < 5; weekIdx++) {
        const week = shiftData[weekIdx];
        const dayLabels = [...days];
        dayLabels[5] = `${getOrdinal(weekIdx + 1)} Saturday`;

        const workingDays = week.map((d, idx) => (d.checked ? dayLabels[idx] : null)).filter(Boolean);
        if (workingDays.length === 0) continue;

        const leaveDays = week.map((d, idx) => (!d.checked ? dayLabels[idx] : null)).filter(Boolean);
        const firstChecked = week.find(d => d.checked);

        weekInfo.push({
          noOfWorkingDays: workingDays,
          noOfLeaveDays: leaveDays,
          workingDays,
          startTime: firstChecked?.startTime ? dayjs(firstChecked.startTime).format("HH:mm") : "",
          endTime: firstChecked?.endTime ? dayjs(firstChecked.endTime).format("HH:mm") : "",
          break1: firstChecked?.break1 || "",
          break2: firstChecked?.break2 || "",
          lunchBreak: firstChecked?.lunch || "",
          minPunchTime: "10",
          maxPunchinTime: firstChecked?.maxIn || "",
          maxPunchOutTime: firstChecked?.maxOut || "",
          totalWorkingHours: firstChecked?.startTime && firstChecked?.endTime
            ? dayjs(firstChecked.endTime).diff(dayjs(firstChecked.startTime), "hour")
            : 9,
          pendingWorkingHours: 0,
          lastCustomizeWeekPoint: `Customized Week ${weekIdx + 1}`,
          overtime: 1,
        });
      }
    } else {
      // Non-customized → just one week
      const week = shiftData[0];
      const workingDays = week.map((day, idx) => (day.checked ? days[idx] : null)).filter(Boolean) as string[];
      if (workingDays.length > 0) {
        const leaveDays = week.map((day, idx) => (!day.checked ? days[idx] : null)).filter(Boolean) as string[];
        const firstChecked = week.find(d => d.checked);

        weekInfo.push({
          noOfWorkingDays: workingDays,
          noOfLeaveDays: leaveDays,
          workingDays,
          startTime: firstChecked?.startTime ? dayjs(firstChecked.startTime).format("HH:mm") : "",
          endTime: firstChecked?.endTime ? dayjs(firstChecked.endTime).format("HH:mm") : "",
          break1: firstChecked?.break1 || "",
          break2: firstChecked?.break2 || "",
          lunchBreak: firstChecked?.lunch || "",
          minPunchTime: "10",
          maxPunchinTime: firstChecked?.maxIn || "",
          maxPunchOutTime: firstChecked?.maxOut || "",
          totalWorkingHours: firstChecked?.startTime && firstChecked?.endTime
            ? dayjs(firstChecked.endTime).diff(dayjs(firstChecked.startTime), "hour")
            : 9,
          pendingWorkingHours: 0,
          lastCustomizeWeekPoint: "Regular weekdays",
          overtime: 1,
        });
      }
    }

    return {
      companyId,
      branch,
      shiftName,
      isRepeat: repeat,
      isCustomized: customizeWeeks,
      weekInfo,
    };
  };

  const handleSaveShift = async () => {
    const token = localStorage.getItem("authtoken");
    const finalShiftData = buildShiftPayload();

    if (!shiftName) {
      message.error("Please enter shift name and branch");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/shift`, finalShiftData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 || res.status === 201) {
        message.success("Shift created successfully!");
      } else {
        message.warning(`Unexpected status: ${res.status}`);
      }
       navigate("/Schedule")
    }
        catch (error: any) {
      message.error(error?.response?.data?.message || error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="p-4" style={{ color: "#353535" }}>
      <div className="d-flex align-items-center mb-4"
      onClick={() => navigate("/Schedule")}
      >
        <LeftOutlined style={{ cursor: "pointer"}}/>
        <span className="ms-2 h5 mb-0">New Shift</span>
      </div>

      <div className="mb-4">
        <h6>Shift Info</h6>
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>
              Shift Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control type="text" value={shiftName} onChange={e => setShiftName(e.target.value)} />
          </Col>
          <Col md={6}>
            <Form.Label>Branch</Form.Label>
            <Form.Select value={branch} onChange={e => setBranch(e.target.value)}>
              <option value=""></option>
              <option value="B-branch">B-branch</option>
              <option value="Branch 1">Branch 1</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

<div className="mb-3 d-flex align-items-center">
  <Tabs
    activeKey={activeWeek.toString()}
    onChange={(key) => {
      setActiveWeek(Number(key));
      setRepeat(false); // preserve your existing logic
    }}
    items={
      customizeWeeks
        ? [0, 1, 2, 3, 4].map((w) => ({
            key: w.toString(),
            label: `Week ${w + 1}`,
            children: null, // schedule is rendered separately
          }))
        : [
            {
              key: "0",
              label: "Week",
              children: null,
            },
          ]
    }
  />

  {/* Checkbox immediately after the tabs */}
  {!customizeWeeks && (
    <div className="ms-3">
      <Form.Check
        type="checkbox"
        label="Customize weeks"
        checked={customizeWeeks}
        onChange={e => {
          const chk = e.target.checked;
          setCustomizeWeeks(chk);
          setActiveWeek(chk ? 0 : 0);
        }}
      />
    </div>
  )}
</div>


      <div className="mb-3">
        <Form.Check
          type="checkbox"
          label="Repeat"
          checked={repeat}
          onChange={e => setRepeat(e.target.checked)}
        />
      </div>

      {days.map((day, idx) => {
        let internalValue = day;
        if (customizeWeeks && day === "Saturday") {
          internalValue = `${getOrdinal(activeWeek + 1)} Saturday`;
        }

        return (
          <div key={`${activeWeek}-${internalValue}`} className="mb-4">
            <Row className="align-items-start mb-2">
              <Col xs={2}></Col>
              {["Start Time","End Time","Break 1 Time","Break 2 Time","Lunch Time","Max punch in","Max punch out"].map(label => (
                <Col key={label} style={{ color: "#666", fontSize: 14, fontWeight: 400 }}>{label}</Col>
              ))}
            </Row>

            <Row className="gx-2 align-items-center">
              <Col xs={2}>
                <Form.Check
                  inline
                  label={day}
                  checked={shiftData[activeWeek][idx].checked}
                  onChange={e => handleDayCheck(activeWeek, idx, e.target.checked, internalValue)}
                />
              </Col>

              <Col>
                <TimePicker
                  use12Hours
                  style={{ width: "100%" }}
                  value={shiftData[activeWeek][idx].startTime}
                  onChange={val => handleInputChange(activeWeek, idx, "startTime", val)}
                />
              </Col>
              <Col>
                <TimePicker
                  use12Hours
                  style={{ width: "100%" }}
                  value={shiftData[activeWeek][idx].endTime}
                  onChange={val => handleInputChange(activeWeek, idx, "endTime", val)}
                />
              </Col>
              <Col>
                <Form.Control
                  value={shiftData[activeWeek][idx].break1}
                  onChange={e => handleInputChange(activeWeek, idx, "break1", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  value={shiftData[activeWeek][idx].break2}
                  onChange={e => handleInputChange(activeWeek, idx, "break2", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  value={shiftData[activeWeek][idx].lunch}
                  onChange={e => handleInputChange(activeWeek, idx, "lunch", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  value={shiftData[activeWeek][idx].maxIn}
                  onChange={e => handleInputChange(activeWeek, idx, "maxIn", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  value={shiftData[activeWeek][idx].maxOut}
                  onChange={e => handleInputChange(activeWeek, idx, "maxOut", e.target.value)}
                />
              </Col>
            </Row>
          </div>
        );
      })}

      <div className="d-flex justify-content-between mt-4">
        <span className="text-decoration-underline text-secondary" style={{ cursor: "pointer" }}>Cancel</span>
        <Button variant="contained" onClick={handleSaveShift} disabled={loading} className="newBtn text-white">
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Schedule;
