
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getResultsByClass, downloadFile } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Result } from "@/types";

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Loading results for user:", user);
    if (user && (user as any).class) {
      const studentClass = (user as any).class;
      console.log("Student class:", studentClass);
      const classResults = getResultsByClass(studentClass);
      console.log("Found results:", classResults);
      setResults(classResults);
      setLoading(false);
    } else {
      console.log("No user or class found");
      setLoading(false);
    }
  }, [user]);

  const handleDownload = (result: Result) => {
    try {
      console.log("Student downloading result:", result.title);
      downloadFile(result.fileUrl, `${result.title}.pdf`);
    } catch (error) {
      console.error("Failed to download result:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Results</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Exam Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading your results...</p>
            ) : results.length === 0 ? (
              <p>No results available for your class yet.</p>
            ) : (
              <div className="divide-y">
                {results.map((result) => (
                  <div key={result.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {result.semester} | Published: {new Date(result.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleDownload(result)}>
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;
