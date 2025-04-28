
import { useState } from "react";
import { Upload, X, FileIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { cn } from "@/lib/utils";

interface ExcelImporterProps<T> {
  onDataImported: (data: T[]) => void;
  validateRow?: (row: any) => { valid: boolean; errors?: string[] };
  sampleDataUrl?: string;
  className?: string;
}

export function ExcelImporter<T>({
  onDataImported,
  validateRow,
  sampleDataUrl,
  className,
}: ExcelImporterProps<T>) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    const validExtensions = ['xlsx', 'xls', 'csv'];
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !validExtensions.includes(extension)) {
      setError("Please select an Excel file (xlsx, xls, csv)");
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsImporting(true);
    setError(null);
    
    try {
      // Read the Excel file
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            setError("No data found in the Excel file");
            setIsImporting(false);
            return;
          }

          // Validate data if validator provided
          if (validateRow) {
            let hasErrors = false;
            const errors: string[] = [];

            jsonData.forEach((row, index) => {
              const validation = validateRow(row);
              if (!validation.valid) {
                hasErrors = true;
                errors.push(`Row ${index + 2}: ${validation.errors?.join(', ')}`);
              }
            });

            if (hasErrors) {
              setError(`Validation errors: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}`);
              setIsImporting(false);
              return;
            }
          }

          // Simulate progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setImportProgress(Math.min(progress, 100));
            
            if (progress >= 100) {
              clearInterval(interval);
              onDataImported(jsonData as T[]);
              setFile(null);
              toast.success(`Successfully imported ${jsonData.length} records`);
              setIsImporting(false);
            }
          }, 100);
          
        } catch (error) {
          console.error("Error processing file:", error);
          setError("Failed to process the Excel file");
          setIsImporting(false);
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read the file");
        setIsImporting(false);
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (err) {
      console.error("Import failed:", err);
      setError("Failed to import data. Please try again.");
      setIsImporting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!file ? (
        <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
          <input
            type="file"
            id="excelImport"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            disabled={isImporting}
          />
          <label
            htmlFor="excelImport"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload size={32} className="text-muted-foreground" />
            <span className="font-medium">Import Excel File</span>
            <span className="text-sm text-muted-foreground">
              Upload .xlsx, .xls, or .csv file
            </span>
          </label>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileIcon className="text-green-500" size={24} />
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
            {!isImporting && (
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
          
          {isImporting && (
            <div className="mt-2">
              <Progress value={importProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Importing... {importProgress}%
              </p>
            </div>
          )}

          {!isImporting && (
            <Button
              type="button"
              className="w-full mt-2"
              onClick={handleImport}
              variant="default"
            >
              <FileText size={16} className="mr-2" />
              Import Data
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {sampleDataUrl && (
        <div className="text-center">
          <Button variant="link" size="sm" asChild>
            <a href={sampleDataUrl} download>
              Download sample template
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
