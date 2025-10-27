import { Button, Paper, Table, TableBody, TableCell,TablePagination, TableContainer, TableHead, TableRow } from '@mui/material'
import { addDays, addMonths, format, subDays, subMonths } from 'date-fns';
import React, { useState } from 'react'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6'
import { MdEdit } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";


const performanceData=[{
    EmployeeId:"7845129863",
    Name:"Jack Wesley",
    Department :"Design ",
    Total :"08:00 Am"
},{
    EmployeeId:"7845129863",
    Name:"Jack Wesley",
    Department :"Design ",
    Total :"08:00 Am"
}]

const performanceData1=[{
    Performance :"Work Quality",
    Score :"10",
},{
    Performance :"Work Quality",
    Score :"10",
}]

const Performance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [isVisible,setIsvisible]=useState({isCustimze:true,isPerformance:false,isSingleData:false})


    const handleCustimze=()=>{
        setIsvisible({isCustimze:false,isPerformance:true,isSingleData:false})
    }

    const handlePerformance=()=>{
        setIsvisible({isCustimze:false,isPerformance:false,isSingleData:true})
    }

    const handlePerformBack=()=>{
        setIsvisible({isCustimze:false,isPerformance:true,isSingleData:false})
    }

    const handlePrevDate = () => {
        setSelectedDate((prevDate) => subMonths(prevDate, 1));
      };
    
      const handleNextDate = () => {
        setSelectedDate((prevDate) => addMonths(prevDate, 1));
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
            <section className='p-4'>
            <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "600" }} className='m-0 p-1' >{!isVisible.isSingleData?"Performance":<><div className='d-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{fontSize:"20px",fontWeight:600}}/><p className='m-0' style={{cursor:"pointer"}} onClick={handlePerformBack}>Performance</p></div></>}</h2>
            </div><hr className='m-0' />

            {isVisible.isCustimze? <div className='row justify-content-center align-items-center pt-4'>
                    <div className='col-lg-6 text-center'>
                        <img className='img-fluid' src='/assests/customimg.png' style={{width:"295px"}}/>
                        <p style={{fontSize:"18px",fontWeight:400}} className='pt-3'>Hey ! Lets customize your performance table </p>
                        <Button variant='contained' style={{width:"139px",height:"45px",backgroundColor:"black",borderRadius:"0px"}} onClick={handleCustimze}>Customize</Button>
                    </div>
                </div>:""}
               



            {isVisible.isPerformance?<div className="pb-4">
                <div className='d-flex justify-content-between align-items-center'>
                <div className="d-flex justify-content-start align-items-center pb-3 pt-3">
                    <div><FaCaretLeft onClick={handlePrevDate} style={{fontSize:"20px",fontWeight:600,cursor:"pointer"}}/></div>
                    <div className="mx-3"><span style={{fontSize:"20px",fontWeight:600}}>{format(selectedDate, 'MMMM yyyy')}</span></div>
                    <div><FaCaretRight onClick={handleNextDate} style={{fontSize:"20px",fontWeight:600,cursor:"pointer"}}/></div>
                </div>
                <div><p className='m-0' style={{fontSize:"14px",fontWeight:600,borderBottom:"1px solid black",borderBottomStyle:"dotted"}}>Edit<MdEdit className='mx-2'/></p></div>
                </div>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Employee Id</TableCell>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Department</TableCell>
                    <TableCell className='tableHead'>Total</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {performanceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={handlePerformance}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.EmployeeId}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Name}</TableCell>
                        <TableCell className='tablebody'>{row.Department}</TableCell>
                        <TableCell className='tablebody'>{row.Total}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={performanceData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                />
            </TableContainer>

            </div>:""}
            

            {isVisible.isSingleData?<><section className='pt-3'>
                <div style={{ border: "1px solid #666666" }} className="row px-4 py-3 m-0 justify-content-between align-items-center">
                    <div className="col-lg-3">
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="mx-3 fs-3" style={{ cursor: "pointer" }}><FaCaretLeft /></div>
                            <div>
                                <div style={{ borderRadius: "50%", position: "relative" }}>
                                    <img src="/assests/boy.jpg" style={{ width: "134px", height: "134px", borderRadius: "50%" }} />
                                </div>
                            </div>
                            <div className="mx-3 fs-3" style={{ cursor: "pointer" }}><FaCaretRight /></div>
                        </div>
                    </div>
                    <div className="col-lg-9 px-5">
                        <div className="row d-flex justify-content-center">
                            <div className='col-lg-3'>
                                <h2 className="m-0" style={{ fontSize: "20px", fontWeight: 600 }}>Name</h2>
                                <span style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}>John</span>
                            </div>

                            <div className='col-lg-3'>
                                <h2 className="m-0" style={{ fontSize: "20px", fontWeight: 600 }}>Emp id</h2>
                                <span style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}>7845129856</span>
                            </div>

                            <div className='col-lg-3'>
                                <h2 className="m-0" style={{ fontSize: "20px", fontWeight: 600 }}>Email id</h2>
                                <span style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}>john@gmail.com</span>
                            </div>

                            <div className='col-lg-3'>
                                <h2 className="m-0" style={{ fontSize: "20px", fontWeight: 600 }}>Department </h2>
                                <span style={{ fontSize: "14px", fontWeight: 400, color: "#666666" }}>Production</span>
                            </div>
                        </div>
                    </div>
                </div><TableContainer component={Paper} className='pt-3'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableHead' style={{ borderRight: "1px solid black" }}>Performance</TableCell>
                                    <TableCell className='tableHead'>Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {performanceData1.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                    <TableRow
                                        hover
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" className='tablebody' style={{ borderRight: "1px solid black", width: "50%" }}>
                                            {row.Performance}
                                        </TableCell>
                                        <TableCell className='tablebody' style={{ width: "50%" }}>{row.Score} %</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={performanceData1.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='pt-4 px-4' />
                    </TableContainer></section></>:""}
            
                

            </section>
        </>
    )
}

export default Performance
