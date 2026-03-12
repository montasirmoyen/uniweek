import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Unsubscribe,
} from 'firebase/auth';
import { auth } from './db';
import { initializeUserProfile } from './db';

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Register a new user
 */
export async function registerUser(email: string, password: string, firstName?: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Initialize user profile in Firestore
  await initializeUserProfile(user, firstName);

  return user;
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function
 */
export function subscribeToAuthState(
  onAuthChange: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    onAuthChange(user);
  });
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(): boolean {
  return auth.currentUser !== null;
}
