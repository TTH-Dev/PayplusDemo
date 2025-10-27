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
  const [files, setFiles] = useState<{
    idProof?: File | null;
    schoolTC?: File | null;
    experienceCertificate?: File | null;
    panCard?: File | null;
    collegeTC?: File | null;
    paySlip?: File | null;
  }>({});

  const handleFileChange = (fileType: string) => (info: any) => {
    const file = info.file.originFileObj;
    setFiles((prev) => ({
      ...prev,
      [fileType]: file || null,
    }));
  };

  const getDraggerProps = (fileType: string): UploadProps => ({
    name: "file",
    multiple: false,
    beforeUpload: () => false, // Prevent auto upload
    onChange: handleFileChange(fileType),
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  });

  const handleNext = () => {
    // You can create FormData here and call your API
    const formData = new FormData();
    Object.entries(files).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // Call the parent callback
    onNext(formData);
  };

  return (
    <section>
      <div>
        <h6 className="mb-0">Document</h6>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <label>Id Proof</label>
          <Dragger {...getDraggerProps("idProof")}>
            <p className="ant-upload-drag-icon">
              <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
            </p>
            <p className="ant-upload-text">Upload at maximum size of 10 MB</p>
          </Dragger>

          <label>School TC</label>
          <Dragger {...getDraggerProps("schoolTC")}>
            <p className="ant-upload-drag-icon">
              <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
            </p>
            <p className="ant-upload-text">Upload at maximum size of 10 MB</p>
          </Dragger>

          <label>Experience Certificate</label>
          <Dragger {...getDraggerProps("experienceCertificate")}>
            <p className="ant-upload-drag-icon">
              <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
            </p>
            <p className="ant-upload-text">Upload at maximum size of 10 MB</p>
          </Dragger>
        </div>

        <div className="col-lg-6">
          <label>Pan Card</label>
          <Dragger {...getDraggerProps("panCard")}>
            <p className="ant-upload-drag-icon">
              <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
            </p>
            <p className="ant-upload-text">Upload at maximum size of 10 MB</p>
          </Dragger>

          <label>College TC</label>
          <Dragger {...getDraggerProps("collegeTC")}>
            <p className="ant-upload-drag-icon">
              <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
            </p>
            <p className="ant-upload-text">Upload at maximum size of 10 MB</p>
          </Dragger>

          <label>Pay Slip</label>
          <Dragger {...getDraggerProps("paySlip")}>
            <p className="ant-upload-drag-icon">
              <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
            </p>
            <p className="ant-upload-text">Upload at maximum size of 10 MB</p>
          </Dragger>
        </div>
      </div>

      <div className="py-3 d-flex justify-content-between align-items-center">
        <a className="skipbtn" onClick={onPrev}>
          Cancel
        </a>
        <Button variant="contained" className="nextBtn" onClick={handleNext}>
          Next
        </Button>
      </div>
    </section>
  );
};

export default Document;
