import * as React from "react";
import SweetAlertService from "../../services/SweetAlertService";
import { useNavigate, Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { Panel, PanelBody } from "../../components/panel/panel";
import { TestSuiteFormData, TestSuiteRequestObject } from "./models/TestSuite";
import { Loader } from "../../shared/common/Loader";
import { useLoader } from "../shared/services/Loader";

const CreateTestSuite = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TestSuiteFormData>();
    const { loading, showLoader, hideLoader } = useLoader();

    const initialFormValues: TestSuiteFormData = {
        name: "",
        description: ""
      };

      const watchedValues = watch();

      const isFormChanged = () => {
        const trimmedValues = {
          name: watchedValues.name?.trim() || "",
          description: watchedValues.description?.trim() || ""
        };
      
        return (
          trimmedValues.name !== initialFormValues.name ||
          trimmedValues.description !== initialFormValues.description
        );
      };
      

    const handleBreadcrumbClick = async () => {
        if (isFormChanged()) {
            const result = await SweetAlertService.warning("Discard and leave","Are you sure you want to discard the changes?");
        if (result?.isConfirmed) {
            navigate('/overview');
        }
          } else {
            navigate('/overview');
    }
    }

    const handleCancelClick = async () =>{
        if (isFormChanged()) {
            const result = await SweetAlertService.warning("Discard and leave",  "Are you sure you want to discard the changes?");
            if (result?.isConfirmed) {
              navigate('/testsuites');
            }
          } else {
            navigate('/testsuites');
          }
    }
    const onSubmit: SubmitHandler<TestSuiteFormData> = async (data) => {
       SweetAlertService.success("Success", "Test Suite created successfully");
       navigate('/testsuites');
    }
    return (
        <div>
            <Panel>
                <PanelBody>
                    {loading ? <Loader /> : <>
                        <div className='d-flex align-items-center'>
                            <i className="fas fa-lg fa-fw me-10px fa-arrow-left cursor-pointer" onClick={handleBreadcrumbClick}></i>
                            <ol className="breadcrumb float-xl-start">
                                <li className="breadcrumb-item text-theme"><span className="cursor-pointer" onClick={handleBreadcrumbClick}>Project Name : Release Name </span></li>
                                <li className="breadcrumb-item"> <span className="cursor-pointer" onClick={handleCancelClick}>Test Suite List</span></li>
                                <li className="breadcrumb-item active">Create Test Suite</li>
                            </ol>
                        </div>
                        <hr></hr>
                        <h2 className='py-2'>Create Test Suite</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row mb-5px">
                                <div className="col-md-5">
                                    <label className="form-label col-form-label col-md-3">Name <span className="text-danger">*</span></label>
                                    <input type="text" id="name" className="form-control mb-2px" placeholder="Enter the Name"
                                    />
                                    {errors?.name && (
                                        <p className="text-danger mt-1">
                                            {errors?.name && typeof errors?.name?.message === "string" && (
                                                <p className="text-danger">{errors?.name?.message}</p>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="row mb-5px">
                                <div className="col-md-5">
                                    <label className="form-label col-form-label col-md-3">Description <span className="text-danger">*</span></label>
                                    <textarea className="form-control mb-2px"
                                    />
                                </div>
                            </div>

                            <div className='col-md-5 d-flex justify-content-end mt-4'>
                                <button type="button" className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4 px-md-5" onClick={handleCancelClick}>Cancel</button>
                                <button type="submit" className="btn btn-theme btn-lg rounded-pill px-4 px-md-5">Create</button>
                            </div>
                        </form>
                    </>}
                </PanelBody>
            </Panel>
        </div>
    );
};

export default CreateTestSuite;