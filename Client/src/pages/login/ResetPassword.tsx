import * as React from "react";
import { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import SweetAlertService from "../../services/SweetAlertService";

const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token"); // Extract token from URL


  return (
    <>
      <div className="login login-with-news-feed">
        <div className="news-feed">
          <img className="news-image w-100 h-100" src="/assets/img/images/loginnew.png"></img>
          <div className="news-caption">
            <h4 className="caption-title">
              <b>Automate</b> Logic
            </h4>
          </div>
        </div>
        <div className="login-container">
          <div className="login-header mb-30px">
            <div className="brand">
              <div className="d-flex align-items-center">
                <h3 className="font-bold font-body-bold opacity-90 text-text-default">
                  {"Reset your password"}
                </h3>
              </div>
            </div>
          </div>
          <div className="login-content">
            <form>
              <div>
                <label className="form-label col-form-label py-2">
                  New Password
                </label>
                <div>
                  <input
                    type="password"
                    id="newpassword"
                    className="form-control h-45px fs-13px"
                  />
                </div>
              </div>
              <div>
                <label className="form-label col-form-label py-2">
                  Confirm Password
                </label>
                <div>
                  <input
                    type="password"
                    id="confirmpassword"
                    className="form-control h-45px fs-13px"
                  />
                </div>
              </div>
              <div className="mb-15px mt-3">
                <button
                  type="submit"
                  className="btn btn-theme d-block h-45px w-100 btn-lg bg-baby-blue fs-14px"
                >
                  Reset my password
                </button>
              </div>
              <div className="mb-40px pb-40px text-body">
                <div className="mb-15px">
                  <p
                    className="text-primary fs-6 fw-bold cursor-pointer float-end"
                    onClick={() => navigate(`/login`)}
                  >
                    <u>Back to login</u>
                  </p>
                </div>
              </div>
              <hr className="bg-gray-600 opacity-2" />
              <div className="text-gray-600 text-center text-gray-500-darker mb-0">
                &copy; Automate Logic All Right Reserved 2024
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
