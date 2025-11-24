//max length validation message
export const getMaxLengthErrorMessage = (fieldName: string, maxLength: number) => {
    return `${fieldName} should not exceed ${maxLength} characters`;
};

//required validation message
export const getRequiredErrorMessage = (fieldName: string) => {
    return `The ${fieldName} field is required`;
};

//max length validation limits
export const max_limit_category = 100;
export const max_limit_organization_name = 64;

//Regex and max length validation for mobile number
export const mobile_number_regex = /^[0-9]{10}$/;
export const mobile_number_max_limit = "Mobile number must be exactly 10 digits and numeric.";

//Roles
export const User_Role = 'User';
export const Admin_Role = 'Admin';
export const Super_Admin_Role = 'SuperAdmin';

//Common messages and pagination
export const Delete = "Delete"
export const DeletePopupConfirmationMessage =
    "Are you sure you want to delete?";
export const Error = "Error"
export const getErrormessage = (component: string, action: string) =>
    `Something went wrong while ${action} the ${component}`
export const Items_Per_Page = 10
export const current_page = 1
export const Success = "Success";

export const getSuccessMessage = (component: string, action: string) =>
    `${component} ${action} successfully`

export const warningMessage ="Please wait while the release is being created";

//Sweetalert
export const success_sweetalert_title = "Success";
export const error_sweetalert_title = "Error";
export const delete_sweetalert_title = "Delete";
export const success_project_entity_name = "Project";
export const success_release_entity_name = "Release";
export const success_create_action_name = "created";
export const success_update_action_name = "updated";
export const success_deleted_action_name = "deleted";
export const success_download_title_name = "Download Complete";
export const success_file_download_message = "Your file downloaded successfully!";

export const error_project_entity_name = "project";
export const error_release_entity_name = "release";
export const error_create_action_name = "creating";
export const error_update_action_name = "updating";
export const error_deleted_action_name = "deleting";
export const error_testcase_in_testplan = "This test case is associated with a test plan and cannot be deleted."

//Project type
export const project_web_application_type = "WebApplication";
export const project_mobile_application_type = "MobileApplication";
export const project_desktop_application_type = "DesktopApplication";

//Project
export const error_message_for_get_all_projects = 'Something went wrong while fetching projects.';
export const max_limit_project_name = 100;
export const project_name_field = "Name";
export const max_limit_project_description = 1000;
export const project_name_description = "Description";
export const project_name_application_type = "Application Type";
export const max_limit_project_comments = 1000;
export const DeleteReleaseConfirmationMessage = "Deleting this release will remove all associated test suites, test cases, test steps, and test plans.";
export const get_project_error_message = "Something went wrong while getting project details.";

//Release
export const release_name_field = "Release Name";
export const max_limit_release_name = 200;
export const release_name_notes = "Release Description";
export const max_limit_release_notes = 1000;
export const get_all_release_error_message = "Something went wrong while getting all releases by project.";
export const get_release_error_message = "Something went wrong while getting release details.";

//TestSetup max length validation limit
export const testsetup_name_max_limit = 100;
export const testsetup_ip_max_limit = 20;
export const platform_version_max_limit = 20;
export const apppackage_max_limit = 100;
export const deviceName_version_max_limit = 100;
export const appActivity_version_max_limit = 100;
export const automationName_version_max_limit = 100;
export const app_max_limit = 500;
export const Select_Browser_validation = "Please select at least one browser for Web Application";

//Test plan constants
export const failed_to_fetch_test_suites = "Something went wrong while creating test suite.";
export const failed_to_fetch_test_cases = "Something went wrong while creating test case.";
export const failed_to_fetch_test_plans = "Something went wrong while getting test plan.";
export const failed_to_create_test_plans = "Something went wrong while creating test plan.";
export const test_plan_created_message = "Test plan created successfully.";
export const select_testcase_validation_message = "Please select any TestCase from the TestSuite";
export const select_testsuite_validation_message = "Please select any TestSuite";
export const select_no_testcase_validation_message = "Please select and add at least one test case before updating the test plan.";
export const confirmation_message_for_testplans = "Are you sure you want to delete the testplans ?";
export const testplan_deleted_success_message = "TestPlan deleted successfully";
export const testplan_updated_success_message = "Test plan updated successfully";
export const max_limit_testplan_name = 100;
export const max_limit_testplan_description = 100;

//Test Suites
export const max_limit_test_suites_identifierValue = 100;

//Feedback
export const error_message_for_select_rating = 'Please select a rating before submitting.'

