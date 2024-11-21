const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MIN_LENGTH = 3;
const MAX_LENGTH = 12;

export function generateShortCode(length = MIN_LENGTH): string {
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(`Length must be between ${MIN_LENGTH} and ${MAX_LENGTH}`);
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
}

export function isValidCustomCode(code: string): boolean {
  if (!code) return false;
  
  // Check length
  if (code.length < MIN_LENGTH || code.length > MAX_LENGTH) {
    return false;
  }

  // Check if it only contains allowed characters
  const validCharsRegex = /^[a-zA-Z0-9-_]+$/;
  return validCharsRegex.test(code);
}

export function sanitizeCustomCode(code: string): string {
  // Remove any characters that aren't alphanumeric, hyphen, or underscore
  return code.replace(/[^a-zA-Z0-9-_]/g, '');
} 