import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import { getStudentsByClass, addAttendance, getAttendanceByClass } from "@/lib/storage";
import { Student, Attendance } from "@/types";

const MarkAttendancePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lectureId, className, subject, date } = location.state || {};
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [existingAttendance, setExistingAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (!className || !subject || !date) {
      toast.error("Missing lecture information");
      navigate("/schedule-lectures");
      return;
    }

    // Get students for the class
    const classStudents = getStudentsByClass(className);
    setStudents(classStudents);

    // Check if attendance was already marked for this date and subject
    const classAttendance = getAttendanceByClass(className).filter(
      a => a.date === date && a.subject === subject
    );
    
    setExistingAttendance(classAttendance);
    
    // If attendance was already marked, pre-populate the checkboxes
    if (classAttendance.length > 0) {
      const attendanceMap: Record<string, boolean> = {};
      classStudents.forEach(student => {
        const studentAttendance = classAttendance.find(a => a.studentId === student.id);
        attendanceMap[student.id] = studentAttendance ? studentAttendance.present : false;
      });
      setAttendance(attendanceMap);
      toast.info("Attendance already marked for this lecture. You can update it.");
    } else {
      // Otherwise, initialize all students as present
      const initialAttendance: Record<string, boolean> = {};
      classStudents.forEach(student => {
        initialAttendance[student.id] = true;
      });
      setAttendance(initialAttendance);
    }
    
    setLoading(false);
  }, [className, subject, date, navigate]);

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const handleSubmit = () => {
    try {
      // Delete existing attendance records if any
      // Since we don't have a deleteAttendance function, we'll just overwrite them
      // Below when we add the new attendance records
      
      // Add new attendance records
      students.forEach(student => {
        addAttendance({
          date,
          subject,
          class: className,
          studentId: student.id,
          present: attendance[student.id] || false
        });
      });
      
      toast.success("Attendance marked successfully!");
      navigate("/schedule-lectures");
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <Card>
            <CardContent className="pt-6">
              <p>Loading students...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>
              Attendance for {subject} - {format(new Date(date), "MMMM dd, yyyy")}
            </CardTitle>
            <p className="text-muted-foreground">Class: {className}</p>
          </CardHeader>
          
          <CardContent>
            {students.length === 0 ? (
              <p>No students found in this class.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Present</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Checkbox 
                          checked={attendance[student.id] || false}
                          onCheckedChange={(checked) => 
                            handleAttendanceChange(student.id, checked === true)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/schedule-lectures")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {existingAttendance.length > 0 ? "Update Attendance" : "Mark Attendance"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendancePage;
