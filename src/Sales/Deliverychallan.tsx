import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { Upload, UploadProps, message } from 'antd';
import React, { useState } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';

const deliverychallanArray=[{
    Date:"01/01/2024",
    Deliverychallan:"Dcc-1004",
    Referencenumber:"",
    Customername:"Karthik",
    Status:"Open",
    Invoicestatus :"Open",
    Amount :"1,010.00"
},{
    Date:"01/01/2024",
    Deliverychallan:"Dcc-1004",
    Referencenumber:"",
    Customername:"Karthik",
    Status:"Open",
    Invoicestatus :"Open",
    Amount :"1,010.00"
}]

const billArray=[{
    No:"1",
    Itemdescription:"Item 1",
    Qty:"1",
    Amt:"5.00",
    Rate:"5.00"
}]

const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

const Deliverychallan = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [isNew,setIsNew]=useState(false)
    const [isview,setIsview]=useState(false)


    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      const handleChangePage = (event:any, newPage:any) => {
        setPage(newPage);
      };
    return (
        <>
        {!isNew?
        <section className='p-4' style={{ marginLeft: "95px" }}>
            {!isview ?
                <><div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1'>Delivery Challan</h2>
                </div><hr className='m-0' /><div className='text-end pt-3'>
                        <Button className='nextBtn' style={{ color: "#fff" }} onClick={() => setIsNew(true)}>New</Button>
                    </div><TableContainer component={Paper} className='pt-3'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableHead'>Date</TableCell>
                                    <TableCell className='tableHead'>Delivery challan</TableCell>
                                    <TableCell className='tableHead'>Reference number</TableCell>
                                    <TableCell className='tableHead'>Customer name</TableCell>
                                    <TableCell className='tableHead'>Status</TableCell>
                                    <TableCell className='tableHead'>Invoice status </TableCell>
                                    <TableCell className='tableHead'>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deliverychallanArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                    <TableRow
                                        hover
                                        onClick={() => setIsview(true)}
                                        key={i}
                                        style={{ cursor: "pointer" }}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" className='tablebody'>
                                            {row.Date ? row.Date : "-"}
                                        </TableCell>
                                        <TableCell className='tablebody'>{row.Deliverychallan ? row.Deliverychallan : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Referencenumber ? row.Referencenumber : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Customername ? row.Customername : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Status ? row.Status : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Invoicestatus ? row.Invoicestatus : "-"}</TableCell>
                                        <TableCell className='tablebody'>$ {row.Amount ? row.Amount : "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={deliverychallanArray.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='pt-4 px-4' />
                    </TableContainer></> :
                <div>
                    <div>
                        <span onClick={() => setIsview(false)} style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1 d-inline-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{ fontWeight: 600, fontSize: "2rem" }} />Q ST-1004</span>
                    </div><hr className='m-0' />
                    <div className='text-end pt-3'>
                        <Button style={{ borderStyle: "dotted", borderRadius: "0px", borderBottom: "1px solid #000", color: "#000" }} endIcon={<VerticalAlignBottomIcon />}>Download</Button>
                    </div>
                    <div>
                        <div style={{ border: "1px solid black" }} className='p-5 my-3'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    <h6>Company Name</h6>
                                    <p className='mb-0'>159 , Main cross street </p>
                                    <p>Chennai -  600014</p>
                                    <p>Bill to     : Customer 1</p>
                                </div>
                                <div>
                                    <h6>Quotes</h6>
                                    <p>Number - QST-1004</p>
                                    <p>Order date  : 24 / 03/ 2024</p>
                                </div>
                            </div>
                            <div>
                                <TableContainer component={Paper} className='pt-3'>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='tableHead'>No</TableCell>
                                                <TableCell className='tableHead'>Item & description</TableCell>
                                                <TableCell className='tableHead'>Qty</TableCell>
                                                <TableCell className='tableHead'>Amt</TableCell>
                                                <TableCell className='tableHead'>Rate</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {billArray.map((row, i) => (
                                                <TableRow
                                                    key={i}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row" className='tablebody'>
                                                        {row.No ? row.No : "-"}
                                                    </TableCell>
                                                    <TableCell className='tablebody'>{row.Itemdescription ? row.Itemdescription : "-"}</TableCell>
                                                    <TableCell className='tablebody'>{row.Qty ? row.Qty : "-"}</TableCell>
                                                    <TableCell className='tablebody'>{row.Amt ? row.Amt : "-"}</TableCell>
                                                    <TableCell className='tablebody'>{row.Rate ? row.Rate : ""}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell className='tablebody'></TableCell>
                                                <TableCell className='tablebody'></TableCell>
                                                <TableCell className='tablebody'></TableCell>
                                                <TableCell className='tablebody'>Sub total</TableCell>
                                                <TableCell className='tablebody'>$ 5.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='tablebody'></TableCell>
                                                <TableCell className='tablebody'></TableCell>
                                                <TableCell className='tablebody'></TableCell>
                                                <TableCell className='tablebody'>Total</TableCell>
                                                <TableCell className='tablebody'>$ 5.00</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>}


        </section>:
        <section className='p-4' style={{ marginLeft: "95px" }}>
                <div>
                    <div>
                        <span onClick={()=>setIsNew(false)} style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1 d-inline-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{ fontWeight: 600, fontSize: "2rem" }} />New Delivery challan </span>
                    </div><hr className='m-0' />
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Customer Name</label><br />
                    <input style={{ width: "481px", height: "45px" }} /><br />
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Place of supply</label><br />
                    <input style={{ width: "481px", height: "45px" }} /><br />
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Delivery challan </label><br />
                    <input value={"Dcc-1005"} style={{ width: "481px", height: "45px" }} /><br />
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Reference </label><br />
                    <input style={{ width: "481px", height: "45px" }} /><br />
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Delivery chalan date</label><br />
                    <input style={{ width: "481px", height: "45px" }} /><br />
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Challan type</label><br />
                    <input style={{ width: "481px", height: "45px" }} /><br />
                    <label style={{ fontSize: "14px", fontWeight: 600 }} className='pb-3 pt-3'>Item table</label>
                    <div>
                        <TableContainer component={Paper} className='pt-3'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='tableHead'>Item detail</TableCell>
                                        <TableCell className='tableHead'>Quantity</TableCell>
                                        <TableCell className='tableHead'>Rate</TableCell>
                                        <TableCell className='tableHead'>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        style={{ cursor: "pointer" }}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" className='tablebody'>
                                        </TableCell>
                                        <TableCell className='tablebody'>1.00</TableCell>
                                        <TableCell className='tablebody'>0.00</TableCell>
                                        <TableCell className='tablebody'>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ border: "none" }} className='tablebody'></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>Subtotal</TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{ border: "none" }}></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>Discount</TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}><input /></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{ border: "none" }}></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>Adjustment</TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}><input /></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{ border: "none" }}></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>Tax</TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}><input /></TableCell>
                                        <TableCell className='tablebody' style={{ border: "none" }}>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{ borderBottom: "none" }}></TableCell>
                                        <TableCell className='tablebody' style={{ borderBottom: "none", borderTop: "1px solid black" }}>Total</TableCell>
                                        <TableCell className='tablebody' style={{ borderBottom: "none", borderTop: "1px solid black" }}></TableCell>
                                        <TableCell className='tablebody' style={{ borderBottom: "none", borderTop: "1px solid black" }}>0.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Terms & Condition</label><br />
                    <textarea style={{ width: "481px" }}></textarea><br />
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Attach file to quote</label><br />
                    <Upload {...props}>
                        <Button style={{ borderStyle: "dotted", borderRadius: "0px", border: "1px solid #000", color: "#000" }} endIcon={<CloudUploadIcon />}>Upload your file</Button>
                    </Upload>
                    <div className='d-flex justify-content-between align=items-center mt-5'>
                        <div><button style={{ borderBottom: "1px solid black", borderBottomStyle: "dotted", borderRadius: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", background: "transparent" }}>Cancel</button></div>
                        <div><Button className='nextBtn' style={{ color: "#fff" }}>Save</Button></div>
                    </div>
                </div>
            </section>}</>
    )
}

export default Deliverychallan
