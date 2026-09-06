import React from 'react';
import { X } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';
import { RestaurantConfig } from '../types';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  pinInput: string;
  setPinInput: (v: string) => void;
  pinError: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PinModal({
  isOpen, onClose, config, pinInput, setPinInput, pinError, onSubmit
}: PinModalProps) {
  if (!isOpen) return null;
  const theme = getThemeClasses(config.themeColor);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-zinc-700/50 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Manager Access</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6">
          Enter the 4-digit PIN to access restaurant settings.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.substring(0, 4))}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border rounded-xl text-center text-xl tracking-[0.5em] font-mono outline-none transition-colors ${
                pinError 
                  ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' 
                  : 'border-gray-200 dark:border-zinc-700 focus:border-amber-500 dark:focus:border-amber-500 text-gray-900 dark:text-white'
              }`}
              placeholder="••••"
              autoFocus
            />
            {pinError && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-2 text-center">
                Incorrect PIN. (Try 1234)
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer ${theme.primary} ${theme.buttonText} ${theme.hover}`}
          >
            Unlock Settings
          </button>
        </form>
      </div>
    </div>
  );
}
