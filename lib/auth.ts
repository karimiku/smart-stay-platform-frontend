/**
 * Token management utilities
 * Note: Tokens are now stored in httpOnly cookies, so we don't need to manage them manually.
 * However, we still need functions to check authentication status and logout.
 */

/**
 * Logout by clearing the auth cookie
 */
export { logout } from './api';

/**
 * Check if user is authenticated
 * Since we can't read httpOnly cookies from JavaScript,
 * we need to make a request to the server to check authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}
