export interface GetReleaseResponse {
    id: number;
    release_name: string;
    release_notes: string;
}

export interface PostReleaseRequest {
    release_name: string;
    release_notes: string;
    project_id: number;
}