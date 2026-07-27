export interface UploadedFile {
  name: string;
  size?: number;
}
export interface FileUploadProps {
  label?: string;
  /** Helper text below the drop zone */
  hint?: string;
  /** Accept attribute, e.g. .pdf,.jpg */
  accept?: string;
  multiple?: boolean;
  /** Currently attached files (controlled) */
  files?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  /** Error message — replaces hint and turns the border red */
  error?: string;
  /** Size limit shown in the drop zone, e.g. até 5 MB */
  maxSizeLabel?: string;
}
/** Drag-and-drop document upload for enrollment paperwork, with an attached-file list and per-file removal. */
export function FileUpload(props: FileUploadProps): JSX.Element;
