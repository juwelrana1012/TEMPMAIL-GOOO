import React from 'react';
import {
  X,
  BookOpen,
  Mail,
  History,
  Key,
  UserCheck,
  KeyRound,
  Search,
  Camera,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface TopicUsageGuidePageProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  themeMode?: 'light' | 'dark';
}

interface GuideSection {
  id: string;
  topicName: string;
  number: string;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  steps: string[];
  tips: string;
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'temp-email',
    topicName: 'Instant Temp Mail & OTP',
    number: '01',
    title: 'Instant Disposable Mailbox & OTP Verification Guide',
    shortDesc: 'Automated spam-free disposable email address generator for instant registrations and verification code delivery.',
    icon: Mail,
    accentColor: '#38BDF8',
    steps: [
      'Your temporary email address is automatically generated and ready to receive mail immediately.',
      'Tap the Copy button next to the email address to copy it to your clipboard.',
      'Paste this temporary address on any app, service, or social media registration form.',
      'As soon as the verification email arrives, the 6-digit OTP code appears in real-time in the Verification Code box.',
      'Tap the Verification Code box or the Copy button to immediately copy the received code.',
      'Tap the New button whenever you want to generate a completely fresh temporary email address.',
    ],
    tips: 'Zero signup, no passwords required, completely anonymous, and works with all major online services.',
  },
  {
    id: 'mail-history',
    topicName: 'Mail History Backup',
    number: '02',
    title: 'Mail History Backup & Re-use Guide',
    shortDesc: 'Secure browser-stored chronological record of all previously generated temporary email addresses.',
    icon: History,
    accentColor: '#10B981',
    steps: [
      'Click the Mail History button in the bottom navigation bar.',
      'Browse through all the temporary email addresses you have created or copied during your session.',
      'Use the search bar at the top to quickly find a specific address by name or domain.',
      'Click on any address in the list to immediately re-copy it to your device clipboard.',
      'Remove individual addresses or clear your entire history with a single tap.',
    ],
    tips: 'History is saved privately in your local browser storage and is never uploaded to any third party.',
  },
  {
    id: 'recovery-mail',
    topicName: 'Recovery Mail & Scanner',
    number: '03',
    title: 'Recovery Mail & Missed Code Scanner Guide',
    shortDesc: 'Re-access previous mailboxes and run deep server scans for delayed verification codes.',
    icon: Key,
    accentColor: '#A855F7',
    steps: [
      'Click the Recovery Mail button in the bottom navigation bar.',
      'Enter or paste any previously generated temporary email address.',
      'Click Recover Mailbox to connect to the mail provider servers.',
      'The scanner checks all server mailboxes for any delayed or missed OTP codes.',
      'Any received confirmation emails or verification codes are displayed immediately.',
    ],
    tips: 'Ideal for situations where social media platforms or game servers take several minutes to send codes.',
  },
  {
    id: 'name-generator',
    topicName: 'Authentic Name Generator',
    number: '04',
    title: 'Authentic Name & Identity Generator Guide',
    shortDesc: 'Generates realistic human names and matching usernames for privacy-respecting online signups.',
    icon: UserCheck,
    accentColor: '#3B82F6',
    steps: [
      'Click the Name Generator button in the bottom navigation bar.',
      'Select your preferred Gender: Male or Female.',
      'Choose from all 195 sovereign countries across the globe with authentic local naming conventions.',
      'Click New Generate to produce a unique name and matching secure password with zero repetitions.',
      'Click on the name or password to copy it directly to your clipboard.',
    ],
    tips: 'Guaranteed unique and non-repeating names across sessions, supporting all 195 countries worldwide.',
  },
  {
    id: 'password-creator',
    topicName: 'Strong Password Creator',
    number: '05',
    title: 'Strong Password Creator Guide',
    shortDesc: 'Generates cryptographically random, crack-resistant high-entropy passwords.',
    icon: KeyRound,
    accentColor: '#F59E0B',
    steps: [
      'Click the Password Creator button in the bottom navigation bar.',
      'Choose your desired password length (12 to 32 characters, default is 16).',
      'Toggle character sets: Uppercase letters, Lowercase letters, Numbers, and Special symbols.',
      'Click Generate New Password to create a cryptographically secure random string.',
      'Click the Copy Password button to copy it safely to your clipboard.',
    ],
    tips: 'Passwords are calculated entirely on your device with high entropy and are never sent over the internet.',
  },
  {
    id: 'uid-live-check',
    topicName: 'UID Live Check',
    number: '06',
    title: 'UID Live Check (Facebook & Instagram) Guide',
    shortDesc: 'Real-time account alive-status validator and UID profile inspection tool.',
    icon: Search,
    accentColor: '#06B6D4',
    steps: [
      'Click the UID Live Check button in the bottom navigation bar.',
      'Enter or paste a numeric account UID, profile link, or username.',
      'Select the target platform: Facebook or Instagram.',
      'Click the Check Status button to perform real-time verification against provider servers.',
      'View the real-time status: Active (Alive), Suspended, Restricted, or Not Found.',
    ],
    tips: 'Supports single and bulk UID validation with one-tap status copying.',
  },
  {
    id: 'download-photo',
    topicName: 'Download Photo',
    number: '07',
    title: 'Download Official Profile Photo Guide',
    shortDesc: 'One-tap direct download of the official TempMail.Go avatar & high-resolution graphic asset.',
    icon: Camera,
    accentColor: '#EC4899',
    steps: [
      'Click the Download Photo button in the bottom navigation bar.',
      'Your browser immediately initiates the high-resolution PNG image download.',
      'The file is saved directly into your device Downloads folder.',
      'You can use the official profile avatar across your accounts or wallpaper assets.',
    ],
    tips: 'The image is saved in full resolution with high visual fidelity and transparent background.',
  },
  {
    id: '2fa-code',
    topicName: '2FA Code Generator',
    number: '08',
    title: '2FA Code Authenticator (TOTP) Guide',
    shortDesc: 'Instant 1-tap generation and clipboard copying of 6-digit two-factor authentication codes.',
    icon: Fingerprint,
    accentColor: '#C026D3',
    steps: [
      'Copy your 2FA secret key from Facebook, Google, Meta, Instagram, or Discord.',
      'Click the 2FA Code button in the bottom navigation bar.',
      'The app automatically detects your copied secret key and generates the live 6-digit TOTP code.',
      'The 6-digit code is immediately copied to your clipboard without any dialog or popup.',
      'A confirmation sound plays and a toast notification shows the copied 6-digit code.',
    ],
    tips: 'Compliant with the RFC 6238 standard used by Google Authenticator and Apple Keychain.',
  },
];

