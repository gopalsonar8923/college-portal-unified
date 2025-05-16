
import { ROLE, CLASS_OPTIONS, EVENT_TYPES } from "@/lib/constants";

export type Role = typeof ROLE[keyof typeof ROLE];

export type ClassType = typeof CLASS_OPTIONS[number]["value"];

export type EventType = typeof EVENT_TYPES[number]["value"];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  classes?: ClassType[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  age?: number;
  mobile?: string;
  class: ClassType;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  classes: ClassType[];
}

export interface Attendance {
  id: string;
  date: string;
  studentId: string;
  subject: string;
  present: boolean;
  class: ClassType;
  lectureId?: string;  // Added lectureId as an optional property
}

export interface Result {
  id: string;
  title: string;
  fileUrl: string;
  class: ClassType;
  uploadDate: string;
  semester: string;
}

export interface HallTicket {
  id: string;
  title: string;
  fileUrl: string;
  class: ClassType;
  uploadDate: string;
  examDate: string;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: EventType;
  class?: ClassType;
  subject?: string;
  description?: string;
}

export interface CalendarDay {
  date: Date;
  events: ScheduledEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface StudentsImportRow {
  Name: string;
  Age: string;
  MobileNumber: string;
  Class: string;
}
