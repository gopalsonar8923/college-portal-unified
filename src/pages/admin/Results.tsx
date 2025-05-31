
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/common/FileUploader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASS_OPTIONS } from "@/lib/constants";
import { addResult, getResultsByClass, deleteResult, downloadFile } from "@/lib/storage";
import { toast } from "sonner";
import { Result } from "@/types";

const ResultsPage = () => {
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [semester, setSemester] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    if (value) {
      const classResults = getResultsByClass(value);
      setResults(classResults);
    } else {
      setResults([]);
    }
  };

  const handleFileUploaded = (url: string, name: string) => {
    console.log("File uploaded:", name, url);
    setFileUrl(url);
    setFileName(name);
    toast.success("File uploaded successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedClass || !semester || !fileUrl) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      console.log("Adding result:", { title, selectedClass, semester, fileUrl });
      
      const newResult = addResult({
        title,
        class: selectedClass as any,
        semester,
        fileUrl,
        uploadDate: new Date().toISOString(),
      });

      toast.success("Result uploaded successfully");
      
      // Reset form
      setTitle("");
      setSemester("");
      setFileUrl("");
      setFileName("");
      
      // Refresh results list
      const updatedResults = getResultsByClass(selectedClass);
      setResults(updatedResults);
    } catch (error) {
      console.error("Failed to upload result:", error);
      toast.error("Failed to upload result");
    }
  };

  const handleDelete = (id: string) => {
    try {
      console.log("Deleting result with ID:", id);
      const success = deleteResult(id);
      
      if (success) {
        toast.success("Result deleted successfully");
        
        // Refresh results list
        if (selectedClass) {
          const updatedResults = getResultsByClass(selectedClass);
          setResults(updatedResults);
        }
      } else {
        toast.error("Failed to delete result - not found");
      }
    } catch (error) {
      console.error("Failed to delete result:", error);
      toast.error("Failed to delete result");
    }
  };

  const handleDownload = (result: Result) => {
    try {
      console.log("Downloading result:", result.title);
      downloadFile(result.fileUrl, `${result.title}.pdf`);
    } catch (error) {
      console.error("Failed to download result:", error);
      toast.error("Failed to download result");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Results Management</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Results</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Final Exam Results"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="class" className="block text-sm font-medium mb-1">
                    Class
                  </label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium mb-1">
                    Semester
                  </label>
                  <Input
                    id="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="Semester 1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Result PDF
                  </label>
                  {fileUrl ? (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <span className="truncate flex-1">{fileName}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setFileUrl("");
                          setFileName("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <FileUploader
                      onFileUploaded={handleFileUploaded}
                      accept="application/pdf"
                      label="Upload Result PDF"
                    />
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  Upload Result
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedClass ? (
                <p className="text-muted-foreground">Select a class to view uploaded results</p>
              ) : results.length === 0 ? (
                <p className="text-muted-foreground">No results uploaded for this class yet</p>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.id} className="border p-3 rounded flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{result.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.semester} | Uploaded: {new Date(result.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(result)}
                        >
                          Download
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(result.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;