//Execution constants
export const error_message_for_exe_file_not_running = "Exe file is not running. Please download and run the provided .exe file from the application.";
export const deployed_on_local = "LOCAL";
export const file_name_ends_with_for_test_data = "_testdata.xlsx";
export const success_message_for_execution = "Test Plan execution completed successfully.";
export const execution_start_message = "Execution initiated successfully.";
export const error_message_for_empty_test_case_ids = "At least one test case must be selected.";
export const error_message_for_execution_get_api = "Something went wrong while fetching data.";
export const public_address_api_url = "http://localhost:5123";
export const public_address_api_url_for_desktop_application = "http://localhost:5125";
export const error_message_for_execution_file_is_not_running = "Please ensure the execution file is running before executing.";
export const network_error_message_for_batch_file_is_not_running = "Network Error";
export const error_message_for_executing_test_plan = "Something went wrong while executing the testplan.";
export const error_message_for_getting_notification = "Something went wrong while getting the notifications.";
export const error_message_for_getting_all_testcases_by_testsuiteid = "Something went wrong while getting all test cases by test suite.";
export const error_message_for_batch_file = "Execution file is not running.";

//Local storage constants
export const projectId_key = "projectId";
export const releaseId_key = "releaseId";
export const projectName_key = "projectName";
export const projectType_key = "projectType";
export const reportId_key = "reportId";
export const testsuite_key = "testsuiteId";
export const releaseName_key = "releaseName";
export const is_executing = "isExecuting";
export const testsuiteName_key = "testsuiteName";

//Test step constants
export const local = "LOCAL";
export const failed_to_fetch = 'Failed to fetch';
export const exe_not_running = "Exe file is not running. Please download and run the provided .exe file from the application.";
export const blob_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const url_error_message = "Please check the input url and try again.";
export const no_file_data_message = 'No file data received.';
export const windows_placeholder = "Enter the window name to extract the elements";
export const web_placeholder = "Enter the URL to extract the elements";
export const extraction_validation = "URL is required for Extract Elements.";
export const file_upload_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const file_type_error = "Please upload a valid Excel (.xlsx) file.";
export const file_required = "Please upload the file";
export const uploading = "Uploading...";
export const upload = "Upload";
export const noValue = "NaN";

//dashboard constants
export const chrome = "chrome";
export const firefox = "firefox";
export const edge = "edge";
export const chromeColor = "#02A6D2";
export const fireFoxColor = "#E93E65";
export const edgeColor = "#005AFF";
export const stack = "Stack 0";
export const zero = 0;
export const barcharttpe = 'bar'
export const piechartlabels = ['Passed', 'Failed', 'Not executed'];
export const charttype = 'donut'
export const piechartlabelColor = '#fff'
export const piechartcolors = ['#A4D761', '#F26C69', '#DADADA'];
export const mainDashboardLabels = ['Web', 'Mobile', 'Desktop']

//Test Data
export const file_type_for_test_data_upload = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const error_message_for_valid_test_data = "Please upload a valid Excel (.xlsx) file.";
export const error_message_required_test_data_file = "Please choose a file.";
export const name_ends_with_test_data_file = "_testdata.xlsx";
export const accept_files_for_test_data = ".xlsx";
export const success_message_for_upload_test_data = "Test Data uploaded successfully.";
export const error_message_for_upload_test_data = "Something went wrong while uploading test data from file.";
export const error_message_for_download_test_data = "Something went wrong while downloading test data.";
export const getErrorMessageTestDataFileName = (projectName: string) => `File name must be ${projectName}_testdata.xlsx.`
export const key_name_field = "Key Name";
export const max_limit_key_name = 50;

//Reports
export const report_view_popup_blocked_message = "Failed to open the report in a new tab.Please check your popup blocker settings.";
export const exe_error_message = "Something went wrong while running the exe file. Please re run the provided .exe file.";
export const no_report_found = "No report ID found in local storage.";

//Scripts
export const execution_not_found_error_message = "Execution data not found for the given ID.";

//For desktop report and script view
export const DeployedOnEnv = {
    LOCAL: 'LOCAL',
    AWS: 'AWS',
    LINUX: 'LINUX',
} as const;

//FormatDateTime
export const formatDateTime = (date: Date | string): string => {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const formatDateAndTime = (date: Date | string): string => {
    if (date == 'NA') return date
    else
        return new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        });
};

export const readinessCutOff = 70
export const percentage = 100

//Notification donut chart color
export const NOTIFICATION_CHART_COLORS = ['#49c966', '#eb4656', '#6c757d'] as const;

//Admin constants
export const error_message_for_get_all_roles = 'Something went wrong while fetching roles.';
export const error_message_for_get_all_users = 'Something went wrong while fetching users.';
export const error_message_for_get_all_organizations = 'Something went wrong while fetching organizations.';
export const user_name_field = 'Name';
export const email_field = 'Email';
export const email_validation_pattern = '/\S+@\S+\.\S+/';
export const email_validation_erroe_message = 'Invalid email format';
export const password_field = 'Password';
export const conform_password_field = 'Confirm password';
export const password_validation = 'Passwords do not match';
export const error_user_entity_name = 'User';
export const max_limit_user_name = 100;
export const success_user_entity_name = 'User';
export const success_organization_entity_name = 'Organization';
export const validation_for_select_role = 'Please select a role';


