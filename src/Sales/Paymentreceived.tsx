import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs } from '@mui/material'
import { Upload, UploadProps, message } from 'antd';
import React, { useState } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';


const PaymentArray=[{
    Date:"20/01/2024",
    Payment:"Payment 1",
    Type:"Invoice payment",
    Reference:"",
    Customername:"Monica",
    Invoice:"PC123",
    Mode:"Cash",
    Amount:"110.00",
    UnusedAmount:"0.00"
},{
    Date:"20/01/2024",
    Payment:"Payment 1",
    Type:"Invoice payment",
    Reference:"",
    Customername:"Monica",
    Invoice:"PC123",
    Mode:"Cash",
    Amount:"110.00",
    UnusedAmount:"0.00"
}]

const unpaidArray=[{
    Date:"19 Feb 2024",
    dateDue:"Due date 19 Feb 2024",
    Invoicenumber:"INV-1001",
    Invoiceamount:"10.00",
    Amountdue:"10.00",
    Payment :"0.00"
},
{
    Date:"19 Feb 2024",
    dateDue:"Due date 19 Feb 2024",
    Invoicenumber:"INV-1001",
    Invoiceamount:"10.00",
    Amountdue:"10.00",
    Payment :"0.00"
}]

const Paymentreceived = () => {

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [value, setValue] = useState('Invoicepayment');
    const [isNew,setIsNew]=useState(false)
    const [isView,setIsview]=useState(false)

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      };
    
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

    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      const handleChangePage = (event:any, newPage:any) => {
        setPage(newPage);
      };
    return (
        <>
        {!isView?
        <div>
        {!isNew?
         <section className='p-4' style={{ marginLeft: "95px" }}>
                <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1'>Invoice</h2>
                </div><hr className='m-0' /><div className='text-end pt-3'>
                        <Button className='nextBtn' onClick={()=>setIsNew(true)} style={{ color: "#fff" }}>New</Button>
                    </div><TableContainer component={Paper} className='pt-3'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableHead'>Date</TableCell>
                                    <TableCell className='tableHead'>Payment</TableCell>
                                    <TableCell className='tableHead'>Type</TableCell>
                                    <TableCell className='tableHead'>Reference</TableCell>
                                    <TableCell className='tableHead'>Customer name</TableCell>
                                    <TableCell className='tableHead'>Invoice</TableCell>
                                    <TableCell className='tableHead'>Mode</TableCell>
                                    <TableCell className='tableHead'>Amount</TableCell>
                                    <TableCell className='tableHead'>Unused Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {PaymentArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                    <TableRow
                                        hover
                                        onClick={()=>setIsview(true)}
                                        key={i}
                                        style={{ cursor: "pointer" }}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    > 
                                        <TableCell component="th" scope="row" className='tablebody'>
                                            {row.Date ? row.Date : "-"}
                                        </TableCell>
                                        <TableCell className='tablebody'>{row.Payment ? row.Payment : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Type ? row.Type : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Reference ? row.Reference : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Customername ? row.Customername : "-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Invoice ? row.Invoice : "-"}</TableCell>
                                        <TableCell className='tablebody'> {row.Mode ?row.Mode : "-"}</TableCell>
                                        <TableCell className='tablebody'>$ {row.Amount ?row.Amount : "-"}</TableCell>
                                        <TableCell className='tablebody'>$ {row.UnusedAmount ? row.UnusedAmount : "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={PaymentArray.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='pt-4 px-4' />
                    </TableContainer>
         </section>:
         <section className='p-4' style={{ marginLeft: "95px" }}>
            <div>
                <span  onClick={()=>setIsNew(false)} style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1 d-inline-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{ fontWeight: 600, fontSize: "2rem" }} />New Payment Received</span>
            </div><hr className='m-0' />
            <div className='d-flex'>
                <Box sx={{ width: '100%' }}>
                <Tabs
                value={value}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
                >
                <Tab
                value="Invoicepayment"
                label="Invoice payment "
                />
                <Tab value="Customeradvance" label="Customer advance" />
                </Tabs>
                </Box>
            </div>
            <hr className='m-0'/>

            {value==="Invoicepayment"&&
                <>
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Customer Name</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Amount received</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <div className='text-end py-2' style={{width:"481px"}}>
                    <span className='d-flex justify-content-end align-items-center'><input type='checkbox' style={{height:"20px",width:"20px"}} className='mx-2'/>Received full amount</span>
                </div>
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Bank charges (If any)</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Payment date</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Payment mode</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Payment</label><br />
                <input value={"Payment 1"} style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Deposit to </label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Reference</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Tax deducted</label><br />
                <div className='text-end py-2 d-flex' style={{width:"481px"}}>
                    <span className='d-flex justify-content-start align-items-center'><input type='checkbox' style={{height:"20px",width:"20px"}} className='mx-2'/>No</span>
                    <span className='d-flex justify-content-start align-items-center' style={{marginLeft:"1.5rem"}}><input type='checkbox' style={{height:"20px",width:"20px"}} className='mx-2'/>Yes</span>
                </div>
                <label style={{ fontSize: "14px",fontWeight:600 }} className='pb-3 pt-3'>Unpaid invoices</label><br />
                <TableContainer component={Paper} className='pt-3'>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='tableHead'>Date</TableCell>
                                                <TableCell className='tableHead'>Invoice number</TableCell>
                                                <TableCell className='tableHead'>Invoice amount</TableCell>
                                                <TableCell className='tableHead'>Amount due</TableCell>
                                                <TableCell className='tableHead'>Payment </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {unpaidArray.map((row, i) => (
                                                <TableRow
                                                    key={i}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                > 
                                                    <TableCell component="th" scope="row" className='tablebody' style={{display:"grid"}}>
                                                        <span>{row.Date ? row.Date : "-"}</span>
                                                        <span style={{fontSize:"12px",fontWeight:"400"}}>{row.dateDue ? row.dateDue : "-"}</span>
                                                    </TableCell>
                                                    <TableCell className='tablebody'>{row.Invoicenumber ? row.Invoicenumber : "-"}</TableCell>
                                                    <TableCell className='tablebody'>$ {row.Invoiceamount ? row.Invoiceamount : "-"}</TableCell>
                                                    <TableCell className='tablebody'>$ {row.Amountdue ? row.Amountdue : ""}</TableCell>
                                                    <TableCell className='tablebody'>$ {row.Payment ? row.Payment : ""}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>Total</TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>$ 0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>Amount received</TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>$ 0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>Amount used for payment </TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>$ 0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>Amount refunded</TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>$ 0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}></TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>Amount excess</TableCell>
                                                <TableCell className='tablebody' style={{border:"none"}}>$ 0.00</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Attach file</label><br />
                                    <Upload {...props}>
                                    <Button  style={{borderStyle:"dotted",borderRadius:"0px",border:"1px solid #000",color:"#000"}} endIcon={<CloudUploadIcon />}>Upload your file</Button>
                                    </Upload>
                                    <div className='d-flex justify-content-between align=items-center mt-5'>
                                        <div><button style={{borderBottom:"1px solid black",borderBottomStyle:"dotted",borderRadius:"0px",borderTop:"none",borderLeft:"none",borderRight:"none",background:"transparent"}}>Cancel</button></div>
                                        <div><Button className='nextBtn' style={{color:"#fff"}}>Save</Button></div>
                                    </div>
                </>

            }
            {value==="Customeradvance"&&
            <>
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Customer Name</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Place of supply</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Description of supply</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Amount received </label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <div className='text-end py-2' style={{width:"481px"}}>
                    <span className='d-flex justify-content-end align-items-center'><input type='checkbox' style={{height:"20px",width:"20px"}} className='mx-2'/>Received full amount</span>
                </div>
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Bank charges (If any)</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Tax</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Payment date</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Payment mode</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Payment</label><br />
                <input value={"Payment 1"} style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Deposit to </label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Reference</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Attach file</label><br />
                    <Upload {...props}>
                        <Button  style={{borderStyle:"dotted",borderRadius:"0px",border:"1px solid #000",color:"#000"}} endIcon={<CloudUploadIcon />}>Upload your file</Button>
                    </Upload>
                <div className='d-flex justify-content-between align=items-center mt-5'>
                    <div><button style={{borderBottom:"1px solid black",borderBottomStyle:"dotted",borderRadius:"0px",borderTop:"none",borderLeft:"none",borderRight:"none",background:"transparent"}}>Cancel</button></div>
                    <div><Button className='nextBtn' style={{color:"#fff"}}>Save</Button></div>
                </div>
            </>}
        </section>}
        </div>:
        <div>
        <section className='p-4' style={{ marginLeft: "95px" }}>
            <div>
            <span onClick={()=>setIsview(false)}  style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1 d-inline-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{ fontWeight: 600, fontSize: "2rem" }} />Payment 1</span>
                </div><hr className='m-0' />
                <div className='text-end pt-3'>
                    <Button  style={{borderBottomStyle:"dotted",borderRadius:"0px",borderBottom:"1px solid #000",color:"#000"}} endIcon={<VerticalAlignBottomIcon />}>Download</Button>
                </div>
                <div style={{border:"1px solid #A7A7A7"}} className='p-5 mt-4'>
                    <div>
                        <p className='mb-1' style={{fontSize:"14px",fontWeight:600}}>Company Name</p>
                        <p className='mb-1' style={{fontSize:"14px"}}>159 , Main cross street </p>
                        <p style={{fontSize:"14px"}}>Chennai -  600014</p>
                    </div>
                    <h6 className='text-center'>Payment receipt</h6>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex'>
                            <div>
                                <p className='mb-1'>Payment date</p>
                                <p className='mb-1'>Reference no </p>
                                <p className='mb-1'>Payment mode</p>
                                <p className='mb-1'>Amount received in words</p>
                            </div>
                            <div className='mx-2'>
                                <p className='mb-1'>: 24 / 03/ 2024</p>
                                <p className='mb-1'>: -</p>
                                <p className='mb-1'>: Cash</p>
                                <p className='mb-1'>: Four Hundred dollars</p>
                            </div>
                        </div>
                        <div>
                            <p className='mb-1'>Amount received</p>
                            <h1>$ 400.00</h1>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between py-3'>
                        <div className='d-flex'>
                            <div>
                                <p>Bill to</p>
                            </div>
                            <div>
                                <p className='mx-3'>: John</p>
                            </div>
                        </div>
                        <div>
                            <p className='mb-1'>Authorized signature</p>
                        </div>
                    </div>
                    <p style={{fontWeight:600}}>Payment for</p>
                        <div className='d-flex'>
                            <div>
                                <p className='mb-1'>Invoice no</p>
                                <p className='mb-1'>Invoice date </p>
                                <p className='mb-1'>Invoice amount </p>
                                <p className='mb-1'>Payment amount</p>
                            </div>
                            <div className='mx-2'>
                                <p className='mb-1'>: INV-1000</p>
                                <p className='mb-1'>: 24 / 03/ 2024</p>
                                <p className='mb-1'>: $ 400.00</p>
                                <p className='mb-1'>: $ 400.00</p>
                            </div>
                    </div>
                </div>
        </section>
        </div>}
        </>
    )
}

export default Paymentreceived