import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { SkillTree } from '@/components/SkillTree';
import { PageHeader } from '@/components';
import { Trophy, CheckCircle, Star } from 'lucide-react';

export function Cards() {
  const { jobCards, profile } = useStore();

  if (!profile) return null;

  const unlockedCount = profile.unlockedCardIds.length;
  const totalCount = jobCards.length;
  const legendCount = jobCards.filter(c => c.track === 'Hybrid').length;
  const unlockedLegends = jobCards.filter(c => c.track === 'Hybrid' && profile.unlockedCardIds.includes(c.id)).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <PageHeader
        title="커리어 맵"
        subtitle="스킬을 쌓아 전문가로 성장하세요"
        icon={<Trophy className="w-5 h-5 text-amber-600" />}
        backTo="/dashboard"
      />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Progress Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-500">획득 카드</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-slate-900">{unlockedCount}</span>
              <span className="text-sm text-slate-400 mb-1">/ {totalCount}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                className="h-full rounded-full bg-green-500"
              />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-slate-500">레전드</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-amber-500">{unlockedLegends}</span>
              <span className="text-sm text-slate-400 mb-1">/ {legendCount}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${legendCount > 0 ? (unlockedLegends / legendCount) * 100 : 0}%` }}
                className="h-full rounded-full bg-amber-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Skill Tree */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="text-center mb-4">
            <h3 className="font-bold text-slate-900">스킬 트리</h3>
            <p className="text-sm text-slate-500">카드를 클릭하여 상세 정보를 확인하세요</p>
          </div>
          <SkillTree />
        </motion.div>
      </div>
    </div>
  );
}
