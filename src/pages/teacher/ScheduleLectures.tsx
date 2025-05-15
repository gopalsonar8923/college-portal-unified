
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getEvents } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { ScheduledEvent } from "@/types";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

const ScheduleLecturesPage = () => {
  const [lectures, setLectures] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.classes) {
      // Filter events for the teacher's classes and only get lectures
      const teacherEvents = getEvents().filter(
        event => 
          event.type === "lecture" && 
          user.classes && 
          event.class && 
          user.classes.includes(event.class)
      );
      
      setLectures(teacherEvents);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleMarkAttendance = (lecture: ScheduledEvent) => {
    if (!lecture.class || !lecture.subject) {
      toast.error("Missing lecture information");
      return;
    }
    
    navigate("/teacher/mark-attendance", { 
      state: { 
        lectureId: lecture.id,
        className: lecture.class,
        subject: lecture.subject,
        date: format(new Date(lecture.start), "yyyy-MM-dd")
      } 
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Scheduled Lectures</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>My Lecture Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading your lecture schedule...</p>
            ) : lectures.length === 0 ? (
              <p>No lectures scheduled for your classes yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lectures.map((lecture) => (
                    <TableRow key={lecture.id}>
                      <TableCell className="font-medium">{lecture.subject}</TableCell>
                      <TableCell>{lecture.class}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(new Date(lecture.start), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {format(new Date(lecture.start), "hh:mm a")} - {format(new Date(lecture.end), "hh:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkAttendance(lecture)}
                        >
                          Mark Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleLecturesPage;