export const TopicUsageGuidePage: React.FC<TopicUsageGuidePageProps> = ({
  isOpen,
  onClose,
  initialTopic = 'temp-email',
  themeMode = 'dark',
}) => {
  if (!isOpen) return null;

  const isDark = themeMode === 'dark';

  // Normalize topic id to match GUIDE_SECTIONS exactly
  const normalizedId =
    initialTopic === 'home'
      ? 'temp-email'
      : initialTopic === 'url-life-check'
      ? 'uid-live-check'
      : initialTopic;

  // Find ONLY the requested topic's guide section!
  const section = GUIDE_SECTIONS.find((s) => s.id === normalizedId) || GUIDE_SECTIONS[0];
  const Icon = section.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none animate-fade-in pb-20 sm:pb-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          sounds.playClick();
          onClose();
        }}
      />

      {/* Main Dialog Card for ONLY THIS TOPIC */}
      <div className="relative min-h-screen sm:min-h-0 sm:my-10 mx-auto w-full max-w-2xl p-3 sm:p-6 z-10 flex flex-col justify-center">
        <div
          className={`rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
            isDark
              ? 'bg-gradient-to-b from-[#123B92] via-[#222A82] to-[#3E168E] text-white border-blue-400/35'
              : 'bg-gradient-to-b from-[#DCEBFF] via-[#E2E5FF] to-[#EDE1FF] text-[#123B92] border-[#BACBF5]'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`p-4 sm:p-5 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md ${
              isDark ? 'bg-[#0E2452]/90 border-white/10' : 'bg-white/90 border-[#BACBF5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                    : 'bg-white hover:bg-slate-100 border-[#BACBF5] text-[#123B92]'
                }`}
                title="Return"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: section.accentColor }}
                  >
                    Topic #{section.number}
                  </span>
                  <h2 className="text-sm sm:text-lg font-black tracking-tight leading-tight">
                    {section.topicName}
                  </h2>
                </div>
                <p
                  className={`text-[11px] font-medium leading-none mt-1 ${
                    isDark ? 'text-sky-200' : 'text-[#222A82]/80'
                  }`}
                >
                  English Usage Instructions & Capabilities
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-white hover:bg-slate-100 border-[#BACBF5] text-[#123B92]'
              }`}
              title="Close Guide"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Body Content: ONLY THIS TOPIC */}
          <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Topic Hero Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border ${
                isDark ? 'bg-[#0B1E4A]/80 border-blue-400/30' : 'bg-white/80 border-[#BACBF5]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-md"
                  style={{ backgroundColor: `${section.accentColor}25` }}
                >
                  <Icon className="w-6 h-6 stroke-[2.3]" style={{ color: section.accentColor }} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-base sm:text-lg font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-[#123B92]'
                    }`}
                  >
                    {section.title}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      isDark ? 'text-sky-200/90' : 'text-[#222A82]/85'
                    }`}
                  >
                    {section.shortDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#0B1E4A]/60 border-blue-400/20' : 'bg-white/70 border-[#BACBF5]'
              }`}
            >
              <span
                className={`text-xs font-black uppercase tracking-wider block flex items-center gap-1.5 ${
                  isDark ? 'text-sky-300' : 'text-[#123B92]'
                }`}
              >
                <BookOpen className="w-4 h-4 stroke-[2.5]" />
                Step-by-Step How to Use:
              </span>

              <div className="space-y-2.5 pt-1">
                {section.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <span
                      className="font-mono text-[10px] font-black w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white mt-0.5 shadow-xs"
                      style={{ backgroundColor: section.accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`leading-relaxed font-medium ${
                        isDark ? 'text-slate-100' : 'text-[#222A82]'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-2.5 text-xs font-medium ${
                isDark
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-200'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
              <div className="leading-snug">
                <strong className="font-bold">Pro Tip:</strong> {section.tips}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div
            className={`p-3.5 border-t text-center text-xs font-bold flex items-center justify-between px-5 ${
              isDark ? 'bg-[#0E2452]/90 border-white/10 text-sky-200' : 'bg-white/90 border-[#BACBF5] text-[#123B92]'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>TempMail.Go Official Feature Guide</span>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-[#222A82] text-white hover:bg-[#123B92]'
              }`}
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
