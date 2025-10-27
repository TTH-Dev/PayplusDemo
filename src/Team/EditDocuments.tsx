import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Upload, UploadProps } from "antd";
import { Button } from "@mui/material";
import axios from "axios";
import { API_URL } from "../config";
import { useParams } from "react-router-dom";

const { Dragger } = Upload;

const EditDocument = ({
  onNext,
  onPrev,
}: {
  onNext: (data: any) => void;
  onPrev: () => void;
}) => {
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentData, setDocumentData] = useState<{
    idProof?: File | null;
    schoolTC?: File | null;
    experienceCertificate?: File | null;
    panCard?: File | null;
    collegeTC?: File | null;
    paySlip?: File | null;
  }>({});

  // Fetch employee documents
  const fetchEmployee = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const response = await axios.get(`${API_URL}/api/employee/getById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data?.documents || {};
      setDocumentData({
        idProof: null,
        schoolTC: null,
        experienceCertificate: null,
        panCard: null,
        collegeTC: null,
        paySlip: null,
        ...data,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch employee data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleFileChange = (fileType: string) => (info: any) => {
    const file = info.file.originFileObj;
    setDocumentData((prev) => ({
      ...prev,
      [fileType]: file || null,
    }));
  };

  const getDraggerProps = (fileType: string): UploadProps => ({
    name: "file",
    multiple: false,
    beforeUpload: () => false, // Stop auto-upload
    onChange: handleFileChange(fileType),
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  });

  const handleNext = () => {
    const formData = new FormData();
    Object.entries(documentData).forEach(([key, value]) => {
      if (value) formData.append(key, value as File);
    });

    onNext(formData);
  };

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <section>
        <div>
          <h6 className="mb-0">Document</h6>
        </div>
        <div className="row mx-0 ">
          <div className="col-lg-6">
            <div>
              <label
                className="py-2"
                style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}
              >
                Id Proof
              </label>
              <div style={{ width: "481px" }}>
                <Dragger {...getDraggerProps("idProof")}>
                  <p className="ant-upload-drag-icon mb-0">
                    <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload at maximum size of 10 MB
                  </p>
                </Dragger>
              </div>
              <label
                className="py-2"
                style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}
              >
                School TC
              </label>
              <div style={{ width: "481px" }}>
                <Dragger {...getDraggerProps("schoolTC")}>
                  <p className="ant-upload-drag-icon mb-0">
                    <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload at maximum size of 10 MB
                  </p>
                </Dragger>
              </div>
              <label
                className="py-2"
                style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}
              >
                Experience Certificate
              </label>
              <div style={{ width: "481px" }}>
                <Dragger {...getDraggerProps("experienceCertificate")}>
                  <p className="ant-upload-drag-icon mb-0">
                    <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload at maximum size of 10 MB
                  </p>
                </Dragger>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div>
              <label
                className="py-2"
                style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}
              >
                Pan Card
              </label>
              <div style={{ width: "481px" }}>
                <Dragger {...getDraggerProps("panCard")}>
                  <p className="ant-upload-drag-icon mb-0">
                    <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload at maximum size of 10 MB
                  </p>
                </Dragger>
              </div>
              <label
                className="py-2"
                style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}
              >
                College TC
              </label>
              <div style={{ width: "481px" }}>
                 <Dragger {...getDraggerProps("collegeTC")}>
                  <p className="ant-upload-drag-icon mb-0">
                    <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload at maximum size of 10 MB
                  </p>
                </Dragger>
              </div>
              <label
                className="py-2"
                style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}
              >
                Pay Slip
              </label>
              <div style={{ width: "481px" }}>
                <Dragger {...getDraggerProps("paySlip")}>
                  <p className="ant-upload-drag-icon mb-0">
                    <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload at maximum size of 10 MB
                  </p>
                </Dragger>
              </div>
            </div>
          </div>
        </div>
        <div className="py-3 d-flex justify-content-between align-items-center">
          <a className="skipbtn" onClick={onPrev}>
            Back
          </a>
          <Button variant="contained" className="nextBtn me-3" onClick={handleNext}>
            Next
          </Button>
        </div>
      </section>
    </>
  );
};

export default EditDocument;
