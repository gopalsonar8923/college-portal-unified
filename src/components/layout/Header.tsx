
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleLabel } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-college-dark-blue to-college-orange shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/38b0ddb0-037f-484b-8ffa-3a3f4449817f.png" 
              alt="S.P.D.M. College" 
              className="college-logo"
            />
            <span className="text-xl font-bold text-white hidden md:inline">
              S.P.D.M. College Portal
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Desktop navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-white hover:text-college-bg transition-colors">
              Dashboard
            </Link>
            <Link to="/calendar" className="text-white hover:text-college-bg transition-colors">
              Calendar
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Bell size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm">No new notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {getRoleLabel(user.role)}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && user && (
          <div className="fixed inset-0 top-16 bg-background z-30 p-4 md:hidden flex flex-col">
            <nav className="flex flex-col gap-4 text-lg">
              <Link 
                to="/dashboard" 
                className="p-2 rounded-md hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/calendar" 
                className="p-2 rounded-md hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calendar
              </Link>
              <Link 
                to="/profile" 
                className="p-2 rounded-md hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button 
                onClick={logout}
                className="p-2 mt-auto text-left rounded-md hover:bg-muted text-destructive"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
