import { Link } from 'react-router-dom';
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
  Briefcase,
} from 'lucide-react';

export function Profile() {
  const { profile, jobCards } = useStore();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const unlockedCards = profile.unlockedCardIds.length;

  const stats = [
    { label: '경험치', value: profile.xp.toLocaleString(), icon: TrendingUp, color: 'blue' },
    { label: '카드', value: `${unlockedCards}/${jobCards.length}`, icon: Award, color: 'amber' },
    { label: '가입', value: '2024.01', icon: Calendar, color: 'slate' },
  ];

  const allTiers: TierType[] = ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentTierIndex = allTiers.indexOf(profile.tier);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <PageHeader
        title="내 프로필"
        subtitle="성장 기록을 확인하세요"
        icon={<User className="w-5 h-5 text-slate-600" />}
        backTo="/dashboard"
      />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 text-center"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👨‍🔧</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {profile.name}
          </h2>
          <TierBadge tier={profile.tier} size="lg" />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'amber' ? 'text-amber-500' :
                  'text-slate-400'
                }`} />
                <div className="font-bold text-slate-900">{stat.value}</div>
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
          className="card p-4"
        >
          <h3 className="font-bold text-slate-900 mb-4">티어 여정</h3>
          <div className="flex justify-between items-center">
            {allTiers.map((tier, index) => (
              <div key={tier} className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    border-2 transition-all
                    ${index <= currentTierIndex
                      ? 'bg-white'
                      : 'bg-slate-100 border-slate-200'
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
          <h3 className="font-bold text-slate-900">능력치 현황</h3>
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
          <Link
            to="/jobs"
            className="w-full card p-4 flex items-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Briefcase className="w-5 h-5 text-purple-500" />
            <span className="flex-1 text-left text-slate-900">Job Library</span>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </Link>
          <button className="w-full card p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
            <span className="flex-1 text-left text-slate-900">설정</span>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
          <button className="w-full card p-4 flex items-center gap-3 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="flex-1 text-left text-red-600">로그아웃</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
