import * as React from "react";
import { useEffect, useState } from "react";
import {
    error_sweetalert_title,
    getMaxLengthErrorMessage,
    getRequiredErrorMessage,
    getSuccessMessage,
    get_release_error_message,
    max_limit_release_name,
    max_limit_release_notes,
    success_release_entity_name,
    release_name_field,
    release_name_notes,
    success_sweetalert_title,
    success_update_action_name,
    getErrormessage,
    error_release_entity_name,
    error_update_action_name
} from "../../shared/constants/AppConstants";
import { useForm, SubmitHandler } from "react-hook-form";
import SweetAlertService from "../../services/SweetAlertService";
import { getReleaseDetailsById, updateRelease } from "../../shared/services/ProjectService";
import { PostReleaseRequest } from "./models/Release";
import { ModalLoader } from '../../shared/common/Loader';
import { useLoader } from "../../shared/services/Loader";

interface EditReleaseFormProps {
    releaseId: number;
    onSuccess: () => void;
}

const EditRelease: React.FC<EditReleaseFormProps> = ({ releaseId, onSuccess }) => {
    const { loading, showLoader, hideLoader } = useLoader();
    const [projectId, setProjectId] = useState(0);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<PostReleaseRequest>();

    const getReleaseById = async () => {
        try {
            showLoader();
            const response = await getReleaseDetailsById(releaseId);
            setValue("release_name", response?.data?.release_name);
            setValue("release_notes", response?.data?.release_notes);
            setProjectId(response?.data?.project_id);
            hideLoader();
        } catch (error) {
            hideLoader();
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || get_release_error_message);
        }
    };

    useEffect(() => {
        getReleaseById();
    }, []);

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
            await updateRelease(postData, releaseId);
            await SweetAlertService.success(success_sweetalert_title, getSuccessMessage(success_release_entity_name, success_update_action_name));
            onSuccess();
            reset();
        } catch (error) {
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || getErrormessage(error_release_entity_name, error_update_action_name));
        }
    };

    return (
        <>
            {loading ? (<>
                <ModalLoader />
            </>) : (<>
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
                                        message: getMaxLengthErrorMessage(
                                            release_name_field,
                                            max_limit_release_name
                                        ),
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
                                        message: getMaxLengthErrorMessage(
                                            release_name_notes,
                                            max_limit_release_notes
                                        ),
                                    },
                                })}
                            ></textarea>
                            {errors?.release_notes && (
                                <p className="text-danger mt-1">{errors?.release_notes?.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4 px-md-5" data-bs-dismiss="modal" onClick={onSuccess}>Cancel</button>
                        <button
                            className="btn btn-theme btn-lg rounded-pill px-4 px-md-5"
                            type="submit"
                        >Save</button>
                    </div>
                </form>
            </>)}
        </>
    );
};

export default EditRelease;