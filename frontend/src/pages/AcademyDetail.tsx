import { useMemo, useState } from 'react';
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
  GraduationCap,
  Globe,
  Phone,
  Mail,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { getAcademyById, getCoursesByAcademy, formatCoursePrice } from '@/lib/educationData';
import { courseCategoryInfo, courseTypeInfo, type CourseCategory, type CourseType } from '@/types';
import type { Course } from '@/types';

function CourseListItem({ course }: { course: Course }) {
  const categoryInfo = courseCategoryInfo[course.category];
  const typeInfo = courseTypeInfo[course.type];
  const isFree = course.price === 0;

  return (
    <Link
      to={`/education/course/${course.id}`}
      className="block p-4 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: `${categoryInfo.color}20` }}
        >
          {categoryInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${typeInfo.color}20`,
                color: typeInfo.color,
              }}
            >
              {typeInfo.icon} {typeInfo.name}
            </span>
            {isFree && (
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-bold">
                무료
              </span>
            )}
          </div>
          <h3 className="font-medium text-white group-hover:text-yellow-400 transition-colors mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-1 mb-2">{course.description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.duration}
            </div>
            {course.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400">{course.rating}</span>
              </div>
            )}
            {course.enrollCount && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {course.enrollCount.toLocaleString()}명
              </div>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-bold ${isFree ? 'text-green-400' : 'text-white'}`}>
            {isFree ? '무료' : `${course.price}만원`}
          </p>
          {course.priceNote && (
            <p className="text-xs text-slate-500 mt-0.5">{course.priceNote}</p>
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">교육기관을 찾을 수 없습니다</p>
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

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-purple-500/20 to-slate-900 pt-4 pb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12">
          {/* Academy Logo & Name */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl border border-slate-700">
              {academy.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{academy.name}</h1>
                {academy.isPartner && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    공인 파트너
                  </span>
                )}
              </div>
              <p className="text-slate-400">{academy.description}</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {academy.location}
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              {allCourses.length}개 과정
            </div>
            {stats.avgRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400">{stats.avgRating.toFixed(1)}</span>
              </div>
            )}
            {stats.totalEnrollment > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {stats.totalEnrollment.toLocaleString()}명 수강
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{allCourses.length}</p>
            <p className="text-xs text-slate-500">전체 과정</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.freeCount}</p>
            <p className="text-xs text-slate-500">무료 과정</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
            </p>
            <p className="text-xs text-slate-500">평균 평점</p>
          </div>
        </div>

        {/* Contact Info */}
        {academy.website && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <h2 className="font-bold text-white mb-3">연락처</h2>
            <div className="space-y-2">
              {academy.website && (
                <a
                  href={academy.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-700 rounded-lg transition-colors group"
                >
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="flex-1 text-slate-300 group-hover:text-white truncate">
                    {academy.website}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-400">필터</span>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-800/50 text-slate-500 hover:text-white'
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
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            교육 과정 ({filteredCourses.length})
          </h2>

          {filteredCourses.length > 0 ? (
            <div className="space-y-3">
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
            <div className="text-center py-12 text-slate-400">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>해당 조건의 과정이 없습니다</p>
            </div>
          )}
        </div>

        {/* CTA */}
        {academy.website && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center"
          >
            <h3 className="font-bold text-white mb-2">더 많은 정보가 필요하신가요?</h3>
            <p className="text-sm text-slate-400 mb-4">
              {academy.name}에 직접 문의해보세요
            </p>
            <a
              href={academy.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-400 transition-colors"
            >
              <Globe className="w-5 h-5" />
              공식 웹사이트 방문
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
