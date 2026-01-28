// Re-export all Firebase functionality
export { auth, db } from './db';
export {
  initializeUserProfile,
  getUserProfile,
  updateUserProfile,
  saveSchedule,
  loadSchedule,
  updateSchedule,
  deleteSchedule,
  markAttendance,
  unmarkAttendance,
  getAttendanceCount,
  getAttendees,
  subscribeToAttendanceCount,
  subscribeToAttendees,
} from './db';
export {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthState,
  getCurrentUser,
  isUserAuthenticated,
} from './auth';
export type { ClassData, ParsedMeetingPattern, StoredSchedule, UserProfile, ClassInstance, AttendanceRecord } from './types';