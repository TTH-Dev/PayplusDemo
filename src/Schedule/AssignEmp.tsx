import React, { useEffect, useState } from "react";
import { Button, Container } from "@mui/material";
import { Select, Table, TableColumnsType, TableProps } from "antd";
import { MdEdit, MdFilterAlt, MdOutlineDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { API_URL } from "../config";

interface DataType {
  shiftId: any;
  id: string; // or number, depending on your ID type
  key: React.Key;
  name: string;
  age: number;
  address: string;
}


const AssignEmp = () => {


  const [CompanyId, setCompanyId] = useState("");
  const [dmValueBranches, setdmValueBranches] = useState([]);
  const [dmValueShiftname, setdmValueShiftname] = useState([]);

  const [loading, setLoading] = useState(true);
  const [branches, setbranches] = useState("");
  const [Shiftname, setShiftname] = useState("");

  const [error, setError] = useState("");

  const [datas, setData] = useState<DataType[]>([]);


  const navigate = useNavigate();
  const handleEditClick = (Id: any) => {
    console.log(Id, "Id");
    navigate(`/EditShiftAllocation/${Id}`);
  }


  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // State for selected rows

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
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

  console.log(datas);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Shift Name",
      dataIndex: "shiftName",
      render: (text: string) => <span>{text}</span>,

    },
    {
      title: "No of emp",
      dataIndex: "noOfEmp",
      render: (text: number) => <span>{text}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (

        <span>
          <MdEdit
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(record.key);
            }}
          />
        </span>
      ),
    }
  ];
  const fetchData = async () => {
    const token = localStorage.getItem("authtoken")
    try {
      const response2 = await axios.get(`${API_URL}/api/shift-allocation/filter?branch=${branches}&shiftName=${Shiftname}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Map fetched data to the required structure
      const mappedData = response2.data.data.map((item: any) => {
        const weekInfo = item.shiftId?.weekInfo?.[0];
        return {
          key: item._id,
          shiftId: item.shiftId?._id,
          shiftName: item.shiftId?.shiftName,
          daysOfWorking: weekInfo?.NoOfWorkingDays?.length,
          daysOfLeaves: weekInfo?.NoOfLeaveDays?.length,
          department: item.employees?.[0]?.jobInfo?.department,
          noOfEmp: item.employees?.length,
          branch: item.branch,
        };
      });



      console.log(mappedData, "Mapped Data");
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

      const response3 = await axios.get(`${API_URL}/api/shift/allnames`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const allShiftNames = response3.data.data.map((item: any) => item.shiftName);
      setdmValueShiftname(allShiftNames);
      setdmValueBranches(response.data.branches); // Set the data to state
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      setError('Failed to fetch location change requests.'); // Set error if API call fails
      setLoading(false); // Set loading to false after error
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
      console.log(res.data, " userdata");
      setCompanyId(res.data.companyId);
      fetchData();
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMe(); // Fetch user data
  }, []);

  useEffect(() => {
    if (CompanyId) {
      fetchDropMenu(); // Fetch the dropdown menu data once CompanyId is available
    }
  }, [CompanyId]); // Trigger fetchDropMenu when CompanyId changes


  useEffect(() => {
    fetchData();
  }, [branches, Shiftname]);

  const generateOptions = (data: string[]): { value: string; label: string }[] => {
    // Use a Set to filter out duplicates, then map to the required structure
    const uniqueData = Array.from(new Set(data));

    return uniqueData.map((item: string) => ({
      value: item,
      label: item,
    }));
  };

  const formatDate = (date: any) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };

  const handleReset = () => {
    setbranches("");
    setShiftname(""); // Reset Empname to an empty string
  };
  return (
    <>
      <section>
        <Container>
          <div className="text-end">
            <span style={{ color: "#353535", fontSize: "14px", fontWeight: 600, textDecoration: "underLine", textDecorationStyle: "dotted", cursor: "pointer" }} onClick={handleDeleteSelectedAllocation}>Delete<MdOutlineDeleteForever className="mb-1" />
            </span>
            <Link className="ms-2" to="/NewAssignemployee" style={{ color: "#353535", fontSize: "14px", fontWeight: 600, textDecoration: "underLine", textDecorationStyle: "dotted" }}>Add New<IoMdAdd className="mb-1" />
            </Link>
          </div>
          <div>
            <span
              style={{ color: "#1784A2", fontSize: "14px", fontWeight: 600 }}
            >
              Filter
              <MdFilterAlt />
            </span>
            <div className="d-flex justify-content-between align-items-center filter-box">
              <div style={{ width: "60%" }}>
                <div className="d-flex justify-content-start align-items-center">
                  <div className="me-2">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
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
                  {/* <div className="me-2">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
                      Search by shift time
                    </label>
                    <br />
                    <Select
                      style={{ width: 150, height: 35 }}
                      options={[
                        { value: "jack", label: "Jack" },
                        { value: "lucy", label: "Lucy" },
                        { value: "Yiminghe", label: "yiminghe" },
                        {
                          value: "disabled",
                          label: "Disabled",
                          disabled: true,
                        },
                      ]}
                    />
                    <br />
                  </div> */}
                  <div>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#666666",
                      }}
                    >
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
                    navigate(`/viewAssignemployee/${record.shiftId}`);
                  },
                  style: { cursor: "pointer" },
                })}

              />

            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AssignEmp;
