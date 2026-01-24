export interface ClassData {
  classDescription?: string;
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

export interface ScheduleBlock {
  id: string;
  classData: ClassData;
  meetingPattern: ParsedMeetingPattern;
  color: string;
}

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export type DayOfWeek = typeof DAYS_OF_WEEK[number];
