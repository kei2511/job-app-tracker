import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

/**
 * Helper function to get authenticated user ID
 * @returns User ID if authenticated, null otherwise
 */
export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return null;
  }
  
  return session.user.id;
}

/**
 * Check if a user is authenticated
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const userId = await getCurrentUserId();
  return userId !== null;
}