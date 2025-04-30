
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
import { addHallTicket, getHallTicketsByClass } from "@/lib/storage";
import { toast } from "sonner";
import { HallTicket } from "@/types";

const HallTicketsPage = () => {
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [examDate, setExamDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [hallTickets, setHallTickets] = useState<HallTicket[]>([]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    if (value) {
      const classHallTickets = getHallTicketsByClass(value);
      setHallTickets(classHallTickets);
    } else {
      setHallTickets([]);
    }
  };

  const handleFileUploaded = (url: string, name: string) => {
    setFileUrl(url);
    setFileName(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedClass || !examDate || !fileUrl) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const newHallTicket = addHallTicket({
        title,
        class: selectedClass as any,
        examDate,
        fileUrl,
        uploadDate: new Date().toISOString(),
      });

      toast.success("Hall ticket uploaded successfully");
      
      // Reset form
      setTitle("");
      setExamDate("");
      setFileUrl("");
      setFileName("");
      
      // Refresh hall tickets list
      const updatedHallTickets = getHallTicketsByClass(selectedClass);
      setHallTickets(updatedHallTickets);
    } catch (error) {
      console.error("Failed to upload hall ticket:", error);
      toast.error("Failed to upload hall ticket");
    }
  };

  const handleDelete = (id: string) => {
    try {
      const storage = require("@/lib/storage");
      storage.deleteHallTicket(id);
      toast.success("Hall ticket deleted successfully");
      
      // Refresh hall tickets list
      const updatedHallTickets = getHallTicketsByClass(selectedClass);
      setHallTickets(updatedHallTickets);
    } catch (error) {
      console.error("Failed to delete hall ticket:", error);
      toast.error("Failed to delete hall ticket");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Hall Tickets Management</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Hall Tickets</CardTitle>
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
                    placeholder="Final Exam Hall Tickets"
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
                  <label htmlFor="examDate" className="block text-sm font-medium mb-1">
                    Exam Date
                  </label>
                  <Input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hall Tickets PDF
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
                      label="Upload Hall Tickets PDF"
                    />
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  Upload Hall Tickets
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Hall Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedClass ? (
                <p className="text-muted-foreground">Select a class to view uploaded hall tickets</p>
              ) : hallTickets.length === 0 ? (
                <p className="text-muted-foreground">No hall tickets uploaded for this class yet</p>
              ) : (
                <div className="space-y-4">
                  {hallTickets.map((ticket) => (
                    <div key={ticket.id} className="border p-3 rounded flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Exam Date: {new Date(ticket.examDate).toLocaleDateString()} | Uploaded: {new Date(ticket.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const storage = require("@/lib/storage");
                            storage.downloadFile(ticket.fileUrl, `${ticket.title}.pdf`);
                          }}
                        >
                          Download
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(ticket.id)}
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

export default HallTicketsPage;
