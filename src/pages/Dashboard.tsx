
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { getEvents, getStudents, getResults, getHallTickets, getAttendance } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    upcomingEvents: 0,
    classes: 0,
    attendance: 0,
    results: 0,
    hallTickets: 0
  });

  useEffect(() => {
    // Fetch relevant data based on user role
    const events = getEvents();
    let relevantStats = {
      students: 0,
      teachers: 0,
      upcomingEvents: 0,
      classes: 0,
      attendance: 0,
      results: 0,
      hallTickets: 0
    };

    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.start) > now);
    relevantStats.upcomingEvents = upcomingEvents.length;

    if (user?.role === ROLE.ADMIN) {
      const students = getStudents();
      const teachers = JSON.parse(localStorage.getItem("college_portal_users") || "[]")
        .filter((u: any) => u.role === ROLE.TEACHER);
      const classesCount = new Set(students.map(s => s.class)).size;
      const results = getResults();
      const hallTickets = getHallTickets();
      
      relevantStats.students = students.length;
      relevantStats.teachers = teachers.length;
      relevantStats.classes = classesCount;
      relevantStats.results = results.length;
      relevantStats.hallTickets = hallTickets.length;

    } else if (user?.role === ROLE.TEACHER) {
      const teacherClasses = user.classes || [];
      const students = getStudents().filter(s => 
        teacherClasses.includes(s.class)
      );
      const attendance = getAttendance();
      
      relevantStats.students = students.length;
      relevantStats.classes = teacherClasses.length;
      relevantStats.attendance = attendance.length;

    } else if (user?.role === ROLE.STUDENT) {
      const attendance = getAttendance().filter(a => 
        a.studentId === user.id
      );
      const studentClass = (user as any).class;
      const results = getResults().filter(r => 
        r.class === studentClass
      );
      const hallTickets = getHallTickets().filter(h => 
        h.class === studentClass
      );
      
      relevantStats.attendance = attendance.length;
      relevantStats.results = results.length;
      relevantStats.hallTickets = hallTickets.length;
    }

    setStats(relevantStats);
  }, [user]);

  const renderAdminDashboard = () => (
    <>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.students}</CardTitle>
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.teachers}</CardTitle>
            <CardDescription>Total Teachers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.classes}</CardTitle>
            <CardDescription>Active Classes</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/manage-students">Manage Students</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/manage-teachers">Manage Teachers</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/schedule-lectures">Schedule Lectures</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/results">Manage Results</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/hall-tickets">Manage Hall Tickets</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/attendance-reports">Attendance Reports</a>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Events this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className={cn("rounded-md border", "p-3 pointer-events-auto")}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <a href="/calendar">View Full Calendar</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.students}</CardTitle>
            <CardDescription>Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.classes}</CardTitle>
            <CardDescription>Assigned Classes</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.upcomingEvents}</CardTitle>
            <CardDescription>Upcoming Events</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common teaching tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/schedule-lectures">Schedule Lectures</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/mark-attendance">Mark Attendance</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/attendance-reports">View Reports</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/calendar">View Calendar</a>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Events this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className={cn("rounded-md border", "p-3 pointer-events-auto")}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <a href="/calendar">View Full Calendar</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderStudentDashboard = () => (
    <>
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.attendance}</CardTitle>
            <CardDescription>Attendance Records</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.results}</CardTitle>
            <CardDescription>Available Results</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.upcomingEvents}</CardTitle>
            <CardDescription>Upcoming Events</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>View your academic information</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/view-attendance">View Attendance</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/results">Check Results</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/hall-tickets">Hall Tickets</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/calendar">Academic Calendar</a>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Events this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className={cn("rounded-md border", "p-3 pointer-events-auto")}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <a href="/calendar">View Full Calendar</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case ROLE.ADMIN:
        return renderAdminDashboard();
      case ROLE.TEACHER:
        return renderTeacherDashboard();
      case ROLE.STUDENT:
        return renderStudentDashboard();
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboardByRole()}
    </DashboardLayout>
  );
}
