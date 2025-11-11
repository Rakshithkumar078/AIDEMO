import * as React from "react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const BackToLoginPassword: FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="register register-with-news-feed">
                <div className="news-feed">
                    <img
                        className="news-image w-100 h-100"
                        src="/assets/img/images/loginnew.png"
                        alt="Login background"
                    />
                    <div className="news-caption">
                        <h4 className="caption-title">
                            <b>Automate</b> Logic
                        </h4>
                    </div>
                </div>
                <div className="login-container d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <div className="d-flex justify-content-center mt-4">
                            <img
                                src="/assets/img/images/Register_Sucess.png"
                                alt="Confetti celebration"
                                className="w-25"
                            />
                        </div>
                        <h2 className="mt-3">Hurray! You have successfully registered</h2>
                        <p className="text-muted mt-3 px-4">
                            Your account has been created successfully. However, you will not be able to log in until your account is approved by an admin.
                            <br />
                            You will receive an email notification once your account is approved. Please wait for admin approval before signing in.
                        </p>
                        <button
                            className="btn btn-theme rounded-pill px-5 mt-4"
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </button>
                    </div>
                    <hr className="bg-gray-600 opacity-2 mt-5" />
                    <div className="text-gray-600 text-center text-gray-500-darker mb-0">
                        &copy; Automate Logic All Right Reserved 2024
                    </div>
                </div>
            </div>
        </>
    );
};

export default BackToLoginPassword;