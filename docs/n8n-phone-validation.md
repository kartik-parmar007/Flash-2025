# n8n Phone Number Validation Node (Function Node)

## Add this JavaScript code to a Function Node in your n8n workflow:

```javascript
// Get the phone number from input
let phoneNumber = $input.first().json.phone || $input.first().json.phoneNumber || $input.first().json.number;

if (!phoneNumber) {
  throw new Error('Phone number is required');
}

// Clean the phone number - remove invisible characters and formatting
let cleaned = phoneNumber
  .replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '') // Remove invisible characters
  .replace(/[\s\-\(\)\.]/g, '') // Remove spaces, dashes, parentheses, dots
  .trim();

// Handle different input formats
if (cleaned.startsWith('00')) {
  cleaned = '+' + cleaned.substring(2);
} else if (cleaned.startsWith('0')) {
  cleaned = '+91' + cleaned.substring(1); // Assuming India, change as needed
} else if (!cleaned.startsWith('+')) {
  cleaned = '+91' + cleaned; // Add India country code
}

// Validate E.164 format
const e164Regex = /^\+[1-9]\d{1,14}$/;

if (!e164Regex.test(cleaned)) {
  throw new Error(`Invalid phone number format: ${cleaned}. Please provide a valid number in E.164 format.`);
}

// Additional validation for Indian numbers
if (cleaned.startsWith('+91')) {
  const indianNumber = cleaned.substring(3);
  
  if (indianNumber.length !== 10) {
    throw new Error(`Indian phone numbers must be 10 digits after country code. Got: ${indianNumber} (${indianNumber.length} digits)`);
  }
  
  if (!/^[6-9]/.test(indianNumber)) {
    throw new Error(`Indian mobile numbers must start with 6, 7, 8, or 9. Got: ${indianNumber}`);
  }
}

// Return the cleaned phone number
return [{
  json: {
    ...($input.first().json),
    phoneNumber: cleaned,
    phoneNumberFormatted: cleaned.startsWith('+91') ? 
      `+91 ${cleaned.substring(3, 8)} ${cleaned.substring(8)}` : 
      cleaned
  }
}];
```

## Quick Fix for Your Current Error:

Replace `‪+918000366403‬` with `+918000366403` in your n8n workflow.

The invisible characters (‪ and ‬) are causing the validation to fail.