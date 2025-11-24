import { PostProjectRequest } from "../../pages/project/models/Project";
import { PostReleaseRequest } from "../../pages/project/models/Release";
import api from "../../store/AuthHeader";

export const getAllProjectsAssignToUser = (username: string) => {
    return api().get(`/projects/all/${username}/`);
};

export const addProject = (data: PostProjectRequest) => {
    return api().post("/projects/", data);
};

export const deleteProject = (id: number) => {
    return api().delete(`projects/${id}/`);
};

export const getProjectDetailsById = (id: number) => {
    return api().get(`/projects/${id}/`);
};

export const getAllReleaseByProjectId = (id: number) => {
    return api().get(`/projects/releases/all/${id}/`);
};

export const updateProject = (data: PostProjectRequest, id: number) => {
    return api().put(`/projects/${id}/`, data);
};

export const addRelease = (data: PostReleaseRequest) => {
    return api().post("/projects/releases/", data);
};

export const deleteRelease = (id: number) => {
    return api().delete(`/projects/releases/${id}/`);
};

export const getReleaseDetailsById = (id: number) => {
    return api().get(`/projects/releases/${id}/`);
};

export const updateRelease = (data: PostReleaseRequest, id: number) => {
    return api().put(`/projects/releases/${id}/`, data);
};