
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { CLASS_OPTIONS } from "@/lib/constants";
import { addEvent, getEventsByClass } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ScheduleLecturesPage = () => {
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedClass || !subject || !selectedDate || !startTime || !endTime) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      // Create date objects for start and end times
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const startDateTime = new Date(`${dateString}T${startTime}`);
      const endDateTime = new Date(`${dateString}T${endTime}`);
      
      // Check if end time is after start time
      if (endDateTime <= startDateTime) {
        toast.error("End time must be after start time");
        return;
      }
      
      addEvent({
        title,
        type: "lecture",
        class: selectedClass as any,
        subject,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        description,
      });
      
      toast.success("Lecture scheduled successfully");
      
      // Reset form
      setTitle("");
      setSelectedClass("");
      setSubject("");
      setSelectedDate(undefined);
      setStartTime("");
      setEndTime("");
      setDescription("");
    } catch (error) {
      console.error("Error scheduling lecture:", error);
      toast.error("Failed to schedule lecture");
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Schedule Lectures</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Lecture</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lecture Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Introduction to Programming"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select a class" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Computer Science"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Lecture details"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Schedule Lecture
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About Lecture Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Use this page to schedule lectures for different classes. Once scheduled, 
                  teachers assigned to the selected class can view the lectures and mark 
                  attendance for their students.
                </p>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Important Notes:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Make sure to select the correct class for the lecture</li>
                    <li>Choose appropriate start and end times</li>
                    <li>Ensure lectures don't overlap for the same class</li>
                    <li>Teachers will be notified about newly scheduled lectures</li>
                  </ul>
                </div>
                
                <div className="rounded-lg bg-primary/5 p-4">
                  <h4 className="font-medium">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    For any issues related to lecture scheduling, please contact the 
                    IT department or refer to the administrator manual.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleLecturesPage;
