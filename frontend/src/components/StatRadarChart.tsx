import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import type { Stats, StatType } from '@/types';
import { statColors, statLabels, statLightBgColors, cn } from '@/lib/utils';

interface StatRadarChartProps {
  stats: Stats;
  animate?: boolean;
}

export function StatRadarChart({ stats, animate = true }: StatRadarChartProps) {
  const data = (Object.entries(stats) as [StatType, number][]).map(([key, value]) => ({
    stat: statLabels[key].ko,
    value,
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full aspect-square max-w-[280px] mx-auto"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="stat"
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.2}
            animationDuration={animate ? 800 : 0}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

interface StatBarProps {
  statType: StatType;
  value: number;
}

export function StatBar({ statType, value }: StatBarProps) {
  const label = statLabels[statType];
  const color = statColors[statType];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700">
          <span
            className={cn(
              'w-6 h-6 rounded-lg flex items-center justify-center text-xs',
              statLightBgColors[statType]
            )}
          >
            {statLabels[statType].en.charAt(0)}
          </span>
          <span className="font-medium">{label.ko}</span>
          <span className="text-gray-400 text-xs">{label.desc}</span>
        </span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
