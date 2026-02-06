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
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">커뮤니티 데이터 기반</p>
            <p className="text-sm text-gray-900 font-medium">
              <span className="text-blue-600">{reviewCount}</span>개 리뷰 ·{' '}
              <span className="text-emerald-600">{verifiedCount}</span>명 인증
            </p>
          </div>
        </div>
        <Link
          to={`/career/${jobId}`}
          className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
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
          className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">현직자 리뷰</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg shrink-0">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">{topReview.authorName}</span>
                {topReview.verified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                )}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: topReview.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                "{topReview.title}"
              </p>
              {topReview.salaryGrowth && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded text-xs text-emerald-700 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  연봉 {topReview.salaryGrowth}
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/career/${jobId}`}
            className="mt-3 block text-center py-2 text-xs text-amber-600 hover:text-amber-700 transition-colors"
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
          className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚀</span>
            <span className="text-xs text-amber-700 font-medium">성공 스토리</span>
          </div>

          <p className="font-bold text-gray-900 mb-2">{successStory.title}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{successStory.summary}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-600">{successStory.salaryChange.split('(')[0]}</span>
              <span className="text-xs text-gray-500">({successStory.totalDuration})</span>
            </div>
            <Link
              to={`/career/${jobId}`}
              className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              스토리 읽기
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* No Data State */}
      {!topReview && !successStory && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-2">아직 이 직군의 리뷰가 없습니다</p>
          <Link
            to="/community"
            className="text-xs text-amber-600 hover:text-amber-700"
          >
            첫 번째 리뷰 작성하기 →
          </Link>
        </div>
      )}
    </div>
  );
}
