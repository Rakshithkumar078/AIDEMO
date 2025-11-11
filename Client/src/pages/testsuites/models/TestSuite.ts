export interface GetTestSuiteResponse {
    id: number;
    name: string;
    description: string;
    test_cases: any[];
    created_by: string;
    last_modified_by: string;
    created_date: Date;
    last_modified_date: Date;
}

export interface TestSuiteFormData {
    name: string;
    description: string;
}

export interface TestSuiteRequestObject {
    Name: string;
    Description: string;
    ProjectId:number;
    ReleaseId:number;
}