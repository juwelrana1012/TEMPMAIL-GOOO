import React, { useState } from 'react';

interface PlatformOfficialLogoProps {
  platformName?: string;
  senderEmail?: string;
  size?: number;
  className?: string;
}

export const PlatformOfficialLogo: React.FC<PlatformOfficialLogoProps> = ({
  platformName = '',
  senderEmail = '',
  size = 28,
  className = '',
}) => {
  const [imgError, setImgError] = useState<boolean>(false);

  const cleanName = platformName.toLowerCase();
  const cleanEmail = senderEmail.toLowerCase();
  const combined = `${cleanName} ${cleanEmail}`;

  // Extract domain for generic platforms
  const domainMatch = senderEmail.match(/@([a-z0-9.-]+)/i);
  const domain = domainMatch ? domainMatch[1] : '';

  // 1. GOOGLE / GMAIL / YOUTUBE
  if (combined.includes('google') || combined.includes('gmail') || combined.includes('youtube')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Google"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      </div>
    );
  }

  // 2. FACEBOOK / META
  if (combined.includes('facebook') || combined.includes('meta')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#1877F2] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Facebook"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
    );
  }

  // 3. WHATSAPP
  if (combined.includes('whatsapp')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#25D366] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M12.031 0C5.398 0 0 5.398 0 12.031c0 2.119.55 4.186 1.594 6.002L0 24l6.13-1.61c1.765.962 3.766 1.47 5.901 1.47 6.633 0 12.031-5.398 12.031-12.031S18.664 0 12.031 0zm7.042 16.994c-.292.822-1.464 1.503-2.396 1.703-.637.137-1.467.247-4.269-.915-3.582-1.487-5.889-5.116-6.069-5.353-.173-.238-1.442-1.921-1.442-3.665 0-1.743.913-2.604 1.238-2.958.324-.354.707-.442.943-.442.235 0 .471.002.678.012.218.01.508-.083.795.606.293.707 1.003 2.451 1.091 2.628.089.177.147.383.029.62-.118.236-.177.383-.353.59-.177.206-.374.46-.534.618-.178.176-.363.368-.156.723.206.353.918 1.512 1.97 2.449 1.353 1.206 2.493 1.579 2.846 1.756.353.177.56.147.766-.089.206-.236.883-1.031 1.119-1.385.235-.353.471-.294.794-.177.324.118 2.061.972 2.414 1.149.353.177.589.265.677.412.088.148.088.854-.204 1.676z" />
        </svg>
      </div>
    );
  }

  // 4. TELEGRAM
  if (combined.includes('telegram')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#229ED9] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Telegram"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
        </svg>
      </div>
    );
  }

  // 5. TIKTOK
  if (combined.includes('tiktok')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-black shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="TikTok"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23.85-.11 1.8.35 2.53.47.78 1.34 1.31 2.24 1.37 1.1.1 2.23-.33 2.87-1.22.42-.58.62-1.31.63-2.03.02-3.82.01-7.64.01-11.46.01-2.07.01-4.14.01-6.21z" />
        </svg>
      </div>
    );
  }

  // 6. INSTAGRAM
  if (combined.includes('instagram')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Instagram"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>
    );
  }

  // 7. X / TWITTER
  if (combined.includes('twitter') || combined.includes('x.com') || combined.includes('x corp')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-black shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="X"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }

  // 8. MICROSOFT / OUTLOOK / HOTMAIL
  if (combined.includes('microsoft') || combined.includes('outlook') || combined.includes('hotmail')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Microsoft"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect fill="#F25022" x="1" y="1" width="10" height="10" />
          <rect fill="#7FBA00" x="13" y="1" width="10" height="10" />
          <rect fill="#00A4EF" x="1" y="13" width="10" height="10" />
          <rect fill="#FFB900" x="13" y="13" width="10" height="10" />
        </svg>
      </div>
    );
  }

  // 9. DISCORD
  if (combined.includes('discord')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#5865F2] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Discord"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </div>
    );
  }

  // 10. BINANCE / CRYPTO
  if (combined.includes('binance') || combined.includes('crypto')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#F0B90B] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Binance"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-slate-900">
          <path d="M16.624 13.92l2.715 2.715-7.34 7.34-7.34-7.34 2.715-2.715 4.625 4.625 4.626-4.625zm4.662-4.662l2.714 2.714-2.714 2.715-2.715-2.715 2.715-2.714zm-9.286-9.234l7.34 7.34-2.715 2.715-4.625-4.625-4.625 4.625-2.715-2.715 7.34-7.34zm0 6.643l2.715 2.715-2.715 2.714-2.715-2.714 2.715-2.715zm-9.286 2.591l2.715 2.715-2.715 2.714-2.714-2.714 2.714-2.715z" />
        </svg>
      </div>
    );
  }

  // 11. APPLE / ICLOUD
  if (combined.includes('apple') || combined.includes('icloud')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-black shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Apple"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.68-.9 2.71 1 .08 2.03-.5 2.59-1.2z" />
        </svg>
      </div>
    );
  }

  // 12. AMAZON
  if (combined.includes('amazon')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-slate-900 shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Amazon"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-[#FF9900]">
          <path d="M13.925 15.655c-.218.175-.486.29-.785.29-.68 0-1.127-.47-1.127-1.206 0-1.032.846-1.547 2.37-1.547.05 0 .1.002.148.005v1.272c-.172.585-.43 1.01-.606 1.186zm1.758-4.228c-.144-.066-.34-.1-.58-.1-.954 0-1.748.437-2.31 1.272v-1.125h-1.95v7.246h2.09v-.895c.57.653 1.324.992 2.203.992 1.83 0 3.01-1.396 3.01-3.567 0-2.368-1.425-3.823-3.463-3.823zm-1.848-6.195c-5.26 0-9.61 3.29-11.235 7.848-.12.338.03.71.35.856l1.79.824c.304.14.664.01.8-.292C6.67 10.87 9.94 8.63 13.835 8.63c3.08 0 5.86 1.35 7.78 3.52.22.25.6.28.86.06l1.62-1.36c.28-.24.3-.66.05-.93C21.69 7.15 18.06 5.232 13.835 5.232zm8.56 12.87c-.24-.31-.77-.42-1.32-.23-1.63.57-3.44.88-5.32.88-2.6 0-5.04-.6-7.14-1.67-.28-.14-.62-.07-.82.16l-1.36 1.57c-.23.27-.18.68.12.87 2.68 1.62 5.82 2.54 9.2 2.54 2.52 0 4.93-.51 7.11-1.44.5-.21.72-.64.53-.68z" />
        </svg>
      </div>
    );
  }

  // 13. NETFLIX
  if (combined.includes('netflix')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-black shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Netflix"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-[#E50914]">
          <path d="M4 0h3.5v24H4V0zm12.5 0H20v24h-3.5V0zM7.5 0h4.2l4.8 24h-4.2L7.5 0z" />
        </svg>
      </div>
    );
  }

  // 14. SNAPCHAT
  if (combined.includes('snapchat')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#FFFC00] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Snapchat"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-black stroke-black stroke-[0.3]">
          <path d="M12.04 1.5c-3.79 0-6.19 2.76-6.19 6.27 0 .97.34 2.22.45 2.55.1.33-.23.51-.55.67-.32.16-1.04.54-1.35.75-.41.28-.59.71-.24 1.15.34.42 1.14.73 1.83.6.43-.08.61.16.58.46-.07.72-.89 2.57-2.12 3.01-.48.17-.67.58-.33.88.75.67 2.45.67 3.59.39.54-.13.85.12 1 .49.33.81 1.43 1.78 3.33 1.78s3-.97 3.33-1.78c.15-.37.46-.62 1-.49 1.14.28 2.84.28 3.59-.39.34-.3.15-.71-.33-.88-1.23-.44-2.05-2.29-2.12-3.01-.03-.3.15-.54.58-.46.69.13 1.49-.18 1.83-.6.35-.44.17-.87-.24-1.15-.31-.21-1.03-.59-1.35-.75-.32-.16-.65-.34-.55-.67.11-.33.45-1.58.45-2.55 0-3.51-2.4-6.27-6.19-6.27z" />
        </svg>
      </div>
    );
  }

  // 15. SPOTIFY
  if (combined.includes('spotify')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#1DB954] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Spotify"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-black">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>
    );
  }

  // 16. PAYPAL
  if (combined.includes('paypal')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#003087] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="PayPal"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-[#0079C1]">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.82.89 4.912-.767 3.882-3.332 5.986-7.466 5.986H9.68a.86.86 0 0 0-.85.728l-1.017 6.442-.737 1.458z" />
          <path
            fill="#00457C"
            d="M8.83 8.708l-.85 5.385a.86.86 0 0 0 .85.99h2.392c3.445 0 6.136-1.4 6.945-5.503.345-1.745.1-3.136-.742-4.1-.22-.25-.48-.47-.78-.66-1.112 1.267-3.12 1.81-5.69 1.81H8.83z"
          />
        </svg>
      </div>
    );
  }

  // 17. GITHUB
  if (combined.includes('github')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#24292F] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="GitHub"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </div>
    );
  }

  // 18. LINKEDIN
  if (combined.includes('linkedin')) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-[#0A66C2] shadow-xs flex items-center justify-center p-1 shrink-0 ${className}`}
        title="LinkedIn"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </div>
    );
  }

  // 19. Try dynamic official high-res favicon for any specific domain
  if (domain && !imgError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-white shadow-xs border border-slate-200/80 p-0.5 overflow-hidden flex items-center justify-center shrink-0 ${className}`}
        title={platformName || domain}
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
          alt={platformName || domain}
          className="w-full h-full object-contain rounded-lg block"
          onError={() => setImgError(true)}
          loading="eager"
        />
      </div>
    );
  }

  // 20. Verified Default Shield Emblem
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-xs flex items-center justify-center p-1.5 shrink-0 ${className}`}
      title={platformName || 'Official Service'}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-white stroke-2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </div>
  );
};
