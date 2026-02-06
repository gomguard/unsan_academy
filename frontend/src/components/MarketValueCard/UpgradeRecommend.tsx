import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, Zap, Award } from 'lucide-react';
import { jobDatabase, getJobById, type Job } from '@/lib/jobDatabase';
import { getCoursesForJob } from '@/lib/educationData';

interface UpgradeRecommendProps {
  currentJobId: string;
  currentSalary: number;
}

// Find potential upgrade paths from current job
function findUpgradePaths(currentJobId: string): Job[] {
  // Find jobs that have currentJobId as a prerequisite
  const upgrades = jobDatabase.filter(job =>
    job.prerequisiteJobs?.includes(currentJobId)
  );

  // Sort by salary potential (max salary)
  return upgrades.sort((a, b) => b.salaryRange.max - a.salaryRange.max).slice(0, 2);
}

// Find high-value transition jobs (blue ocean)
function findBlueOceanJobs(): Job[] {
  return jobDatabase
    .filter(job =>
      (job.marketDemand === 'Explosive' || job.marketDemand === 'High') &&
      job.salaryRange.max >= 6000
    )
    .sort((a, b) => b.salaryRange.max - a.salaryRange.max)
    .slice(0, 2);
}

export function UpgradeRecommend({ currentJobId, currentSalary }: UpgradeRecommendProps) {
  const currentJob = getJobById(currentJobId);
  const upgradePaths = findUpgradePaths(currentJobId);
  const blueOceanJobs = findBlueOceanJobs();

  // Combine and deduplicate
  const recommendations = [
    ...upgradePaths.map(job => ({ ...job, type: 'upgrade' as const })),
    ...blueOceanJobs
      .filter(job => !upgradePaths.find(u => u.id === job.id) && job.id !== currentJobId)
      .slice(0, 2 - upgradePaths.length)
      .map(job => ({ ...job, type: 'blueocean' as const })),
  ].slice(0, 2);

  if (recommendations.length === 0) return null;

  const formatSalary = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(1)}억`;
    return `${value.toLocaleString()}만`;
  };

  return (
    <div className="px-4 pb-4">
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-white">연봉 상승 추천 경로</h4>
        </div>

        <div className="space-y-3">
          {recommendations.map((job, index) => {
            const salaryIncrease = job.salaryRange.max - currentSalary;
            const courses = getCoursesForJob(job.id);
            const hasCourse = courses.length > 0;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/career/${job.id}`}
                  className="block p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {job.type === 'blueocean' ? (
                        <Zap className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-xs text-slate-500">
                        {job.type === 'blueocean' ? '블루오션' : '다음 단계'}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">
                      +{formatSalary(salaryIncrease)} 가능
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        연봉 {formatSalary(job.salaryRange.min)} ~ {formatSalary(job.salaryRange.max)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                  </div>

                  {/* Quick info */}
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-700/50">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      job.marketDemand === 'Explosive'
                        ? 'bg-red-500/20 text-red-400'
                        : job.marketDemand === 'High'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      수요 {job.marketDemand === 'Explosive' ? '급상승' : job.marketDemand === 'High' ? '높음' : '안정'}
                    </span>
                    {hasCourse && (
                      <span className="text-xs text-purple-400 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        교육과정 {courses.length}개
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all paths */}
        <Link
          to="/skill-tree"
          className="mt-3 flex items-center justify-center gap-2 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          전체 커리어 경로 보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
