
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getHallTicketsByClass, downloadFile } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { HallTicket } from "@/types";

const HallTicketsPage = () => {
  const [hallTickets, setHallTickets] = useState<HallTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Loading hall tickets for user:", user);
    if (user && (user as any).class) {
      const studentClass = (user as any).class;
      console.log("Student class:", studentClass);
      const classHallTickets = getHallTicketsByClass(studentClass);
      console.log("Found hall tickets:", classHallTickets);
      setHallTickets(classHallTickets);
      setLoading(false);
    } else {
      console.log("No user or class found");
      setLoading(false);
    }
  }, [user]);

  const handleDownload = (ticket: HallTicket) => {
    try {
      console.log("Student downloading hall ticket:", ticket.title);
      downloadFile(ticket.fileUrl, `${ticket.title}.pdf`);
    } catch (error) {
      console.error("Failed to download hall ticket:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Hall Tickets</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Exam Hall Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading your hall tickets...</p>
            ) : hallTickets.length === 0 ? (
              <p>No hall tickets available for your class yet.</p>
            ) : (
              <div className="divide-y">
                {hallTickets.map((ticket) => (
                  <div key={ticket.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Exam Date: {new Date(ticket.examDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleDownload(ticket)}>
                        Download Hall Ticket
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

export default HallTicketsPage;
