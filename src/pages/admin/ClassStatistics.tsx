
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLASS_OPTIONS } from "@/lib/constants";
import { getStudents } from "@/lib/storage";
import { Student } from "@/types";
import { Users } from "lucide-react";

const ClassStatisticsPage = () => {
  const [classStats, setClassStats] = useState<Record<string, number>>({});
  const [totalStudents, setTotalStudents] = useState(0);
  
  useEffect(() => {
    loadClassStatistics();
  }, []);
  
  const loadClassStatistics = () => {
    const allStudents = getStudents();
    setTotalStudents(allStudents.length);
    
    // Count students by class
    const stats: Record<string, number> = {};
    CLASS_OPTIONS.forEach(classOption => {
      stats[classOption.value] = 0;
    });
    
    allStudents.forEach(student => {
      if (stats.hasOwnProperty(student.class)) {
        stats[student.class]++;
      }
    });
    
    setClassStats(stats);
  };

  const getClassLabel = (classValue: string) => {
    return CLASS_OPTIONS.find(option => option.value === classValue)?.label || classValue;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Class Statistics</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Students: {totalStudents}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLASS_OPTIONS.map((classOption) => (
            <Card key={classOption.value}>
              <CardHeader>
                <CardTitle className="text-lg">{classOption.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {classStats[classOption.value] || 0}
                </div>
                <p className="text-muted-foreground text-sm">
                  {classStats[classOption.value] === 1 ? 'student' : 'students'} enrolled
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {totalStudents === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No students have been registered yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassStatisticsPage;
