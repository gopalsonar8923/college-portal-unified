
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE } from "@/lib/constants";
import { getRoleLabel } from "@/lib/utils";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const handlePasswordChange = async (data: z.infer<typeof passwordFormSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // This is a simplified password change flow since we don't have a real backend
      // In a real application, you would verify the current password on the server
      const users = JSON.parse(localStorage.getItem("college_portal_users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        toast.error("User not found");
        return;
      }
      
      if (users[userIndex].password !== data.currentPassword) {
        toast.error("Current password is incorrect");
        form.setError("currentPassword", { 
          type: "manual",
          message: "Current password is incorrect"
        });
        return;
      }
      
      // Update password
      users[userIndex].password = data.newPassword;
      localStorage.setItem("college_portal_users", JSON.stringify(users));
      
      toast.success("Password updated successfully");
      form.reset();
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("An error occurred while changing the password");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <div className="mt-1">
                    {isEditing ? (
                      <Input 
                        value={user.name}
                        onChange={(e) => {
                          updateUser(user.id, { name: e.target.value });
                        }}
                      />
                    ) : (
                      <p className="text-foreground">{user.name}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <p className="mt-1 text-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <p className="mt-1 text-foreground">{getRoleLabel(user.role)}</p>
                </div>
                {user.role === ROLE.TEACHER && user.classes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Assigned Classes
                    </label>
                    <p className="mt-1 text-foreground">
                      {user.classes.length > 0 
                        ? user.classes.join(", ") 
                        : "No classes assigned"}
                    </p>
                  </div>
                )}
                {user.role === ROLE.STUDENT && (user as any).class && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Class
                    </label>
                    <p className="mt-1 text-foreground">{(user as any).class}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(false)}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
