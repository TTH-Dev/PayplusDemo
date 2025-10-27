import React from 'react'
import { DatePicker, Input, Select } from 'antd';
import { UserOutlined,MailOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';

const EmployeesetUp = () => {
    const handleDepartment = (value: string) => {
        console.log(`selected ${value}`);
      };
    return (
        <>
           <section className='p-4' style={{marginLeft:"95px"}}>
            <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "600",cursor:"pointer" }} className='m-0 p-1' >Employee setup</h2>
            </div><hr className='m-0' />
        
            <section>
                <h6 className='pt-3'>Employee Info</h6>
                <div className='d-flex align-items-center pt-2'>
                    <div style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Full Name</label>
                        <Input size="large"  suffix={<UserOutlined />} style={{height:"45px"}}/>
                    </div>
                    <div style={{width:"481px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Last Name</label>
                        <Input size="large" suffix={<UserOutlined />} style={{height:"45px"}}/>
                    </div>
                </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Gender</label>
                        <Input size="large"  suffix={<UserOutlined />} style={{height:"45px"}}/>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Social Security Number</label>
                        <Input.Password  style={{height:"45px"}}/>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Date of birth</label><br/>
                        <DatePicker placeholder='' style={{width:"100%",height:"45px"}}/>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Email Id </label>
                        <Input size="large"  suffix={<MailOutlined />} required  style={{height:"45px"}}/>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Employee Id</label>
                        <Input size="large"  suffix={<MailOutlined />} style={{height:"45px"}}/>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Employee Id</label>
                        <Input size="large"  suffix={<MailOutlined />} style={{height:"45px"}}/>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Work mode</label><br/>
                            <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Work from home</span>
                            <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Work from office</span>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Work type</label><br/>
                            <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Full time</span>
                            <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Part time</span>
                    </div>
                    <div className='pt-2' style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Payment type</label><br/>
                            <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Daily</span>
                            <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Weekly</span>
                            <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Monthly</span>
                    </div>
                    <div className='d-flex align-items-center pt-2'>
                    <div style={{width:"481px",marginRight:"10px"}}>
                        <label className='pb-2' style={{fontSize:"14px"}}>Department</label><br/>
                            <Select
                                style={{ width: "100%",height:45 }}
                                onChange={handleDepartment}
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                    { value: 'lucy', label: 'Lucy' },
                                    { value: 'Yiminghe', label: 'yiminghe' },
                                    { value: 'disabled', label: 'Disabled'},
                                ]}
                            />
                    </div>
                    <div style={{width:"481px"}} className='pt-2'>
                        <label className='pb-2' style={{fontSize:"14px"}}>Rate</label>
                        <Input size="large" style={{height:"45px"}}/>
                    </div>
                 
                </div>
                <div style={{width:"481px",marginRight:"10px"}} className='pt-2'>
                    <label className='pb-2' style={{fontSize:"14px"}}>Over time salary</label>
                    <Input size="large" style={{height:"45px"}}/>
                </div>
                <div style={{width:"481px",marginRight:"10px"}} className='pt-2'>
                    <label className='pb-2' style={{fontSize:"14px"}}>TAX</label><br/>
                    <input type='checkbox' style={{width:"20px",height:"20px"}}/><span className='mx-2' style={{fontSize:"0.9rem",fontWeight:600}}>Employee tax</span>
                </div>

                <div className='row pt-3 pb-5'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <a style={{fontSize:"14px"}}>Cancel</a>
                        <Button variant="contained" className='nextBtn'>
                            Save
                        </Button>
                    </div>
                </div>
            </section>
            
            </section>
 
        </>
    )
}

export default EmployeesetUp
