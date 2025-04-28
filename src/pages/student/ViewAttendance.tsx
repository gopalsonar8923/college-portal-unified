
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ViewAttendancePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Record</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow students to view their attendance records.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ViewAttendancePage;
