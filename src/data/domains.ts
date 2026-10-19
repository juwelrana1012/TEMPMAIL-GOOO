import { DomainItem } from '../types';

export const ALL_SERIAL_DOMAINS: DomainItem[] = [
  // 1. Direct OTP Receiver Domain (@tempmailpro.io) - Project ID: 5ef6ab47-cb6f-40a3-919d-d7a06e654df7
  { serial: 1, domain: 'tempmailpro.io', provider: 'TempMailPro', name: 'TempMail Pro (Direct OTP)', isLive: true, tag: 'Direct OTP' },

  // 2 to 10: Guaranteed High-Speed Live MX Domains (Temp Mail Plus Live Delivery)
  { serial: 2, domain: 'mailto.plus', provider: 'Temp Mail Plus', name: 'Temp Mail Plus (Primary)', isLive: true, tag: 'High Speed' },
  { serial: 3, domain: 'fexpost.com', provider: 'Temp Mail Plus', name: 'FexPost Live MX', isLive: true, tag: 'Instant Code' },
  { serial: 4, domain: 'fexbox.org', provider: 'Temp Mail Plus', name: 'FexBox Fast Inbox', isLive: true, tag: 'Live MX' },
  { serial: 5, domain: 'mailbox.in.ua', provider: 'Temp Mail Plus', name: 'MailBox UA Direct', isLive: true, tag: 'Instant Code' },
  { serial: 6, domain: 'rover.info', provider: 'Temp Mail Plus', name: 'Rover Info Delivery', isLive: true, tag: 'High Speed' },
  { serial: 7, domain: 'chitthi.in', provider: 'Temp Mail Plus', name: 'Chitthi Instant MX', isLive: true, tag: 'Instant Code' },
  { serial: 8, domain: 'fextemp.com', provider: 'Temp Mail Plus', name: 'FexTemp Fast MX', isLive: true, tag: 'Live MX' },
  { serial: 9, domain: 'any.pink', provider: 'Temp Mail Plus', name: 'Any Pink Live Delivery', isLive: true, tag: 'High Speed' },
  { serial: 10, domain: 'merepost.com', provider: 'Temp Mail Plus', name: 'MerePost Official MX', isLive: true, tag: 'Instant Code' },

  // 11 to 15: Guerrilla Mail & SharkLasers Live SMTP
  { serial: 11, domain: 'sharklasers.com', provider: 'SharkLasers', name: 'SharkLasers SMTP', isLive: true, tag: 'Live SMTP' },
  { serial: 12, domain: 'guerrillamail.com', provider: 'Guerrilla Mail', name: 'Guerrilla Mail Direct', isLive: true, tag: 'Live SMTP' },
  { serial: 13, domain: 'guerrillamailblock.com', provider: 'Guerrilla Mail', name: 'Guerrilla Block', isLive: true, tag: 'Live SMTP' },
  { serial: 14, domain: 'guerrillamail.net', provider: 'Guerrilla Mail', name: 'Guerrilla Net', isLive: true, tag: 'Live SMTP' },
  { serial: 15, domain: 'spam4.me', provider: 'Guerrilla Mail', name: 'Spam4Me Live', isLive: true, tag: 'Live SMTP' },
];
