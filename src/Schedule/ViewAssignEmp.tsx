import { Button, TableCell, TableRow } from "@mui/material";
import { DatePicker, InputNumber, Radio, Select, Switch, Table, TableColumnsType, TableProps, message } from "antd";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import axios from "axios";
import moment from "moment";
import { MdEdit } from "react-icons/md";
import { DeleteOutlined } from "@ant-design/icons";

interface EmployeeType {
    key: string;
    EmployeeId: string;
    Name: string;
    Department: string;
    Emailid: string;
    PhoneNo: string;
    JobCategory: string;
}

interface ShiftDetails {
    shiftName: string;
    startDate: string;
    endDate: string;
    Duration: number;
    shiftRepetition: string;
}
const ViewAssignEmp = () => {
    const navigate = useNavigate();
    const navSchedule = () => {
        navigate("/Schedule");
    };
    const { shiftId } = useParams<{ shiftId: string }>();

    const [datas, setData] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState(false);
    const [shiftDetails, setShiftDetails] = useState<ShiftDetails | null>(null);
    async function getTableData() {
        if (!shiftId) {
            message.error("Shift ID not found in URL");
            return;
        }
        try {
            const token = localStorage.getItem("authtoken")

            const res = await axios.get(`${API_URL}/api/employee/getEmployeesByShiftId?shiftId=${shiftId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setData(res.data || [])
            const employees = res.data || []
            if (employees.length > 0) {
                const shiftInfo = employees[0].shift;
                setShiftDetails({
                    shiftName: shiftInfo.shiftName || "—",
                    startDate: moment(shiftInfo.startDate).format("DD-MM-YYYY"),
                    endDate: moment(shiftInfo.endDate).format("DD-MM-YYYY"),
                    Duration: shiftInfo.Duration || 0,
                    shiftRepetition: shiftInfo.shiftRepetition || "—",
                });
            }
            const mapped = employees.map((emp: any, index: number) => ({
                key: emp._id || index.toString(),
                EmployeeId: emp.employeeId,
                Name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
                Department: emp.jobInfo?.department || "—",
                JobCategory: emp.jobInfo?.jobCategory || "—",
                Emailid: emp.emailId || "—",
                PhoneNo: emp.phoneNo || "—",
                Gender: emp.gender || "-"
            }));

            setData(mapped);
        } catch (err) {
            console.error(err);

        } finally {
            setLoading(false);
        }
    }

    const columns: TableColumnsType<EmployeeType> = [
        {
            title: "Emp Id",
            dataIndex: "EmployeeId",
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: "Name",
            dataIndex: "Name",
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: "Department",
            dataIndex: "Department",
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
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <DeleteOutlined
                    style={{ color: "#1784A2", cursor: "pointer" }}
                // onClick={() => handleDelete(record)}
                />
            ),
        },
    ];

    useEffect(() => {
        getTableData()
    }, [])
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
                        View Assign Employee
                    </span>
                </Container>
                <hr className="mt-1" />
            </div>
            <div>
                <Container>
                    <div className="text-end pb-2">
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#353535",
                                textDecoration: "underLine",
                                textDecorationStyle: "dotted",
                                cursor: "pointer"
                            }}
                        //   onClick={handleedit}
                        >
                            Edit
                            <MdEdit className="mb-1" />
                        </span>
                    </div>

                    <div>
                        <div className="shadow">
                            <div className="row px-4 py-3 m-0 justify-content-between align-items-center">

                                <div className="col-lg-12">
                                    <div>
                                        <p
                                            className="mb-1"
                                            style={{ fontSize: "16px", fontWeight: 600 }}
                                        >
                                            Assigned Employee
                                        </p>
                                        {shiftDetails ? (
                                            <>
                                                <TableRow>
                                                    <TableCell style={{ border: "none", fontWeight: 500 }}>Shift Name</TableCell>
                                                    <TableCell style={{ border: "none" }}>{shiftDetails.shiftName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ border: "none", fontWeight: 500 }}>Start Date</TableCell>
                                                    <TableCell style={{ border: "none" }}>{shiftDetails.startDate}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ border: "none", fontWeight: 500 }}>End Date</TableCell>
                                                    <TableCell style={{ border: "none" }}>{shiftDetails.endDate}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ border: "none", fontWeight: 500 }}>Duration</TableCell>
                                                    <TableCell style={{ border: "none" }}>
                                                        {shiftDetails.Duration} Days
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ border: "none", fontWeight: 500 }}>Shift Repetition</TableCell>
                                                    <TableCell style={{ border: "none" }}>
                                                        {shiftDetails.shiftRepetition === "Repeated" ? "Repeated Shift" : "One-Time Shift"}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ border: "none", fontWeight: 500 }}>Repeat Until</TableCell>
                                                    <TableCell style={{ border: "none" }}>
                                                        {shiftDetails.shiftRepetition === "Repeated" ? "Until Turned Off" : "N/A"}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <p style={{ fontSize: "14px", color: "#666" }}>No shift details found</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="rounded-table shadow my-3 p-3">
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#353535" }}>Assign employee</p>
                            <Table<EmployeeType>
                                columns={columns}
                                dataSource={datas}
                                loading={loading}
                                pagination={false}
                                bordered
                            />
                        </div>

                    </div>
                </Container>
            </div>
        </>
    );
};

export default ViewAssignEmp;
