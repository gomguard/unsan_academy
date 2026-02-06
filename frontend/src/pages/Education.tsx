import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Star,
  Users,
  Clock,
  ChevronRight,
  BadgeCheck,
  MapPin,
  Building,
} from 'lucide-react';
import {
  courses,
  academies,
  getAcademyById,
  formatCoursePrice,
} from '@/lib/educationData';
import type { Course, CourseCategory, CourseType } from '@/types';
import { courseCategoryInfo, courseTypeInfo } from '@/types';

// ============ COURSE CARD COMPONENT ============
function CourseCard({ course }: { course: Course }) {
  const academy = getAcademyById(course.academyId);
  const categoryInfo = courseCategoryInfo[course.category];
  const typeInfo = courseTypeInfo[course.type];
  const isFree = course.price === 0;

  return (
    <Link
      to={`/education/course/${course.id}`}
      className="block bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition-all group"
    >
      {/* Header with category color */}
      <div
        className="h-2"
        style={{ backgroundColor: categoryInfo.color }}
      />

      <div className="p-5">
        {/* Academy Info */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{academy?.logo}</span>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-slate-300">{academy?.name}</span>
              {academy?.isPartner && (
                <BadgeCheck className="w-4 h-4 text-cyan-400" />
              )}
            </div>
          </div>
          {/* Type Badge */}
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              backgroundColor: `${typeInfo.color}20`,
              color: typeInfo.color,
            }}
          >
            {typeInfo.icon} {typeInfo.name}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {isFree && (
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full font-bold">
              무료
            </span>
          )}
          {course.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400">{course.rating}</span>
            </div>
          )}
          {course.enrollCount && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrollCount.toLocaleString()}명</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div>
            <p className={`font-bold text-lg ${isFree ? 'text-green-400' : 'text-white'}`}>
              {formatCoursePrice(course)}
            </p>
          </div>
          <span className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold text-sm group-hover:bg-yellow-300 transition-colors">
            상세 보기
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ============ ACADEMY CARD COMPONENT ============
function AcademyCard({ academy }: { academy: typeof academies[0] }) {
  const courseCount = courses.filter(c => c.academyId === academy.id).length;

  return (
    <Link to={`/education/academy/${academy.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-slate-600 hover:bg-slate-800 transition-all group"
      >
        <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-3xl">
          {academy.logo}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors">{academy.name}</h3>
            {academy.isPartner && (
              <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full font-medium flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                파트너
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {academy.location}
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {courseCount}개 과정
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-yellow-400" />
      </motion.div>
    </Link>
  );
}

// ============ MAIN COMPONENT ============
export function Education() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<CourseType | 'all'>('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const categories: (CourseCategory | 'all')[] = ['all', 'Maintenance', 'Body', 'Tuning', 'EV_Future', 'Management'];
  const types: (CourseType | 'all')[] = ['all', 'Online', 'Offline', 'Hybrid'];

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && course.type !== selectedType) {
        return false;
      }

      // Free only filter
      if (showFreeOnly && course.price !== 0) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedType, showFreeOnly]);

  // Partner academies
  const partnerAcademies = academies.filter(a => a.isPartner);

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Education Hub</h1>
              <p className="text-sm text-slate-400">교육으로 커리어 업그레이드</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="과정명, 키워드로 검색..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => {
              const isAll = cat === 'all';
              const info = isAll ? null : courseCategoryInfo[cat];
              const count = isAll
                ? courses.length
                : courses.filter(c => c.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
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
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Type & Free Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {types.map(type => {
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

          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              showFreeOnly
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            💰 무료/국비만
          </button>
        </div>

        {/* Partner Academies */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-white">공인 파트너 교육기관</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {partnerAcademies.map(academy => (
              <AcademyCard key={academy.id} academy={academy} />
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">
              추천 과정 <span className="text-slate-500 font-normal">({filteredCourses.length}개)</span>
            </h2>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">검색 결과가 없습니다</p>
            <p className="text-sm text-slate-500 mt-1">다른 키워드로 검색해보세요</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            원하는 과정이 없으신가요?
          </h3>
          <p className="text-slate-400 mb-6">
            운산 아카데미와 파트너 교육기관에 문의하세요.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-400 transition-colors">
            <Building className="w-5 h-5" />
            교육기관 문의하기
          </button>
        </div>
      </div>
    </div>
  );
}
