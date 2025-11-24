import * as React from "react";
import { Panel, PanelBody } from '../../components/panel/panel';
import { useEffect, useState, useRef } from "react";
import { deleteDocument, getAllDocuments, getDocumentContent } from "../../shared/services/DocumentService";
import { UploadService, UploadProgress } from "../../services/UploadService";
import { validateFiles, formatFileSize, getFileIcon, FILE_TYPES } from "../../utils/fileValidation";
import { ErrorAlert, ProgressStages, ProgressStage } from "./components";
import SweetAlertService from "../../services/SweetAlertService";
import { Document } from "./models/Document";
import { Loader } from '../../shared/common/Loader';
import { useLoader } from "../../shared/services/Loader";
import { usePagination } from '../../shared/services/PaginationService';
import {
    DeletePopupConfirmationMessage,
    delete_sweetalert_title,
    success_deleted_action_name,
    error_sweetalert_title,
    getSuccessMessage,
    success_sweetalert_title,
    getErrormessage,
    Items_Per_Page
} from "../../shared/constants/AppConstants";
import './DocumentUpload.css';

const DocumentList = () => {
    const { loading, showLoader, hideLoader } = useLoader();
    const [documents, setDocuments] = useState<Document[]>([]);

    // Enhanced upload state
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgresses, setUploadProgresses] = useState<Map<string, UploadProgress>>(new Map());
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadService = UploadService.getInstance();
    const { currentPage, totalPages, handlePageChange, paginatedData } = usePagination(documents);

    // Helper function to create progress stages
    const createProgressStages = (currentStage: string): ProgressStage[] => {
        const stages = [
            { id: 'uploading', label: 'Uploading', icon: 'fas fa-upload' },
            { id: 'processing', label: 'Processing', icon: 'fas fa-cog' },
            { id: 'embedding', label: 'Embedding', icon: 'fas fa-brain' },
            { id: 'completed', label: 'Completed', icon: 'fas fa-check' }
        ];

        return stages.map(stage => {
            let status: 'pending' | 'active' | 'completed' | 'error' = 'pending';
            
            if (currentStage === 'error') {
                status = stage.id === 'uploading' ? 'error' : 'pending';
            } else if (currentStage === 'completed') {
                status = 'completed';
            } else if (stage.id === currentStage) {
                status = 'active';
            } else if (stages.findIndex(s => s.id === stage.id) < stages.findIndex(s => s.id === currentStage)) {
                status = 'completed';
            }

            return { ...stage, status };
        });
    };

    const getAllDocumentsList = async () => {
        showLoader();
        try {
            const response = await getAllDocuments();
            setDocuments(response?.data || []);
            hideLoader();
        } catch (error: any) {
            hideLoader();
            SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || "Failed to fetch documents");
        }
    };

    const onDeleteClick = (documentId: number) => {
        SweetAlertService.confirm(delete_sweetalert_title, DeletePopupConfirmationMessage).then(
            async (result) => {
                if (result?.isConfirmed) {
                    try {
                        await deleteDocument(documentId);
                        await SweetAlertService.success(success_sweetalert_title, getSuccessMessage("Document", success_deleted_action_name));
                        await getAllDocumentsList();
                    } catch (error: any) {
                        SweetAlertService.error(error_sweetalert_title, error?.response?.data?.error || getErrormessage("Document", error_deleted_action_name));
                    }
                }
            }
        );
    };



    // Enhanced file handling
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        addFiles(files);
    };

    const addFiles = (files: File[]) => {
        setUploadError('');
        
        // Validate files
        const validation = validateFiles(files);
        if (!validation.isValid) {
            setUploadError(validation.error || 'Invalid files');
            return;
        }

        // Add files to selection
        const newFiles = [...selectedFiles];
        files.forEach(file => {
            // Check for duplicates
            if (!newFiles.some(existing => existing.name === file.name && existing.size === file.size)) {
                newFiles.push(file);
            }
        });

        setSelectedFiles(newFiles);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        
        // Clear error if no files left
        if (newFiles.length === 0) {
            setUploadError('');
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setUploadError("Please select files to upload");
            return;
        }

        setIsUploading(true);
        setUploadError('');
        
        try {
            const progressMap = new Map<string, UploadProgress>();
            setUploadProgresses(progressMap);

            // Upload files
            await uploadService.uploadMultipleFiles(selectedFiles, (progress) => {
                progressMap.set(progress.fileId, progress);
                setUploadProgresses(new Map(progressMap));
            });

            // Wait for all uploads to complete
            const checkCompletion = () => {
                const allProgresses = Array.from(progressMap.values());
                const allCompleted = allProgresses.every(p => 
                    p.stage === 'completed' || p.stage === 'error'
                );

                if (allCompleted) {
                    const hasErrors = allProgresses.some(p => p.stage === 'error');
                    if (!hasErrors) {
                        SweetAlertService.success(success_sweetalert_title, "All documents uploaded successfully");
                        setShowUploadModal(false);
                        resetUploadState();
                        getAllDocumentsList();
                    }
                    setIsUploading(false);
                } else {
                    setTimeout(checkCompletion, 1000);
                }
            };

            checkCompletion();
        } catch (error: any) {
            setUploadError(error?.response?.data?.error || "Failed to upload documents");
            setIsUploading(false);
        }
    };

    const resetUploadState = () => {
        setSelectedFiles([]);
        setUploadProgresses(new Map());
        setUploadError('');
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        getAllDocumentsList();
    }, []);

    return (
        <>
            {loading && <Loader />}
            <Panel>
                <PanelBody>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
                        <h2 className="mb-0">Documents</h2>
                        <button
                            className="btn btn-theme rounded-pill px-4 py-2"
                            onClick={() => setShowUploadModal(true)}
                        >
                            Upload Document
                        </button>
                    </div>
                </PanelBody>
            </Panel>

            {documents && documents?.length > 0 ? (
                <div className='card b-1 rounded-0'>
                    <div className="table-responsive">
                        <table className="table table-striped mb-0 table-thead-sticky border border-secondary">
                            <thead>
                                <tr>
                                    <th className='text-white text-start'>#</th>
                                    <th className='text-white text-start'>Document Name</th>
                                    <th className='text-white text-start'>File Size</th>
                                    <th className='text-white text-start'>File Type</th>
                                    <th className='text-white text-start'>Uploaded By</th>
                                    <th className='text-white text-start'>Upload Date</th>
                                    <th className='text-white text-start'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData?.map((document: Document, index: number) => (
                                    <tr key={document?.id}>
                                        <td className="text-start">{(currentPage - 1) * Items_Per_Page + index + 1}</td>
                                        <td className="text-start">
                                            <a 
                                                href={`http://localhost:8000/api/v1/documents/${document.id}/preview`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none"
                                            >
                                                {document?.name}
                                            </a>
                                        </td>
                                        <td className="text-start">{formatFileSize(document?.file_size)}</td>
                                        <td className="text-start">{document?.file_type}</td>
                                        <td className="text-start">{document?.uploaded_by}</td>
                                        <td className="text-start">{formatDate(document?.upload_date)}</td>
                                        <td className="text-start">
                                            <i
                                                className="fas fa-trash-can text-danger cursor-pointer"
                                                title="Delete"
                                                onClick={() => onDeleteClick(document?.id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={7}>
                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2 text-center text-md-start">
                                            <div className="flex-fill text-start">
                                                <span className="fw-bold text-secondary">
                                                    Total: {documents?.length}
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


                </div>
            ) : (
                <div className="d-flex justify-content-center flex-column nothing_to_show">
                    <div className="text-center">
                        <img
                            src="/assets/img/images/nothingToShow.svg"
                            alt="No documents illustration"
                            className="img-fluid mb-3"
                        />
                        <h5 className="text-dark mb-2">No Documents Found</h5>
                        <p className="text-muted">Upload your first document to get started</p>
                    </div>
                </div>
            )}

            {/* Enhanced Upload Modal */}
            {showUploadModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    <i className="fas fa-cloud-upload-alt me-2"></i>
                                    Upload Documents
                                </h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        if (!isUploading) {
                                            setShowUploadModal(false);
                                            resetUploadState();
                                        }
                                    }}
                                    disabled={isUploading}
                                ></button>
                            </div>
                            <div className="modal-body px-4">
                                {/* Error Alert */}
                                {uploadError && (
                                    <ErrorAlert 
                                        error={uploadError} 
                                        onDismiss={() => setUploadError('')}
                                        className="mb-3"
                                    />
                                )}

                                {/* Drag & Drop Area */}
                                <div 
                                    className={`border-2 border-dashed rounded p-4 text-center mb-3 ${
                                        isDragOver ? 'border-primary bg-light' : 'border-secondary'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    style={{ minHeight: '120px', cursor: 'pointer' }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                        <i className={`fas fa-cloud-upload-alt fa-3x mb-2 ${
                                            isDragOver ? 'text-primary' : 'text-muted'
                                        }`}></i>
                                        <h6 className="mb-1">
                                            {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
                                        </h6>
                                        <small className="text-muted">
                                            or click to browse files
                                        </small>
                                        <small className="text-muted mt-1">
                                            Supported: PDF, DOCX, TXT, Images (max 10MB each, up to 5 files)
                                        </small>
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="d-none"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.txt,.docx,.doc,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                                    multiple
                                />

                                {/* Selected Files List */}
                                {selectedFiles.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="mb-2">Selected Files ({selectedFiles.length})</h6>
                                        <div className="list-group">
                                            {selectedFiles.map((file, index) => {
                                                const { icon, color } = getFileIcon(file);
                                                const progress = Array.from(uploadProgresses.values())
                                                    .find(p => p.fileName === file.name);
                                                
                                                return (
                                                    <div key={index} className="list-group-item">
                                                        <div className="d-flex align-items-center">
                                                            <i className={`${icon} me-2`} style={{ color }}></i>
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span className="fw-medium">{file.name}</span>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <small className="text-muted">
                                                                            {formatFileSize(file.size)}
                                                                        </small>
                                                                        {!isUploading && (
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-danger"
                                                                                onClick={() => removeFile(index)}
                                                                            >
                                                                                <i className="fas fa-times"></i>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Progress Display */}
                                                                {progress && (
                                                                    <div className="mt-2">
                                                                        {/* Progress Stages */}
                                                                        <ProgressStages 
                                                                            stages={createProgressStages(progress.stage)}
                                                                            className="mb-2"
                                                                        />
                                                                        
                                                                        {/* Progress Bar */}
                                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                                            <small className="text-muted">
                                                                                {progress.message}
                                                                            </small>
                                                                            <small className="text-muted">
                                                                                {progress.progress}%
                                                                            </small>
                                                                        </div>
                                                                        <div className="progress" style={{ height: '6px' }}>
                                                                            <div
                                                                                className={`progress-bar ${
                                                                                    progress.stage === 'error' ? 'bg-danger' :
                                                                                    progress.stage === 'completed' ? 'bg-success' :
                                                                                    progress.stage === 'uploading' ? 'bg-primary uploading' :
                                                                                    'bg-info'
                                                                                }`}
                                                                                style={{ width: `${progress.progress}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        
                                                                        {/* Error Message */}
                                                                        {progress.error && (
                                                                            <small className="text-danger mt-1 d-block">
                                                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                                                {progress.error}
                                                                            </small>
                                                                        )}
                                                                        
                                                                        {/* Success Message */}
                                                                        {progress.stage === 'completed' && (
                                                                            <small className="text-success mt-1 d-block">
                                                                                <i className="fas fa-check-circle me-1"></i>
                                                                                Document processed successfully
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* File Type Information */}
                                <div className="row g-2 mb-3">
                                    <div className="col-12">
                                        <small className="text-muted">
                                            <strong>Supported file types:</strong>
                                        </small>
                                    </div>
                                    {Object.entries(FILE_TYPES).filter(([key]) => key !== 'OTHER').map(([type, config]) => (
                                        <div key={type} className="col-auto">
                                            <span className="badge bg-light text-dark border">
                                                <i className={config.icon} style={{ color: config.color }}></i>
                                                <span className="ms-1">{type}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                    onClick={() => {
                                        if (!isUploading) {
                                            setShowUploadModal(false);
                                            resetUploadState();
                                        }
                                    }}
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-pill px-4"
                                    onClick={handleUpload}
                                    disabled={selectedFiles.length === 0 || isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin me-2"></i>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-upload me-2"></i>
                                            Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DocumentList;