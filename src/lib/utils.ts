
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ROLE, CLASS_OPTIONS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClassLabel(classValue: string): string {
  return CLASS_OPTIONS.find(c => c.value === classValue)?.label || classValue;
}

export function getRoleLabel(role: string): string {
  switch(role) {
    case ROLE.ADMIN:
      return "Administrator";
    case ROLE.TEACHER:
      return "Teacher";
    case ROLE.STUDENT:
      return "Student";
    default:
      return role;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

export function isPdfFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ext === 'pdf';
}

export function isExcelFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ['xls', 'xlsx', 'csv'].includes(ext);
}
