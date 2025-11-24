import { Panel, PanelBody } from '../../components/panel/panel'
import * as React from "react";
import {
    DeletePopupConfirmationMessage,
    DeleteReleaseConfirmationMessage,
    success_deleted_action_name,
    error_sweetalert_title,
    getMaxLengthErrorMessage,
    getRequiredErrorMessage,
    getSuccessMessage,
    get_all_release_error_message,
    get_project_error_message,
    max_limit_project_description,
    max_limit_project_name,
    project_desktop_application_type,
    success_project_entity_name,
    project_mobile_application_type,
    project_name_application_type,
    project_name_description,
    project_name_field,
    project_web_application_type,
    success_release_entity_name,
    success_sweetalert_title,
    success_update_action_name,
    getErrormessage,
    error_project_entity_name,
    error_update_action_name,
    error_release_entity_name,
    error_deleted_action_name,
    Items_Per_Page,
} from "../../shared/constants/AppConstants";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import SweetAlertService from "../../services/SweetAlertService";
import {
    deleteRelease,
    getAllReleaseByProjectId,
    getProjectDetailsById,
    updateProject
} from '../../shared/services/ProjectService';
import { GetReleaseResponse } from "./models/Release";
import { PostProjectRequest } from './models/Project';
import CreateRelease from './CreateRelease';
import EditRelease from './EditRelease';
import { useLoader } from "../../shared/services/Loader";
import { usePagination } from '../../shared/services/PaginationService';
import { Loader } from '../../shared/common/Loader';

