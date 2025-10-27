import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  DatePicker,
  Input,
  message,
  TimePicker,
  Upload,
  UploadProps,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import Container from "react-bootstrap/esm/Container";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import { API_URL } from "../config";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Notice = () => {
  const [noticeData, setNoticeData] = useState({
    attachment: null as File | null,
    companyId: "",
    publishingDate: "",
    publishingTime: "",
    sendTo: "",
  });
  const [userData, setuserData] = useState({
    companyId: "",
  });

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      setNoticeData({ ...noticeData, attachment: file });
      return false;
    },
    onRemove: () => {
      setNoticeData({ ...noticeData, attachment: null });
    },
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

  const navigate = useNavigate();

  const saveNotice = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const formData = new FormData();
      if (!noticeData.attachment) {
        message.error("Please add attachment!")
      }else{
        formData.append("Attachments", noticeData.attachment);
      }
      formData.append("sendTo[0]", noticeData.sendTo);
      formData.append("companyId", userData.companyId);
      formData.append("publishingDate", noticeData.publishingDate);
      formData.append("publishingTime", noticeData.publishingTime);
      const res = await axios.post(
        `${API_URL}/api/company/NoticeAdd`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Successfully saved");
      navigate("/Settings/OrganizationDetails");
    } catch (error: any) {
      console.log(error);
      message.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <div className="pt-3">
        <Container>
          <span
            style={{
              marginLeft: "2rem",
              fontSize: "20px",
              fontWeight: 600,
              color: "#353535",
              cursor: "pointer",
            }}
          >
            Notice
          </span>
        </Container>
        <hr className="mt-1" />
      </div>
      <div>
        <Container>
          <div className="d-flex flex-column ">
            <p
              className=""
              style={{
                marginLeft: "2rem",
                marginTop: "30px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Publishing date & time
            </p>
            <div className="d-flex flex-wrap notice-left ">
              <div style={{ flex: 1, minWidth: "300px" }}>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Date <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <DatePicker
                  className="inp-org"
                  value={
                    noticeData?.publishingDate
                      ? moment(noticeData?.publishingDate)
                      : null
                  }
                  onChange={(date) => {
                    setNoticeData({
                      ...noticeData,
                      publishingDate: date ? date.format("YYYY-MM-DD") : "",
                    });
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: "300px" }}>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Time <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <TimePicker
                  className="inp-org"
                  value={
                    noticeData.publishingTime
                      ? dayjs(noticeData.publishingTime, "HH:mm")
                      : null
                  }
                  onChange={(time) => {
                    setNoticeData({
                      ...noticeData,
                      publishingTime: time ? time.format("HH:mm") : "",
                    });
                  }}
                />
              </div>
            </div>

            <p
              className=""
              style={{
                marginTop: "20px",
                marginLeft: "2rem",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Publishing content
            </p>

            <div className="d-flex flex-wrap notice-right">
              <div style={{ flex: 1, minWidth: "300px" }}>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Send To <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <Input
                  className="inp-org"
                  value={noticeData.sendTo}
                  onChange={(e) =>
                    setNoticeData({ ...noticeData, sendTo: e.target.value })
                  }
                />
              </div>

              <div style={{ flex: 1, minWidth: "300px" }}>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Attachment <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <div style={{ width: "400px" }}>
                  <Dragger {...props}>
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
          <div className="p-5 d-flex justify-content-between align-items-center">
            <a
              className="skipbtn
                                "
            >
              Cancel
            </a>
            <Button
              variant="contained"
              className="nextBtn"
              onClick={saveNotice}
            >
              Save
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Notice;
