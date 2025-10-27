import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Sidebarnav from '../Navbar/Sidebarnav'
import Header from '../Home/Header'
import Schedule from '../Schedule/Schedule'
import HomeMain from '../Home/HomeMain'
import CreateAccount from '../Login/CreateAccount'
import OTPVerify from '../Login/OTPVerify'
import Login from '../Login/Login'
import Resetpassowrd from '../Login/Resetpassowrd'
import ForgetpassOTP from '../Login/ForgetpassOTP'
import HomeView from '../Home/HomeView'
import Teamemp from '../Team/Teamemp'
import ViewEmp from '../Team/ViewEmp'
import SalaryDetail from '../Team/SalaryDetail'
import NewShift from '../Schedule/NewShift'
import AssignEmpAdd from '../Schedule/AssignEmpAdd'
import Subscription from '../Subscription/Subscription'
import Accountaccess from '../Subscription/Accountaccess'
import Settings from '../settings/Settings'
import OrganizationDetails from '../settings/OrganizationDetails'
import AddEmployeeTemplate from '../settings/AddTemplate/AddEmployeeTemplate'
import Notice from '../settings/Notice'
import AttendanceLocation from '../settings/AddTemplate/AttendanceLocation'
import NewLocation from '../settings/AddTemplate/NewLocation'
import { Calendar } from 'antd'
import EditTeam from '../Team/EditTeam'
import EditAssignEmpAdd from '../Schedule/EditShiftAllocation'
import Sales from '../Sales/Sales'

import AddInvoice from '../Sales/Invoice/AddInvoice'
import CustomerDetailsMain from '../Sales/Customer/CustomerDetailsMain'
import Customer from '../Sales/Customer/Customer'
import AddCustomer from '../Sales/Customer/AddCustomer'
import Quotation from '../Sales/Quotation/Quotation'
import AddQuotation from '../Sales/Quotation/AddQuotation'
import InvTemp from '../Sales/Invoice/InvTemp'
import Invoice from '../Sales/Invoice/Invoice'
import PaymentStatement from '../Sales/PaymentStatement/PaymentStatement'
import PaymentReceived from '../Sales/PaymentReceived/PaymentReceived'
import AddPaymentReceived from '../Sales/PaymentReceived/AddPaymentReceived'
import PaymentStatementReceipt from '../Sales/PaymentStatement/PaymentStatementReceipt'
import PaymentReceivedReceipt from '../Sales/PaymentReceived/PaymentReceivedReceipt'
import AddPaymentStatement from '../Sales/PaymentStatement/AddPaymentStatement'
import QuotationReceipt from '../Sales/Quotation/QuotationReceipt'
import EditInvoice from '../Sales/Invoice/EditInvoice'

import Attendance from '../Attendance/Attendance'
import Payroll from '../Payroll/Payroll'
import Admintask from '../AdminTask/Admintask'
import HospitalManagement from '../AdminTask/HospitalManagement/ProjectPage'
import EmpTask from '../EmpTask/EmpTask'
import HospitalManagementemp from '../EmpTask/HospitalManagementemp/ProjectPageEmp'
import ReporterTask from '../ReporterTask/ReporterTask'
import HospitalManagementrep from '../ReporterTask/HospitalManagementrep/HospitalManagementrep'
import ProjectPage from '../AdminTask/HospitalManagement/ProjectPage'
import AttendanceReport from '../Attendance/AttendanceReport'
import ProjectPageEmp from '../EmpTask/HospitalManagementemp/ProjectPageEmp'
import ViewAssignEmp from '../Schedule/ViewAssignEmp'
import ViewShift from '../Schedule/ViewShift'
import PayrollTable from '../Payroll/custompayroll'



