import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  TrendingUp,
  Award,
  Users,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Target,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: '스킬 시각화',
    description: '5가지 핵심 역량을 한눈에 파악하고 성장 방향을 설정하세요.',
  },
  {
    icon: Target,
    title: '일일 미션',
    description: 'SOP 기반 미션을 완료하고 경험치와 스탯을 올리세요.',
  },
  {
    icon: Award,
    title: '잡 카드 수집',
    description: '전문 분야를 인증받고 레전더리 잡 카드를 획득하세요.',
  },
  {
    icon: TrendingUp,
    title: '티어 시스템',
    description: 'Bronze부터 Diamond까지, 당신의 성장을 증명하세요.',
  },
];

const stats = [
  { value: '5,000+', label: '등록 정비사' },
  { value: '50,000+', label: '완료된 미션' },
  { value: '1,200+', label: '획득된 잡 카드' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Unsan Academy</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              로그인
            </Link>
            <Link
              to="/dashboard"
              className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-6">
              <Wrench className="w-4 h-4" />
              자동차 정비사를 위한 성장 플랫폼
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              당신의 정비 실력을
              <br />
              <span className="text-primary-600">눈에 보이게</span> 만드세요
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Unsan Academy와 함께 체계적으로 성장하세요.
              스킬 트래킹, 미션 시스템, 잡 카드 컬렉션으로
              정비사 커리어의 새로운 기준을 경험하세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                무료로 시작하기
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                데모 체험하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              게이미피케이션으로 성장을 즐겁게
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              일상적인 정비 업무가 성장의 기회가 됩니다.
              미션을 완료하고, 스탯을 올리고, 특별한 잡 카드를 획득하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Penta-Stat Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                5가지 핵심 역량,
                <br />
                Penta-Stat 시스템
              </h2>
              <p className="text-gray-600 mb-6">
                Tech, Hand, Speed, Art, Biz - 정비사에게 필요한 모든 역량을
                체계적으로 관리하고 성장시키세요.
              </p>
              <ul className="space-y-3">
                {[
                  { name: 'Tech', desc: '진단 능력과 기술 지식' },
                  { name: 'Hand', desc: '정비 손기술과 꼼꼼함' },
                  { name: 'Speed', desc: '작업 효율성과 속도' },
                  { name: 'Art', desc: '디테일링과 마감 미학' },
                  { name: 'Biz', desc: '고객 응대와 영업력' },
                ].map((stat) => (
                  <li key={stat.name} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      <span className="font-semibold">{stat.name}</span> - {stat.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="aspect-square flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full max-w-[250px]">
                  {/* Pentagon background */}
                  <polygon
                    points="100,20 180,70 160,160 40,160 20,70"
                    fill="#f3f4f6"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  {/* Stats polygon */}
                  <polygon
                    points="100,50 150,80 140,130 60,130 50,80"
                    fill="#3b82f6"
                    fillOpacity="0.2"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  {/* Labels */}
                  <text x="100" y="15" textAnchor="middle" className="text-xs fill-gray-500">Tech</text>
                  <text x="190" y="75" textAnchor="start" className="text-xs fill-gray-500">Hand</text>
                  <text x="170" y="170" textAnchor="start" className="text-xs fill-gray-500">Speed</text>
                  <text x="30" y="170" textAnchor="end" className="text-xs fill-gray-500">Art</text>
                  <text x="10" y="75" textAnchor="end" className="text-xs fill-gray-500">Biz</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-gray-600 mb-8">
            무료로 가입하고 당신의 정비사 커리어를 레벨업하세요.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            무료로 시작하기
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Unsan Academy</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Unsan Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
