import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Shield, Clock, Check, AlertCircle } from 'lucide-react';
import type { SalaryReport, VerificationStatus } from '@/types';
import { verificationStatusInfo } from '@/types';
import { cn } from '@/lib/utils';

interface ReportSelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reports: SalaryReport[];
  selectedReportId: number | null;
  onSelect: (report: SalaryReport | null) => void;
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

export function ReportSelectDrawer({
  isOpen,
  onClose,
  reports,
  selectedReportId,
  onSelect,
}: ReportSelectDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                연봉 리포트 첨부
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Report List */}
            <div className="p-4 space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-10">
                  <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">저장된 리포트가 없습니다.</p>
                  <p className="text-slate-500 text-sm mt-2">
                    직업 상세에서 연봉 계산 후 저장해주세요.
                  </p>
                </div>
              ) : (
                <>
                  {/* Clear selection option */}
                  <button
                    onClick={() => onSelect(null)}
                    className={cn(
                      'w-full p-3 rounded-xl text-left transition-all',
                      !selectedReportId
                        ? 'bg-yellow-400/20 border-2 border-yellow-400'
                        : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                    )}
                  >
                    <span className="text-slate-400">리포트 첨부 안함</span>
                  </button>

                  {reports.map((report) => {
                    const isUnderpaid = report.salary_gap > 0;
                    return (
                      <button
                        key={report.id}
                        onClick={() => onSelect(report)}
                        className={cn(
                          'w-full p-4 rounded-xl text-left transition-all',
                          selectedReportId === report.id
                            ? 'bg-yellow-400/20 border-2 border-yellow-400'
                            : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white">{report.target_job_title}</span>
                          <VerificationBadge status={report.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-500">현재 연봉</span>
                            <p className="text-white font-medium">
                              {report.current_salary.toLocaleString()}만원
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">시장 가치</span>
                            <p className="text-yellow-300 font-medium">
                              {report.estimated_salary.toLocaleString()}만원
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className={isUnderpaid ? 'text-red-400' : 'text-green-400'}>
                            {isUnderpaid ? '저평가' : '고평가'} {Math.abs(report.gap_percent)}%
                          </span>
                          <span className="text-slate-500">
                            {report.years_experience}년차 | 상위 {100 - report.percentile}%
                          </span>
                        </div>

                        {selectedReportId === report.id && (
                          <div className="mt-2 flex items-center gap-1 text-yellow-400 text-xs font-bold">
                            <Check className="w-4 h-4" />
                            선택됨
                          </div>
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
