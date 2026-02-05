import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, Zap } from 'lucide-react';
import { JobCard } from './JobCard';
import { getTopSalaryJobs, getHotTrendJobs, getBestStarterJobs } from '@/lib/jobDatabase';
import type { Job } from '@/lib/jobDatabase';
import { cn } from '@/lib/utils';

type TabType = 'salary' | 'trend' | 'starter';

const tabs = [
  { id: 'salary' as TabType, label: 'High Roller', ko: '연봉 Top 5', icon: DollarSign },
  { id: 'trend' as TabType, label: 'Hot Trend', ko: '급상승 Top 5', icon: TrendingUp },
  { id: 'starter' as TabType, label: 'Best Starter', ko: '입문 추천', icon: Zap },
];

interface HallOfFameProps {
  onJobClick: (job: Job) => void;
}

export function HallOfFame({ onJobClick }: HallOfFameProps) {
  const [activeTab, setActiveTab] = useState<TabType>('salary');

  const getJobs = () => {
    switch (activeTab) {
      case 'salary':
        return getTopSalaryJobs(5);
      case 'trend':
        return getHotTrendJobs(5);
      case 'starter':
        return getBestStarterJobs(5);
      default:
        return [];
    }
  };

  const jobs = getJobs();

  return (
    <div className="py-16 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
            ⭐ Hall of Fame
          </span>
          <h2 className="text-3xl font-bold text-white mb-2">
            주목할 만한 커리어
          </h2>
          <p className="text-slate-400">
            시장에서 가장 핫한 직업을 확인하세요
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all',
                  isActive
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.ko}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* First card - Featured (larger) */}
            {jobs[0] && (
              <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                <JobCard
                  job={jobs[0]}
                  variant="featured"
                  onClick={() => onJobClick(jobs[0])}
                />
              </div>
            )}

            {/* Remaining cards */}
            {jobs.slice(1).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard
                  job={job}
                  variant="featured"
                  onClick={() => onJobClick(job)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
