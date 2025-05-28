
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getAttendanceByStudent } from "@/lib/storage";
import { Attendance } from "@/types";

const ViewAttendancePage = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      const studentAttendance = getAttendanceByStudent(user.id);
      setAttendanceData(studentAttendance);
      
      // Get unique subjects
      const uniqueSubjects = [...new Set(studentAttendance.map(a => a.subject))];
      setSubjects(uniqueSubjects);
    }
  }, [user]);

  // Filter attendance data based on selected subject
  const filteredAttendance = selectedSubject 
    ? attendanceData.filter(a => a.subject === selectedSubject)
    : attendanceData;

  // Calculate overall statistics
  const getOverallStats = () => {
    const totalClasses = filteredAttendance.length;
    const presentClasses = filteredAttendance.filter(a => a.present).length;
    const absentClasses = totalClasses - presentClasses;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    return { totalClasses, presentClasses, absentClasses, percentage };
  };

  // Get subject-wise statistics
  const getSubjectStats = () => {
    const subjectStats: Record<string, any> = {};
    
    subjects.forEach(subject => {
      const subjectAttendance = attendanceData.filter(a => a.subject === subject);
      const total = subjectAttendance.length;
      const present = subjectAttendance.filter(a => a.present).length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      subjectStats[subject] = { total, present, percentage };
    });
    
    return subjectStats;
  };

  const overallStats = getOverallStats();
  const subjectStats = getSubjectStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Attendance</h1>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{overallStats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">Total Classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{overallStats.presentClasses}</div>
              <p className="text-xs text-muted-foreground">Present</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{overallStats.absentClasses}</div>
              <p className="text-xs text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{overallStats.percentage}%</div>
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
              <Progress value={overallStats.percentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Statistics */}
        {subjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map(subject => {
                  const stats = subjectStats[subject];
                  return (
                    <div key={subject} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats.present}/{stats.total} classes attended
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <Progress value={stats.percentage} />
                        </div>
                        <Badge 
                          variant={stats.percentage >= 75 ? "default" : stats.percentage >= 50 ? "secondary" : "destructive"}
                        >
                          {stats.percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter and Detailed Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            {subjects.length > 0 && (
              <div className="w-64">
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
          </CardHeader>
          <CardContent>
            {filteredAttendance.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No attendance records found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-muted-foreground" />
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>
                        <Badge variant={record.present ? "default" : "destructive"}>
                          {record.present ? "Present" : "Absent"}
                        </Badge>
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

export default ViewAttendancePage;
