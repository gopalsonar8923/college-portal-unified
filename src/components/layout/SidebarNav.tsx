
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
    { href: "/schedule-lectures", label: "Schedule Lectures" },
    { href: "/results", label: "Results" },
    { href: "/hall-tickets", label: "Hall Tickets" },
    { href: "/calendar", label: "Calendar" },
    { href: "/attendance-reports", label: "Attendance Reports" },
  ];

  const teacherMenuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/schedule-lectures", label: "Schedule Lectures" },
    { href: "/mark-attendance", label: "Mark Attendance" },
    { href: "/attendance-reports", label: "Attendance Reports" },
    { href: "/calendar", label: "Calendar" },
  ];

  const studentMenuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/view-attendance", label: "View Attendance" },
    { href: "/results", label: "Results" },
    { href: "/hall-tickets", label: "Hall Tickets" },
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
