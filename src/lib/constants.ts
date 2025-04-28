
export const ROLE = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const CLASS_OPTIONS = [
  { value: "fy-bsc", label: "FY B.Sc." },
  { value: "sy-bsc", label: "SY B.Sc." },
  { value: "ty-bsc", label: "TY B.Sc." },
  { value: "fy-bca", label: "FY BCA" },
  { value: "sy-bca", label: "SY BCA" },
  { value: "ty-bca", label: "TY BCA" },
  { value: "fy-msc", label: "FY M.Sc." },
  { value: "sy-msc", label: "SY M.Sc." },
  { value: "mca", label: "MCA" },
] as const;

export const MONTHS = [
  "January",
  "February", 
  "March", 
  "April", 
  "May", 
  "June", 
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
];

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const SUBJECTS = {
  "fy-bsc": ["Mathematics-I", "Physics-I", "Chemistry-I", "Biology", "Computer Science"],
  "sy-bsc": ["Mathematics-II", "Physics-II", "Chemistry-II", "Statistics", "Electronics"],
  "ty-bsc": ["Mathematics-III", "Physics-III", "Chemistry-III", "Botany", "Zoology"],
  "fy-bca": ["Computer Fundamentals", "Programming in C", "Database Management", "Mathematical Foundation", "Digital Electronics"],
  "sy-bca": ["Data Structures", "OOP with C++", "Operating System", "Software Engineering", "Web Technologies"],
  "ty-bca": ["Java Programming", "Computer Networks", "PHP & MySQL", "Software Testing", "Project Work"],
  "fy-msc": ["Advanced Algorithms", "Advanced Database", "Cloud Computing", "Research Methodology", "Elective-I"],
  "sy-msc": ["Machine Learning", "Information Security", "Big Data Analytics", "Soft Computing", "Project Dissertation"],
  "mca": ["Advanced Java", "AI & Neural Networks", "Advanced Web Tech", "Mobile App Development", "Enterprise Resource Planning"],
} as const;

export const EVENT_TYPES = [
  { value: "lecture", label: "Lecture" },
  { value: "exam", label: "Exam" },
  { value: "holiday", label: "Holiday" },
  { value: "event", label: "Event" },
] as const;
