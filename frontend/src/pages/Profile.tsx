import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { TierBadge } from '@/components/TierBadge';
import { StatBar } from '@/components/StatRadarChart';
import { PageHeader } from '@/components';
import { tierColors } from '@/lib/utils';
import type { StatType, TierType } from '@/types';
import {
  User,
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const unlockedCards = profile.unlockedCardIds.length;

  const stats = [
    { label: '경험치', value: profile.xp.toLocaleString(), icon: TrendingUp, color: 'cyan' },
    { label: '카드', value: `${unlockedCards}/${jobCards.length}`, icon: Award, color: 'yellow' },
    { label: '가입', value: '2024.01', icon: Calendar, color: 'slate' },
  ];

  const allTiers: TierType[] = ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentTierIndex = allTiers.indexOf(profile.tier);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <PageHeader
        title="내 프로필"
        subtitle="성장 기록을 확인하세요"
        icon={<User className="w-5 h-5 text-slate-400" />}
      />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center"
        >
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👨‍🔧</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {profile.name}
          </h2>
          <TierBadge tier={profile.tier} size="lg" />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${
                  stat.color === 'cyan' ? 'text-cyan-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  'text-slate-500'
                }`} />
                <div className="font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tier Journey */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-4"
        >
          <h3 className="font-bold text-white mb-4">티어 여정</h3>
          <div className="flex justify-between items-center">
            {allTiers.map((tier, index) => (
              <div key={tier} className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    border-2 transition-all
                    ${index <= currentTierIndex
                      ? 'bg-slate-900'
                      : 'bg-slate-700 border-slate-600'
                    }
                  `}
                  style={{
                    borderColor: index <= currentTierIndex ? tierColors[tier] : undefined,
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: index <= currentTierIndex ? tierColors[tier] : '#4b5563',
                    }}
                  />
                </div>
                <span
                  className="text-[10px] mt-1 font-medium"
                  style={{
                    color: index <= currentTierIndex ? tierColors[tier] : '#6b7280',
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
          className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4"
        >
          <h3 className="font-bold text-white">능력치 현황</h3>
          {(Object.keys(profile.stats) as StatType[]).map((stat) => (
            <StatBar key={stat} statType={stat} value={profile.stats[stat]} />
          ))}
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <button className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-3 hover:border-slate-600 transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
            <span className="flex-1 text-left text-white">설정</span>
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
          <button className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-3 hover:border-red-500/30 transition-colors">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="flex-1 text-left text-red-400">로그아웃</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