//Testcase
export const max_limit_testcase_name = 100;
export const max_limit_testcase_identifierValue = 1000;
export const max_limit_testcase_fieldValue = 1000;
export const max_limit_testcase_comments = 1000;
export const error_message_for_required_teststeps = "Please add at least one test step before saving the test case.";
export const validation_message_for_required_teststeps = "Before saving testcase.Please complete the teststeps.";
export const validation_message_for_special_characters_teststeps = "Name cannot contain special characters.";
export const regex_special_character = /[!@#$%^&*(),.?":{}|<>\/\\]/;
export const error_message_hyphen = "Hyphen not allowed";
export const validation_message_for_testsuite = "Please select a test suite";
export const browser_icons = 3;
export const validation_message_for_testcase_space = "Test step name cannot contain spaces.";

//Deployed On
export const deployed_on_aws_ci = "AWS-CI";
export const deployed_on_aws_qa = "AWS-QA";
export const zip_file_name_ci = "DesktopExecutionSetupForCI.zip";
export const zip_file_name_qa = "DesktopExecutionSetupForQA.zip";
export const error_while_downloading_bat_file = "Something went wrong while downloading the zip file.";
export const error_missing_zip_file_content = "Invalid response: Missing zip file content.";
export const error_while_downloading_executable_file = "Something went wrong while downloading the executable file.";
export const error_missing_executable_file_content = "Invalid response: Missing executable file content.";
export const mobile_bat_file_windows = "MobileExecutionSetupWindows.bat";
export const mobile_bat_file_mac = "MobileExecutionSetupMac.sh";
export const mobile_bat_file_linux = "MobileExecutionSetupLinux.sh";
export const os_windows = "windows";
export const os_linux = "linux";
export const os_mac = "mac";
export const windows = "win";
export const os_not_recognised = "OS not recognized";

export const warning = "Discard and leave"
export const warning_message = "Are you sure you want to discard the changes?"
export const ADMIN_APPROVEL_PENDING = "Admin approvel is pending for the organization."
export const user_reject_confirm_message = "Are you sure you want to reject the organization?"
export const user_approve_confirm_message = "Are you sure you want to approve the organization?"

export const user_role_id = 3

//Navigating to docs
export const url_for_recording_documentation = "http://docs.automate-logic.com/record"
export const url_for_testdata_documentation = "http://docs.automate-logic.com/testdata"

export function formatDuration(minutes: number): string {
    if (typeof minutes !== 'number' || isNaN(minutes)) return "Invalid duration";

    const hours = minutes / 60;
    const days = hours / 24;

    const pluralize = (value: number, unit: string) =>
        `${Math.floor(value)} ${unit}${Math.floor(value) === 1 ? '' : 's'}`;

    if (minutes < 60) {
        return pluralize(minutes, 'min');
    } else if (hours < 24) {
        return pluralize(hours, 'hr');
    } else if (days <= 7) {
        return pluralize(days, 'day');
    } else if (days <= 30) {
        return pluralize(days / 7, 'week');
    } else if (days <= 365) {
        return pluralize(days / 30, 'month');
    } else {
        return pluralize(days / 365, 'year');
    }
}

//Status constants for dashboard
export const Updated = "Updated";
export const Added = "Added";
export const Deleted = "Deleted";

export const min_test_step=0
export const max_columns=5
export const writableActions=[
      "write_data",
      "check_box",
      "radio_button",
      "select_dropdown_option",
      "clear_data",
      "un_check",
      "Search_text",
      "rate_star",
      "progress_bar",
      "slider",
      "file_upload",
      "date_picker",
      "time_picker",
      "fill"
    ];
export const column_paginate_initialcount=0
export const pageCount=1
export const min_testdata =1

export const Data_driven_disable = "Disable Data Driven";
export const Data_driven_waring = "Unchecking will remove any data mappings you have set for test data and please update the field value";
export const Data_driven_waring_for_playwright = "Unchecking will remove any data mappings you have set for test data and please update the fill value in captured script section.";
export const test_data_key_regex = /^\S+$/;
export const test_data_key_regex_validation_message = "Spaces are not allowed while creating key name";
export const upload_valid_excel_format = "Please upload a valid Excel (.xlsx) file.";
export const select_file_to_upload = "Please select a file to upload.";
export const test_record_validation_message="Please select at least one row to create a Test Data Set."
export const test_case_without_save_error_message = "Please save or cancel any unsaved test steps before updating the test case."