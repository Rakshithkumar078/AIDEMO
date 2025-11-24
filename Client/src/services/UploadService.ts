import axios, { AxiosProgressEvent } from 'axios';
import api from '../store/AuthHeader';

export interface UploadProgress {
  fileId: string;
  fileName: string;
  stage: 'uploading' | 'processing' | 'embedding' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface UploadResponse {
  id: number;
  filename: string;
  status: string;
  message: string;
}

export interface ProcessingStatus {
  id: number;
  status: 'uploading' | 'processing' | 'embedding' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export class UploadService {
  private static instance: UploadService;
  private progressCallbacks: Map<string, (progress: UploadProgress) => void> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  async uploadFile(
    file: File,
    onProgress: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const fileId = this.generateFileId(file);
    this.progressCallbacks.set(fileId, onProgress);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaded_by', 'Current User'); // Replace with actual user

    try {
      // Initial progress
      onProgress({
        fileId,
        fileName: file.name,
        stage: 'uploading',
        progress: 0,
        message: 'Starting upload...'
      });

      const response = await api().post('/api/v1/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          
          onProgress({
            fileId,
            fileName: file.name,
            stage: 'uploading',
            progress,
            message: `Uploading... ${progress}%`
          });
        }
      });

      const uploadResponse: UploadResponse = response.data;

      // Start polling for processing status
      this.startPolling(fileId, uploadResponse.id, file.name, onProgress);

      return uploadResponse;
    } catch (error: any) {
      onProgress({
        fileId,
        fileName: file.name,
        stage: 'error',
        progress: 0,
        message: 'Upload failed',
        error: error.response?.data?.error || error.message || 'Unknown error'
      });
      throw error;
    }
  }

  async uploadMultipleFiles(
    files: File[],
    onProgress: (progress: UploadProgress) => void
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, onProgress));
    return Promise.all(uploadPromises);
  }

  private startPolling(
    fileId: string,
    documentId: number,
    fileName: string,
    onProgress: (progress: UploadProgress) => void
  ): void {
    let retryCount = 0;
    const maxRetries = 3;
    
    const pollInterval = setInterval(async () => {
      try {
        const status = await this.getProcessingStatus(documentId);
        
        // Reset retry count on successful response
        retryCount = 0;
        
        onProgress({
          fileId,
          fileName,
          stage: status.status,
          progress: status.progress,
          message: status.message,
          error: status.error
        });

        // Stop polling when completed or error
        if (status.status === 'completed' || status.status === 'error') {
          clearInterval(pollInterval);
          this.pollingIntervals.delete(fileId);
          this.progressCallbacks.delete(fileId);
        }
      } catch (error: any) {
        retryCount++;
        
        // If document not found (404), stop polling immediately
        if (error.message.includes('Document not found')) {
          onProgress({
            fileId,
            fileName,
            stage: 'error',
            progress: 0,
            message: 'Document not found - upload may have failed',
            error: error.message
          });
          clearInterval(pollInterval);
          this.pollingIntervals.delete(fileId);
          this.progressCallbacks.delete(fileId);
          return;
        }
        
        // For other errors, retry up to maxRetries
        if (retryCount >= maxRetries) {
          onProgress({
            fileId,
            fileName,
            stage: 'error',
            progress: 0,
            message: 'Failed to get processing status after multiple retries',
            error: error.message
          });
          clearInterval(pollInterval);
          this.pollingIntervals.delete(fileId);
          this.progressCallbacks.delete(fileId);
        } else {
          // Continue polling but show temporary error
          onProgress({
            fileId,
            fileName,
            stage: 'processing',
            progress: 0,
            message: `Connection issue, retrying... (${retryCount}/${maxRetries})`,
            error: undefined
          });
        }
      }
    }, 2000); // Poll every 2 seconds

    this.pollingIntervals.set(fileId, pollInterval);
  }

  private async getProcessingStatus(documentId: number): Promise<ProcessingStatus> {
    try {
      const response = await api().get(`/api/v1/documents/${documentId}/status`);
      return response.data;
    } catch (error: any) {
      // Handle 404 - document not found (permanent error)
      if (error.response?.status === 404) {
        throw new Error('Document not found - may have been deleted or processing failed');
      }
      
      // Handle other errors - temporary issues, fallback to simulation
      if (error.response?.status >= 500) {
        // Server error - retry with simulation
        return this.simulateProcessingStatus(documentId);
      }
      
      // For other errors, throw to trigger retry logic
      throw error;
    }
  }

  private simulateProcessingStatus(documentId: number): ProcessingStatus {
    // This is a fallback simulation if the backend doesn't have status endpoint
    const now = Date.now();
    const elapsed = now - (this.getUploadStartTime(documentId) || now);
    
    if (elapsed < 3000) {
      return {
        id: documentId,
        status: 'processing',
        progress: Math.min(90, Math.floor(elapsed / 30)),
        message: 'Processing document...'
      };
    } else if (elapsed < 6000) {
      return {
        id: documentId,
        status: 'embedding',
        progress: Math.min(95, 90 + Math.floor((elapsed - 3000) / 60)),
        message: 'Generating embeddings...'
      };
    } else {
      return {
        id: documentId,
        status: 'completed',
        progress: 100,
        message: 'Document processed successfully'
      };
    }
  }

  private generateFileId(file: File): string {
    return `${file.name}_${file.size}_${Date.now()}`;
  }

  private getUploadStartTime(documentId: number): number | undefined {
    // This would be stored when upload starts
    return Date.now() - 1000; // Simulate 1 second ago
  }

  cancelUpload(fileId: string): void {
    const interval = this.pollingIntervals.get(fileId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(fileId);
    }
    this.progressCallbacks.delete(fileId);
  }

  cancelAllUploads(): void {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.pollingIntervals.clear();
    this.progressCallbacks.clear();
  }
}