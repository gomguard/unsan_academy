import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, Building2, GitBranch } from 'lucide-react';
import type { Job } from '@/lib/jobDatabase';
import { groupInfo, demandInfo, formatSalaryKorean } from '@/lib/jobDatabase';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
}

export function JobCard({ job, onClick, variant = 'default' }: JobCardProps) {
  const group = groupInfo[job.group];
  const demand = demandInfo[job.marketDemand];
  const hasHiringCompanies = job.hiringCompanies && job.hiringCompanies.length > 0;
  const hasPrerequisites = job.prerequisiteJobs && job.prerequisiteJobs.length > 0;

  const DemandIcon = job.marketDemand === 'Explosive' || job.marketDemand === 'High'
    ? TrendingUp
    : job.marketDemand === 'Declining'
      ? TrendingDown
      : Minus;

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          'relative cursor-pointer overflow-hidden',
          'bg-gradient-to-br from-slate-900 to-slate-800',
          'rounded-2xl p-6 h-full min-h-[280px]',
          'border border-slate-700/50',
          'flex flex-col justify-between'
        )}
      >
        {/* Decorative gradient */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-2xl"
          style={{ background: `radial-gradient(circle, ${group.color}, transparent)` }}
        />

        {/* Top badges */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{group.icon}</span>
            <span className="text-slate-400 text-sm">{group.name}</span>
          </div>
          {job.marketDemand === 'Explosive' && (
            <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              급성장
            </span>
          )}
        </div>

        {/* Main content */}
        <div className="relative z-10 mt-auto">
          <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-2">{job.description}</p>

          {/* Hiring Companies */}
          {hasHiringCompanies && (
            <div className="flex items-center gap-1.5 mt-2">
              <Building2 className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400 truncate">
                {job.hiringCompanies!.slice(0, 2).join(', ')}
                {job.hiringCompanies!.length > 2 && ` 외 ${job.hiringCompanies!.length - 2}곳`}
              </span>
            </div>
          )}

          {/* Salary - Korean format */}
          <div className="mt-3 flex items-end gap-2">
            <span className="text-2xl font-bold text-white">
              {formatSalaryKorean(job.salaryRange)}
            </span>
            <span className="text-emerald-400 text-sm ml-auto flex items-center">
              <DemandIcon className="w-4 h-4 mr-1" />
              {demand.label}
            </span>
          </div>
        </div>

        {/* Bottom indicators */}
        <div className="mt-4 flex items-center justify-between relative z-10">
          {/* Mini stat bars */}
          <div className="flex-1 grid grid-cols-5 gap-1">
            {(['T', 'H', 'S', 'A', 'B'] as const).map((stat) => (
              <div key={stat} className="space-y-1">
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${job.requiredStats[stat]}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 text-center block">{stat}</span>
              </div>
            ))}
          </div>
          {/* Career path indicator */}
          {hasPrerequisites && (
            <div className="ml-3 flex items-center gap-1 text-amber-400">
              <GitBranch className="w-4 h-4" />
              <span className="text-[10px]">Path</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={cn(
          'cursor-pointer',
          'card-hover p-4',
          'flex items-center gap-4'
        )}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${group.color}15` }}
        >
          {group.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate">{job.title}</h4>
          <p className="text-sm text-slate-500">{group.name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900 text-sm">
            {formatSalaryKorean(job.salaryRange)}
          </p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer card-hover p-5 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${group.color}15` }}
        >
          <span className="text-lg">{group.icon}</span>
        </div>
        <span
          className={cn(
            'badge',
            job.marketDemand === 'Explosive' ? 'badge-red' :
            job.marketDemand === 'High' ? 'badge-amber' :
            job.marketDemand === 'Declining' ? 'badge-slate' :
            'badge-green'
          )}
        >
          <DemandIcon className="w-3 h-3 mr-1" />
          {demand.label}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="font-bold text-slate-900 mb-1">{job.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 flex-1">{job.description}</p>

      {/* Hiring Companies */}
      {hasHiringCompanies && (
        <div className="flex items-center gap-1.5 mt-2">
          <Building2 className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-blue-600 truncate">
            {job.hiringCompanies!.slice(0, 2).join(', ')}
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {job.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="badge badge-slate text-[10px]">
            {tag}
          </span>
        ))}
        {hasPrerequisites && (
          <span className="badge bg-amber-50 text-amber-600 text-[10px]">
            <GitBranch className="w-2.5 h-2.5 mr-0.5" />
            Career Path
          </span>
        )}
      </div>

      {/* Salary Bar */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-500">연봉</span>
          <span className="font-semibold text-slate-900">
            {formatSalaryKorean(job.salaryRange)}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            style={{ width: `${Math.min((job.salaryRange.max / 100) * 10, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
