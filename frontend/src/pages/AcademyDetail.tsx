import { useMemo, useState, useEffect } from 'react';
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
  GraduationCap,
  Globe,
  Filter,
} from 'lucide-react';
import { getAcademyById, getCoursesByAcademy } from '@/lib/educationData';
import { courseCategoryInfo, courseTypeInfo, type CourseCategory, type CourseType } from '@/types';
import type { Course } from '@/types';

function CourseListItem({ course }: { course: Course }) {
  const categoryInfo = courseCategoryInfo[course.category];
  const typeInfo = courseTypeInfo[course.type];
  const isFree = course.price === 0;

  return (
    <Link
      to={`/education/course/${course.id}`}
      className="block p-5 bg-white shadow-sm ring-1 ring-black/5 hover:ring-amber-400/50 rounded-2xl transition-all group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${categoryInfo.color}15` }}
        >
          {categoryInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{
                backgroundColor: `${typeInfo.color}15`,
                color: typeInfo.color,
              }}
            >
              {typeInfo.icon} {typeInfo.name}
            </span>
            {isFree && (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg font-bold">
                무료
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1 mb-3">{course.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {course.duration}
            </div>
            {course.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-amber-600">{course.rating}</span>
              </div>
            )}
            {course.enrollCount && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {course.enrollCount.toLocaleString()}명
              </div>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-bold text-lg ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
            {isFree ? '무료' : `${course.price}만원`}
          </p>
          {course.priceNote && (
            <p className="text-xs text-gray-500 mt-0.5">{course.priceNote}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AcademyDetail() {
  const { academyId } = useParams<{ academyId: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<CourseType | 'all'>('all');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [academyId]);

  const academy = useMemo(() => (academyId ? getAcademyById(academyId) : null), [academyId]);
  const allCourses = useMemo(() => (academyId ? getCoursesByAcademy(academyId) : []), [academyId]);

  // Get unique categories and types from this academy's courses
  const availableCategories = useMemo(() => {
    const cats = new Set(allCourses.map(c => c.category));
    return ['all', ...Array.from(cats)] as (CourseCategory | 'all')[];
  }, [allCourses]);

  const availableTypes = useMemo(() => {
    const types = new Set(allCourses.map(c => c.type));
    return ['all', ...Array.from(types)] as (CourseType | 'all')[];
  }, [allCourses]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;
      if (selectedType !== 'all' && course.type !== selectedType) return false;
      return true;
    });
  }, [allCourses, selectedCategory, selectedType]);

  // Stats
  const stats = useMemo(() => {
    const totalEnrollment = allCourses.reduce((sum, c) => sum + (c.enrollCount || 0), 0);
    const avgRating = allCourses.reduce((sum, c) => sum + (c.rating || 0), 0) / allCourses.filter(c => c.rating).length;
    const freeCount = allCourses.filter(c => c.price === 0).length;
    return { totalEnrollment, avgRating, freeCount };
  }, [allCourses]);

  if (!academy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">교육기관을 찾을 수 없습니다</p>
          <Button variant="ghost" onClick={() => navigate('/education')}>
            교육 허브로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-purple-50 to-white pt-4 pb-10 border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.03),transparent_50%)]" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-2.5 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-sm ring-1 ring-black/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-14">
          {/* Academy Logo & Name */}
          <div className="flex items-center gap-5 mb-5">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm ring-1 ring-black/5">
              {academy.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heading as="h1" size="xl">{academy.name}</Heading>
                {academy.isPartner && (
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-xl text-xs font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    공인 파트너
                  </span>
                )}
              </div>
              <p className="text-gray-500">{academy.description}</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {academy.location}
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              {allCourses.length}개 과정
            </div>
            {stats.avgRating > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-600 font-medium">{stats.avgRating.toFixed(1)}</span>
              </div>
            )}
            {stats.totalEnrollment > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {stats.totalEnrollment.toLocaleString()}명 수강
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent pointer-events-none" />
            <p className="relative text-3xl font-bold text-purple-600">{allCourses.length}</p>
            <p className="relative text-xs text-gray-500 mt-1">전체 과정</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent pointer-events-none" />
            <p className="relative text-3xl font-bold text-green-600">{stats.freeCount}</p>
            <p className="relative text-xs text-gray-500 mt-1">무료 과정</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent pointer-events-none" />
            <p className="relative text-3xl font-bold text-amber-600">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
            </p>
            <p className="relative text-xs text-gray-500 mt-1">평균 평점</p>
          </div>
        </div>

        {/* Contact Info */}
        {academy.website && (
          <BentoCard eyebrow="Contact" title="연락처">
            <a
              href={academy.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 mt-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-200"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <span className="flex-1 text-gray-600 group-hover:text-gray-900 truncate">
                {academy.website}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </BentoCard>
        )}

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Subheading>필터</Subheading>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableCategories.map(cat => {
              const isAll = cat === 'all';
              const info = isAll ? null : courseCategoryInfo[cat];
              const count = isAll
                ? allCourses.length
                : allCourses.filter(c => c.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isAll ? '전체' : `${info?.icon} ${info?.name}`} ({count})
                </button>
              );
            })}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {availableTypes.map(type => {
              const isAll = type === 'all';
              const info = isAll ? null : courseTypeInfo[type];

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-gray-50 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {isAll ? '전체' : `${info?.icon} ${info?.name}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses List */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <Subheading>교육 과정 ({filteredCourses.length})</Subheading>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="space-y-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseListItem course={course} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">해당 조건의 과정이 없습니다</p>
            </div>
          )}
        </div>

        {/* CTA */}
        {academy.website && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 ring-1 ring-purple-200 p-8 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.1),transparent_50%)]" />
            <div className="relative">
              <Heading as="h3" size="xl" className="mb-2">더 많은 정보가 필요하신가요?</Heading>
              <p className="text-sm text-gray-500 mb-5">
                {academy.name}에 직접 문의해보세요
              </p>
              <a
                href={academy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/20"
              >
                <Globe className="w-5 h-5" />
                공식 웹사이트 방문
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
