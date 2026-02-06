import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BentoCard } from '@/components/ui/BentoCard';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
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
  ArrowRight,
  Sparkles,
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
      className="block group"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 hover:ring-purple-400/50 hover:shadow-md transition-all">
        {/* Header with category color */}
        <div
          className="h-1.5"
          style={{ backgroundColor: categoryInfo.color }}
        />

        <div className="p-5">
          {/* Academy Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
              {academy?.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900">{academy?.name}</span>
                {academy?.isPartner && (
                  <BadgeCheck className="w-4 h-4 text-cyan-500" />
                )}
              </div>
            </div>
            {/* Type Badge */}
            <span
              className="text-xs px-3 py-1.5 rounded-xl font-semibold"
              style={{
                backgroundColor: `${typeInfo.color}15`,
                color: typeInfo.color,
              }}
            >
              {typeInfo.icon} {typeInfo.name}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {isFree && (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg font-bold">
                무료
              </span>
            )}
            {course.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
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
                <span>{course.enrollCount.toLocaleString()}명</span>
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className={`font-bold text-lg ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
                {formatCoursePrice(course.price)}
              </p>
            </div>
            <span className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm group-hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/20">
              상세 보기
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
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
        className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 flex items-center gap-4 hover:ring-cyan-400/50 hover:shadow-md transition-all group"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
          {academy.logo}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{academy.name}</h3>
            {academy.isPartner && (
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg font-medium flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                파트너
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1.5">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {academy.location}
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              {courseCount}개 과정
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <Heading as="h1" size="xl">Education Hub</Heading>
              <p className="text-sm text-gray-500 mt-0.5">교육으로 커리어 업그레이드</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="과정명, 키워드로 검색..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-gray-950 placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50'
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
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-150'
                  }`}
                >
                  {isAll ? '전체' : `${info?.icon} ${info?.name}`}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              showFreeOnly
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            무료/국비만
          </button>
        </div>

        {/* Partner Academies */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="w-5 h-5 text-cyan-500" />
            <Subheading>공인 파트너 교육기관</Subheading>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {partnerAcademies.map(academy => (
              <AcademyCard key={academy.id} academy={academy} />
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <Subheading>
                추천 과정 <span className="text-gray-400 font-normal">({filteredCourses.length}개)</span>
              </Subheading>
            </div>
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
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium text-lg">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-500 mt-2">다른 키워드로 검색해보세요</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 ring-1 ring-purple-200">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.1),transparent_50%)]" />
          <div className="relative p-8 text-center">
            <Heading as="h3" size="2xl" className="mb-3">
              원하는 과정이 없으신가요?
            </Heading>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              운산 아카데미와 파트너 교육기관에 문의하세요.
            </p>
            <Button variant="brand">
              <Building className="w-5 h-5 mr-2" />
              교육기관 문의하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
