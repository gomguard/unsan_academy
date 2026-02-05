import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { StatRadarChart, StatBar } from '@/components/StatRadarChart';
import { TierBadge, TierProgress } from '@/components/TierBadge';
import type { StatType } from '@/types';
import { Trophy, Target, GitBranch, ChevronRight, Zap, Flame } from 'lucide-react';

export function Dashboard() {
  const { profile, jobCards } = useStore();

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const unlockedCount = profile.unlockedCardIds.length;

  const quickLinks = [
    { to: '/cards', icon: Trophy, label: '🏆 커리어 맵', desc: `${unlockedCount}/${jobCards.length} 카드`, color: 'yellow' },
    { to: '/skill-tree', icon: GitBranch, label: '🌳 스킬 트리', desc: '88개 직업 경로', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="font-bold text-white">Unsan Academy</span>
          </div>
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24 relative">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center text-3xl border border-slate-600">
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
            <Flame className="w-6 h-6 text-orange-400" />
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
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-yellow-400/30 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  link.color === 'yellow' ? 'bg-yellow-400/20' :
                  link.color === 'cyan' ? 'bg-cyan-400/20' :
                  link.color === 'purple' ? 'bg-purple-400/20' :
                  'bg-pink-400/20'
                }`}
              >
                <link.icon
                  className={`w-6 h-6 ${
                    link.color === 'yellow' ? 'text-yellow-400' :
                    link.color === 'cyan' ? 'text-cyan-400' :
                    link.color === 'purple' ? 'text-purple-400' :
                    'text-pink-400'
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
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Penta-Stat
              </h3>
              <p className="text-sm text-slate-500">나의 5대 핵심 역량</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">
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
          className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-4"
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
