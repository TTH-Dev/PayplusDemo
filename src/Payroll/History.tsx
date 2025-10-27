import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { HiDownload } from "react-icons/hi";
import { IoIosCheckmarkCircle } from "react-icons/io";


const History = () => {
    const [value, setValue] = React.useState('History');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      };
      const handleChangePage = (event:any, newPage:any) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };


      const historyData=[{
        EmpName:"John",
        title:"Owner",
        EmpId:"85553655",
        Date:"15-02-2024",
        Time:"15-02-2024",
        Rate:"10,0000",
        Status:true
      },{
        EmpName:"John",
        title:"Owner",
        EmpId:"85553655",
        Date:"15-02-2024",
        Time:"15-02-2024",
        Rate:"10,0000",
        Status:false
      }]


      const summaryData=[{
        EmpName:"John",
        title:"Owner",
        EmpId:"85553655",
        Date:"15-02-2024",
        Time:"15-02-2024",
        Rate:"10,0000",
      },{
        EmpName:"John",
        title:"Owner",
        EmpId:"85553655",
        Date:"15-02-2024",
        Time:"15-02-2024",
        Rate:"10,0000",
      }]
  return (
    <>
      <section className='p-4 pt-0' style={{ backgroundColor: "#FFF" }}>
            <div className='d-flex'>
            <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="wrapped label tabs example"
                    >
                        <Tab
                        value="History"
                        label="History"
                        />
                        <Tab value="Summary" label="View Summary" />
                    </Tabs>
            </Box>
           
            </div>
            <hr className='m-0'/>
            
            <div className='pt-4'>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid black"}}>
                        <TableHead>
                        <TableRow>
                            <TableCell className='tableHead'>Emp Name</TableCell>
                            <TableCell className='tableHead'>Emp Id</TableCell>
                            <TableCell className='tableHead'>Date</TableCell>
                            <TableCell className='tableHead'>Time </TableCell>
                            <TableCell className='tableHead'>Rate </TableCell>
                            <TableCell className='tableHead'>Status </TableCell>
                            <TableCell className='tableHead'>{value==="Summary"&&  "Download"}</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {value==="History"?(historyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).map((row,i) => (
                            <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" className='tablebody'>
                                   {row.EmpName}<p style={{fontWeight:"500"}}>{row.title}</p>
                                </TableCell>
                                <TableCell className='tablebody'>{row.EmpId}</TableCell>
                                <TableCell className='tablebody'>{row.Date}</TableCell>
                                <TableCell className='tablebody'>{row.Time}</TableCell>
                                <TableCell className='tablebody'>{row.Rate}</TableCell>
                                <TableCell className='tablebody'><IoIosCheckmarkCircle style={{color:row.Status?"green":"red",fontSize:"1.3rem"}}/></TableCell>

                            </TableRow>
                        )):(summaryData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).map((row,i) => (
                            <TableRow
                            hover
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row" className='tablebody'>
                            {row.EmpName}<p style={{fontWeight:"500"}}>{row.title}</p>
                            </TableCell>
                            <TableCell className='tablebody'>{row.EmpId}</TableCell>
                            <TableCell className='tablebody'>{row.Date}</TableCell>
                            <TableCell className='tablebody'>{row.Time}</TableCell>
                            <TableCell className='tablebody'>{row.Rate}</TableCell>

                            <TableCell className='tablebody'>View Note</TableCell>

                            <TableCell className='tablebody'><HiDownload/></TableCell>

                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={value==="History"?historyData.length:summaryData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='pt-4'
                        />
                </TableContainer>
            </div>
        </section>
    </>
  )
}

export default History;
