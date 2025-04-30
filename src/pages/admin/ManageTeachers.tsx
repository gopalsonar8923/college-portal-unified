
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CLASS_OPTIONS, ROLE } from "@/lib/constants";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const ManageTeachersPage = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [currentClass, setCurrentClass] = useState<string>("");
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  
  useEffect(() => {
    loadTeachers();
  }, []);
  
  const loadTeachers = () => {
    // Load teachers from localStorage
    const users = JSON.parse(localStorage.getItem("college_portal_users") || "[]");
    const teacherUsers = users.filter((user: any) => user.role === ROLE.TEACHER);
    setTeachers(teacherUsers);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddClass = () => {
    if (currentClass && !selectedClasses.includes(currentClass)) {
      setSelectedClasses([...selectedClasses, currentClass]);
      setCurrentClass("");
    }
  };
  
  const handleRemoveClass = (classToRemove: string) => {
    setSelectedClasses(selectedClasses.filter(c => c !== classToRemove));
  };
  
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      password: "",
      mobile: "",
    });
    setSelectedClasses([]);
    setCurrentClass("");
  };
  
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedClasses.length === 0) {
      toast.error("Please assign at least one class");
      return;
    }
    
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem("college_portal_users") || "[]");
      
      // Check if email already exists
      const emailExists = users.some((user: any) => user.email === formData.email);
      if (emailExists) {
        toast.error("Email already in use");
        return;
      }
      
      // Create new teacher
      const newTeacher = {
        id: uuidv4(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile || "",
        role: ROLE.TEACHER,
        classes: selectedClasses,
      };
      
      // Add to users array
      users.push(newTeacher);
      localStorage.setItem("college_portal_users", JSON.stringify(users));
      
      toast.success(`Teacher ${newTeacher.name} added successfully`);
      setIsAddDialogOpen(false);
      resetForm();
      loadTeachers();
    } catch (error) {
      console.error("Failed to add teacher:", error);
      toast.error("Failed to add teacher");
    }
  };
  
  const handleEditTeacher = (teacher: any) => {
    setFormData({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      password: "",
      mobile: teacher.mobile || "",
    });
    setSelectedClasses(teacher.classes || []);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedClasses.length === 0) {
      toast.error("Please assign at least one class");
      return;
    }
    
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem("college_portal_users") || "[]");
      
      // Find the teacher to update
      const teacherIndex = users.findIndex((user: any) => user.id === formData.id);
      if (teacherIndex === -1) {
        toast.error("Teacher not found");
        return;
      }
      
      // Check if email already exists with another user
      const emailExists = users.some((user: any) => user.email === formData.email && user.id !== formData.id);
      if (emailExists) {
        toast.error("Email already in use");
        return;
      }
      
      // Update teacher
      const updatedTeacher = {
        ...users[teacherIndex],
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile || "",
        classes: selectedClasses,
      };
      
      // Update password only if a new one is provided
      if (formData.password) {
        updatedTeacher.password = formData.password;
      }
      
      // Update in users array
      users[teacherIndex] = updatedTeacher;
      localStorage.setItem("college_portal_users", JSON.stringify(users));
      
      toast.success(`Teacher ${updatedTeacher.name} updated successfully`);
      setIsEditDialogOpen(false);
      resetForm();
      loadTeachers();
    } catch (error) {
      console.error("Failed to update teacher:", error);
      toast.error("Failed to update teacher");
    }
  };
  
  const handleDeleteTeacher = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        // Get existing users
        const users = JSON.parse(localStorage.getItem("college_portal_users") || "[]");
        
        // Filter out the teacher to delete
        const updatedUsers = users.filter((user: any) => user.id !== id);
        
        localStorage.setItem("college_portal_users", JSON.stringify(updatedUsers));
        
        toast.success(`Teacher ${name} deleted successfully`);
        loadTeachers();
      } catch (error) {
        console.error("Failed to delete teacher:", error);
        toast.error("Failed to delete teacher");
      }
    }
  };
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Teachers</h1>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Teacher
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Teacher List</CardTitle>
          </CardHeader>
          <CardContent>
            {teachers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No teachers added yet</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Assigned Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.mobile || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(teacher.classes || []).map((classValue: string) => (
                              <span key={classValue} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                                {CLASS_OPTIONS.find(option => option.value === classValue)?.label || classValue}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTeacher(teacher)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Add Teacher Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password *
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium mb-1">
                  Mobile
                </label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Assigned Classes *
                </label>
                <div className="flex gap-2 mb-2">
                  <Select value={currentClass} onValueChange={setCurrentClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="secondary" onClick={handleAddClass} disabled={!currentClass}>
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClasses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes assigned yet</p>
                  ) : (
                    selectedClasses.map((classValue) => (
                      <div key={classValue} className="bg-secondary flex items-center gap-1 px-3 py-1 rounded-full">
                        <span className="text-sm">
                          {CLASS_OPTIONS.find(option => option.value === classValue)?.label || classValue}
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0" 
                          onClick={() => handleRemoveClass(classValue)}
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Teacher</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Teacher Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateTeacher} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
                  Name *
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-password" className="block text-sm font-medium mb-1">
                  Password (leave blank to keep current)
                </label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label htmlFor="edit-mobile" className="block text-sm font-medium mb-1">
                  Mobile
                </label>
                <Input
                  id="edit-mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Assigned Classes *
                </label>
                <div className="flex gap-2 mb-2">
                  <Select value={currentClass} onValueChange={setCurrentClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="secondary" onClick={handleAddClass} disabled={!currentClass}>
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClasses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes assigned yet</p>
                  ) : (
                    selectedClasses.map((classValue) => (
                      <div key={classValue} className="bg-secondary flex items-center gap-1 px-3 py-1 rounded-full">
                        <span className="text-sm">
                          {CLASS_OPTIONS.find(option => option.value === classValue)?.label || classValue}
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0" 
                          onClick={() => handleRemoveClass(classValue)}
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Teacher</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManageTeachersPage;
