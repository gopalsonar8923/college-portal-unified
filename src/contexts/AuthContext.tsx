
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Role, User } from "@/types";
import { ROLE } from "@/lib/constants";

// Mock storage functionality until integrated with a backend
const USER_STORAGE_KEY = "college_portal_user";
const USERS_STORAGE_KEY = "college_portal_users";

// Default users for testing
const defaultUsers = [
  { 
    id: "admin1", 
    name: "Admin User", 
    email: "admin@spdm.edu", 
    password: "admin123", 
    role: ROLE.ADMIN 
  },
  { 
    id: "teacher1", 
    name: "John Teacher", 
    email: "teacher@spdm.edu", 
    password: "teacher123", 
    role: ROLE.TEACHER,
    classes: ["fy-bsc", "sy-bsc"] 
  },
  { 
    id: "student1", 
    name: "Alice Student", 
    email: "student@spdm.edu", 
    password: "student123", 
    role: ROLE.STUDENT,
    class: "fy-bsc"
  }
];

// Initialize users in local storage if not present
if (!localStorage.getItem(USERS_STORAGE_KEY)) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  getUsers: (role?: Role) => any[];
  addUser: (user: any) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const getUsers = (role?: Role) => {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    if (role) {
      return users.filter((u: any) => u.role === role);
    }
    return users;
  };

  const login = async (email: string, password: string, role: Role) => {
    try {
      const users = getUsers();
      const found = users.find(
        (u: any) => u.email === email && u.password === password && u.role === role
      );

      if (found) {
        const userData = { ...found };
        delete userData.password;
        
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        toast.error("Invalid credentials. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: Role) => {
    try {
      const users = getUsers();
      
      // Check if user with this email already exists
      if (users.some((u: any) => u.email === email)) {
        toast.error("User with this email already exists.");
        return false;
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        role,
        classes: role === ROLE.TEACHER ? [] : undefined,
        class: role === ROLE.STUDENT ? "" : undefined
      };

      // Add new user to storage
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
      
      toast.success("Registration successful. Please login.");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during registration.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    navigate("/login");
    toast.info("You have been logged out.");
  };

  const addUser = async (userData: any) => {
    try {
      const users = getUsers();
      
      // Check if user with this email already exists
      if (users.some((u: any) => u.email === userData.email)) {
        toast.error("User with this email already exists.");
        return false;
      }

      const newUser = {
        id: `user_${Date.now()}`,
        ...userData
      };

      // Add new user to storage
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
      
      toast.success(`New ${userData.role} added successfully.`);
      return true;
    } catch (error) {
      console.error("Add user error:", error);
      toast.error("An error occurred while adding the user.");
      return false;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const users = getUsers();
      const updatedUsers = users.map((u: any) => 
        u.id === id ? { ...u, ...userData } : u
      );

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // If the current user is being updated, update the stored user as well
      if (user && user.id === id) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      toast.success("User updated successfully.");
      return true;
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("An error occurred while updating the user.");
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const users = getUsers();
      const updatedUsers = users.filter((u: any) => u.id !== id);

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      toast.success("User deleted successfully.");
      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("An error occurred while deleting the user.");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      getUsers,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
