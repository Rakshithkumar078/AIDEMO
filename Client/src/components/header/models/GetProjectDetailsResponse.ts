export interface GetProjectDetailsResponse {
    id: number;
    name:string;
    application_type: string;
    description: string;
}
export interface GetReleaseDetailsResponse {
    id: number;
    release_name:string;
    release_notes: string;
}