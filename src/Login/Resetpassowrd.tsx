import { Button, Snackbar } from "@mui/material";
import { Input, message } from "antd";
import React, { useState } from "react";
import { signup } from "./Login_services";
import { ApiEndPoints } from "../providers/api_endpoints";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Resetpassowrd = () => {
  const { id } = useParams();

  const [resetPassword, setResetPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleresetPassword = async () => {
    if (
      resetPassword.password === "" ||
      (resetPassword.confirmPassword === "" &&
        resetPassword.password !== resetPassword.confirmPassword)
    ) {
      message.error("Check password and confirm password!");
    } else {
      try {
        const response = await axios.patch(
          `${API_URL}/api/auth/resetPassword/${id}`,
          { password: resetPassword.password }
        );
        message.success("Password updated successfully!");
        navigate("/login");
      } catch (error: any) {
        console.log(error);
        message.error(error.response.data.message || "Something went wrong!");
      }
    }
  };

  return (
    <>
      <section style={{ height: "100vh" }}>
        <div className="row m-0" style={{ height: "100vh" }}>
          <div className="col-lg-6 log-right px-0">
            <div className="d-flex justify-content-center align-items-center">
              <img
                className="img-fluid login-img"
                src="/assests/Login/reset.png"
              />
            </div>
          </div>
          <div className="col-lg-6 px-0 d-flex justify-content-center align-items-center">
            <div>
              <div>
                <div className="text-center sign-log pt-3">
                  <img className="img-fluid" src="/assests/Login/log.png" />
                  <h2>Reset Password</h2>
                  <p>You can reset your password</p>
                </div>
                <div className="d-flex justify-content-center ">
                  <div className="login-box">
                    <label className="py-2">New password</label>
                    <br />
                    <Input.Password
                      placeholder="Enter new password"
                      onChange={(e) =>
                        setResetPassword({
                          ...resetPassword,
                          password: e.target.value,
                        })
                      }
                      style={{ height: "45px", width: "480px" }}
                    />
                    <br />
                    <label className="py-2">Confirm Password</label>
                    <br />
                    <Input.Password
                      placeholder="Enter confirm password"
                      onChange={(e) =>
                        setResetPassword({
                          ...resetPassword,
                          confirmPassword: e.target.value,
                        })
                      }
                      style={{ height: "45px", width: "480px" }}
                    />
                    <br />
                  </div>
                </div>
                <div className="text-center pt-3">
                  <Button
                    variant="contained"
                    className="create-btn"
                    onClick={handleresetPassword}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Resetpassowrd;
