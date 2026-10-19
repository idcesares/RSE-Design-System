import React from 'react';
export interface UploadedFile {
  name: string;
  size?: number;
}
export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  /** Helper text below the drop zone */
  hint?: string;
  /** Accept attribute, e.g. .pdf,.jpg */
  accept?: string;
  multiple?: boolean;
  /** Currently attached files (controlled) */
  files?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  /** Error message — replaces hint, turns the border red, sets aria-invalid and is announced */
  error?: string;
  /** Size limit shown in the drop zone, e.g. até 5 MB */
  maxSizeLabel?: string;
  /** Explicit id prefix for label/message wiring; otherwise React.useId */
  id?: string;
  /** Instruction inside the drop zone. Default: 'Arraste os arquivos ou clique para escolher' */
  dropLabel?: string;
  /** Format hint shown when neither accept nor maxSizeLabel is set. Default: 'PDF, JPG ou PNG' */
  acceptHint?: string;
}
/** Drag-and-drop document upload for enrollment paperwork, with an attached-file list and per-file removal. */
export const FileUpload: React.ForwardRefExoticComponent<FileUploadProps & React.RefAttributes<HTMLDivElement>>;
