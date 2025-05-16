
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addEvent } from "@/lib/storage";
import { toast } from "sonner";
import { EventForm } from "@/components/common/EventForm";
import { ScheduledEvent } from "@/types";

const ScheduleLecturesPage = () => {
  const handleSubmit = (eventData: Omit<ScheduledEvent, "id">) => {
    try {
      addEvent(eventData);
      toast.success("Lecture scheduled successfully");
    } catch (error) {
      console.error("Error scheduling lecture:", error);
      toast.error("Failed to schedule lecture");
    }
  };
  
  const handleCancel = () => {
    toast.info("Form reset");
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Schedule Lectures</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Lecture</CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm 
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About Lecture Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Use this page to schedule lectures for different classes. Once scheduled, 
                  teachers assigned to the selected class can view the lectures and mark 
                  attendance for their students.
                </p>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Important Notes:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Make sure to select the correct class for the lecture</li>
                    <li>Choose appropriate start and end times</li>
                    <li>Ensure lectures don't overlap for the same class</li>
                    <li>Teachers will be notified about newly scheduled lectures</li>
                  </ul>
                </div>
                
                <div className="rounded-lg bg-primary/5 p-4">
                  <h4 className="font-medium">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    For any issues related to lecture scheduling, please contact the 
                    IT department or refer to the administrator manual.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleLecturesPage;
