import React, { useState } from 'react'
import "./Item.css"
import { Button, MenuItem, Paper, Select, SelectChangeEvent, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, styled } from '@mui/material'
import { FaChevronLeft } from "react-icons/fa";

const itemData=[{
    Name:"Note pad",
    Description:"",
    SKU:"Item 1",
    Rate:"8.00",
    Type:"Goods"
},{
    Name:"Note pad",
    Description:"",
    SKU:"Item 1",
    Rate:"8.00",
    Type:"Goods"
}]

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 30,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#187ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));

const Item = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [isNewitem,setIsnewItem]=useState(false)

    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      const handleChangePage = (event:any, newPage:any) => {
        setPage(newPage);
      };

      const handleAccount = (event: SelectChangeEvent<string>) => {
        console.log(`selected ${event.target.value}`);
      };

    return (
        <>
            <section className='p-4'>
                <div className='pb-1'>
                    <span style={{ fontSize: "1.2rem", fontWeight: "600",cursor:"pointer" }}  onClick={()=>setIsnewItem(false)} className='m-0 p-1' >{!isNewitem?"Item":<><FaChevronLeft className='me-3'/>New Item</>}</span>
                </div><hr className='m-0' />
                {!isNewitem?<div>
                <div className='text-end pt-3'>
                    <Button variant='contained' className='nextBtn' onClick={()=>setIsnewItem(true)}>New</Button>
                </div>

                <TableContainer component={Paper} className='pt-3'>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{border:"1px solid #A7A7A7"}}>
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Name</TableCell>
                    <TableCell className='tableHead'>Description</TableCell>
                    <TableCell className='tableHead'>SKU</TableCell>
                    <TableCell className='tableHead'>Rate</TableCell>
                    <TableCell className='tableHead'>Type</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {itemData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i)=>(
                    <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Name}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Description===""?"-":row.Description}</TableCell>
                        <TableCell className='tablebody'>{row.SKU}</TableCell>
                        <TableCell className='tablebody'>$ {row.Rate}</TableCell>
                        <TableCell className='tablebody'>{row.Type}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={itemData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='pt-4 px-4'
                />
            </TableContainer>
            </div>:     <div>
                <form>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Customer type</label><br/>
                    <div className='d-flex'>
                        <input type='Checkbox' style={{width:"20px",height:"20px",marginRight:"10px"}}/><span style={{fontSize:"14px",fontWeight:600}}>Goods</span>
                        <input type='Checkbox' style={{width:"20px",height:"20px",marginRight:"10px",marginLeft:"3rem"}}/><span style={{fontSize:"14px",fontWeight:600}}>Service</span>
                    </div>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Name</label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Unit</label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>SKU</label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Tax</label><br/>
                    <input style={{width:"505px",height:"45px"}}/>
                    <div style={{width:"505px"}} className='d-flex justify-content-between align-items-center pt-3 pb-3'>
                        <div><p className='m-0' style={{fontSize:"14px",fontWeight:600}}>Sales information</p></div>
                        <div>  
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                        </Stack>
                        </div>
                    </div>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Selling price</label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Account</label><br/>
                    <Select
                        style={{ width: "505px", height: 45 }}
                        onChange={(event: SelectChangeEvent<string>) => handleAccount(event)}
                        value={''} 
                        >
                        <MenuItem value="jack">Jack</MenuItem>
                        <MenuItem value="lucy">Lucy</MenuItem>
                        <MenuItem value="Yiminghe">Yiminghe</MenuItem>
                    </Select><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Description</label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <div style={{width:"505px"}} className='d-flex justify-content-between align-items-center pt-3 pb-3'>
                        <div><p className='m-0' style={{fontSize:"14px",fontWeight:600}}>Purchase information</p></div>
                        <div>  
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                        </Stack>
                        </div>
                    </div>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Cost price</label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Account</label><br/>
                    <Select
                        style={{ width: "505px", height: 45 }}
                        onChange={(event: SelectChangeEvent<string>) => handleAccount(event)}
                        value={''} 
                        >
                        <MenuItem value="jack">Jack</MenuItem>
                        <MenuItem value="lucy">Lucy</MenuItem>
                        <MenuItem value="Yiminghe">Yiminghe</MenuItem>
                    </Select><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Description</label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <label style={{fontSize:"14px"}} className='pb-3 pt-3'>Preferred vendor </label><br/>
                    <input style={{width:"505px",height:"45px"}}/><br/>
                    <div className='d-flex justify-content-between align-items-center pt-5'>
                        <Button className='p-0' style={{borderBottom:"1px solid black",borderBottomStyle:"dotted",borderRadius:"0%",color:"black"}}>Cancel</Button>
                        <Button className='nextBtn' variant='contained'>Save</Button>
                    </div>
                </form>
            </div>}
            </section>  
        </>
    )
}

export default Item
