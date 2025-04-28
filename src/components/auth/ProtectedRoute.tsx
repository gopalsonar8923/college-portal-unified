
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ element, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{element}</>;
}
