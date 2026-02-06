import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ChevronRight,
  ArrowRight,
  Database,
  Building2,
  BadgeCheck,
  Activity,
  Zap,
  Layers,
  Cpu,
  Wrench,
  Briefcase,
  Monitor
} from 'lucide-react';

// ============ LIVE DATA TICKER (Industrial Style) ============
const liveDataFeed = [
  { type: 'cert', name: 'Kim', content: "'xEV System Repair' 자격 인증 완료" },
  { type: 'data', name: '', content: '현재 등록된 실무 연봉 데이터: 1,240건' },
  { type: 'verify', name: 'Park', content: '[Surface Protection] Class-A 등급 달성' },
  { type: 'path', name: 'Lee', content: "'ADAS Calibration' 전문 과정 수료" },
  { type: 'data', name: '', content: '평균 시장가치 상승: 진단(Diag) 직군 +15%' },
  { type: 'verify', name: 'Choi', content: '테슬라 알루미늄 용접(Body) 기술 인증' },
];

// ============ TRACK DATA (Professional Terms) ============
const tracks = [
  {
    id: 'ev',
    icon: Zap,
    title: 'xEV High-Voltage',
    subtitle: '고전압 배터리 진단 및 모터 제어',
    statLabel: 'Avg. Compensation',
    avgSalary: '6,000만원+',
    jobs: 10,
    color: 'cyan',
    status: 'HIGH DEMAND',
  },
  {
    id: 'ppf',
    icon: Layers,
    title: 'Surface Protection',
    subtitle: 'PPF 인스톨 및 프리미엄 랩핑',
    statLabel: 'Market Range',
    avgSalary: '5,000~1.2억',
    jobs: 10,
    color: 'pink',
    status: 'GROWING',
  },
  {
    id: 'diag',
    icon: Cpu,
    title: 'Diagnostic & Calib.',
    subtitle: 'ADAS 보정 및 ECU 로직 분석',
    statLabel: 'Base Salary',
    avgSalary: '5,500만원+',
    jobs: 17,
    color: 'yellow',
    status: 'CORE SKILL',
  },
  {
    id: 'body',
    icon: Wrench,
    title: 'Body & Frame',
    subtitle: '알루미늄 판금 및 구조 복원',
    statLabel: 'Expert Level',
    avgSalary: '6,500만원+',
    jobs: 12,
    color: 'orange',
    status: 'SPECIALIST',
  },
  {
    id: 'biz',
    icon: Briefcase,
    title: 'Service Management',
    subtitle: '정비소 운영 효율화 및 매출 전략',
    statLabel: 'Incentive Cap',
    avgSalary: '1억+',
    jobs: 14,
    color: 'purple',
    status: 'EXECUTIVE',
  },
  {
    id: 'future',
    icon: Monitor,
    title: 'Future Mobility',
    subtitle: 'SDV 아키텍처 및 센서 유지보수',
    statLabel: 'Starting Pay',
    avgSalary: '6,000만원+',
    jobs: 13,
    color: 'lime',
    status: 'EMERGING',
  },
];

// ============ COMPONENTS ============
function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveDataFeed.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = liveDataFeed[currentIndex];
  const Icon = current.type === 'data' ? Activity : current.type === 'verify' ? BadgeCheck : Database;

  return (
    <div className="bg-white shadow-sm ring-1 ring-black/5 rounded-full px-4 py-2 inline-flex items-center gap-3">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        {current.name && <span className="text-gray-900 font-semibold">{current.name}</span>}
        {current.name && <span className="text-gray-300">|</span>}
        <span className="text-gray-600">{current.content}</span>
      </span>
    </div>
  );
}

function TrackCard({ track }: { track: typeof tracks[0] }) {
  const statusColors = {
    'HIGH DEMAND': 'bg-red-50 text-red-600 border-red-100',
    'GROWING': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'CORE SKILL': 'bg-blue-50 text-blue-600 border-blue-100',
    'SPECIALIST': 'bg-orange-50 text-orange-600 border-orange-100',
    'EXECUTIVE': 'bg-purple-50 text-purple-600 border-purple-100',
    'EMERGING': 'bg-lime-50 text-lime-600 border-lime-100',
  };

  const statusStyle = statusColors[track.status as keyof typeof statusColors] || statusColors['CORE SKILL'];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5 hover:ring-gray-300 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-900 transition-colors">
          <track.icon className="w-6 h-6" />
        </div>
        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded ${statusStyle}`}>
          {track.status}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-950 mb-1 group-hover:text-blue-600 transition-colors">
        {track.title}
      </h3>
      <p className="text-gray-500 text-sm mb-6 h-10 leading-relaxed font-medium">
        {track.subtitle}
      </p>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">{track.statLabel}</p>
          <p className="text-gray-900 font-mono font-bold">{track.avgSalary}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">POSITIONS</p>
          <p className="text-gray-900 font-mono">{track.jobs}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function Landing() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-700 selection:bg-blue-100">
      {/* Background Grid - Subtle */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-gray-800 transition-colors">
              U
            </div>
            <span className="font-bold text-lg text-gray-950 tracking-tight">Unsan Academy</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/jobs"
              className="text-sm text-gray-500 hover:text-gray-950 font-medium transition-colors"
            >
              Industry Data
            </Link>
            <Link
              to="/jobs"
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md"
            >
              내 기술 가치 평가서 발급
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Ticker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <LiveTicker />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-950 mb-6 leading-tight tracking-tight">
              귀하의 기술 가치,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                데이터로 증명하십시오.
              </span>
            </h1>
          </motion.div>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            국내 유일 <span className="text-gray-900 font-semibold">1,240건 실무 연봉 데이터</span> 기반.<br />
            시장 표준(Standard) 대비 귀하의 <span className="text-gray-900 font-semibold">연봉 경쟁력</span>을 객관적으로 분석해 드립니다.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <Link
              to="/jobs"
              className="group inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20"
            >
              <Activity className="w-5 h-5" />
              내 기술 가치 평가서 발급 (무료)
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-xs text-gray-400 font-mono mt-2">
              * 인증된 데이터는 PDF 리포트로 제공됩니다.
            </span>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-10 border-t border-gray-200 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div>
              <p className="text-3xl font-bold text-gray-950 mb-1">1,240+</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Verified Salaries</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-950 mb-1">88</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Technical Roles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-950 mb-1">50+</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Partner Shops</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-24 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
          >
            <div>
              <span className="text-blue-600 font-mono font-bold text-xs tracking-wider mb-2 block">CAREER TRACKS</span>
              <h2 className="text-3xl font-bold text-gray-950">
                직무별 시장 표준 (Market Standard)
              </h2>
            </div>
            <Link to="/jobs" className="text-sm text-gray-500 hover:text-gray-950 flex items-center gap-2 transition-colors">
              전체 88개 직무 데이터 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to="/jobs">
                  <TrackCard track={track} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-12 shadow-2xl"
          >
            <Activity className="w-12 h-12 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              "감(Intuition)"으로 커리어를 결정하지 마십시오.
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
              운산 아카데미의 데이터는 귀하의 기술이 시장에서 정당한 대우를 받고 있는지
              객관적으로 증명할 수 있는 유일한 근거입니다.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              시장 표준 데이터 확인하기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center text-xs text-white font-bold">
              U
            </div>
            <span className="font-bold text-gray-700">Unsan Academy</span>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            © 2026 Unsan Academy. Automotive Workforce Intelligence Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}