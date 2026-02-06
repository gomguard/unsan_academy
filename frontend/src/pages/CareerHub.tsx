import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  Building2,
  DollarSign,
  ChevronRight,
  Star,
  CheckCircle,
  Route,
  MessageSquare,
  Flame,
  GraduationCap,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { getJobById, groupInfo, demandInfo } from '@/lib/jobDatabase';
import { getCoursesForJob, getAcademyById, formatCoursePrice } from '@/lib/educationData';
import { getReviewsForJob, getSuccessStoriesForJob, type SuccessStory } from '@/lib/careerData';
import { SalaryChart } from '@/components/SalaryChart';
import { ReviewCard } from '@/components/ReviewCard';

type TabId = 'overview' | 'education' | 'salary' | 'community';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: '개요', icon: Route },
  { id: 'education', label: '교육', icon: BookOpen },
  { id: 'salary', label: '연봉', icon: DollarSign },
  { id: 'community', label: '커뮤니티', icon: Users },
];

export function CareerHub() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const job = useMemo(() => (jobId ? getJobById(jobId) : null), [jobId]);
  const courses = useMemo(() => (jobId ? getCoursesForJob(jobId) : []), [jobId]);
  const reviews = useMemo(() => (jobId ? getReviewsForJob(jobId) : []), [jobId]);
  const successStories = useMemo(() => (jobId ? getSuccessStoriesForJob(jobId) : []), [jobId]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">직업을 찾을 수 없습니다</p>
          <button
            onClick={() => navigate('/jobs')}
            className="text-amber-600 hover:underline"
          >
            직업 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const demandColors: Record<string, string> = {
    Explosive: 'text-red-600 bg-red-100',
    High: 'text-orange-600 bg-orange-100',
    Stable: 'text-green-600 bg-green-100',
    Declining: 'text-gray-600 bg-gray-100',
  };

  const avgSalary = Math.round((job.salaryRange.min + job.salaryRange.max) / 2);
  const jobGroupInfo = groupInfo[job.group];
  const jobDemandInfo = demandInfo[job.marketDemand];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-white to-gray-50 pt-4 pb-8 border-b border-gray-200">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-2.5 rounded-xl bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm ring-1 ring-black/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
              {jobGroupInfo.icon} {jobGroupInfo.name}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${demandColors[job.marketDemand]}`}>
              {jobDemandInfo.icon} 수요 {jobDemandInfo.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-950 mb-2">{job.title}</h1>
          <p className="text-gray-500 text-sm mb-4">{job.description}</p>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm ring-1 ring-black/5">
              <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-600">{avgSalary.toLocaleString()}만</p>
              <p className="text-xs text-gray-500">평균 연봉</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm ring-1 ring-black/5">
              <Route className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-600">{job.prerequisiteJobs?.length || 0}개</p>
              <p className="text-xs text-gray-500">선행 직업</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm ring-1 ring-black/5">
              <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-purple-600">{courses.length}개</p>
              <p className="text-xs text-gray-500">관련 교육</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors relative ${
                    isActive ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Tags & Skills */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  특징 및 키워드
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              {/* Required Stats */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  필요 스탯
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(job.requiredStats).map(([key, value]) => {
                    const statLabels: Record<string, string> = {
                      T: '기술',
                      H: '손기술',
                      S: '운영',
                      A: '미학',
                      B: '비즈',
                    };
                    const statColors: Record<string, string> = {
                      T: 'text-cyan-600',
                      H: 'text-pink-600',
                      S: 'text-lime-600',
                      A: 'text-purple-600',
                      B: 'text-amber-600',
                    };
                    return (
                      <div key={key} className="bg-white rounded-lg p-2 text-center shadow-sm ring-1 ring-black/5">
                        <p className={`text-lg font-bold ${statColors[key]}`}>{value}</p>
                        <p className="text-xs text-gray-500">{statLabels[key]}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Hiring Companies */}
              {job.hiringCompanies && job.hiringCompanies.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    채용 기업
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {job.hiringCompanies.map((company, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm ring-1 ring-black/5"
                      >
                        <span className="text-2xl">🏢</span>
                        <span className="text-gray-700">{company}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Success Stories Preview */}
              {successStories.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    성공 스토리
                  </h3>
                  {successStories.slice(0, 1).map((story) => (
                    <SuccessStoryCard key={story.id} story={story} />
                  ))}
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                추천 교육 과정
              </h3>

              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course) => {
                    const academy = getAcademyById(course.academyId);
                    return (
                      <div
                        key={course.id}
                        className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-black/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-500">{academy?.name}</p>
                          </div>
                          {academy?.isPartner && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-medium">
                              파트너
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400" />
                            {course.rating}
                          </span>
                          <span
                            className={
                              course.price === 0
                                ? 'text-emerald-600 font-medium'
                                : 'text-gray-900 font-medium'
                            }
                          >
                            {formatCoursePrice(course.price)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {course.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                          과정 상세보기
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>등록된 교육 과정이 없습니다</p>
                  <Link to="/education" className="text-amber-600 hover:underline mt-2 inline-block">
                    전체 교육 과정 보기
                  </Link>
                </div>
              )}

              <Link
                to="/education"
                className="block text-center py-3 text-amber-600 hover:text-amber-700 transition-colors"
              >
                전체 교육 허브 보기 →
              </Link>
            </motion.div>
          )}

          {activeTab === 'salary' && (
            <motion.div
              key="salary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Salary Range */}
              <section className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  연봉 범위
                </h3>
                <SalaryChart job={job} />
              </section>

              {/* Salary Stats */}
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-black/5">
                  <p className="text-sm text-gray-500 mb-1">최저 연봉</p>
                  <p className="text-xl font-bold text-gray-900">
                    {job.salaryRange.min.toLocaleString()}만원
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-black/5">
                  <p className="text-sm text-gray-500 mb-1">최고 연봉</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {job.salaryRange.max.toLocaleString()}만원
                  </p>
                </div>
              </section>

              {/* Salary Reviews */}
              {reviews.filter((r) => r.salaryGrowth).length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    연봉 성장 후기
                  </h3>
                  <div className="space-y-3">
                    {reviews
                      .filter((r) => r.salaryGrowth)
                      .slice(0, 2)
                      .map((review) => (
                        <div
                          key={review.id}
                          className="bg-white rounded-lg p-4 shadow-sm ring-1 ring-black/5"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{review.authorName}</span>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {review.previousJob} → {review.authorTitle}
                          </p>
                          <p className="text-2xl font-bold text-emerald-600">
                            {review.salaryGrowth}
                          </p>
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Reviews */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  현직자 리뷰 ({reviews.length})
                </h3>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>아직 리뷰가 없습니다</p>
                    <p className="text-sm mt-1">첫 번째 리뷰를 작성해보세요!</p>
                  </div>
                )}
              </section>

              {/* Success Stories */}
              {successStories.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    성공 스토리 ({successStories.length})
                  </h3>
                  <div className="space-y-4">
                    {successStories.map((story) => (
                      <SuccessStoryCard key={story.id} story={story} />
                    ))}
                  </div>
                </section>
              )}

              {/* Community Link */}
              <Link
                to="/community"
                className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-center transition-colors"
              >
                커뮤니티에서 더 많은 이야기 보기 →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="mt-8">
          <Link
            to="/skill-tree"
            className="block w-full py-4 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-xl text-center transition-colors shadow-lg shadow-amber-500/20"
          >
            🗺️ 이 커리어 패스 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}

// Success Story Card Component
function SuccessStoryCard({ story }: { story: SuccessStory }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
          {story.authorAvatar || '🌟'}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{story.authorName}</p>
          <p className="text-sm text-gray-500">{story.totalDuration} 여정</p>
        </div>
      </div>

      <h4 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h4>
      <p className="text-sm text-gray-500 mb-4">{story.summary}</p>

      {/* Journey Steps */}
      <div className="space-y-2 mb-4">
        {story.journeySteps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{step.jobTitle}</p>
              <p className="text-xs text-gray-500">
                {step.duration}
                {step.salary && ` · ${step.salary}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Salary Change */}
      <div className="bg-emerald-50 rounded-lg p-3 mb-4 border border-emerald-200">
        <p className="text-xs text-emerald-700 mb-1">연봉 변화</p>
        <p className="text-lg font-bold text-emerald-600">{story.salaryChange}</p>
      </div>

      {/* Key Lessons */}
      <div>
        <p className="text-xs text-gray-500 mb-2">핵심 교훈</p>
        <ul className="space-y-1">
          {story.keyLessons.map((lesson, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-amber-500">•</span>
              {lesson}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
