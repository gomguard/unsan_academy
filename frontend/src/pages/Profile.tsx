import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { StatRadarChart, StatBar } from '@/components/StatRadarChart';
import { PageHeader } from '@/components';
import type { StatType, VerificationStatus } from '@/types';
import { verificationStatusInfo } from '@/types';
import { VerificationUploadModal } from '@/components/VerificationUploadModal';
import {
  User,
  ArrowLeft,
  DollarSign,
  Shield,
  Clock,
  AlertCircle,
  Check,
  Camera,
  Settings,
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
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export function Profile() {
  const navigate = useNavigate();
  const { profile, setProfile, currentSalary, setCurrentSalary, salaryReports, setSalaryReports, addToast } = useStore();
  const [salaryInput, setSalaryInput] = useState(currentSalary?.toString() || '');
  const [isSavingSalary, setIsSavingSalary] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'salary' | 'settings'>('profile');

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const totalStats = Object.values(profile.stats).reduce((a, b) => a + b, 0);
  const salaryVerificationStatus = ((profile as any).salary_verification_status || 'None') as VerificationStatus;
  const statusInfo = verificationStatusInfo[salaryVerificationStatus];

  const settingsItems = [
    { icon: Bell, label: '알림 설정', desc: '푸시 알림 관리' },
    { icon: Moon, label: '다크 모드', desc: '현재: 다크' },
    { icon: Globe, label: '언어', desc: '한국어' },
    { icon: HelpCircle, label: '도움말', desc: '자주 묻는 질문' },
    { icon: FileText, label: '이용약관', desc: '' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-white">설정</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-slate-900 border-b border-slate-800">
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
                  activeTab === tab.id ? 'text-yellow-400' : 'text-slate-500'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="settings-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
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
            {/* Profile Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                  <Briefcase className="w-10 h-10 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                    {profile.isVerified && (
                      <BadgeCheck className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {profile.currentJobTitle || '정비 전문가'}
                  </p>
                  <button className="mt-2 text-xs text-yellow-400 hover:text-yellow-300">
                    프로필 편집 →
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">{totalStats}</p>
                  <p className="text-xs text-slate-500">스킬 자산</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{profile.unlockedCardIds.length}</p>
                  <p className="text-xs text-slate-500">해금 직업</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{profile.xp.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">경험치</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                스킬 자산 현황
              </h3>
              <StatRadarChart stats={profile.stats} />
            </div>

            {/* Stat Bars */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-white">상세 역량</h3>
              {(Object.keys(profile.stats) as StatType[]).map((stat) => (
                <StatBar key={stat} statType={stat} value={profile.stats[stat]} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Current Salary Input */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-white">현재 연봉</h3>
              </div>

              <div className="p-3 bg-slate-900/50 rounded-lg">
                <label className="text-xs text-slate-400 mb-2 block">연봉 입력 (만원)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    placeholder="연봉을 입력하세요"
                    className="flex-1 h-12 px-4 bg-slate-800 border border-slate-600 rounded-lg text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-green-400/50"
                  />
                  <span className="text-slate-400">만원</span>
                  <button
                    onClick={handleSaveSalary}
                    disabled={isSavingSalary || !salaryInput}
                    className="h-12 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSavingSalary ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        저장
                      </>
                    )}
                  </button>
                </div>
                {currentSalary && (
                  <p className="mt-3 text-sm text-green-400">
                    ✓ 저장된 연봉: {currentSalary.toLocaleString()}만원
                  </p>
                )}
              </div>
            </div>

            {/* Salary Verification */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white">연봉 인증</h3>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${statusInfo.bgColor}`}
                  style={{ color: statusInfo.color }}
                >
                  {salaryVerificationStatus === 'Verified' && <Shield className="w-3 h-3" />}
                  {salaryVerificationStatus === 'Pending' && <Clock className="w-3 h-3" />}
                  {salaryVerificationStatus === 'Rejected' && <AlertCircle className="w-3 h-3" />}
                  {statusInfo.label}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-4">
                급여명세서를 제출하면 인증 배지를 받을 수 있습니다. 인증된 연봉 정보는 커뮤니티에서 더 신뢰받습니다.
              </p>

              {salaryVerificationStatus === 'None' && (
                <button
                  onClick={() => setShowVerificationModal(true)}
                  disabled={!currentSalary}
                  className="w-full py-3 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5" />
                  급여명세서로 인증하기
                </button>
              )}
              {salaryVerificationStatus === 'Pending' && (
                <div className="py-3 bg-yellow-500/10 text-yellow-400 text-center rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1" />
                  심사 대기 중입니다 (1-2일 소요)
                </div>
              )}
              {salaryVerificationStatus === 'Verified' && (
                <div className="py-3 bg-emerald-500/10 text-emerald-400 text-center rounded-lg flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  인증 완료! 게시글에 인증 배지를 표시할 수 있습니다.
                </div>
              )}
              {salaryVerificationStatus === 'Rejected' && (
                <button
                  onClick={() => setShowVerificationModal(true)}
                  className="w-full py-3 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  다시 인증하기
                </button>
              )}
            </div>

            {/* Saved Reports */}
            {salaryReports.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="font-bold text-white mb-3">저장된 시뮬레이션</h3>
                <div className="space-y-2">
                  {salaryReports.map((report) => {
                    const isUnderpaid = report.salary_gap > 0;
                    return (
                      <div
                        key={report.id}
                        className="p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white">{report.target_job_title}</span>
                          <span className="text-xs text-slate-500">{report.years_experience}년차</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span>현재: {report.current_salary.toLocaleString()}만</span>
                          <span>→</span>
                          <span className="text-yellow-300">시장가치: {report.estimated_salary.toLocaleString()}만</span>
                          <span className={isUnderpaid ? 'text-red-400' : 'text-green-400'}>
                            ({isUnderpaid ? '-' : '+'}{Math.abs(report.salary_gap).toLocaleString()}만)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              {settingsItems.map((item, i) => (
                <button
                  key={item.label}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-slate-700/50 transition-colors ${
                    i !== settingsItems.length - 1 ? 'border-b border-slate-700' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 text-left">
                    <span className="text-white">{item.label}</span>
                    {item.desc && (
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              ))}
            </div>

            {/* Logout */}
            <button className="w-full bg-slate-800 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">로그아웃</span>
            </button>

            {/* App Info */}
            <div className="text-center text-slate-500 text-sm">
              <p>Unsan Academy v1.0.0</p>
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
