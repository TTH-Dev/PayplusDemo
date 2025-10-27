import { Box, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { MdEdit } from "react-icons/md";
import "./Sales.css"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Select, Space } from 'antd';
import { HiDownload } from "react-icons/hi";




const invoiceData=[{
    date:"25-02-2024",
    invoiceNum:"78459",
    Ordernumber:"",
    Amount:"5.00",
    Balancedue:"5.00",
    Status:"Paid"  
}]

const cusPaymentData=[{
    Date:"25-02-2024",
    Paymentno:"78459",
    Referenceno:"",
    Paymentmode:"Cash",
    Amountreceived:"5.00",
    Usedamount:"5.00"
}]

const estimateData=[{
    Date:"25-02-2024",
    Estimate:"78459",
    Referenceno:"",
    Amount:"5.00",
    Status:"Invoiced"   
}]

const retainerData=[{
    Date:"25-02-2024",
    retainerinvoiceno:"78459",
    Referenceno:"",
    Amount:"5.00",
    balancedue:"5.00",
    Status:"Paid" 
}]

const deliverychallanData=[{
    Date:"25-02-2024",
    Referenceno:"",
    Deliverychallan:"",
    Amount:"5.00",
    Status:"Open" 
}]

const recurringInvoiceData=[{
    Profilename:"Recuring invoice 1",
    Frequency:"Net 20",
    Lastinvoicedate:"20-01-2024",
    Nextinvoicedate:"20-01-2024",
    Status:"Active"
}]

const expenseData=[{
    Date:"25-02-2024",
    Expensecategory:"78459",
    Invoiceno:"",
    Amount:"5.00",
    Status:"Invoice"     
}]

const recuringexpenseData=[{
    Profile:"Monthly retainer",
    Expensecategory :"Employee wages",
    Frequency:"1 year",
    Lastexpensedate:"10-02-2024",
    Nextexpensedate :"10-02-2024",
    Status:"Active" 
}]

const billsData=[{
    Date:"25-02-2024",
    Bill:"78459",
    Ordernumber:"",
    Vendorname:"Shradha",
    Amount:"5.00",
    Balancedue:"5.00",
    Status:"Open"  
}]

const creditnotesData=[{
    Date:"25-02-2024",
    Creditnoteno:"78459",
    Referenceno:"",
    Amount:"5.00",
    Balancedue:"5.00",
    Status:"Open" 
}]

