export interface GetProjectResponse {
    id: number;
    name: string;
    description: string;
    application_type: string;
    test_case_count: number;
    release_names: string[];
    created_by: string; 
    last_modified_by: string;
}

export interface PostProjectRequest {
    name: string;
    description: string;
    application_type: string;
    release_name: string;
}