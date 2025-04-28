
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-college-bg to-white p-4">
      <img 
        src="/lovable-uploads/38b0ddb0-037f-484b-8ffa-3a3f4449817f.png" 
        alt="S.P.D.M. College" 
        className="w-20 h-auto mb-6"
      />
      <h1 className="text-4xl font-bold mb-4 text-college-dark-blue">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <p className="text-center text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