const CustomerOverview = () => {
    const [value, setValue] = useState('Overview');

    const handleDropChange = (value: string) => {
        console.log(`selected ${value}`);
      };
    
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      };


    return (
        <>
        <section className='p-4' style={{marginLeft:"95px"}}>
            <div>
                <span style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }} className='m-0 p-1 d-inline-flex justify-content-start align-items-center'><MdKeyboardArrowLeft style={{ fontWeight: 600, fontSize: "2rem" }} />John Customer</span>
                </div><hr className='m-0' />
                <div className='d-flex'>
                    <Box sx={{ width: '100%' }}>
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    >
                    <Tab
                    value="Overview"
                    label="Overview"
                    />
                    <Tab value="Transaction" label="Transaction" />
                    <Tab value="Statement" label="Statement" />
                    </Tabs>
                    </Box>
                    <div className='d-flex align-items-center'>
                        <span className='d-flex justify-content-center align-items-center'  style={{borderBottom:"1px solid black",borderBottomStyle:"dotted",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>Download <HiDownload/></span>
                    </div>
                </div>
                <hr className='m-0'/>
                </section>
                {value==="Overview"?
                <section className='px-4 pb-4' style={{marginLeft:"95px"}} id='overview'>
                <div className='d-flex justify-content-between align-items-center pb-3'>
                    <div><h6 style={{fontSize:"14px",fontWeight:600,marginBottom:"0px"}}>Billing address</h6></div>
                    <div><a style={{borderBottom:"1px solid black",borderBottomStyle:"dotted",cursor:"pointer"}}>Edit<MdEdit/></a></div>
                </div>
                <p className='cusOver-P'>John</p>
                <p className='cusOver-P'>159, John Main cross street</p>
                <p className='cusOver-P'>Chennai - 600014</p>
                <p className='cusOver-P'>Phone : 7845789562</p>
                <p className='cusOver-P'>FAX No : 1-781-730-9200 x6970</p>
                <h6 style={{fontSize:"14px",fontWeight:600}} className='py-2'>Billing address </h6>
                <p className='cusOver-P'>John</p>
                <p className='cusOver-P'>159, John Main cross street</p>
                <p className='cusOver-P'>Chennai - 600014</p>
                <p className='cusOver-P'>Phone : 7845789562</p>
                <p className='cusOver-P'>FAX No : 1-781-730-9200 x6970</p>
                <h6 style={{fontSize:"14px",fontWeight:600}} className='py-2'>Other details</h6>
                <p className='cusOver-P'>Customer type : Individual </p>
                <p className='cusOver-P'>Prize list : amt</p>
                <p className='cusOver-P'>Payment term : Due end of the month</p>
                <p className='cusOver-P'>Place of supply : - </p>
        </section>:""}

        {value==="Transaction"?
        <section className='px-4 pb-4' style={{marginLeft:"95px"}}>
        <div>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                >
                Invoice
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Invoice number</TableCell>
                    <TableCell className='tableHead'>Order number</TableCell>
                    <TableCell className='tableHead'>Amount</TableCell>
                    <TableCell className='tableHead'>Balance due</TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {invoiceData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.date?row.date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.invoiceNum?row.invoiceNum:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Ordernumber?row.Ordernumber:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Balancedue?row.Balancedue:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </AccordionDetails>
            </Accordion>

            <Accordion className='mt-3'> 
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                >
                Customer payment
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Payment no</TableCell>
                    <TableCell className='tableHead'>Reference no</TableCell>
                    <TableCell className='tableHead'>Payment mode</TableCell>
                    <TableCell className='tableHead'>Amount received </TableCell>
                    <TableCell className='tableHead'>Used amount</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {cusPaymentData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date?row.Date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Paymentno?row.Paymentno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Referenceno?row.Referenceno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Paymentmode?row.Paymentmode:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amountreceived?row.Amountreceived:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Usedamount?row.Usedamount:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
                </AccordionDetails>
            </Accordion>
            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                Estimates
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Estimate</TableCell>
                    <TableCell className='tableHead'>Reference no</TableCell>
                    <TableCell className='tableHead'>Amount</TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {estimateData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date?row.Date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Estimate?row.Estimate:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Referenceno?row.Referenceno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>
            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                Retainer Invoice
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Retainer Invoice number</TableCell>
                    <TableCell className='tableHead'>Reference no</TableCell>
                    <TableCell className='tableHead'>Amount</TableCell>
                    <TableCell className='tableHead'>Balance due</TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {retainerData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    > 
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date?row.Date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.retainerinvoiceno?row.retainerinvoiceno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Referenceno?row.Referenceno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.balancedue?row.balancedue:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>


            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                    Delivery challan
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Reference no</TableCell>
                    <TableCell className='tableHead'>Delivery challan</TableCell>
                    <TableCell className='tableHead'>Amount</TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {deliverychallanData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >  
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date?row.Date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Referenceno?row.Referenceno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Deliverychallan?row.Deliverychallan:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>



            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                    Recurring Invoice
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Profile name</TableCell>
                    <TableCell className='tableHead'>Frequency</TableCell>
                    <TableCell className='tableHead'>Last invoice date</TableCell>
                    <TableCell className='tableHead'>Next invoice date</TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {recurringInvoiceData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >  
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Profilename?row.Profilename:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Frequency?row.Frequency:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Lastinvoicedate?row.Lastinvoicedate:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Nextinvoicedate?row.Nextinvoicedate:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>


            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                   Expense 
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Expense category </TableCell>
                    <TableCell className='tableHead'>Invoice no</TableCell>
                    <TableCell className='tableHead'>Amount</TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {expenseData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >   
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date?row.Date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Expensecategory?row.Expensecategory:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Invoiceno?row.Invoiceno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>


            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                   Recurring expense  
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Profile</TableCell>
                    <TableCell className='tableHead'>Expense category </TableCell>
                    <TableCell className='tableHead'>Frequency</TableCell>
                    <TableCell className='tableHead'>Last expense date </TableCell>
                    <TableCell className='tableHead'>Next expense date </TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {recuringexpenseData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >   
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Profile?row.Profile:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Expensecategory?row.Expensecategory:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Frequency?row.Frequency:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Lastexpensedate?row.Lastexpensedate:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Nextexpensedate?row.Nextexpensedate:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>


            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                  Bills  
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Bill</TableCell>
                    <TableCell className='tableHead'>Order number </TableCell>
                    <TableCell className='tableHead'>Vendor name</TableCell>
                    <TableCell className='tableHead'>Amount</TableCell>
                    <TableCell className='tableHead'>Balance due </TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {billsData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >  
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date?row.Date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Bill?row.Bill:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Ordernumber?row.Ordernumber:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Vendorname?row.Vendorname:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Balancedue?row.Balancedue:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>


            <Accordion className='mt-3'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                >
                  Credit notes  
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>Date</TableCell>
                    <TableCell className='tableHead'>Credit note no</TableCell>
                    <TableCell className='tableHead'>Reference no</TableCell>
                    <TableCell className='tableHead'>Amount</TableCell>
                    <TableCell className='tableHead'>Balance due</TableCell>
                    <TableCell className='tableHead'>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {creditnotesData.map((row,i)=>(
                    <TableRow
                    hover
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >    
                        <TableCell component="th" scope="row" className='tablebody'>
                            {row.Date?row.Date:"-"}
                        </TableCell>
                        <TableCell className='tablebody'>{row.Creditnoteno?row.Creditnoteno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Referenceno?row.Referenceno:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Amount?row.Amount:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Balancedue?row.Balancedue:"-"}</TableCell>
                        <TableCell className='tablebody'>{row.Status?row.Status:"-"}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </TableContainer>
                </AccordionDetails>
            </Accordion>
        </div>
        </section>:""}
        
        {value==="Statement"?
        <section className='px-4 pb-4' style={{marginLeft:"95px"}}>
            <div className='pb-4'>
            <Select
                id='dropstatement'
                defaultValue="This Week"
                style={{ width: 120}}
                onChange={handleDropChange}
                options={[
                    { value: 'Today', label: 'Today' },
                    { value: 'This Week', label: 'This Week' },
                    { value: 'This Month', label: 'This Month' },
                    { value: 'This Quarter', label: 'This Quarter' },
                    { value: 'This Year', label: 'This Year' },
                    { value: 'Yesterday', label: 'Yesterday' },
                    { value: 'Previous Week', label: 'Previous Week' },
                    { value: 'Previous Month', label: 'Previous Month' },
                    { value: 'This Month', label: 'This Month' },
                ]}
                />
            </div>
            <div style={{border:"1px solid black"}} className='mb-3' id='statement'>
                <div className='row p-4'>
                    <div className='col-lg-6'>
                        <h5 style={{fontSize:"14px",fontWeight:600}}>Company Name</h5>
                        <p className='mb-1' style={{fontSize:"14px",fontWeight:400}}>159 , Main cross street </p>
                        <p style={{fontSize:"14px",fontWeight:400}}>Chennai -  600014</p>
                    </div>
                    <div className='col-lg-6 d-flex justify-content-end'>
                        <div>
                            <h5 style={{fontSize:"14px",fontWeight:600}}>Bill</h5>
                            <p style={{fontSize:"14px",fontWeight:400}} className='mb-1'>Number - BIL-1001</p>
                            <p style={{fontSize:"14px",fontWeight:400}} className='mb-1 pb-3'>Bill date : 24 / 03/ 2024</p>
                            <p style={{fontSize:"14px",fontWeight:400}} className='mb-1'>Due date : 24 / 03/ 2024</p>
                            <p style={{fontSize:"14px",fontWeight:400}}>Terms  : Pay on receipt</p>
                        </div>
                    </div>
                </div>
                <div>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                <TableRow>
                    <TableCell className='tableHead'>No</TableCell>
                    <TableCell className='tableHead'>Item & description</TableCell>
                    <TableCell className='tableHead'>Qty</TableCell>
                    <TableCell className='tableHead'>Amt</TableCell>
                    <TableCell className='tableHead'>Rate</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
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
                    <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row" className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'>Sub total</TableCell>
                        <TableCell className='tablebodyT'>$ 5.00</TableCell>
                    </TableRow>
                    <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row" className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'>Total</TableCell>
                        <TableCell className='tablebodyT'>$ 5.00</TableCell>
                    </TableRow>
                    <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row" className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'></TableCell>
                        <TableCell className='tablebodyT'>Balance due</TableCell>
                        <TableCell className='tablebodyT'>$ 5.00</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
                </div>
            </div>
        </section>:""}
        </>
    )
}

export default CustomerOverview
