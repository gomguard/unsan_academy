import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ChevronRight,
  Flame,
  Zap,
  Trophy,
  Users,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// ============ FAKE LIVE DATA ============
const liveUnlocks = [
  { name: '김정비', job: 'EV 고전압 배터리 진단사', emoji: '⚡' },
  { name: '이튜닝', job: 'PPF 인스톨러', emoji: '🎨' },
  { name: '박기술', job: '테슬라 공인 바디샵', emoji: '🚗' },
  { name: '최마스터', job: 'ADAS 캘리브레이션 전문가', emoji: '🎯' },
  { name: '정프로', job: '디테일링 전문가', emoji: '✨' },
  { name: '강메카닉', job: '변속기 전문가', emoji: '⚙️' },
  { name: '오센서', job: '자율주행 센서 기술자', emoji: '🔬' },
  { name: '한코팅', job: '세라믹 코팅 전문가', emoji: '💎' },
];

const activeMechanics = 342 + Math.floor(Math.random() * 50);

// ============ TRACK DATA ============
const tracks = [
  {
    id: 'ev',
    emoji: '⚡',
    title: 'EV 마스터 트랙',
    subtitle: '전기차 시대의 핵심 인재',
    level: 4,
    avgSalary: '6,000만원+',
    jobs: 10,
    color: 'cyan',
    hot: true,
  },
  {
    id: 'ppf',
    emoji: '🎨',
    title: 'PPF/랩핑 트랙',
    subtitle: '억대 연봉의 시작',
    level: 3,
    avgSalary: '5,000~1억',
    jobs: 10,
    color: 'pink',
    hot: true,
  },
  {
    id: 'diag',
    emoji: '🔍',
    title: '진단/튜닝 트랙',
    subtitle: 'ECU부터 ADAS까지',
    level: 5,
    avgSalary: '5,500만원+',
    jobs: 17,
    color: 'yellow',
  },
  {
    id: 'body',
    emoji: '🔧',
    title: '바디/복원 트랙',
    subtitle: '장인의 길',
    level: 3,
    avgSalary: '4,500만원+',
    jobs: 12,
    color: 'orange',
  },
  {
    id: 'biz',
    emoji: '💼',
    title: '경영/딜러 트랙',
    subtitle: '기름 안 묻히고 돈 버는 법',
    level: 2,
    avgSalary: '4,000~1억+',
    jobs: 14,
    color: 'purple',
  },
  {
    id: 'future',
    emoji: '🚀',
    title: 'Next-Gen 트랙',
    subtitle: '미래 직업 선점',
    level: 5,
    avgSalary: '6,000만원+',
    jobs: 13,
    color: 'lime',
    new: true,
  },
];

// ============ CHALLENGES DATA ============
const challenges = [
  {
    id: 1,
    emoji: '🔥',
    title: '7일 스킬 챌린지',
    desc: '매일 1개 미션 완료하기',
    participants: 1240,
    dDay: 4,
    reward: '+500 XP',
  },
  {
    id: 2,
    emoji: '⚡',
    title: 'EV 입문 챌린지',
    desc: '고전압 안전교육 이수',
    participants: 856,
    dDay: 7,
    reward: 'EV 뱃지',
  },
  {
    id: 3,
    emoji: '🎯',
    title: '진단왕 챌린지',
    desc: 'OBD 진단 10회 완료',
    participants: 432,
    dDay: 14,
    reward: '+1,000 XP',
  },
];

// ============ COMPONENTS ============
function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveUnlocks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = liveUnlocks[currentIndex];

  return (
    <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-hover rounded-full px-4 py-2 inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-status-live"></span>
      </span>
      <span className="text-sm text-slate-400">
        <span className="text-white font-medium">{current.name}</span>님이{' '}
        <span className="text-pop-yellow font-medium">{current.emoji} {current.job}</span> 카드를 획득했습니다!
      </span>
    </div>
  );
}

