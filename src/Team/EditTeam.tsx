import { Button, Container } from "@mui/material";
import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import Jobinfo from "../Team/EditJobInfo";
import Document from "../Team/EditDocuments";
import Bank from "../Team/EditBank";
import EditBasicinfo from "../Team/EditBasicInfo";
import SalaryBreakdown from "../Team/EditSalaryBreakdown";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import EditSalaryBreakdown from "../Team/EditSalaryBreakdown";

interface TeamData {
  basicInfo: any;
  jobInfo: any;
  salaryBreakdown: any;
  documentInfo: any;
  bankInfo: any;
}

const EditTeam = () => {
  const { id } = useParams(); // Extract 'id' from the URL
  const [currentItem, setCurrentItem] = useState(0);
  const [teamData, setTeamData] = useState<TeamData>({
    basicInfo: {},
    jobInfo: {},
    salaryBreakdown: {},
    documentInfo: {},
    bankInfo: {},
  });

  const navigate = useNavigate();
  const [userData, setuserData] = useState({ companyId: "" });

  // Save full team data
  const handleTeamsave = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const formData = new FormData();

      // --- Basic Info ---
      if (teamData.basicInfo.profileimage) {
        formData.append("profileimage", teamData.basicInfo.profileimage);
      }
      formData.append("companyId", teamData.basicInfo.companyId._id);
      formData.append("firstName", teamData.basicInfo.firstName);
      formData.append("lastName", teamData.basicInfo.lastName);
      formData.append("emailId", teamData.basicInfo.emailId);
      formData.append("dateOfBirth", teamData.basicInfo.dateOfBirth);
      formData.append("gender", teamData.basicInfo.gender);
      formData.append("workType", teamData.basicInfo.workType);
      formData.append("currentAddress", teamData.basicInfo.currentAddress);
      formData.append("phoneNo", teamData.basicInfo.phoneNo);
      formData.append("bloodGroup", teamData.basicInfo.bloodGroup);
      formData.append("maritalStatus", teamData.basicInfo.maritalStatus);
      formData.append("permanentAddress", teamData.basicInfo.permanentAddress);

      // --- Job Info ---
      if (teamData.jobInfo.resume) {
        formData.append("resume", teamData.jobInfo.resume);
      }
      formData.append("jobInfo[department]", teamData.jobInfo.department);
      formData.append("jobInfo[position]", teamData.jobInfo.position);
      formData.append("jobInfo[paymentType]", teamData.jobInfo.paymentType);
      formData.append("jobInfo[paymentAmount]", teamData.jobInfo.paymentAmount);
      formData.append("jobInfo[workMode]", teamData.jobInfo.workMode);
      formData.append("jobInfo[branch]", teamData.jobInfo.branch);
      formData.append("jobInfo[jobCategory]", teamData.jobInfo.jobCategory);
      formData.append(
        "jobInfo[previousSalary]",
        teamData.jobInfo.previousSalary
      );
      formData.append("jobInfo[overtimeRate]", teamData.jobInfo.overtimeRate);
      formData.append(
        "jobInfo[attendanceLocation]",
        teamData.jobInfo.attendanceLocation
      );
      formData.append("jobInfo[dateOfJoining]", teamData.jobInfo.dateOfJoining);
      formData.append("jobInfo[dailyWorkHr]", teamData.jobInfo.dailyWorkHr);
      formData.append("jobInfo[overtimePerHr]", teamData.jobInfo.overtimePerHr);


      // --- Salary Breakdown ---
      if (teamData.salaryBreakdown) {
        // Convert the whole salaryBreakdown object into JSON
        formData.append(
          "salaryBreakdown",
          JSON.stringify({
            earnings: teamData.salaryBreakdown.earnings || [],
            deductions: teamData.salaryBreakdown.deductions || [],
            totalEarnings: teamData.salaryBreakdown.totalEarnings || 0,
            totalDeduction: teamData.salaryBreakdown.totalDeduction || 0,
            netSalary: teamData.salaryBreakdown.netSalary || 0,
          })
        );
      }

      // --- Document Info ---
      if (teamData.documentInfo.collegeTC) {
        formData.append("CollegeTC", teamData.documentInfo.collegeTC);
      }
      if (teamData.documentInfo.experienceCertificate) {
        formData.append(
          "ExperienceCertificate",
          teamData.documentInfo.experienceCertificate
        );
      }
      if (teamData.documentInfo.idProof) {
        formData.append("IDproof", teamData.documentInfo.idProof);
      }
      if (teamData.documentInfo.panCard) {
        formData.append("PanCard", teamData.documentInfo.panCard);
      }
      if (teamData.documentInfo.paySlip) {
        formData.append("PaySlip", teamData.documentInfo.paySlip);
      }
      if (teamData.documentInfo.schoolTC) {
        formData.append("SchoolTC", teamData.documentInfo.schoolTC);
      }

      // --- Bank Info ---
      formData.append(
        "bankDetails[accountHolderName]",
        teamData.bankInfo.accountHolderName
      );
      formData.append(
        "bankDetails[accountType]",
        teamData.bankInfo.accountType
      );
      formData.append("bankDetails[pfNo]", teamData.bankInfo.pfNo);
      formData.append("bankDetails[esicNo]", teamData.bankInfo.esicNo);
      formData.append("bankDetails[accountNo]", teamData.bankInfo.accountNo);
      formData.append("bankDetails[ifscCode]", teamData.bankInfo.ifscCode);
      formData.append("bankDetails[uanNo]", teamData.bankInfo.uanNo);
      formData.append("bankDetails[panCardNo]", teamData.bankInfo.panCardNo);

      // --- API Call ---
      await axios.patch(`${API_URL}/api/employee/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleCompleted();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = (stepData: any) => {
    if (currentItem === 0) {
      setTeamData((prev) => ({ ...prev, basicInfo: stepData }));
    } else if (currentItem === 1) {
      setTeamData((prev) => ({ ...prev, jobInfo: stepData }));
    } else if (currentItem === 2) {
      setTeamData((prev) => ({
        ...prev,
        salaryBreakdown: {
          ...prev.salaryBreakdown,
          earnings: [...(prev.salaryBreakdown.earnings || []), ...(stepData.earnings || [])],
          deductions: [...(prev.salaryBreakdown.deductions || []), ...(stepData.deductions || [])],
          totalEarnings: stepData.totalEarnings,
          totalDeduction: stepData.totalDeduction,
          netSalary: stepData.netSalary,
        },
      }));
    } else if (currentItem === 3) {
      setTeamData((prev) => ({ ...prev, documentInfo: stepData }));
    } else if (currentItem === 4) {
      setTeamData((prev) => ({ ...prev, bankInfo: stepData }));
      handleTeamsave(); // <-- save after last step
    }

    setCurrentItem((prev) => prev + 1);
  };



  const handlePrev = () => {
    setCurrentItem((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleCompleted = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const formData = new FormData();
      formData.append("addEmployeeCompleted", "true");

      await axios.patch(
        `${API_URL}/api/company/${userData.companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  useEffect(() => {
    if (teamData.bankInfo) {
      handleTeamsave();
    }
  }, [teamData.bankInfo]);


  return (
    <section>
      <Container>
        <div className="py-3">
          <div className="d-flex justify-content-center align-items-center">
            <div style={{ width: "70%" }}>
              <Steps
                current={currentItem}
                labelPlacement="vertical"
                items={[
                  { title: "Basic info" },
                  { title: "Job info" },
                  { title: "Salary Breakdown" },
                  { title: "Document" },
                  { title: "Bank detail" },
                ]}
              />
            </div>
          </div>

          {currentItem === 0 ? (
            <EditBasicinfo onNext={handleNext} />
          ) : currentItem === 1 ? (
            <Jobinfo onNext={handleNext} onPrev={handlePrev} />
          ) : currentItem === 2 ? (
            <EditSalaryBreakdown

              onNext={handleNext}
              onPrev={handlePrev}

            />


          ) : currentItem === 3 ? (
            <Document onNext={handleNext} onPrev={handlePrev} />
          ) : (
            <Bank onPrev={handlePrev} onNext={handleNext} />
          )}

        </div>
      </Container>
    </section>
  );
};

export default EditTeam;
