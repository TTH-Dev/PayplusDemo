import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import { FaQuestionCircle } from "react-icons/fa";
import "./Home.css";
import { FaBell } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { ImCross } from "react-icons/im";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Header = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorE2, setAnchorE2] = useState<null | HTMLElement>(null);
  const [anchorE3, setAnchorE3] = useState<null | HTMLElement>(null);
  const [anchorE4, setAnchorE4] = useState<null | HTMLElement>(null);
  const [isHighlight, setIsHighlight] = useState({
    ismessage: false,
    isfaq: false,
    isNotify: false,
    isProfile: false,
  });
  const open = Boolean(anchorEl);
  const openNotify = Boolean(anchorE2);
  const openHelp = Boolean(anchorE3);
  const openMessage = Boolean(anchorE4);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsHighlight({ ...isHighlight, isProfile: true });
  };

  const handleNotification = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget);
    setIsHighlight({ ...isHighlight, isNotify: true });
  };

  const handleHelp = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE3(event.currentTarget);
    setIsHighlight({ ...isHighlight, isfaq: true });
  };
  const handleMessage = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE4(event.currentTarget);
    setIsHighlight({ ...isHighlight, ismessage: true });
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsHighlight({ ...isHighlight, isProfile: false });
  };
  const handleNotifyclose = () => {
    setAnchorE2(null);
    setIsHighlight({ ...isHighlight, isNotify: false });
  };
  const handleHelpclose = () => {
    setAnchorE3(null);
    setIsHighlight({ ...isHighlight, isfaq: false });
  };

  const handleMessageclose = () => {
    setAnchorE4(null);
    setIsHighlight({ ...isHighlight, ismessage: false });
  };

  const handleUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        console.log("Selected file:", files[i]);
      }
    }
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // clear token/session
    navigate("/");   // 👈 navigate to login route
    window.dispatchEvent(new Event("storage")); // optional if you sync logout across tabs
  };



