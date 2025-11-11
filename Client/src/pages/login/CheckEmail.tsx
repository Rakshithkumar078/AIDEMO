import * as React from "react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
const CheckEmail: FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="login login-with-news-feed">
                <div className="news-feed">
                    <img className="news-image w-100 h-100" src="/assets/img/images/loginnew.png" alt="Login background" />
                    <div className="news-caption">
                        <h4 className="caption-title"><b>Automate</b> Logic</h4>
                    </div>
                </div>
                <div className="login-container d-flex justify-content-center align-items-center">
                    <div className="card text-center border-0 shadow-lg">
                        <div className="card-body">
                            <div className="icon-container position-relative d-inline-block mb-3">
                                <i className="fas fa-envelope-circle-check fa-4x text-theme"></i> 
                            </div>
                            <div className="card bg-secondary-200 text-start py-2 p-2 mt-2">
                                <h5 className="card-title">Woo-hoo! Well done!</h5>
                                <p className="card-text float-start d-block">
                                    {"You've got an email to reset your password. Let's make it happen."}
                                </p>
                                <p className="text-primary fs-6 fw-bold cursor-pointer float-start" onClick={() => navigate(`/login`)}>
                                    <u>Back to login</u>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="bg-gray-600 opacity-2 mt-5" />
                <div className="text-gray-600 text-center text-gray-500-darker mb-0">
                    &copy; Automate Logic All Right Reserved 2024
                </div>
            </div>
        </>
    );
};

export default CheckEmail;
