import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, X } from 'lucide-react';
import type { JobCard as JobCardType, StatType } from '@/types';
import { cn } from '@/lib/utils';

interface JobCardProps {
  card: JobCardType;
  onClick?: () => void;
}

const cardEmojis: Record<string, string> = {
  'The Flipper': '🔄',
  'The EV Tuner': '⚡',
  'The Fleet Commander': '🚛',
  'The Diagnoser': '🔍',
  'The Detailer': '✨',
  'The Speedster': '🏎️',
};

export function JobCard({ card, onClick }: JobCardProps) {
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
        card.is_unlocked ? 'border-gray-200' : 'border-gray-100'
      )}
    >
      {/* Colored top bar */}
      <div
        className="h-1.5"
        style={{
          backgroundColor: card.is_unlocked ? card.color_primary : '#e5e7eb',
        }}
      />

      <div className="p-4 h-full flex flex-col">
        {/* Status badge */}
        <div className="flex justify-end mb-2">
          {card.is_unlocked ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              획득
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
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
              card.is_unlocked ? 'bg-gray-50' : 'bg-gray-100 grayscale opacity-50'
            )}
          >
            {cardEmojis[card.title] || '🏆'}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mt-auto">
          <h3
            className={cn(
              'font-bold text-sm',
              card.is_unlocked ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            {card.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{card.subtitle}</p>
        </div>

        {/* Requirements for locked cards */}
        {!card.is_unlocked && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {Object.entries(card.requirements).map(([stat, value]) => (
              <span
                key={stat}
                className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500"
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
  onClose: () => void;
}

export function JobCardDetailModal({ card, onClose }: JobCardDetailModalProps) {
  if (!card) return null;

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
            style={{ backgroundColor: card.is_unlocked ? card.color_primary : '#e5e7eb' }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl',
                  card.is_unlocked ? 'bg-gray-50' : 'bg-gray-100 grayscale'
                )}
              >
                {cardEmojis[card.title] || '🏆'}
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="font-bold text-xl text-gray-900">{card.title}</h2>
              <p className="text-sm text-gray-500">{card.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-center text-gray-600 text-sm mb-6">
              {card.description}
            </p>

            {/* Requirements */}
            <div className="mb-6">
              <p className="text-center text-xs text-gray-400 mb-2">
                {card.is_unlocked ? '획득 조건' : '해금 조건'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(card.requirements).map(([stat, value]) => (
                  <span
                    key={stat}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium',
                      card.is_unlocked
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {stat} Lv.{Math.floor((value as number) / 10)}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="text-center">
              {card.is_unlocked ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  획득 완료
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 font-medium">
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
