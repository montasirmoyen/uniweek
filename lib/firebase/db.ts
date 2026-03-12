import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  getDocs,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import type { ClassData, UserProfile, StoredSchedule, AttendanceRecord, ClassInstance } from './types';

// Get Firestore instance
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "schedule-cb507.firebaseapp.com",
  projectId: "schedule-cb507",
  storageBucket: "schedule-cb507.firebasestorage.app",
  messagingSenderId: "926560276926",
  appId: "1:926560276926:web:06912c7ec42e5578bd69ef",
  measurementId: "G-4VZTB3XMTZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Create or update user profile on first login
 */
export async function initializeUserProfile(user: User, firstName?: string) {
  if (!user.uid) throw new Error('User not authenticated');

  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // New user
    await setDoc(userRef, {
      email: user.email,
      firstName: firstName || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
}

/**
 * Update user profile (e.g., firstName)
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================================
// SCHEDULE PERSISTENCE FUNCTIONS
// ============================================================================

/**
 * Save or replace user's schedule
 * Stores the parsed class data (not the raw XLSX file)
 */
export async function saveSchedule(
  userId: string,
  classes: ClassData[],
  fileName: string
): Promise<string> {
  if (!userId) throw new Error('User not authenticated');

  const userSchedulesRef = collection(db, 'users', userId, 'schedules');

  // Delete existing schedules (only keep one)
  const existingSchedules = await getDocs(userSchedulesRef);
  for (const doc of existingSchedules.docs) {
    await deleteDoc(doc.ref);
  }

  // Add new schedule
  const newScheduleRef = await addDoc(userSchedulesRef, {
    classes,
    fileName,
    uploadedAt: serverTimestamp(),
  } as Omit<StoredSchedule, 'uploadedAt'> & { uploadedAt: ReturnType<typeof serverTimestamp> });

  return newScheduleRef.id;
}

/**
 * Load user's saved schedule
 */
export async function loadSchedule(userId: string): Promise<StoredSchedule | null> {
  if (!userId) return null;

  const userSchedulesRef = collection(db, 'users', userId, 'schedules');
  const scheduleQuery = query(userSchedulesRef);
  const querySnapshot = await getDocs(scheduleQuery);

  if (querySnapshot.empty) return null;

  // Get the most recent schedule
  const scheduleDoc = querySnapshot.docs[0];
  const data = scheduleDoc.data();

  return {
    classes: data.classes as ClassData[],
    fileName: data.fileName as string,
    uploadedAt: (data.uploadedAt as Timestamp).toMillis(),
  };
}

/**
 * Update existing schedule (replace classes, keep metadata)
 */
export async function updateSchedule(
  userId: string,
  classes: ClassData[],
  fileName: string
): Promise<void> {
  if (!userId) throw new Error('User not authenticated');

  const userSchedulesRef = collection(db, 'users', userId, 'schedules');
  const scheduleQuery = query(userSchedulesRef);
  const querySnapshot = await getDocs(scheduleQuery);

  if (querySnapshot.empty) {
    // No existing schedule, create new one
    await saveSchedule(userId, classes, fileName);
    return;
  }

  // Update existing schedule
  const scheduleRef = querySnapshot.docs[0].ref;
  await updateDoc(scheduleRef, {
    classes,
    fileName,
    uploadedAt: serverTimestamp(),
  });
}

/**
 * Delete user's schedule
 */
export async function deleteSchedule(userId: string): Promise<void> {
  if (!userId) throw new Error('User not authenticated');

  const userSchedulesRef = collection(db, 'users', userId, 'schedules');
  const scheduleQuery = query(userSchedulesRef);
  const querySnapshot = await getDocs(scheduleQuery);

  for (const doc of querySnapshot.docs) {
    await deleteDoc(doc.ref);
  }
}

// ============================================================================
// ATTENDANCE FUNCTIONS
// ============================================================================

/**
 * Create a unique key for a class instance
 * Scope: courseName + section + dayOfWeek + startTime + endTime + location
 */
function createClassKey(classInstance: ClassInstance): string {
  return `${classInstance.courseName.replace(/\s+/g, '_')}_${classInstance.section}_${classInstance.dayOfWeek}_${classInstance.startTime.replace(/\s+/g, '_')}_${classInstance.endTime.replace(/\s+/g, '_')}_${classInstance.location.replace(/\s+/g, '_')}`;
}

/**
 * Mark attendance for a class
 */
export async function markAttendance(
  userId: string,
  classInstance: ClassInstance,
  firstName?: string
): Promise<void> {
  if (!userId) throw new Error('User not authenticated');

  const classKey = createClassKey(classInstance);
  const classAttendanceRef = doc(db, 'classAttendance', classKey);
  const attendeesRef = collection(classAttendanceRef, 'attendees');

  // Create class entry if it doesn't exist
  const classDoc = await getDoc(classAttendanceRef);
  if (!classDoc.exists()) {
    await setDoc(classAttendanceRef, {
      courseName: classInstance.courseName,
      section: classInstance.section,
      dayOfWeek: classInstance.dayOfWeek,
      startTime: classInstance.startTime,
      endTime: classInstance.endTime,
      location: classInstance.location,
      createdAt: serverTimestamp(),
    } as Omit<ClassInstance, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> });
  }

  // Add or update attendance record
  const existingAttendance = await getDocs(attendeesRef);
  const existingRecord = existingAttendance.docs.find(
    (doc) => (doc.data() as AttendanceRecord).userId === userId
  );

  if (existingRecord) {
    // Update existing record
    await updateDoc(existingRecord.ref, {
      markedAt: serverTimestamp(),
    });
  } else {
    // Create new record
    await addDoc(attendeesRef, {
      userId,
      firstName: firstName || null,
      timestamp: serverTimestamp(),
      markedAt: serverTimestamp(),
    } as Omit<AttendanceRecord, 'timestamp' | 'markedAt'> & {
      timestamp: ReturnType<typeof serverTimestamp>;
      markedAt: ReturnType<typeof serverTimestamp>;
    });
  }
}

/**
 * Unmark attendance for a class
 */
export async function unmarkAttendance(userId: string, classInstance: ClassInstance): Promise<void> {
  if (!userId) throw new Error('User not authenticated');

  const classKey = createClassKey(classInstance);
  const classAttendanceRef = doc(db, 'classAttendance', classKey);
  const attendeesRef = collection(classAttendanceRef, 'attendees');

  const querySnapshot = await getDocs(attendeesRef);
  const userRecord = querySnapshot.docs.find(
    (doc) => (doc.data() as AttendanceRecord).userId === userId
  );

  if (userRecord) {
    await deleteDoc(userRecord.ref);
  }
}

/**
 * Get attendance count for a class (one-time fetch)
 */
export async function getAttendanceCount(classInstance: ClassInstance): Promise<number> {
  const classKey = createClassKey(classInstance);
  const classAttendanceRef = doc(db, 'classAttendance', classKey);
  const attendeesRef = collection(classAttendanceRef, 'attendees');

  const querySnapshot = await getDocs(attendeesRef);
  return querySnapshot.size;
}

/**
 * Get all attendees for a class (with optional firstName filtering)
 */
export async function getAttendees(
  classInstance: ClassInstance,
  onlyWithNames = false
): Promise<AttendanceRecord[]> {
  const classKey = createClassKey(classInstance);
  const classAttendanceRef = doc(db, 'classAttendance', classKey);
  const attendeesRef = collection(classAttendanceRef, 'attendees');

  const querySnapshot = await getDocs(attendeesRef);
  let records = querySnapshot.docs.map((doc) => ({
    ...(doc.data() as AttendanceRecord),
    markedAt: (doc.data().markedAt as Timestamp).toMillis(),
    timestamp: (doc.data().timestamp as Timestamp).toMillis(),
  }));

  if (onlyWithNames) {
    records = records.filter((r) => r.firstName);
  }

  return records;
}

/**
 * Listen to real-time attendance count for a class
 * Returns unsubscribe function
 */
export function subscribeToAttendanceCount(
  classInstance: ClassInstance,
  onCountChange: (count: number) => void
): Unsubscribe {
  const classKey = createClassKey(classInstance);
  const classAttendanceRef = doc(db, 'classAttendance', classKey);
  const attendeesRef = collection(classAttendanceRef, 'attendees');

  return onSnapshot(attendeesRef, (snapshot) => {
    onCountChange(snapshot.size);
  });
}

/**
 * Listen to real-time attendee list for a class
 * Returns unsubscribe function
 */
export function subscribeToAttendees(
  classInstance: ClassInstance,
  onAttendeesChange: (attendees: AttendanceRecord[]) => void
): Unsubscribe {
  const classKey = createClassKey(classInstance);
  const classAttendanceRef = doc(db, 'classAttendance', classKey);
  const attendeesRef = collection(classAttendanceRef, 'attendees');

  return onSnapshot(attendeesRef, (snapshot) => {
    const records = snapshot.docs.map((doc) => ({
      ...(doc.data() as AttendanceRecord),
      markedAt: (doc.data().markedAt as Timestamp).toMillis(),
      timestamp: (doc.data().timestamp as Timestamp).toMillis(),
    }));
    onAttendeesChange(records);
  });
}

// ============================================================================
// EXPORT AUTH INSTANCE
// ============================================================================

export { auth, db };
