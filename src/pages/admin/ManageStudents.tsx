
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManageStudentsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow administrators to manage student accounts.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageStudentsPage;
