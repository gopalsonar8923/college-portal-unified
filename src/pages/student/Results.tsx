
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResultsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Results</h1>
        <Card>
          <CardHeader>
            <CardTitle>Exam Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow students to view and download their exam results.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;