const EditProject = () => {
    const { loading, showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<PostProjectRequest>();
    const { projectId } = useParams();
    const [releases, setReleases] = useState<GetReleaseResponse[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRelease, setSelectedRelease] = useState<GetReleaseResponse>();
    const [showCreateReleaseModal, setShowCreateReleaseModal] = useState(false);
    const { currentPage, totalPages, handlePageChange, paginatedData } = usePagination(releases);

    const getAllReleases = async () => {
        showLoader();
        try {
            if (projectId) {
                const response = await getAllReleaseByProjectId(Number(atob(projectId)));
                setReleases(response?.data);
            }
            hideLoader();
        } catch (error) {
            hideLoader();
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || get_all_release_error_message);
        }
    };

    const getProjectDetails = async () => {
        showLoader();
        try {
            if (projectId) {
                const response = await getProjectDetailsById(Number(atob(projectId)));
                setValue("name", response?.data?.name);
                setValue("description", response?.data?.description);
                setValue("application_type", response?.data?.application_type);
            }
            hideLoader();
        } catch (error) {
            hideLoader();
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || get_project_error_message);
        }
    };

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
        try {
            showLoader();
            if (projectId) {
                await updateProject(postData, Number(atob(projectId)));
                reset();
                hideLoader();
                await SweetAlertService.success(success_sweetalert_title, getSuccessMessage(success_project_entity_name, success_update_action_name));
                navigate("/project");
            }
        } catch (error) {
            hideLoader();
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || getErrormessage(error_project_entity_name, error_update_action_name));
        }
    };

    const handleOpenCreateReleaseModal = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowCreateReleaseModal(true);
    }

    const handleCloseCreateReleaseModal = () => setShowCreateReleaseModal(false);

    const onDeleteReleaseClick = (releaseId: number) => {
        SweetAlertService.confirm(DeletePopupConfirmationMessage, DeleteReleaseConfirmationMessage).then(
            async (result) => {
                if (result?.isConfirmed) {
                    try {
                        showLoader();
                        await deleteRelease(releaseId);
                        hideLoader();
                        await SweetAlertService.success(success_sweetalert_title, getSuccessMessage(success_release_entity_name, success_deleted_action_name));
                        await getAllReleases();
                    } catch (error) {
                        hideLoader();
                        SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || getErrormessage(error_release_entity_name, error_deleted_action_name));
                    }
                }
            }
        );
    };

    const onEditReleaseClick = (release: GetReleaseResponse, event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setSelectedRelease(release);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        const defaultSelectedRelease: GetReleaseResponse = {
            id: 0,
            release_name: "",
            release_notes: ""
        }
        setIsModalOpen(false);
        setSelectedRelease(defaultSelectedRelease);
    };

    useEffect(() => {
        getProjectDetails();
        getAllReleases();
    }, []);

    return (
        <>
            {loading ? (
                <>
                    <Loader />
                </>) : (<>
                    <Panel>
                        <PanelBody>
                            <div className='d-flex align-items-center'>
                                <i className="fas fa-lg fa-fw me-10px fa-arrow-left cursor-pointer" onClick={() => navigate("/project")}></i>
                                <ol className="breadcrumb float-xl-start">
                                    <li className="breadcrumb-item active">Edit Project</li>
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
                                                    disabled
                                                    id="web"
                                                    value={project_web_application_type}
                                                    {...register("application_type", {
                                                        // required: getRequiredErrorMessage(project_name_application_type),
                                                    })}
                                                />
                                                <label className="form-check-label" htmlFor="web">Web</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    disabled
                                                    id="desktop"
                                                    value={project_desktop_application_type}
                                                    {...register("application_type", {
                                                        // required: getRequiredErrorMessage(project_name_application_type),
                                                    })}
                                                />
                                                <label className="form-check-label" htmlFor="desktop">Desktop</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    disabled
                                                    id="mobile"
                                                    value={project_mobile_application_type}
                                                    {...register("application_type", {
                                                        // required: getRequiredErrorMessage(project_name_application_type),
                                                    })}
                                                />
                                                <label className="form-check-label" htmlFor="mobile">Mobile</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-5 d-flex justify-content-between align-items-center">
                                        <p className="fw-bolder text-greylight mt-3">Release version</p>
                                        <button
                                            type="button"
                                            onClick={handleOpenCreateReleaseModal}
                                            className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4 px-md-5"
                                        >Create new Release</button>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-5">
                                        <div className='card b-1 rounded-0'>
                                            <div className="table-responsive">
                                                <table className="table table-striped mb-0 table-thead-sticky border border-secondary">
                                                    <thead>
                                                        <tr>
                                                            <th className='text-white text-start'>#</th>
                                                            <th className='text-white text-start'>Version</th>
                                                            <th className='text-white text-start'>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paginatedData?.map((release: GetReleaseResponse, index: number) => (
                                                            <tr key={release?.id}>
                                                                <td className="text-start">{(currentPage - 1) * Items_Per_Page + index + 1}</td>
                                                                <td className="text-start">{release?.release_name}</td>
                                                                <td className="text-start">
                                                                    <i className="fas fa-pencil pe-3" onClick={(event) => onEditReleaseClick(release, event)}></i>
                                                                    <i className="fas fa-trash-can text-danger" onClick={() => onDeleteReleaseClick(release?.id)}></i>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td className='text-start fw-bolder text-secondary'>Total: {releases?.length}</td>
                                                            {/*<td className='text-center fw-bolder text-secondary'><span className="fw-bold">{currentPage} / {totalPages}</span></td>*/}
                                                            <td colSpan={2} className="text-end">
                                                                <div>
                                                                    <button
                                                                        className="btn btn-default me-2 rounded-0"
                                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                                        disabled={currentPage === 1}
                                                                    >
                                                                        <i className="fa fa-angle-left pe-2"></i> Previous
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-default ms-2 rounded-0"
                                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                                        disabled={currentPage === totalPages}
                                                                    >
                                                                        Next <i className="fa fa-angle-right ps-2"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-5 d-flex justify-content-end mt-4'>
                                    <button className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4 px-md-5" type="button" onClick={() => navigate("/project")}>Cancel</button>
                                    <button className="btn btn-theme btn-lg rounded-pill px-4 px-md-5" type="submit">Save</button>
                                </div>
                            </form>
                            {showCreateReleaseModal && (
                                <div className="modal fade show d-block">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Create New Release</h4>
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white fs-5"
                                                    onClick={handleCloseCreateReleaseModal}
                                                ></button>
                                            </div>
                                            <div className="modal-body px-4">
                                                {projectId && (
                                                    <CreateRelease
                                                        projectId={Number(atob(projectId))}
                                                        onClose={handleCloseCreateReleaseModal}
                                                        onCreate={() => {
                                                            getAllReleases();
                                                            setShowCreateReleaseModal(false);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showCreateReleaseModal && <div className="modal-backdrop fade show"></div>}

                            {/* Modal for Editing Release */}
                            {isModalOpen && selectedRelease && (
                                <>
                                    <div className="modal fade show d-block">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Edit Release</h4>
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white fs-5"
                                                        onClick={closeModal}
                                                    ></button>
                                                </div>
                                                <div className="modal-body px-4">
                                                    <EditRelease
                                                        releaseId={selectedRelease?.id}
                                                        onSuccess={() => {
                                                            closeModal();
                                                            getAllReleases();
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-backdrop fade show"></div>
                                </>
                            )}
                        </PanelBody>
                    </Panel>
                </>)}
        </>
    )
}

export default EditProject