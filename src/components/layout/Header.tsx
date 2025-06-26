
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
    <header className="bg-gradient-to-r from-college-dark-blue to-college-orange shadow-md sticky top-0 z-50 w-full">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
            <img 
              src="/gopal-uploads/38b0ddb0-037f-484b-8ffa-3a3f4449817f.png" 
              alt="S.P.D.M. College" 
              className="college-logo flex-shrink-0"
            />
            <span className="text-lg sm:text-xl font-bold text-white hidden sm:inline truncate">
              S.P.D.M. College Portal
            </span>
            <span className="text-sm font-bold text-white sm:hidden truncate">
              SPDM
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white h-9 w-9">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Desktop navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            <Link to="/dashboard" className="text-white hover:text-college-bg transition-colors text-sm lg:text-base whitespace-nowrap">
              Dashboard
            </Link>
            <Link to="/calendar" className="text-white hover:text-college-bg transition-colors text-sm lg:text-base whitespace-nowrap">
              Calendar
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white h-9 w-9">
                  <Bell size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-50">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm">No new notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white h-9 w-9">
                  <User size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-50">
                <DropdownMenuLabel className="max-w-[200px] truncate">{user.name}</DropdownMenuLabel>
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

        {/* Mobile menu overlay */}
        {mobileMenuOpen && user && (
          <div className="fixed inset-0 top-[73px] bg-background z-40 p-4 md:hidden flex flex-col safe-area-inset">
            <nav className="flex flex-col gap-4 text-lg">
              <Link 
                to="/dashboard" 
                className="p-3 rounded-md hover:bg-muted text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/calendar" 
                className="p-3 rounded-md hover:bg-muted text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calendar
              </Link>
              <Link 
                to="/profile" 
                className="p-3 rounded-md hover:bg-muted text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="p-3 mt-auto text-left rounded-md hover:bg-muted text-destructive"
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
