import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, TrendingUp, Camera, Zap, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BentoCard } from '@/components/ui/BentoCard';
import { Heading, Subheading } from '@/components/ui/Typography';
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
  const { addToast } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('log');
  const [entries, setEntries] = useState<LogEntry[]>(mockEntries);
  const [activeTab, setActiveTab] = useState<'quick' | 'pro'>('quick');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div>
                <Heading as="h1" size="xl">디지털 작업일지</Heading>
                <p className="text-sm text-gray-500 mt-0.5">Work Log</p>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('log')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'log'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-950'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-950'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
            <div className="relative grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-950">{todayEntries.length}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  오늘 기록
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">{todayVerified}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  완료
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{todayWithPhoto}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Camera className="w-3 h-3" />
                  사진 인증
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Form Section */}
        <div>
          {/* Tab Selector */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'quick'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 text-cyan-400 ring-2 ring-cyan-500'
                  : 'bg-slate-800 text-slate-400 ring-1 ring-white/10 hover:ring-cyan-500/30'
              }`}
            >
              <Zap className="w-5 h-5" />
              Quick Log
            </button>
            <button
              onClick={() => setActiveTab('pro')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === 'pro'
                  ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 ring-2 ring-purple-500'
                  : 'bg-slate-800 text-slate-400 ring-1 ring-white/10 hover:ring-purple-500/30'
              }`}
            >
              <Camera className="w-5 h-5" />
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
        <BentoCard
          dark
          eyebrow="Recent Activity"
          title={
            <div className="flex items-center gap-3">
              <span>최근 활동</span>
              <span className="text-sm text-slate-500 bg-slate-900/50 px-2.5 py-1 rounded-lg font-normal">
                {entries.length}건
              </span>
            </div>
          }
          className="p-0"
        >
          <div className="px-6 pb-6 pt-2">
            <ActivityLog entries={entries} />
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
