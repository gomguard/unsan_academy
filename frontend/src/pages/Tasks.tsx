import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { TaskList } from '@/components/TaskList';
import { PageHeader } from '@/components';
import { Target, Gift, CheckCircle, Clock } from 'lucide-react';

export function Tasks() {
  const { dailyTasks } = useStore();

  const completedCount = dailyTasks.filter((t) => t.is_completed_today).length;
  const totalCount = dailyTasks.length;
  const allCompleted = completedCount === totalCount;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <PageHeader
        title="일일 미션"
        subtitle="미션을 완료하고 스탯을 올리세요"
        icon={<Target className="w-5 h-5 text-blue-600" />}
        backTo="/dashboard"
      />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">오늘의 진행률</span>
            </div>
            <span className="font-bold text-slate-900">
              {completedCount} / {totalCount}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-full rounded-full ${
                allCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
            />
          </div>
        </motion.div>

        {/* Bonus Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`card p-4 border-2 transition-colors ${
            allCompleted
              ? 'bg-green-50 border-green-300'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              allCompleted ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              {allCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Gift className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                {allCompleted ? '보너스 획득!' : '오늘의 보너스'}
              </h3>
              <p className="text-sm text-slate-500">
                {allCompleted
                  ? '모든 미션을 완료했습니다!'
                  : `${totalCount - completedCount}개 미션 남음`}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${
                allCompleted ? 'text-green-600' : 'text-amber-500'
              }`}>
                +50
              </div>
              <div className="text-xs text-slate-400">XP</div>
            </div>
          </div>
        </motion.div>

        {/* Mission Label */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm font-medium text-slate-500">SOP 미션</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
        >
          <TaskList tasks={dailyTasks} />
        </motion.div>
      </div>
    </div>
  );
}
