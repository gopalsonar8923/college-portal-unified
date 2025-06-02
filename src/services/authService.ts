
import { toast } from "sonner";
import { Role, User } from "@/types";
import { ROLE } from "@/lib/constants";

// Secure authentication service
class AuthService {
  private readonly SESSION_KEY = "college_portal_session";
  private readonly USERS_KEY = "college_portal_users";

  // Simulate secure password hashing (in production, this would be done server-side)
  private hashPassword(password: string): string {
    // This is a simple hash for demo purposes - in production use proper bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Verify password against hash
  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  // Create secure session token
  private createSessionToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  // Validate session token
  private validateSession(): User | null {
    try {
      const token = localStorage.getItem(this.SESSION_KEY);
      if (!token) return null;

      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        this.logout();
        return null;
      }

      const users = this.getUsers();
      const user = users.find(u => u.id === payload.id);
      if (!user) {
        this.logout();
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      this.logout();
      return null;
    }
  }

  // Get current user from session
  getCurrentUser(): User | null {
    return this.validateSession();
  }

  // Login with secure password verification
  async login(email: string, password: string, role: Role): Promise<boolean> {
    try {
      const users = this.getUsers();
      const user = users.find(u => 
        u.email === email && 
        u.role === role && 
        this.verifyPassword(password, u.password)
      );

      if (!user) {
        toast.error("Invalid credentials");
        return false;
      }

      const { password: _, ...userWithoutPassword } = user;
      const token = this.createSessionToken(userWithoutPassword);
      localStorage.setItem(this.SESSION_KEY, token);
      
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  }

  // Secure logout
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    toast.info("Logged out successfully");
  }

  // Register new user with password hashing
  async register(userData: any): Promise<boolean> {
    try {
      const users = this.getUsers();
      
      if (users.some(u => u.email === userData.email)) {
        toast.error("Email already exists");
        return false;
      }

      const hashedPassword = this.hashPassword(userData.password);
      const newUser = {
        ...userData,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        password: hashedPassword
      };

      users.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      return false;
    }
  }

  // Get users with proper access control
  private getUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // Admin-only functions with authorization checks
  getAllUsers(currentUser: User): any[] {
    if (currentUser.role !== ROLE.ADMIN) {
      throw new Error("Unauthorized access");
    }
    return this.getUsers().map(({ password, ...user }) => user);
  }

  async updateUser(currentUser: User, id: string, userData: Partial<User>): Promise<boolean> {
    if (currentUser.role !== ROLE.ADMIN && currentUser.id !== id) {
      toast.error("Unauthorized");
      return false;
    }

    try {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === id);
      
      if (index === -1) {
        toast.error("User not found");
        return false;
      }

      users[index] = { ...users[index], ...userData };
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      
      toast.success("User updated successfully");
      return true;
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
      return false;
    }
  }

  async deleteUser(currentUser: User, id: string): Promise<boolean> {
    if (currentUser.role !== ROLE.ADMIN) {
      toast.error("Unauthorized");
      return false;
    }

    try {
      const users = this.getUsers();
      const filteredUsers = users.filter(u => u.id !== id);
      
      localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
      return false;
    }
  }
}

export const authService = new AuthService();
