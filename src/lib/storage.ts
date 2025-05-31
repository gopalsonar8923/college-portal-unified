import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { 
  Attendance, 
  Student, 
  Result, 
  HallTicket, 
  ScheduledEvent,
  StudentsImportRow
} from "@/types";
import * as XLSX from "xlsx";

// Storage keys
const STORAGE_KEYS = {
  STUDENTS: "college_portal_students",
  ATTENDANCE: "college_portal_attendance",
  RESULTS: "college_portal_results",
  HALL_TICKETS: "college_portal_hall_tickets",
  EVENTS: "college_portal_events",
  FILES: "college_portal_files"
};

// Clear all data and initialize fresh
export function initializeFreshApplication() {
  console.log("Initializing fresh application...");
  
  // Clear all existing data
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear user data
  localStorage.removeItem("college_portal_user");
  localStorage.removeItem("college_portal_users");
  
  // Initialize with empty arrays
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.setItem(key, JSON.stringify(key === STORAGE_KEYS.FILES ? {} : []));
  });
  
  // Initialize users array
  localStorage.setItem("college_portal_users", JSON.stringify([]));
  
  console.log("Fresh application initialized successfully!");
  toast.success("Application reset to fresh state!");
}

// Initialize localStorage with empty arrays if not present
Object.values(STORAGE_KEYS).forEach(key => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(key === STORAGE_KEYS.FILES ? {} : []));
  }
});

