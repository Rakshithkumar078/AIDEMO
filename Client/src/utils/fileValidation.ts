// File validation utilities
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileTypeConfig {
  extensions: string[];
  mimeTypes: string[];
  maxSize: number; // in bytes
  icon: string;
  color: string;
}

export const FILE_TYPES: Record<string, FileTypeConfig> = {
  PDF: {
    extensions: ['.pdf'],
    mimeTypes: ['application/pdf'],
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: 'fas fa-file-pdf',
    color: '#dc3545'
  },
  DOCX: {
    extensions: ['.docx', '.doc'],
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: 'fas fa-file-word',
    color: '#0d6efd'
  },
  TXT: {
    extensions: ['.txt'],
    mimeTypes: ['text/plain'],
    maxSize: 5 * 1024 * 1024, // 5MB
    icon: 'fas fa-file-alt',
    color: '#6c757d'
  },
  IMAGE: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: 'fas fa-file-image',
    color: '#198754'
  },
  OTHER: {
    extensions: [],
    mimeTypes: [],
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: 'fas fa-file',
    color: '#6c757d'
  }
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 5; // Maximum files per upload

export const validateFile = (file: File): FileValidationResult => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty'
    };
  }

  // Get file type
  const fileType = getFileType(file);
  const config = FILE_TYPES[fileType];

  // Check file size against type-specific limit
  if (file.size > config.maxSize) {
    return {
      isValid: false,
      error: `${fileType} files cannot exceed ${formatFileSize(config.maxSize)}`
    };
  }

  return { isValid: true };
};

export const validateFiles = (files: File[]): FileValidationResult => {
  // Check number of files
  if (files.length > MAX_FILES) {
    return {
      isValid: false,
      error: `Cannot upload more than ${MAX_FILES} files at once`
    };
  }

  // Validate each file
  for (const file of files) {
    const result = validateFile(file);
    if (!result.isValid) {
      return {
        isValid: false,
        error: `${file.name}: ${result.error}`
      };
    }
  }

  return { isValid: true };
};

export const getFileType = (file: File): string => {
  const extension = getFileExtension(file.name).toLowerCase();
  const mimeType = file.type.toLowerCase();

  for (const [type, config] of Object.entries(FILE_TYPES)) {
    if (type === 'OTHER') continue;
    
    if (config.extensions.includes(extension) || config.mimeTypes.includes(mimeType)) {
      return type;
    }
  }

  return 'OTHER';
};

export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot) : '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (file: File): { icon: string; color: string } => {
  const fileType = getFileType(file);
  const config = FILE_TYPES[fileType];
  return { icon: config.icon, color: config.color };
};

export const isValidFileType = (file: File): boolean => {
  const fileType = getFileType(file);
  return fileType !== 'OTHER' || FILE_TYPES.OTHER.extensions.length === 0;
};