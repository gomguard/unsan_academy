import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, ArrowRight, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SalaryGapCardProps {
  marketValue: number; // in 만원
  currentSalary: number; // in 만원
  isVerified?: boolean;
  targetJob?: string;
}

export function SalaryGapCard({
  marketValue,
  currentSalary,
  isVerified = false,
  targetJob,
}: SalaryGapCardProps) {
  const gap = marketValue - currentSalary;
  const isPositive = gap > 0;
  const gapPercent = Math.abs(Math.round((gap / currentSalary) * 100));

  const formatSalary = (value: number) => {
    return value.toLocaleString('ko-KR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <h3 className="font-bold text-white">시장가치 분석</h3>
        </div>
        {isVerified && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
            <BadgeCheck className="w-3 h-3" />
            인증됨
          </span>
        )}
      </div>

      {/* Main Values */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Market Value */}
        <div className="bg-slate-900/50 rounded-xl p-4">
          <p className="text-sm text-slate-500 mb-1">시장가치 (추정)</p>
          <p className="text-2xl font-black text-cyan-400">
            {formatSalary(marketValue)}
            <span className="text-sm font-normal text-slate-500 ml-1">만원</span>
          </p>
        </div>

        {/* Current Salary */}
        <div className="bg-slate-900/50 rounded-xl p-4">
          <p className="text-sm text-slate-500 mb-1">현재 연봉</p>
          <p className="text-2xl font-black text-white">
            {formatSalary(currentSalary)}
            <span className="text-sm font-normal text-slate-500 ml-1">만원</span>
          </p>
        </div>
      </div>

      {/* Gap Display */}
      <div
        className={`rounded-xl p-4 mb-4 ${
          isPositive
            ? 'bg-red-500/10 border border-red-500/20'
            : 'bg-green-500/10 border border-green-500/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingDown className="w-5 h-5 text-red-400" />
            ) : (
              <TrendingUp className="w-5 h-5 text-green-400" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
              {isPositive ? '시장가치 대비 손실' : '시장가치 대비 이익'}
            </span>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            isPositive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {gapPercent}%
          </span>
        </div>
        <p className={`text-3xl font-black mt-2 ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
          {isPositive ? '-' : '+'}{formatSalary(Math.abs(gap))}
          <span className="text-sm font-normal text-slate-500 ml-1">만원</span>
        </p>
      </div>

      {/* Target Job (if set) */}
      {targetJob && (
        <div className="bg-slate-900/50 rounded-xl p-3 mb-4">
          <p className="text-xs text-slate-500 mb-1">목표 커리어</p>
          <p className="text-sm font-bold text-yellow-400">{targetJob}</p>
        </div>
      )}

      {/* Action Button */}
      <Link
        to="/jobs"
        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white text-sm transition-colors"
      >
        📉 리포트 상세 보기
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
