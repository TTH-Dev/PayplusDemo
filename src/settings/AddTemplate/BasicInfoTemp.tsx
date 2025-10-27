import { Button } from '@mui/material'
import { Input, Radio } from 'antd'
import React from 'react'
import { CiCalendarDate } from 'react-icons/ci'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { message, Upload, UploadProps } from "antd";
import { AiOutlineCloudUpload } from 'react-icons/ai'

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info: any) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const BasicinfoTemp = ({ onNext }: { onNext: () => void }) => {
  return (
    <>
    <section style={{padding:"-1rem" ,width:"100%"}}>
    <div>
                <div>
                  <h6 className="mb-0">Employee Info</h6>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div>
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Profile Photo
                      </label>
                      <div style={{ width: "400px" }} >
                        <Dragger {...props}>
                          <p className="ant-upload-drag-icon mb-0 ">
                            <AiOutlineCloudUpload
                              style={{ fontSize: "25px" }}
                            />
                          </p>
                          <p className="ant-upload-text">
                            Upload at maximum size of 10 MB{" "}
                          </p>
                        </Dragger>
                      </div>
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        First Name
                      </label>
                      <br />
                      <Input suffix={<IoPersonCircleOutline />} className='inp-org' />
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Email Id
                      </label>
                      <br />
                      <Input suffix={<IoPersonCircleOutline />}className='inp-org' />
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Date of birth
                      </label>
                      <br />
                      <Input suffix={<CiCalendarDate />} className='inp-org'/>
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Gender
                      </label>
                      <br />
                      <Radio.Group>
                        <Radio value={"male"}>Male</Radio>
                        <Radio value={"female"}>Female</Radio>
                      </Radio.Group>
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Work type
                      </label>
                      <br />
                      <Radio.Group>
                        <Radio value={"male"}>Full time</Radio>
                        <Radio value={"female"}>Part time</Radio>
                      </Radio.Group>
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Current Address
                      </label>
                      <br />
                      <Input className='inp-org'/>
                      <br />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Employee Id
                      </label>
                      <br />
                      <Input className='inp-org' />
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Last Name
                      </label>
                      <br />
                      <Input className='inp-org'/>
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Phone No
                      </label>
                      <br />
                      <Input className='inp-org'/>
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Blood Group
                      </label>
                      <br />
                      <Input className='inp-org'/>
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Marital status
                      </label>
                      <br />
                      <Radio.Group>
                        <Radio value={"married"}>Married</Radio>
                        <Radio value={"unmarried"}>Unmarried</Radio>
                      </Radio.Group>
                      <br />
                      <label
                        className="py-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#666666",
                        }}
                      >
                        Permanent Address
                      </label>
                      <br />
                      <Input className='inp-org'/>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="py-3 d-flex justify-content-between align-items-center">
                  <a
                    className="skipbtn
              "
                  >
                    Cancel
                  </a>
                  <div>
                    
                  <Button variant="contained" className="nextBtn" onClick={onNext}>
                    Next
                  </Button>
                  </div>
                </div>
              </div>
    </section>
    </>
  )
}

export default BasicinfoTemp