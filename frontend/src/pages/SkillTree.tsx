import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heading, Subheading } from '@/components/ui/Typography';
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
  TrendingUp,
  Flame,
  GitBranch,
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
      className="absolute right-4 top-4 bottom-4 w-80 bg-slate-800 rounded-3xl ring-1 ring-white/10 overflow-hidden shadow-2xl z-50"
    >
      {/* Header */}
      <div className="relative p-5 border-b border-slate-700/50" style={{ backgroundColor: `${color}15` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-slate-900/50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">{group.icon}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <Heading as="h3" size="xl" dark>{job.title}</Heading>
        <p className="text-sm text-slate-400 mt-1">{group.name}</p>
      </div>

      {/* Content */}
      <div className="p-5 overflow-y-auto max-h-[calc(100%-200px)]">
        <p className="text-slate-300 text-sm mb-5 leading-relaxed">{job.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-900/50 rounded-xl p-4 ring-1 ring-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              연봉
            </div>
            <p className="text-green-400 font-bold">{formatSalaryKorean(job.salaryRange)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 ring-1 ring-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Flame className="w-3.5 h-3.5" />
              수요
            </div>
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
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-900 rounded-xl font-bold text-sm mb-3 transition-all shadow-lg shadow-orange-500/20"
        >
          <MapPin className="w-4 h-4" />
          커리어 허브 보기
        </Link>

        <button
          onClick={() => onSetTarget(job.id)}
          className={`w-full py-3.5 rounded-xl font-bold text-sm mb-5 flex items-center justify-center gap-2 transition-all ${
            isTarget
              ? 'bg-yellow-400/20 text-yellow-400 ring-2 ring-yellow-400'
              : 'bg-slate-700 hover:bg-slate-600 text-white ring-1 ring-white/10'
          }`}
        >
          {isTarget ? <><Target className="w-4 h-4" /> 현재 목표</> : <><Navigation className="w-4 h-4" /> 목표로 설정</>}
        </button>

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-orange-400" />
              <Subheading dark>선행 직업</Subheading>
            </div>
            <div className="space-y-2">
              {prerequisites.map(prereq => (
                <button
                  key={prereq.id}
                  onClick={() => onNavigate(prereq.id)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-700 rounded-xl text-left ring-1 ring-white/5 transition-colors"
                >
                  <span className="text-lg">{groupInfo[prereq.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1 font-medium">{prereq.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unlocks */}
        {unlocks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Unlock className="w-4 h-4 text-green-400" />
              <Subheading dark>이후 진출 ({unlocks.length})</Subheading>
            </div>
            <div className="space-y-2">
              {unlocks.slice(0, 5).map(unlock => (
                <button
                  key={unlock.id}
                  onClick={() => onNavigate(unlock.id)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-700 rounded-xl text-left ring-1 ring-white/5 transition-colors"
                >
                  <span className="text-lg">{groupInfo[unlock.group].icon}</span>
                  <span className="text-sm text-slate-300 flex-1 font-medium">{unlock.title}</span>
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-gray-50 overflow-hidden flex flex-col pb-24 md:pb-8">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/jobs"
              className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-950 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <Heading as="h1" size="xl">커리어 맵</Heading>
                <p className="text-xs text-gray-500">7개 분야, {jobDatabase.length}개 직업 경로</p>
              </div>
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
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-5 py-3 rounded-2xl shadow-xl shadow-orange-500/25 flex items-center gap-4">
                <Navigation className="w-5 h-5" />
                <span className="font-bold">목표: {getJobById(targetJobId)?.title}</span>
                <span className="text-xs bg-slate-900/20 px-3 py-1 rounded-lg font-semibold">{focusPath.length}단계</span>
                <button onClick={clearFocusMode} className="p-1.5 hover:bg-slate-900/20 rounded-lg transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
