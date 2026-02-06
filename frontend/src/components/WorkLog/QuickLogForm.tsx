import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Check } from 'lucide-react';

const taskTypes = [
  { id: 'oil', label: '오일 교환', emoji: '🛢️' },
  { id: 'tire', label: '타이어 교체', emoji: '🔧' },
  { id: 'brake', label: '브레이크 점검', emoji: '🛑' },
  { id: 'diag', label: '진단', emoji: '🔍' },
  { id: 'filter', label: '필터 교환', emoji: '🌬️' },
  { id: 'battery', label: '배터리', emoji: '🔋' },
  { id: 'other', label: '기타', emoji: '📝' },
];

interface QuickLogFormProps {
  onSubmit: (log: { vin: string; taskType: string; notes?: string }) => void;
}

export function QuickLogForm({ onSubmit }: QuickLogFormProps) {
  const [vin, setVin] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!vin || !selectedTask) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit({
      vin,
      taskType: selectedTask,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    setVin('');
    setSelectedTask(null);

    setTimeout(() => setShowSuccess(false), 2000);
  };

  const isValid = vin.length === 4 && selectedTask;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
          <Zap className="w-4 h-4 text-cyan-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Quick Log</h3>
          <p className="text-xs text-gray-500">빠른 작업 기록</p>
        </div>
      </div>

      {/* VIN Input */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">차량 VIN (뒤 4자리)</label>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value.slice(0, 4).toUpperCase())}
          placeholder="1234"
          maxLength={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-center text-2xl font-mono tracking-widest focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all"
        />
      </div>

      {/* Task Type Selection */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">작업 유형</label>
        <div className="grid grid-cols-4 gap-2">
          {taskTypes.map(task => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                selectedTask === task.id
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-xl">{task.emoji}</span>
              <span className={`text-xs ${selectedTask === task.id ? 'text-cyan-600 font-medium' : 'text-gray-500'}`}>
                {task.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          isValid
            ? 'bg-cyan-500 text-white hover:bg-cyan-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {showSuccess ? (
          <>
            <Check className="w-5 h-5" />
            기록 완료!
          </>
        ) : isSubmitting ? (
          '기록 중...'
        ) : (
          <>
            <Plus className="w-5 h-5" />
            로그 기록
          </>
        )}
      </motion.button>
    </div>
  );
}
