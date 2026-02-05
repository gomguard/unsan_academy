import { motion } from 'framer-motion';
import type { TierType } from '@/types';
import { tierColors, tierBgColors, tierTextColors, cn } from '@/lib/utils';

interface TierBadgeProps {
  tier: TierType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function TierBadge({ tier, size = 'md', showLabel = true }: TierBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        sizeClasses[size],
        tierBgColors[tier],
        tierTextColors[tier]
      )}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: tierColors[tier] }}
      />
      {showLabel && tier}
    </span>
  );
}

interface TierProgressProps {
  currentXp: number;
  currentTierXp: number;
  nextTierXp: number;
  tier: TierType;
}

export function TierProgress({ currentXp, currentTierXp, nextTierXp, tier }: TierProgressProps) {
  const progress = ((currentXp - currentTierXp) / (nextTierXp - currentTierXp)) * 100;
  const color = tierColors[tier];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">다음 티어까지</span>
        <span className="font-semibold text-gray-900">
          {currentXp} / {nextTierXp} XP
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
