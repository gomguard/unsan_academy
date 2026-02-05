import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { JobCard } from './JobCard';
import { jobDatabase, groupInfo } from '@/lib/jobDatabase';
import type { Job, JobGroup, MarketDemand } from '@/lib/jobDatabase';
import { cn } from '@/lib/utils';

interface JobMatrixProps {
  onJobClick: (job: Job) => void;
}

const statLabels = [
  { key: 'T', name: '기술력' },
  { key: 'H', name: '손기술' },
  { key: 'S', name: '속도' },
  { key: 'A', name: '미학' },
  { key: 'B', name: '비즈' },
];

export function JobMatrix({ onJobClick }: JobMatrixProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<JobGroup[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<MarketDemand | null>(null);
  const [statFilters, setStatFilters] = useState<Record<string, number>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'salary' | 'demand' | 'name'>('salary');

  const filteredJobs = useMemo(() => {
    let result = [...jobDatabase];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Group filter
    if (selectedGroups.length > 0) {
      result = result.filter(job => selectedGroups.includes(job.group));
    }

    // Demand filter
    if (selectedDemand) {
      result = result.filter(job => job.marketDemand === selectedDemand);
    }

    // Stat filters
    for (const [stat, value] of Object.entries(statFilters)) {
      if (value > 0) {
        result = result.filter(job => {
          const jobStat = job.requiredStats[stat as keyof typeof job.requiredStats];
          return Math.abs(jobStat - value) <= 25; // Within 25 points tolerance
        });
      }
    }

    // Sort
    switch (sortBy) {
      case 'salary':
        result.sort((a, b) => b.salaryRange.max - a.salaryRange.max);
        break;
      case 'demand':
        const demandOrder = { Explosive: 0, High: 1, Stable: 2, Declining: 3 };
        result.sort((a, b) => demandOrder[a.marketDemand] - demandOrder[b.marketDemand]);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [searchQuery, selectedGroups, selectedDemand, statFilters, sortBy]);

  const toggleGroup = (group: JobGroup) => {
    setSelectedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGroups([]);
    setSelectedDemand(null);
    setStatFilters({});
  };

  const hasActiveFilters = searchQuery || selectedGroups.length > 0 || selectedDemand || Object.values(statFilters).some(v => v > 0);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Job Matrix</h2>
            <p className="text-slate-500">
              {filteredJobs.length}개의 직업 중 나에게 맞는 커리어를 찾아보세요
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white"
            >
              <option value="salary">연봉순</option>
              <option value="demand">수요순</option>
              <option value="name">이름순</option>
            </select>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="직업명, 키워드로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'h-12 px-4 rounded-lg border font-medium transition-all flex items-center gap-2',
                showFilters || hasActiveFilters
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              )}
            >
              <SlidersHorizontal className="w-5 h-5" />
              필터
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {selectedGroups.length + (selectedDemand ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100"
            >
              {/* Group filters */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">분야</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(groupInfo) as [JobGroup, typeof groupInfo[JobGroup]][]).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => toggleGroup(key)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                        selectedGroups.includes(key)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      <span>{info.icon}</span>
                      {info.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Demand filter */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">시장 수요</label>
                <div className="flex flex-wrap gap-2">
                  {(['Explosive', 'High', 'Stable', 'Declining'] as MarketDemand[]).map((demand) => (
                    <button
                      key={demand}
                      onClick={() => setSelectedDemand(selectedDemand === demand ? null : demand)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        selectedDemand === demand
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      {demand === 'Explosive' && '🚀 급상승'}
                      {demand === 'High' && '📈 높음'}
                      {demand === 'Stable' && '➡️ 안정'}
                      {demand === 'Declining' && '📉 하락'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stat sliders */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  내 스탯에 맞는 직업 찾기
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {statLabels.map(({ key, name }) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{name}</span>
                        <span>{statFilters[key] || 0}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={statFilters[key] || 0}
                        onChange={(e) => setStatFilters(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  필터 초기화
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Results Grid */}
        {filteredJobs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
              >
                <JobCard job={job} onClick={() => onJobClick(job)} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">검색 결과가 없습니다</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
