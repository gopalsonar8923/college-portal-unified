
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ScheduleLecturesPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Schedule Lectures</h1>
        <Card>
          <CardHeader>
            <CardTitle>Lecture Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow administrators to schedule lectures for different classes.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleLecturesPage;
