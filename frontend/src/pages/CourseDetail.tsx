import { useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BentoCard } from '@/components/ui/BentoCard';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
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
  Briefcase,
  MessageSquare,
  ChevronRight,
  Building,
  GraduationCap,
} from 'lucide-react';
import { getCourseById, getAcademyById, getCoursesByAcademy } from '@/lib/educationData';
import { getJobById } from '@/lib/jobDatabase';
import { getReviewsForJob } from '@/lib/careerData';
import { courseCategoryInfo, courseTypeInfo } from '@/types';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">과정을 찾을 수 없습니다</p>
          <Button variant="ghost" onClick={() => navigate('/education')}>
            교육 허브로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const categoryInfo = courseCategoryInfo[course.category];
  const typeInfo = courseTypeInfo[course.type];
  const isFree = course.price === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div
        className="relative pt-4 pb-10"
        style={{
          background: `linear-gradient(135deg, ${categoryInfo.color}08, ${categoryInfo.color}03, transparent)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.03),transparent_50%)]" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-2.5 rounded-xl bg-white/80 text-gray-700 hover:bg-white transition-colors shadow-sm ring-1 ring-black/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-14">
          {/* Academy Badge */}
          <Link
            to={`/education/academy/${academy.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl mb-5 hover:bg-gray-50 transition-colors shadow-sm ring-1 ring-black/5"
          >
            <span className="text-xl">{academy.logo}</span>
            <span className="text-sm font-medium text-gray-700">{academy.name}</span>
            {academy.isPartner && (
              <BadgeCheck className="w-4 h-4 text-cyan-500" />
            )}
          </Link>

          {/* Title */}
          <Heading as="h1" size="2xl" className="mb-4">{course.title}</Heading>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span
              className="px-4 py-1.5 rounded-xl text-sm font-semibold"
              style={{
                backgroundColor: `${categoryInfo.color}20`,
                color: categoryInfo.color,
              }}
            >
              {categoryInfo.icon} {categoryInfo.name}
            </span>
            <span
              className="px-4 py-1.5 rounded-xl text-sm font-semibold"
              style={{
                backgroundColor: `${typeInfo.color}20`,
                color: typeInfo.color,
              }}
            >
              {typeInfo.icon} {typeInfo.name}
            </span>
            {isFree && (
              <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold ring-1 ring-green-500/30">
                무료
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
            {course.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-600 font-medium">{course.rating}</span>
              </div>
            )}
            {course.enrollCount && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {course.enrollCount.toLocaleString()}명 수강
              </div>
            )}
            {academy.location && (
              <div className="flex items-center gap-1.5">
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
          className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-orange-50 pointer-events-none" />
          <div className="relative flex items-center justify-between mb-5">
            <div>
              <Subheading>수강료</Subheading>
              <p className={`text-4xl font-black mt-1 ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
                {isFree ? '무료' : `${course.price.toLocaleString()}만원`}
              </p>
              {course.priceNote && (
                <p className="text-sm text-emerald-600 mt-1">{course.priceNote}</p>
              )}
            </div>
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-gray-900 font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
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
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <BentoCard
          eyebrow="Course Overview"
          title={
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              과정 소개
            </div>
          }
        >
          <p className="text-gray-600 leading-relaxed mt-3">{course.description}</p>
        </BentoCard>

        {/* Certifications */}
        {course.certifications && course.certifications.length > 0 && (
          <BentoCard
            eyebrow="Certifications"
            title={
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                취득 가능 자격증
              </div>
            }
          >
            <div className="space-y-2 mt-3">
              {course.certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-900 font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        )}

        {/* Target Jobs */}
        {targetJobs.length > 0 && (
          <BentoCard
            eyebrow="Career Path"
            title={
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-500" />
                이 과정으로 진출 가능한 직업
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3 mt-3">
              {targetJobs.map(job => (
                <Link
                  key={job.id}
                  to={`/career/${job.id}`}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-200"
                >
                  <p className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {job.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.salaryRange.min.toLocaleString()} ~ {job.salaryRange.max.toLocaleString()}만원
                  </p>
                </Link>
              ))}
            </div>
          </BentoCard>
        )}

        {/* Related Reviews */}
        {relatedReviews.length > 0 && (
          <BentoCard
            eyebrow="Reviews"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  현직자 후기
                </div>
                <Link
                  to="/community"
                  className="text-xs text-amber-600 flex items-center gap-1 hover:text-amber-700"
                >
                  더보기 <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            }
          >
            <div className="space-y-3 mt-3">
              {relatedReviews.map(review => {
                const job = getJobById(review.jobId);
                return (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{review.authorName}</span>
                      <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-gray-500">{job?.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{review.advice}</p>
                  </div>
                );
              })}
            </div>
          </BentoCard>
        )}

        {/* Academy Info */}
        <BentoCard
          eyebrow="Academy"
          title={
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-500" />
              교육기관 정보
            </div>
          }
        >
          <Link
            to={`/education/academy/${academy.id}`}
            className="flex items-center gap-4 p-5 mt-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-200"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm ring-1 ring-black/5">
              {academy.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {academy.name}
                </h3>
                {academy.isPartner && (
                  <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg">
                    파트너
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">{academy.description}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                {academy.location}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600" />
          </Link>
        </BentoCard>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              <Subheading>이 기관의 다른 과정</Subheading>
            </div>
            <div className="space-y-3">
              {relatedCourses.map(c => {
                const cTypeInfo = courseTypeInfo[c.type];
                return (
                  <Link
                    key={c.id}
                    to={`/education/course/${c.id}`}
                    className="flex items-center gap-4 p-5 bg-white shadow-sm ring-1 ring-black/5 hover:ring-amber-400/50 rounded-2xl transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                        {c.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span>{cTypeInfo.icon} {cTypeInfo.name}</span>
                        <span>{c.duration}</span>
                        <span className={c.price === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                          {c.price === 0 ? '무료' : `${c.price}만원`}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
