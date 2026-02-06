import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { BentoCard } from '@/components/ui/BentoCard';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import type { VerificationStatus, SkillCategory } from '@/types';
import { verificationStatusInfo, skillCategoryInfo, calculateSkillSummary, getUserClass, classInfo } from '@/types';
import { mockSkills } from '@/lib/mockData';
import { VerificationUploadModal } from '@/components/VerificationUploadModal';
import {
  ArrowLeft,
  DollarSign,
  Shield,
  Clock,
  AlertCircle,
  Check,
  Camera,
  LogOut,
  ChevronRight,
  Bell,
  Moon,
  Globe,
  HelpCircle,
  FileText,
  TrendingUp,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Circle,
  ChevronDown,
  Award,
  Sparkles,
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export function Profile() {
  const navigate = useNavigate();
  const { profile, setProfile, currentSalary, setCurrentSalary, salaryReports, setSalaryReports, addToast } = useStore();
  const [salaryInput, setSalaryInput] = useState(currentSalary?.toString() || '');
  const [isSavingSalary, setIsSavingSalary] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'salary' | 'settings'>('profile');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (currentSalary) {
      setSalaryInput(currentSalary.toString());
    }
  }, [currentSalary]);

  useEffect(() => {
    if (profile?.id) {
      fetchSalaryReports();
    }
  }, [profile?.id]);

  const fetchSalaryReports = async () => {
    if (!profile?.id) return;
    try {
      const response = await fetch(`${API_BASE}/reports/?profile_id=${profile.id}`);
      if (response.ok) {
        const data = await response.json();
        setSalaryReports(data);
      }
    } catch {
      console.error('Failed to fetch reports');
    }
  };

  const handleSaveSalary = async () => {
    const val = parseInt(salaryInput);
    if (!isNaN(val) && val > 0 && profile) {
      setIsSavingSalary(true);
      try {
        const response = await fetch(`${API_BASE}/profiles/${profile.id}/update_salary/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_salary: val }),
        });
        if (response.ok) {
          setCurrentSalary(val);
          addToast({ message: '현재 연봉이 저장되었습니다', type: 'success' });
        }
      } catch {
        addToast({ message: '저장에 실패했습니다', type: 'error' });
      } finally {
        setIsSavingSalary(false);
      }
    }
  };

  const handleUploadProof = async (file: File) => {
    if (!profile) return;

    const formData = new FormData();
    formData.append('salary_proof_image', file);

    const response = await fetch(`${API_BASE}/profiles/${profile.id}/upload_salary_proof/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload');

    setProfile({
      ...profile,
      salary_verification_status: 'Pending',
    } as any);
    addToast({ message: '인증 요청이 제출되었습니다!', type: 'success' });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Calculate skill summary
  const skillSummary = calculateSkillSummary(profile.skills || [], mockSkills);
  const currentClass = getUserClass(skillSummary.verifiedSkillCount);
  const classData = classInfo[currentClass];
  const salaryVerificationStatus = ((profile as any).salary_verification_status || 'None') as VerificationStatus;
  const statusInfo = verificationStatusInfo[salaryVerificationStatus];

  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<SkillCategory[]>(['Maintenance']);

  const toggleCategory = (category: SkillCategory) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const settingsItems = [
    { icon: Bell, label: '알림 설정', desc: '푸시 알림 관리' },
    { icon: Moon, label: '라이트 모드', desc: '현재: 라이트' },
    { icon: Globe, label: '언어', desc: '한국어' },
    { icon: HelpCircle, label: '도움말', desc: '자주 묻는 질문' },
    { icon: FileText, label: '이용약관', desc: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-950 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-gray-950">설정</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex">
            {[
              { id: 'profile', label: '프로필' },
              { id: 'salary', label: '연봉 관리' },
              { id: 'settings', label: '설정' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? 'text-gray-950' : 'text-gray-400'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="settings-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Profile Card - Radiant Style */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 ring-1 ring-white/10">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 pointer-events-none" />

              <div className="relative p-6">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Briefcase className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Heading as="h2" size="xl" dark>
                        {profile.name}
                      </Heading>
                      {profile.isVerified && (
                        <BadgeCheck className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {profile.currentJobTitle || '정비 전문가'}
                    </p>
                    <button className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 font-medium">
                      프로필 편집 →
                    </button>
                  </div>
                </div>

                {/* Quick Stats - Skill Based */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-2xl">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-400">{skillSummary.verifiedSkillCount}</p>
                    <p className="text-xs text-slate-500 mt-1">인증 스킬</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-cyan-400">{skillSummary.acquiredSkillCount}</p>
                    <p className="text-xs text-slate-500 mt-1">습득 스킬</p>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-3xl font-bold"
                      style={{ color: classData.color }}
                    >
                      {classData.name}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">등급</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Progress - Radiant Style */}
            <BentoCard
              dark
              eyebrow="Professional Class"
              title={
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6" style={{ color: classData.color }} />
                  <span>등급 현황</span>
                </div>
              }
              className="p-0"
            >
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="px-4 py-2 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: `${classData.color}20`, color: classData.color }}
                  >
                    {classData.name}
                  </div>
                  <span className="text-slate-400 text-sm">{classData.description}</span>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">다음 등급까지</span>
                    <span className="text-xs text-yellow-400 font-medium">
                      {Math.max(0, classInfo[getUserClass(skillSummary.verifiedSkillCount + 10)].minSkills - skillSummary.verifiedSkillCount)}개 스킬 필요
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (skillSummary.verifiedSkillCount / classInfo[getUserClass(skillSummary.verifiedSkillCount + 10)].minSkills) * 100)}%`,
                        backgroundColor: classData.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Skill Matrix - Radiant Style */}
            <BentoCard
              dark
              eyebrow="Skill Portfolio"
              title={
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                  <span>스킬 인벤토리</span>
                </div>
              }
              className="p-0"
            >
              <div className="px-6 pb-6 pt-2">
                {/* Legend */}
                <div className="flex items-center gap-4 mb-4 pb-3 border-b border-slate-700/50">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 인증됨
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Circle className="w-4 h-4 text-cyan-400 fill-cyan-400/30" /> 습득함
                  </span>
                </div>

                <div className="space-y-3">
                  {(Object.keys(skillCategoryInfo) as SkillCategory[]).map((category) => {
                    const categoryData = skillCategoryInfo[category];
                    const categorySkills = mockSkills.filter(s => s.category === category);
                    const coverage = skillSummary.categoryCoverage[category];
                    const isExpanded = expandedCategories.includes(category);

                    return (
                      <div key={category} className="bg-slate-900/50 rounded-xl overflow-hidden ring-1 ring-white/5">
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{categoryData.icon}</span>
                            <span className="font-semibold text-white">{categoryData.name}</span>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                              {coverage.verified}/{coverage.acquired}/{coverage.total}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-slate-500" />
                          </motion.div>
                        </button>

                        {/* Skill List */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-2">
                                {categorySkills.map((skill) => {
                                  const userSkill = (profile.skills || []).find(s => s.skillId === skill.id);
                                  const isAcquired = userSkill?.isAcquired || false;
                                  const isVerified = userSkill?.isVerified || false;

                                  return (
                                    <div
                                      key={skill.id}
                                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                                        isVerified
                                          ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20'
                                          : isAcquired
                                          ? 'bg-cyan-500/10 ring-1 ring-cyan-500/20'
                                          : 'bg-slate-800/50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        {isVerified ? (
                                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        ) : isAcquired ? (
                                          <Circle className="w-5 h-5 text-cyan-400 fill-cyan-400/30" />
                                        ) : (
                                          <Circle className="w-5 h-5 text-slate-600" />
                                        )}
                                        <span className={`text-sm font-medium ${
                                          isVerified ? 'text-emerald-300' :
                                          isAcquired ? 'text-cyan-300' : 'text-slate-500'
                                        }`}>
                                          {skill.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {/* Difficulty */}
                                        <div className="flex gap-0.5">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                              key={i}
                                              className={`w-1.5 h-1.5 rounded-full ${
                                                i < skill.difficulty ? 'bg-yellow-400' : 'bg-slate-700'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        {/* FRT */}
                                        <span className="text-xs text-slate-500 tabular-nums">{skill.standardTime}h</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </BentoCard>
          </motion.div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Current Salary Input - Radiant Style */}
            <BentoCard
              dark
              eyebrow="Salary Management"
              title={
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <span>현재 연봉</span>
                </div>
              }
              className="p-0"
            >
              <div className="px-6 pb-6 pt-2">
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <label className="text-xs text-slate-400 mb-2 block">연봉 입력 (만원)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={salaryInput}
                      onChange={(e) => setSalaryInput(e.target.value)}
                      placeholder="연봉을 입력하세요"
                      className="flex-1 h-12 px-4 bg-slate-800 border border-slate-700 rounded-xl text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                    <span className="text-slate-400">만원</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Button
                      variant="brand"
                      onClick={handleSaveSalary}
                      disabled={isSavingSalary || !salaryInput}
                      className="flex-1"
                    >
                      {isSavingSalary ? (
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          저장
                        </>
                      )}
                    </Button>
                  </div>
                  {currentSalary && (
                    <p className="mt-4 text-sm text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      저장된 연봉: {currentSalary.toLocaleString()}만원
                    </p>
                  )}
                </div>
              </div>
            </BentoCard>

            {/* Salary Verification - Radiant Style */}
            <BentoCard
              dark
              eyebrow="Verification"
              title={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-emerald-400" />
                    <span>연봉 인증</span>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${statusInfo.bgColor}`}
                    style={{ color: statusInfo.color }}
                  >
                    {salaryVerificationStatus === 'Verified' && <Shield className="w-4 h-4" />}
                    {salaryVerificationStatus === 'Pending' && <Clock className="w-4 h-4" />}
                    {salaryVerificationStatus === 'Rejected' && <AlertCircle className="w-4 h-4" />}
                    {statusInfo.label}
                  </span>
                </div>
              }
              className="p-0"
            >
              <div className="px-6 pb-6 pt-2">
                <p className="text-sm text-slate-400 mb-5">
                  급여명세서를 제출하면 인증 배지를 받을 수 있습니다. 인증된 연봉 정보는 커뮤니티에서 더 신뢰받습니다.
                </p>

                {salaryVerificationStatus === 'None' && (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    disabled={!currentSalary}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 font-semibold rounded-xl hover:from-emerald-500/30 hover:to-emerald-600/20 transition-all flex items-center justify-center gap-2 ring-1 ring-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-5 h-5" />
                    급여명세서로 인증하기
                  </button>
                )}
                {salaryVerificationStatus === 'Pending' && (
                  <div className="py-4 bg-yellow-500/10 text-yellow-400 text-center rounded-xl ring-1 ring-yellow-500/30">
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    심사 대기 중입니다 (1-2일 소요)
                  </div>
                )}
                {salaryVerificationStatus === 'Verified' && (
                  <div className="py-4 bg-emerald-500/10 text-emerald-400 text-center rounded-xl ring-1 ring-emerald-500/30 flex items-center justify-center gap-2">
                    <Shield className="w-6 h-6" />
                    인증 완료! 게시글에 인증 배지를 표시할 수 있습니다.
                  </div>
                )}
                {salaryVerificationStatus === 'Rejected' && (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="w-full py-4 bg-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 ring-1 ring-red-500/30"
                  >
                    <Camera className="w-5 h-5" />
                    다시 인증하기
                  </button>
                )}
              </div>
            </BentoCard>

            {/* Saved Reports */}
            {salaryReports.length > 0 && (
              <BentoCard
                dark
                eyebrow="History"
                title="저장된 시뮬레이션"
                className="p-0"
              >
                <div className="px-6 pb-6 pt-2 space-y-3">
                  {salaryReports.map((report) => {
                    const isUnderpaid = report.salary_gap > 0;
                    return (
                      <div
                        key={report.id}
                        className="p-4 bg-slate-900/50 rounded-xl ring-1 ring-white/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-white">{report.target_job_title}</span>
                          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{report.years_experience}년차</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span>현재: {report.current_salary.toLocaleString()}만</span>
                          <span className="text-slate-600">→</span>
                          <span className="text-yellow-300 font-medium">시장가치: {report.estimated_salary.toLocaleString()}만</span>
                          <span className={`font-bold ${isUnderpaid ? 'text-red-400' : 'text-green-400'}`}>
                            ({isUnderpaid ? '-' : '+'}{Math.abs(report.salary_gap).toLocaleString()}만)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </BentoCard>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white/10">
              {settingsItems.map((item, i) => (
                <button
                  key={item.label}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-slate-700/50 transition-colors ${
                    i !== settingsItems.length - 1 ? 'border-b border-slate-700/50' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-slate-900/50 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-white font-medium">{item.label}</span>
                    {item.desc && (
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              ))}
            </div>

            {/* Logout */}
            <button className="w-full bg-slate-800 ring-1 ring-red-500/30 rounded-2xl p-4 flex items-center gap-4 hover:bg-red-500/10 transition-colors">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-red-400 font-medium">로그아웃</span>
            </button>

            {/* App Info */}
            <div className="text-center text-slate-500 text-sm py-4">
              <p className="font-medium">Unsan Academy v1.0.0</p>
              <p className="text-xs mt-1">© 2024 Unsan Academy</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Verification Modal */}
      <VerificationUploadModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        currentSalary={currentSalary || undefined}
        onUpload={handleUploadProof}
      />
    </div>
  );
}