const Routing = () => {

  const [isUser, setisUser] = useState(false)

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authtoken');
      if (token === null) {
        setisUser(false)
      } else {
        setisUser(true)
      }
      // setisUser(!!token);
    };

    checkToken();

    const handleStorageChange = () => {
      checkToken();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [sideBar, setSideBar] = useState(false)
  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath && currentPath !== '/') {
      setSideBar(true);
    } else {
      setSideBar(false);
    }
  }, [window.location.pathname]);


  return (
    <>
      <BrowserRouter>
        {!isUser ?
          <Routes>
            <Route path='/' element={<CreateAccount />} />
            <Route path='/verification' element={<OTPVerify />} />
            <Route path='/login' element={<Login />} />
            <Route path='/reset-password/:id' element={<Resetpassowrd />} />
            <Route path='/verification-otp' element={<ForgetpassOTP />}></Route>
          </Routes> :
          <div className='d-flex '>

            <div style={{ backgroundColor: "#F6F6F6", position: "fixed", zIndex: 1200, overflow: "hidden" }}>
              <Sidebarnav />
            </div>
            <div style={{ width: "100%", marginLeft: "0px" }}>
              <Header />
              <div style={{ marginTop: "4.5rem", marginLeft: "100px" }}>
                <Routes>
                  <Route path='/' element={<HomeMain />} />
                  <Route path='/Home' element={<HomeView />} />
                  <Route path='/Team' element={<Teamemp />} />
                  <Route path='/EmployeeDetails/:id' element={<ViewEmp />} />
                  <Route path='/SalaryDetails/:id' element={<SalaryDetail />} />
                  <Route path='/Schedule' element={<Schedule />} />

                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/attendance/report" element={<AttendanceReport />} />

                  <Route path='/Payroll' element={<Payroll />} />
                  <Route path='/Payroll-customize' element={<PayrollTable />} />
                  

                  <Route path='/Admintask' element={<Admintask />}>
                    {/* <Route index element={<Navigate to="hospital-management" replace />} />  */}
                    <Route path=':projectName' element={<ProjectPage />} /> {/* dynamic for all projects */}
                  </Route>
                  {/* <Route path="/hospital-management/todo" element={<TodoPage />} /> */}

                  <Route path="/emptask" element={<EmpTask />}>
                    <Route path=":projectPath" element={<ProjectPageEmp />} />
                  </Route>



                  <Route path='/reportertask' element={<ReporterTask />}>
                    <Route index element={<Navigate to="hospital-management" replace />} />
                    <Route path='hospital-management' element={<HospitalManagementrep />} />
                  </Route>
                  <Route path="/Newshift" element={<NewShift />} />        {/* Add new */}
                  <Route path="/Newshift/:shiftId" element={<NewShift />} /> {/* Edit existing */}

                  <Route path='/NewAssignemployee' element={<AssignEmpAdd />} />
                  <Route path='/viewAssignemployee/:shiftId' element={<ViewAssignEmp />} />
                  <Route path='/viewShift/:shiftId' element={<ViewShift />} />
                  <Route path='/Subscription' element={<Subscription />} />
                  <Route path='/Sales' element={<Sales />}>
                    <Route path='customer' element={<Customer />} />
                    <Route path='quotation' element={<Quotation />} />
                    <Route path='quotation/add-quotation' element={<AddQuotation />} />
                    <Route path='quotation/quotation-receipt/:id' element={<QuotationReceipt />} />
                    <Route path='customer/customer-details/:id' element={<CustomerDetailsMain />} />
                    <Route path='add-customer' element={<AddCustomer />} />
                    <Route path='invoice' element={<Invoice />} />
                    <Route path='invoice' element={<Invoice />} />
                    <Route path='invoice/add-invoice' element={<AddInvoice />} />
                    <Route path='invoice/invoice-receipt/:id' element={<InvTemp />} />
                    <Route path='invoice/edit-invoice' element={<EditInvoice />} />
                    <Route path='payment-received' element={<PaymentReceived />} />
                    <Route path='payment-received/add-payment-received' element={<AddPaymentReceived />} />
                    <Route path='payment-received/payment-received-receipt/:id' element={<PaymentReceivedReceipt />} />
                    <Route path='payment-statement' element={<PaymentStatement />} />
                    <Route path='payment-statement/add-payment-statement' element={<AddPaymentStatement />} />
                    <Route path='payment-statement/payment-statement-receipt/:id' element={<PaymentStatementReceipt />} />
                  </Route>
                  <Route path='/Accountaccess' element={<Accountaccess />} />
                  <Route path="/NewLocation" element={<NewLocation />} />
                  <Route path="/Settings" element={<Settings />}>
                    <Route path="OrganizationDetails" element={<OrganizationDetails />} />
                    <Route path="AddEmployeeTemplate" element={<AddEmployeeTemplate />} />
                    <Route path="Notice" element={<Notice />} />
                    <Route path="AttendanceLocation" element={<AttendanceLocation />} />
                  </Route>
                  <Route path='/EditTeam/:id' element={<EditTeam />} />
                  <Route path='/EditShiftAllocation/:id' element={<EditAssignEmpAdd />} />
                </Routes>
              </div>
            </div>
          </div>}
      </BrowserRouter>
    </>
  )
}

export default Routing
