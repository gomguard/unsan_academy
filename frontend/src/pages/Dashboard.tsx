import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { StatRadarChart, StatBar } from '@/components/StatRadarChart';
import { TierBadge, TierProgress } from '@/components/TierBadge';
import type { StatType } from '@/types';
import { Trophy, Target, Briefcase, ChevronRight, ArrowLeft, Zap, Flame } from 'lucide-react';

export function Dashboard() {
  const { profile, jobCards } = useStore();

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const unlockedCount = profile.unlockedCardIds.length;

  const quickLinks = [
    { to: '/cards', icon: Trophy, label: '🏆 커리어 맵', desc: `${unlockedCount}/${jobCards.length} 카드`, color: 'yellow' },
    { to: '/tasks', icon: Target, label: '🎯 일일 미션', desc: '오늘의 도전', color: 'cyan' },
    { to: '/jobs', icon: Briefcase, label: '📋 Job Library', desc: '88개 직업', color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark/80 backdrop-blur-md border-b border-dark-hover">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">홈</span>
          </Link>
          <h1 className="font-bold text-white">My Dashboard</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24 relative">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-dark-100 rounded-2xl flex items-center justify-center text-3xl border border-dark-hover">
              👨‍🔧
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <TierBadge tier={profile.tier} />
                <span className="text-sm text-slate-400">
                  {profile.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
            <Flame className="w-6 h-6 text-pop-orange" />
          </div>

          {/* Tier Progress */}
          <TierProgress
            currentXp={profile.xp}
            currentTierXp={profile.current_tier_xp}
            nextTierXp={profile.next_tier_xp}
            tier={profile.tier}
          />
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-3"
        >
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="card p-4 flex items-center gap-4 hover:border-pop-yellow/30 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  link.color === 'yellow' ? 'bg-pop-yellow/20' :
                  link.color === 'cyan' ? 'bg-pop-cyan/20' :
                  'bg-pop-pink/20'
                }`}
              >
                <link.icon
                  className={`w-6 h-6 ${
                    link.color === 'yellow' ? 'text-pop-yellow' :
                    link.color === 'cyan' ? 'text-pop-cyan' :
                    'text-pop-pink'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{link.label}</h3>
                <p className="text-sm text-slate-500">{link.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </Link>
          ))}
        </motion.div>

        {/* Penta-Stat Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-pop-cyan" />
                Penta-Stat
              </h3>
              <p className="text-sm text-slate-500">나의 5대 핵심 역량</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-pop-yellow">
                {Object.values(profile.stats).reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-xs text-slate-500">총 스탯</p>
            </div>
          </div>
          <StatRadarChart stats={profile.stats} />
        </motion.div>

        {/* Stat Bars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4 space-y-4"
        >
          <h3 className="font-bold text-white">📊 스탯 상세</h3>
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
      </div>
    </div>
  );
}
