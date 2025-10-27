import React, { useEffect, useState } from 'react'
import { Input as BaseInput } from '@mui/base/Input';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { Box, Button, Snackbar } from '@mui/material';
import { signup } from './Login_services';
import { ApiEndPoints } from '../providers/api_endpoints';
import { useNavigate } from 'react-router-dom';

const ForgetpassOTP = () => {

    const [otp, setOtp] = useState('');
    const [seconds, setSeconds] = useState(25);
    const [isActive, setIsActive] = useState(true);
    
    const [open, setOpen] = useState(false);


    const navigate=useNavigate()

    const formatTime = (secs:any) => {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };
    
      const handleResend = async(e:any) => {
        e.preventDefault()
        setSeconds(25);
        setIsActive(true);
        try {
            let forgetPassemail=localStorage.getItem("forgetpassEmail")
            const response=await signup(ApiEndPoints("resendOTP"), {email:forgetPassemail});
            console.log(response.tempToken,"response.tempToken");
            
            localStorage.setItem("forgetpassToken",response.tempToken)
          } catch (error) {
              console.log(error);
              alert("error")
          }
      };

      const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      const handleForgetPassotp=async(e:any)=>{
        e.preventDefault()
        let forgetToken=localStorage.getItem("forgetpassToken")
        console.log(forgetToken,otp);
        
        if(otp&&forgetToken){
          try {
            const response=await signup(ApiEndPoints("signupOTPverify"), {tempToken:forgetToken?forgetToken:"",otp:otp});
            if(response.resultStatus){
              navigate("/reset-password")
            }
            else{
              setOpen(true)
            }
          } catch (error) {
              console.log(error);
              alert("error")
          }
        }
        else{
            alert("Enter your OTP")
        }
    }



      useEffect(() => {
        let timerId: string | number | NodeJS.Timeout | undefined;
        if (isActive && seconds > 0) {
          timerId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1);
          }, 1000);
        } else if (seconds === 0) {
          setIsActive(false);
        }
        return () => clearInterval(timerId); 
      }, [isActive, seconds]);
    return (
        <>
               <section>
                <div className='row m-0'>
                    <div className='col-lg-6 log-right px-0'>
                        <div className='d-flex justify-content-center align-items-center'>
                            <img className='img-fluid login-img' src='/assests/Login/otp.png'/>
                        </div>
                    </div>
                    <div className='col-lg-6 px-0 d-flex justify-content-center align-items-center'>
                        <div>
                            <div className='d-flex justify-content-between flex-column' style={{height:"60vh"}}>
                                <div className='text-center sign-log pt-3'>
                                    <img className='img-fluid' src='/assests/Login/log.png'/>
                                    <h2>One Time Password</h2>
                                    <p>Enter the 4 digits OTP send to your email id</p>
                                    <div>
                                      <Box
                                          sx={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              gap: 2,
                                          }}
                                          >
                                          <OTP separator={<span>-</span>} value={otp} onChange={setOtp} length={4} />
                                      </Box>
                                    </div>
                                    <div className='d-flex justify-content-between align-items center timer'>
                                      <div><p className='mb-0'>{formatTime(seconds)}</p></div>
                                      <div><p className='mb-0 resend' onClick={handleResend}>Resend</p></div>
                                    </div>
                                </div>
                                <div className='text-center pt-3'>
                                    <Button variant="contained" className='create-btn' onClick={handleForgetPassotp}>Done</Button>
                                </div>
                                <div>
                                        <Snackbar
                                            open={open}
                                            autoHideDuration={5000}
                                            onClose={handleClose}
                                            message={"Otp Verification Failed"}
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

export default ForgetpassOTP


// OPT Functions

function OTP({
    separator,
    length,
    value,
    onChange,
  }: {
    separator: React.ReactNode;
    length: number;
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
  }) {
    const inputRefs = React.useRef<HTMLInputElement[]>(new Array(length).fill(null));
  
    const focusInput = (targetIndex: number) => {
      const targetInput = inputRefs.current[targetIndex];
      if (targetInput) targetInput.focus();
    };
  
    const selectInput = (targetIndex: number) => {
      const targetInput = inputRefs.current[targetIndex];
      if (targetInput) targetInput.select();
    };
  
    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
      currentIndex: number,
    ) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) {
            focusInput(currentIndex - 1);
            selectInput(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < length - 1) {
            focusInput(currentIndex + 1);
            selectInput(currentIndex + 1);
          }
          break;
        case 'Delete':
        case 'Backspace':
          event.preventDefault();
          if (currentIndex > 0) {
            focusInput(currentIndex - 1);
            selectInput(currentIndex - 1);
          }
          onChange((prevOtp) => prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1));
          break;
        default:
          break;
      }
    };
  
    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      currentIndex: number,
    ) => {
      const currentValue = event.target.value;
      onChange((prev) => {
        const otpArray = prev.split('');
        otpArray[currentIndex] = currentValue[currentValue.length - 1] || ' ';
        return otpArray.join('');
      });
      if (currentValue !== '' && currentIndex < length - 1) focusInput(currentIndex + 1);
    };
  
    const handleClick = (
      event: React.MouseEvent<HTMLInputElement, MouseEvent>,
      currentIndex: number,
    ) => {
      selectInput(currentIndex);
    };
  
    const handlePaste = (
      event: React.ClipboardEvent<HTMLInputElement>,
      currentIndex: number,
    ) => {
      event.preventDefault();
      const clipboardData = event.clipboardData;
      if (clipboardData?.types.includes('text/plain')) {
        let pastedText = clipboardData.getData('text/plain');
        pastedText = pastedText.substring(0, length).trim();
        const otpArray = value.split('');
        for (let i = currentIndex; i < length; i++) {
          otpArray[i] = pastedText[i - currentIndex] || ' ';
        }
        onChange(otpArray.join(''));
      }
    };
  
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {new Array(length).fill(null).map((_, index) => (
          <React.Fragment key={index}>
            <BaseInput
              slots={{ input: InputElement }}
              aria-label={`Digit ${index + 1} of OTP`}
              slotProps={{
                input: {
                  ref: (ele) => {
                    inputRefs.current[index] = ele!;
                  },
                  onKeyDown: (event) => handleKeyDown(event, index),
                  onChange: (event) => handleChange(event, index),
                  onClick: (event) => handleClick(event, index),
                  onPaste: (event) => handlePaste(event, index),
                  value: value[index] || '',
                },
              }}
            />
            {index === length - 1 ? null : separator}
          </React.Fragment>
        ))}
      </Box>
    );
  }

  const InputElement = styled('input')(({ theme }: { theme: Theme }) => ({
    width: '40px',
    fontFamily: 'IBM Plex Sans, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    padding: '8px 0px',
    borderRadius: '8px',
    textAlign: 'center',
    color: theme.palette.mode === 'dark' ? '#C7D0DD' : '#434D5B',
    background: theme.palette.mode === 'dark' ? '#303740' : '#fff',
    border: `1px solid ${theme.palette.mode === 'dark' ? '#303740' : '#E5EAF2'}`,
    boxShadow: `0px 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'
    }`,
    '&:hover': {
      borderColor: theme.palette.mode === 'dark' ? '#0072E5' : '#80BFFF',
    },
    '&:focus': {
      borderColor: theme.palette.mode === 'dark' ? '#0072E5' : '#80BFFF',
      boxShadow: `0 0 0 3px ${
        theme.palette.mode === 'dark' ? 'rgba(0,114,229,0.5)' : 'rgba(128,191,255,0.5)'
      }`,
    },
    '&:focus-visible': {
      outline: 0,
    },
  }));