import { motion } from 'framer-motion';
import { Check, Camera, Clock } from 'lucide-react';

export interface LogEntry {
  id: string;
  time: string;
  taskType: string;
  taskLabel: string;
  vin: string;
  isVerified: boolean;
  hasPhoto: boolean;
}

interface ActivityLogProps {
  entries: LogEntry[];
  groupByDate?: boolean;
}

const taskEmojis: Record<string, string> = {
  oil: '🛢️',
  tire: '🔧',
  brake: '🛑',
  diag: '🔍',
  filter: '🌬️',
  battery: '🔋',
  other: '📝',
  brake_service: '🛑',
  suspension: '⚙️',
  engine_diag: '🔍',
  ev_battery: '🔋',
  ppf_install: '🛡️',
  detailing: '✨',
};

export function ActivityLog({ entries, groupByDate = true }: ActivityLogProps) {
  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    // Extract date from time (assumes format like "10:32")
    const today = new Date();
    const entryDate = entry.time.includes(':') ? 'today' : entry.time;
    const dateKey = entryDate === 'today' ? '오늘' : entryDate;

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  if (entries.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">아직 기록이 없습니다</p>
        <p className="text-sm text-gray-400 mt-1">위의 양식을 사용하여 첫 번째 작업을 기록하세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedEntries).map(([date, dateEntries]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 px-2">{date}</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Entries */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {dateEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 ${
                  index < dateEntries.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Time */}
                <span className="text-xs text-gray-400 font-mono w-12">{entry.time}</span>

                {/* Icon */}
                <span className="text-lg">{taskEmojis[entry.taskType] || '📝'}</span>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium truncate">{entry.taskLabel}</p>
                  <p className="text-xs text-gray-500">VIN: {entry.vin}</p>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center gap-2">
                  {entry.hasPhoto && (
                    <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <Camera className="w-3 h-3 text-purple-600" />
                    </span>
                  )}
                  {entry.isVerified ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-gray-400" />
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
