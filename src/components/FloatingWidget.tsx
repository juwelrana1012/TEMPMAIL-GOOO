import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  X,
  Copy,
  Check,
  RefreshCw,
  Key,
  Mail,
  Fingerprint,
  ChevronLeft,
} from 'lucide-react';
import { TempEmailAccount } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { sounds } from '../utils/audio';

interface FloatingWidgetProps {
  isVisible: boolean;
  account: TempEmailAccount;
  onNewGmail: () => Promise<void>;
  onRefreshInbox: () => Promise<void>;
  onClose: () => void;
  onRecordCopiedEmail: (email: string) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  isVisible,
  account,
  onNewGmail,
  onRefreshInbox,
  onClose,
  onRecordCopiedEmail,
  onTriggerToast,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<'email' | 'otp' | 'fingerprint' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);

  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 20, y: 140 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initPosX: number; initPosY: number }>({
    startX: 0,
    startY: 0,
    initPosX: 0,
    initPosY: 0,
  });
  const hasMovedRef = useRef<boolean>(false);

  if (!isVisible) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPosX: position.x,
      initPosY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }
    const maxX = Math.max(10, window.innerWidth - (isExpanded ? 310 : 64));
    const maxY = Math.max(10, window.innerHeight - (isExpanded ? 190 : 64));

    setPosition({
      x: Math.min(Math.max(10, dragStartRef.current.initPosX + dx), maxX),
      y: Math.min(Math.max(10, dragStartRef.current.initPosY + dy), maxY),
    });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleCopyEmail = async () => {
    if (hasMovedRef.current) return;
    sounds.playClick();
    const ok = await copyToClipboard(account.address);
    if (ok) {
      sounds.playSuccessChime();
      setCopiedType('email');
      onRecordCopiedEmail(account.address);
      onTriggerToast(`Copied: ${account.address}`, 'success');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleCopyOtp = async () => {
    if (hasMovedRef.current) return;
    if (!account.latestCode) {
      sounds.playClick();
      onTriggerToast('No verification code received yet', 'info');
      return;
    }
    sounds.playClick();
    const ok = await copyToClipboard(account.latestCode);
    if (ok) {
      sounds.playSuccessChime();
      setCopiedType('otp');
      onTriggerToast(`Code Copied: ${account.latestCode}`, 'code');
      setTimeout(() => setCopiedType(null), 1500);
    }
  };

  const handleFingerprintAction = async () => {
    if (hasMovedRef.current) return;
    sounds.playClick();
    if (account.latestCode) {
      const ok = await copyToClipboard(account.latestCode);
      if (ok) {
        sounds.playSuccessChime();
        setCopiedType('fingerprint');
        onTriggerToast(`Code Copied: ${account.latestCode}`, 'code');
        setTimeout(() => setCopiedType(null), 1500);
      }
    } else {
      const ok = await copyToClipboard(account.address);
      if (ok) {
        sounds.playSuccessChime();
        setCopiedType('fingerprint');
        onRecordCopiedEmail(account.address);
        onTriggerToast(`Copied: ${account.address}`, 'success');
        setTimeout(() => setCopiedType(null), 1500);
      }
    }
  };

  const handleRefreshOrNew = async () => {
    if (hasMovedRef.current) return;
    sounds.playClick();
    setIsRefreshing(true);
    try {
      await onRefreshInbox();
      onTriggerToast('Inbox refreshed', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateNew = async () => {
    if (hasMovedRef.current) return;
    sounds.playClick();
    setIsChangingEmail(true);
    try {
      await onNewGmail();
      onTriggerToast('New email generated', 'success');
    } finally {
      setIsChangingEmail(false);
    }
  };

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed z-40 select-none"
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed-plus"
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (!hasMovedRef.current) {
                sounds.playClick();
                setIsExpanded(true);
              }
            }}
            title="Open Quick Actions"
            className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2F69F8] via-[#743FFA] to-[#AF1AFC] text-white shadow-xl shadow-[#0A0A2C]/20 flex items-center justify-center border border-white/40 ring-4 ring-[#6750F9]/20 active:scale-95 transition-transform cursor-grab active:cursor-grabbing"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            {account.latestCode && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#2F69F8] border-2 border-white animate-pulse" />
            )}
          </motion.button>
        ) : (
          <motion.div
            key="expanded-action-bar"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl shadow-[#0A0A2C]/15 p-2.5 text-[#0A0A2C]"
          >
            {/* Action Bar Icon Row */}
            <div className="flex items-center justify-between gap-1 p-1 bg-slate-50 border border-slate-200/80 rounded-xl cursor-grab active:cursor-grabbing">
              {/* 1. Collapse (<) button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsExpanded(false);
                }}
                title="Collapse"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>

              {/* 2. Mail Icon button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy Address"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  copiedType === 'email'
                    ? 'bg-[#2F69F8] text-white shadow-xs'
                    : 'text-[#6750F9] hover:bg-white'
                }`}
              >
                {copiedType === 'email' ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Mail className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>

              {/* 3. Key Icon button */}
              <button
                type="button"
                onClick={handleCopyOtp}
                title={account.latestCode ? `Copy Code: ${account.latestCode}` : 'No code yet'}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  copiedType === 'otp'
                    ? 'bg-[#743FFA] text-white shadow-xs'
                    : account.latestCode
                    ? 'text-[#743FFA] hover:bg-white ring-1 ring-[#743FFA]/30 bg-[#743FFA]/10'
                    : 'text-slate-400 hover:bg-white'
                }`}
              >
                {copiedType === 'otp' ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Key className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>

              {/* 4. Fingerprint button */}
              <button
                type="button"
                onClick={handleFingerprintAction}
                title="Quick Copy"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  copiedType === 'fingerprint'
                    ? 'bg-[#AF1AFC] text-white shadow-xs'
                    : 'text-[#AF1AFC] hover:bg-white'
                }`}
              >
                {copiedType === 'fingerprint' ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Fingerprint className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>

              {/* 5. Refresh button */}
              <button
                type="button"
                disabled={isRefreshing || isChangingEmail}
                onClick={handleRefreshOrNew}
                title="Refresh Inbox"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#2F69F8] hover:bg-white transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing || isChangingEmail ? 'animate-spin' : ''}`}
                />
              </button>

              {/* 6. Close (X) button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                title="Close"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Quick Details */}
            <div className="mt-2 space-y-1.5 px-0.5">
              <div
                onClick={handleCopyEmail}
                className="cursor-pointer p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-2 transition-colors"
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <div className="w-2 h-2 rounded-full bg-[#2F69F8] shrink-0" />
                  <span className="text-xs font-normal-typing font-normal text-[#0A0A2C] truncate select-all">
                    {account.address}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
                  {copiedType === 'email' ? 'Copied' : 'Copy'}
                </span>
              </div>

              <div
                onClick={handleCopyOtp}
                className="cursor-pointer p-2 rounded-xl bg-[#6750F9]/5 hover:bg-[#6750F9]/10 border border-[#6750F9]/20 flex items-center justify-between gap-2 transition-colors"
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <Key className="w-3.5 h-3.5 text-[#6750F9] shrink-0" />
                  <span className="text-xs font-semibold text-[#0A0A2C]">
                    Code:
                  </span>
                  <span className="font-mono text-xs font-black bg-gradient-to-r from-[#2F69F8] to-[#AF1AFC] bg-clip-text text-transparent tracking-wider">
                    {account.latestCode || 'Waiting for code...'}
                  </span>
                </div>
                {account.latestCode && (
                  <span className="text-[10px] font-bold text-[#6750F9] bg-white border border-[#6750F9]/30 px-2 py-0.5 rounded-md shrink-0">
                    {copiedType === 'otp' ? 'Copied' : 'Copy'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-0.5 px-1 text-[11px] text-slate-500 font-semibold">
                <span className="truncate">{account.provider}</span>
                <button
                  type="button"
                  onClick={handleGenerateNew}
                  disabled={isChangingEmail}
                  className="font-bold text-[#6750F9] hover:text-[#743FFA] disabled:opacity-50 transition-colors"
                >
                  {isChangingEmail ? 'Generating...' : '+ New Address'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
