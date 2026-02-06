import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { TaskList } from '@/components/TaskList';
import {
  Target,
  Gift,
  CheckCircle,
  Flame,
  Trophy,
  Sparkles,
} from 'lucide-react';

export function Tasks() {
  const { dailyTasks, profile } = useStore();

  const completedCount = dailyTasks.filter((t) => t.is_completed_today).length;
  const totalCount = dailyTasks.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Calculate streak (mock for now)
  const streak = 3;

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">일일 미션</h1>
                <p className="text-sm text-slate-400">SOP 기반 성장 퀘스트</p>
              </div>
            </div>
            {/* Streak badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{streak}일</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white">오늘의 진행률</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{completedCount}</span>
              <span className="text-slate-500">/ {totalCount}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                allCompleted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
            />
          </div>

          {/* Progress labels */}
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>시작</span>
            <span>{Math.round(progress)}% 완료</span>
            <span>목표</span>
          </div>
        </motion.div>

        {/* Bonus Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: allCompleted ? 1 : 1.02 }}
          className={`rounded-2xl p-5 border-2 transition-all ${
            allCompleted
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/50'
              : 'bg-slate-800 border-slate-700 hover:border-yellow-500/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={allCompleted ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: allCompleted ? Infinity : 0, repeatDelay: 2 }}
              className={`p-4 rounded-2xl ${
                allCompleted
                  ? 'bg-green-500/30'
                  : 'bg-yellow-500/20'
              }`}
            >
              {allCompleted ? (
                <Trophy className="w-8 h-8 text-green-400" />
              ) : (
                <Gift className="w-8 h-8 text-yellow-400" />
              )}
            </motion.div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">
                {allCompleted ? '🎉 일일 보너스 획득!' : '일일 보너스'}
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                {allCompleted
                  ? '모든 미션을 완료했습니다!'
                  : `${totalCount - completedCount}개 미션을 더 완료하세요`}
              </p>
            </div>
            <div className="text-right">
              <motion.div
                animate={allCompleted ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: allCompleted ? Infinity : 0, repeatDelay: 2 }}
                className={`text-2xl font-bold ${
                  allCompleted ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                +50
              </motion.div>
              <div className="text-xs text-slate-500">보너스 XP</div>
            </div>
          </div>

          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-green-500/30"
            >
              <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>내일도 연속 완료하면 보너스 2배!</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Section divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <Target className="w-4 h-4" />
            미션 목록
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        {/* Task List */}
        <TaskList tasks={dailyTasks} />

        {/* Empty state */}
        {totalCount === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">📋</div>
            <p className="text-slate-400">등록된 미션이 없습니다</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
