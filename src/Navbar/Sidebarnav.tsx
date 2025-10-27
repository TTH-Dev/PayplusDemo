import { useEffect, useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography } from "@mui/material";
import { Sidebar } from "react-pro-sidebar";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { LuCalendarClock } from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import { SlSpeedometer } from "react-icons/sl";
import { IoHomeSharp, IoSettings } from "react-icons/io5";
import axios from "axios";
import { API_URL } from "../config";
import { FaCalendarAlt } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { FaCalendarCheck } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa";
import { RiCalendarFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";


interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactElement;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Item: React.FC<ItemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentURL = location.pathname;

  return (
    <MenuItem
      active={selected === title}
      onClick={() => {
        setSelected(title);
        navigate(to);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 5px",
        color: currentURL === to ? "#1784A2" : "#000",
        fontSize: "14px",
      }}
      icon={icon}
    >
      {icon}
      <Typography variant="caption" sx={{ mt: 0.5 }}>
        {title}
      </Typography>
    </MenuItem>
  );
};

const Sidebarnav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Home");

  const [userDataProfile, setuserDataProfile] = useState("");

  const [userRole, setUserRole] = useState("");

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming response contains: { role: "employee", organizationimage: "xyz.png" }
      setuserDataProfile(res.data.organizationimage);
      setUserRole(res.data.role);  // 👈 store role
    } catch (error: any) {
      console.log(error);
    }
  };


  useEffect(() => {
    getMe();
  }, []);

  return (
    <Box
      sx={{
        // "& .pro-sidebar-inner": {
        //   background:`red !important`,
        // },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu style={{ backgroundColor: "#F6F6F6" }}>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <div className="mb-4">
              <div className="text-center py-2">
                <img
                  alt="profile"
                  className="img-fluid"
                  style={{ width: "50px" }}
                  src={
                    userDataProfile
                      ? `${API_URL}/public/images/${userDataProfile}`
                      : "/assets/logo.png"
                  }
                  loading="lazy"
                />
              </div>
            </div>

            {/* ✅ If user is employee -> show ONLY Task */}
            {userRole === "employee" ? (
              <div className="sidebarBtn">
                <div className={`${selected === "emptask" ? "isActive" : ""}`}>
                  <div>
                    <Item
                      title="My Tasks"
                      to="/emptask"
                      icon={
                        <FaTasks
                          className={`${selected === "emptask" ? "dd" : "df"}`}
                        />
                      }
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="sidebarBtn">
                  <div className={`${selected === "Home" ? "isActive" : ""}`}>
                    <div>
                      <Item
                        title="Home"
                        to="/Home"
                        icon={
                          <IoHomeSharp
                            className={`${selected === "Home" ? "dd" : "df"}`}
                          />
                          
                        }
                        // icon={<i className={`${selected === "Home" ? "isActive fi fi-ss-house-chimney" : "fi fi-ss-house-chimney df"}`}></i>}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>

                <div className="sidebarBtn">
                  <div className={`${selected === "Team" ? "isActive" : ""}`}>
                    <div className="d-flex flex-column align-items-center">
                      <Item
                        title="Team"
                        to="/Team"
                        icon={
                          <MdGroups
                            className={`${selected === "Team" ? "dd" : "df"}`}
                          />
                        }

                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>

                <div className="sidebarBtn">
                  <div className={`${selected === "Schedule" ? "isActive" : ""}`}>
                    <div>
                      <Item
                        title="Schedule"
                        to="/Schedule"
                        icon={
                          <FaCalendarAlt
                            className={`${selected === "Schedule" ? "dd" : "df"}`}
                          />
                        }
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>

                <div className="sidebarBtn">
                  <div className={`${selected === "Attendance" ? "isActive" : ""}`}>
                    <div>
                      <Item
                        title="Attendance"
                        to="/Attendance"
                        icon={
                          <FaCalendarCheck
                            className={`${selected === "Attendance" ? "dd" : "df"}`}
                          />
                        }
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>
                <div className="sidebarBtn">
                  <div className={`${selected === "Payroll" ? "isActive" : ""}`}>
                    <div>
                      <Item
                        title="Payroll"
                        to="/Payroll"
                        icon={
                          <RiCalendarFill
                            className={`${selected === "Payroll" ? "dd" : "df"}`}
                          />
                        }
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>

                <div className="sidebarBtn">
                  <div className={`${selected === "Admintask" ? "isActive" : ""}`}>
                    <div>
                      <Item
                        title="Admintask"
                        to="/Admintask"
                        icon={
                          <FaTasks
                            className={`${selected === "Admintask" ? "dd" : "df"}`}
                          />
                        }
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>

                <div className="sidebarBtn">
                  <div className={`${selected === "Settings" ? "isActive" : ""}`}>
                    <div>
                      <Item
                        title="Settings"
                        to="Settings/OrganizationDetails"
                        icon={
                          <IoSettings
                            className={`${selected === "Settings" ? "dd" : "df"}`}
                          />
                        }
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>
                <div className="sidebarBtn">
                  <div
                    className={`${selected === "Subscription" ? "isActive" : ""}`}
                  >
                    <div>
                      <Item
                        title="Subscription"
                        to="/Subscription"
                        icon={
                          <SlSpeedometer
                            className={`${selected === "Subscription" ? "dd" : "df"
                              }`}
                          />
                        }
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>
                <div className="sidebarBtn">
                  <div
                    className={`${selected === "Sales" ? "isActive" : ""}`}
                  >
                    <div>
                      <Item
                        title="Sales"
                        to="/sales/customer"
                        icon={
                          <IoBag
                            className={`${selected === "Sales" ? "dd" : "df"
                              }`}
                          />
                        }
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Box>
          {/* <div className="text-center mt-5">
          <img
                  alt="profile"
                  className="img-fluid"
                  style={{ width: "50px" }}
                  src="/assests/logo.png"
                  loading="lazy"
                /></div> */}
        </Menu>

      </Sidebar>
    </Box>
  );
};

export default Sidebarnav;
