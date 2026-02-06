import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  MapPin,
  ExternalLink,
  BadgeCheck,
  Award,
  BookOpen,
  CheckCircle,
  Calendar,
  DollarSign,
  Briefcase,
  MessageSquare,
  ChevronRight,
  Building,
  GraduationCap,
} from 'lucide-react';
import { getCourseById, getAcademyById, getCoursesByAcademy, formatCoursePrice } from '@/lib/educationData';
import { getJobById } from '@/lib/jobDatabase';
import { getReviewsForJob } from '@/lib/careerData';
import { courseCategoryInfo, courseTypeInfo } from '@/types';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = useMemo(() => (courseId ? getCourseById(courseId) : null), [courseId]);
  const academy = useMemo(() => (course ? getAcademyById(course.academyId) : null), [course]);
  const relatedCourses = useMemo(() => {
    if (!course || !academy) return [];
    return getCoursesByAcademy(academy.id).filter(c => c.id !== course.id).slice(0, 3);
  }, [course, academy]);

  // Get target jobs info
  const targetJobs = useMemo(() => {
    if (!course) return [];
    return course.targetJobIds
      .map(id => getJobById(id))
      .filter((job): job is NonNullable<typeof job> => job !== undefined)
      .slice(0, 4);
  }, [course]);

  // Get reviews for related jobs
  const relatedReviews = useMemo(() => {
    if (!course) return [];
    return course.targetJobIds
      .flatMap(id => getReviewsForJob(id))
      .filter(r => r.verified)
      .slice(0, 2);
  }, [course]);

  if (!course || !academy) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">과정을 찾을 수 없습니다</p>
          <button
            onClick={() => navigate('/education')}
            className="text-yellow-400 hover:underline"
          >
            교육 허브로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = courseCategoryInfo[course.category];
  const typeInfo = courseTypeInfo[course.type];
  const isFree = course.price === 0;

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div
        className="relative pt-4 pb-8"
        style={{
          background: `linear-gradient(135deg, ${categoryInfo.color}20, ${categoryInfo.color}05)`,
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12">
          {/* Academy Badge */}
          <Link
            to={`/education/academy/${academy.id}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full mb-4 hover:bg-slate-700 transition-colors"
          >
            <span className="text-lg">{academy.logo}</span>
            <span className="text-sm text-slate-300">{academy.name}</span>
            {academy.isPartner && (
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
            )}
          </Link>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">{course.title}</h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${categoryInfo.color}30`,
                color: categoryInfo.color,
              }}
            >
              {categoryInfo.icon} {categoryInfo.name}
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${typeInfo.color}30`,
                color: typeInfo.color,
              }}
            >
              {typeInfo.icon} {typeInfo.name}
            </span>
            {isFree && (
              <span className="px-3 py-1 bg-green-500/30 text-green-400 rounded-full text-sm font-bold">
                무료
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
            {course.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-medium">{course.rating}</span>
              </div>
            )}
            {course.enrollCount && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.enrollCount.toLocaleString()}명 수강
              </div>
            )}
            {academy.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {academy.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">수강료</p>
              <p className={`text-3xl font-black ${isFree ? 'text-green-400' : 'text-white'}`}>
                {isFree ? '무료' : `${course.price.toLocaleString()}만원`}
              </p>
              {course.priceNote && (
                <p className="text-sm text-emerald-400 mt-1">{course.priceNote}</p>
              )}
            </div>
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-colors"
            >
              수강 신청하기
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {course.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
        >
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            과정 소개
          </h2>
          <p className="text-slate-300 leading-relaxed">{course.description}</p>
        </motion.div>

        {/* Certifications */}
        {course.certifications && course.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
          >
            <h2 className="font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              취득 가능 자격증
            </h2>
            <div className="space-y-2">
              {course.certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Target Jobs */}
        {targetJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
          >
            <h2 className="font-bold text-white mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              이 과정으로 진출 가능한 직업
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {targetJobs.map(job => (
                <Link
                  key={job.id}
                  to={`/career/${job.id}`}
                  className="p-3 bg-slate-900/50 hover:bg-slate-700 rounded-xl transition-colors group"
                >
                  <p className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                    {job.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {job.salaryRange.min.toLocaleString()} ~ {job.salaryRange.max.toLocaleString()}만원
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Reviews */}
        {relatedReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                현직자 후기
              </h2>
              <Link
                to="/community"
                className="text-xs text-yellow-400 flex items-center gap-1"
              >
                더보기 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {relatedReviews.map(review => {
                const job = getJobById(review.jobId);
                return (
                  <div key={review.id} className="p-3 bg-slate-900/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">{review.authorName}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-slate-500">{job?.title}</span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2">{review.advice}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Academy Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
        >
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-400" />
            교육기관 정보
          </h2>
          <Link
            to={`/education/academy/${academy.id}`}
            className="flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-700 rounded-xl transition-colors group"
          >
            <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-3xl">
              {academy.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {academy.name}
                </h3>
                {academy.isPartner && (
                  <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">
                    파트너
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 line-clamp-1">{academy.description}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                {academy.location}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-yellow-400" />
          </Link>
        </motion.div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              이 기관의 다른 과정
            </h2>
            <div className="space-y-3">
              {relatedCourses.map(c => {
                const cTypeInfo = courseTypeInfo[c.type];
                return (
                  <Link
                    key={c.id}
                    to={`/education/course/${c.id}`}
                    className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                        {c.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>{cTypeInfo.icon} {cTypeInfo.name}</span>
                        <span>{c.duration}</span>
                        <span className={c.price === 0 ? 'text-green-400' : 'text-white'}>
                          {c.price === 0 ? '무료' : `${c.price}만원`}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
