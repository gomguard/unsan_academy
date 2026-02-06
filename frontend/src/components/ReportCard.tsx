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
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
            <span className="text-gray-700 font-medium truncate">{report.target_job_title}</span>
          </div>
          <VerificationBadge status={report.status} />
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-gray-500">
            연봉 {report.current_salary.toLocaleString()}만원
          </span>
          <span className="text-gray-300">|</span>
          <span className={isUnderpaid ? 'text-red-500' : 'text-green-500'}>
            {isUnderpaid ? '저평가' : '적정/고평가'} {Math.abs(report.gap_percent)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          연봉 리포트
        </h4>
        <VerificationBadge status={report.status} />
      </div>

      <p className="text-gray-500 text-sm mb-3">{report.target_job_title}</p>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <p className="text-gray-500 text-xs">현재 연봉</p>
          <p className="text-gray-900 font-bold">{report.current_salary.toLocaleString()}만원</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">시장 가치</p>
          <p className="text-amber-600 font-bold">{report.estimated_salary.toLocaleString()}만원</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">경력</p>
          <p className="text-gray-900">{report.years_experience}년차</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">시장 내 위치</p>
          <p className={isUnderpaid ? 'text-red-500' : 'text-green-500'}>
            상위 {100 - report.percentile}%
          </p>
        </div>
      </div>

      {/* Gap visualization */}
      <div
        className={cn(
          'p-3 rounded-lg',
          isUnderpaid
            ? 'bg-red-50 border border-red-200'
            : 'bg-green-50 border border-green-200'
        )}
      >
        <div className="flex items-center gap-2">
          {isUnderpaid ? (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-red-600 font-bold text-sm">
                시장가치보다 {Math.abs(report.salary_gap).toLocaleString()}만원 낮음
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-bold text-sm">
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
