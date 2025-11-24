import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import SweetAlertService from "../../services/SweetAlertService";
import {
    success_create_action_name,
    error_sweetalert_title,
    getMaxLengthErrorMessage,
    getRequiredErrorMessage,
    getSuccessMessage,
    max_limit_release_name,
    max_limit_release_notes,
    success_release_entity_name,
    release_name_field,
    release_name_notes,
    success_sweetalert_title,
    getErrormessage,
    error_release_entity_name,
    error_create_action_name
} from "../../shared/constants/AppConstants";
import { PostReleaseRequest, GetReleaseResponse } from "./models/Release";
import { addRelease } from "../../shared/services/ProjectService";
import { useLoader } from "../../shared/services/Loader";
import Swal from "sweetalert2";

interface CreateReleaseProps {
    projectId: number;
    onClose: () => void;
    onCreate: (data: GetReleaseResponse) => void;
}

const CreateRelease: React.FC<CreateReleaseProps> = ({ projectId, onClose, onCreate }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PostReleaseRequest>();
     const { showLoader, hideLoader } = useLoader();
    const buildRelease = (data: PostReleaseRequest): PostReleaseRequest => {
        return {
            release_name: data?.release_name?.trim(),
            release_notes: data?.release_notes,
            project_id: projectId
        };
    };

    const onSubmit: SubmitHandler<PostReleaseRequest> = async (data: PostReleaseRequest) => {
        const postData: PostReleaseRequest = buildRelease(data);
        try {
            Swal.fire({
            title: 'Creating release...',
            text: 'Please wait while the release is being created.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
            showLoader();
            const response = await addRelease(postData);
            Swal.close();
            onCreate(response?.data);
            hideLoader();
            SweetAlertService.success(success_sweetalert_title, getSuccessMessage(success_release_entity_name, success_create_action_name));
            onClose();
        } catch (error) {
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || getErrormessage(error_release_entity_name, error_create_action_name));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body px-4">
                    <div className="row mb-10px">
                        <label className="form-label col-form-label">Release name<span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control mb-2px"
                            placeholder="Enter release name"
                            {...register("release_name", {
                                required: getRequiredErrorMessage(release_name_field),
                                maxLength: {
                                    value: max_limit_release_name,
                                    message: getMaxLengthErrorMessage(release_name_field, max_limit_release_name),
                                },
                            })}
                        />
                        {errors?.release_name && (
                            <p className="text-danger mt-1">{errors?.release_name?.message}</p>
                        )}
                    </div>
                    <div className="row mb-10px">
                        <label className="form-label col-form-label ">Release description<span className="text-danger">*</span></label>
                        <textarea
                            className="form-control mb-2px"
                            rows={5}
                            placeholder="Enter release description"
                            {...register("release_notes", {
                                required: getRequiredErrorMessage(release_name_notes),
                                maxLength: {
                                    value: max_limit_release_notes,
                                    message: getMaxLengthErrorMessage(release_name_notes, max_limit_release_notes),
                                },
                            })}
                        ></textarea>
                        {errors?.release_notes && (
                            <p className="text-danger mt-1">{errors?.release_notes?.message}</p>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4 px-md-5" data-bs-dismiss="modal" onClick={onClose}>Cancel</button>
                    <button
                        className="btn btn-theme btn-lg rounded-pill px-4 px-md-5"
                        type="submit"
                    >Create</button>
                </div>
            </form>
        </>
    );
};

export default CreateRelease;