function TrackCard({ track }: { track: typeof tracks[0] }) {
  const colorClasses = {
    cyan: 'border-pop-cyan/30 hover:border-pop-cyan/60 shadow-pop-cyan/20 hover:shadow-glow-cyan',
    pink: 'border-pop-pink/30 hover:border-pop-pink/60 shadow-pop-pink/20 hover:shadow-glow-pink',
    yellow: 'border-pop-yellow/30 hover:border-pop-yellow/60 shadow-pop/20 hover:shadow-glow-yellow',
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

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-dark-card rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${colorClasses[track.color as keyof typeof colorClasses]}`}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {track.hot && (
          <span className="px-2 py-1 bg-status-hot/20 text-status-hot text-xs font-bold rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" /> HOT
          </span>
        )}
        {track.new && (
          <span className="px-2 py-1 bg-status-new/20 text-status-new text-xs font-bold rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> NEW
          </span>
        )}
      </div>

      {/* Emoji Icon */}
      <div className="text-5xl mb-4">{track.emoji}</div>

      {/* Title */}
      <h3 className={`text-xl font-bold mb-1 ${textColors[track.color as keyof typeof textColors]}`}>
        {track.title}
      </h3>
      <p className="text-slate-400 text-sm mb-4">{track.subtitle}</p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-pop-yellow" />
          <span className="text-slate-300">Lv.{track.level}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-pop-lime" />
          <span className="text-slate-300">{track.avgSalary}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 bg-dark-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${
            track.color === 'cyan' ? 'from-pop-cyan to-pop-cyan/50' :
            track.color === 'pink' ? 'from-pop-pink to-pop-pink/50' :
            track.color === 'yellow' ? 'from-pop-yellow to-pop-yellow/50' :
            track.color === 'orange' ? 'from-pop-orange to-pop-orange/50' :
            track.color === 'purple' ? 'from-pop-purple to-pop-purple/50' :
            'from-pop-lime to-pop-lime/50'
          }`}
          style={{ width: `${(track.jobs / 20) * 100}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">{track.jobs}개 직업 커리어</p>
    </motion.div>
  );
}

function ChallengeCard({ challenge }: { challenge: typeof challenges[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-dark-card border border-dark-hover rounded-xl p-5 hover:border-pop-yellow/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{challenge.emoji}</span>
        <span className="px-2 py-1 bg-status-urgent/20 text-status-urgent text-xs font-bold rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> D-{challenge.dDay}
        </span>
      </div>

      <h4 className="text-white font-bold mb-1">{challenge.title}</h4>
      <p className="text-slate-400 text-sm mb-4">{challenge.desc}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <Users className="w-4 h-4" />
          <span>{challenge.participants.toLocaleString()}명 참여 중</span>
        </div>
        <span className="text-pop-yellow text-sm font-medium">{challenge.reward}</span>
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
              🎯 Job Library
            </Link>
            <Link
              to="/dashboard"
              className="text-sm bg-pop-yellow text-dark-200 px-4 py-2 rounded-lg font-bold hover:bg-pop-yellow/90 transition-colors"
            >
              시작하기 →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Live Ticker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <LiveTicker />
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
              Make Real Money.
              <br />
              <span className="text-pop-yellow">Become a Master.</span>
            </h1>
          </motion.div>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            기름쟁이가 아닙니다. <span className="text-white font-medium">기술자</span>입니다.
            <br />
            88가지 직업 데이터로 당신의 <span className="text-pop-yellow font-bold">'진짜 몸값'</span>을 찾으세요.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all"
            >
              <Flame className="w-5 h-5" />
              내 몸값 진단하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-yellow-400 transition-all"
            >
              <Zap className="w-5 h-5 text-cyan-400" />
              무료로 시작하기
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-live"></span>
              </span>
              <span>🔧 <span className="text-white font-medium">{activeMechanics}</span>명의 기술자가 레벨업 중</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-dark-hover" />
            <div className="hidden sm:flex items-center gap-2">
              <Trophy className="w-4 h-4 text-pop-yellow" />
              <span><span className="text-white font-medium">88</span>개 직업 데이터</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-pop-yellow font-bold text-sm tracking-wider">🎮 CAREER TRACKS</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">
              어떤 마스터가 될래?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              6개의 전문 트랙 중 하나를 선택하고, 체계적으로 레벨업하세요.
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

      {/* Challenges Section */}
      <section className="py-20 px-4 bg-dark-100/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-pop-pink font-bold text-sm tracking-wider">🏆 ACTIVE CHALLENGES</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">
              지금 참여하세요
            </h2>
            <p className="text-slate-400">
              챌린지를 완료하고 XP와 특별 뱃지를 획득하세요.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ChallengeCard challenge={challenge} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '🔧', value: '88', label: '직업 데이터' },
              { emoji: '💰', value: '1억+', label: '최고 연봉' },
              { emoji: '🚀', value: '7', label: '전문 트랙' },
              { emoji: '⚡', value: '24개', label: '급성장 직업' },
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
            <span className="text-5xl mb-4 block">🔥</span>
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
              <Flame className="w-5 h-5" />
              지금 시작하기
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
            © 2024 Unsan Academy. 자동차 애프터마켓 전문가를 위한 성장 플랫폼.
          </p>
        </div>
      </footer>
    </div>
  );
}
