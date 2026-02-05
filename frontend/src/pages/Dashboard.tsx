import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { StatRadarChart, StatBar } from '@/components/StatRadarChart';
import { TierBadge, TierProgress } from '@/components/TierBadge';
import type { StatType } from '@/types';

export function Dashboard() {
  const { profile } = useStore();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4"
      >
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">👨‍🔧</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {profile.name}
        </h1>
        <TierBadge tier={profile.tier} />
      </motion.div>

      {/* Tier Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4"
      >
        <TierProgress
          currentXp={profile.xp}
          currentTierXp={profile.current_tier_xp}
          nextTierXp={profile.next_tier_xp}
          tier={profile.tier}
        />
      </motion.div>

      {/* Penta-Stat Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-center font-semibold text-gray-900 mb-2">
          Penta-Stat
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          나의 5대 핵심 역량
        </p>
        <StatRadarChart stats={profile.stats} />
      </motion.div>

      {/* Stat Bars */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4 space-y-4"
      >
        <h3 className="font-semibold text-gray-900">스탯 상세</h3>
        {(Object.keys(profile.stats) as StatType[]).map((stat, index) => (
          <motion.div
            key={stat}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <StatBar statType={stat} value={profile.stats[stat]} />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary-600">
            {profile.xp}
          </div>
          <div className="text-sm text-gray-500 mt-1">총 경험치</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">
            {Object.values(profile.stats).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">총 스탯</div>
        </div>
      </motion.div>
    </div>
  );
}
