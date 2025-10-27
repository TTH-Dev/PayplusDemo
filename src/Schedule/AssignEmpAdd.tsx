import { Button } from "@mui/material";
import { DatePicker, InputNumber, Radio, Select, Switch, Table, TableColumnsType, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import axios from "axios";
import moment from "moment";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}


const AssignEmpAdd = () => {
  const navigate = useNavigate();
  const navSchedule = () => {
    navigate("/Schedule");
  };

  const [datas, setData] = useState<DataType[]>([]);
  const [dmValueBranches, setdmValueBranches] = useState([]);
  const [dmValuePosition, setdmValuePosition] = useState([]);

  const [dmValueDepartment, setdmValueDepartment] = useState([]);
  const [dmValuejobCategories, setdmValuejobCategories] = useState([]);


  const [CompanyId, setCompanyId] = useState("");
  const [companybranch, setcompanybranch] = useState("")
  const [postData, setPostData] = useState<any>(
    {
      shiftName: "",
      startDate: "",
      endDate: "",
      duration: 0,
      shiftRepetition: "",
      autoSwapShift: false,
      branch: "",
      shiftId: "",
      repeatEvery: false,
      swapShifts: [
        {
          shiftName: "",
          shiftDuration: 0
        }
      ],
      employees: []
    }
  )


  const [filterData, setFilterData] = useState({
    depart: "",
    position: "",
    categ: ""
  })

  const [dmValueShift, setdmValueShift] = useState<any>([])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // State for selected rows

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // Update the postData state with the selected row keys
      setPostData({ ...postData, employees: selectedRowKeys });
      // Update the selected row keys for deletion purposes
      setSelectedRowKeys(selectedRowKeys); // Ensure this state exists in your component
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === "Disabled User", // Example: Disable checkbox for certain users
      name: record.name,
    }),
  };

  const handleDeleteSelectedAllocation = async () => {
    console.log(selectedRowKeys); // Log the selected keys for debugging
    const token = localStorage.getItem("authtoken")
    try {
      await Promise.all(
        selectedRowKeys.map(async (key) => {
          await axios.delete(`${API_URL}/api/shift-allocation/${key}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        })
      );
      // Update the local state to remove deleted rows
      setData((prevData) => prevData.filter((item) => !selectedRowKeys.includes(item.key)));
      setSelectedRowKeys([]); // Clear selection after deletion
    } catch (error) {
      console.error("Error deleting selected Shift-Allocation:", error);
    }
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Employee Id",
      dataIndex: "EmployeeId",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "Name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Email id ",
      dataIndex: "Emailid",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Phone No",
      dataIndex: "PhoneNo",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Gender ",
      dataIndex: "Gender",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Date of birth",
      dataIndex: "Dateofbirth",
      render: (text: string) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
    },
    {
      title: "Department ",
      dataIndex: "Department",
      render: (text: string) => <span>{text} </span>,
    },

  ];



  const fetchData = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      // 1️⃣ Get all employees (with filter)
      const response = await axios.get(
        `${API_URL}/api/employee/filter?jobCategory=${filterData.categ}&department=${filterData.depart}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allEmployees = response.data.data;

      // 2️⃣ Get all shift allocations
      const allocationRes = await axios.get(`${API_URL}/api/shift-allocation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allocationData = allocationRes.data.data;

      // 3️⃣ Collect all assigned employee IDs (from nested array)
      const assignedEmployeeIds: string[] = allocationData.flatMap(
        (item: any) =>
          Array.isArray(item.employees)
            ? item.employees.map((emp: any) => emp._id)
            : []
      );

      console.log("✅ Assigned Employee IDs:", assignedEmployeeIds);

      // 4️⃣ Filter out assigned employees
      const unassignedEmployees = allEmployees.filter(
        (emp: any) => !assignedEmployeeIds.includes(emp._id)
      );

      console.log("🧾 Unassigned Employees:", unassignedEmployees);

      // 5️⃣ Prepare data for display
      const mappedData = unassignedEmployees.map((item: any) => ({
        key: item._id,
        EmployeeId: item.employeeId,
        Name: `${item.firstName} ${item.lastName}`,
        Emailid: item.emailId,
        Department: item?.jobInfo?.department,
        Gender: item.gender,
        Dateofbirth: item.dateOfBirth,
        PhoneNo: item.phoneNo,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDropMenu = async () => {
    const token = localStorage.getItem("authtoken")
    try {
      // Make the API call to get pending location change requests
      const response = await axios.get(`${API_URL}/api/company/dmDeatails?companyId=${CompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response, "response");

      const responseshift = await axios.get(`${API_URL}/api/shift`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      setdmValueBranches(Array.from(new Set(response.data.branches)));
      setdmValueDepartment(response.data.departments);
      setdmValuePosition(Array.from(new Set(response.data.Positions)));
      setdmValuejobCategories(Array.from(new Set(response.data.jobCategories)));
      setdmValueShift(responseshift.data.data); // store as array directly

      console.log(postData + "-----------------")

    } catch (err) {
      console.log(err);

    }
  };

  const generateOptions = (data: string[]): { value: string; label: string }[] => {
    // Use a Set to filter out duplicates, then map to the required structure
    const uniqueData = Array.from(new Set(data));

    return uniqueData.map((item: string) => ({
      value: item,
      label: item,
    }));
  };




  const getMe = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const res = await axios.get(`${API_URL}/api/auth/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setCompanyId(res.data.companyId);
      await fetchData();

    } catch (error: any) {
      console.log(error);
    }
  };

  const handleReset = async () => {
    setFilterData({
      depart: "",
      position: "",
      categ: ""
    })
    await fetchData()
  }

const handlePostData = async () => {
  const token = localStorage.getItem("authtoken");

 
  try {
    const selectedShift = dmValueShift.find(
      (shift: any) => String(shift._id) === postData.shiftId
    );

    if (!selectedShift) {
      window.alert("Invalid shift selected. Please choose a valid shift.");
      return;
    }

    const payload = {
      ...postData,
      shiftId: selectedShift._id,
      shiftName: selectedShift.shiftName,
      companyId: CompanyId,
    };

    await axios.post(`${API_URL}/api/shift-allocation`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchData();
    setSelectedRowKeys([]);
    setPostData({
      shiftName: "",
      startDate: "",
      endDate: "",
      duration: 0,
      shiftRepetition: "",
      autoSwapShift: false,
      branch: "",
      shiftId: "",
      repeatEvery: false,
      swapShifts: [{ shiftName: "", shiftDuration: 0 }],
      employees: [],
    });

    navigate("/Home");
  } catch (error: any) {
    console.error("Error assigning shift:", error);
  }
};

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (CompanyId) {
      fetchDropMenu();
    }

  }, [CompanyId]);


  useEffect(() => {
    fetchData()
  }, [filterData])




  return (
    <>
      <div className="pt-3">
        <Container>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#353535",
              cursor: "pointer",
            }}
            onClick={navSchedule}
          >
            <IoIosArrowBack className="mb-1" />
            Assign Employee
          </span>
        </Container>
        <hr className="mt-1" />
      </div>
      <div>
        <Container>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>Filter employee</p>
            <div className="d-flex justify-content-start align-items-center">
              <div className="">
                <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Department</label><br />
                <Select
                  style={{ width: 150, height: 40 }}
                  value={filterData.depart}
                  onChange={(value) => setFilterData({ ...filterData, depart: value })}
                  options={generateOptions(dmValueDepartment)}
                /></div>
              <div className="ms-3">
                <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Job Category</label><br />
                <Select
                  style={{ width: 150, height: 40 }}
                  options={dmValuejobCategories.map((val, i) => ({
                    value: val,
                    label: val || "Unnamed Branch",
                  }))}
                  value={filterData.categ}
                  onChange={(value) => setFilterData({ ...filterData, categ: value })}
                />
              </div>
              <div>
                <label style={{ visibility: "hidden" }} className="py-2">Job Category</label><br />

                <Button style={{ height: "40px", color: "black" }} onClick={handleReset}>Reset</Button></div>
            </div>
            <div className="row pt-3">
              <p className="mb-0" style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>Select date</p>

              <div className="col-lg-6">
                <div className="pt-3">
                  <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Start date</label><br />



                  <DatePicker
                    className="input-dd"
                    style={{ width: 480 }}
                    value={
                      postData.startDate
                        ? moment(postData.startDate)
                        : null
                    }
                    onChange={(date) => {
                      setPostData({ ...postData, startDate: date ? date.format("YYYY-MM-DD") : "" })
                    }}
                  />
                  <br />
                  <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Duration</label><br />
                  <InputNumber
                    className="input-dd"
                    value={postData.duration}
                    onChange={(value) => setPostData({ ...postData, duration: value ?? 0 })}
                  /><br />

                  <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Repeat every</label><br />
                  <Switch
                    checked={postData.autoSwapShift}
                    onChange={(checked) => {
                      setPostData({ ...postData, autoSwapShift: checked });
                    }}
                  />

                  <span className="ms-2" style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>Until i turn off </span>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="pt-3">
                  <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Shift name</label><br />
                  <Select
                    style={{ width: 450, height: 40 }}
                    value={postData.shiftId || undefined} // must match option.value type
                    options={dmValueShift.map((shift: any) => ({
                      value: String(shift._id), // force string
                      label: shift.shiftName,
                    }))}
                    onChange={(value) => setPostData({ ...postData, shiftId: String(value) })}
                  />

                  <br />
                  <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Shift Branch</label><br />
                  <Select
                    style={{ width: 450, height: 40 }}
                    options={dmValueBranches.map((val: any, i: any) => ({
                      value: val,
                      label: val || "Unnamed Branch",
                    }))}
                    value={postData.branches}
                    onChange={(value) => setPostData({ ...postData, branch: value })}
                  /><br />
                  <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">End date</label><br />
                  <DatePicker
                    style={{ width: 480 }}
                    value={
                      postData.endDate
                        ? moment(postData.endDate)
                        : null
                    }
                    onChange={(date) => {
                      setPostData({ ...postData, endDate: date ? date.format("YYYY-MM-DD") : "" })
                    }}
                    className="input-dd"
                  /><br />
                  <label style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }} className="py-2">Shift repetition</label><br />
                  <Radio.Group value={postData.shiftRepetition} onChange={(e) => setPostData({ ...postData, shiftRepetition: e.target.value })}>
                    <Radio value={"Repeated"}> <span style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>Repeated</span></Radio>
                    <Radio value={"Swap shift"}><span style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>Swap shift</span></Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="pt-3">
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>Assign employee</p>
              <Table<DataType>
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={datas}
              />
              <div className="py-3 d-flex justify-content-between align-items-center">
                <a className="skipbtn
              ">Cancel</a>
                <Button variant="contained" className="nextBtn" onClick={handlePostData}>Save</Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AssignEmpAdd;
