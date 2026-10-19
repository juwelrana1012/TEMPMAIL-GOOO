import React from 'react';
import {
  Mail,
  Zap,
  UserCheck,
  KeyRound,
  Camera,
  Key,
  History,
  Fingerprint,
  Search,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface WebsiteUsageGuideProps {
  themeMode?: 'light' | 'dark';
}

interface SleekTopic {
  id: string;
  number: string;
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
}

const SLEEK_TOPICS: SleekTopic[] = [
  {
    id: 'temp-email',
    number: '01',
    title: 'Instant Temp Mail',
    summary: 'One-click disposable mailbox with auto-copy for fast, spam-free registrations.',
    icon: Mail,
    accentColor: '#38BDF8',
  },
  {
    id: 'otp-reception',
    number: '02',
    title: 'High-Speed OTP Detection',
    summary: 'Real-time verification code capture and fast copy for Google, Meta, WhatsApp & TikTok.',
    icon: Zap,
    accentColor: '#60A5FA',
  },
  {
    id: 'name-gen',
    number: '03',
    title: 'Authentic Name Generator',
    summary: 'Generates realistic male and female identities with single-tap clipboard copy.',
    icon: UserCheck,
    accentColor: '#818CF8',
  },
  {
    id: 'password-gen',
    number: '04',
    title: 'Secure Password Creator',
    summary: 'High-entropy 16-character crack-resistant passwords generated locally on device.',
    icon: KeyRound,
    accentColor: '#A78BFA',
  },
  {
    id: 'recovery-mail',
    number: '05',
    title: 'Recovery Mail Access',
    summary: 'Scan and reopen previous mailboxes to retrieve missed codes anytime.',
    icon: Key,
    accentColor: '#C084FC',
  },
  {
    id: 'mail-history',
    number: '06',
    title: 'Mail History Backup',
    summary: 'Secure browser-stored log of generated addresses with instant re-copy.',
    icon: History,
    accentColor: '#E879F9',
  },
  {
    id: 'url-life-check',
    number: '07',
    title: 'URL & UID Live Check',
    summary: 'Instant real-time verification and alive-status scanner for profile accounts.',
    icon: Search,
    accentColor: '#38BDF8',
  },
  {
    id: 'totp-auth',
    number: '08',
    title: '2FA Code Authenticator',
    summary: 'Generate live TOTP 2-factor authentication codes with press-and-hold instant copy.',
    icon: Fingerprint,
    accentColor: '#F472B6',
  },
];

export const WebsiteUsageGuide: React.FC<WebsiteUsageGuideProps> = ({
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';

  return (
    <section
      id="description-section"
      className={`w-full py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#123B92]/40 via-[#222A82]/50 to-[#3E168E]/60 text-white'
          : 'bg-gradient-to-b from-[#DCEBFF]/50 via-[#E2E5FF]/60 to-[#EDE1FF]/70 text-[#123B92]'
      }`}
    >
      <div className="max-w-4xl mx-auto text-left">
        {/* Section Header: Left-aligned, sleek, no box cards */}
        <div className="mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${
                isDark ? 'text-sky-300' : 'text-[#222A82]'
              }`}
            >
              Overview & Capabilities
            </span>
          </div>

          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-[#123B92]'
            }`}
          >
            TempMail.Go Features
          </h2>

          <p
            className={`text-xs font-normal mt-1 leading-relaxed max-w-xl ${
              isDark ? 'text-sky-100/80' : 'text-[#222A82]/85'
            }`}
          >
            Lightweight, high-speed tools designed for privacy, rapid OTP reception, and credential security.
          </p>
        </div>

        {/* =================================================================== */}
        {/* SERIAL LEFT-ALIGNED DESCRIPTIONS (NO BOX GRIDS, CLEAN THIN FONT)    */}
        {/* =================================================================== */}
        <div className="space-y-3 sm:space-y-3.5 border-l-2 border-indigo-400/30 pl-4 sm:pl-5 my-6 text-left">
          {SLEEK_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                className="group flex items-start gap-3 text-left transition-transform duration-200 hover:translate-x-1"
              >
                {/* Topic Serial Number & Icon */}
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      isDark ? 'text-sky-300' : 'text-[#222A82]'
                    }`}
                  >
                    {topic.number}.
                  </span>
                  <Icon
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: topic.accentColor }}
                  />
                </div>

                {/* Left-Aligned Concise Topic Text: Compact, thin font, no box */}
                <div className="min-w-0 flex-1 text-left">
                  <span
                    className={`text-xs font-bold mr-2 ${
                      isDark ? 'text-white' : 'text-[#123B92]'
                    }`}
                  >
                    {topic.title}:
                  </span>
                  <span
                    className={`text-xs font-normal leading-relaxed ${
                      isDark ? 'text-sky-100/90' : 'text-[#222A82]/90'
                    }`}
                  >
                    {topic.summary}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / Privacy Trust Note (Clean minimal line, no heavy box) */}
        <div className="pt-4 border-t border-indigo-300/20 flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span
            className={`font-normal ${
              isDark ? 'text-sky-100/80' : 'text-[#222A82]/85'
            }`}
          >
            All disposable addresses and codes are generated instantly with zero fees and complete privacy.
          </span>
        </div>

        {/* Footer Copyright */}
        <div
          className={`mt-6 pt-3 border-t border-indigo-300/20 text-[11px] font-normal ${
            isDark ? 'text-sky-200/70' : 'text-[#222A82]/70'
          }`}
        >
          © {new Date().getFullYear()} TempMail.Go — All rights reserved. High Speed, Fast OTP & Total Privacy.
        </div>
      </div>
    </section>
  );
};
