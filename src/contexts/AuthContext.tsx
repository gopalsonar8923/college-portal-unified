
import React, { createContext, useContext, useEffect, useState } from "react";
import { Role, User, Student } from "@/types";
import { ROLE } from "@/lib/constants";
import { authService } from "@/services/authService";
import { addStudent, initializeFreshApplication } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  getUsers: (role?: Role) => any[];
  addUser: (user: any) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  resetApplication: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in with secure session validation
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: Role) => {
    const success = await authService.login(email, password, role);
    if (success) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    return success;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = "/login";
  };

  const getUsers = (role?: Role) => {
    if (!user) return [];
    
    try {
      const users = authService.getAllUsers(user);
      if (role) {
        return users.filter((u: any) => u.role === role);
      }
      return users;
    } catch (error) {
      console.error("Unauthorized access:", error);
      return [];
    }
  };

  const addUser = async (userData: any) => {
    const success = await authService.register(userData);
    
    if (success && userData.role === ROLE.STUDENT && userData.class) {
      // Also add to students list for compatibility
      const studentData: Omit<Student, "id"> = {
        name: userData.name,
        email: userData.email,
        class: userData.class,
        mobile: userData.mobile || "",
        age: userData.age || undefined
      };
      
      addStudent(studentData);
    }
    
    return success;
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    if (!user) return false;
    
    const success = await authService.updateUser(user, id, userData);
    
    // If the current user is being updated, refresh their session
    if (success && user.id === id) {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    }
    
    return success;
  };

  const deleteUser = async (id: string) => {
    if (!user) return false;
    return authService.deleteUser(user, id);
  };

  const resetApplication = () => {
    try {
      setUser(null);
      authService.logout();
      initializeFreshApplication();
      window.location.href = "/login";
    } catch (error) {
      console.error("Reset application error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      getUsers,
      addUser,
      updateUser,
      deleteUser,
      resetApplication
    }}>
      {children}
    </AuthContext.Provider>
  );
};
