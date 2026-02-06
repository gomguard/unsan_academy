import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { MarketValueCard } from '@/components/MarketValueCard';
import {
  Bell,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Wrench,
  FileText,
  MapPin,
  ExternalLink,
  Zap,
  Award
} from 'lucide-react';

// ============ MOCK DATA: INDUSTRY INFO ============
// 나중에 API로 연동될 '업계 소식' 데이터입니다.
const technicalBulletins = [
  { id: 1, brand: 'Hyundai', title: 'ICCU 소프트웨어 업데이트 (무상수리)', date: '2026.02.01', important: true },
  { id: 2, brand: 'BMW', title: 'EGR 쿨러 관련 리콜 통지문 (G30)', date: '2026.01.28', important: true },
  { id: 3, brand: 'Tesla', title: 'Model 3 Highland 히트펌프 로직 변경', date: '2026.01.25', important: false },
  { id: 4, brand: 'Benz', title: '48V 배터리 시스템 진단 가이드라인', date: '2026.01.20', important: false },
];

const industryEvents = [
  { id: 1, title: '2026 오토살롱위크', date: 'D-12', loc: 'KINTEX', type: 'EXPO' },
  { id: 2, title: '현대 N 페스티벌 R1', date: 'D-25', loc: 'Inje Speedium', type: 'RACING' },
  { id: 3, title: 'xEV 고전압 안전교육 (3차)', date: '접수중', loc: 'Unsan Academy', type: 'EDU' },
];

const hotJobs = [
  { id: 1, company: 'Samsung Electronics', title: 'xEV Battery Tech', salary: '8,000+', loc: 'Suwon' },
  { id: 2, company: 'Tesla Korea', title: 'Mobile Service Tech', salary: '6,500+', loc: 'Seoul' },
  { id: 3, company: 'Blue Hands', title: 'Master Technician', salary: '5,500+', loc: 'Busan' },
];

export function Dashboard() {
  const { profile, targetJobId } = useStore();
  const currentSalary = profile?.currentSalary || 3500;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!profile) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 pb-24 md:pb-12">
      {/* 1. Global Ticker (News Bar) */}
      <div className="bg-blue-50 border-b border-blue-100 h-10 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center gap-4 text-xs font-mono">
          <span className="text-blue-600 font-bold flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3" /> MARKET WATCH
          </span>
          <div className="flex gap-8 animate-marquee whitespace-nowrap text-gray-500">
            <span>[Job] EV 정비직 수요 전월 대비 +15% ▲</span>
            <span>[Avg] 서울 지역 판금 기술자 평균 시급 32,000원 ▲</span>
            <span>[News] 제네시스 인증 중고차 센터 신규 채용 시작</span>
            <span>[Tech] 테슬라 진단 소프트웨어 2026.1 업데이트 배포</span>
          </div>
        </div>
      </div>

      {/* 2. Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ============ LEFT COLUMN: INDUSTRY HUB (Content) ============ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* A. Hero Banner (주요 행사/이슈) */}
            <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg h-48 sm:h-64 flex items-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 px-8">
                <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30 rounded-sm mb-2">
                  FEATURED EVENT
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                  2026 Automotive<br />Tech Summit
                </h1>
                <p className="text-gray-300 max-w-lg mb-6 text-sm">
                  미래 모빌리티 정비 트렌드를 확인하세요. SDV, EV, 그리고 AI 진단 기술의 모든 것.
                </p>
                <button className="px-5 py-2 bg-white text-gray-900 font-bold text-sm rounded-full hover:bg-gray-100 transition-colors shadow-md">
                  사전 등록하기
                </button>
              </div>
            </section>

            {/* B. Two Column Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Widget 1: Technical Bulletins (TSB) */}
              <section className="bg-white shadow-sm ring-1 ring-black/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-950 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-gray-400" />
                    기술 통신문 (TSB)
                  </h3>
                  <Link to="/community" className="text-xs text-blue-600 hover:text-blue-500">더보기</Link>
                </div>
                <div className="space-y-3">
                  {technicalBulletins.map((item) => (
                    <div key={item.id} className="group flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${item.important ? 'text-red-500' : 'text-gray-400'}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">
                            {item.brand}
                          </span>
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                        <p className={`text-sm ${item.important ? 'text-gray-950 font-medium' : 'text-gray-600'} group-hover:text-blue-600 transition-colors line-clamp-1`}>
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Widget 2: Industry Calendar */}
              <section className="bg-white shadow-sm ring-1 ring-black/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    주요 일정
                  </h3>
                  <Link to="/education" className="text-xs text-blue-600 hover:text-blue-500">전체보기</Link>
                </div>
                <div className="space-y-3">
                  {industryEvents.map((evt) => (
                    <div key={evt.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 text-center shrink-0">
                        <span className={`block text-xs font-bold ${evt.date.startsWith('D-') ? 'text-red-500' : 'text-green-500'}`}>
                          {evt.date}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium truncate">{evt.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {evt.loc}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                        {evt.type}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* C. Hot Jobs Ticker */}
            <section className="bg-white shadow-sm ring-1 ring-black/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-950 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  Premium Recruiting
                  <span className="text-xs font-normal text-gray-500 ml-2">검증된 고연봉 포지션</span>
                </h3>
                <Link to="/jobs" className="text-xs text-blue-600 hover:text-blue-500">채용관 이동</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {hotJobs.map((job) => (
                  <div key={job.id} className="bg-gray-50 border border-gray-100 p-4 rounded-lg hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-500 font-semibold">{job.company}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600">{job.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-green-600 font-mono font-medium">{job.salary}</span>
                      <span>|</span>
                      <span>{job.loc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ============ RIGHT COLUMN: MY COCKPIT (Sidebar) ============ */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. Mini Profile (Compact) */}
            <section className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-600">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-gray-950 font-bold text-lg flex items-center gap-2">
                    {profile.name}
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded">
                      PRO
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">{profile.currentJobTitle || 'Automotive Technician'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center py-3 border-y border-gray-100 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">SKILL SCORE</p>
                  <p className="text-lg font-mono font-bold text-blue-600">842</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">RANK</p>
                  <p className="text-lg font-mono font-bold text-gray-950">Top 12%</p>
                </div>
              </div>
              <Link to="/profile" className="block w-full py-2 text-center text-sm font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-colors">
                프로필 관리 / 이력서 출력
              </Link>
            </section>

            {/* 2. Market Value (Personal Data) */}
            <div className="relative group">
              <MarketValueCard
                currentJobId={targetJobId || 'maint_01'}
                currentSalary={currentSalary}
                yearsExperience={profile.xp ? Math.floor(profile.xp / 100) : 3} // Mock logic
                isVerified={profile.isVerified}
              />
            </div>

            {/* 3. Quick Actions */}
            <section className="bg-white shadow-sm ring-1 ring-black/5 rounded-xl p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Workspace</h3>
              <div className="space-y-2">
                <Link to="/missions" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700 group-hover:text-gray-950">작업 일지 작성</p>
                    <p className="text-xs text-gray-500">오늘의 작업을 기록하세요</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link to="/skill-tree" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-green-600 transition-colors">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700 group-hover:text-gray-950">스킬 인증 요청</p>
                    <p className="text-xs text-gray-500">새로운 기술을 증명하세요</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}