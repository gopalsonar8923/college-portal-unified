
import { useState } from "react";
import { Upload, X, FileIcon, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileUploaded: (fileUrl: string, fileName: string) => void;
  accept?: string;
  label?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUploader({
  onFileUploaded,
  accept = "application/pdf",
  label = "Upload File",
  maxSizeMB = 5,
  className,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    
    // Check file size
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds maximum allowed size (${maxSizeMB}MB)`);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      const fileUrl = await uploadFile(file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onFileUploaded(fileUrl, file.name);
        setFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
      
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload file. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4">
        {!file ? (
          <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              accept={accept}
              className="sr-only"
              disabled={isUploading}
            />
            <label
              htmlFor="fileUpload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload size={32} className="text-muted-foreground" />
              <span className="font-medium">{label}</span>
              <span className="text-sm text-muted-foreground">
                Drag & drop or click to select a file
              </span>
              <span className="text-xs text-muted-foreground">
                Max size: {maxSizeMB}MB
              </span>
            </label>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileIcon className="text-primary" size={24} />
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </p>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  type="button"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            
            {isUploading && (
              <div className="mt-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {!isUploading && (
              <Button
                type="button"
                className="w-full mt-2"
                onClick={handleUpload}
              >
                <FileUp size={16} className="mr-2" />
                Upload File
              </Button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
