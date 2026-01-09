const dns = require("dns").promises;

// Email format validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common fake/disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "throwaway.email",
  "fakeinbox.com",
  "trashmail.com",
  "mohmal.com",
  "temp-mail.org",
  "getnada.com",
  "maildrop.cc",
  "yopmail.com",
  "sharklasers.com",
  "getairmail.com"
];

// Gmail-specific validation
function isValidGmail(email) {
  const lowerEmail = email.toLowerCase();
  
  // Check if it's a Gmail address
  if (!lowerEmail.includes("@gmail.com") && !lowerEmail.includes("@googlemail.com")) {
    return { isValid: false, reason: "Not a Gmail address" };
  }

  // Extract local part (before @)
  const localPart = lowerEmail.split("@")[0];

  // Gmail rules:
  // 1. Must be 6-30 characters
  if (localPart.length < 6 || localPart.length > 30) {
    return { isValid: false, reason: "Gmail username must be 6-30 characters" };
  }

  // 2. Can only contain letters, numbers, and dots
  if (!/^[a-z0-9.]+$/.test(localPart)) {
    return { isValid: false, reason: "Gmail username contains invalid characters" };
  }

  // 3. Cannot start or end with a dot
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return { isValid: false, reason: "Gmail username cannot start or end with a dot" };
  }

  // 4. Cannot have consecutive dots
  if (localPart.includes("..")) {
    return { isValid: false, reason: "Gmail username cannot have consecutive dots" };
  }

  // 5. Check for common fake patterns
  const fakePatterns = ["test", "fake", "temp", "demo", "example", "invalid"];
  if (fakePatterns.some(pattern => localPart.includes(pattern) && localPart.length < 10)) {
    return { isValid: false, reason: "Suspicious Gmail pattern detected" };
  }

  return { isValid: true };
}

// Check if domain exists (DNS lookup)
async function checkDomainExists(domain) {
  try {
    await dns.resolveMx(domain);
    return true;
  } catch (error) {
    // If MX record doesn't exist, try A record
    try {
      await dns.resolve4(domain);
      return true;
    } catch (err) {
      return false;
    }
  }
}

// Check if email domain is disposable
function isDisposableEmail(email) {
  const domain = email.toLowerCase().split("@")[1];
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

// Main email validation function
async function validateEmail(email) {
  // Basic format check
  if (!EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      reason: "Invalid email format"
    };
  }

  const lowerEmail = email.toLowerCase();
  const domain = lowerEmail.split("@")[1];

  // Check for disposable emails
  if (isDisposableEmail(lowerEmail)) {
    return {
      isValid: false,
      reason: "Disposable email addresses are not allowed"
    };
  }

  // Gmail-specific validation
  if (lowerEmail.includes("@gmail.com") || lowerEmail.includes("@googlemail.com")) {
    const gmailCheck = isValidGmail(lowerEmail);
    if (!gmailCheck.isValid) {
      return gmailCheck;
    }
  }

  // Check if domain exists (optional - can be slow)
  // Uncomment if you want to verify domain exists
  /*
  try {
    const domainExists = await checkDomainExists(domain);
    if (!domainExists) {
      return {
        isValid: false,
        reason: "Email domain does not exist"
      };
    }
  } catch (error) {
    // If DNS check fails, we'll still allow it (might be network issue)
    console.warn("DNS check failed for", domain, error.message);
  }
  */

  return {
    isValid: true,
    reason: "Valid email"
  };
}

module.exports = {
  validateEmail,
  isValidGmail,
  isDisposableEmail,
  checkDomainExists
};
