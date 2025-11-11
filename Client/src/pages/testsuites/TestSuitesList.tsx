import * as React from "react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Panel, PanelBody } from "../../components/panel/panel";
import  {usePagination} from "../shared/services/PaginationService"
import { useLoader } from "../shared/services/Loader";
import { Loader } from "../../shared/common/Loader";
import SweetAlertService from "../../services/SweetAlertService";

const TestSuiteList = () => {
    const testSuites=[ {
    "created_by": "Monica",
    "created_date": "2025-06-02T05:52:06.623795",
    "description": "test",
    "id": 89,
    "last_modified_by": "NA",
    "last_modified_date": "2025-06-02T05:52:06.623799",
    "name": "test",
    "project_id": 27,
    "release_id": 28,
    "test_cases": []
  },
  {
    "created_by": "DevTest",
    "created_date": "2025-05-30T06:06:21.558794",
    "description": "PBI Testing Suite",
    "id": 86,
    "last_modified_by": "Monica",
    "last_modified_date": "2025-06-02T05:24:14.339860",
    "name": "PBI Testing Suite",
    "project_id": 27,
    "release_id": 28,
    "test_cases": [
      {
        "comments": "",
        "created_by": "Monica",
        "created_date": "2025-06-02T05:32:00.398077",
        "id": 585,
        "last_modified_by": "Monica",
        "last_modified_date": "2025-06-02T05:37:23.156945",
        "name": "Login Case",
        "priority": "Medium",
        "status": "New",
        "test_suite_id": 86
      },
      {
        "comments": "Login Test case",
        "created_by": "Monica",
        "created_date": "2025-06-02T05:50:42.472706",
        "id": 587,
        "last_modified_by": "NA",
        "last_modified_date": "2025-06-02T05:50:42.472710",
        "name": "Login Negative Test case",
        "priority": "Medium",
        "status": "New",
        "test_suite_id": 86
      },
      {
        "comments": "Login Test case",
        "created_by": "Monica",
        "created_date": "2025-06-02T05:50:42.437898",
        "id": 586,
        "last_modified_by": "Monica",
        "last_modified_date": "2025-06-02T05:50:58.937530",
        "name": "Login Positive Test case",
        "priority": "Medium",
        "status": "New",
        "test_suite_id": 86
      }
    ]
  }]
   
   
    const { currentPage, totalPages, handlePageChange, paginatedData } = usePagination(testSuites)
    const { loading, showLoader, hideLoader } = useLoader()
    const navigate = useNavigate();
    const [viewedTestSuite, setViewedTestSuite] = useState<any>(null);
    const viewedTestSuitetest= {
    "created_by": "DevTest",
    "created_date": "2025-05-30T06:06:21.558794",
    "description": "PBI Testing Suite",
    "id": 86,
    "last_modified_by": "Monica",
    "last_modified_date": "2025-06-02T05:24:14.339860",
    "name": "PBI Testing Suite",
    "project_id": 27,
    "release_id": 28,
    "test_cases": [
      {
        "comments": "",
        "created_by": "Monica",
        "created_date": "2025-06-02T05:32:00.398077",
        "id": 585,
        "last_modified_by": "Monica",
        "last_modified_date": "2025-06-02T05:37:23.156945",
        "name": "Login Case",
        "priority": "Medium",
        "status": "New",
        "test_suite_id": 86
      },
      {
        "comments": "Login Test case",
        "created_by": "Monica",
        "created_date": "2025-06-02T05:50:42.472706",
        "id": 587,
        "last_modified_by": "NA",
        "last_modified_date": "2025-06-02T05:50:42.472710",
        "name": "Login Negative Test case",
        "priority": "Medium",
        "status": "New",
        "test_suite_id": 86
      },
      {
        "comments": "Login Test case",
        "created_by": "Monica",
        "created_date": "2025-06-02T05:50:42.437898",
        "id": 586,
        "last_modified_by": "Monica",
        "last_modified_date": "2025-06-02T05:50:58.937530",
        "name": "Login Positive Test case",
        "priority": "Medium",
        "status": "New",
        "test_suite_id": 86
      }
    ]
    }

    const deleteTestSuites = (id: number) => {
        SweetAlertService.confirm("Delete", "Are you sure you want to delete").then(
            async (response) => {
                if (response.isConfirmed) {
                        await SweetAlertService.success(
                            "Success",
                            "The test suite is deleted successfully"
                        );
                   
                }
            }
        );
    };

    const onViewClick = () => {
        setViewedTestSuite(viewedTestSuitetest);
    };

    const onEditClick=()=>{
        navigate('/createtestsuite');
    }
    return (
        <>
            {" "}
            {loading ? (
                <Loader />
            ) : (
                <>
                    {testSuites?.length > 0 ? (
                        <>
                            <Panel>
                                <PanelBody>
                                    <div className='d-flex align-items-center'>
                                        <i className="fas fa-lg fa-fw me-10px fa-arrow-left cursor-pointer" onClick={() => navigate(`/overview`)}></i>
                                        <ol className="breadcrumb float-xl-start">
                                            <li className="breadcrumb-item text-theme"><span className="cursor-pointer" onClick={() => navigate(`/overview`)} >OrangeHRM : Release Name </span></li>
                                            <li className="breadcrumb-item active">Test Suites</li>
                                        </ol>
                                    </div>
                                    <hr></hr>
                                    <div className="d-flex justify-content-between mb-3 py-2">
                                        <h2>Test Suites</h2>
                                        <button
                                            className="btn btn-lg btn-theme rounded-pill"
                                            onClick={() => navigate(`/createtestsuite`)}
                                        >
                                            Create Test Suites
                                        </button>
                                    </div>
                                    <div className="card b-1 rounded-0">
                                        <div className="table-responsive">
                                            <table className="table table-striped mb-0 table-thead-sticky border border-secondary">
                                                <thead>
                                                    <tr>
                                                        <th className="text-white text-start">SL.no</th>
                                                        <th className="text-white text-start">Name</th>
                                                        <th className="text-white text-start">TestCase Count</th>
                                                        <th className="text-white text-start">Created By</th>
                                                        <th className="text-white text-start">Modified By</th>
                                                        <th className="text-white text-start">Created Date</th>
                                                        <th className="text-white text-start">Modified Date</th>
                                                        <th className="text-white text-start">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedData?.map(
                                                        (
                                                            testSuites: any,
                                                            index: number
                                                        ) => (
                                                            <tr key={testSuites?.id}>
                                                                <td className="text-start">
                                                                    {" "}
                                                                    {(currentPage - 1) * 10 +
                                                                        index +
                                                                        1}
                                                                </td>
                                                                <td className="text-start">
                                                                    <a
                                                                        href="#"
                                                                        onClick={() =>{
                                                                            navigate(`/testcaselist`);
                                                                        }
                                                                        }
                                                                    >
                                                                        {testSuites?.name}
                                                                    </a>
                                                                </td>
                                                                <td className="text-start">
                                                                    {testSuites?.test_cases?.length || 0}
                                                                </td>
                                                                <td className="text-start">
                                                                    {testSuites?.created_by}
                                                                </td>
                                                                <td className="text-start">
                                                                    {testSuites?.last_modified_by}
                                                                </td>
                                                                <td className="text-start">
                                                                    {Number(testSuites?.created_date)}
                                                                </td>
                                                                <td className="text-start">
                                                                    {Number(testSuites?.last_modified_date)}
                                                                </td>
                                                                <td className="text-start">
                                                                    <i
                                                                        className="fas fa-eye pe-3 cursor-pointer"
                                                                        role="button"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#modalWithoutAnimation"
                                                                        onClick={() => onViewClick()}
                                                                        title="View"
                                                                    ></i>
                                                                    <i
                                                                        className="fas fa-pencil cursor-pointer pe-3"
                                                                        onClick={onEditClick}
                                                                        
                                                                    ></i>
                                                                    <i
                                                                        className="fas fa-trash-can cursor-pointer text-danger"
                                                                        onClick={() =>
                                                                            deleteTestSuites(testSuites?.id)
                                                                        }
                                                                    ></i>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={8}>
                                                            <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2 text-center text-md-start">
                                                                <div className="flex-fill text-start">
                                                                    <span className="fw-bold text-secondary">
                                                                        Total: {testSuites?.length}
                                                                    </span>
                                                                </div>
                                                                <div className="flex-fill text-center">
                                                                    <span className="fw-bold">
                                                                        {currentPage} / {totalPages}
                                                                    </span>
                                                                </div>

                                                                <div className="flex-fill d-flex justify-content-end gap-2">
                                                                    <button
                                                                        className="btn btn-default rounded-0"
                                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                                        disabled={currentPage === 1}
                                                                    >
                                                                        <i className="fa fa-angle-left pe-2"></i> Previous
                                                                    </button>

                                                                    <button
                                                                        className="btn btn-default rounded-0"
                                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                                        disabled={currentPage === totalPages}
                                                                    >
                                                                        Next <i className="fa fa-angle-right ps-2"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        {/* Modal for View Details */}
                                        <div className="modal fade" id="modalWithoutAnimation">
                                            <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Test Suite Details</h4>
                                                        <button
                                                            type="button"
                                                            className="btn-close btn-close-white fs-5"
                                                            data-bs-dismiss="modal"
                                                            aria-hidden="true"
                                                        ></button>
                                                    </div>
                                                    <div className="modal-body px-4">
                                                        {viewedTestSuite ? (
                                                            <div>
                                                                <p className="mb-2">
                                                                    <strong className="me-2">Suite Name:</strong>
                                                                    <span className="d-inline text-break">
                                                                        {viewedTestSuite?.name || 'Unknown Suite'}
                                                                    </span>
                                                                </p>

                                                                {viewedTestSuite.test_cases && viewedTestSuite.test_cases.length > 0 ? (
                                                                    <div className="table-responsive">
                                                                        <table className="table table-striped mb-0 table-thead-sticky border border-secondary">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="text-start text-white">SL.no</th>
                                                                                    <th className="text-start text-white">Test Cases</th>
                                                                                    <th className="text-start text-white">Status</th>
                                                                                    <th className="text-start text-white">Priority</th>
                                                                                    <th className="text-white text-start">Created By</th>
                                                                                    <th className="text-white text-start">Modified By</th>
                                                                                    <th className="text-white text-start">Created Date</th>
                                                                                    <th className="text-white text-start">Modified Date</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {viewedTestSuite.test_cases.map((tc, index) => (
                                                                                    <tr key={index}>
                                                                                        <td className="text-start">{index + 1}</td>
                                                                                        <td className="text-start text-break">{tc?.name || 'Unknown Test Case'}</td>
                                                                                        <td className="text-start text-break">{tc?.status || 'Unknown Status'}</td>
                                                                                        <td className="text-start text-break">{tc?.priority || 'Unnamed Priority'}</td>
                                                                                        <td className="text-start">{tc?.created_by}</td>
                                                                                        <td className="text-start">{tc?.last_modified_by}</td>
                                                                                        <td className="text-start">{Number(tc?.created_date)}</td>
                                                                                        <td className="text-start">{Number(tc?.last_modified_date)}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-muted mt-3">
                                                                        No test cases created for <strong>{viewedTestSuite.name}</strong>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p>No details available</p>
                                                        )}
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-theme btn-lg rounded-pill me-3 px-4 px-md-5"
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </PanelBody>
                            </Panel>
                        </>
                    ) : 
                    (
                        <div>
                            <div className='d-flex align-items-center'>
                                <i className="fas fa-lg fa-fw me-10px fa-arrow-left cursor-pointer" onClick={() => navigate(`/overview`)}></i>
                                <ol className="breadcrumb float-xl-start">
                                    <li className="breadcrumb-item text-theme"><span className="cursor-pointer" onClick={() => navigate(`/overview`)}>Orange HRM: Release 1
                                         </span></li>
                                    <li className="breadcrumb-item active">Test Suites</li>
                                </ol>
                            </div>
                            <hr></hr>
                            <div className="d-flex justify-content-between mb-3 py-2">
                                <h2>Test Suites</h2>
                                <button
                                    className="btn btn-lg btn-theme rounded-pill"
                                    onClick={() => navigate(`/createtestsuite`)}
                                >
                                    Create Test Suites
                                </button>
                            </div>
                            <div className="d-flex justify-content-center flex-column nothing_to_show">
                                <div className="text-center">
                                    <img
                                        src="/assets/img/images/nothingToShow.svg"
                                        alt="No reports illustration"
                                        className="img-fluid mb-3"
                                    />
                                    <h5 className="text-dark mb-2">Nothing to show</h5>
                                    <p className="text-muted">There are no test suites for the given project</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default TestSuiteList;
