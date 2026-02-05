import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Bookmark, Share2, Building2, FileText, GitBranch, ExternalLink, Bell, Sparkles, Flame } from 'lucide-react';
import type { Job } from '@/lib/jobDatabase';
import { groupInfo, demandInfo, formatSalaryKorean, getPrerequisiteJobs } from '@/lib/jobDatabase';
import { getJobPostings, getBadgeStyle, getSourceIcon, type JobPosting } from '@/lib/jobFeed';
import { cn } from '@/lib/utils';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onJobClick?: (job: Job) => void;
}

const statLabels = {
  T: { name: 'Tech', ko: '기술력', color: '#22d3ee' },
  H: { name: 'Hand', ko: '손기술', color: '#f472b6' },
  S: { name: 'Ops', ko: '운영', color: '#a3e635' },
  A: { name: 'Art', ko: '미학', color: '#c084fc' },
  B: { name: 'Biz', ko: '비즈', color: '#fef08a' },
};

function LiveJobPostingCard({ posting }: { posting: JobPosting }) {
  const badgeStyle = posting.badge ? getBadgeStyle(posting.badge) : null;
  const sourceIcon = getSourceIcon(posting.source);

  return (
    <a
      href={posting.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-dark-100 hover:bg-dark-hover rounded-xl transition-colors group border border-dark-hover"
    >
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className="w-10 h-10 bg-dark-card rounded-lg flex items-center justify-center text-xl border border-dark-hover">
          {posting.companyLogo || '🏢'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm truncate">
              {posting.companyName}
            </span>
            {badgeStyle && posting.badge && (
              <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', badgeStyle.bg, badgeStyle.text)}>
                {posting.badge === 'Hot' && <Flame className="w-2.5 h-2.5 inline mr-0.5" />}
                {posting.badge === 'Exclusive' && <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />}
                {posting.badge}
              </span>
            )}
          </div>
          <p className="text-slate-300 text-sm line-clamp-1">{posting.title}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            {posting.salary && <span className="text-pop-lime">{posting.salary}</span>}
            {posting.location && (
              <>
                <span>•</span>
                <span>{posting.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-1">
          <span className={cn(
            'px-2 py-0.5 rounded text-xs font-bold',
            posting.deadline.startsWith('D-') && parseInt(posting.deadline.slice(2)) <= 5
              ? 'bg-status-hot/20 text-status-hot'
              : 'bg-dark-hover text-slate-400'
          )}>
            {posting.deadline}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <span>{sourceIcon}</span>
            <span>{posting.source}</span>
          </div>
        </div>
      </div>

      {/* Apply indicator */}
      <div className="mt-2 flex items-center justify-end gap-1 text-pop-yellow text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        <span>지원하기</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </a>
  );
}

export function JobDetailModal({ job, onClose, onJobClick }: JobDetailModalProps) {
  if (!job) return null;

  const group = groupInfo[job.group];
  const demand = demandInfo[job.marketDemand];
  const prerequisiteJobs = getPrerequisiteJobs(job.id);
  const livePostings = getJobPostings(job.id);

  const DemandIcon = job.marketDemand === 'Explosive' || job.marketDemand === 'High'
    ? TrendingUp
    : job.marketDemand === 'Declining'
      ? TrendingDown
      : Minus;

  const demandColor = job.marketDemand === 'Explosive' ? 'text-status-hot' :
                      job.marketDemand === 'High' ? 'text-pop-orange' :
                      job.marketDemand === 'Declining' ? 'text-slate-500' :
                      'text-pop-lime';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark-200/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-dark-card rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-dark-hover"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div
            className="relative h-32 flex items-end p-6"
            style={{
              background: `linear-gradient(135deg, ${group.color}30, ${group.color}10)`,
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-dark-card/80 hover:bg-dark-hover rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            {/* Icon and group */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-dark-card shadow-lg border border-dark-hover"
              >
                {group.icon}
              </div>
              <div>
                <span
                  className="badge"
                  style={{ backgroundColor: `${group.color}20`, color: group.color }}
                >
                  {group.name}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
            <p className="text-slate-400 mb-6">{job.description}</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Salary */}
              <div className="bg-dark-100 rounded-xl p-4 border border-dark-hover">
                <p className="text-sm text-slate-500 mb-1">예상 연봉</p>
                <p className="text-xl font-bold text-pop-lime">
                  {formatSalaryKorean(job.salaryRange)}
                </p>
              </div>

              {/* Demand */}
              <div className="bg-dark-100 rounded-xl p-4 border border-dark-hover">
                <p className="text-sm text-slate-500 mb-1">시장 수요</p>
                <div className="flex items-center gap-2">
                  <DemandIcon className={cn('w-5 h-5', demandColor)} />
                  <span className={cn('text-lg font-semibold', demandColor)}>
                    {demand.label}
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE JOB FEED SECTION */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-status-hot" />
                  <h3 className="font-bold text-white">현재 채용 중인 공고</h3>
                  <span className="text-[10px] px-1.5 py-0.5 bg-status-live/20 text-status-live rounded font-bold animate-pulse">
                    LIVE
                  </span>
                </div>
                {livePostings.length > 0 && (
                  <span className="text-xs text-slate-500">{livePostings.length}건</span>
                )}
              </div>

              {livePostings.length > 0 ? (
                <div className="space-y-2">
                  {livePostings.map((posting) => (
                    <LiveJobPostingCard key={posting.id} posting={posting} />
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-dark-100 rounded-xl text-center border border-dark-hover">
                  <p className="text-slate-500 text-sm mb-2">현재 채용 공고 대기 중</p>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pop-yellow text-dark-200 text-sm font-bold rounded-lg hover:shadow-glow-yellow transition-all">
                    <Bell className="w-3.5 h-3.5" />
                    알림 받기
                  </button>
                </div>
              )}
            </div>

            {/* Hiring Companies */}
            {job.hiringCompanies && job.hiringCompanies.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <h3 className="font-bold text-white">주요 채용 기업</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.hiringCompanies.map((company) => (
                    <span
                      key={company}
                      className="px-3 py-1.5 bg-pop-cyan/10 text-pop-cyan rounded-lg text-sm font-medium border border-pop-cyan/20"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Career Path Prerequisites */}
            {prerequisiteJobs.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="w-4 h-4 text-slate-500" />
                  <h3 className="font-bold text-white">선행 커리어 (Career Path)</h3>
                </div>
                <div className="space-y-2">
                  {prerequisiteJobs.map((prereq) => (
                    <button
                      key={prereq.id}
                      onClick={() => onJobClick?.(prereq)}
                      className="w-full flex items-center gap-3 p-3 bg-dark-100 hover:bg-dark-hover rounded-xl transition-colors text-left border border-dark-hover"
                    >
                      <span className="text-xl">{groupInfo[prereq.group].icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-white">{prereq.title}</p>
                        <p className="text-xs text-slate-500">{formatSalaryKorean(prereq.salaryRange)}</p>
                      </div>
                      <span className="text-xs text-slate-500">클릭하여 보기</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500 italic">
                  이 직업을 얻으려면 먼저 위의 커리어 경험이 필요합니다.
                </p>
              </div>
            )}

            {/* Required Stats */}
            <div className="mb-6">
              <h3 className="font-bold text-white mb-3">필요 역량</h3>
              <div className="space-y-3">
                {(Object.entries(job.requiredStats) as [keyof typeof statLabels, number][]).map(([key, value]) => {
                  const stat = statLabels[key];
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-14 text-sm">
                        <span className="font-medium text-slate-300">{stat.ko}</span>
                      </div>
                      <div className="flex-1 h-2 bg-dark-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: stat.color }}
                        />
                      </div>
                      <span className="w-8 text-sm font-medium text-slate-400">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="font-bold text-white mb-3">특징</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="badge badge-yellow">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Data Source */}
            {job.source && (
              <div className="mb-6 p-3 bg-dark-100 rounded-xl border border-dark-hover">
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">출처: {job.source}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button className="btn-primary flex-1">
                커리어 경로 보기
              </button>
              <button className="btn-secondary w-12 !px-0 flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="btn-secondary w-12 !px-0 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
