import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, { useState } from 'react'


const recurringArray=[{
    Customername:"John",
    Profilename :"Recurring invoice 1",
    Frequency :"Weekly",
    Lastinvoicedate:"20/02/2024",
    Nextinvoicedate :"28/02/2024",
    Status:"Active",
    Amount :"1,000.00"
},{
    Customername:"John",
    Profilename :"Recurring invoice 1",
    Frequency :"Weekly",
    Lastinvoicedate:"20/02/2024",
    Nextinvoicedate :"28/02/2024",
    Status:"Active",
    Amount :"1,000.00"
}]

const Recurringinvoice = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    
    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      const handleChangePage = (event:any, newPage:any) => {
        setPage(newPage);
      };
    return (
        <>
            <section className='p-4' style={{marginLeft:"95px"}}>
                <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1'>Credit notes</h2>
                </div><hr className='m-0' />
                <div className='text-end pt-3'>
                    <Button className='nextBtn' style={{ color: "#fff" }}>New</Button>
                </div>
                <TableContainer component={Paper} className='pt-3'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ border: "1px solid #A7A7A7" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tableHead'>Name</TableCell>
                                    <TableCell className='tableHead'>Company name</TableCell>
                                    <TableCell className='tableHead'>Email</TableCell>
                                    <TableCell className='tableHead'>Work phone</TableCell>
                                    <TableCell className='tableHead'>Receivables</TableCell>
                                    <TableCell className='tableHead'>Unused credits</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recurringArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                    <TableRow
                                        hover
                                        key={i}
                                        style={{cursor:"pointer"}}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >  
                                        <TableCell component="th" scope="row" className='tablebody'>
                                            {row.Customername}
                                        </TableCell>
                                        <TableCell className='tablebody'>{row.Profilename}</TableCell>
                                        <TableCell className='tablebody'>{row.Frequency}</TableCell>
                                        <TableCell className='tablebody'>{row.Lastinvoicedate}</TableCell>
                                        <TableCell className='tablebody'>{row.Nextinvoicedate}</TableCell>
                                        <TableCell className='tablebody'>{row.Status}</TableCell>
                                        <TableCell className='tablebody'>$ {row.Amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={recurringArray.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='pt-4 px-4' />
                    </TableContainer>
            </section>
        </>
    )
}

export default Recurringinvoice
