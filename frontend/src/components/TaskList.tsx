import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Camera,
  ChevronDown,
  Loader2,
  Zap,
  Flame,
} from 'lucide-react';
import type { Task, StatType } from '@/types';
import { useStore } from '@/store/useStore';
import { simulateCompleteTask } from '@/lib/mockData';
import { statColors, cn } from '@/lib/utils';

const statEmojis: Record<StatType, string> = {
  Diagnostic: '🧠',
  Mechanical: '🔧',
  Efficiency: '⏱️',
  Quality: '✨',
  Communication: '💬',
};

const statNames: Record<StatType, string> = {
  Diagnostic: '진단력',
  Mechanical: '정비력',
  Efficiency: '효율성',
  Quality: '품질력',
  Communication: '소통력',
};

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: number) => Promise<void>;
  index: number;
}

function TaskItem({ task, onComplete, index }: TaskItemProps) {
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'rounded-xl overflow-hidden border-2 transition-all',
        task.is_completed_today
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
      )}
    >
      <div
        className="p-4 flex items-center gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Status icon */}
        <motion.div
          className="flex-shrink-0"
          whileTap={{ scale: 0.9 }}
        >
          {task.is_completed_today ? (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center hover:border-cyan-400 transition-colors">
              <Circle className="w-4 h-4 text-slate-500" />
            </div>
          )}
        </motion.div>

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-bold text-sm',
              task.is_completed_today ? 'text-green-400 line-through' : 'text-white'
            )}
          >
            {task.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {/* Stat reward */}
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
              style={{
                backgroundColor: `${statColors[task.stat_type]}20`,
                color: statColors[task.stat_type],
              }}
            >
              {statEmojis[task.stat_type]} +{task.stat_reward}
            </span>
            {/* XP reward */}
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> +{task.xp_reward}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {task.requires_photo && !task.is_completed_today && (
            <Camera className="w-4 h-4 text-slate-500" />
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-500" />
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
              <p className="text-sm text-slate-400">{task.description}</p>

              {/* Stat info */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{statEmojis[task.stat_type]}</span>
                <span>{statNames[task.stat_type]} 스탯이 올라갑니다</span>
              </div>

              {!task.is_completed_today && (
                <div className="flex gap-2">
                  {task.requires_photo && (
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComplete();
                      }}
                    >
                      <Camera className="w-4 h-4" />
                      사진 인증
                    </button>
                  )}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 text-white text-sm font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Flame className="w-4 h-4" />
                    )}
                    완료하기
                  </button>
                </div>
              )}

              {task.is_completed_today && (
                <div className="flex items-center justify-center gap-2 py-2 text-green-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  오늘 완료!
                </div>
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
    <div className="space-y-3">
      {pendingTasks.map((task, index) => (
        <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} index={index} />
      ))}
      {completedTasks.map((task, index) => (
        <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} index={pendingTasks.length + index} />
      ))}
    </div>
  );
}
