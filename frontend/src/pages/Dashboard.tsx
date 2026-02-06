import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { MarketValueCard } from '@/components/MarketValueCard';
import { getReviewsWithSalaryGrowth } from '@/lib/careerData';
import { getPopularCourses, getFreeCourses, getAcademyById } from '@/lib/educationData';
import { getJobById } from '@/lib/jobDatabase';
import {
  Settings,
  ChevronRight,
  TrendingUp,
  BadgeCheck,
  Briefcase,
  Star,
  MessageSquare,
  GraduationCap,
  Flame,
  Users,
  DollarSign,
  BookOpen,
  Map,
  Sparkles,
  Clock,
  Bell,
} from 'lucide-react';

export function Dashboard() {
  const { profile, targetJobId } = useStore();
  const [activeSection, setActiveSection] = useState<'feed' | 'reviews' | 'courses'>('feed');

  // Get data for the lounge
  const salaryGrowthReviews = getReviewsWithSalaryGrowth().slice(0, 3);
  const popularCourses = getPopularCourses(4);
  const freeCourses = getFreeCourses().slice(0, 3);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const totalStats = Object.values(profile.stats).reduce((a, b) => a + b, 0);
  const currentSalary = profile.currentSalary || 3500;

  // Mock feed data
  const feedItems = [
    { type: 'review', icon: '💬', text: 'Kim_EV_Tech님이 EV 배터리 진단사 리뷰를 작성했습니다', time: '10분 전', color: 'cyan' },
    { type: 'course', icon: '📚', text: 'EV 고전압 안전교육 과정이 인기를 끌고 있습니다', time: '30분 전', color: 'purple' },
    { type: 'salary', icon: '💰', text: 'PPF 인스톨러 평균 연봉이 8,000만원을 돌파했습니다', time: '1시간 전', color: 'green' },
    { type: 'story', icon: '🌟', text: 'Park_PPF님의 성공 스토리: 세차장 → 1억 연봉', time: '2시간 전', color: 'yellow' },
    { type: 'job', icon: '🔥', text: 'ADAS 캘리브레이션 전문가 수요가 급증하고 있습니다', time: '3시간 전', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="font-bold text-white">Unsan Academy</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link to="/profile" className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Compact Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
              <Briefcase className="w-7 h-7 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{profile.name}</h2>
                {profile.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <p className="text-sm text-slate-400">
                {profile.currentJobTitle || '정비 전문가'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">스킬 자산</p>
              <p className="text-lg font-bold text-cyan-400">{totalStats}</p>
            </div>
          </div>
        </motion.div>

        {/* Market Value Analysis Card */}
        <MarketValueCard
          currentJobId={targetJobId || 'maint_01'}
          currentSalary={currentSalary}
          yearsExperience={3}
          isVerified={profile.isVerified}
        />

        {/* Quick Links Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { to: '/jobs', icon: Map, label: '직업탐색', color: 'yellow' },
            { to: '/education', icon: GraduationCap, label: '교육허브', color: 'purple' },
            { to: '/skill-tree', icon: Sparkles, label: '스킬트리', color: 'cyan' },
            { to: '/community', icon: Users, label: '커뮤니티', color: 'pink' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
            >
              <link.icon className={`w-6 h-6 ${
                link.color === 'yellow' ? 'text-yellow-400' :
                link.color === 'purple' ? 'text-purple-400' :
                link.color === 'cyan' ? 'text-cyan-400' :
                'text-pink-400'
              }`} />
              <span className="text-xs text-slate-400">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'feed', label: '실시간 피드', icon: Flame },
            { id: 'reviews', label: '인기 리뷰', icon: MessageSquare },
            { id: 'courses', label: '추천 교육', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-yellow-500 text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed Section */}
        {activeSection === 'feed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-400">업계 소식</h3>
              <span className="text-xs text-slate-500">실시간 업데이트</span>
            </div>
            {feedItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-xl"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">{item.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Reviews Section */}
        {activeSection === 'reviews' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-400">연봉 상승 후기</h3>
              <Link to="/community" className="text-xs text-yellow-400 flex items-center gap-1">
                더보기 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {salaryGrowthReviews.map((review, i) => {
              const job = getJobById(review.jobId);
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{review.authorName}</span>
                        {review.verified && (
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{job?.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2">{review.title}</p>
                  {review.salaryGrowth && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded text-sm font-bold text-emerald-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      연봉 {review.salaryGrowth}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Courses Section */}
        {activeSection === 'courses' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Free Courses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  무료 교육 과정
                </h3>
                <Link to="/education" className="text-xs text-yellow-400 flex items-center gap-1">
                  더보기 <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {freeCourses.map((course, i) => {
                  const academy = getAcademyById(course.academyId);
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-lg">
                        {academy?.logo || '📚'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{course.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{academy?.name}</span>
                          <span className="text-xs text-green-400 font-bold">무료</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Popular Courses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  인기 교육 과정
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularCourses.map((course, i) => {
                  const academy = getAcademyById(course.academyId);
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl"
                    >
                      <div className="text-lg mb-2">{academy?.logo || '📚'}</div>
                      <p className="text-sm font-medium text-white line-clamp-2 mb-1">{course.title}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-slate-400">{course.rating}</span>
                        </div>
                        <span className={`text-xs font-bold ${course.price === 0 ? 'text-green-400' : 'text-white'}`}>
                          {course.price === 0 ? '무료' : `${course.price}만원`}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Hot Jobs Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white">지금 뜨는 직업</h4>
              <p className="text-sm text-slate-400">EV 배터리 진단사, ADAS 전문가, PPF 인스톨러</p>
            </div>
            <Link to="/jobs" className="p-2 bg-white/10 rounded-lg">
              <ChevronRight className="w-5 h-5 text-white" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
