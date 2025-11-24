import { Panel, PanelBody } from '../../components/panel/panel'
import * as React from "react";
import { useNavigate } from 'react-router-dom';
import SweetAlertService from "../../services/SweetAlertService";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    getMaxLengthErrorMessage,
    getRequiredErrorMessage,
    max_limit_project_name,
    max_limit_project_description,
    max_limit_release_name,
    success_sweetalert_title,
    error_sweetalert_title,
    project_name_field,
    project_name_description,
    project_name_application_type,
    project_web_application_type,
    project_mobile_application_type,
    project_desktop_application_type,
    release_name_field,
    getSuccessMessage,
    success_project_entity_name,
    success_create_action_name,
    getErrormessage,
    error_project_entity_name,
    error_create_action_name
} from "../../shared/constants/AppConstants";
import { PostProjectRequest } from './models/Project';
import { addProject } from '../../shared/services/ProjectService';
import { useLoader } from "../../shared/services/Loader";
import { Loader } from '../../shared/common/Loader';

const CreateProject = () => {
    const { loading, showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<PostProjectRequest>();

    const buildProject = (data: PostProjectRequest): PostProjectRequest => {
        return {
            name: data?.name.trim(),
            description: data?.description,
            application_type: data?.application_type,
            release_name: data?.release_name
        };
    };

    const onSubmit: SubmitHandler<PostProjectRequest> = async (data: PostProjectRequest) => {
        const postData: PostProjectRequest = buildProject(data);
        showLoader();
        try {
            await addProject(postData);
            await SweetAlertService.success(success_sweetalert_title, getSuccessMessage(success_project_entity_name, success_create_action_name));
            navigate("/project");
            hideLoader();
        } catch (error) {
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || getErrormessage(error_project_entity_name, error_create_action_name));
            hideLoader();
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Panel>
                        <PanelBody>
                            <div className='d-flex align-items-center'>
                                <i className="fas fa-lg fa-fw me-10px fa-arrow-left cursor-pointer" onClick={() => navigate("/project")}></i>
                                <ol className="breadcrumb float-xl-start">
                                    <li className="breadcrumb-item active">Create Project</li>
                                </ol>
                            </div>
                            <hr></hr>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mb-3">
                                    <div className="col-md-5">
                                        <label className="form-label">Project name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter project name"
                                            {...register("name", {
                                                required: getRequiredErrorMessage(project_name_field),
                                                maxLength: {
                                                    value: max_limit_project_name,
                                                    message: getMaxLengthErrorMessage(
                                                        project_name_field,
                                                        max_limit_project_name
                                                    ),
                                                },
                                            })}
                                        />
                                        {errors?.name && (
                                            <p className="text-danger mt-1">
                                                {errors?.name?.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-5">
                                        <label className="form-label">Project description <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            placeholder="Enter description"
                                            {...register("description", {
                                                required: getRequiredErrorMessage(project_name_description),
                                                maxLength: {
                                                    value: max_limit_project_description,
                                                    message: getMaxLengthErrorMessage(
                                                        project_name_description,
                                                        max_limit_project_description
                                                    ),
                                                },
                                            })}
                                        ></textarea>
                                        {errors?.description && (
                                            <p className="text-danger mt-1">
                                                {errors?.description?.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Type <span className="text-danger">*</span></label>
                                    <div className="row">
                                        <div className="col-md-6 pt-2">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="web"
                                                    value={project_web_application_type}
                                                    {...register("application_type", {
                                                        required: getRequiredErrorMessage(project_name_application_type),
                                                    })}
                                                />
                                                <label className="form-check-label" htmlFor="web">Web</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="desktop"
                                                    value={project_desktop_application_type}
                                                    {...register("application_type", {
                                                        required: getRequiredErrorMessage(project_name_application_type),
                                                    })}
                                                />
                                                <label className="form-check-label" htmlFor="desktop">Desktop</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="mobile"
                                                    value={project_mobile_application_type}
                                                    {...register("application_type", {
                                                        required: getRequiredErrorMessage(project_name_application_type),
                                                    })}
                                                />
                                                <label className="form-check-label" htmlFor="mobile">Mobile</label>
                                            </div>
                                            {errors?.application_type && (
                                                <p className="text-danger mt-1">
                                                    {errors?.application_type.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row my-4">
                                        <div className="col-md-4">
                                            <p className="border border-theme border-1 rounded-pill px-4 py-2 mb-0 mw-100">
                                                <i className="fa fa-info-circle text-theme pe-2"></i>
                                                The project type cannot be changed once created.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-5">
                                        <label className="form-label">Release name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter release name"
                                            {...register("release_name", {
                                                required: getRequiredErrorMessage(release_name_field),
                                                maxLength: {
                                                    value: max_limit_release_name,
                                                    message: getMaxLengthErrorMessage(
                                                        release_name_field,
                                                        max_limit_release_name
                                                    ),
                                                },
                                            })}
                                        />
                                        {errors?.release_name && (
                                            <p className="text-danger mt-1">
                                                {errors?.release_name?.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='col-md-5 d-flex justify-content-end mt-4'>
                                    <button className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4 px-md-5" type="button" onClick={() => navigate("/project")}>Cancel</button>
                                    <button className="btn btn-theme btn-lg rounded-pill px-4 px-md-5" type="submit">Create</button>
                                </div>
                            </form>
                        </PanelBody>
                    </Panel>
                </>
            )}
        </>
    )
}

export default CreateProject