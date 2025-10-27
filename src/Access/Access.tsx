import { Box, MenuItem, Paper, SelectChangeEvent, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { Select, Space } from 'antd';
import "./Access.css"


const accessEmployee=[{
    Empid:"78000605780",
    Name:"John Fedrick",
    Mode:"Office",
    Department :"Production",
    Biometric :"",
    Access:"Active"
},{
    Empid:"78000605780",
    Name:"John Fedrick",
    Mode:"Office",
    Department :"Production",
    Biometric :"Fingerprint",
    Access:"Active"
}]

const Access = () => {

    const [value, setValue] = useState('Employee');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      };

      const handleChangeMode = (value: string) => {
        console.log(`selected ${value}`);
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
                <h2 style={{ fontSize: "1.2rem", fontWeight: "600",cursor:"pointer" }} className='m-0 p-1' >Team</h2>
            </div><hr className='m-0' />
   
            <div className='d-flex'>
                <Box sx={{ width: '100%' }}>
                <Tabs
                value={value}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
                >
                <Tab
                value="Employee"
                label="Employee"
                />
                <Tab value="HR" label="HR" />
                <Tab value="Admin" label="Admin" />
                </Tabs>
                </Box>
            </div>
            <hr className='m-0'/>


            {value==="Employee"?<section className='pt-4'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Emp id</TableCell>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Mode</TableCell>
                    <TableCell className='tableHead'>Department</TableCell>
                    <TableCell className='tableHead'>Biometric</TableCell>
                    <TableCell className='tableHead'>Access</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {accessEmployee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >   
                        <TableCell component="th" scope="row" className=''>
                            {row.Empid}
                        </TableCell>
                        <TableCell className=''>{row.Name}</TableCell>
                        <TableCell className='tablebody'>   
                        <Select
                            defaultValue="Office"
                            style={{ width: 120 }}
                            onChange={handleChangeMode}
                            variant="borderless"
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                            ]}
                        />
                        </TableCell>
                        <TableCell className=''>
                        <Select
                            defaultValue="Production"
                            style={{ width: 120 }}
                            onChange={handleChangeMode}
                            variant="borderless"
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                            ]}
                        />
                        </TableCell>
                        <TableCell className=''>{row.Biometric===""?"-":row.Biometric}</TableCell>
                        <TableCell className='tablebody'>
                        <Select
                            defaultValue="Active"
                            style={{ width: 120}}
                            onChange={handleChangeMode}
                            variant="borderless"
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
                            ]}
                        />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={accessEmployee.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                />
            </TableContainer>

            </section>:""}


            {value==="HR"?<section className='pt-4'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Emp id</TableCell>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Mode</TableCell>
                    <TableCell className='tableHead'>Access</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {accessEmployee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >   
                        <TableCell component="th" scope="row" className=''>
                            {row.Empid}
                        </TableCell>
                        <TableCell className=''>{row.Name}</TableCell>
                        <TableCell className='tablebody'>   
                        <Select
                            defaultValue="Office"
                            style={{ width: 120 }}
                            onChange={handleChangeMode}
                            variant="borderless"
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                            ]}
                        />
                        </TableCell>
                        <TableCell className='tablebody'>
                        <Select
                            defaultValue="Active"
                            style={{ width: 120}}
                            onChange={handleChangeMode}
                            variant="borderless"
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
                            ]}
                        />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={accessEmployee.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                />
            </TableContainer>

            </section>:""}


            {value==="Admin"?<section className='pt-4'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Emp id</TableCell>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Mode</TableCell>
                    <TableCell className='tableHead'>Access</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {accessEmployee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >   
                        <TableCell component="th" scope="row" className=''>
                            {row.Empid}
                        </TableCell>
                        <TableCell className=''>{row.Name}</TableCell>
                        <TableCell className='tablebody'>   
                        <Select
                            defaultValue="Office"
                            style={{ width: 120 }}
                            onChange={handleChangeMode}
                            variant="borderless"
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                            ]}
                        />
                        </TableCell>
                        <TableCell className='tablebody'>
                        <Select
                            defaultValue="Active"
                            style={{ width: 120}}
                            onChange={handleChangeMode}
                            variant="borderless"
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
                            ]}
                        />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={accessEmployee.length}
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

export default Access
