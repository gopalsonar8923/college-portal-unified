
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE } from "@/lib/constants";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const adminMenuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/manage-teachers", label: "Manage Teachers" },
    { href: "/manage-students", label: "Manage Students" },
    { href: "/admin/schedule-lectures", label: "Schedule Lectures" },
    { href: "/admin/results", label: "Results" },
    { href: "/admin/hall-tickets", label: "Hall Tickets" },
    { href: "/calendar", label: "Calendar" },
    { href: "/admin/attendance-reports", label: "Attendance Reports" },
  ];

  const teacherMenuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/teacher/schedule-lectures", label: "Schedule Lectures" },
    { href: "/teacher/mark-attendance", label: "Mark Attendance" },
    { href: "/teacher/attendance-reports", label: "Attendance Reports" },
    { href: "/teacher/view-students", label: "View Students" },
    { href: "/calendar", label: "Calendar" },
  ];

  const studentMenuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/student/view-attendance", label: "View Attendance" },
    { href: "/student/results", label: "Results" },
    { href: "/student/hall-tickets", label: "Hall Tickets" },
    { href: "/calendar", label: "Calendar" },
  ];

  let menuItems;
  let roleLabel;

  switch (user.role) {
    case ROLE.ADMIN:
      menuItems = adminMenuItems;
      roleLabel = "Administration";
      break;
    case ROLE.TEACHER:
      menuItems = teacherMenuItems;
      roleLabel = "Faculty";
      break;
    case ROLE.STUDENT:
      menuItems = studentMenuItems;
      roleLabel = "Student";
      break;
    default:
      menuItems = studentMenuItems;
      roleLabel = "Navigation";
  }

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabel} Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        pathname === item.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "transparent",
                        "w-full"
                      )}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
