import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { statColors } from '@/lib/utils';
import type { StatType } from '@/types';

interface ToastItemProps {
  message: string;
  type: 'success' | 'error' | 'info';
  statType?: StatType;
  statChange?: number;
  onClose: () => void;
}

function ToastItem({ message, type, statType, statChange, onClose }: ToastItemProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-xl border shadow-lg
        bg-white min-w-[280px] max-w-[90vw]
      `}
    >
      {icons[type]}
      <div className="flex-1">
        <p className="text-gray-900 font-medium text-sm">{message}</p>
        {statType && statChange && (
          <p className="text-xs mt-0.5" style={{ color: statColors[statType] }}>
            +{statChange} {statType}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
