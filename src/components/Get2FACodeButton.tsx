import React from 'react';
import { FingerHoldTotp } from './FingerHoldTotp';

interface Get2FACodeButtonProps {
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
}

export const Get2FACodeButton: React.FC<Get2FACodeButtonProps> = ({
  onTriggerToast,
}) => {
  return <FingerHoldTotp onTriggerToast={onTriggerToast} />;
};

export { FingerHoldTotp };
