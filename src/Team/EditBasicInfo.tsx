import { Button } from '@mui/material'
import { DatePicker, Input, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { CiCalendarDate } from 'react-icons/ci'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { message, Upload, UploadProps } from "antd";
import { AiOutlineCloudUpload } from 'react-icons/ai'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { API_URL } from '../config'
import dayjs from 'dayjs'

const { Dragger } = Upload;


const EditBasicinfo = ({ onNext }: { onNext: (data: any) => void }) => {

  const { id } = useParams(); // Extract 'id' from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [basicDetails, setBasicDetails] = useState({
    companyId: "",
    profileimage: null as File | null,
    firstName: "",
    lastName: "",
    emailId: "",
    dateOfBirth: new Date(),
    gender: "",
    workType: "",
    currentAddress: "",
    phoneNo: "",
    bloodGroup: "",
    maritalStatus: "",
    permanentAddress: "",
  });

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return;
      }
      setBasicDetails({ ...basicDetails, profileimage: file });
      return false;
    },
    onRemove: () => {
      setBasicDetails({ ...basicDetails, profileimage: null });
    },
  };

  const handleNext = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const formData = new FormData();
      if (basicDetails.profileimage) {
        formData.append("profileimage", basicDetails.profileimage);
      }
      formData.append("companyId", basicDetails.companyId);
      formData.append("firstName", basicDetails.firstName);
      formData.append("lastName", basicDetails.lastName);
      formData.append("emailId", basicDetails.emailId);
      formData.append("dateOfBirth", basicDetails.dateOfBirth.toString());
      formData.append("gender", basicDetails.gender);
      formData.append("workType", basicDetails.workType);
      formData.append("currentAddress", basicDetails.currentAddress);
      formData.append("phoneNo", basicDetails.phoneNo);
      formData.append("bloodGroup", basicDetails.bloodGroup);
      formData.append("maritalStatus", basicDetails.maritalStatus);
      formData.append("permanentAddress", basicDetails.permanentAddress);

      onNext(basicDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployee()
    } catch (error: any) {
      console.log(error);
    }
  };


  const fetchEmployee = async () => {
    const token = localStorage.getItem("authtoken");

    try {
      const response = await axios.get(`${API_URL}/api/employee/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data; 
      setBasicDetails(data);
    } catch (err) {
      setError('Failed to fetch employee data.');
    }
  };

  useEffect(() => {
    getMe();
  }, []);



  const handleInputChange = (field: string, value: string | null) => {
    setBasicDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <section>
        <div>
          <div>
            <h6 className="mb-0">Employee Info</h6>
          </div>
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
          <div style={{ width: "481px" }}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon mb-0">
                <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
              </p>
              <p className="ant-upload-text">
                Upload at maximum size of 10 MB{" "}
              </p>
            </Dragger>
            {basicDetails.profileimage && (
              <>
                <img
                  style={{ width: "150px", height: "150px" }}
                  className="img-fluid"
                  src={`${API_URL}/public/images/${basicDetails.profileimage}`}

                />
              </>
            )}
            {basicDetails.profileimage && basicDetails.profileimage instanceof Blob && (
              <img style={{ width: "150px" }} src={URL.createObjectURL(basicDetails.profileimage)} alt="Profile" />
            )}              </div>
          <div className="row mx-0">
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
                  First Name <span style={{color:"red"}}>*</span>
                </label>
                <br />
                <Input
                  value={basicDetails.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  suffix={<IoPersonCircleOutline />}
                />
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Email Id <span style={{color:"red"}}>*</span>
                </label>
                <br />
                <Input
                  suffix={<IoPersonCircleOutline />}
                  value={basicDetails.emailId}
                  onChange={(e) => handleInputChange("emailId", e.target.value)}
                />
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
                <DatePicker
                  value={
                    basicDetails.dateOfBirth
                      ? dayjs(basicDetails.dateOfBirth)
                      : null
                  }
                  onChange={(date, dateString) => {
                    handleInputChange(
                      "dateOfBirth",
                      date ? date.format("YYYY-MM-DD") : null
                    );
                  }}
                />

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
                <Radio.Group
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  value={basicDetails.gender}
                >
                  <Radio value={"Male"}>Male</Radio>
                  <Radio value={"Female"}>Female</Radio>
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
                  Work type <span style={{color:"red"}}>*</span>
                </label>
                <br />
                <Radio.Group
                  onChange={(e) =>
                    handleInputChange("workType", e.target.value)
                  }
                  value={basicDetails.workType}
                >
                  <Radio value={"Full-time"}>Full time</Radio>
                  <Radio value={"Part-time"}>Part time</Radio>
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
                <Input
                  value={basicDetails.currentAddress}
                  onChange={(e) =>
                    handleInputChange("currentAddress", e.target.value)
                  }
                />
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
                  Last Name
                </label>
                <br />
                <Input
                  value={basicDetails.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Phone No <span style={{color:"red"}}>*</span>
                </label>
                <br />
                <Input
                  value={basicDetails.phoneNo}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                />
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
                <Input
                  value={basicDetails.bloodGroup}
                  onChange={(e) =>
                    handleInputChange("bloodGroup", e.target.value)
                  }
                />
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
                <Radio.Group
                  onChange={(e) =>
                    handleInputChange("maritalStatus", e.target.value)
                  }
                  value={basicDetails.maritalStatus}
                >
                  <Radio value={"Married"}>Married</Radio>
                  <Radio value={"Unmarried"}>Unmarried</Radio>
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
                <Input
                  value={basicDetails.permanentAddress}
                  onChange={(e) =>
                    handleInputChange("permanentAddress", e.target.value)
                  }
                />
                <br />
              </div>
            </div>
          </div>
          <div className="py-3 text-end">
            {/* <a
              className="skipbtn
                  "
            >
              Cancel
            </a> */}
            <Button
              variant="contained"
              className="nextBtn me-3"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};


export default EditBasicinfo;