const [user,setUser]=useState({
  email:"",
  id:"",
  name:"",
  organizationimage:""
})
  const getMe=async()=>{
    const token=localStorage.getItem("authtoken")
    try{
      const res=await axios.get(`${API_URL}/api/auth/getMe`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setUser(res.data)
      
    }catch(error){
      console.log(error);
      
    }
  }

  useEffect(()=>{
    getMe()
  },[])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            {/* <img className='img-fluid' src='assests/Payplus logo-05 1.png' style={{width:"69px"}}/> */}
         
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Tooltip title="Message">
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  onClick={handleMessage}
                  className={`${isHighlight.ismessage ? "highlight" : ""}`}
                  aria-controls={openHelp ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openHelp ? "true" : undefined}
                >
                  <Badge>
                    <BiSolidMessageDetail
                      className="headerIcons"
                      style={{ fontSize: "20px" }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Help">
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  onClick={handleHelp}
                  className={`${isHighlight.isfaq ? "highlight" : ""}`}
                  aria-controls={openHelp ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openHelp ? "true" : undefined}
                >
                  <Badge>
                    <FaQuestionCircle
                      className="headerIcons"
                      style={{ fontSize: "20px" }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notification">
                <IconButton
                  className={`${isHighlight.isNotify ? "highlight" : ""}`}
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={handleNotification}
                  aria-controls={openNotify ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openNotify ? "true" : undefined}
                >
                  <Badge badgeContent={17} color="error">
                    <FaBell
                      className="headerIcons"
                      style={{ fontSize: "20px" }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton
                  size="large"
                  aria-label=""
                  className={`${isHighlight.isProfile ? "highlight" : ""}`}
                  color="inherit"
                  onClick={handleClick}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Badge>
                    <IoPerson
                      className="headerIcons"
                      style={{ fontSize: "20px" }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Profile Settings */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div style={{ height: "auto" }}>
          <div className="d-flex justify-content-between px-3">
            <div className="d-flex justify-content-center align-items-center">
              <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Profile</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <ImCross onClick={handleClose} style={{ cursor: "pointer" }} />
            </div>
          </div>
          <hr className="m-0" />
          <div className="p-2">
            <div className="d-flex justify-content-center align-items-center">
              <img
                className="img-fluid"
             alt="img"
             loading="lazy"
             src={`${API_URL}/public/images/${user.organizationimage}`||""}
                style={{ width: "25%", borderRadius: "50%" }}
              />
            </div>
            <div className="text-center p-2">
              <h5 className="m-0">{user.name}</h5>
              <p>{user.email}</p>
            </div>
          </div>
          <MenuItem onClick={handleClose}>
            <BiSolidEditAlt />
            <Link to="/Settings/OrganizationDetails" className="px-2" style={{ fontWeight: "600",textDecoration:"none",color:"#000" }}>
              Edit profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <IoMdSettings />
            <Link to="/Settings/OrganizationDetails" className="px-2" style={{ fontWeight: "600",textDecoration:"none",color:"#000" }}>
              Setting
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogout} className="mb-3">
            <IoMdLogOut />
            <span className="px-2" style={{ fontWeight: "600",color:"#000" }}>
              Logout
            </span>
          </MenuItem>
        </div>
      </Menu>

      {/* Notification */}

      <Menu
        anchorEl={anchorE2}
        id="account-menu"
        open={openNotify}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div style={{ height: "48vh" }}>
          <div className="d-flex justify-content-between px-3">
            <div className="d-flex justify-content-center align-items-center">
              <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                Notification
              </h2>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <ImCross
                onClick={handleNotifyclose}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <hr className="m-0" />
          <div className="p-4">
            <div className="d-flex justify-content-center align-items-center pt-3">
              <img
                className="img-fluid"
                src="/assests/No notification.png"
                style={{ width: "60%" }}
              />
            </div>
            <div className="text-center p-3">
              <h5 className="m-0">No Notification !</h5>
              <p style={{ fontSize: "10px" }}>
                Enjoy a distraction-free day and focus on your tasks with
                uninterrupted.
              </p>
            </div>
          </div>
        </div>
      </Menu>

      {/* Help */}

      <Menu
        anchorEl={anchorE3}
        id="account-menu"
        open={openHelp}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div style={{ height: "48vh" }}>
          <div className="d-flex justify-content-between px-3">
            <div className="d-flex justify-content-center align-items-center">
              <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                Help & Support
              </h2>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <ImCross
                onClick={handleHelpclose}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <hr className="m-0" />
          <div className="p-4">
            <h4>FAQ</h4>
            <p style={{ fontSize: "12px" }} className="mb-0">
              Get the some of the common occurring solution to your problem
              while using our payroll{" "}
            </p>
            <a
              style={{
                fontSize: "12px",
                textDecorationStyle: "dotted",
                color: "#000",
              }}
              href="#"
            >
              View
            </a>
            <h4 className="pt-4">Video Demo</h4>
            <p style={{ fontSize: "12px" }} className="mb-0">
              Get a tutorial guidance from our video
            </p>
            <a
              style={{
                fontSize: "12px",
                textDecorationStyle: "dotted",
                color: "#000",
              }}
              href="#"
            >
              View
            </a>
          </div>
        </div>
      </Menu>

      {/* Message */}

      <Menu
        anchorEl={anchorE4}
        id="account-menu"
        open={openMessage}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="d-flex justify-content-between px-3">
          <div className="d-flex justify-content-center align-items-center">
            <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Message</h2>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <ImCross
              onClick={handleMessageclose}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <hr className="m-0" />
        <div className="p-4" style={{ height: "48vh" }}>
          <div style={{ height: "35vh" }}></div>
          <div className="d-flex justify-content-between align-items-center">
            <InputGroup className="mb-3">
              <Form.Control
                aria-label="Recipient's text"
                aria-describedby="basic-addon2"
              />
              <Form.Control
                ref={inputRef}
                type="file"
                accept="image/*" // Specify accepted file types if needed
                multiple // Allow multiple file selection
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                style={{ display: "none" }}
                onChange={handleFileSelection} // Handle file selection
              />
              <Button id="button-addon2" onClick={handleUploadButtonClick}>
                <AiOutlineCloudUpload />
              </Button>
            </InputGroup>
            <Button id="sharebtn" className="mb-3">
              <RiSendPlaneFill />
            </Button>
          </div>
        </div>
      </Menu>
    </>
  );
};

export default Header;
