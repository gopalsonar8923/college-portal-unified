
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AttendanceReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Attendance Reports</h1>
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow administrators to view and export attendance reports.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceReportsPage;
