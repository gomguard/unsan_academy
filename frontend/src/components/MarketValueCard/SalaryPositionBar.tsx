import { motion } from 'framer-motion';
import type { SalaryRange } from '@/lib/jobDatabase';

interface SalaryPositionBarProps {
  currentSalary: number;
  marketValue: number;
  salaryRange: SalaryRange;
}

export function SalaryPositionBar({
  currentSalary,
  marketValue,
  salaryRange,
}: SalaryPositionBarProps) {
  const { min, max } = salaryRange;
  const range = max - min;

  // Calculate positions (0-100%)
  const currentPosition = Math.max(0, Math.min(100, ((currentSalary - min) / range) * 100));
  const marketPosition = Math.max(0, Math.min(100, ((marketValue - min) / range) * 100));

  // Percentile markers
  const percentiles = [
    { label: '하위 25%', position: 25, value: Math.round(min + range * 0.25) },
    { label: '중간값', position: 50, value: Math.round(min + range * 0.5) },
    { label: '상위 25%', position: 75, value: Math.round(min + range * 0.75) },
  ];

  const formatSalary = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}억`;
    }
    return `${value.toLocaleString()}만`;
  };

  return (
    <div className="space-y-3">
      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatSalary(min)}</span>
        <span>{formatSalary(max)}</span>
      </div>

      {/* Bar Container */}
      <div className="relative h-12">
        {/* Background Bar */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* Gradient fill to market value */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${marketPosition}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
          />
        </div>

        {/* Percentile Markers */}
        {percentiles.map((p) => (
          <div
            key={p.position}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${p.position}%` }}
          >
            <div className="w-0.5 h-5 bg-gray-300 -translate-x-1/2" />
          </div>
        ))}

        {/* Current Salary Marker */}
        <motion.div
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${currentPosition}%`, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded shadow-lg whitespace-nowrap">
            내 연봉
          </div>
          <div className="w-0.5 flex-1 bg-gray-800" />
          <div className="w-3 h-3 bg-gray-800 rounded-full border-2 border-white shadow" />
        </motion.div>

        {/* Market Value Marker */}
        <motion.div
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${marketPosition}%`, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded shadow-lg whitespace-nowrap">
            시장가치
          </div>
          <div className="w-0.5 flex-1 bg-blue-500" />
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />
        </motion.div>
      </div>

      {/* Percentile Labels */}
      <div className="flex justify-between px-6">
        {percentiles.map((p) => (
          <div key={p.position} className="text-center">
            <p className="text-[10px] text-gray-500">{p.label}</p>
            <p className="text-xs text-gray-600 font-medium">{formatSalary(p.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
