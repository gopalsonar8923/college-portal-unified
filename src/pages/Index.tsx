
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { initializeFreshApplication } from "@/lib/storage";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize fresh application on first load
    const isFirstLoad = !localStorage.getItem("college_portal_initialized");
    
    if (isFirstLoad) {
      console.log("First load detected, initializing fresh application...");
      initializeFreshApplication();
      localStorage.setItem("college_portal_initialized", "true");
    }
    
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return <Navigate to="/login" replace />;
};

export default Index;
