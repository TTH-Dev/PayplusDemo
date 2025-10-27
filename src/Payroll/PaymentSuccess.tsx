import { Button } from '@mui/material'
import React from 'react'

const PaymentSuccess = () => {
  return (
    <>
      <section className='p-4' style={{marginTop:"6rem"}}>
        <div>
            <div className='row justify-content-center'>
                <div className='col-lg-6  p-5'  style={{backgroundColor:"white"}}>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='col-lg-6'>
                            <img className='img-fluid' src='/assests/payroll/Group 400.png' style={{width:"100%"}}/>
                        </div>
                        <div className='col-lg-6 text-center'>
                            <h2 style={{fontSize:"22px",fontWeight:"600"}}>Done !</h2>
                            <p style={{fontSize:"18px",fontWeight:"600"}}>The amount has successfully transfer</p>
                        </div>
                    </div>
                    <div className='pt-4'>
                        <span style={{fontSize:"1rem",fontWeight:"600"}}>Total amount</span>
                        <h1><strong>$</strong>60.00</h1>
                    </div>
                </div>
            </div>
            <div className='row justify-content-center pt-4'>
                <div className='col-lg-6 text-end p-0'>
                    <Button variant="contained" className='donePaymentbtn'>Done</Button>
                </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default PaymentSuccess;
