/**
 * FIRESTORE SCHEMA
 *
 * users/{userId}
 *   - email: string
 *   - firstName: string (optional, from schedule parsing)
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *
 * users/{userId}/schedules/{scheduleId}
 *   - classes: ClassData[]
 *   - uploadedAt: timestamp
 *   - fileName: string
 *
 * classAttendance/{classKey}
 *   - courseName: string
 *   - section: string
 *   - dayOfWeek: string (e.g., "Monday")
 *   - startTime: string (e.g., "11:10 AM")
 *   - endTime: string (e.g., "12:00 PM")
 *   - location: string
 *   - createdAt: timestamp
 *
 * classAttendance/{classKey}/attendees/{attendanceId}
 *   - userId: string
 *   - firstName: string (optional)
 *   - timestamp: timestamp
 *   - markedAt: timestamp
 */

// Schedule types
export interface ClassData {
  courseName: string;
  credits: string;
  gradingBasis: string;
  section: string;
  registrationStatus: string;
  instructionalFormat: string;
  modality: string;
  meetingPatterns: string;
  instructor: string;
  startDate: string;
  endDate: string;
}

export interface ParsedMeetingPattern {
  daysMeeting: string[];
  startTime: string;
  endTime: string;
  location: string;
}

export interface StoredSchedule {
  classes: ClassData[];
  uploadedAt: number; // timestamp in ms
  fileName: string;
}

// User types
export interface UserProfile {
  email: string;
  firstName?: string;
  createdAt: number;
  updatedAt: number;
}

// Attendance types
export interface ClassInstance {
  courseName: string;
  section: string;
  dayOfWeek: string; // "Monday", "Tuesday", etc.
  startTime: string; // "11:10 AM"
  endTime: string; // "12:00 PM"
  location: string;
  createdAt: number;
}

export interface AttendanceRecord {
  userId: string;
  firstName?: string;
  timestamp: number; // when marked
  markedAt: number; // server timestamp
}

// UI/App types
export interface ScheduleFile {
  id: string;
  classes: ClassData[];
  uploadedAt: Date;
  fileName: string;
}
