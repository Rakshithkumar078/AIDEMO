import * as React from "react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import SweetAlertService from "../../services/SweetAlertService";

const ForgotPassword: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  return (
    <>
         <div className="register register-with-news-feed">
        <div className="news-feed">
          <div
            className="news-image"
            style={{ backgroundImage: "url(/assets/img/images/loginnew.png)" }}
          ></div>
        </div>
        <div className="register-container">
        <div className="register-header h1">
              <div> <h5  className="text-theme">{"Forgot password? That's okay! Let's change it."}</h5></div>
          </div>
          <div className="register-content pt-2">
            <form className="fs-13px">
              <div className="mb-2">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  className="form-control fs-13px"
                />
              </div>
              <div className="mb-4">
              <button
                  type="submit"
                  className="btn btn-theme d-block w-100 btn-lg h-45px fs-13px rounded-pill mt-3"
                >
                  Reset
                </button>
              </div>
              <div className="mb-40px pb-40px text-body">
                <div className="d-flex justify-content-end">
                
                   <p className="text-theme cursor-pointer"
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

export default ForgotPassword;
