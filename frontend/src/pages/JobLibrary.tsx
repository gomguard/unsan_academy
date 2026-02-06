import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heading, Subheading } from '@/components/ui/Typography';
import {
  Search,
  TrendingUp,
  Flame,
  Sparkles,
  Star,
  X,
  GitBranch,
  ArrowRight,
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
          className="fixed bottom-24 left-1/2 z-50 bg-white ring-1 ring-amber-400/50 rounded-2xl px-5 py-4 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{current.emoji}</span>
            <div>
              <p className="text-sm text-gray-500">
                <span className="text-gray-900 font-semibold">{current.name}</span>님이 방금
              </p>
              <p className="text-amber-600 font-bold">{current.job} 카드 획득!</p>
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
      className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 cursor-pointer
                 hover:ring-amber-400/50 hover:shadow-md transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
          {group.icon}
        </div>
        <div className="flex gap-1.5">
          {isHot && (
            <span className="px-2.5 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-lg flex items-center gap-1">
              <Flame className="w-3 h-3" /> HOT
            </span>
          )}
          {isNew && (
            <span className="px-2.5 py-1 bg-cyan-100 text-cyan-600 text-[10px] font-bold rounded-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> NEW
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-amber-600 transition-colors">
        {job.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{job.description}</p>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="font-bold">{formatSalaryKorean(job.salaryRange)}</span>
        </div>
        <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-lg">{group.name}</span>
      </div>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function JobLibrary() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<JobGroup | 'all'>('all');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Live Toast */}
      <LiveToast />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <Heading as="h1" size="xl">Job Library</Heading>
                <p className="text-xs text-gray-500 mt-0.5">88개 직업 데이터</p>
              </div>
            </div>
            <Link
              to="/skill-tree"
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-100 text-purple-700 text-sm font-bold rounded-full hover:bg-purple-200 transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              Tree
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="직업 검색... (예: EV, PPF, 튜닝)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-12 bg-white border border-gray-200 rounded-full text-gray-950 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-950 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Group Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                selectedGroup === 'all'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white ring-1 ring-gray-200 text-gray-500 hover:bg-gray-50'
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
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    selectedGroup === key
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white ring-1 ring-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span>{info.icon}</span>
                  {info.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Hot Jobs Section */}
      {selectedGroup === 'all' && !searchQuery && (
        <section className="py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-500" />
              </div>
              <Heading as="h2" size="xl">급성장 직업 TOP 6</Heading>
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
        <section className="py-10 px-4 sm:px-6 bg-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <Heading as="h2" size="xl">입문 추천 직업</Heading>
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
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                {selectedGroup === 'all' ? '📋' : groupInfo[selectedGroup].icon}
              </div>
              <Heading as="h2" size="xl">
                {selectedGroup === 'all' ? '전체 직업' : groupInfo[selectedGroup].name}
              </Heading>
            </div>
            <span className="text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg text-sm">{filteredJobs.length}개 직업</span>
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
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">검색 결과가 없습니다.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGroup('all');
                }}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 mx-auto"
              >
                필터 초기화
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            데이터는 2024년 자동차 애프터마켓 산업 시장 조사를 기반으로 합니다.
          </p>
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
