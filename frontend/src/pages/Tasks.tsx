import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { TaskList } from '@/components/TaskList';
import { ClipboardList, Gift } from 'lucide-react';

export function Tasks() {
  const { dailyTasks } = useStore();

  const completedCount = dailyTasks.filter((t) => t.is_completed_today).length;
  const allCompleted = completedCount === dailyTasks.length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <ClipboardList className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">SOP 미션</h1>
        <p className="text-sm text-gray-500 mt-1">
          미션을 완료하고 스탯을 올리세요
        </p>
      </motion.div>

      {/* Bonus Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`card p-4 ${allCompleted ? 'bg-green-50 border-green-200' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${allCompleted ? 'bg-green-100' : 'bg-amber-100'}`}>
            <Gift className={`w-5 h-5 ${allCompleted ? 'text-green-600' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">오늘의 보너스</h3>
            <p className="text-sm text-gray-500">
              {allCompleted
                ? '모든 미션 완료! 보너스 획득!'
                : '모든 미션 완료 시 보너스 XP'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${allCompleted ? 'text-green-600' : 'text-amber-500'}`}>
              +50 XP
            </div>
          </div>
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4"
      >
        <TaskList tasks={dailyTasks} />
      </motion.div>
    </div>
  );
}
