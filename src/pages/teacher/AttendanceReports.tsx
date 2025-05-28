
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getAttendance, getStudentsByClass, exportAttendanceToExcel } from "@/lib/storage";
import { Attendance, Student } from "@/types";
import { CLASS_OPTIONS } from "@/lib/constants";

const AttendanceReportsPage = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Get teacher's classes
  const teacherClasses = user?.classes || [];

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      
      // Get students for the selected class
      const classStudents = getStudentsByClass(selectedClass);
      setStudents(classStudents);
      
      // Get attendance records for the class
      const allAttendance = getAttendance();
      const classAttendance = allAttendance.filter(a => a.class === selectedClass);
      setAttendanceData(classAttendance);
      
      // Get unique subjects for the class
      const uniqueSubjects = [...new Set(classAttendance.map(a => a.subject))];
      setSubjects(uniqueSubjects);
      
      setLoading(false);
    }
  }, [selectedClass]);

  // Filter attendance data based on selected subject
  const filteredAttendance = selectedSubject 
    ? attendanceData.filter(a => a.subject === selectedSubject)
    : attendanceData;

  // Calculate attendance statistics
  const getAttendanceStats = (studentId: string) => {
    const studentAttendance = filteredAttendance.filter(a => a.studentId === studentId);
    const totalClasses = studentAttendance.length;
    const presentClasses = studentAttendance.filter(a => a.present).length;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    return { totalClasses, presentClasses, percentage };
  };

  const handleExport = () => {
    if (filteredAttendance.length === 0) {
      return;
    }
    
    const fileName = `attendance_report_${selectedClass}_${selectedSubject || 'all'}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    exportAttendanceToExcel(filteredAttendance, fileName);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Attendance Reports</h1>
          {filteredAttendance.length > 0 && (
            <Button onClick={handleExport} className="flex items-center gap-2">
              <DownloadIcon size={16} />
              Export Report
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map(className => (
                      <SelectItem key={className} value={className}>
                        {CLASS_OPTIONS.find(c => c.value === className)?.label || className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {subjects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Subject (Optional)</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedClass && (
          <Card>
            <CardHeader>
              <CardTitle>
                Attendance Summary - {CLASS_OPTIONS.find(c => c.value === selectedClass)?.label}
                {selectedSubject && ` - ${selectedSubject}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading attendance data...</p>
              ) : students.length === 0 ? (
                <p>No students found in this class.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Total Classes</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Attendance %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => {
                      const stats = getAttendanceStats(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{stats.totalClasses}</TableCell>
                          <TableCell>{stats.presentClasses}</TableCell>
                          <TableCell>{stats.totalClasses - stats.presentClasses}</TableCell>
                          <TableCell>{stats.percentage}%</TableCell>
                          <TableCell>
                            <Badge 
                              variant={stats.percentage >= 75 ? "default" : stats.percentage >= 50 ? "secondary" : "destructive"}
                            >
                              {stats.percentage >= 75 ? "Good" : stats.percentage >= 50 ? "Average" : "Poor"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendanceReportsPage;
