import { TrendingUp, TrendingDown, Shield, Clock, AlertCircle } from 'lucide-react';
import type { SalaryReport, VerificationStatus } from '@/types';
import { verificationStatusInfo } from '@/types';
import { cn } from '@/lib/utils';

interface ReportCardProps {
  report: SalaryReport;
  compact?: boolean;
}

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const info = verificationStatusInfo[status];
  return (
    <span
      className={cn('px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1', info.bgColor)}
      style={{ color: info.color }}
    >
      {status === 'Verified' && <Shield className="w-3 h-3" />}
      {status === 'Pending' && <Clock className="w-3 h-3" />}
      {status === 'Rejected' && <AlertCircle className="w-3 h-3" />}
      {info.label}
    </span>
  );
}

export function ReportCard({ report, compact = false }: ReportCardProps) {
  const isUnderpaid = report.salary_gap > 0;

  if (compact) {
    return (
      <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-400 flex-shrink-0" />
            <span className="text-slate-300 font-medium truncate">{report.target_job_title}</span>
          </div>
          <VerificationBadge status={report.status} />
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-slate-400">
            연봉 {report.current_salary.toLocaleString()}만원
          </span>
          <span className="text-slate-600">|</span>
          <span className={isUnderpaid ? 'text-red-400' : 'text-green-400'}>
            {isUnderpaid ? '저평가' : '적정/고평가'} {Math.abs(report.gap_percent)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          연봉 리포트
        </h4>
        <VerificationBadge status={report.status} />
      </div>

      <p className="text-slate-400 text-sm mb-3">{report.target_job_title}</p>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <p className="text-slate-500 text-xs">현재 연봉</p>
          <p className="text-white font-bold">{report.current_salary.toLocaleString()}만원</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">시장 가치</p>
          <p className="text-yellow-300 font-bold">{report.estimated_salary.toLocaleString()}만원</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">경력</p>
          <p className="text-white">{report.years_experience}년차</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">시장 내 위치</p>
          <p className={isUnderpaid ? 'text-red-400' : 'text-green-400'}>
            상위 {100 - report.percentile}%
          </p>
        </div>
      </div>

      {/* Gap visualization */}
      <div
        className={cn(
          'p-3 rounded-lg',
          isUnderpaid
            ? 'bg-red-500/10 border border-red-500/30'
            : 'bg-green-500/10 border border-green-500/30'
        )}
      >
        <div className="flex items-center gap-2">
          {isUnderpaid ? (
            <>
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-bold text-sm">
                시장가치보다 {Math.abs(report.salary_gap).toLocaleString()}만원 낮음
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold text-sm">
                {report.salary_gap === 0
                  ? '시장가치와 일치'
                  : `시장가치를 ${Math.abs(report.salary_gap).toLocaleString()}만원 상회`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
