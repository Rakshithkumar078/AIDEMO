export interface Document {
    id: number;
    name: string;
    file_size: number;
    file_type: string;
    uploaded_by: string;
    upload_date: string;
    file_path: string;
    content?: string;
}

export interface DocumentUploadRequest {
    file: File;
    uploaded_by: string;
}

export interface DocumentResponse {
    data: Document[];
    message: string;
}

export interface DocumentContentResponse {
    content: string;
    metadata: {
        name: string;
        file_size: number;
        file_type: string;
        upload_date: string;
    };
}