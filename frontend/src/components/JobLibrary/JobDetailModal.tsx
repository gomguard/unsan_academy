import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { X, TrendingUp, TrendingDown, Minus, Bookmark, Share2, Building2, FileText, GitBranch, ExternalLink, Bell, Sparkles, Flame, MapPin, DollarSign, GraduationCap, Clock, Star, BadgeCheck, ChevronRight } from 'lucide-react';
import type { Job } from '@/lib/jobDatabase';
import { groupInfo, demandInfo, formatSalaryKorean, getPrerequisiteJobs } from '@/lib/jobDatabase';
import { getJobPostings, getBadgeStyle, getSourceIcon, type JobPosting } from '@/lib/jobFeed';
import { getCoursesForJob, getAcademyById, formatCoursePrice } from '@/lib/educationData';
import { cn } from '@/lib/utils';
import { SalaryChart } from '@/components/SalaryChart';
import { useStore } from '@/store/useStore';
import { courseTypeInfo } from '@/types';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onJobClick?: (job: Job) => void;
}

const statLabels = {
  T: { name: 'Diagnostic', ko: '진단력', color: '#22d3ee' },
  H: { name: 'Mechanical', ko: '정비력', color: '#f472b6' },
  S: { name: 'Efficiency', ko: '효율성', color: '#a3e635' },
  A: { name: 'Quality', ko: '품질력', color: '#c084fc' },
  B: { name: 'Communication', ko: '소통력', color: '#fef08a' },
};

// Company logo mapping (placeholder - in production would use actual logos)
const companyLogos: Record<string, string> = {
  'Tesla Korea': '🚗',
  'Tesla': '🚗',
  '현대 블루핸즈(EV전담)': '🔵',
  '벤츠 한성자동차': '⭐',
  '에코프로(폐배터리)': '♻️',
  '천우모터스(기흥)': '🔧',
  '코오롱모터스(BMW)': '🔵',
  '위본모터스(Audi)': '🔴',
  '효성토요타': '🚙',
  '스타자동차(MB)': '⭐',
  '현대글로비스(오토벨)': '🚗',
  'K-Car': '🚗',
  'KB차차차': '🔵',
  '헤이딜러': '📱',
  '리코쉴드': '🛡️',
  '스타일매니아': '🎨',
  'J&J': '💎',
  'XPEL Korea': '🛡️',
};

