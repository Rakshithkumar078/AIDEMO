import { DocumentUploadRequest } from "../../pages/document/models/Document";
import api from "../../store/AuthHeader";

export const getAllDocuments = () => {
    return api().get("/api/v1/documents/");
};

export const deleteDocument = (id: number) => {
    return api().delete(`/api/v1/documents/${id}`);
};

export const getDocumentContent = (id: number) => {
    return api().get(`/api/v1/documents/${id}/content`);
};

export const uploadDocument = (formData: FormData) => {
    return api().post("/api/v1/documents/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};