import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Upload, UploadProps } from "antd";
import { Button } from "@mui/material";

const { Dragger } = Upload;

const Document = ({
  onNext,
  onPrev,
}: {
  onNext: (data: any) => void;
  onPrev: () => void;
}) => {
  const [documentData, setDocumentData] = useState({
    idProof: null as File | null,
    schoolTC: null as File | null,
    experienceCertificate: null as File | null,
    panCard: null as File | null,
    collegeTC: null as File | null,
    paySlip: null as File | null,
  });

  // Handle file selection
  const handleFileChange = (fileType: string) => (info: any) => {
    const file = info.file.originFileObj;
    setDocumentData((prev) => ({
      ...prev,
      [fileType]: file || null,
    }));
  };

  // Common props for all Dragger fields
  const getDraggerProps = (fileType: string): UploadProps => ({
    name: "file",
    multiple: false,
    beforeUpload: () => false, // ✅ Prevent automatic upload
    onChange: handleFileChange(fileType),
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  });

  // Handle Next button
  const handleNext = () => {
    onNext(documentData); // Pass all selected files to parent
  };

  return (
    <section>
      <div>
        <h6 className="mb-0">Document</h6>
      </div>
      <div className="row mx-0">
        <div className="col-lg-6">
          <div>
            <label
              className="py-2"
              style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}
            >
              Id Proof <span style={{ color: "red" }}>*</span>
            </label>
            <div style={{ width: "450px" }}>
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
            <div style={{ width: "450px" }}>
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
            <div style={{ width: "450px" }}>
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
            <div style={{ width: "450px" }}>
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
            <div style={{ width: "450px" }}>
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
            <div style={{ width: "450px" }}>
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
  );
};

export default Document;
