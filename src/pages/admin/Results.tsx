
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResultsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Results Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will allow administrators to upload and manage student results.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;
