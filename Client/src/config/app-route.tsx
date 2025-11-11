import App from "../App.tsx";
import CreateTestSuite from "../pages/testsuites/CreateTestSuite.tsx";
import TestSuitesList from "../pages/testsuites/TestSuitesList.tsx";
import * as React from "react";
import LoginPage from "../pages/login/Login.tsx";
import RegisterPage from "../pages/login/Register.tsx";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "../pages/login/ForgotPassword.tsx";
import ChangePassword from "../pages/login/ChangePassword.tsx";
import ResetPassword from "../pages/login/ResetPassword.tsx";
import CheckEmail from "../pages/login/CheckEmail.tsx";
import BackToLoginPassword from "../pages/login/BackToLoginPassword.tsx";
import BackToLoginRegister from "../pages/login/BackToLoginRegister.tsx";


const AppRoute = () => {
   

    return (
        <Routes>
            <Route path="" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="resetpassword" element={<ResetPassword />} />
            <Route path="backtologinpassword" element={<BackToLoginPassword />} />
            <Route path="backtologinregister" element={<BackToLoginRegister />} />
            <Route path="checkemail" element={<CheckEmail />} />
            <Route path="*" element={<App />}>
                <Route path="createtestsuite" element={<CreateTestSuite />} />
                <Route path="testsuites" element={<TestSuitesList />} />
                <Route path="changepassword" element={<ChangePassword />} />
            </Route>
        </Routes>
    );
};

export default AppRoute;