// Generic get function
function getItems<T>(key: string): T[] {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

// Generic set function
function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// Students
export function getStudents(): Student[] {
  const students = getItems<Student>(STORAGE_KEYS.STUDENTS);
  console.log("Storage: Retrieved students:", students);
  return students;
}

export function getStudentById(id: string): Student | undefined {
  return getStudents().find(student => student.id === id);
}

export function getStudentsByClass(classType: string): Student[] {
  const students = getStudents().filter(student => student.class === classType);
  console.log(`Storage: Retrieved students for class ${classType}:`, students);
  return students;
}

export function addStudent(student: Omit<Student, "id">): Student {
  console.log("Storage: Adding student:", student);
  
  const students = getStudents();
  const newStudent: Student = {
    id: uuidv4(),
    ...student
  };
  
  const updatedStudents = [...students, newStudent];
  setItems(STORAGE_KEYS.STUDENTS, updatedStudents);
  
  console.log("Storage: Student added successfully:", newStudent);
  console.log("Storage: Total students now:", updatedStudents.length);
  
  return newStudent;
}

export function updateStudent(id: string, data: Partial<Student>): Student | null {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  const updatedStudent = { ...students[index], ...data };
  students[index] = updatedStudent;
  setItems(STORAGE_KEYS.STUDENTS, students);
  
  return updatedStudent;
}

export function deleteStudent(id: string): boolean {
  const students = getStudents();
  const filteredStudents = students.filter(s => s.id !== id);
  
  if (filteredStudents.length === students.length) return false;
  
  setItems(STORAGE_KEYS.STUDENTS, filteredStudents);
  return true;
}

export function importStudentsFromExcel(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<StudentsImportRow>(worksheet);
        
        if (jsonData.length === 0) {
          reject(new Error("No data found in the Excel file"));
          return;
        }
        
        const existingStudents = getStudents();
        const addedStudents: Student[] = [];
        
        // Process each row
        jsonData.forEach((row) => {
          if (!row.Name || !row.Class) return;
          
          const newStudent: Omit<Student, "id"> = {
            name: row.Name,
            email: `${row.Name.toLowerCase().replace(/\s+/g, '.')}@student.spdm.edu`,
            age: parseInt(row.Age || "0"),
            mobile: row.MobileNumber || "",
            class: row.Class.toLowerCase().replace(/\s+/g, '-') as any
          };
          
          addedStudents.push(addStudent(newStudent));
        });
        
        resolve(addedStudents);
      } catch (error) {
        console.error("Error processing Excel file:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

// Attendance
export function getAttendance(): Attendance[] {
  return getItems<Attendance>(STORAGE_KEYS.ATTENDANCE);
}

export function getAttendanceByClass(classType: string): Attendance[] {
  return getAttendance().filter(a => a.class === classType);
}

export function getAttendanceByStudent(studentId: string): Attendance[] {
  const attendance = getAttendance().filter(a => a.studentId === studentId);
  console.log(`Storage: Retrieved attendance for student ${studentId}:`, attendance);
  return attendance;
}

export function addAttendance(attendance: Omit<Attendance, "id">): Attendance {
  const records = getAttendance();
  const newAttendance: Attendance = {
    id: uuidv4(),
    ...attendance
  };
  
  console.log("Storage: Adding attendance record:", newAttendance);
  setItems(STORAGE_KEYS.ATTENDANCE, [...records, newAttendance]);
  return newAttendance;
}

export function updateAttendance(id: string, data: Partial<Attendance>): Attendance | null {
  const records = getAttendance();
  const index = records.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  const updatedAttendance = { ...records[index], ...data };
  records[index] = updatedAttendance;
  setItems(STORAGE_KEYS.ATTENDANCE, records);
  
  return updatedAttendance;
}

export function deleteAttendance(id: string): boolean {
  const records = getAttendance();
  const filteredRecords = records.filter(a => a.id !== id);
  
  if (filteredRecords.length === records.length) return false;
  
  setItems(STORAGE_KEYS.ATTENDANCE, filteredRecords);
  return true;
}

export function exportAttendanceToExcel(attendanceData: Attendance[], fileName: string = "attendance_report.xlsx") {
  // Process attendance data for export
  const students = getStudents();
  const exportData = attendanceData.map(record => {
    const student = students.find(s => s.id === record.studentId);
    return {
      "Student Name": student?.name || "Unknown",
      "Class": record.class,
      "Subject": record.subject,
      "Date": record.date,
      "Present": record.present ? "Yes" : "No"
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  
  // Generate file and trigger download
  XLSX.writeFile(workbook, fileName);
  toast.success("Attendance report exported successfully");
}

// Results
export function getResults(): Result[] {
  return getItems<Result>(STORAGE_KEYS.RESULTS);
}

export function getResultsByClass(classType: string): Result[] {
  return getResults().filter(r => r.class === classType);
}

export function addResult(result: Omit<Result, "id">): Result {
  const results = getResults();
  const newResult: Result = {
    id: uuidv4(),
    ...result
  };
  
  console.log("Storage: Adding result:", newResult);
  setItems(STORAGE_KEYS.RESULTS, [...results, newResult]);
  return newResult;
}

export function updateResult(id: string, data: Partial<Result>): Result | null {
  const results = getResults();
  const index = results.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  const updatedResult = { ...results[index], ...data };
  results[index] = updatedResult;
  setItems(STORAGE_KEYS.RESULTS, results);
  
  return updatedResult;
}

export function deleteResult(id: string): boolean {
  console.log("Storage: Deleting result with id:", id);
  const results = getResults();
  const filteredResults = results.filter(r => r.id !== id);
  
  if (filteredResults.length === results.length) {
    console.log("Storage: Result not found for deletion");
    return false;
  }
  
  setItems(STORAGE_KEYS.RESULTS, filteredResults);
  console.log("Storage: Result deleted successfully");
  return true;
}

// Hall Tickets
export function getHallTickets(): HallTicket[] {
  return getItems<HallTicket>(STORAGE_KEYS.HALL_TICKETS);
}

export function getHallTicketsByClass(classType: string): HallTicket[] {
  return getHallTickets().filter(h => h.class === classType);
}

export function addHallTicket(ticket: Omit<HallTicket, "id">): HallTicket {
  const tickets = getHallTickets();
  const newTicket: HallTicket = {
    id: uuidv4(),
    ...ticket
  };
  
  console.log("Storage: Adding hall ticket:", newTicket);
  setItems(STORAGE_KEYS.HALL_TICKETS, [...tickets, newTicket]);
  return newTicket;
}

export function updateHallTicket(id: string, data: Partial<HallTicket>): HallTicket | null {
  const tickets = getHallTickets();
  const index = tickets.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updatedTicket = { ...tickets[index], ...data };
  tickets[index] = updatedTicket;
  setItems(STORAGE_KEYS.HALL_TICKETS, tickets);
  
  return updatedTicket;
}

export function deleteHallTicket(id: string): boolean {
  console.log("Storage: Deleting hall ticket with id:", id);
  const tickets = getHallTickets();
  const filteredTickets = tickets.filter(t => t.id !== id);
  
  if (filteredTickets.length === tickets.length) {
    console.log("Storage: Hall ticket not found for deletion");
    return false;
  }
  
  setItems(STORAGE_KEYS.HALL_TICKETS, filteredTickets);
  console.log("Storage: Hall ticket deleted successfully");
  return true;
}

// Events and Calendar
export function getEvents(): ScheduledEvent[] {
  return getItems<ScheduledEvent>(STORAGE_KEYS.EVENTS);
}

export function getEventsByClass(classType: string): ScheduledEvent[] {
  return getEvents().filter(e => !e.class || e.class === classType);
}

export function addEvent(event: Omit<ScheduledEvent, "id">): ScheduledEvent {
  const events = getEvents();
  const newEvent: ScheduledEvent = {
    id: uuidv4(),
    ...event
  };
  
  setItems(STORAGE_KEYS.EVENTS, [...events, newEvent]);
  return newEvent;
}

export function updateEvent(id: string, data: Partial<ScheduledEvent>): ScheduledEvent | null {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) return null;
  
  const updatedEvent = { ...events[index], ...data };
  events[index] = updatedEvent;
  setItems(STORAGE_KEYS.EVENTS, events);
  
  return updatedEvent;
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const filteredEvents = events.filter(e => e.id !== id);
  
  if (filteredEvents.length === events.length) return false;
  
  setItems(STORAGE_KEYS.EVENTS, filteredEvents);
  return true;
}

// File handling - improved implementation
export function uploadFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log("Uploading file:", file.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileId = uuidv4();
          const fileStorage = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || "{}");
          
          // Store file as base64 data URL for persistence
          fileStorage[fileId] = {
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result, // This is a data URL
            uploadDate: new Date().toISOString()
          };
          
          localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(fileStorage));
          console.log("File uploaded successfully with ID:", fileId);
          
          resolve(`file://${fileId}`);
        } catch (error) {
          console.error("Error storing file:", error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        reject(reader.error);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      reject(error);
    }
  });
}

export function getFileUrl(fileUrl: string): string | null {
  if (!fileUrl || !fileUrl.startsWith("file://")) {
    return fileUrl;
  }
  
  try {
    const fileId = fileUrl.replace("file://", "");
    const fileStorage = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || "{}");
    const fileData = fileStorage[fileId];
    
    if (!fileData || !fileData.data) {
      console.error("File not found or has no data:", fileId);
      return null;
    }
    
    return fileData.data; // Return the data URL
  } catch (error) {
    console.error("Error getting file URL:", error);
    return null;
  }
}

export function downloadFile(fileUrl: string, fileName: string): void {
  console.log("Downloading file:", fileName, "from URL:", fileUrl);
  
  try {
    const url = getFileUrl(fileUrl);
    
    if (!url) {
      console.error("Could not get file URL for download");
      toast.error("File not found or corrupted");
      return;
    }
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    console.log("File download initiated successfully");
    toast.success("Download started");
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error("Failed to download file");
  }
}
