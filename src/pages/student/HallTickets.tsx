
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HallTicketsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Hall Tickets</h1>
        <Card>
          <CardHeader>
            <CardTitle>Exam Hall Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow students to view and download their exam hall tickets.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HallTicketsPage;
