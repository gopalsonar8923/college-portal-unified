
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDay, ScheduledEvent, EventType } from "@/types";
import { getCalendarDays, isSameDay } from "@/lib/calendar-utils";
import { MONTHS, WEEKDAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CalendarProps {
  events: ScheduledEvent[];
  onDayClick?: (date: Date, events: ScheduledEvent[]) => void;
  onEventClick?: (event: ScheduledEvent) => void;
}

export function Calendar({ events, onDayClick, onEventClick }: CalendarProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const calendarDays = getCalendarDays(currentYear, currentMonth, events);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (onDayClick) {
      onDayClick(day.date, day.events);
    }
  };

  const getEventColor = (type: EventType) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "exam":
        return "bg-red-100 text-red-800 border-red-300";
      case "holiday":
        return "bg-green-100 text-green-800 border-green-300";
      case "event":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  return (
    <Card>
      <CardHeader className="px-6 pb-0">
        <div className="flex items-center justify-between mb-2">
          <CardTitle>{MONTHS[currentMonth]} {currentYear}</CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-sm font-medium py-1">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, i) => (
            <div
              key={`day-${i}`}
              className={cn(
                "min-h-[80px] p-1 border",
                day.isCurrentMonth ? "bg-card" : "bg-muted/30",
                day.isToday && "border-college-orange",
                selectedDate && isSameDay(day.date, selectedDate) && "bg-accent/50",
                "transition-colors cursor-pointer hover:bg-muted"
              )}
              onClick={() => handleDayClick(day)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium inline-flex items-center justify-center w-6 h-6 rounded-full",
                    day.isToday && "bg-college-orange text-white"
                  )}
                >
                  {day.date.getDate()}
                </span>
                {day.events.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {day.events.length}
                  </Badge>
                )}
              </div>
              
              {/* Events for this day */}
              <div className="mt-1 space-y-1 max-h-[60px] overflow-y-auto">
                {day.events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs p-1 rounded border truncate",
                      getEventColor(event.type)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEventClick) onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{day.events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
