import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { TierBadge } from '@/components/TierBadge';
import { StatBar } from '@/components/StatRadarChart';
import { tierColors } from '@/lib/utils';
import type { StatType, TierType } from '@/types';
import {
  Award,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export function Profile() {
  const { profile, jobCards } = useStore();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const unlockedCards = jobCards.filter((c) => c.is_unlocked).length;

  const stats = [
    { label: '경험치', value: profile.xp.toLocaleString(), icon: TrendingUp },
    { label: '카드', value: `${unlockedCards}/${jobCards.length}`, icon: Award },
    { label: '가입', value: '2024.01', icon: Calendar },
  ];

  const allTiers: TierType[] = ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentTierIndex = allTiers.indexOf(profile.tier);

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 text-center"
      >
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👨‍🔧</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {profile.name}
        </h1>
        <TierBadge tier={profile.tier} size="lg" />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <div className="font-semibold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tier Journey */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4"
      >
        <h3 className="font-semibold text-gray-900 mb-4">티어 여정</h3>
        <div className="flex justify-between items-center">
          {allTiers.map((tier, index) => (
            <div key={tier} className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  border-2 transition-all
                  ${index <= currentTierIndex
                    ? 'bg-white'
                    : 'bg-gray-100 border-gray-200'
                  }
                `}
                style={{
                  borderColor: index <= currentTierIndex ? tierColors[tier] : undefined,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: index <= currentTierIndex ? tierColors[tier] : '#d1d5db',
                  }}
                />
              </div>
              <span
                className="text-[10px] mt-1 font-medium"
                style={{
                  color: index <= currentTierIndex ? tierColors[tier] : '#9ca3af',
                }}
              >
                {tier.slice(0, 2)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4 space-y-4"
      >
        <h3 className="font-semibold text-gray-900">능력치 현황</h3>
        {(Object.keys(profile.stats) as StatType[]).map((stat) => (
          <StatBar key={stat} statType={stat} value={profile.stats[stat]} />
        ))}
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <button className="w-full card p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-left text-gray-900">설정</span>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
        <button className="w-full card p-4 flex items-center gap-3 hover:bg-red-50 transition-colors border-red-100">
          <LogOut className="w-5 h-5 text-red-400" />
          <span className="flex-1 text-left text-red-600">로그아웃</span>
        </button>
      </motion.div>
    </div>
  );
}
