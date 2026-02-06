import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  Target,
  Navigation,
  XCircle,
  ChevronRight,
  Lock,
  Unlock,
  MapPin,
} from 'lucide-react';
import {
  jobDatabase,
  groupInfo,
  getJobById,
  getPrerequisiteJobs,
  getJobsThatRequire,
  formatSalaryKorean,
  type Job,
  type JobGroup,
} from '@/lib/jobDatabase';
import { useStore } from '@/store/useStore';
import { SkillTreeFlow } from '@/components/SkillTreeFlow';

// ============ CONSTANTS ============
const groupColors: Record<JobGroup, string> = {
  Maintenance: '#3b82f6',
  Body: '#ec4899',
  Film: '#f59e0b',
  EV_Future: '#8b5cf6',
  Management: '#6366f1',
  Niche: '#ef4444',
  NextGen: '#10b981',
};

// ============ HELPER FUNCTIONS ============
function calculatePathToTarget(targetId: string): string[] {
  const target = getJobById(targetId);
  if (!target) return [];

  const path: string[] = [];
  const visited = new Set<string>();

  function collectPath(jobId: string) {
    if (visited.has(jobId)) return;
    visited.add(jobId);

    const job = getJobById(jobId);
    if (!job) return;

    if (job.prerequisiteJobs) {
      for (const prereqId of job.prerequisiteJobs) {
        collectPath(prereqId);
      }
    }
    path.push(jobId);
  }

  collectPath(targetId);
  return path;
}

// ============ JOB DETAIL PANEL ============
function JobDetailPanel({
  job,
  onClose,
  onNavigate,
  onSetTarget,
  isTarget,
}: {
  job: Job;
  onClose: () => void;
  onNavigate: (jobId: string) => void;
  onSetTarget: (jobId: string) => void;
  isTarget: boolean;
}) {
  const prerequisites = getPrerequisiteJobs(job.id);
  const unlocks = getJobsThatRequire(job.id);
  const group = groupInfo[job.group];
  const color = groupColors[job.group];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 bottom-4 w-80 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl z-50"
    >
      <div className="p-4 border-b border-slate-700" style={{ backgroundColor: `${color}20` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{group.icon}</span>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-white">{job.title}</h3>
        <p className="text-sm text-slate-400 mt-1">{group.name}</p>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100%-180px)]">
        <p className="text-slate-300 text-sm mb-4">{job.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500">연봉</p>
            <p className="text-green-400 font-bold">{formatSalaryKorean(job.salaryRange)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500">수요</p>
            <p className={`font-bold ${
              job.marketDemand === 'Explosive' ? 'text-red-400' :
              job.marketDemand === 'High' ? 'text-orange-400' : 'text-slate-400'
            }`}>
              {job.marketDemand === 'Explosive' ? '급상승' :
               job.marketDemand === 'High' ? '높음' : '안정'}
            </p>
          </div>
        </div>

        {/* Career Hub Link */}
        <Link
          to={`/career/${job.id}`}
          className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg font-bold text-sm mb-3 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          커리어 허브 보기
        </Link>

        <button
          onClick={() => onSetTarget(job.id)}
          className={`w-full py-3 rounded-lg font-bold text-sm mb-4 flex items-center justify-center gap-2 ${
            isTarget ? 'bg-slate-700 text-yellow-400 border-2 border-yellow-400' : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          {isTarget ? <><Target className="w-4 h-4" /> 현재 목표</> : <><Navigation className="w-4 h-4" /> 목표로 설정</>}
        </button>

        {prerequisites.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-bold text-white">선행 직업</h4>
            </div>
            <div className="space-y-2">
              {prerequisites.map(prereq => (
                <button
                  key={prereq.id}
                  onClick={() => onNavigate(prereq.id)}
                  className="w-full flex items-center gap-2 p-2 bg-slate-900/50 hover:bg-slate-700 rounded-lg text-left"
                >
                  <span>{groupInfo[prereq.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1">{prereq.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {unlocks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Unlock className="w-4 h-4 text-green-400" />
              <h4 className="text-sm font-bold text-white">이후 진출 ({unlocks.length})</h4>
            </div>
            <div className="space-y-2">
              {unlocks.slice(0, 5).map(unlock => (
                <button
                  key={unlock.id}
                  onClick={() => onNavigate(unlock.id)}
                  className="w-full flex items-center gap-2 p-2 bg-slate-900/50 hover:bg-slate-700 rounded-lg text-left"
                >
                  <span>{groupInfo[unlock.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1">{unlock.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function SkillTree() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { targetJobId, focusPath, setTargetJobId, setFocusPath, clearFocusMode } = useStore();

  useEffect(() => {
    if (targetJobId) {
      setFocusPath(calculatePathToTarget(targetJobId));
    } else {
      setFocusPath([]);
    }
  }, [targetJobId, setFocusPath]);

  const handleSetTarget = useCallback((jobId: string) => {
    if (targetJobId === jobId) {
      clearFocusMode();
    } else {
      setTargetJobId(jobId);
    }
  }, [targetJobId, setTargetJobId, clearFocusMode]);

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden flex flex-col pb-24 md:pb-8">
      {/* Minimal Header */}
      <header className="flex-shrink-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/jobs" className="flex items-center gap-2 text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">커리어 맵</h1>
              <p className="text-xs text-slate-500">7개 분야, {jobDatabase.length}개 직업 경로</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        <SkillTreeFlow
          selectedGroup="all"
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
          focusPath={focusPath}
          targetJobId={targetJobId}
        />

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedJob && (
            <JobDetailPanel
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onNavigate={(jobId) => {
                const job = getJobById(jobId);
                if (job) setSelectedJob(job);
              }}
              onSetTarget={handleSetTarget}
              isTarget={selectedJob.id === targetJobId}
            />
          )}
        </AnimatePresence>

        {/* Focus Mode Indicator */}
        <AnimatePresence>
          {targetJobId && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-40"
            >
              <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                <Navigation className="w-4 h-4" />
                <span className="font-bold text-sm">목표: {getJobById(targetJobId)?.title}</span>
                <span className="text-xs bg-gray-900/20 px-2 py-0.5 rounded-full">{focusPath.length}단계</span>
                <button onClick={clearFocusMode} className="p-1 hover:bg-gray-900/20 rounded-full">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
