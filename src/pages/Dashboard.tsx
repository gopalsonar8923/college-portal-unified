
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { getEvents, getStudents, getResults, getHallTickets, getAttendance } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Book, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    upcomingEvents: 0,
    classes: 0,
    attendance: 0,
    results: 0,
    hallTickets: 0,
    todaysLectures: 0
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
      hallTickets: 0,
      todaysLectures: 0
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const upcomingEvents = events.filter(event => new Date(event.start) > now);
    relevantStats.upcomingEvents = upcomingEvents.length;
    
    // Calculate today's lectures
    const todaysLectures = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= today && eventDate < tomorrow && event.type === "lecture";
    });
    relevantStats.todaysLectures = todaysLectures.length;

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
              <Link to="/manage-students">Manage Students</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/manage-teachers">Manage Teachers</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/schedule-lectures">Schedule Lectures</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/results">Manage Results</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/hall-tickets">Manage Hall Tickets</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/attendance-reports">Attendance Reports</Link>
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
                <Link to="/calendar">View Full Calendar</Link>
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <CardTitle className="text-2xl">{stats.todaysLectures}</CardTitle>
            <CardDescription>Today's Lectures</CardDescription>
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
          <CardContent className="grid grid-cols-1 gap-2">
            <Button className="justify-start" asChild>
              <Link to="/teacher/schedule-lectures" className="flex items-center">
                <Book className="mr-2" />
                View Lecture Schedule
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/teacher/mark-attendance" className="flex items-center">
                <Users className="mr-2" />
                Mark Attendance
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/teacher/attendance-reports" className="flex items-center">
                <Clock className="mr-2" />
                View Attendance Reports
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/calendar" className="flex items-center">
                <CalendarIcon className="mr-2" />
                View Calendar
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today's Lectures</CardTitle>
            <CardDescription>Your scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.todaysLectures === 0 ? (
              <p className="text-muted-foreground">No lectures scheduled for today.</p>
            ) : (
              <div className="space-y-2">
                <Button className="w-full justify-center" asChild>
                  <Link to="/teacher/schedule-lectures">
                    View Today's {stats.todaysLectures} Lecture{stats.todaysLectures > 1 ? 's' : ''}
                  </Link>
                </Button>
              </div>
            )}
            <div className="mt-4">
              <Calendar
                mode="single"
                className={cn("rounded-md border", "p-3 pointer-events-auto")}
              />
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
              <Link to="/student/view-attendance">View Attendance</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/student/results">Check Results</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/student/hall-tickets">Hall Tickets</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/calendar">Academic Calendar</Link>
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
                <Link to="/calendar">View Full Calendar</Link>
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
