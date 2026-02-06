import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ChevronRight,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Database,
  Building2,
  BadgeCheck,
} from 'lucide-react';

// ============ SALARY-FOCUSED LIVE DATA ============
const socialProofMessages = [
  { type: 'path', name: 'Kim', content: "'EV Battery Expert' 경로 시작" },
  { type: 'salary', name: '', content: '현재 최고 연봉: 1.2억 (포르쉐 정비사)' },
  { type: 'verify', name: 'Park', content: 'PPF 인스톨러 연봉 6,800만원 인증 완료' },
  { type: 'path', name: 'Lee', content: "'ADAS 캘리브레이션' 커리어 시작" },
  { type: 'salary', name: '', content: '평균 연봉 상승: EV 분야 +23% (작년 대비)' },
  { type: 'verify', name: 'Choi', content: '테슬라 바디샵 연봉 7,200만원 인증 완료' },
];

// ============ TRACK DATA (Salary-focused) ============
const tracks = [
  {
    id: 'ev',
    emoji: '⚡',
    title: 'EV 마스터 트랙',
    subtitle: '전기차 시대의 핵심 인재',
    avgSalary: '6,000만원+',
    jobs: 10,
    color: 'cyan',
    demand: 'HIGH',
  },
  {
    id: 'ppf',
    emoji: '🎨',
    title: 'PPF/랩핑 트랙',
    subtitle: '억대 연봉의 시작',
    avgSalary: '5,000~1억',
    jobs: 10,
    color: 'pink',
    demand: 'HIGH',
  },
  {
    id: 'diag',
    emoji: '🔍',
    title: '진단/튜닝 트랙',
    subtitle: 'ECU부터 ADAS까지',
    avgSalary: '5,500만원+',
    jobs: 17,
    color: 'yellow',
    demand: 'STABLE',
  },
  {
    id: 'body',
    emoji: '🔧',
    title: '바디/복원 트랙',
    subtitle: '장인의 길',
    avgSalary: '4,500만원+',
    jobs: 12,
    color: 'orange',
    demand: 'STABLE',
  },
  {
    id: 'biz',
    emoji: '💼',
    title: '경영/딜러 트랙',
    subtitle: '기름 안 묻히고 돈 버는 법',
    avgSalary: '4,000~1억+',
    jobs: 14,
    color: 'purple',
    demand: 'HIGH',
  },
  {
    id: 'future',
    emoji: '🚀',
    title: 'Next-Gen 트랙',
    subtitle: '미래 직업 선점',
    avgSalary: '6,000만원+',
    jobs: 13,
    color: 'lime',
    demand: 'EXPLOSIVE',
  },
];

// ============ COMPONENTS ============
function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % socialProofMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = socialProofMessages[currentIndex];
  const icon = current.type === 'salary' ? '💰' : current.type === 'verify' ? '✅' : '📢';

  return (
    <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-hover rounded-full px-4 py-2 inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-sm text-slate-400">
        {icon} {current.name && <span className="text-white font-medium">{current.name}</span>}
        {current.name && ' - '}
        <span className="text-pop-yellow font-medium">{current.content}</span>
      </span>
    </div>
  );
}

