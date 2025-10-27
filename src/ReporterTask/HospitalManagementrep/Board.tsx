import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, Avatar, Tabs, Tab } from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaTable, FaList, FaExclamationCircle, FaTrash, FaEllipsisV, FaComment, FaExclamationTriangle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FaEllipsisH } from "react-icons/fa";

import "./Board.css";

interface BoardProps {
  isTodo: boolean;
  setIsTodo: (value: boolean) => void;
}
const Board: React.FC<BoardProps> = ({ isTodo, setIsTodo }) => {
  const [activeTable, setActiveTable] = useState<"A" | "B">("A");
  // const [isTodo, setIsTodo] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
   const [showOptions, setShowOptions] = useState(false);
   const [showFilterModal, setShowFilterModal] = useState(false);
  

  const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDelete = () => {
    console.log("Task deleted ✅");
    setShowModal(false);
  };

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const outerCards = [
    { title: "To Do List", count: "02" },
    { title: "Testing", count: "05" },
    { title: "Development", count: "08" },
    { title: "Finalize", count: "03" },
  ];

const tasks = [
  {
    text: "To design the static website for dev",
    date: "09-07-2024",
    statusIcon: (
      <div style={{ position: "relative", display: "inline-block" }}>
        <FaComment size={25} color="#00BA00" />
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "6px",
            color: "white",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          !!!
        </span>
      </div>
    ),
    showReporter: true, // ✅ add this
  },
  {
    text: "To design the static website for dev",
    date: "09-07-2024",
    statusIcon: (
      <>
        <FaExclamationTriangle size={23} style={{ color: "red", margin: "auto" }} />
        <div style={{ position: "relative", display: "inline-block" }}>
          <FaComment size={25} color="#00BA00" />
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "6px",
              color: "white",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            !!!
          </span>
        </div>
      </>
    ),
    showReporter: false, // ✅ or false if you don’t want it
  },
];


  const data = [
    { task: "To design the static website for dev", status: "To Do List", assignee: "John Kumar", reporter: "Meghana", priority: "High", created: "15-03-2025", issue: "Yes" },
    { task: "To design the static website for dev", status: "To Do List", assignee: "Edward", reporter: "Meghana", priority: "Low", created: "15-03-2025", issue: "-" },
    { task: "To design the static website for dev", status: "Testing", assignee: "Jasmin", reporter: "Meghana", priority: "Medium", created: "15-03-2025", issue: "Submitted" },
    { task: "To design the static website for dev", status: "Testing", assignee: "Emma Snow", reporter: "Meghana", priority: "Low", created: "15-03-2025", issue: "Completed" },
  ];

  const attachments = [
  {
    id: 1,
    name: "Download.png",
    time: "Today at 12:35 PM",
    img: "https://img.icons8.com/ios-filled/150/000000/picture.png",
  },
  {
    id: 2,
    name: "Image.jpg",
    time: "Today at 01:15 PM",
    img: "https://img.icons8.com/ios-filled/150/000000/picture.png",
  },
  {
    id: 3,
    name: "Report.pdf",
    time: "Yesterday 04:30 PM",
    img: "https://img.icons8.com/ios-filled/150/000000/pdf.png",
  },
  {
    id: 4,
    name: "Design.png",
    time: "Yesterday 03:15 PM",
    img: "https://img.icons8.com/ios-filled/150/000000/picture.png",
  },
];

  return (
    <>
    <div >
    {!isTodo ? (
        <>
          {/* Board Filter + View */}
      <div className="d-flex justify-content-between align-items-center mb-2 p-2">
        <button
        onClick={() => setShowFilterModal(true)}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* First circle: M */}
          <div
            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "40px",
              height: "40px",
              zIndex: 1, // behind the second circle
              backgroundColor: "white",
            }}
          >
            M
          </div>

          {/* Second circle: K */}
          <div
            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "40px",
              height: "40px",
              marginLeft: "-13px", 
              zIndex: 2, // on top of M
              backgroundColor: "white",
            }}
          >
            K
          </div>
        </div>


      </div>

          {/* Table A */}
          
           
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
                                     flex: "0 0 calc((100% - 40px) / 3)", // 3 cards visible
                                                     
                                     borderRadius: "16px",
                                     boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                                     display: "flex",
                                     flexDirection: "column",
                                     justifyContent: "space-between",
                                     cursor: "pointer",
                                     }}
                  
                >
                  <CardContent>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <Typography style={{fontWeight:600, fontSize:"14px", color:"#353535"}}
                     
                      >{outer.title}</Typography>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Typography variant="subtitle1">{outer.count}</Typography>
                        <FaEllipsisH size={18} />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {tasks.map((task, j) => (
                      <Card
                        onClick={() => outer.title === "To Do List" && setIsTodo(true)}
                        key={j}
                        style={{
                          borderRadius: "12px",
                          background: "#FAFAFA",
                          padding: "12px",
                          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography
                          variant="body2" style={{ marginBottom: "8px", fontWeight: 500, color: "#7A7A7A" }}
                        >
                          {task.text}
                        </Typography>

                        {/* Add Reporter text conditionally */}
                        {task.showReporter && (
                          <Typography
                            variant="body2"
                            style={{ color: "#1784A2", marginBottom: "6px", fontWeight: 500, textAlign:"end"}}
                          >
                            Reporter
                          </Typography>
                        )}

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "14px",
                          }}
                        >
                          <Typography variant="caption" style={{fontWeight:"500",color:"#353535"}}>{task.date}</Typography>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {task.statusIcon}
                            <div
                              className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: "30px", height: "30px" }}
                            >
                              M
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    </div>
                  </CardContent>

                  

                </Card>
              ))}

              
                            {outerCards.length < 3 &&
                              Array.from({ length: 3 - outerCards.length }).map((_, idx) => (
                                <div key={`empty-${idx}`} />
                              ))}
            </div>
          



        </>
      ) : (

        /* Todo Page Content */
        <div className="p-3">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaChevronLeft 
                size={20} 
                style={{ cursor: "pointer" }} 
                onClick={() => setIsTodo(false)} 
              />
            <Typography variant="h6">To Do list</Typography>
            

          </div>

        <div style={{display: "flex", alignItems: "center", marginTop: "20px",gap:"10px"}}>
          <div style={{ display: "flex",  flex: 1, gap: "10px" }}>
            {/* To Do List (first tab) */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              fontSize: "16px",
              color: "white",
              border: "2px solid #1784A2",
              backgroundColor: "#1784A2",
              borderRadius: "20px", // ✅ makes all corners rounded
            }}
          >
            To Do List
          </div>


            {/* Testing (cut on left) */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px",
                fontSize: "16px",
                color: "#1784A2",
                border: "2px solid #1784A2",
                backgroundColor: "white",
                borderRadius: "20px",
               
              }}
            >
              Testing
            </div>

            {/* Development (cut on left) */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px",
                fontSize: "16px",
                color: "#1784A2",
                border: "2px solid #1784A2",
                backgroundColor: "white",
               borderRadius: "20px",
              }}
            >
              Development
            </div>

            {/* Finalize (last tab, rounded right side) */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px",
                fontSize: "16px",
                color: "#1784A2",
                border: "2px solid #1784A2",
                backgroundColor: "white",
                borderRadius: "20px",
              }}
            >
              Finalize
            </div>
          </div>

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

              <div style={{ position: "relative", display: "inline-block" }}>
                <button
                  ref={buttonRef}
                  title="More options"
                  style={{
                    background: "#1784A2",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "4px",
                    color: "white",
                    position: "relative",
                    zIndex: 10001,
                  }}
                  onClick={() => setShowOptions((prev) => !prev)}
                >
                  <FaEllipsisH size={18} />
                </button>

                {showOptions && (
                  <>
                    {/* Overlay background */}
                    <div
                      onClick={() => setShowOptions(false)}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.2)", // light dim effect
                        zIndex: 9998,
                      }}
                    />

                    {/* Tooltip */}
                    <div
                      style={{
                        position: "absolute",
                        top: "120%",
                        right: 0,
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
                        padding: "10px",
                        zIndex: 10002,
                        minWidth: "160px",
                      }}
                    >
                      {/* Arrow */}
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "10px",
                          width: 0,
                          height: 0,
                          borderLeft: "8px solid transparent",
                          borderRight: "8px solid transparent",
                          borderBottom: "8px solid white",
                          filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.1))",
                        }}
                      />

                      {/* Menu options */}
                      <div style={{ padding: "5px 10px", cursor: "pointer" }}>Task Completed</div>
                      <div style={{ padding: "5px 10px", cursor: "pointer" }}>Edit Task Info</div>
                    </div>
                  </>
                )}
              </div>

          </div>
        </div>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
             
            <Card>
              <CardContent sx={{ p: 3 }}> {/* ✅ extra padding inside card */}
                <Typography variant="h6" gutterBottom>
                  Project Detail
                </Typography>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    rowGap: "16px",   // ✅ more vertical spacing
                    columnGap: "24px", // ✅ wider gap between label & value
                    alignItems: "center",
                    color: "#3f3d3d",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Task Name:</span>
                  <span>To design the static website for dev</span>

                  <span style={{ fontWeight: 600 }}>Created Date:</span>
                  <span>10-06-2025</span>

                  <span style={{ fontWeight: 600 }}>Assignee:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: "28px", height: "28px", fontSize: "14px" }}
                    >
                      M
                    </div>
                    <span>Mary</span>
                  </div>

                  <span style={{ fontWeight: 600 }}>Reporter:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: "28px", height: "28px", fontSize: "14px" }}
                    >
                      M
                    </div>
                    <span>Mary</span>
                  </div>

                  <span style={{ fontWeight: 600 }}>Priority:</span>
                  <span>Low</span>

                  <span style={{ fontWeight: 600 }}>Due Date:</span>
                  <span>15-06-2025</span>
                </div>
              </CardContent>
            </Card>
                  
            {/* Task Tracking */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Tracking
                </Typography>

                <table
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom: "1px solid #ddd",
                          fontWeight: 600,
                        }}
                      >
                        Work Date
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom: "1px solid #ddd",
                          fontWeight: 600,
                        }}
                      >
                        Start Time
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom: "1px solid #ddd",
                          fontWeight: 600,
                        }}
                      >
                        End Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["10-11-2025", "10:15 AM", "06:20 PM"],
                      ["14-09-2025", "10:15 AM", "06:20 PM"],
                      ["10-11-2025", "10:15 AM", "06:20 PM"],
                      ["14-09-2025", "10:15 AM", "06:20 PM"],
                    ].map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            style={{
                              padding: "12px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            </div>

            <Card style={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Activities</Typography>
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                >
                  <Tab label="History" />
                  <Tab label="Comments" />
                  <Tab label="Attachment" />
                  <Tab label="Issue" />
                </Tabs>

                <div style={{ marginTop: "20px" }}>
                  {tabValue === 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: "24px", height: "24px" }}>M</div>
                        <span>Mary reply to the issue</span>
                      </div>
                      <span style={{ fontSize: "16px", color: "#888" }}>Today 10:15 AM</span>
                    </div>
                  )}

                  {tabValue === 1 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "400px", // adjust based on card height
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      {/* Top comment text */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px" }}>
                        <div
                          className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "24px", height: "24px" }}
                        >
                          M
                        </div>
                        <span>Mary commented on the project</span>
                        <span style={{ marginLeft: "auto", fontSize: "12px", color: "#888" }}>
                          Today 10:30 AM
                        </span>
                      </div>

                      {/* Separator line */}
                      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: 0 }} />

                      {/* Comment editor at bottom */}
                      <div style={{ marginTop: "8px" }}>
                        {/* Toolbar */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                          <button style={{ fontWeight: "bold", border: "none", color: "#3a3838ff"}}>B</button>
                          <button style={{ fontStyle: "italic", border: "none", color: "#3a3838ff" }}>I</button>
                          <button style={{ textDecoration: "underline", border: "none", color: "#3a3838ff" }}>U</button>
                          <button style={{  border: "none", color: "#3a3838ff" }}>🔗</button>
                          <button style={{  border: "none", color: "#3a3838ff" }}>📄</button> {/* Justify symbol */}
                          <button style={{  border: "none", color: "#3a3838ff" }}>•</button> {/* Bullet symbol */}
                        </div>

                        {/* Textarea */}
                        <textarea
                          placeholder="Type  here..."
                          style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "8px",
                            // borderRadius: "4px",
                            // border: "1px solid #ccc",
                            resize: "vertical",
                          }}
                        />

                        {/* Action buttons */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "8px",
                          }}
                        >
                          <button style={{ color: "#555", border:"none", borderBottom: "1px dotted #555"}}>Cancel</button>
                          <button
                            style={{
                              minWidth: "120px",
                              background: "#1784A2",
                              color: "white",
                              padding: "4px 12px",
                              border: "none",
                              borderRadius: "4px",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {tabValue === 2 && (
                    <div className="attachments-section">

                      {/* First row: only 2 cards */}
                      <div className="row g-4 mb-4 justify-content-start">
                        {attachments.slice(0, 2).map((file) => (
                          <div key={file.id} className="col-12 col-md-6"> {/* 2 cards per row */}
                            <div className="card h-100 shadow-sm">
                              {/* Image Section */}
                              <div
                                className="p-3 position-relative d-flex align-items-center justify-content-center"
                                style={{ height: "120px" }}
                              >
                                <img
                                  src={file.img}
                                  alt="thumbnail"
                                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                />
                                <div
                                  className="position-absolute"
                                  style={{ top: "8px", right: "8px", cursor: "pointer" }}
                                >
                                  <MoreVertIcon style={{ color: "#000000ff", fontSize: "20px" }} />
                                </div>
                              </div>

                              {/* Divider Line */}
                              <hr className="m-0" />

                              {/* Content Section */}
                              <div className="card-body p-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex flex-column">
                                    <p className="card-title text-primary small fw-medium mb-1 text-truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-muted small fs-6 mb-0" style={{ whiteSpace: "nowrap" }}>
                                      {file.time}
                                    </p>
                                  </div>
                                  <div
                                    className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: "32px", height: "32px", fontSize: "14px" }}
                                  >
                                    M
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Second row: Upload area */}
                      <div className="row">
                        <div className="col-12">
                          <div
                            className="d-flex align-items-center justify-content-center border border-dashed rounded p-5 text-muted"
                            style={{ minHeight: "120px", cursor: "pointer" }}
                          >
                            <span>Upload here or drag files</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tabValue === 3 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "400px", // adjust based on card height
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      {/* Top comment text */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "8px" }}>
                      
                      <div>
                        <h5>Done Issue</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                            <input type="checkbox" />
                            <span>Need to resign the whole logo from the vector to 3D</span>
                          </div>

                          
                          <span style={{ fontSize: "12px", color: "#888", marginLeft: "16px", whiteSpace: "nowrap" }}>
                            Today 10:30 AM
                          </span>
                        </div>
                      </div>

                      
                      <div>
                        <h5>Created Issue</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          {/* Left side: only text */}
                          <div style={{ flex: 1 }}>
                            <span>Need to resign the whole logo from the vector to 3D</span>
                          </div>

                          {/* Right side: time */}
                          <span style={{ fontSize: "12px", color: "#888", marginLeft: "16px", whiteSpace: "nowrap" }}>
                            Today 10:30 AM
                          </span>
                        </div>
                      </div>
                    </div>

                      {/* Separator line */}
                      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: 0 }} />

                      {/* Comment editor at bottom */}
                      <div style={{ marginTop: "8px" }}>
                        {/* Toolbar */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                          <button style={{ fontWeight: "bold", border: "none", color: "#3a3838ff"}}>B</button>
                          <button style={{ fontStyle: "italic", border: "none", color: "#3a3838ff" }}>I</button>
                          <button style={{ textDecoration: "underline", border: "none", color: "#3a3838ff" }}>U</button>
                          <button style={{  border: "none", color: "#3a3838ff" }}>🔗</button>
                          <button style={{  border: "none", color: "#3a3838ff" }}>📄</button> {/* Justify symbol */}
                          <button style={{  border: "none", color: "#3a3838ff" }}>•</button> {/* Bullet symbol */}
                        </div>

                        {/* Textarea */}
                        <textarea
                          placeholder="Type  here..."
                          style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "8px",
                            // borderRadius: "4px",
                            // border: "1px solid #ccc",
                            resize: "vertical",
                          }}
                        />

                        {/* Action buttons */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "8px",
                          }}
                        >
                          <button style={{ color: "#555", border:"none", borderBottom: "1px dotted #555"}}>Cancel</button>
                          <button
                            style={{
                              minWidth: "120px",
                              background: "#1784A2",
                              color: "white",
                              padding: "4px 12px",
                              border: "none",
                              borderRadius: "4px",
                            }}
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
                  onClick={handleDelete}
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

    </>
  );
};

export default Board;
