import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Camera,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import type { Task, StatType } from '@/types';
import { useStore } from '@/store/useStore';
import { simulateCompleteTask } from '@/lib/mockData';
import { statColors, statLightBgColors, cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: number) => Promise<void>;
}

function TaskItem({ task, onComplete }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (task.is_completed_today || isLoading) return;
    setIsLoading(true);
    try {
      await onComplete(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl overflow-hidden border transition-colors',
        task.is_completed_today
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      <div
        className="p-4 flex items-center gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Status icon */}
        <div className="flex-shrink-0">
          {task.is_completed_today ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300" />
          )}
        </div>

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-medium text-sm',
              task.is_completed_today ? 'text-green-700' : 'text-gray-900'
            )}
          >
            {task.title}
          </h4>
          <div className="flex items-center gap-2 text-xs mt-0.5">
            <span
              className={cn(
                'px-1.5 py-0.5 rounded font-medium',
                statLightBgColors[task.stat_type]
              )}
              style={{ color: statColors[task.stat_type] }}
            >
              +{task.stat_reward} {task.stat_type}
            </span>
            <span className="text-gray-400">
              +{task.xp_reward} XP
            </span>
          </div>
        </div>

        {/* Expand icon */}
        <div className="flex items-center gap-2">
          {task.requires_photo && !task.is_completed_today && (
            <Camera className="w-4 h-4 text-gray-400" />
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3">
              <p className="text-sm text-gray-500">{task.description}</p>

              {!task.is_completed_today && (
                <div className="flex gap-2">
                  {task.requires_photo && (
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComplete();
                      }}
                    >
                      <Camera className="w-4 h-4" />
                      사진 업로드
                    </button>
                  )}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    완료하기
                  </button>
                </div>
              )}

              {task.is_completed_today && (
                <p className="text-center text-sm text-green-600 font-medium py-2">
                  ✓ 오늘 완료됨
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const { profile, completeTask, addToast } = useStore();

  const handleCompleteTask = async (taskId: number) => {
    if (!profile) return;

    try {
      const result = await simulateCompleteTask(taskId, profile);

      completeTask(taskId, {
        stat_type: result.stat_updated as StatType,
        stat_change: result.stat_change,
        new_value: result.new_value,
        xp_gained: result.xp_gained,
        total_xp: result.total_xp,
        tier: result.tier as any,
        newly_unlocked_cards: result.newly_unlocked_cards,
      });

      addToast({
        message: '미션 완료!',
        type: 'success',
        statType: result.stat_updated as StatType,
        statChange: result.stat_change,
      });

      if (result.newly_unlocked_cards.length > 0) {
        setTimeout(() => {
          addToast({
            message: `새로운 카드 획득: ${result.newly_unlocked_cards[0]}`,
            type: 'success',
          });
        }, 500);
      }
    } catch (error) {
      addToast({
        message: '오류가 발생했습니다',
        type: 'error',
      });
    }
  };

  const pendingTasks = tasks.filter((t) => !t.is_completed_today);
  const completedTasks = tasks.filter((t) => t.is_completed_today);

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-900">오늘의 미션</span>
        <span className="text-gray-500">
          {completedTasks.length} / {tasks.length} 완료
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${(completedTasks.length / tasks.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
          className="h-full bg-green-500 rounded-full"
        />
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {pendingTasks.map((task) => (
          <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
        ))}
        {completedTasks.map((task) => (
          <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
        ))}
      </div>
    </div>
  );
}
