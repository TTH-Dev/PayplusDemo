export const ApiEndPoints=(name:any)=> {
    var list :any={
        organisationSetup:"admin/organizations/create",
        addEmployee:"admin/employee/add-employees",
        getAllindustry:"admin/organizations/industries",
        getsubIndustry:"admin/organizations/industry-categories",
        getsubIndustryByid:"admin/organizations/industry-categories",
        postScheduleData:"admin/schedules/employee",
        fileUploads:"admin/payplus/upload/files",
        getScheduleemployeeDetails:"admin/employee/getDepartmentsDetails",
        postDepartmentSchedule:"admin/schedules/employee/departmentwise",
        getAllemployeeTeam:"admin/employee/getAllEmployees",
        getSalaryDetailsTeam:"admin/employee/salaryDetails",
        userSignup:"admin/payplus/sign-up",
        userLogin:"admin/auth/login",
        resetPassword:"wishiton/reset-password",
        forgetPassord:"admin/payplus/forgot-password",
        signupOTPverify:"admin/payplus/otp-verification",
        resendOTP:"admin/payplus/resend-otp",
        homeSetup:"admin/organizations/homeSetup",
        updateHomesetup:"admin/organizations/homeSetup/update/",
        getAllemployeeSchedule:"admin/employee/getAllEmployeeIdWithName",
        getAllemployeeID:"admin/employee/getAllEmployeeIdWithName",
        getsingleemployee:"admin/employee",
        getAllemployeeScheduleData:"admin/schedules/all",
        deleteScheduleEmployee:"admin/schedules/delete",
        editEmployee:"admin/employee/update"

    };
    return list[name];
}