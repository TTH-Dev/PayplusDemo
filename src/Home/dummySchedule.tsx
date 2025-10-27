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
  message,
  Select,
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

const Schedule = () => {
  // Mock data for appointments
  const [data, setData] = useState([
    {
      text: "Meeting with Alex",
      startDate: new Date(2024, 11, 24, 9, 0),
      endDate: new Date(2024, 11, 24, 10, 0),
    },
    {
      text: "Website Redesign",
      startDate: new Date(2024, 11, 25, 11, 0),
      endDate: new Date(2024, 11, 25, 12, 30),
    },
  ]);

  const views = ["day", "week", "month"];
  const currentDate = new Date();

  // Handler for deleting an appointment
  const handleDeleteAppointment = (e: any) => {
    e.cancel = true; // Prevent the default behavior
    const { appointmentData } = e; // Extract appointment data
    if (
      window.confirm(
        `Do you want to delete the appointment: "${appointmentData.text}"?`
      )
    ) {
      setData((prevData) =>
        prevData.filter((item) => item !== appointmentData)
      );
    }
  };

  // Handler for clicking on an empty cell
  // const handleEmptyCellClick = (e: any) => {
  //   const startDate = e.cellData.startDate;
  //   const endDate = e.cellData.endDate;
  //   const newText = prompt("Enter appointment title:");

  //   if (newText) {
  //     setData((prevData) => [
  //       ...prevData,
  //       {
  //         text: newText,
  //         startDate,
  //         endDate,
  //       },
  //     ]);
  //   }
  // };

  const [sections, setSections] = useState<number[]>([1]);
  const [isCustom, setIscustom] = useState(false);

  const handleCustomizeWeeks = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSections([1, 2, 3, 4]);
      setIscustom(true);
    } else {
      setSections([1]);
      setIscustom(false);
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
    weekInfo: isCustom?shiftData:shiftData[0],
  };


  console.log(finalscheduleData,"finalscheduleData");
  
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
    // Ensure shiftData is an array and section exists
    const updatedShiftData = Array.isArray(shiftData) ? [...shiftData] : [];
  
    // Ensure the section exists
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
  
    // Update the field (workingDays or leaveDays)
    const days = updatedShiftData[sectionIndex][field] || [];
    updatedShiftData[sectionIndex][field] = isChecked
      ? [...Array.from(new Set([...days, day]))] // Convert Set to Array before spreading
      : days.filter((d: string) => d !== day); // Explicitly typing 'd' as a string
  
  
      // If isCustom is true, update the entire shiftData array
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
      await handleCompleted();
    } catch (error: any) {
      console.log(error);
      message.error(error?.data?.message||"Something went wrong!")
    }
  };

  const handleCompleted = async () => {
    try {
      const token = localStorage.getItem("authtoken");

      const formData = new FormData();
      formData.append("scheduleCompleted", "true");

      const res = await axios.patch(
        `${API_URL}/api/company/${userData.companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.dispatchEvent(new Event("shiftCreated"));

    } catch (error) {
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
      fetchDropMenu(res.data.companyId)
    } catch (error: any) {
      console.log(error);
    }
  };

  const [dmValueBranches,setdmValueBranches]=useState<any>([])
  const fetchDropMenu = async (id:any) => {
    const token=localStorage.getItem("authtoken")
    try {
      const response = await axios.get(`${API_URL}/api/company/dmDeatails?companyId=${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
console.log(response);

    
      setdmValueBranches(response.data.branches); 
    } catch (err) {
     console.log(err);
     
    }
  };


  useEffect(() => {
    getMe();
  }, []);

  const generateOptions = (data: string[]): { value: string; label: string }[] => {
    // Use a Set to filter out duplicates, then map to the required structure
    const uniqueData = Array.from(new Set(data));

    return uniqueData.map((item: string) => ({
      value: item,
      label: item,
    }));
  };

  return (
    <>
      {!isSchedule ? (
        <>
          <div className="pt-3">
            <Container>
              <h3
                style={{ fontSize: "20px", fontWeight: 600, color: "#353535" }}
              >
                Schedule
              </h3>
            </Container>
            <hr className="mt-1" />
          </div>
          <section style={{ overflowX: "hidden" }} className="">
            <Container>
              <div className="row">
                <div className="col-lg-7">
                  <div>
                    <Scheduler
                      className=" position-relative"
                      timeZone="Asia/Kolkata"
                      dataSource={data}
                      defaultCurrentView="week"
                      defaultCurrentDate={currentDate}
                      startDayHour={9}
                      endDayHour={22}
                      showCurrentTimeIndicator={false}
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
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underLine",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                          onClick={() => setISschedule(true)}
                        >
                          Add New <GoPlus />
                        </span>
                      </div>
                    </div>
                    <div className="shift-box p-2">
                      <p
                        className=""
                        style={{ fontSize: "14px", fontWeight: 600 }}
                      >
                        Shift name
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
                                <TableCell
                                  className="py-0"
                                  style={{ border: "none", color: "#666666" }}
                                >
                                  Timing{" "}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            {/* <TableBody>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              className="py-0"
                              component="th"
                              scope="row"
                            >
                              <div className="d-flex justify-content-start align-items-center">
                                <Avatar
                                  alt="Remy Sharp"
                                  src="/static/images/avatar/1.jpg"
                                  sx={{ width: 28, height: 28 }}
                                />
                                <span className="ms-1">Shella s</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-0">Sales</TableCell>
                            <TableCell className="py-0">
                              11.00 Am -12.00 Pm
                            </TableCell>
                          </TableRow>
                        </TableBody> */}
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
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
                Schedule
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
                      Shift Name <span style={{color:"red"}}>*</span>
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
                      Branch <span style={{color:"red"}}>*</span>
                    </label>
                    <br />
                    {/* <Input
                      value={brandata.branch}
                      onChange={(e) =>
                        setbranData({ ...brandata, branch: e.target.value })
                      }
                    /> */}
                        <Select
                      style={{ width: 450, height: 40 }}
                      options={generateOptions(dmValueBranches)}
                      value={brandata.branch}
                      onChange={(value) => setbranData({ ...brandata, branch:value })}
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
                          No of working days <span style={{color:"red"}}>*</span>
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
                          Start time <span style={{color:"red"}}>*</span>
                        </label>
                        <br />

                        <TimePicker
                          value={
                            shiftData[i]?.startTime
                              ? dayjs(shiftData[i]?.startTime, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "startTime",
                              time ? time.format("HH:mm") : ""
                            );
                          }}
                          use12Hours
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
                          Break time out <span style={{color:"red"}}>*</span>
                        </label>
                        <br />
                        <TimePicker
                        use12Hours
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
                          Lunch time out <span style={{color:"red"}}>*</span>
                        </label>
                        <br />
                        <TimePicker
                        use12Hours
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
                          Min punch in time <span style={{color:"red"}}>*</span>
                        </label>
                        <br />
                        <TimePicker
                        use12Hours
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
                          Total no of working hours <span style={{color:"red"}}>*</span>
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
                          No of leave days <span style={{color:"red"}}>*</span>
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
                          End time <span style={{color:"red"}}>*</span>
                        </label>
                        <br />
                        <TimePicker
                        use12Hours
                          value={
                            shiftData[i]?.endTime
                              ? dayjs(shiftData[i]?.endTime, "HH:mm")
                              : null
                          }
                          onChange={(time) => {
                            handleInputChange(
                              i,
                              "endTime",
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
                          Break time in <span style={{color:"red"}}>*</span>
                        </label>
                        <br />
                        <TimePicker
                        use12Hours
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
                          Lunch time in <span style={{color:"red"}}>*</span>
                        </label>
                        <br />
                        <TimePicker
                        use12Hours
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
                          Max punch in time <span style={{color:"red"}}>*</span>
                        </label>
                        <br />
                        <TimePicker
                        use12Hours
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
                          Maximum punch out time (After the working hours) <span style={{color:"red"}}>*</span>
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

export default Schedule;
