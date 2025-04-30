
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
import { ExcelImporter } from "@/components/common/ExcelImporter";
import { CLASS_OPTIONS } from "@/lib/constants";
import { getStudents, addStudent, updateStudent, deleteStudent, importStudentsFromExcel } from "@/lib/storage";
import { toast } from "sonner";
import { Student } from "@/types";

const ManageStudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
    mobile: "",
    class: "",
  });
  
  useEffect(() => {
    loadStudents();
  }, []);
  
  const loadStudents = () => {
    const allStudents = getStudents();
    setStudents(allStudents);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleClassChange = (value: string) => {
    setFormData({
      ...formData,
      class: value
    });
  };
  
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      age: "",
      mobile: "",
      class: "",
    });
  };
  
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newStudent = addStudent({
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : undefined,
        mobile: formData.mobile,
        class: formData.class as any,
      });
      
      toast.success(`Student ${newStudent.name} added successfully`);
      setIsAddDialogOpen(false);
      resetForm();
      loadStudents();
    } catch (error) {
      console.error("Failed to add student:", error);
      toast.error("Failed to add student");
    }
  };
  
  const handleEditStudent = (student: Student) => {
    setFormData({
      id: student.id,
      name: student.name,
      email: student.email,
      age: student.age?.toString() || "",
      mobile: student.mobile || "",
      class: student.class,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedStudent = updateStudent(formData.id, {
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : undefined,
        mobile: formData.mobile,
        class: formData.class as any,
      });
      
      if (updatedStudent) {
        toast.success(`Student ${updatedStudent.name} updated successfully`);
        setIsEditDialogOpen(false);
        resetForm();
        loadStudents();
      } else {
        toast.error("Student not found");
      }
    } catch (error) {
      console.error("Failed to update student:", error);
      toast.error("Failed to update student");
    }
  };
  
  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const deleted = deleteStudent(id);
        
        if (deleted) {
          toast.success(`Student ${name} deleted successfully`);
          loadStudents();
        } else {
          toast.error("Student not found");
        }
      } catch (error) {
        console.error("Failed to delete student:", error);
        toast.error("Failed to delete student");
      }
    }
  };
  
  const handleImportData = async (data: any[]) => {
    try {
      const addedStudents = await importStudentsFromExcel({ target: { files: [new File([], 'import.xlsx')] } } as any);
      toast.success(`Successfully imported ${addedStudents.length} students`);
      setIsImportDialogOpen(false);
      loadStudents();
    } catch (error) {
      console.error("Failed to import students:", error);
      toast.error("Failed to import students");
    }
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Students</h1>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Student
            </Button>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              Import Students
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No students added yet</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {CLASS_OPTIONS.find(option => option.value === student.class)?.label || student.class}
                        </TableCell>
                        <TableCell>{student.mobile || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id, student.name)}
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
        
        {/* Add Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4">
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
                <label htmlFor="class" className="block text-sm font-medium mb-1">
                  Class *
                </label>
                <Select value={formData.class} onValueChange={handleClassChange}>
                  <SelectTrigger id="class">
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium mb-1">
                    Age
                  </label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="18"
                    min="0"
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
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Student Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateStudent} className="space-y-4">
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
                <label htmlFor="edit-class" className="block text-sm font-medium mb-1">
                  Class *
                </label>
                <Select value={formData.class} onValueChange={handleClassChange}>
                  <SelectTrigger id="edit-class">
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-age" className="block text-sm font-medium mb-1">
                    Age
                  </label>
                  <Input
                    id="edit-age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="18"
                    min="0"
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
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Import Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Students</DialogTitle>
            </DialogHeader>
            <ExcelImporter 
              onDataImported={handleImportData}
              validateRow={(row) => {
                if (!row.Name || !row.Class) {
                  return { valid: false, errors: ["Name and Class are required"] };
                }
                return { valid: true };
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManageStudentsPage;
