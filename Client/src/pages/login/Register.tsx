import * as React from "react";
import { FC, useEffect, useState } from "react";
import SweetAlertService from "../../services/SweetAlertService";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


const Register: FC = () => {

    const navigate = useNavigate();
   const countries=[{id: 1, name: 'United States'}, {id: 2, name: 'Canada'}, {id: 3, name: 'United Kingdom'}];
    // const [countries, setCountries] = useState<any[]>([]);
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm();

  

    return (
        <div className="register register-with-news-feed">
            <div className="news-feed">
                <div className="news-image" style={{backgroundImage: 'url(/assets/img/images/register.png)'}}></div>
            </div>
            <div className="register-container">
                <div className="register-header h1">
                    <div className="text-theme">Register</div>
                    <small className="d-block fs-15px lh-16 text-grey py-2">Create automate logic account.</small>
                </div>
                <hr></hr>
                <div className="register-content">
                    <form className="fs-13px" onSubmit={()=> navigate("/login")}>
                        <div className="mb-3">
                            <label className="mb-2">Username <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control fs-13px"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="mb-2">Email <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                className="form-control fs-13px"
                                placeholder="johndoe@gmail.com"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-2">Password <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className="form-control fs-13px"
                                placeholder="Password"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-2">Confirm Password <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className="form-control fs-13px"
                                placeholder="Confirm Password"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="mb-2">Organization</label>
                            <input
                                type="text"
                                className="form-control fs-13px"
                                placeholder="Organization"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-2">Phone number <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control fs-13px"
                                placeholder="3485912345"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-2">Country <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                            >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4 mx-4 text-center">
                        </div>
                        <div className="mb-4">
                            <button type="submit" className="btn btn-theme d-block w-100 btn-lg h-45px fs-13px rounded-pill">Sign Up</button>
                        </div>
                        <div className="mb-4 pb-5 text-theme">
                            Already a member? <b><Link to="/login">Log In</Link></b>
                        </div>
                        <hr className="bg-gray-600 opacity-2" />
                        <p className="text-center text-gray-600">
                            &copy; Automate Logic All Right Reserved 2025
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;