function TrackCard({ track }: { track: typeof tracks[0] }) {
  const colorClasses = {
    cyan: 'border-pop-cyan/30 hover:border-pop-cyan/60',
    pink: 'border-pop-pink/30 hover:border-pop-pink/60',
    yellow: 'border-pop-yellow/30 hover:border-pop-yellow/60',
    orange: 'border-pop-orange/30 hover:border-pop-orange/60',
    purple: 'border-pop-purple/30 hover:border-pop-purple/60',
    lime: 'border-pop-lime/30 hover:border-pop-lime/60',
  };

  const textColors = {
    cyan: 'text-pop-cyan',
    pink: 'text-pop-pink',
    yellow: 'text-pop-yellow',
    orange: 'text-pop-orange',
    purple: 'text-pop-purple',
    lime: 'text-pop-lime',
  };

  const demandBadge = {
    EXPLOSIVE: { bg: 'bg-red-500/20', text: 'text-red-400', label: '급성장' },
    HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: '높음' },
    STABLE: { bg: 'bg-green-500/20', text: 'text-green-400', label: '안정' },
  };

  const demand = demandBadge[track.demand as keyof typeof demandBadge];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-dark-card rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${colorClasses[track.color as keyof typeof colorClasses]}`}
    >
      {/* Market Demand Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 ${demand.bg} ${demand.text} text-xs font-bold rounded-full flex items-center gap-1`}>
          <TrendingUp className="w-3 h-3" /> {demand.label}
        </span>
      </div>

      {/* Emoji Icon */}
      <div className="text-5xl mb-4">{track.emoji}</div>

      {/* Title */}
      <h3 className={`text-xl font-bold mb-1 ${textColors[track.color as keyof typeof textColors]}`}>
        {track.title}
      </h3>
      <p className="text-slate-400 text-sm mb-4">{track.subtitle}</p>

      {/* Salary Info - Primary Focus */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold">{track.avgSalary}</span>
        </div>
        <div className="flex items-center gap-1">
          <Database className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">{track.jobs}개 직업</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function Landing() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-dark-hover">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-xl text-white">Unsan Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/jobs"
              className="text-sm text-slate-400 hover:text-white font-medium transition-colors"
            >
              💰 연봉 데이터
            </Link>
            <Link
              to="/jobs"
              className="text-sm bg-pop-yellow text-dark-200 px-4 py-2 rounded-lg font-bold hover:bg-pop-yellow/90 transition-colors"
            >
              내 몸값 진단 →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Social Proof Ticker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <SocialProofTicker />
          </motion.div>

          {/* Main Headline - Market Value Focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
              당신의 기술,
              <br />
              <span className="text-pop-yellow">시장가는 얼마입니까?</span>
            </h1>
          </motion.div>

          {/* Sub - Data Focused */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            국내 최초 정비직 연봉 데이터베이스.
            <br />
            <span className="text-white font-medium">88개 직업 데이터</span>로 당신의{' '}
            <span className="text-pop-yellow font-bold">'진짜 몸값'</span>을 진단하세요.
          </motion.p>

          {/* Single Prominent CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <Link
              to="/jobs"
              className="group inline-flex items-center gap-3 bg-yellow-300 text-gray-900 px-10 py-5 rounded-xl font-bold text-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/20"
            >
              <span className="text-2xl">💰</span>
              내 몸값 무료 진단하기
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-sm text-slate-500">3분 안에 결과 확인 가능</span>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-pop-yellow" />
              <span><span className="text-white font-medium">88</span>개 직업 데이터</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-dark-hover" />
            <div className="hidden sm:flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              <span><span className="text-white font-medium">실제 연봉</span> 인증 데이터</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-dark-hover" />
            <div className="hidden md:flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span><span className="text-white font-medium">채용 기업</span> 정보 포함</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracks Section - Salary Focused */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-pop-yellow font-bold text-sm tracking-wider">💰 SALARY BY TRACK</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">
              트랙별 연봉 데이터
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              각 분야의 실제 연봉과 시장 수요를 확인하세요.
            </p>
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

      {/* Stats Section - Data Focused */}
      <section className="py-20 px-4 bg-dark-100/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '💰', value: '1억+', label: '최고 연봉' },
              { emoji: '🔧', value: '88', label: '직업 데이터' },
              { emoji: '📈', value: '24개', label: '급성장 직업' },
              { emoji: '🏢', value: '50+', label: '채용 기업' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-dark-card rounded-2xl border border-dark-hover"
              >
                <span className="text-3xl mb-2 block">{stat.emoji}</span>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-dark-card to-dark-100 rounded-3xl p-12 border border-pop-yellow/20"
          >
            <span className="text-5xl mb-4 block">📊</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              기술자의 몸값은<br />
              <span className="text-pop-yellow">데이터로 증명</span>하는 시대
            </h2>
            <p className="text-slate-400 mb-8">
              더 이상 감으로 커리어를 결정하지 마세요.<br />
              88개 직업, 실제 연봉, 채용 기업 정보를 확인하세요.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-pop-yellow text-dark-200 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-glow-yellow transition-all"
            >
              <span className="text-xl">💰</span>
              무료 진단 시작하기
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-hover">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="font-bold text-white">Unsan Academy</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2024 Unsan Academy. 자동차 애프터마켓 전문가를 위한 커리어 데이터 플랫폼.
          </p>
        </div>
      </footer>
    </div>
  );
}
