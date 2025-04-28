
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarkAttendancePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow teachers to mark attendance for their assigned classes.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendancePage;
