import { Box, Button, Paper, Tab, Table, TableBody, TableCell,TablePagination, TableContainer, TableHead, TableRow, Tabs, Modal } from '@mui/material'
import { green } from '@mui/material/colors';
import React, { useState } from 'react'
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const employeeInfo=[{
  Date:"20- Feb 2024",
  Name:"John",
  Types :"Sick Leave",
  Startdate:"5- Feb 2024",
  Enddate:"5- Feb 2024",
  Totalhrs:"24:00 Hrs",
  Status:true,
},{
  Date:"20- Feb 2024",
  Name:"John",
  Types :"Sick Leave",
  Startdate:"5- Feb 2024",
  Enddate:"5- Feb 2024",
  Totalhrs:"24:00 Hrs",
  Status:false,
}]

const viewNotesstyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Allrequest = () => {

    const [value, setValue] = useState('Allrequest');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [isleavereq, setIsLeavereq] = useState(false);
    const handleLeavereqOpen=()=>setIsLeavereq(true)
    const handleLeavereqclose=()=>setIsLeavereq(false)

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
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
       <h2 style={{ fontSize: "1.2rem", fontWeight: "600",cursor:"pointer" }} className='m-0 p-4' >Leave Request</h2>
      </div><hr className='m-0' />
   
        <div className='d-flex'>
            <Box sx={{ width: '100%' }}>
            <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
            >
            <Tab
            value="Allrequest"
            label="All request"
            />
            <Tab value="Approved" label="Approved" />
            <Tab value="Denied" label="Denied" />

            </Tabs>
            </Box>
        </div>
        <hr className='m-0'/>



        {value==="Allrequest"?<section className='pt-4'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Types</TableCell>
                    <TableCell className='tableHead'>Start date</TableCell>
                    <TableCell className='tableHead'>End date</TableCell>
                    <TableCell className='tableHead'>Total hrs</TableCell>
                    <TableCell className='tableHead'>Notes </TableCell>
                    <TableCell className='tableHead'>Status </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {employeeInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Name}</TableCell>
                        <TableCell className='tablebody'>{row.Types}</TableCell>
                        <TableCell className='tablebody'>{row.Startdate}</TableCell>
                        <TableCell className='tablebody'>{row.Enddate}</TableCell>
                        <TableCell className='tablebody'>{row.Totalhrs}</TableCell>
                        <TableCell className='tablebody'><p className='m-0' style={{textDecoration:"underline",cursor:"pointer"}} onClick={handleLeavereqOpen}>View Note</p></TableCell>
                        <TableCell className='tablebody'>{row.Status?<><div style={{width:"20px",height:"20px",backgroundColor:"green",borderRadius:"50%"}} className='d-flex justify-content-center align-items-center'><TiTick style={{color:"white"}}/></div></>:<><div style={{width:"20px",height:"20px",backgroundColor:"red",borderRadius:"50%"}} className='d-flex justify-content-center align-items-center'><RxCross2 style={{color:"white"}}/></div></>}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={employeeInfo.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                />
            </TableContainer>

            </section>:""}

            <Modal
              open={isleavereq}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              >
              <Box sx={viewNotesstyle}>
                    <div className="row pb-3">
                      <div className="col-lg-3 d-flex  align-items-center">
                          <div className="text-center">
                            <img className="img-fluid" style={{width:"100px",height:"100px",borderRadius:"50%"}} src="/assests/boy.jpg"/>
                            <p className="m-0" style={{fontSize:"16px",fontWeight:600}}>Edward Cullen</p>
                            <span style={{fontSize:"14px",fontWeight:400}}>Product Manager</span>
                          </div>
                      </div>
                      <div className="col-lg-2 d-flex justify-content-center align-items-center">
                        <div>
                          <p className="m-0" style={{fontSize:"14px",fontWeight:400}}>Emp Id</p>
                          <p style={{fontSize:"14px",fontWeight:600}}>123456</p>
                        </div>
                      </div>
                      <div className="col-lg-3 d-flex justify-content-center align-items-center">
                        <div>
                          <p className="m-0" style={{fontSize:"14px",fontWeight:400}}>Email Id</p>
                          <p style={{fontSize:"14px",fontWeight:600}}>ed324@gmail.com</p>
                        </div>  
                      </div>
                      <div className="col-lg-2 d-flex justify-content-center align-items-center">
                        <div>
                          <p className="m-0" style={{fontSize:"14px",fontWeight:400}}>Type</p>
                          <p style={{fontSize:"14px",fontWeight:600}}>Sick Leave</p>
                        </div>
                      </div>
                      <div className="col-lg-2 text-end">
                          <RxCross2 style={{cursor:"pointer",fontSize:"30px"}} onClick={handleLeavereqclose}/>
                      </div>
                    </div>
                    <div className="row">
                      <h6 style={{fontSize:"14px",fontWeight:600}}>Good Morning sir/ Madam ,</h6>
                      <p style={{textIndent:"60px"}}>As i am suffering from heave fever for past two days  and today i’m unable to get from my bed please grant me leave for today . I will ensure that smooth transition responsible during my absence .</p>
                      <h6 style={{fontSize:"14px",fontWeight:600}}>Thank you sir/ Madam </h6>
                    </div>
                    <div className='text-center pt-5'>
                      <Button className='mx-3' variant='contained' style={{width:"139px",height:"45px",backgroundColor:"black",borderRadius:"0px"}}>Approve</Button>
                      <Button className='mx-3' variant='contained' style={{width:"139px",height:"45px",backgroundColor:"black",borderRadius:"0px"}}>Deny</Button>
                    </div>
              </Box>
            </Modal>



            {value==="Approved"?<section className='pt-4'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Types</TableCell>
                    <TableCell className='tableHead'>Start date</TableCell>
                    <TableCell className='tableHead'>End date</TableCell>
                    <TableCell className='tableHead'>Total hrs</TableCell>
                    <TableCell className='tableHead'>Notes </TableCell>
                    <TableCell className='tableHead'>Status </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {employeeInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Name}</TableCell>
                        <TableCell className='tablebody'>{row.Types}</TableCell>
                        <TableCell className='tablebody'>{row.Startdate}</TableCell>
                        <TableCell className='tablebody'>{row.Enddate}</TableCell>
                        <TableCell className='tablebody'>{row.Totalhrs}</TableCell>
                        <TableCell className='tablebody'><p className='m-0' style={{textDecoration:"underline",cursor:"pointer"}} onClick={handleLeavereqOpen}>View Note</p></TableCell>
                        <TableCell className='tablebody'>{row.Status?<><div style={{width:"20px",height:"20px",backgroundColor:"green",borderRadius:"50%"}} className='d-flex justify-content-center align-items-center'><TiTick style={{color:"white"}}/></div></>:<><div style={{width:"20px",height:"20px",backgroundColor:"red",borderRadius:"50%"}} className='d-flex justify-content-center align-items-center'><RxCross2 style={{color:"white"}}/></div></>}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={employeeInfo.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                />
            </TableContainer>

            </section>:""}


            {value==="Denied"?<section className='pt-4'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Types</TableCell>
                    <TableCell className='tableHead'>Start date</TableCell>
                    <TableCell className='tableHead'>End date</TableCell>
                    <TableCell className='tableHead'>Total hrs</TableCell>
                    <TableCell className='tableHead'>Notes </TableCell>
                    <TableCell className='tableHead'>Status </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {employeeInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Name}</TableCell>
                        <TableCell className='tablebody'>{row.Types}</TableCell>
                        <TableCell className='tablebody'>{row.Startdate}</TableCell>
                        <TableCell className='tablebody'>{row.Enddate}</TableCell>
                        <TableCell className='tablebody'>{row.Totalhrs}</TableCell>
                        <TableCell className='tablebody'><p className='m-0' style={{textDecoration:"underline",cursor:"pointer"}} onClick={handleLeavereqOpen}>View Note</p></TableCell>
                        <TableCell className='tablebody'>{row.Status?<><div style={{width:"20px",height:"20px",backgroundColor:"green",borderRadius:"50%"}} className='d-flex justify-content-center align-items-center'><TiTick style={{color:"white"}}/></div></>:<><div style={{width:"20px",height:"20px",backgroundColor:"red",borderRadius:"50%"}} className='d-flex justify-content-center align-items-center'><RxCross2 style={{color:"white"}}/></div></>}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={employeeInfo.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                />
            </TableContainer>

            </section>:""}

        </section>
    </>
  )
}

export default Allrequest
