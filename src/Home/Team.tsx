import { Button, Container } from "@mui/material";
import { message, Steps } from "antd";
import React, { useEffect, useState } from "react";
import Jobinfo from "./Jobinfo";
import Document from "./Document";
import Bank from "./Bank";
import Basicinfo from "./Basicinfo";
import SalaryBreakdown from "./SalaryBreakdown";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface TeamData {
  basicInfo: any;
  documentInfo: any;
  salaryBreakdown: any;
  jobInfo: any;
  bankInfo: any;
}

const Team = () => {
  const [currentItem, setCurrentItem] = useState(0);

  const [teamData, setTeamData] = useState<TeamData>({
    basicInfo: {},
    jobInfo: {},
    salaryBreakdown: {},
    documentInfo: {},
    bankInfo: {},
  });

  const handleTeamsave = async (newData: any) => {
    const token = localStorage.getItem("authtoken");
    try {
      const formData = new FormData();

      // ✅ Basic Info
      if (newData.basicInfo.profileimage) {
        formData.append("profileimage", newData.basicInfo.profileimage);
      }
      formData.append("companyId", newData.basicInfo.companyId);
      formData.append("firstName", newData.basicInfo.firstName);
      formData.append("lastName", newData.basicInfo.lastName);
      formData.append("emailId", newData.basicInfo.emailId);
      formData.append("dateOfBirth", newData.basicInfo.dateOfBirth);
      formData.append("gender", newData.basicInfo.gender);
      formData.append("workType", newData.basicInfo.workType);
      formData.append("currentAddress", newData.basicInfo.currentAddress);
      formData.append("phoneNo", newData.basicInfo.phoneNo);
      formData.append("bloodGroup", newData.basicInfo.bloodGroup);
      formData.append("maritalStatus", newData.basicInfo.maritalStatus);
      formData.append("permanentAddress", newData.basicInfo.permanentAddress);

      // ✅ Job Info
      if (newData.jobInfo.resume) {
        formData.append("resume", newData.jobInfo.resume);
      }
      formData.append("jobInfo[department]", newData.jobInfo.department);
      formData.append("jobInfo[position]", newData.jobInfo.position);
      formData.append("jobInfo[paymentType]", newData.jobInfo.paymentType);
      formData.append("jobInfo[paymentAmount]", newData.jobInfo.paymentAmount);
      formData.append("jobInfo[workMode]", newData.jobInfo.workMode);
      formData.append("jobInfo[branch]", newData.jobInfo.branch);
      formData.append("jobInfo[jobCategory]", newData.jobInfo.jobCategory);
      formData.append("jobInfo[previousSalary]", newData.jobInfo.previousSalary);
      formData.append("jobInfo[overtimeRate]", newData.jobInfo.overtimeRate);
      formData.append("jobInfo[attendanceLocation]", newData.jobInfo.attendanceLocation);
      formData.append("jobInfo[dateOfJoining]", newData.jobInfo.dateOfJoining);
      formData.append("jobInfo[dailyWorkHr]", newData.jobInfo.dailyWorkHr);
      formData.append("jobInfo[overtimePerHr]", newData.jobInfo.overtimePerHr);


if (newData.salaryBreakdown) {
  formData.append("salaryBreakdown", JSON.stringify(newData.salaryBreakdown)); // ✅ match backend
}


      // ✅ Document Info
      if (newData.documentInfo.collegeTC) {
        formData.append("CollegeTC", newData.documentInfo.collegeTC);
      }
      if (newData.documentInfo.experienceCertificate) {
        formData.append("ExperienceCertificate", newData.documentInfo.experienceCertificate);
      }
      if (newData.documentInfo.idProof) {
        formData.append("IDproof", newData.documentInfo.idProof);
      }
      if (newData.documentInfo.panCard) {
        formData.append("PanCard", newData.documentInfo.panCard);
      }
      if (newData.documentInfo.paySlip) {
        formData.append("PaySlip", newData.documentInfo.paySlip);
      }
      if (newData.documentInfo.schoolTC) {
        formData.append("SchoolTC", newData.documentInfo.schoolTC);
      }

      // ✅ Bank Info
      formData.append("bankDetails[accountHolderName]", newData.bankInfo.accountHolderName);
      formData.append("bankDetails[accountType]", newData.bankInfo.accountType);
      formData.append("bankDetails[pfNo]", newData.bankInfo.pfNo);
      formData.append("bankDetails[esicNo]", newData.bankInfo.esicNo);
      formData.append("bankDetails[accountNo]", newData.bankInfo.accountNo);
      formData.append("bankDetails[ifscCode]", newData.bankInfo.ifscCode);
      formData.append("bankDetails[uanNo]", newData.bankInfo.uanNo);
      formData.append("bankDetails[panCardNo]", newData.bankInfo.panCardNo);

      // ✅ API Call
      await axios.post(`${API_URL}/api/employee`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleCompleted();
    } catch (error: any) {
      console.log(error);
      message.error(error.response?.data?.error || "Something went wrong!");
    }
  };

  const stepDataMapping = ["basicInfo", "jobInfo", "salaryBreakdown", "documentInfo", "bankInfo"];

  const handleNext = (stepData: any) => {
    const currentStepKey = stepDataMapping[currentItem];
    if (currentStepKey) {
      setTeamData((prev) => {
        return { ...prev, [currentStepKey]: stepData };
      });
    }
    setCurrentItem((prev) => prev + 1);
  };

  // ✅ Fix: ffCall merges bankInfo and posts all data
  const ffCall = (bankData: any) => {
    const newData = { ...teamData, bankInfo: bankData };
    console.log(newData);
    handleTeamsave(newData);
  };

  const handlePrev = () => {
    setCurrentItem((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const [userData, setuserData] = useState({ companyId: "" });
  const navigate = useNavigate();

  const handleCompleted = async () => {
    try {
      const token = localStorage.getItem("authtoken");

      const formData = new FormData();
      formData.append("addEmployeeCompleted", "true");

      await axios.patch(`${API_URL}/api/company/${userData.companyId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/Home");
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
      setuserData(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <section style={{ width: "100%" }}>
        <Container className="px-0">
          <div className="py-3">
            <div className="d-flex justify-content-center align-items-center">
              <div style={{ width: "70%" }}>
                <Steps
                  current={currentItem}
                  labelPlacement="vertical"
                  items={[
                    { title: "Basic info" },
                    { title: "Job info" },
                    { title: "Salary breakdown" },
                    { title: "Document" },
                    { title: "Bank detail" },
                  ]}
                />
              </div>
            </div>
            {currentItem === 0 ? (
              <Basicinfo onNext={handleNext} />
            ) : currentItem === 1 ? (
              <Jobinfo onNext={handleNext} onPrev={handlePrev} />
            ) : currentItem === 2 ? (
              <SalaryBreakdown jobInfo={teamData.jobInfo} onNext={handleNext} onPrev={handlePrev} />
            ) : currentItem === 3 ? (
              <Document onNext={handleNext} onPrev={handlePrev} />
            ) : (
            <Bank
              onPrev={handlePrev}
              onNext={() => {}} // dummy function
              onFinalCall={ffCall}
            />

            )}
          </div>
        </Container>
      </section>
    </>
  );
};

export default Team;
