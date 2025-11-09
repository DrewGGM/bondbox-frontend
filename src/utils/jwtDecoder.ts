/**
 * Decodes a JWT token payload
 * @param token - The JWT token string
 * @returns The decoded payload object or null if invalid
 */
export function decodeJWT(token: string): any | null {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');

    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Decode base64url (replace URL-safe characters and decode)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Extracts the user ID from a JWT token
 * @param token - The JWT token string
 * @returns The user ID or null if not found
 */
export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;

  const decoded = decodeJWT(token);
  return decoded?.id || null;
}

/**
 * Extracts the user email from a JWT token
 * @param token - The JWT token string
 * @returns The user email or null if not found
 */
export function getUserEmailFromToken(token: string | null): string | null {
  if (!token) return null;

  const decoded = decodeJWT(token);
  return decoded?.email || null;
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}
