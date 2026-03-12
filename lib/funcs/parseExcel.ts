import * as XLSX from 'xlsx';
import { ClassData, ParsedMeetingPattern } from '../types/schedule';

export function extractStudentFirstName(classDesc: string): string | null {
  // Match text before (UID...) pattern
  const uidMatch = classDesc.match(/^(.*?)\s*\(UID\d+\)/);
  if (uidMatch) {
    const fullName = uidMatch[1].trim();
    const firstName = fullName.split(' ')[0];
    return firstName;
  }
  return null;
}

export async function parseScheduleFile(file: File): Promise<{ classes: ClassData[], studentFirstName: string | null }> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
  const classes: ClassData[] = [];
  let studentFirstName: string | null = null;
  
  // Start from row 4 (index 3) and check up to row 20
  for (let row = 4; row <= 20; row++) {
    const classDesc = getCellValue(worksheet, `A${row}`);
    
    // If class description is empty, we've reached the end
    if (!classDesc) break;
    
    // Try to extract student name from the first row that contains UID
    if (!studentFirstName && classDesc.includes('UID')) {
      studentFirstName = extractStudentFirstName(classDesc);
    }
    
    const courseName = getCellValue(worksheet, `B${row}`);
    const rawSectionField = getCellValue(worksheet, `G${row}`);
    const computedSection = deriveSectionNumber(courseName, rawSectionField) ?? rawSectionField;

    const classData: ClassData = {
      courseName,
      credits: getCellValue(worksheet, `E${row}`),
      gradingBasis: getCellValue(worksheet, `F${row}`),
      section: computedSection,
      registrationStatus: getCellValue(worksheet, `H${row}`),
      instructionalFormat: getCellValue(worksheet, `I${row}`),
      modality: getCellValue(worksheet, `J${row}`),
      meetingPatterns: getCellValue(worksheet, `K${row}`),
      instructor: getCellValue(worksheet, `L${row}`),
      startDate: getCellValue(worksheet, `M${row}`),
      endDate: getCellValue(worksheet, `N${row}`),
    };
    
    classes.push(classData);
  }
  
  return { classes, studentFirstName };
}

function getCellValue(worksheet: XLSX.WorkSheet, cell: string): string {
  const cellData = worksheet[cell];
  if (!cellData) return '';
  return cellData.v?.toString() || '';
}

export function parseMeetingPattern(pattern: string): ParsedMeetingPattern[] {
  if (!pattern) return [];
  
  const patterns: ParsedMeetingPattern[] = [];
  const lines = pattern.split('\n').map(l => l.trim()).filter(l => l);
  
  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    
    if (parts.length >= 3) {
      const daysStr = parts[0];
      const timeStr = parts[1];
      const location = parts[2];
      
      // Parse days (e.g., "M_W_F" or "T_TH")
      const daysMeeting = parseDays(daysStr);
      
      // Parse time (e.g., "11:10 AM - 12:00 PM")
      const timeMatch = timeStr.match(/(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)/i);
      if (timeMatch) {
        patterns.push({
          daysMeeting,
          startTime: timeMatch[1].trim(),
          endTime: timeMatch[2].trim(),
          location,
        });
      }
    }
  }
  
  return patterns;
}

function parseDays(daysStr: string): string[] {
  const dayMap: { [key: string]: string } = {
    'M': 'Monday',
    'T': 'Tuesday',
    'W': 'Wednesday',
    'TH': 'Thursday',
    'F': 'Friday',
    'SA': 'Saturday',
    'SU': 'Sunday',
  };
  
  const days: string[] = [];
  const tokens = daysStr.split('_').map(t => t.trim());
  
  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (dayMap[upper]) {
      days.push(dayMap[upper]);
    }
  }
  
  return days;
}

/**
 * Derive section number from the courseName and the raw section field.
 * Example:
 *  courseName: "CMPSC 345 - Software Engineering"
 *  section:    "CMPSC 345-1 - Software Engineering"  => returns "1"
 */
function deriveSectionNumber(courseName: string, sectionField: string): string | null {
  if (!courseName || !sectionField) return null;

  // Extract department and course number from courseName
  // Allow optional letter(s) before digits (e.g., CMPSC F355)
  const courseMatch = courseName.match(/^([A-Za-z]+)\s*[A-Za-z]*(\d+)/);
  if (!courseMatch) return null;
  const dept = courseMatch[1].replace(/\s+/g, '').toUpperCase();
  const courseNum = courseMatch[2];

  // Try to match pattern like "CMPSC 345-1" or "CMPSC F355-1" at the start of the section field
  // Allow optional letter(s) before digits and support ASCII hyphen, en dash, or em dash
  const sectionMatch = sectionField.match(/^([A-Za-z]+)\s*[A-Za-z]*(\d+)[-–—](\w+)/);
  if (sectionMatch) {
    const sDept = sectionMatch[1].replace(/\s+/g, '').toUpperCase();
    const sCourseNum = sectionMatch[2];
    const sSuffix = sectionMatch[3];
    if (sDept === dept && sCourseNum === courseNum && /^\d+$/.test(sSuffix)) {
      return sSuffix; // numeric section
    }
  }

  // Fallback: look for any hyphen-number sequence in the field
  const hyphenNum = sectionField.match(/[-–—](\d+)\b/);
  if (hyphenNum) return hyphenNum[1];

  return null;
}
