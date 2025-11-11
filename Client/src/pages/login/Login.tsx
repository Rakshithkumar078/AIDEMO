import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import SweetAlertService from "../../services/SweetAlertService";
import { useForm } from "react-hook-form";

const Login = () => {

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <div>
            <div className="register register-with-news-feed">
                <div className="news-feed">
                    <div
                        className="news-image"
                        style={{ backgroundImage: "url(/assets/img/images/register.png)" }}
                    ></div>
                </div>
                <div className="register-container">
                    <div className="register-header h1">
                        <div className="text-theme">Login</div>
                        <small className="d-block fs-15px lh-16 text-grey py-2">
                            Enter your email and password to sign in!
                        </small>
                    </div>
                    <div className="register-content pt-2">
                        <form className="fs-13px" onSubmit={()=> navigate("/dashboard")}>
                            <div className="mb-3">
                                <label className="mb-2">
                                    Username <span className="text-danger">*</span>
                                </label>
                                <div className="row gx-3">
                                    <div className="mb-2 mb-md-0">
                                        <input
                                            type="text"
                                            id="username"
                                            className="form-control fs-13px"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="mb-2">
                                    Password <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control fs-13px"
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="form-check mb-30px">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="1"
                                        id="rememberMe"
                                    />
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Keep me logged in
                                    </label>
                                </div>
                                <p className="text-theme">
                                    <Link to="/forgotpassword">Forgot password</Link>
                                </p>
                            </div>
                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="btn btn-theme d-block w-100 btn-lg h-45px fs-13px rounded-pill"
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="mb-4 pb-5 text-theme">
                                Not Registered Yet?{" "}
                                <b>
                                    <Link to="/register">Sign Up</Link>
                                </b>
                            </div>
                            <hr className="bg-gray-600 opacity-2" />
                            <p className="text-center text-gray-600">
                                &copy; Automate Logic All Right Reserved 2025
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
