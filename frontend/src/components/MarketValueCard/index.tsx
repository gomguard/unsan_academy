import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Users,
  MessageSquare,
  Star,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { jobDatabase, getJobById, type Job } from '@/lib/jobDatabase';
import { getReviewsForJob, getSuccessStoriesForJob } from '@/lib/careerData';
import { SalaryPositionBar } from './SalaryPositionBar';
import { CommunityProof } from './CommunityProof';
import { UpgradeRecommend } from './UpgradeRecommend';

interface MarketValueCardProps {
  currentJobId?: string;
  currentSalary?: number;
  yearsExperience?: number;
  isVerified?: boolean;
  onEditClick?: () => void;
}

// Get entry-level jobs for selection
const popularJobs = jobDatabase
  .filter(job =>
    ['maint_01', 'maint_06', 'maint_14', 'maint_17', 'ev_01', 'ev_03', 'film_01', 'film_03', 'body_01', 'mgmt_01', 'mgmt_06']
    .includes(job.id)
  )
  .slice(0, 8);

export function MarketValueCard({
  currentJobId,
  currentSalary = 3500,
  yearsExperience = 3,
  isVerified = false,
  onEditClick,
}: MarketValueCardProps) {
  const [selectedJobId, setSelectedJobId] = useState(currentJobId || 'maint_01');
  const [showJobSelector, setShowJobSelector] = useState(false);
  const [years, setYears] = useState(yearsExperience);

  const selectedJob = getJobById(selectedJobId);

  if (!selectedJob) return null;

  // Calculate market value based on job salary range and experience
  const calculateMarketValue = (job: Job, exp: number): number => {
    const { min, max } = job.salaryRange;
    // Linear interpolation: 1년차 = min, 10년차 = max
    const ratio = Math.min(exp / 10, 1);
    return Math.round(min + (max - min) * ratio);
  };

  const marketValue = calculateMarketValue(selectedJob, years);
  const gap = marketValue - currentSalary;
  const isUnderpaid = gap > 0;
  const gapPercent = Math.abs(Math.round((gap / currentSalary) * 100));

  // Get community data
  const reviews = getReviewsForJob(selectedJobId);
  const successStories = getSuccessStoriesForJob(selectedJobId);
  const verifiedReviews = reviews.filter(r => r.verified);

  const formatSalary = (value: number) => value.toLocaleString('ko-KR');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm ring-1 ring-black/5 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h3 className="font-bold text-gray-950">시장가치 분석</h3>
          </div>
          {isVerified && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
              <BadgeCheck className="w-3 h-3" />
              인증됨
            </span>
          )}
        </div>
      </div>

      {/* Job & Experience Selector */}
      <div className="p-4 bg-gray-50">
        <div className="flex gap-3">
          {/* Job Selector */}
          <div className="flex-1 relative">
            <button
              onClick={() => setShowJobSelector(!showJobSelector)}
              className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl text-left hover:border-gray-400 transition-colors shadow-sm"
            >
              <div>
                <p className="text-xs text-gray-500">현재 직무</p>
                <p className="font-medium text-gray-950">{selectedJob.title}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showJobSelector ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showJobSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto"
                >
                  {popularJobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setShowJobSelector(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                        job.id === selectedJobId ? 'bg-blue-50 text-blue-600' : 'text-gray-950'
                      }`}
                    >
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-gray-500">
                        {job.salaryRange.min.toLocaleString()} ~ {job.salaryRange.max.toLocaleString()}만원
                      </p>
                    </button>
                  ))}
                  <Link
                    to="/jobs"
                    className="block w-full p-3 text-center text-blue-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    전체 직업 보기 →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Experience Selector */}
          <div className="w-24">
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 mb-1">경력</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-10 bg-transparent text-gray-950 font-bold text-lg focus:outline-none"
                />
                <span className="text-gray-400 text-sm">년</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Position Bar */}
      <div className="p-4">
        <SalaryPositionBar
          currentSalary={currentSalary}
          marketValue={marketValue}
          salaryRange={selectedJob.salaryRange}
        />
      </div>

      {/* Gap Result */}
      <div className="px-4 pb-4">
        <div
          className={`rounded-xl p-4 ${
            isUnderpaid
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isUnderpaid ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <TrendingUp className="w-5 h-5 text-green-500" />
              )}
              <span className={`text-sm font-medium ${isUnderpaid ? 'text-red-600' : 'text-green-600'}`}>
                {isUnderpaid ? '시장가치보다 낮음' : '시장가치보다 높음'}
              </span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              isUnderpaid ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {isUnderpaid ? '-' : '+'}{gapPercent}%
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">시장가치와의 차이</p>
              <p className={`text-3xl font-black ${isUnderpaid ? 'text-red-600' : 'text-green-600'}`}>
                {isUnderpaid ? '-' : '+'}{formatSalary(Math.abs(gap))}
                <span className="text-sm font-normal text-gray-500 ml-1">만원/년</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">추정 시장가치</p>
              <p className="text-xl font-bold text-blue-600">{formatSalary(marketValue)}만</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Proof Section */}
      <CommunityProof
        jobId={selectedJobId}
        jobTitle={selectedJob.title}
        reviewCount={reviews.length}
        verifiedCount={verifiedReviews.length}
        topReview={verifiedReviews[0]}
        successStory={successStories[0]}
      />

      {/* Upgrade Recommendation */}
      {isUnderpaid && (
        <UpgradeRecommend
          currentJobId={selectedJobId}
          currentSalary={currentSalary}
        />
      )}

      {/* Community CTA */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <p className="text-sm text-gray-600">이 직군에 대해 궁금한 점이 있으신가요?</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/community"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-xl transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            커뮤니티에 질문하기
          </Link>
          <Link
            to={`/career/${selectedJobId}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
          >
            상세 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
