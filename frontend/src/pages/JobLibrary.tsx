import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  Flame,
  Sparkles,
  Star,
  ChevronRight,
  X,
} from 'lucide-react';
import { jobDatabase, groupInfo, getHotTrendJobs, getBestStarterJobs, formatSalaryKorean } from '@/lib/jobDatabase';
import type { Job, JobGroup } from '@/lib/jobDatabase';
import { JobDetailModal } from '@/components/JobLibrary/JobDetailModal';

// ============ LIVE TOAST SYSTEM ============
const liveUnlocks = [
  { name: '김OO', job: 'EV 고전압 배터리 진단사', emoji: '⚡' },
  { name: '이OO', job: 'PPF 인스톨러', emoji: '🎨' },
  { name: '박OO', job: '테슬라 공인 바디샵', emoji: '🚗' },
  { name: '최OO', job: 'ADAS 캘리브레이션', emoji: '🎯' },
];

function LiveToast() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(liveUnlocks[0]);

  useEffect(() => {
    const showToast = () => {
      setCurrent(liveUnlocks[Math.floor(Math.random() * liveUnlocks.length)]);
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    };

    const interval = setInterval(showToast, 8000);
    setTimeout(showToast, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 z-50 bg-dark-card border border-pop-yellow/30 rounded-xl px-4 py-3 shadow-glow-yellow"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{current.emoji}</span>
            <div>
              <p className="text-sm text-slate-400">
                <span className="text-white font-medium">{current.name}</span>님이 방금
              </p>
              <p className="text-pop-yellow font-bold">{current.job} 카드 획득!</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ JOB CARD COMPONENT ============
function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const group = groupInfo[job.group];
  const isHot = job.marketDemand === 'Explosive';
  const isNew = job.tags.includes('블루오션');

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-dark-card border border-dark-hover rounded-2xl p-5 cursor-pointer
                 hover:border-pop-yellow/30 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{group.icon}</span>
        <div className="flex gap-1">
          {isHot && (
            <span className="badge badge-hot text-[10px]">
              <Flame className="w-3 h-3 mr-0.5" /> HOT
            </span>
          )}
          {isNew && (
            <span className="badge badge-new text-[10px]">
              <Sparkles className="w-3 h-3 mr-0.5" /> NEW
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold mb-1 group-hover:text-pop-yellow transition-colors">
        {job.title}
      </h3>
      <p className="text-slate-500 text-sm line-clamp-2 mb-4">{job.description}</p>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-pop-lime">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">{formatSalaryKorean(job.salaryRange)}</span>
        </div>
        <span className="text-slate-500 text-xs">{group.name}</span>
      </div>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function JobLibrary() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<JobGroup | 'all'>('all');

  const hotJobs = getHotTrendJobs(6);
  const starterJobs = getBestStarterJobs(4);

  const filteredJobs = jobDatabase.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = selectedGroup === 'all' || job.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const groups = Object.entries(groupInfo) as [JobGroup, typeof groupInfo[JobGroup]][];

  return (
    <div className="min-h-screen bg-dark">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-30 pointer-events-none" />

      {/* Live Toast */}
      <LiveToast />

      {/* Hero */}
      <section className="relative pt-20 pb-12 px-4 border-b border-dark-hover">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🎯</span>
              <span className="badge badge-yellow">88개 직업</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Job Library
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              자동차 애프터마켓의 모든 커리어 경로.
              <br />
              <span className="text-pop-yellow font-medium">연봉, 시장 수요, 필요 역량</span>을 한눈에.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="직업 검색... (예: EV, PPF, 튜닝)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark pl-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Group Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedGroup === 'all'
                  ? 'bg-pop-yellow text-dark-200'
                  : 'bg-dark-card border border-dark-hover text-slate-400 hover:text-white hover:border-pop-yellow/30'
              }`}
            >
              전체 ({jobDatabase.length})
            </button>
            {groups.map(([key, info]) => {
              const count = jobDatabase.filter(j => j.group === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedGroup(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedGroup === key
                      ? 'bg-pop-yellow text-dark-200'
                      : 'bg-dark-card border border-dark-hover text-slate-400 hover:text-white hover:border-pop-yellow/30'
                  }`}
                >
                  <span>{info.icon}</span>
                  {info.name} ({count})
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Hot Jobs Section */}
      {selectedGroup === 'all' && !searchQuery && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-5 h-5 text-status-hot" />
              <h2 className="text-2xl font-bold text-white">🔥 급성장 직업 TOP 6</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <JobCard job={job} onClick={() => setSelectedJob(job)} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Starter Jobs Section */}
      {selectedGroup === 'all' && !searchQuery && (
        <section className="py-12 px-4 bg-dark-100/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-pop-yellow" />
              <h2 className="text-2xl font-bold text-white">⭐ 입문 추천 직업</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {starterJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <JobCard job={job} onClick={() => setSelectedJob(job)} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Jobs Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedGroup === 'all' ? '📋 전체 직업' : `${groupInfo[selectedGroup].icon} ${groupInfo[selectedGroup].name}`}
            </h2>
            <span className="text-slate-500">{filteredJobs.length}개 직업</span>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                >
                  <JobCard job={job} onClick={() => setSelectedJob(job)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="text-slate-400 text-lg">검색 결과가 없습니다.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGroup('all');
                }}
                className="mt-4 text-pop-yellow hover:underline"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-hover">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 mb-4">
            데이터는 2024년 자동차 애프터마켓 산업 시장 조사를 기반으로 합니다.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-pop-yellow hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Unsan Academy로 돌아가기
          </Link>
        </div>
      </footer>

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onJobClick={setSelectedJob}
      />
    </div>
  );
}
