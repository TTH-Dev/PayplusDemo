import React, {useState} from "react";
import { Card, CardContent, Typography, Avatar } from "@mui/material";
import { MdFilterAlt } from "react-icons/md";
import { FaComment } from "react-icons/fa";

const Issue: React.FC = () => {
  const outerCards = [{ title: "Completed Issue" }, { title: "New Issue" }];

  const column1Rows = Array.from({ length: 4 }, (_, i) => ({
    text: "To design the static website for dev",
    date: "09-07-2024",
    statusIcon:         
      <div style={{ position: "relative", display: "inline-block" }}>
                
                <FaComment size={25} color="#00BA00"/>
      
                
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
    
  }));

  const column2Rows = Array.from({ length: 4 }, (_, i) => ({
    text: "Need to redesign the whole logo from vector to 3D",
    date: "09-07-2024",
    statusIcon:         
      <div style={{ position: "relative", display: "inline-block" }}>
                
                <FaComment size={25} color="#00BA00"/>
      
                
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
    
  }));

  const innerColumns = [column1Rows, column2Rows];
    const [value, setValue] = useState(0); 
    const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      


      {/* Cards Section */}
      <div style={{ display: "flex", gap: 20 }}>
        {outerCards.map((outer, i) => (
          <Card
            key={i}
            style={{
              flex: 1,
              borderRadius: 16,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography
                
                style={{ marginBottom: 8, fontWeight: 700 , fontSize:"14px", color:"#353535"}}
              >
                {outer.title}
              </Typography>

              {/* Two columns side-by-side */}
              <div style={{ display: "flex", gap: 16 }}>
                {innerColumns.map((columnRows, colIndex) => (
                  <div
                    key={colIndex}
                    style={{
                      flex: 1,
                      display: "grid",
                      gridTemplateRows: "repeat(4, minmax(0, 1fr))",
                      gap: 12,
                    }}
                  >
                    {columnRows.map((row, rowIndex) => (
                      <Card
                        key={rowIndex}
                        style={{
                          borderRadius: 8,
                          padding: 12,
                          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                        }}
                      >
                        {/* Title */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(0,0,0,0.6)",
                            fontWeight: 500,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            wordBreak: "break-word",
                            lineHeight: 1.2,
                            minHeight: "2.4em",
                            marginBottom: "25px",
                          }}
                        >
                          {row.text}
                        </Typography>

                        {/* Bottom row: date (left) + status + avatar (right) */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 8,
                          }}
                        >
                          {/* Left → Date */}
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#353535",
                              fontWeight: 500,
                            }}
                          >
                            {row.date}
                          </Typography>

                          {/* Right → Status + Avatar */}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {colIndex === 0 && row.statusIcon} {/* ✅ only show in first column */}
                          <div
                            className="rounded-circle border border-primary text-primary d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: "30px", height: "30px" }}
                          >
                            K
                          </div>
                          
                        </div>

                        </div>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showFilterModal && (
        <div
          style={{
            position: "fixed",
            top: "35px",
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
            boxSizing: "border-box",
            overflowY: "auto", // allows scrolling if viewport is small
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "100%",
              maxHeight: "90vh",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ margin: 0 }}>Filter</h5>
              <button
                onClick={() => setShowFilterModal(false)}
                style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <hr />

            {/* Modal body */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
              {/* First input */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", fontWeight: 500 }}>Task Name</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    
                    style={{
                      width: "100%",
                      padding: "10px 35px 10px 10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      fontSize: "14px",
                      color: "#888",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Second input */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", fontWeight: 500 }}>Assignee Name</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    
                    style={{
                      width: "100%",
                      padding: "10px 35px 10px 10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      fontSize: "14px",
                      color: "#888",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

            </div>

            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button style={{ padding: "10px 20px", width: "140px", border: "1px solid #1784A2", borderRadius: "5px", color: "#1784A2"}}>Reset</button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1784A2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  width: "140px",
                }}
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

export default Issue;
