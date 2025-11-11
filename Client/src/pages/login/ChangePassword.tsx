import * as React from "react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import SweetAlertService from "../../services/SweetAlertService";
import { Panel, PanelBody } from "../../components/panel/panel";
import {useLoader} from "../shared/services/Loader"
import { Loader } from "../../shared/common/Loader";

const ChangePassword: FC = () => {
    const navigate = useNavigate();
    const { loading, hideLoader } = useLoader()

    return (
        <>
            <Panel>
                <PanelBody>
                    {loading ? <Loader /> : <>  <div className='d-flex align-items-center'>
                        <i className="fas fa-lg fa-fw me-10px fa-arrow-left" onClick={() => navigate(-1)} ></i>
                        <ol className="breadcrumb float-xl-start">
                            <li className="breadcrumb-item" onClick={() => navigate(-1)}>Change Password</li>
                        </ol>
                    </div>
                        <hr></hr>
                        <form >
                            <div className="row mb-5px">
                                <div className="col-md-5">
                                    <label className="form-label col-form-label col-md-3">
                                        Old Password
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="oldpassword"
                                        className="form-control h-45px fs-13px"
                                        placeholder="Enter the Old Password"
                                    />
                                </div>
                            </div>
                            <div className="row mb-5px">
                                <div className="col-md-5">
                                    <label className="form-label col-form-label col-md-3">
                                        New Password
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="newpassword"
                                        className="form-control h-45px fs-13px"
                                        placeholder="Enter the New Password"
                                    />
                                </div>
                            </div>
                            <div className="row mb-5px">
                                <div className="col-md-5">
                                    <label className="form-label col-form-label col-md-3">
                                        Confirm Password
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmpassword"
                                        className="form-control h-45px fs-13px"
                                        placeholder="Enter the Confirmed Password"
                                    />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className='col-md-5 d-flex justify-content-end'>
                                    <button type="button" className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4" onClick={() => window.history.go(-2)}>Cancel</button>
                                    <button type="submit" className="btn btn-theme btn-lg rounded-pill px-4"> Change password</button>
                                </div>
                            </div>
                        </form>
                    </>}
                </PanelBody>
            </Panel>
        </>
    );
};

export default ChangePassword;
