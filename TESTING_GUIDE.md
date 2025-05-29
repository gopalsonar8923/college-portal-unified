
# College Portal Application - Testing Guide

## Application Overview
This is a comprehensive college management system with role-based access for Students, Teachers, and Administrators.

## Getting Started
The application starts with no pre-configured accounts. You'll need to create your own accounts through the signup process.

### Creating Your First Account
1. Navigate to `/signup`
2. Fill in the registration form
3. Select your role (Student, Teacher, or Administrator)
4. For students, select your class
5. Complete the signup process
6. Use `/login` to access your account

## Testing Scenarios

### 1. Authentication Testing

#### Sign Up Process
1. Navigate to `/signup`
2. Test creating new accounts for each role
3. Verify required field validation
4. For students, ensure class selection is mandatory
5. Test password confirmation matching
6. Verify email uniqueness validation

#### Login Process
1. Navigate to `/login`
2. Test login with each role you've created
3. Verify invalid credentials handling
4. Test role-based redirects to dashboard

### 2. Admin Functionality Testing

#### Manage Students
1. Login as admin
2. Navigate to "Manage Students"
3. **Add Student:**
   - Click "Add Student"
   - Fill all required fields
   - Test form validation
   - Verify student appears in list
4. **Edit Student:**
   - Click "Edit" on any student
   - Modify details
   - Verify changes are saved
5. **Delete Student:**
   - Click "Delete" on any student
   - Confirm deletion
   - Verify student is removed
6. **Search Functionality:**
   - Use search bar to filter students
   - Test search by name and email

#### Manage Teachers
1. Navigate to "Manage Teachers"
2. **Add Teacher:**
   - Click "Add Teacher"
   - Fill required fields
   - Assign multiple classes
   - Verify teacher creation
3. **Edit Teacher:**
   - Modify teacher details
   - Add/remove classes
   - Update password (optional)
4. **Delete Teacher:**
   - Remove teacher account
   - Verify deletion

#### Schedule Lectures
1. Navigate to "Schedule Lectures"
2. **Create Lecture:**
   - Select event type as "lecture"
   - Choose class and dates
   - Manually type subject name
   - Set start and end times
   - Verify lecture is saved

#### Class Statistics
1. Navigate to "Class Statistics"
2. Verify student count per class
3. Check total student count

#### Attendance Reports (Admin)
1. Navigate to "Attendance Reports"
2. Select any class
3. Filter by subject (optional)
4. View attendance statistics
5. Export report to Excel
6. Verify export functionality

### 3. Teacher Functionality Testing

#### Schedule Lectures (Teacher View)
1. Login as teacher
2. Navigate to "Scheduled Lectures"
3. Verify only lectures for teacher's classes appear
4. Click "Mark Attendance" on any lecture

#### Mark Attendance
1. From scheduled lectures, click "Mark Attendance"
2. **First Time Marking:**
   - All students should be checked (present) by default
   - Uncheck some students
   - Submit attendance
   - Verify success message
3. **Update Attendance:**
   - Navigate back to same lecture
   - Modify attendance
   - Verify update functionality

#### Attendance Reports (Teacher)
1. Navigate to "Attendance Reports"
2. Select from teacher's assigned classes
3. Filter by subject
4. View student statistics
5. Export class reports

### 4. Student Functionality Testing

#### View Attendance
1. Login as student
2. Navigate to "View Attendance"
3. **Verify Student-Only Data:**
   - Only student's own attendance visible
   - No access to other students' data
4. **Filter by Subject:**
   - Use subject filter
   - Verify data updates correctly
5. **Statistics Display:**
   - Check total classes count
   - Verify present/absent counts
   - Confirm attendance percentage

### 5. Data Persistence Testing

#### Local Storage Verification
1. Add students, teachers, mark attendance
2. Refresh browser
3. Verify all data persists
4. Test across different browser sessions

#### Cross-Role Data Consistency
1. Admin adds students
2. Teacher marks attendance for those students
3. Student views their attendance
4. Verify data consistency across roles

### 6. UI/UX Testing

#### Responsive Design
1. Test on different screen sizes
2. Verify mobile responsiveness
3. Check table scrolling on small screens

#### Navigation
1. Test sidebar navigation for each role
2. Verify role-based menu items
3. Test breadcrumb navigation

#### Form Validation
1. Test all forms with invalid data
2. Verify error messages display
3. Test required field validation

### 7. Edge Cases Testing

#### Empty States
1. Login with new accounts (no data)
2. Verify appropriate empty state messages
3. Test with classes that have no students

#### Data Integrity
1. Delete students who have attendance records
2. Verify system handles orphaned data
3. Test with overlapping lecture schedules

#### File Operations
1. Test Excel export with large datasets
2. Verify export file format and content
3. Test with special characters in names

## Expected Behaviors

### Role-Based Access
- **Students:** Can only view their own attendance
- **Teachers:** Can manage attendance for assigned classes only
- **Admins:** Can access all data and manage users

### Data Flow
1. Admin creates students and teachers
2. Admin/Teachers schedule lectures
3. Teachers mark attendance
4. All roles can view relevant reports
5. Data exports work correctly

### Security
- Users can only access their role's features
- Students cannot see other students' data
- Password fields are properly masked

## Common Issues to Check
1. Form validation works on all forms
2. Date/time pickers function correctly
3. Export features generate proper files
4. Search and filter functions work
5. Toast notifications appear for user actions
6. Data persists across browser sessions

## Browser Compatibility
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Recommended Testing Flow
1. Create an Admin account first
2. Use Admin to create Teacher and Student accounts
3. Test all Admin functionality
4. Login as Teacher and test Teacher features
5. Login as Student and test Student features
6. Test cross-role data consistency

This comprehensive testing guide should help verify all functionality works as expected with your own custom accounts!
