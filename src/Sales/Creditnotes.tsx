import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';


const creditArray=[{
    Date:"15/02/2024",
    Creditnotes:"CN-1201",
    Referencenumber:"",
    Customername:"John Snow",
    Invoice:"INV-1001",
    Status:"Approved",
    Amount :"1,000.00",
    Balance:"0.00"
},{
    Date:"15/02/2024",
    Creditnotes:"CN-1201",
    Referencenumber:"",
    Customername:"John Snow",
    Invoice:"INV-1001",
    Status:"Approved",
    Amount :"1,000.00",
    Balance:"0.00"
}]

const Creditnotes = () => {

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [isNew,setIsnew]=useState(false)
    const [isView,setIsView]=useState(false)


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
             <section className='p-4' style={{marginLeft:"95px"}}>
                <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1'>Credit notes</h2>
                </div><hr className='m-0' />
                <div className='text-end pt-3'>
                    <Button className='nextBtn' style={{ color: "#fff" }} onClick={()=>setIsnew(true)}>New</Button>
                </div>
                <TableContainer component={Paper} className='pt-3'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableHead'>Date</TableCell>
                                    <TableCell className='tableHead'>Credit notes</TableCell>
                                    <TableCell className='tableHead'>Reference number</TableCell>
                                    <TableCell className='tableHead'>Customer name</TableCell>
                                    <TableCell className='tableHead'>Invoice</TableCell>
                                    <TableCell className='tableHead'>Status</TableCell>
                                    <TableCell className='tableHead'>Amount</TableCell>
                                    <TableCell className='tableHead'>Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {creditArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                    <TableRow
                                        hover
                                        onClick={()=>setIsView(true)}
                                        key={i}
                                        style={{cursor:"pointer"}}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >  
                                        <TableCell component="th" scope="row" className='tablebody'>
                                            {row.Date?row.Date:"-"}
                                        </TableCell>
                                        <TableCell className='tablebody'>{row.Creditnotes?row.Creditnotes:"-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Referencenumber?row.Referencenumber:"-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Customername?row.Customername:"-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Invoice?row.Invoice:"-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Status?row.Status:""}</TableCell>
                                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                                        <TableCell className='tablebody'>{row.Balance?row.Balance:"-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={creditArray.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='pt-4 px-4' />
                    </TableContainer>
             </section>:

             <section className='p-4' style={{marginLeft:"95px"}}>
                <div>
                    <span onClick={()=>setIsnew(false)} style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1 d-inline-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{ fontWeight: 600, fontSize: "2rem" }} />New Credits Notes</span>
                </div><hr className='m-0' />   
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Customer Name</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />   
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Reason</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br /> 
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Credit note</label><br />
                <input value={"CNN-1007"} style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Reference</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Credit note date</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />  
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Sales person</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br /> 
                <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Subject</label><br />
                <input style={{ width: "481px", height: "45px" }} /><br />
                <div style={{width:"481px"}} className='text-end'>
                    <span>Let your customer know what is this for </span>
                </div>  
                <label style={{ fontSize: "14px",fontWeight:600 }} className='pb-3 pt-3'>Item table</label><br /> 
                <TableContainer component={Paper} className='pt-3'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableHead'>Item detail</TableCell>
                                    <TableCell className='tableHead'>Account</TableCell>
                                    <TableCell className='tableHead'>Quantity</TableCell>
                                    <TableCell className='tableHead'>Rate</TableCell>
                                    <TableCell className='tableHead'>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    <TableRow
                                        style={{cursor:"pointer"}}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" className='tablebody'></TableCell>
                                        <TableCell className='tablebody'></TableCell>
                                        <TableCell className='tablebody'>1.00</TableCell>
                                        <TableCell className='tablebody'>0.00</TableCell>
                                        <TableCell className='tablebody'>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Subtotal</TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Discount</TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}><input/></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Adjustment</TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}><input/></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody'>Tax</TableCell>
                                        <TableCell className='tablebody'><input/></TableCell>
                                        <TableCell className='tablebody'>0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Total</TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>0.00</TableCell>
                                    </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <label style={{ fontSize: "14px" }} className='pb-3 pt-3'>Terms & Condition</label><br />
                    <textarea style={{ width: "481px", height: "60px" }} /><br />
                    <div className='d-flex justify-content-between align=items-center mt-5'>
                        <div><button style={{borderBottom:"1px solid black",borderBottomStyle:"dotted",borderRadius:"0px",borderTop:"none",borderLeft:"none",borderRight:"none",background:"transparent"}}>Cancel</button></div>
                        <div><Button className='nextBtn' style={{color:"#fff"}}>Save</Button></div>
                    </div>
             </section>}
             </div>:

            <div>

             <section className='p-4' style={{marginLeft:"95px"}}>
             <div>
                <span onClick={()=>setIsView(false)} style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1 d-inline-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{ fontWeight: 600, fontSize: "2rem" }} />CNN-1201</span>
                </div><hr className='m-0' />
                <div className='text-end pt-3'>
                        <Button style={{ borderStyle: "dotted", borderRadius: "0px", borderBottom: "1px solid #000", color: "#000" }} endIcon={<VerticalAlignBottomIcon />}>Download</Button>
                    </div>
                <div style={{ border: "1px solid #A7A7A7" }} className='p-4 mt-4'>
                    <div className='d-flex justify-content-between mb-2'>
                        <div>
                            <p className='mb-1' style={{fontWeight:600}}>Recurring invoice</p>
                            <p className='mb-1'>159 , Main cross street</p>
                            <p className='mb-1'>Chennai -  600014</p>
                            <p className='mb-1 mt-4'>Bill to : Customer 1</p>
                        </div>
                        <div>
                            <p className='mb-1' style={{fontWeight:600}}>Credits notes</p>
                            <p className='mb-1'>Number - CNN-1201</p>
                            <div className='d-flex mt-5'>
                            <div>
                                <p className='mb-1'>Credit date</p>
                                <p className='mb-1'>Invoice no</p>
                                <p className='mb-1'>Invoice date</p>
                                <p className='mb-1'>Place of supply</p>
                            </div>
                            <div className='mx-2'>
                                <p className='mb-1'>: 24 / 03/ 2024</p>
                                <p className='mb-1'>: INV-1001</p>
                                <p className='mb-1'>: 24 / 03/ 2024</p>
                                <p className='mb-1'>: Delhi</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <TableContainer component={Paper} className='pt-3'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableHead'>No</TableCell>
                                    <TableCell className='tableHead'>Item & description</TableCell>
                                    <TableCell className='tableHead'>Qty</TableCell>
                                    <TableCell className='tableHead'>Amount</TableCell>
                                    <TableCell className='tableHead'>Rate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    <TableRow
                                        style={{cursor:"pointer"}}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" className='tablebody'>
                                        1
                                        </TableCell>
                                        <TableCell className='tablebody'>Item 1</TableCell>
                                        <TableCell className='tablebody'>1</TableCell>
                                        <TableCell className='tablebody'>$ 5.00</TableCell>
                                        <TableCell className='tablebody'>$ 5.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Sub total </TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>$ 5.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Total</TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>$ 5.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Credits used</TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>(-) 5.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}></TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>Credits remaining </TableCell>
                                        <TableCell className='tablebody' style={{borderBottom:"none"}}>$ 5.00</TableCell>
                                    </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
             </section>
             </div>}
        </>
    )
}

export default Creditnotes
