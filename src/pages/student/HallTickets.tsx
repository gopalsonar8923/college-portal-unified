
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getHallTicketsByClass, downloadFile } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { HallTicket } from "@/types";
import { toast } from "sonner";

const HallTicketsPage = () => {
  const [hallTickets, setHallTickets] = useState<HallTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && (user as any).class) {
      const studentClass = (user as any).class;
      try {
        const classHallTickets = getHallTicketsByClass(studentClass);
        setHallTickets(classHallTickets);
      } catch (error) {
        console.error("Failed to load hall tickets:", error);
        toast.error("Failed to load hall tickets");
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDownload = (ticket: HallTicket) => {
    try {
      downloadFile(ticket.fileUrl, `${ticket.title}.pdf`);
      toast.success("Download started");
    } catch (error) {
      console.error("Failed to download hall ticket:", error);
      toast.error("Failed to download hall ticket");
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
