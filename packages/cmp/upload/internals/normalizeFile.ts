import { UploadFile } from "@vaadin/upload/vaadin-upload.js";

export function normalizeFile(file: UploadFile): UploadFile & { timestamp: string } {
  return {
    ...file,
    lastModified: file.lastModified || 0,
    name: file.name || '',
    size: file.size || 0,
    type: file.type || '',
    timestamp: new Date().toISOString()
  } as UploadFile & { timestamp: string }
}