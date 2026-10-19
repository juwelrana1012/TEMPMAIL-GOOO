export type MailProviderName =
  | 'Temp Mail Plus'
  | 'SharkLasers'
  | 'Guerrilla Mail'
  | 'Mail.cx'
  | 'Gmail Official'
  | 'Outlook Mail'
  | 'Hotmail'
  | 'Google Mail'
  | 'TempMailPro'
  | 'Tmailor';

export interface MailProviderConfig {
  id: string;
  name: MailProviderName;
  url: string;
  defaultDomain: string;
  availableDomains: string[];
  color: string;
  badge?: string;
  description?: string;
}

export interface MailMessage {
  id: string;
  sender: string;
  senderAvatar?: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  verificationCode: string | null;
  body: string;
  isRead: boolean;
  originIp?: string;
  originLocation?: string;
}

export interface TempEmailAccount {
  id: string;
  address: string;
  domain: string;
  provider: MailProviderName;
  providerUrl: string;
  createdAt: string;
  expiresInMinutes: number;
  latestCode: string | null;
  codeReceivedAt?: string;
  messages: MailMessage[];
  isLiveExternal?: boolean;
  companionLiveInbox?: string;
}

export type ActionButtonType = 'collapse' | 'close' | 'email' | 'key' | 'fingerprint' | 'refresh';

export interface MailHistoryItem {
  id: string;
  address: string;
  date: string; // e.g. "Sep 18, 2026"
  time: string; // e.g. "02:15:30 AM"
  timestamp: number;
  copiedAt?: string;
}

export interface ReplacementCodeResult {
  success: boolean;
  email?: string;
  latestCode?: string;
  sender?: string;
  subject?: string;
  receivedAt?: string;
  messageCount?: number;
  error?: string;
}

export interface DomainItem {
  serial: number;
  domain: string;
  provider: MailProviderName;
  name: string;
  isLive: boolean;
  tag: string;
}