function LiveJobPostingCard({ posting }: { posting: JobPosting }) {
  const badgeStyle = posting.badge ? getBadgeStyle(posting.badge) : null;
  const sourceIcon = getSourceIcon(posting.source);

  return (
    <a
      href={posting.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-slate-800/50 hover:bg-slate-700 rounded-xl transition-colors group border border-slate-700"
    >
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl border border-slate-700">
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
            {posting.salary && <span className="text-green-400">{posting.salary}</span>}
            {posting.location && (
              <>
                <span>·</span>
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
              ? 'bg-red-500/20 text-red-500'
              : 'bg-slate-700 text-slate-400'
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
      <div className="mt-2 flex items-center justify-end gap-1 text-yellow-300 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        <span>지원하기</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </a>
  );
}

export function JobDetailModal({ job, onClose, onJobClick }: JobDetailModalProps) {
  const navigate = useNavigate();
  const { setTargetJobId } = useStore();

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

  const demandColor = job.marketDemand === 'Explosive' ? 'text-red-500' :
                      job.marketDemand === 'High' ? 'text-orange-400' :
                      job.marketDemand === 'Declining' ? 'text-slate-500' :
                      'text-green-400';

  // Calculate average salary for badge
  const avgSalary = Math.round((job.salaryRange.min + job.salaryRange.max) / 2);
  const formattedAvgSalary = avgSalary >= 10000
    ? `${(avgSalary / 10000).toFixed(1)}억원`
    : `${avgSalary.toLocaleString()}만원`;

  // Handle "Start Career Path" action - Navigate to Career Hub
  const handleStartPath = () => {
    setTargetJobId(job.id);
    onClose();
    navigate(`/career/${job.id}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-700"
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
              className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            {/* SALARY BADGE - Top Right Trust Element */}
            <div className="absolute top-4 left-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-bold text-lg">평균 {formattedAvgSalary}</span>
                </div>
              </div>
            </div>

            {/* Icon and group */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-slate-800 shadow-lg border border-slate-700"
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
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-sm text-slate-500 mb-1">연봉 범위</p>
                <p className="text-xl font-bold text-green-400">
                  {formatSalaryKorean(job.salaryRange)}
                </p>
              </div>

              {/* Demand */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-sm text-slate-500 mb-1">시장 수요</p>
                <div className="flex items-center gap-2">
                  <DemandIcon className={cn('w-5 h-5', demandColor)} />
                  <span className={cn('text-lg font-semibold', demandColor)}>
                    {demand.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Salary Simulator Chart */}
            <div className="mb-6">
              <SalaryChart job={job} />
            </div>

            {/* LIVE JOB FEED SECTION */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <h3 className="font-bold text-white">현재 채용 중인 공고</h3>
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-bold animate-pulse">
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
                <div className="p-4 bg-slate-800/50 rounded-xl text-center border border-slate-700">
                  <p className="text-slate-500 text-sm mb-2">현재 채용 공고 대기 중</p>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-400 transition-all">
                    <Bell className="w-3.5 h-3.5" />
                    알림 받기
                  </button>
                </div>
              )}
            </div>

            {/* Hiring Companies - Logo Display */}
            {job.hiringCompanies && job.hiringCompanies.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <h3 className="font-bold text-white">채용 파트너</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.hiringCompanies.map((company) => (
                    <div
                      key={company}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <span className="text-xl">{companyLogos[company] || '🏢'}</span>
                      <span className="text-sm font-medium text-slate-300">{company}</span>
                    </div>
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
                      className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-700 rounded-xl transition-colors text-left border border-slate-700"
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

            {/* RECOMMENDED COURSES SECTION */}
            {(() => {
              const recommendedCourses = getCoursesForJob(job.id);
              if (recommendedCourses.length === 0) return null;

              return (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-400" />
                      <h3 className="font-bold text-white">추천 교육 과정</h3>
                    </div>
                    <Link
                      to="/education"
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      전체 보기 <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {recommendedCourses.slice(0, 3).map(course => {
                      const academy = getAcademyById(course.academyId);
                      const typeInfo = courseTypeInfo[course.type];
                      const isFree = course.price === 0;

                      return (
                        <a
                          key={course.id}
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-colors border border-purple-500/20 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl border border-slate-700">
                              {academy?.logo || '🎓'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-slate-400">{academy?.name}</span>
                                {academy?.isPartner && (
                                  <BadgeCheck className="w-3 h-3 text-cyan-400" />
                                )}
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: `${typeInfo.color}20`,
                                    color: typeInfo.color,
                                  }}
                                >
                                  {typeInfo.name}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                                {course.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {course.duration}
                                </div>
                                {course.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    {course.rating}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-bold ${isFree ? 'text-green-400' : 'text-white'}`}>
                                {isFree ? '무료' : `${course.price}만원`}
                              </p>
                              {course.priceNote && (
                                <p className="text-[10px] text-slate-500">{course.priceNote}</p>
                              )}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                  {recommendedCourses.length > 3 && (
                    <Link
                      to="/education"
                      className="mt-3 block text-center py-2 text-sm text-purple-400 hover:text-purple-300"
                    >
                      +{recommendedCourses.length - 3}개 더 보기
                    </Link>
                  )}
                </div>
              );
            })()}

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
                      <div className="flex-1 h-2 bg-slate-800/50 rounded-full overflow-hidden">
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
              <div className="mb-6 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">출처: {job.source}</span>
                </div>
              </div>
            )}

            {/* Actions - Updated CTA */}
            <div className="flex gap-3">
              <button
                onClick={handleStartPath}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                이 커리어 패스 시작하기
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
