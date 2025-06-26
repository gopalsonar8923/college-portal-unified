
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-college-bg to-white">
        <div className="w-full max-w-md mb-8 flex flex-col items-center">
          <img 
            src="/lovable-uploads/38b0ddb0-037f-484b-8ffa-3a3f4449817f.png" 
            alt="S.P.D.M. College" 
            className="w-24 h-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-center text-college-dark-blue">
            S.P.D.M. College Portal
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Login to access your academic resources
          </p>
        </div>
        <LoginForm />
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground bg-college-dark-blue text-white">
        © {new Date().getFullYear()} S.P.D.M. College - All rights reserved
      </footer>
    </div>
  );
}
