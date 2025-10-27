import React, { useEffect, useState } from "react";
import { Button, Container } from "@mui/material";
import { Select, Table, TableColumnsType, TableProps } from "antd";
import { MdEdit, MdFilterAlt, MdOutlineDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { API_URL } from "../config";

interface DataType {
  shiftId: string;
  key: React.Key;
  shiftName: string;
  shiftTime?: { start?: string; end?: string } | string; // fixed type
  branch: string;
  type?: string;
}

interface ShiftManageProps {
  formData?: any;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

const ShiftManage: React.FC<ShiftManageProps> = ({ formData, setFormData }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [CompanyId, setCompanyId] = useState("");
  const [dmValueBranches, setdmValueBranches] = useState<string[]>([]);
  const [dmValueShiftname, setdmValueShiftname] = useState<string[]>([]);
  const [dmValueShiftTime, setdmValueShiftTime] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [branches, setbranches] = useState("");
  const [Shiftname, setShiftname] = useState("");
  const [ShiftTime, setShiftTime] = useState("");
  const [error, setError] = useState("");
  const [datas, setData] = useState<DataType[]>([]);

  const navigate = useNavigate();

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
    getCheckboxProps: (record) => ({
      disabled: record.shiftName === "Disabled User",
      name: record.shiftName,
    }),
  };

  const handleDeleteSelectedAllocation = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      await Promise.all(
        selectedRowKeys.map(async (key) => {
          await axios.delete(`${API_URL}/api/shift/${key}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
      );
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.key)));
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("Error deleting selected Shifts:", err);
    }
  };

  const columns: TableColumnsType<DataType> = [
    { title: "Shift Name", dataIndex: "shiftName" },
    { title: "Type", dataIndex: "type" },
    { title: "Branch", dataIndex: "branch" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <MdEdit
          style={{ cursor: "pointer", fontSize: "20px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (setFormData)
              setFormData({
                shiftName: record.shiftName,
                startTime:
                  typeof record.shiftTime === "object" ? record.shiftTime.start : "",
                endTime:
                  typeof record.shiftTime === "object" ? record.shiftTime.end : "",
                branch: record.branch,
                shiftId: record.shiftId,
              });
            navigate(`/NewShift/${record.shiftId}`);
          }}
        />
      ),
    },
  ];

const fetchData = async () => {
  const token = localStorage.getItem("authtoken");
  try {
    const queryParams = new URLSearchParams();
    if (branches) queryParams.append("branch", branches);
    if (Shiftname) queryParams.append("shiftName", Shiftname);
    if (ShiftTime) queryParams.append("shiftTime", ShiftTime);

    const response = await axios.get(
      `${API_URL}/api/shift-allocation/filter?${queryParams.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

const mappedData: DataType[] = response.data.data.map((item: any) => {
  // ✅ Determine shift type based on shiftId.weekInfo length
  const weekInfo = item.shiftId?.weekInfo || [];
  const type = weekInfo.length > 1 ? "Customized" : "Standard";

  return {
    key: item._id,
    shiftId: item.shiftId?._id || item.shiftId || item._id,
    shiftName: item.shiftId?.shiftName || "-",
    shiftTime: item.shiftTiming || "-",
    branch: item.branch || "-",
    type, // ✅ now correctly derived
  };
});


    setData(mappedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  const fetchDropMenu = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const response = await axios.get(
        `${API_URL}/api/company/dmDeatails?companyId=${CompanyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response3 = await axios.get(`${API_URL}/api/shift/allnames`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setdmValueShiftname(response3.data.data.map((item: any) => item.shiftName));
      setdmValueShiftTime(response3.data.data.map((item: any) => item.shiftTiming));
      setdmValueBranches(response.data.branches);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch location change requests.");
      setLoading(false);
    }
  };

  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyId(res.data.companyId);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (CompanyId) fetchDropMenu();
  }, [CompanyId]);

  useEffect(() => {
    fetchData();
  }, [branches, Shiftname, ShiftTime]);

  const generateOptions = (data: string[]): { value: string; label: string }[] => {
    return Array.from(new Set(data)).map((item) => ({ value: item, label: item }));
  };

  const handleReset = () => {
    setbranches("");
    setShiftname("");
    setShiftTime("");
  };

  return (
    <section>
      <Container>
        <div className="text-end">
          <span
            style={{
              color: "#353535",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "underLine",
              textDecorationStyle: "dotted",
              cursor: "pointer",
            }}
            onClick={handleDeleteSelectedAllocation}
          >
            Delete
            <MdOutlineDeleteForever className="mb-1" />
          </span>
          <Link
            className="ms-2"
            to="/NewShift"
            style={{
              color: "#353535",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "underLine",
              textDecorationStyle: "dotted",
            }}
          >
            Add New
            <IoMdAdd className="mb-1" />
          </Link>
        </div>

        <div>
          <span style={{ color: "#1784A2", fontSize: "14px", fontWeight: 600 }}>
            Filter
            <MdFilterAlt />
          </span>
          <div className="d-flex justify-content-between align-items-center filter-box">
            <div style={{ width: "60%" }}>
              <div className="d-flex justify-content-start align-items-center">
                <div className="me-2">
                  <label style={{ fontSize: "14px", fontWeight: 600, color: "#666666" }}>
                    Search by shift name
                  </label>
                  <br />
                  <Select
                    style={{ width: 150, height: 35 }}
                    options={generateOptions(dmValueShiftname)}
                    value={Shiftname}
                    onChange={(value) => setShiftname(value)}
                  />
                  <br />
                </div>
                <div className="me-2">
                  <label style={{ fontSize: "14px", fontWeight: 600, color: "#666666" }}>
                    Search by shift time
                  </label>
                  <br />
                  <Select
                    style={{ width: 150, height: 35 }}
                    options={generateOptions(dmValueShiftTime)}
                    value={ShiftTime}
                    onChange={(value) => setShiftTime(value)}
                  />
                  <br />
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: 600, color: "#666666" }}>
                    Search by branch
                  </label>
                  <br />
                  <Select
                    style={{ width: 150, height: 35 }}
                    options={generateOptions(dmValueBranches)}
                    value={branches}
                    onChange={(value) => setbranches(value)}
                  />
                </div>
              </div>
            </div>
            <div className="me-3">
              <Button variant="contained" onClick={handleReset} className="newBtn">
                Reset
              </Button>
            </div>
          </div>

          <div className="shadow py-2 mt-4 mb-2">
<Table<DataType>
  rowSelection={{ ...rowSelection }}
  columns={columns}
  dataSource={datas}
  onRow={(record) => ({
    onClick: () => {
      if (record.shiftId) {
        console.log("Navigating to:", `/viewShift/${record.shiftId}`);
        navigate(`/viewShift/${record.shiftId}`); // ✅ pass shiftId via params
      } else {
        console.warn("Shift ID missing for record:", record);
      }
    },
    style: { cursor: "pointer" },
  })}
/>

          </div>
          </div>
      </Container>
    </section>
  );
};

export default ShiftManage;
