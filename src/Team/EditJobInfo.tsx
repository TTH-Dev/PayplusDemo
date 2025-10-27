import { Button } from "@mui/material";
import { DatePicker, Input, Radio, Select, UploadProps } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { CiCalendarDate } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { message, Upload } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import dayjs from "dayjs";

const { Dragger } = Upload;

const EditJobinfo = ({
  onNext,
  onPrev,
}: {
  onNext: (data: any) => void;
  onPrev: () => void;
}) => {
  const { id } = useParams(); // Extract 'id' from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobInfoData, setJobinforData] = useState({
    resume: null as File | null,
    department: "",
    position: "",
    paymentType: "",
    paymentAmount: 0,
    workMode: "",
    branch: "",
    jobCategory: "",
    previousSalary: 0,
    overtimeRate: 0,
    attendanceLocation: "",
    dateOfJoining: "",
    dailyWorkHr: "",
    overtimePerHr: 0,
  });

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      setJobinforData({ ...jobInfoData, resume: file });
      return false;
    },
    onRemove: () => {
      setJobinforData({ ...jobInfoData, resume: null });
    },
  };

  const handleNext = () => {
    const formData = new FormData();

    if (jobInfoData.resume) {
      formData.append("resume", jobInfoData.resume);
    }
    formData.append("department", jobInfoData.department);
    formData.append("position", jobInfoData.position);
    formData.append("paymentType", jobInfoData.paymentType);
    formData.append("paymentAmount", jobInfoData.paymentAmount.toString());
    formData.append("workMode", jobInfoData.workMode);
    formData.append("branch", jobInfoData.branch);
    formData.append("jobCategory", jobInfoData.jobCategory);
    formData.append("previousSalary", jobInfoData.previousSalary.toString());
    formData.append("overtimeRate", jobInfoData.overtimeRate.toString());
    formData.append("attendanceLocation", jobInfoData.attendanceLocation);
    formData.append("dateOfJoining", jobInfoData.dateOfJoining.toString());
    formData.append("dailyWorkHr", jobInfoData.dailyWorkHr);
    formData.append("overtimePerHr", jobInfoData.overtimePerHr.toString());

    onNext(jobInfoData);
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await getSelect(res.data.companyId);
      await fetchEmployee();
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchEmployee = async () => {
    const token = localStorage.getItem("authtoken");

    try {
      const response = await axios.get(
        `${API_URL}/api/employee/getById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data; 
      setJobinforData(data.jobInfo);
      setLoading(false); 
    } catch (err) {
      setError("Failed to fetch employee data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);


  const [dmValueBranches, setdmValueBranches] = useState<any>([]);
  const [dmValuePosition, setdmValuePosition] = useState([]);
  const [dmValueDepartment, setdmValueDepartment] = useState([]);
  const [dmValuejobCategories, setdmValuejobCategories] = useState([]);
  const [dmValueLocation, setdmValueLocation] = useState([]);

  const getSelect = async (CompanyId: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      // Make the API call to get pending location change requests
      const response = await axios.get(
        `${API_URL}/api/company/dmDeatails?companyId=${CompanyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setdmValueBranches(Array.from(new Set(response.data.branches)));
      setdmValueDepartment(response.data.departments);
      setdmValuePosition(Array.from(new Set(response.data.Positions)));
      setdmValuejobCategories(Array.from(new Set(response.data.jobCategories)));
      setdmValueLocation(Array.from(new Set(response.data.attLocation)));
    } catch (err) {
      console.log(err);
    }
  };

  const generateOptions = (
    data: string[]
  ): { value: string; label: string }[] => {
    // Use a Set to filter out duplicates, then map to the required structure
    const uniqueData = Array.from(new Set(data));

    return uniqueData.map((item: string) => ({
      value: item,
      label: item,
    }));
  };

  return (
    <>
      <div>
        <div>
          <h6 className="mb-0">Job Info</h6>
        </div>
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
                Resume <span style={{color:"red"}}>*</span>
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
                {jobInfoData.resume && (
                  <>
                    <img
                      style={{ width: "150px", height: "150px" }}
                      className="img-fluid"
                      src={`${API_URL}/public/images/${jobInfoData.resume}`}
                      alt="Profile"
                    />
                  </>
                )}
              </div>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Department <span style={{color:"red"}}>*</span>
              </label>
              <br />

              <Select
                className="input-dd"
                style={{ width: 450, height: 40 }}
                value={jobInfoData.department}
                onChange={(value) =>
                  setJobinforData({
                    ...jobInfoData,
                    department: value,
                  })
                }
                options={generateOptions(dmValueDepartment)}
              />

              {/* <Input
                value={jobInfoData.department}
                onChange={(e) =>
                  setJobinforData({
                    ...jobInfoData,
                    department: e.target.value,
                  })
                }
              /> */}
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Position <span style={{color:"red"}}>*</span>
              </label>
              <br />
              <Input
                value={jobInfoData.position}
                onChange={(e) =>
                  setJobinforData({ ...jobInfoData, position: e.target.value })
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
                Payment type <span style={{color:"red"}}>*</span>
              </label>
              <br />
              <Radio.Group
                value={jobInfoData.paymentType}
                onChange={(e) =>
                  setJobinforData({
                    ...jobInfoData,
                    paymentType: e.target.value,
                  })
                }
              >
                <Radio value={"Monthly"}>Monthly</Radio>
                <Radio value={"Annually"}>Annually</Radio>
              </Radio.Group>
              <br />
              <Input
                value={jobInfoData.paymentAmount}
                onChange={(e) =>
                  setJobinforData({
                    ...jobInfoData,
                    paymentAmount: Number(e.target.value),
                  })
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
                Work mode <span style={{color:"red"}}>*</span>
              </label>
              <br />
              <Radio.Group
                value={jobInfoData.workMode}
                onChange={(e) =>
                  setJobinforData({ ...jobInfoData, workMode: e.target.value })
                }
              >
                <Radio value={"Work from office"}>Work from office</Radio>
                <Radio value={"Work from home"}>Work from home</Radio>
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
                Branch <span style={{color:"red"}}>*</span>
              </label>
              <br />

  <Select
                style={{ width: 450, height: 40 }}
                options={dmValueBranches.map((val: any, i: any) => ({
                  value: val,
                  label: val || "Unnamed Branch",
                }))}
                value={jobInfoData.branch}
                className="input-dd"
                onChange={(value) =>
                  setJobinforData({ ...jobInfoData, branch: value })
                }
              />

              {/* <Input
                value={jobInfoData.branch}
                onChange={(e) =>
                  setJobinforData({ ...jobInfoData, branch: e.target.value })
                }
              /> */}
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
                Job Category  <span style={{color:"red"}}>*</span>
              </label>
              <br />
              <Input
                value={jobInfoData.jobCategory}
                onChange={(e) =>
                  setJobinforData({
                    ...jobInfoData,
                    jobCategory: e.target.value,
                  })
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
                Previous salary <span style={{color:"red"}}>*</span>
              </label>
              <br />
              <Input
                value={jobInfoData.previousSalary}
                onChange={(e) =>
                  setJobinforData({
                    ...jobInfoData,
                    previousSalary: Number(e.target.value),
                  })
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
                Overtime(Per hour) <span style={{color:"red"}}>*</span>
              </label>
              <br />
              <Input
                value={jobInfoData.overtimePerHr}
                onChange={(e) =>
                  setJobinforData({
                    ...jobInfoData,
                    overtimePerHr: Number(e.target.value),
                  })
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
                Attendance Location <span style={{color:"red"}}>*</span>
              </label>
              <br />

  <Select
                style={{ width: 450, height: 40 }}
                options={dmValueLocation.map((val: any, i: any) => ({
                  value: val,
                  label: val || "Unnamed Branch",
                }))}
                value={jobInfoData.attendanceLocation}
                className="input-dd"
                onChange={(value) =>
                  setJobinforData({ ...jobInfoData, attendanceLocation: value })
                }
              />

              {/* <Input
                value={jobInfoData.attendanceLocation}
                onChange={(e) =>
                  setJobinforData({
                    ...jobInfoData,
                    attendanceLocation: e.target.value,
                  })
                }
              /> */}
              <br />

              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Date of joining <span style={{color:"red"}}>*</span>
              </label>
              <br />
              <DatePicker
                value={
                  jobInfoData.dateOfJoining
                    ? dayjs(jobInfoData.dateOfJoining)
                    : null
                }
                format="YYYY-MM-DD"
                onChange={(date, dateString) => {
                  setJobinforData({
                    ...jobInfoData,
                    dateOfJoining: dateString.toString() || "",
                  });
                }}
              />

              <br />
            </div>
          </div>
        </div>
        <div className="py-3 d-flex justify-content-between align-items-center">
          <a
            className="skipbtn
              "
            onClick={onPrev}
          >
            Back
          </a>
          <Button variant="contained" className="nextBtn me-3" style={{color:"white"}} onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditJobinfo;
