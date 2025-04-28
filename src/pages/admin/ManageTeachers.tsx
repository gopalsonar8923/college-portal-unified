
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManageTeachersPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Teachers</h1>
        <Card>
          <CardHeader>
            <CardTitle>Teacher Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow administrators to manage teacher accounts.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageTeachersPage;
