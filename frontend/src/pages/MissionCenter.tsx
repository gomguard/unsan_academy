import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, TrendingUp, Camera, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { QuickLogForm } from '@/components/WorkLog/QuickLogForm';
import { ProVerificationForm } from '@/components/WorkLog/ProVerificationForm';
import { ActivityLog, type LogEntry } from '@/components/WorkLog/ActivityLog';

// Task type labels
const taskLabels: Record<string, string> = {
  oil: '오일 교환',
  tire: '타이어 교체',
  brake: '브레이크 점검',
  diag: '진단',
  filter: '필터 교환',
  battery: '배터리',
  other: '기타',
  brake_service: '브레이크 오버홀',
  suspension: '서스펜션 교체',
  engine_diag: '엔진 진단',
  ev_battery: 'EV 배터리 점검',
  ppf_install: 'PPF 시공',
  detailing: '프리미엄 디테일링',
};

// Mock initial entries
const mockEntries: LogEntry[] = [
  {
    id: '1',
    time: '10:32',
    taskType: 'oil',
    taskLabel: '오일 교환',
    vin: '1234',
    isVerified: true,
    hasPhoto: false,
  },
  {
    id: '2',
    time: '09:15',
    taskType: 'diag',
    taskLabel: '진단',
    vin: '5678',
    isVerified: true,
    hasPhoto: false,
  },
  {
    id: '3',
    time: '어제',
    taskType: 'tire',
    taskLabel: '타이어 교체',
    vin: '9012',
    isVerified: true,
    hasPhoto: true,
  },
];

type ViewMode = 'log' | 'calendar';

export function MissionCenter() {
  const { profile, addToast } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('log');
  const [entries, setEntries] = useState<LogEntry[]>(mockEntries);
  const [activeTab, setActiveTab] = useState<'quick' | 'pro'>('quick');

  // Calculate today's summary
  const todayEntries = entries.filter(e => e.time.includes(':'));
  const todayVerified = todayEntries.filter(e => e.isVerified).length;
  const todayWithPhoto = todayEntries.filter(e => e.hasPhoto).length;

  const handleQuickLog = (log: { vin: string; taskType: string; notes?: string }) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newEntry: LogEntry = {
      id: Date.now().toString(),
      time: timeStr,
      taskType: log.taskType,
      taskLabel: taskLabels[log.taskType] || log.taskType,
      vin: log.vin,
      isVerified: true,
      hasPhoto: false,
    };

    setEntries([newEntry, ...entries]);
    addToast({
      message: '작업 기록 완료',
      type: 'success',
    });
  };

  const handleProVerification = (verification: {
    beforeImage: string;
    afterImage: string;
    description: string;
    taskType: string;
  }) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newEntry: LogEntry = {
      id: Date.now().toString(),
      time: timeStr,
      taskType: verification.taskType,
      taskLabel: taskLabels[verification.taskType] || verification.taskType,
      vin: 'XXXX',
      isVerified: true,
      hasPhoto: true,
    };

    setEntries([newEntry, ...entries]);
    addToast({
      message: '인증 완료! 스탯이 상승했습니다.',
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600">
                <Wrench className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">정비사 디지털 작업일지</h1>
                <p className="text-sm text-slate-400">Work Log</p>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('log')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'log'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{todayEntries.length}</p>
                <p className="text-xs text-slate-500">오늘 기록</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{todayVerified}</p>
                <p className="text-xs text-slate-500">완료</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{todayWithPhoto}</p>
                <p className="text-xs text-slate-500">사진 인증</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Form Section */}
        <div>
          {/* Tab Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'quick'
                  ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500'
                  : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              Quick Log
            </button>
            <button
              onClick={() => setActiveTab('pro')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'pro'
                  ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500'
                  : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              Pro Verify
            </button>
          </div>

          {/* Form Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'quick' ? (
              <QuickLogForm onSubmit={handleQuickLog} />
            ) : (
              <ProVerificationForm onSubmit={handleProVerification} />
            )}
          </motion.div>
        </div>

        {/* Activity Log Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-bold text-white">최근 활동</h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
              {entries.length}건
            </span>
          </div>

          <ActivityLog entries={entries} />
        </div>
      </div>
    </div>
  );
}
