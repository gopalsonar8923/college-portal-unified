
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/common/Calendar";
import { EventForm } from "@/components/common/EventForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getEvents, addEvent, updateEvent, deleteEvent, getEventsByClass } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE, CLASS_OPTIONS } from "@/lib/constants";
import { ScheduledEvent } from "@/types";
import { toast } from "sonner";

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  
  // Fetch events based on user role and selected class
  useEffect(() => {
    let fetchedEvents: ScheduledEvent[] = [];
    
    if (user?.role === ROLE.ADMIN) {
      if (selectedClass) {
        fetchedEvents = getEventsByClass(selectedClass);
      } else {
        fetchedEvents = getEvents();
      }
    } else if (user?.role === ROLE.TEACHER) {
      if (selectedClass) {
        fetchedEvents = getEventsByClass(selectedClass);
      } else {
        // Get events for all teacher's classes
        const teacherClasses = user.classes || [];
        fetchedEvents = getEvents().filter(event => 
          !event.class || teacherClasses.includes(event.class)
        );
      }
    } else if (user?.role === ROLE.STUDENT) {
      const studentClass = (user as any).class;
      if (studentClass) {
        fetchedEvents = getEventsByClass(studentClass);
      }
    }
    
    setEvents(fetchedEvents);
  }, [user, selectedClass]);
  
  const handleEventCreate = (eventData: Omit<ScheduledEvent, "id">) => {
    try {
      const newEvent = addEvent(eventData);
      setEvents([...events, newEvent]);
      setFormOpen(false);
      toast.success("Event created successfully");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };
  
  const handleEventUpdate = (eventData: Omit<ScheduledEvent, "id">) => {
    if (!selectedEvent) return;
    
    try {
      const updatedEvent = updateEvent(selectedEvent.id, eventData);
      if (updatedEvent) {
        setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
        setSelectedEvent(null);
        setFormOpen(false);
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };
  
  const handleEventDelete = () => {
    if (!selectedEvent) return;
    
    try {
      const success = deleteEvent(selectedEvent.id);
      if (success) {
        setEvents(events.filter(e => e.id !== selectedEvent.id));
        setSelectedEvent(null);
        setDeleteDialogOpen(false);
        toast.success("Event deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };
  
  const handleEventClick = (event: ScheduledEvent) => {
    setSelectedEvent(event);
    
    // Admin and teachers can edit events, students can only view
    if (user?.role === ROLE.STUDENT) {
      setViewDialogOpen(true);
    } else {
      setFormOpen(true);
    }
  };
  
  const canCreateEvents = user?.role === ROLE.ADMIN || user?.role === ROLE.TEACHER;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Academic Calendar</h1>
            <p className="text-muted-foreground">
              View and manage academic events
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {(user?.role === ROLE.ADMIN || user?.role === ROLE.TEACHER) && (
              <div className="flex items-center gap-2">
                <Label htmlFor="class-select">Filter by Class:</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class-select" className="w-[180px]">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-classes">All Classes</SelectItem>
                    {CLASS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {canCreateEvents && (
              <Button onClick={() => {
                setSelectedEvent(null);
                setFormOpen(true);
              }}>
                Add Event
              </Button>
            )}
          </div>
        </div>
        
        <CalendarComponent 
          events={events} 
          onEventClick={handleEventClick}
        />
      </div>
      
      {/* Event form dialog */}
      {canCreateEvents && (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? "Edit Event" : "Create Event"}
              </DialogTitle>
            </DialogHeader>
            <EventForm
              event={selectedEvent || undefined}
              onSubmit={selectedEvent ? handleEventUpdate : handleEventCreate}
              onCancel={() => setFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Event view dialog for students */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Event Type</h4>
                <p>{selectedEvent.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                <p>
                  {new Date(selectedEvent.start).toLocaleString()} to {new Date(selectedEvent.end).toLocaleString()}
                </p>
              </div>
              {selectedEvent.class && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Class</h4>
                  <p>{CLASS_OPTIONS.find(c => c.value === selectedEvent.class)?.label || selectedEvent.class}</p>
                </div>
              )}
              {selectedEvent.subject && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Subject</h4>
                  <p>{selectedEvent.subject}</p>
                </div>
              )}
              {selectedEvent.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                  <p>{selectedEvent.description}</p>
                </div>
              )}
              <Button variant="outline" className="w-full" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEventDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
