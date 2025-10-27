import React, { useEffect, useState } from 'react'
import "./Login.css"
import { Input, message } from 'antd'
import { IoMdPerson } from "react-icons/io";
import { Box, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signup } from './Login_services';
import { ApiEndPoints } from '../providers/api_endpoints';
import axios from 'axios';
import { API_URL } from '../config';

const Login = () => {
    const [open, setOpen] = useState(false);
    const [iserrormed,setiserrormeg]=useState("")
    const [userData,setuserData]=useState({
        email:"",
        password:""
    })

    const navigate=useNavigate()

    const handleforgetPass=async()=>{
        if(!userData.email){
            return message.error("Fillup email!")
        }
        try {
            const response=await axios.post(`${API_URL}/api/auth/forgotPassword`,{email:userData.email})
            message.success(response?.data?.message);
          } catch (error:any) {
              console.log(error);
              message.error(error.response.data.message||"Something went wrong!")
          }
        
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };


    const handleLogin=async(e:any)=>{
        e.preventDefault()
        if(userData.email===""||userData.password===""){
           message.error("Email and password required!")
        }
        else{
            try {
                const response=await axios.post(`${API_URL}/api/auth/login`,userData)
                if(response.data&&response.data.token!==null){
                    localStorage.setItem("authtoken",response.data.token)
                    navigate("/")
                    window.dispatchEvent(new Event("storage"));
                    message.success("Login successfull")
                }
                else{
                    message.error("Something went wrong!")
                }
              } catch (error:any) {
                  console.log(error);
                  message.error(error?.response?.data?.message||"Something went wrong!")
              }
        }
       
    }

    return (
        <>
            <section style={{height:"100vh"}}>
                <div className='row m-0' style={{height:"100vh"}}>
                    <div className='col-lg-6 log-right px-0'>
                        <div className='d-flex justify-content-center align-items-center'>
                            <img className='img-fluid login-img' src='/assests/Login/login.png'/>
                        </div>
                    </div>
                    <div className='col-lg-6 px-0 d-flex justify-content-center align-items-center'>
                        <div>
                            <div>
                                <div className='text-center sign-log pt-3'>
                                    <img className='img-fluid' src='/assests/Login/log.png'/>
                                    <h2>Welcome</h2>
                                    <p>Enter your valid Email id and password </p>
                                </div>
                                <div className='d-flex justify-content-center '>
                                    <div className='login-box'>
                                        <label className='py-2'>Email Id</label><br/>
                                        <Input size="large" onChange={(e)=>setuserData({...userData,email:e.target.value})} suffix={<IoMdPerson />} placeholder='Enter your email id' style={{ height: "45px",width:"480px" }} /><br/>
                                        <label className='py-2'>Password</label><br/>
                                        <Input.Password placeholder="Enter your password" onChange={(e)=>setuserData({...userData,password:e.target.value})} style={{ height: "45px",width:"480px"  }}/><br/>
                                        <div className='text-end'>
                                          <p className='forgetpass' onClick={handleforgetPass}>Forget password</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className='text-center pt-3'>
                                    <Button variant="contained" className='create-btn' onClick={handleLogin}>Login</Button>
                                </div>
                                <div>
                                        <Snackbar
                                            open={open}
                                            autoHideDuration={5000}
                                            onClose={handleClose}
                                            message={open&&"Enter Email and Password"}
                                        />
                                    </div>
                                    <div>
                                        <Snackbar
                                            open={iserrormed!==""}
                                            autoHideDuration={5000}
                                            onClose={handleClose}
                                            message={iserrormed!==""&&"Invaild Email or Password"}
                                        />
                                    </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </section> 
        </>
    )
}

export default Login


