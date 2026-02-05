import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { SkillTree } from '@/components/SkillTree';
import { Trophy, CheckCircle, Lock } from 'lucide-react';

export function Cards() {
  const { jobCards, profile } = useStore();

  if (!profile) return null;

  const unlockedCount = profile.unlockedCardIds.length;
  const totalCount = jobCards.length;
  const legendCount = jobCards.filter(c => c.track === 'Hybrid').length;
  const unlockedLegends = jobCards.filter(c => c.track === 'Hybrid' && profile.unlockedCardIds.includes(c.id)).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4"
      >
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">운산 커리어 맵</h1>
        <p className="text-sm text-gray-500 mt-1">
          스킬을 쌓아 전문가로 성장하세요
        </p>
      </motion.div>

      {/* Progress Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500">획득 카드</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-gray-900">{unlockedCount}</span>
            <span className="text-sm text-gray-400 mb-1">/ {totalCount}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              className="h-full rounded-full bg-green-500"
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">⭐</span>
            <span className="text-sm text-gray-500">레전드</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-amber-500">{unlockedLegends}</span>
            <span className="text-sm text-gray-400 mb-1">/ {legendCount}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedLegends / legendCount) * 100}%` }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Skill Tree */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4"
      >
        <SkillTree />
      </motion.div>
    </div>
  );
}
