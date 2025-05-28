
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CLASS_OPTIONS } from "@/lib/constants";
import { getStudentsByClass } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Student } from "@/types";

const ViewStudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    loadStudents();
  }, [user]);
  
  const loadStudents = () => {
    if (user && user.classes) {
      // Get students from all classes assigned to this teacher
      const allStudents: Student[] = [];
      user.classes.forEach(classType => {
        const classStudents = getStudentsByClass(classType);
        allStudents.push(...classStudents);
      });
      setStudents(allStudents);
    }
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClassLabel = (classValue: string) => {
    return CLASS_OPTIONS.find(option => option.value === classValue)?.label || classValue;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Students</h1>
        
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
        
        {user?.classes && user.classes.length > 0 ? (
          user.classes.map(classType => {
            const classStudents = students.filter(student => student.class === classType);
            return (
              <Card key={classType}>
                <CardHeader>
                  <CardTitle>{getClassLabel(classType)} ({classStudents.length} students)</CardTitle>
                </CardHeader>
                <CardContent>
                  {classStudents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No students enrolled in this class yet
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Mobile</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classStudents
                            .filter(student => 
                              student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              student.email.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.mobile || "N/A"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                You haven't been assigned to any classes yet. Please contact an administrator.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewStudentsPage;
