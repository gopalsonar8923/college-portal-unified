
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ROLE } from "@/lib/constants";

// Auth Pages
import LoginPage from "@/pages/auth/Login";
import Index from "@/pages/Index";

// Dashboard Pages
import DashboardPage from "@/pages/Dashboard";

// Admin Pages
import ManageTeachersPage from "@/pages/admin/ManageTeachers";
import ManageStudentsPage from "@/pages/admin/ManageStudents";
import ScheduleLecturesPage from "@/pages/admin/ScheduleLectures";
import AdminResultsPage from "@/pages/admin/Results";
import AdminHallTicketsPage from "@/pages/admin/HallTickets";
import AdminAttendanceReportsPage from "@/pages/admin/AttendanceReports";

// Teacher Pages
import TeacherScheduleLecturesPage from "@/pages/teacher/ScheduleLectures";
import MarkAttendancePage from "@/pages/teacher/MarkAttendance";
import TeacherAttendanceReportsPage from "@/pages/teacher/AttendanceReports";

// Student Pages
import ViewAttendancePage from "@/pages/student/ViewAttendance";
import StudentResultsPage from "@/pages/student/Results";
import StudentHallTicketsPage from "@/pages/student/HallTickets";

// Shared Pages
import CalendarPage from "@/pages/Calendar";
import ProfilePage from "@/pages/Profile";

// Not Found
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute element={<DashboardPage />} />} 
            />

            {/* Admin Routes */}
            <Route 
              path="/manage-teachers" 
              element={<ProtectedRoute element={<ManageTeachersPage />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/manage-students" 
              element={<ProtectedRoute element={<ManageStudentsPage />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/admin/schedule-lectures" 
              element={<ProtectedRoute element={<ScheduleLecturesPage />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/admin/results" 
              element={<ProtectedRoute element={<AdminResultsPage />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/admin/hall-tickets" 
              element={<ProtectedRoute element={<AdminHallTicketsPage />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/admin/attendance-reports" 
              element={<ProtectedRoute element={<AdminAttendanceReportsPage />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            
            {/* To support existing URLs */}
            <Route 
              path="/schedule-lectures" 
              element={<ProtectedRoute element={<Navigate to="/admin/schedule-lectures" replace />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/results" 
              element={<ProtectedRoute element={<Navigate to="/admin/results" replace />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/hall-tickets" 
              element={<ProtectedRoute element={<Navigate to="/admin/hall-tickets" replace />} allowedRoles={[ROLE.ADMIN]} />} 
            />
            <Route 
              path="/attendance-reports" 
              element={<ProtectedRoute element={<Navigate to="/admin/attendance-reports" replace />} allowedRoles={[ROLE.ADMIN]} />} 
            />

            {/* Teacher Routes */}
            <Route 
              path="/teacher/schedule-lectures" 
              element={<ProtectedRoute element={<TeacherScheduleLecturesPage />} allowedRoles={[ROLE.TEACHER]} />} 
            />
            <Route 
              path="/teacher/mark-attendance" 
              element={<ProtectedRoute element={<MarkAttendancePage />} allowedRoles={[ROLE.TEACHER]} />} 
            />
            <Route 
              path="/teacher/attendance-reports" 
              element={<ProtectedRoute element={<TeacherAttendanceReportsPage />} allowedRoles={[ROLE.TEACHER]} />} 
            />
            
            {/* To support existing URLs */}
            <Route 
              path="/schedule-lectures" 
              element={<ProtectedRoute element={<Navigate to="/teacher/schedule-lectures" replace />} allowedRoles={[ROLE.TEACHER]} />} 
            />
            <Route 
              path="/mark-attendance" 
              element={<ProtectedRoute element={<Navigate to="/teacher/mark-attendance" replace />} allowedRoles={[ROLE.TEACHER]} />} 
            />
            <Route 
              path="/attendance-reports" 
              element={<ProtectedRoute element={<Navigate to="/teacher/attendance-reports" replace />} allowedRoles={[ROLE.TEACHER]} />} 
            />

            {/* Student Routes */}
            <Route 
              path="/student/view-attendance" 
              element={<ProtectedRoute element={<ViewAttendancePage />} allowedRoles={[ROLE.STUDENT]} />} 
            />
            <Route 
              path="/student/results" 
              element={<ProtectedRoute element={<StudentResultsPage />} allowedRoles={[ROLE.STUDENT]} />} 
            />
            <Route 
              path="/student/hall-tickets" 
              element={<ProtectedRoute element={<StudentHallTicketsPage />} allowedRoles={[ROLE.STUDENT]} />} 
            />
            
            {/* To support existing URLs */}
            <Route 
              path="/view-attendance" 
              element={<ProtectedRoute element={<Navigate to="/student/view-attendance" replace />} allowedRoles={[ROLE.STUDENT]} />} 
            />
            <Route 
              path="/results" 
              element={<ProtectedRoute element={<Navigate to="/student/results" replace />} allowedRoles={[ROLE.STUDENT]} />} 
            />
            <Route 
              path="/hall-tickets" 
              element={<ProtectedRoute element={<Navigate to="/student/hall-tickets" replace />} allowedRoles={[ROLE.STUDENT]} />} 
            />

            {/* Shared Routes */}
            <Route 
              path="/calendar" 
              element={<ProtectedRoute element={<CalendarPage />} />} 
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute element={<ProfilePage />} />} 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
