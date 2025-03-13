
export type UploadedFile = {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
};

export interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
}

export interface FileItemProps {
  file: File;
  onRemove: () => void;
  isUploading: boolean;
}

export interface UploadedFileItemProps {
  file: UploadedFile;
  onRemove: () => void;
}

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export interface UploadButtonsProps {
  onClearAll: () => void;
  onUpload: () => void;
  isUploading: boolean;
  fileCount: number;
}

export interface UploadProgressProps {
  progress: number;
}
