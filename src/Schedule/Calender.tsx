import {
  Avatar,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Checkbox,
  CheckboxChangeEvent,
  DatePicker,
  Input,
  TimePicker,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Scheduler from "devextreme-react/cjs/scheduler";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

// Define interfaces for WeekInfo and the main Shift object
interface WeekInfo {
  NoOfWorkingDays: string[];
  NoOfLeaveDays: string[];
  workingDays: string[];
  startTime: string;
  endTime: string;
  breakTimeOut: string;
  breakTimeIn: string;
  lunchTimeOut: string;
  lunchTimeIn: string;
  minPunchTime: string;
  maxPunchTime: string;
  totalWorkingHours: number;
  maxPunchOutTime: string;
  // lastCustomizeWeekPoint: string;
}

interface Shift {
  companyId: string;
  shiftName: string;
  branch: string;
  weekInfo: WeekInfo[];
}

const Calender = () => {
  // Mock data for appointments


  const currentDate = new Date();



  const [sections, setSections] = useState<number[]>([1]);
  const [allshiftData, setallShiftData] = useState<any>([]);

  const handleCustomizeWeeks = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSections([1, 2, 3, 4]);
    } else {
      setSections([1]);
    }
  };

  const [isSchedule, setISschedule] = useState(false);
  const [shiftData, setShiftData] = useState<any[]>([
    {
      workingDays: [],
      leaveDays: [],
      startTime: "",
      endTime: "",
      breakTimeOut: "",
      breakTimeIn: "",
      lunchTimeOut: "",
      lunchTimeIn: "",
      minPunchTime: "",
      totalWorkingHours: "",
      maxPunchOutTime: "",
    },
  ]);

  const [userData, setuserData] = useState({
    id: "",
    name: "",
    email: "",
    companyId: "",
  });
  const [brandata, setbranData] = useState({
    branch: "",
    shiftName: "",
  });
  const finalscheduleData = {
    companyId: userData.companyId,
    shiftName: brandata.shiftName,
    branch: brandata.branch,
    weekInfo: shiftData,
  };

  const handleInputChange = (
    sectionIndex: number,
    field: string,
    value: any
  ) => {
    const updatedShiftData = [...shiftData];
    updatedShiftData[sectionIndex] = {
      ...updatedShiftData[sectionIndex],
      [field]: value,
    };
    setShiftData(updatedShiftData);
  };

  const handleCheckboxChange = (
    sectionIndex: number,
    field: "workingDays" | "leaveDays",
    day: string,
    isChecked: boolean
  ) => {
    // Ensure the section exists
    const updatedShiftData = [...shiftData];
    if (!updatedShiftData[sectionIndex]) {
      updatedShiftData[sectionIndex] = {
        workingDays: [],
        leaveDays: [],
        startTime: "",
        endTime: "",
        breakTimeOut: "",
        breakTimeIn: "",
        lunchTimeOut: "",
        lunchTimeIn: "",
        minPunchTime: "",
        totalWorkingHours: "",
        maxPunchOutTime: "",
      };
    }

    // Update the field
    const days = updatedShiftData[sectionIndex][field] || [];
    if (isChecked) {
      // Add the day if not already present
      if (!days.includes(day)) {
        days.push(day);
      }
    } else {
      // Remove the day
      updatedShiftData[sectionIndex][field] = days.filter(
        (d: any) => d !== day
      );
    }

    updatedShiftData[sectionIndex][field] = days;

    setShiftData(updatedShiftData);
  };

  const handlesaveSchedlue = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.post(`${API_URL}/api/shift`, finalscheduleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setuserData(res.data);
      await getShift();
    } catch (error: any) {
      console.log(error);
    }
  };

  const [data, setData] = useState<any>([
  ]);

  
  

  const getShift = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/shift-allocation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.data,"datata");
      setallShiftData(res.data.data);
      const formattedData = res.data.data.map((val: any) => ({
        text: val.shiftName,
        startDate: new Date(val.startDate),
        endDate: new Date(val.endDate),
      }));
      setData(formattedData);
    
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);



  

  return (
    <>
      {!isSchedule ? (
        <>
          <section style={{ overflowX: "hidden" }} className="">
            <Container>
              <div className="row">
                <div className="col-lg-7">
                  <div>
                    <Scheduler
                      className="position-relative"
                      timeZone="Asia/Kolkata"
                      dataSource={data}
                      defaultCurrentView="week"
                      defaultCurrentDate={currentDate}
                      startDayHour={9}
                      endDayHour={22}
                      showCurrentTimeIndicator={false}
                      editing={{
                        allowAdding: false,
                        allowDeleting: false,
                        allowDragging: false,
                        allowResizing: false,
                        allowUpdating: false,
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="">
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <div>
                        <h6 className="mb-0">Shifts</h6>
                      </div>
                      <div>
                        <Link
                          to="/Newshift"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underLine",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#000",
                          }}
                        >
                          Add New <GoPlus />
                        </Link>
                      </div>
                    </div>
                    {allshiftData.map((val: any, i: any) => (
                      <div className="shift-box p-2 my-2">
                        <p
                          className=""
                          style={{ fontSize: "14px", fontWeight: 600 }}
                        >
                          {val.shiftName || "-"}
                        </p>
                        <div>
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 100 }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    className="py-0"
                                    style={{ border: "none", color: "#666666" }}
                                  >
                                    Profile{" "}
                                  </TableCell>
                                  <TableCell
                                    className="py-0"
                                    style={{ border: "none", color: "#666666" }}
                                  >
                                    Department{" "}
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {val.employees?.length > 0 &&
                                  val.employees.map((val: any, i: any) => (
                                    <TableRow
                                      key={i}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell
                                        className="py-0"
                                        component="th"
                                        scope="row"
                                      >
                                        <div className="d-flex justify-content-start align-items-center">
                                          <Avatar
                                            alt={val?.firstName}
                                            src="/static/images/avatar/1.jpg"
                                            sx={{ width: 28, height: 28 }}
                                          />
                                          <span className="ms-1">{`${val?.firstName} ${val?.lastName}`}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-0">
                                        {val?.jobInfo?.department || "-"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </>
      ) : (
        <>
          <div className="pt-3">
            <Container>
              <span
                onClick={() => setISschedule(false)}
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#353535",
                  cursor: "pointer",
                }}
              >
                <IoIosArrowBack className="mb-1" />
                New Schedule
              </span>
            </Container>
            <hr className="mt-1" />
          </div>
          <section className="pb-3">
            <Container>
              <div>
                <p
                  style={{
                    color: "#353535",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Shift Info
                </p>
                <div className="row">
                  <div className="col-lg-6">
                    <label
                      className="py-2"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      Shift Name
                    </label>
                    <br />
                    <Input
                      value={brandata.shiftName}
                      onChange={(e) =>
                        setbranData({ ...brandata, shiftName: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="py-2"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      Branch
                    </label>
                    <br />
                    <Input
                      value={brandata.branch}
                      onChange={(e) =>
                        setbranData({ ...brandata, branch: e.target.value })
                      }
                    />
                  </div>
                </div>
                {sections.map((sectionIndex, i) => (
                  <div key={sectionIndex} className="row">
                    <div className="col-lg-6">
                      <div>
                        <p
                          style={{
                            color: "#353535",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                          className="py-2 mb-0"
                        >
                          {sectionIndex} week Info
                        </p>
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          No of working days
                        </label>
                        <br />
                        <Checkbox
                          checked={shiftData[i]?.workingDays.includes("Monday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "workingDays",
                              "Monday",
                              e.target.checked
                            )
                          }
                        >
                          Monday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.workingDays.includes(
                            "Tuesday"
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "workingDays",
                              "Tuesday",
                              e.target.checked
                            )
                          }
                        >
                          Tuesday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.workingDays.includes(
                            "Wednesday"
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "workingDays",
                              "Wednesday",
                              e.target.checked
                            )
                          }
                        >
                          Wednesday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.workingDays.includes(
                            "Thursday"
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "workingDays",
                              "Thursday",
                              e.target.checked
                            )
                          }
                        >
                          Thursday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.workingDays.includes("Friday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "workingDays",
                              "Friday",
                              e.target.checked
                            )
                          }
                        >
                          Friday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.workingDays.includes(
                            "Saturday"
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "workingDays",
                              "Saturday",
                              e.target.checked
                            )
                          }
                        >
                          Saturday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.workingDays.includes("Sunday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "workingDays",
                              "Sunday",
                              e.target.checked
                            )
                          }
                        >
                          Sunday
                        </Checkbox>
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Start time
                        </label>
                        <br />
                        <DatePicker
                          value={
                            shiftData[i]?.startTime
                              ? moment(shiftData[i]?.startTime)
                              : null
                          }
                          onChange={(date) => {
                            handleInputChange(
                              i,
                              "startTime",
                              date ? date.format("YYYY-MM-DD") : ""
                            );
                          }}
                        />{" "}
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Break time out
                        </label>
                        <br />
                        <TimePicker
                          value={
                            shiftData[i]?.breakTimeOut
                              ? dayjs(shiftData[i]?.breakTimeOut, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "breakTimeOut",
                              time ? time.format("HH:mm") : ""
                            );
                          }}
                        />
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Lunch time out
                        </label>
                        <br />
                        <TimePicker
                          value={
                            shiftData[i]?.lunchTimeOut
                              ? dayjs(shiftData[i]?.lunchTimeOut, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "lunchTimeOut",
                              time ? time.format("HH:mm") : ""
                            );
                          }}
                        />
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Min punch in time
                        </label>
                        <br />
                        <TimePicker
                          value={
                            shiftData[i]?.minPunchTime
                              ? dayjs(shiftData[i]?.minPunchTime, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "minPunchTime",
                              time ? time.format("HH:mm") : ""
                            );
                          }}
                        />
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Total no of working hours
                        </label>
                        <Input
                          suffix={"Hrs"}
                          value={shiftData[i]?.totalWorkingHours ?? ""}
                          onChange={(e) => {
                            const newValue = e.target.value
                              ? parseFloat(e.target.value)
                              : 0;
                            handleInputChange(i, "totalWorkingHours", newValue);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <label
                          className="pt-5"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          No of leave days
                        </label>
                        <br />

                        <Checkbox
                          checked={shiftData[i]?.leaveDays.includes("Monday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "leaveDays",
                              "Monday",
                              e.target.checked
                            )
                          }
                        >
                          Monday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.leaveDays.includes("Tuesday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "leaveDays",
                              "Tuesday",
                              e.target.checked
                            )
                          }
                        >
                          Tuesday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.leaveDays.includes(
                            "Wednesday"
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "leaveDays",
                              "Wednesday",
                              e.target.checked
                            )
                          }
                        >
                          Wednesday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.leaveDays.includes("Thursday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "leaveDays",
                              "Thursday",
                              e.target.checked
                            )
                          }
                        >
                          Thursday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.leaveDays.includes("Friday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "leaveDays",
                              "Friday",
                              e.target.checked
                            )
                          }
                        >
                          Friday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.leaveDays.includes("Saturday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "leaveDays",
                              "Saturday",
                              e.target.checked
                            )
                          }
                        >
                          Saturday
                        </Checkbox>
                        <Checkbox
                          checked={shiftData[i]?.leaveDays.includes("Sunday")}
                          onChange={(e) =>
                            handleCheckboxChange(
                              i,
                              "leaveDays",
                              "Sunday",
                              e.target.checked
                            )
                          }
                        >
                          Sunday
                        </Checkbox>
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          End time
                        </label>
                        <br />
                        <DatePicker
                          value={
                            shiftData[i]?.endTime
                              ? moment(shiftData[i]?.endTime)
                              : null
                          }
                          onChange={(date) => {
                            handleInputChange(
                              i,
                              "endTime",
                              date ? date.format("YYYY-MM-DD") : ""
                            );
                          }}
                        />
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Break time in
                        </label>
                        <br />
                        <TimePicker
                          value={
                            shiftData[i]?.breakTimeIn
                              ? dayjs(shiftData[i]?.breakTimeIn, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "breakTimeIn",
                              time ? time.format("HH:mm") : ""
                            );
                          }}
                        />
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Lunch time in
                        </label>
                        <br />
                        <TimePicker
                          value={
                            shiftData[i]?.lunchTimeIn
                              ? dayjs(shiftData[i]?.lunchTimeIn, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "lunchTimeIn",
                              time ? time.format("HH:mm") : ""
                            );
                          }}
                        />
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Max punch in time
                        </label>
                        <br />
                        <TimePicker
                          value={
                            shiftData[i]?.maxPunchTime
                              ? dayjs(shiftData[i]?.maxPunchTime, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "maxPunchTime",
                              time ? time.format("HH:mm") : ""
                            );
                          }}
                        />
                        <br />
                        <label
                          className="py-2"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#666666",
                          }}
                        >
                          Maximum punch out time (After the working hours)
                        </label>
                        <br />
                        <Input
                          suffix={"Mins"}
                          value={shiftData[i]?.maxPunchOutTime ?? ""}
                          onChange={(e) => {
                            handleInputChange(
                              i,
                              "maxPunchOutTime",
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Checkbox onChange={handleCustomizeWeeks}>
                    Customize weeks
                  </Checkbox>
                </div>
                <div className="py-3 d-flex justify-content-between align-items-center">
                  <a
                    className="skipbtn 
              "
                    onClick={() => setISschedule(false)}
                  >
                    Cancel
                  </a>
                  <Button
                    variant="contained"
                    className="nextBtn"
                    onClick={handlesaveSchedlue}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        </>
      )}
    </>
  );
};

export default Calender;
