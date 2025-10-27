import React, { useState } from "react";
import { Input, message } from "antd";
import { IoMdPerson } from "react-icons/io";
import { Button, Snackbar } from "@mui/material";
import { signup } from "./Login_services";
import { ApiEndPoints } from "../providers/api_endpoints";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const CreateAccount = () => {
  const [open, setOpen] = useState(false);
  const [isEmailuse, setisEmailuse] = useState("");
  const [signinData, setsigninData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleuserExist = (e: any) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleSignin = async (e: any) => {
    e.preventDefault();

    if (
      signinData.email === "" ||
      signinData.confirmPassword === "" ||
      signinData.password === ""||signinData.name===""
    ) {
        message.error("Required email,password,name and confirmpassword!")
    } else if (signinData.confirmPassword !== signinData.password) {
        message.error("Password and confirmpassword should be same!")
    } else {
      try {
        const response=await axios.post(`${API_URL}/api/auth/signup`,signinData)
        if (response.status) {
          navigate("/verification");
          sessionStorage.setItem(
            "userDetails",
            JSON.stringify({ email: signinData.email, token: response.data.token })
          );
          message.success("Otp sent to mail!");
        } else {
          message.error("Somrthing went wrong!")
        }
      } catch (error:any) {
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <section>
        <div className="row m-0">
          <div className="col-lg-6  log-right px-0">
            <div className="d-flex justify-content-center align-items-center">
              <img
                className="img-fluid login-img"
                src="/assests/Login/signup.png"
              />
            </div>
          </div>
          <div className="col-lg-6 px-0 d-flex justify-content-center align-items-center">
            <div>
              <div>
                <div className="text-center sign-log pt-3">
                  <img className="img-fluid" src="/assests/Login/log.png" />
                  <h2>Welcome</h2>
                  <p>Create your account</p>
                </div>

                <div className="d-flex justify-content-center ">
                  <div className="login-box">
                    <label className="py-2">Email Id</label>
                    <br />
                    <Input
                      size="large"
                      suffix={<IoMdPerson />}
                      placeholder="Enter your email id"
                      onChange={(e) =>
                        setsigninData({ ...signinData, email: e.target.value })
                      }
                      style={{ height: "45px", width: "480px" }}
                    />
                    <br />
                    {isEmailuse && (
                      <>
                        <span style={{ color: "red" }}>{isEmailuse}</span>
                        <br />
                      </>
                    )}
                    <label className="py-2">Name</label>
                    <br />
                    <Input
                      size="large"
                      suffix={<IoMdPerson />}
                      placeholder="Enter your name"
                      onChange={(e) =>
                        setsigninData({ ...signinData, name: e.target.value })
                      }
                      style={{ height: "45px", width: "480px" }}
                    />
                    <br />
                    <label className="py-2">Password</label>
                    <br />
                    <Input.Password
                      placeholder="Enter your password"
                      onChange={(e) =>
                        setsigninData({
                          ...signinData,
                          password: e.target.value,
                        })
                      }
                      style={{ height: "45px", width: "480px" }}
                    />
                    <br />
                    <label className="py-2">Confirm Password</label>
                    <br />
                    <Input.Password
                      placeholder="Enter your password"
                      style={{ height: "45px", width: "480px" }}
                      onChange={(e) =>
                        setsigninData({
                          ...signinData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <br />
                    <label className="py-2">Phone Number (Optional)</label>
                    <br />
                    <Input
                      size="large"
                      suffix={<IoMdPerson />}
                      placeholder="Enter your number"
                      style={{ height: "45px", width: "480px" }}
                      onChange={(e) =>
                        setsigninData({ ...signinData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="text-center py-3">
                  <Button
                    variant="contained"
                    className="create-btn1 mx-2"
                    onClick={handleSignin}
                  >
                    Create
                  </Button>
                  <p
                    className="py-2"
                    style={{ fontSize: "12px", fontWeight: 400 }}
                  >
                    Already have an account ?{" "}
                    <span
                      style={{ color: "#1784A2", cursor: "pointer" }}
                      onClick={handleuserExist}
                    >
                      Login{" "}
                    </span>
                  </p>
                  {/* <Button variant="contained" className='create-btn1 mx-2'>Login</Button> */}
                </div>
                <div>
                  <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message={
                      signinData.confirmPassword !== signinData.password
                        ? "Check Password and Confirm Password"
                        : "Required email,password,confirm password"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateAccount;
