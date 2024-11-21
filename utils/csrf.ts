const CSRF_TOKEN_COOKIE = 'csrf_token';

// Generate a random token
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Set CSRF token in cookie
export function setCSRFCookie(token: string): string {
  return `${CSRF_TOKEN_COOKIE}=${token}; Path=/; SameSite=Lax; Max-Age=3600`;
}

// Validate CSRF token
export function validateCSRFToken(formToken: string | null, cookie: string | null): boolean {
  
  if (!formToken || !cookie) return false;
  
  const cookieToken = cookie
    .split('; ')
    .find(row => row.startsWith(`${CSRF_TOKEN_COOKIE}=`))
    ?.split('=')[1];
  
  return formToken === cookieToken;
} 