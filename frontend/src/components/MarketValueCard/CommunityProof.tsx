import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Star, BadgeCheck, TrendingUp, ChevronRight, MessageSquare } from 'lucide-react';
import type { CareerReview, SuccessStory } from '@/lib/careerData';

interface CommunityProofProps {
  jobId: string;
  jobTitle: string;
  reviewCount: number;
  verifiedCount: number;
  topReview?: CareerReview;
  successStory?: SuccessStory;
}

export function CommunityProof({
  jobId,
  jobTitle,
  reviewCount,
  verifiedCount,
  topReview,
  successStory,
}: CommunityProofProps) {
  return (
    <div className="px-4 pb-4 space-y-3">
      {/* Data Source Badge */}
      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">커뮤니티 데이터 기반</p>
            <p className="text-sm text-white font-medium">
              <span className="text-cyan-400">{reviewCount}</span>개 리뷰 ·{' '}
              <span className="text-emerald-400">{verifiedCount}</span>명 인증
            </p>
          </div>
        </div>
        <Link
          to={`/career/${jobId}`}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          전체 보기
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Top Review Preview */}
      {topReview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400">현직자 리뷰</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg shrink-0">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white text-sm">{topReview.authorName}</span>
                {topReview.verified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: topReview.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-300 line-clamp-2 mb-2">
                "{topReview.title}"
              </p>
              {topReview.salaryGrowth && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded text-xs text-emerald-400 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  연봉 {topReview.salaryGrowth}
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/career/${jobId}`}
            className="mt-3 block text-center py-2 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            리뷰 {reviewCount}개 더 보기 →
          </Link>
        </motion.div>
      )}

      {/* Success Story Preview */}
      {successStory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚀</span>
            <span className="text-xs text-yellow-400 font-medium">성공 스토리</span>
          </div>

          <p className="font-bold text-white mb-2">{successStory.title}</p>
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">{successStory.summary}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-400">{successStory.salaryChange.split('(')[0]}</span>
              <span className="text-xs text-slate-500">({successStory.totalDuration})</span>
            </div>
            <Link
              to={`/career/${jobId}`}
              className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
            >
              스토리 읽기
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* No Data State */}
      {!topReview && !successStory && (
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
          <p className="text-sm text-slate-400 mb-2">아직 이 직군의 리뷰가 없습니다</p>
          <Link
            to="/community"
            className="text-xs text-yellow-400 hover:text-yellow-300"
          >
            첫 번째 리뷰 작성하기 →
          </Link>
        </div>
      )}
    </div>
  );
}
