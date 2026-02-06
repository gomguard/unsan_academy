import { motion } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle, Quote } from 'lucide-react';
import type { CareerReview } from '@/lib/careerData';

interface ReviewCardProps {
  review: CareerReview;
  compact?: boolean;
}

export function ReviewCard({ review, compact = false }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-black/5"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
            {review.authorAvatar || '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 text-sm">{review.authorName}</span>
              {review.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{review.authorTitle}</p>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(review.rating)}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{review.content}</p>
        {review.salaryGrowth && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded text-xs text-emerald-700">
            연봉 {review.salaryGrowth}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
            {review.authorAvatar || '👤'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{review.authorName}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full text-xs text-emerald-700">
                  <CheckCircle className="w-3 h-3" />
                  인증됨
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{review.authorTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold text-gray-900 mt-4">{review.title}</h4>

      {/* Content */}
      <div className="relative mt-3">
        <Quote className="absolute -left-1 -top-1 w-5 h-5 text-gray-300" />
        <p className="text-gray-600 pl-5">{review.content}</p>
      </div>

      {/* Career Info */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {review.previousJob && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">이전 직업</p>
            <p className="text-sm text-gray-900 font-medium">{review.previousJob}</p>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">현직 경력</p>
          <p className="text-sm text-gray-900 font-medium">{review.yearsInRole}년차</p>
        </div>
        {review.salaryGrowth && (
          <div className="bg-emerald-50 rounded-lg p-3 col-span-2 border border-emerald-200">
            <p className="text-xs text-emerald-700">연봉 변화</p>
            <p className="text-lg text-emerald-600 font-bold">{review.salaryGrowth}</p>
          </div>
        )}
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm font-medium text-emerald-600 mb-2">장점</p>
          <ul className="space-y-1">
            {review.pros.map((pro, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-red-500 mb-2">단점</p>
          <ul className="space-y-1">
            {review.cons.map((con, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">-</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Advice */}
      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-xs text-amber-700 font-medium mb-1">조언</p>
        <p className="text-sm text-amber-800">{review.advice}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">{review.createdAt}</span>
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>도움됨 {review.helpful}</span>
        </button>
      </div>
    </motion.div>
  );
}
