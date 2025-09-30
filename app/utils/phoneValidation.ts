// Phone number validation utility for E.164 format

export interface PhoneValidationResult {
  isValid: boolean;
  formatted?: string;
  error?: string;
}

/**
 * Validates and formats phone number to E.164 format
 * @param phoneNumber - Raw phone number input
 * @param defaultCountryCode - Default country code (e.g., '+91' for India)
 * @returns Validation result with formatted number if valid
 */
export function validateAndFormatPhone(
  phoneNumber: string,
  defaultCountryCode: string = '+91'
): PhoneValidationResult {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  // Remove all invisible characters, spaces, dashes, and parentheses
  let cleaned = phoneNumber
    .replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '') // Remove invisible characters
    .replace(/[\s\-\(\)\.]/g, '') // Remove spaces, dashes, parentheses, dots
    .trim();

  // Handle different input formats
  if (cleaned.startsWith('00')) {
    // Convert 00 prefix to +
    cleaned = '+' + cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    // Add country code if starts with 0 (remove leading 0)
    cleaned = defaultCountryCode + cleaned.substring(1);
  } else if (!cleaned.startsWith('+')) {
    // Add country code if no + prefix
    cleaned = defaultCountryCode + cleaned;
  }

  // Validate E.164 format
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  
  if (!e164Regex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Invalid phone number format. Please provide a valid number.'
    };
  }

  // Additional validation for Indian numbers (+91)
  if (cleaned.startsWith('+91')) {
    const indianNumber = cleaned.substring(3);
    
    // Indian mobile numbers should be 10 digits and start with 6-9
    if (indianNumber.length !== 10) {
      return {
        isValid: false,
        error: 'Indian phone numbers must be 10 digits after country code'
      };
    }
    
    if (!/^[6-9]/.test(indianNumber)) {
      return {
        isValid: false,
        error: 'Indian mobile numbers must start with 6, 7, 8, or 9'
      };
    }
  }

  return {
    isValid: true,
    formatted: cleaned
  };
}

/**
 * Format phone number for display (adds spaces for readability)
 * @param phoneNumber - E.164 formatted phone number
 * @returns Human-readable formatted number
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  if (!phoneNumber || !phoneNumber.startsWith('+91')) {
    return phoneNumber;
  }

  const number = phoneNumber.substring(3);
  if (number.length === 10) {
    return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
  }

  return phoneNumber;
}

/**
 * Example usage and test cases
 */
export const phoneValidationExamples = {
  valid: [
    '+918000366403',
    '+91 8000 366403',
    '8000366403',
    '08000366403',
    '918000366403'
  ],
  invalid: [
    '+915000366403', // Starts with 5
    '+9180003664', // Too short
    '+91800036640312', // Too long
    'invalid',
    '+1234567890123456', // Too long overall
  ]
};