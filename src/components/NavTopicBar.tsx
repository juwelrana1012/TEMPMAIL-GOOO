import React from 'react';
import {
  Home,
  UserCheck,
  KeyRound,
  Search,
  Fingerprint,
} from 'lucide-react';

export type TopicId =
  | 'home'
  | 'name-generator'
  | 'password-creator'
  | 'url-life-check'
  | '2fa-code';

interface NavTopicBarProps {
  activeTopic: TopicId;
  onSelectTopic: (id: TopicId) => void;
  mailHistoryCount?: number;
  themeMode?: 'light' | 'dark';
}

export const NavTopicBar: React.FC<NavTopicBarProps> = ({
  activeTopic,
  onSelectTopic,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';

  const items = [
    {
      id: 'home' as TopicId,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'name-generator' as TopicId,
      label: 'Name',
      icon: UserCheck,
    },
    {
      id: 'password-creator' as TopicId,
      label: 'Password',
      icon: KeyRound,
    },
    {
      id: 'url-life-check' as TopicId,
      label: 'UID Check',
      icon: Search,
    },
    {
      id: '2fa-code' as TopicId,
      label: '2FA Code',
      icon: Fingerprint,
    },
  ];

  return (
    <nav className="w-full max-w-4xl mx-auto px-1 sm:px-2 select-none overflow-hidden" aria-label="Bottom Navigation">
      {/* 
        5 Equal-Width, Perfectly Symmetrical Columns with identical gaps
      */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 w-full items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTopic === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTopic(item.id)}
              className={`w-full flex flex-col sm:flex-row items-center justify-center py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-gradient-to-r from-[#1870E9] via-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-600/40 ring-1 ring-sky-300 scale-[1.02]'
                    : 'bg-gradient-to-r from-[#222A82] via-[#1D4ED8] to-[#3E168E] text-white shadow-md shadow-indigo-900/30 ring-1 ring-blue-500 scale-[1.02]'
                  : isDark
                  ? 'text-white/85 hover:text-white hover:bg-white/10'
                  : 'text-[#123B92] hover:text-[#222A82] hover:bg-white/60'
              }`}
            >
              <div className="relative shrink-0 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] mb-0.5 sm:mb-0 sm:mr-1" />
              </div>

              {/* Always displays full word 'Password' with balanced spacing across all buttons */}
              <span className="text-[9.5px] xs:text-[10.5px] sm:text-xs font-black tracking-tight text-center leading-tight truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

