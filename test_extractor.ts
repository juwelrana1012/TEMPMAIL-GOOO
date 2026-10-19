// Comprehensive unit tests for 8-digit OTP & confirmation code extraction
import { extractSmartOtpCode, normalizeNumerals } from './src/utils/otpExtractor';

const testCases = [
  {
    name: "Facebook confirmation code in subject and body with Facebook ID in footer",
    subject: "84920193 is your Facebook confirmation code",
    body: `Hi Juwel,\nSomeone recently tried to log in to your Facebook account. If this was you, please use the following confirmation code to verify your identity:\n84920193\n\nThis message was sent to juwel.test@tempmailpro.io.\nFacebook ID: 100084920192849\nCase #94829182\nMenlo Park, CA 94025`,
    recipient: "juwel.test@tempmailpro.io",
    expected: "84920193"
  },
  {
    name: "Facebook FB-prefixed 8-digit code",
    subject: "FB-73910284 is your confirmation code",
    body: "Enter FB-73910284 to complete your login.\nFacebook ID: 9988776655",
    recipient: "user@tempmailpro.io",
    expected: "73910284"
  },
  {
    name: "Spaced 8-digit confirmation code",
    subject: "Your confirmation code",
    body: "Please enter your 8-digit confirmation code: 4829 1058 to continue.",
    recipient: "test@tempmailpro.io",
    expected: "48291058"
  },
  {
    name: "Recipient email contains 8 digits in username",
    subject: "Security code: 62910485",
    body: "Your confirmation code is 62910485. Sent to user84920193@tempmailpro.io",
    recipient: "user84920193@tempmailpro.io",
    expected: "62910485"
  },
  {
    name: "Microsoft 8-digit account security code",
    subject: "Microsoft account security code",
    body: "Please use the following 8-digit security code for your Microsoft account: 83910472\nIf you did not request this, please ignore.\nRef: 99882211",
    recipient: "user@tempmailpro.io",
    expected: "83910472"
  },
  {
    name: "Bengali numerals 8-digit confirmation code",
    subject: "৮৪৯২০১৯৩ হলো আপনার ফেসবুক কনফার্মেশন কোড",
    body: "লগইন করার জন্য আপনার ৮-ডিজিটের কনফার্মেশন কোডটি হলো: ৮৪৯২০১৯৩",
    recipient: "user@tempmailpro.io",
    expected: "84920193"
  },
  {
    name: "HTML email with prominent 8-digit code in div/bold",
    subject: "Confirm your account",
    body: "",
    html: `<div style="font-size:32px; font-weight:bold; letter-spacing:4px">91827364</div><p>Use this confirmation code to finish setting up your account.</p><p>Account ID: 1029384756</p>`,
    recipient: "user@tempmailpro.io",
    expected: "91827364"
  },
  {
    name: "Direct code entered or pasted by user",
    subject: "",
    body: "84920193",
    recipient: "",
    expected: "84920193"
  },
  {
    name: "Direct code with FB- prefix pasted",
    subject: "",
    body: "FB-84920193",
    recipient: "",
    expected: "84920193"
  }
];

let failed = 0;
for (const tc of testCases) {
  const result = extractSmartOtpCode(tc.subject, tc.body, tc.html || '', tc.recipient);
  if (result === tc.expected) {
    console.log(`[PASS] ${tc.name} -> ${result}`);
  } else {
    console.error(`[FAIL] ${tc.name} -> Expected: ${tc.expected}, Got: ${result}`);
    failed++;
  }
}

if (failed === 0) {
  console.log("\nALL TEST CASES PASSED!");
} else {
  console.error(`\n${failed} test case(s) failed!`);
  process.exit(1);
}
