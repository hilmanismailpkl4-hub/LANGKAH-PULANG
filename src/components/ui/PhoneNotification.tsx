import React, { useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

export const PhoneNotification: React.FC = () => {
  const phoneMessage = useGameStore((s) => s.phoneMessage);
  const dismissPhoneMessage = useGameStore((s) => s.dismissPhoneMessage);

  useEffect(() => {
    if (!phoneMessage) return;
    const t = window.setTimeout(() => {
      dismissPhoneMessage();
    }, 9500);
    return () => window.clearTimeout(t);
  }, [phoneMessage, dismissPhoneMessage]);

  if (!phoneMessage) return null;

  return (
    <Portal>
      <div className="fixed right-5 top-28 z-[9994] w-80 animate-fadeIn">
        <div className="rounded-2xl border border-warm-200/25 bg-dusk-900/92 p-4 text-warm-50 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-400/20 text-warm-300">
                <MessageCircle className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-warm-100">{phoneMessage.sender}</p>
                <p className="text-[10px] text-warm-200/55">Pesan Masuk · {phoneMessage.timeLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissPhoneMessage}
              className="rounded-md p-1 text-warm-200/50 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-warm-100/85">"{phoneMessage.preview}"</p>
        </div>
      </div>
    </Portal>
  );
};
