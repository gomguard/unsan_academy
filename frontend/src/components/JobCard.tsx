import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, X } from 'lucide-react';
import type { JobCard as JobCardType } from '@/types';
import { trackInfo, rankInfo } from '@/types';
import { cn } from '@/lib/utils';

interface JobCardProps {
  card: JobCardType;
  isUnlocked?: boolean;
  onClick?: () => void;
}

export function JobCard({ card, isUnlocked = false, onClick }: JobCardProps) {
  const track = trackInfo[card.track];
  const rank = rankInfo[card.rank];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative cursor-pointer rounded-2xl overflow-hidden',
        'bg-white border shadow-sm hover:shadow-md transition-shadow',
        'aspect-[3/4] min-h-[180px]',
        isUnlocked ? 'border-slate-200' : 'border-slate-100'
      )}
    >
      {/* Colored top bar */}
      <div
        className="h-1.5"
        style={{
          backgroundColor: isUnlocked ? card.color : '#e5e7eb',
        }}
      />

      <div className="p-4 h-full flex flex-col">
        {/* Status badge */}
        <div className="flex justify-between items-start mb-2">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${track.color}15`, color: track.color }}
          >
            {track.name}
          </span>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              획득
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" />
              잠금
            </span>
          )}
        </div>

        {/* Card icon */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
              isUnlocked ? 'bg-slate-50' : 'bg-slate-100 grayscale opacity-50'
            )}
          >
            {card.icon || track.icon}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mt-auto">
          <h3
            className={cn(
              'font-bold text-sm',
              isUnlocked ? 'text-slate-900' : 'text-slate-400'
            )}
          >
            {card.koreanTitle || card.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Lv.{card.rank} {rank.koreanName}
          </p>
        </div>

        {/* Requirements for locked cards */}
        {!isUnlocked && card.requiredStats && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {Object.entries(card.requiredStats).map(([stat, value]) => (
              <span
                key={stat}
                className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500"
              >
                {stat} {value}+
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface JobCardDetailModalProps {
  card: JobCardType | null;
  isUnlocked?: boolean;
  onClose: () => void;
}

export function JobCardDetailModal({ card, isUnlocked = false, onClose }: JobCardDetailModalProps) {
  if (!card) return null;

  const track = trackInfo[card.track];
  const rank = rankInfo[card.rank];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Colored header */}
          <div
            className="h-2"
            style={{ backgroundColor: isUnlocked ? card.color : '#e5e7eb' }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl',
                  isUnlocked ? 'bg-slate-50' : 'bg-slate-100 grayscale'
                )}
              >
                {card.icon || track.icon}
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="font-bold text-xl text-slate-900">{card.koreanTitle || card.title}</h2>
              <p className="text-sm text-slate-500">
                {track.name} · Lv.{card.rank} {rank.koreanName}
              </p>
            </div>

            {/* Description */}
            <p className="text-center text-slate-600 text-sm mb-6">
              {card.description}
            </p>

            {/* Requirements */}
            {card.requiredStats && (
              <div className="mb-6">
                <p className="text-center text-xs text-slate-400 mb-2">
                  {isUnlocked ? '획득 조건' : '해금 조건'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.entries(card.requiredStats).map(([stat, value]) => (
                    <span
                      key={stat}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium',
                        isUnlocked
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {stat} Lv.{Math.floor((value as number) / 10)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="text-center">
              {isUnlocked ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  획득 완료
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-500 font-medium">
                  <Lock className="w-4 h-4" />
                  잠금 상태
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
