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
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
      />
    ));
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">
            {review.authorAvatar || '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-sm">{review.authorName}</span>
              {review.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">{review.authorTitle}</p>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(review.rating)}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-300 mt-3 line-clamp-2">{review.content}</p>
        {review.salaryGrowth && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded text-xs text-emerald-400">
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
      className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">
            {review.authorAvatar || '👤'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{review.authorName}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full text-xs text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  인증됨
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">{review.authorTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold text-white mt-4">{review.title}</h4>

      {/* Content */}
      <div className="relative mt-3">
        <Quote className="absolute -left-1 -top-1 w-5 h-5 text-slate-600" />
        <p className="text-slate-300 pl-5">{review.content}</p>
      </div>

      {/* Career Info */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {review.previousJob && (
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500">이전 직업</p>
            <p className="text-sm text-white font-medium">{review.previousJob}</p>
          </div>
        )}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-slate-500">현직 경력</p>
          <p className="text-sm text-white font-medium">{review.yearsInRole}년차</p>
        </div>
        {review.salaryGrowth && (
          <div className="bg-emerald-500/10 rounded-lg p-3 col-span-2">
            <p className="text-xs text-emerald-400">연봉 변화</p>
            <p className="text-lg text-emerald-400 font-bold">{review.salaryGrowth}</p>
          </div>
        )}
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm font-medium text-emerald-400 mb-2">장점</p>
          <ul className="space-y-1">
            {review.pros.map((pro, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-red-400 mb-2">단점</p>
          <ul className="space-y-1">
            {review.cons.map((con, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">-</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Advice */}
      <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <p className="text-xs text-yellow-500 font-medium mb-1">조언</p>
        <p className="text-sm text-yellow-200">{review.advice}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
        <span className="text-xs text-slate-500">{review.createdAt}</span>
        <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>도움됨 {review.helpful}</span>
        </button>
      </div>
    </motion.div>
  );
}
