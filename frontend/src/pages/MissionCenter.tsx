import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Camera,
  Upload,
  X,
  CheckCircle,
  Flame,
  Trophy,
  Zap,
  Star,
  Timer,
  Lock,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { mockQuests } from '@/lib/mockData';
import { useStore } from '@/store/useStore';
import type { Quest, StatType, QuestCategory } from '@/types';
import { questCategoryInfo } from '@/types';
import { statColors, cn } from '@/lib/utils';

// Stat info
const statInfo: Record<StatType, { name: string; emoji: string; color: string }> = {
  Tech: { name: '기술력', emoji: '🔧', color: statColors.Tech },
  Hand: { name: '손기술', emoji: '🤲', color: statColors.Hand },
  Speed: { name: '효율', emoji: '⚡', color: statColors.Speed },
  Art: { name: '미적감각', emoji: '🎨', color: statColors.Art },
  Biz: { name: '비즈니스', emoji: '💼', color: statColors.Biz },
};

// Difficulty stars
function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'w-3 h-3',
            i <= level ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
          )}
        />
      ))}
    </div>
  );
}

// Dynamic icon component
function QuestIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent className={className} />;
}

// Confetti component
function Confetti({ show }: { show: boolean }) {
  if (!show) return null;

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
    color: ['#fbbf24', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', rotate: piece.rotation * 3, opacity: 0 }}
          transition={{ duration: 2, delay: piece.delay, ease: 'easeOut' }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}

// Quest card component
function QuestCard({
  quest,
  onStart,
}: {
  quest: Quest;
  onStart: (quest: Quest) => void;
}) {
  const stat = statInfo[quest.target_stat];
  const category = questCategoryInfo[quest.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: quest.is_available ? 1.02 : 1 }}
      className={cn(
        'bg-slate-800 border-2 rounded-2xl p-4 transition-all',
        quest.is_available
          ? 'border-slate-700 hover:border-slate-600 cursor-pointer'
          : 'border-slate-800 opacity-60'
      )}
      onClick={() => quest.is_available && onStart(quest)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${stat.color}20` }}
        >
          <QuestIcon name={quest.icon} className="w-7 h-7" style={{ color: stat.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.name}
            </span>
            <DifficultyStars level={quest.difficulty} />
          </div>

          <h3 className="font-bold text-white mb-1">{quest.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">{quest.description}</p>

          {/* Rewards */}
          <div className="flex items-center gap-3">
            <span
              className="px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              {stat.emoji} +{quest.stat_reward} {stat.name}
            </span>
            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> +{quest.xp_reward} XP
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {quest.is_available ? (
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              {quest.requires_photo ? (
                <Camera className="w-5 h-5 text-cyan-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-cyan-400" />
              )}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-500" />
            </div>
          )}
        </div>
      </div>

      {/* Cooldown indicator */}
      {!quest.is_available && quest.last_completed_at && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-500">
          <Timer className="w-4 h-4" />
          <span>쿨다운 중 - 다시 도전 가능 시간 대기</span>
        </div>
      )}

      {/* Completion count */}
      {quest.total_completions > 0 && (
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          총 {quest.total_completions}회 완료
        </div>
      )}
    </motion.div>
  );
}

// Upload Modal
function UploadModal({
  quest,
  onClose,
  onComplete,
}: {
  quest: Quest;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stat = statInfo[quest.target_stat];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    setIsUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsUploading(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-4 border-b border-slate-700"
          style={{ backgroundColor: `${stat.color}10` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QuestIcon name={quest.icon} className="w-6 h-6" style={{ color: stat.color }} />
              <div>
                <h3 className="font-bold text-white">{quest.title}</h3>
                <p className="text-sm text-slate-400">미션 인증</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-300">{quest.description}</p>

          {/* Image upload area */}
          {quest.requires_photo && (
            <div
              className={cn(
                'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
                selectedImage
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                    }}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400">사진을 업로드하세요</p>
                  <p className="text-xs text-slate-500">탭하여 갤러리에서 선택</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* Rewards preview */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2">완료 보상</p>
            <div className="flex items-center justify-center gap-4">
              <div
                className="px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                {stat.emoji} +{quest.stat_reward} {stat.name}
              </div>
              <div className="px-4 py-2 rounded-lg font-bold bg-yellow-500/20 text-yellow-400 flex items-center gap-2">
                <Zap className="w-4 h-4" /> +{quest.xp_reward} XP
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleComplete}
            disabled={quest.requires_photo && !selectedImage}
            className={cn(
              'w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all',
              quest.requires_photo && !selectedImage
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
            )}
          >
            {isUploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Upload className="w-5 h-5" />
                </motion.div>
                인증 중...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                미션 완료
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Success Modal
function SuccessModal({
  quest,
  onClose,
}: {
  quest: Quest;
  onClose: () => void;
}) {
  const stat = statInfo[quest.target_stat];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: `${stat.color}20` }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <Trophy className="w-12 h-12" style={{ color: stat.color }} />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white mb-2"
        >
          미션 완료!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 mb-6"
        >
          {quest.title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-6"
        >
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="bg-slate-900/50 rounded-xl p-3 flex items-center justify-between"
          >
            <span className="text-slate-400">{stat.name}</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.6 }}
              className="font-bold text-lg"
              style={{ color: stat.color }}
            >
              +{quest.stat_reward}
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="bg-slate-900/50 rounded-xl p-3 flex items-center justify-between"
          >
            <span className="text-slate-400">경험치</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.7 }}
              className="font-bold text-lg text-yellow-400"
            >
              +{quest.xp_reward} XP
            </motion.span>
          </motion.div>
        </motion.div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white transition-colors"
        >
          확인
        </button>
      </motion.div>
    </motion.div>
  );
}

// Main component
export function MissionCenter() {
  const { profile, addToast } = useStore();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [completedQuest, setCompletedQuest] = useState<Quest | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');

  const categories: (QuestCategory | 'all')[] = ['all', 'Daily', 'Challenge', 'Weekly', 'Special'];

  const filteredQuests = selectedCategory === 'all'
    ? mockQuests
    : mockQuests.filter((q) => q.category === selectedCategory);

  const availableQuests = filteredQuests.filter((q) => q.is_available);
  const unavailableQuests = filteredQuests.filter((q) => !q.is_available);

  const handleQuestComplete = () => {
    if (!selectedQuest) return;

    setSelectedQuest(null);
    setCompletedQuest(selectedQuest);
    setShowConfetti(true);

    // Add toast
    addToast({
      message: `${statInfo[selectedQuest.target_stat].name} +${selectedQuest.stat_reward}`,
      type: 'success',
      statType: selectedQuest.target_stat,
      statChange: selectedQuest.stat_reward,
    });

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleSuccessClose = () => {
    setCompletedQuest(null);
  };

  // Calculate stats summary
  const todayStats = {
    completed: 3,
    total: availableQuests.length,
    xpEarned: 75,
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Confetti */}
      <Confetti show={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Mission Center</h1>
                <p className="text-sm text-slate-400">일해서 스탯 올리기</p>
              </div>
            </div>
            {/* Today's progress */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-400">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{todayStats.xpEarned} XP</span>
              </div>
              <p className="text-xs text-slate-500">오늘 획득</p>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {categories.map((cat) => {
              const isAll = cat === 'all';
              const info = isAll ? null : questCategoryInfo[cat];
              const count = isAll
                ? mockQuests.length
                : mockQuests.filter((q) => q.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                    selectedCategory === cat
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  {isAll ? `전체 (${count})` : `${info?.name} (${count})`}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="font-bold text-white">오늘의 성장</h2>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(statInfo) as StatType[]).map((stat) => {
              const info = statInfo[stat];
              const value = profile?.stats[stat] || 0;

              return (
                <div key={stat} className="text-center">
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${info.color}20` }}
                  >
                    {info.emoji}
                  </div>
                  <p className="text-xs text-slate-500">{info.name}</p>
                  <p className="font-bold text-white">{value}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Available Quests */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              도전 가능 ({availableQuests.length})
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <div className="space-y-3">
            {availableQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onStart={setSelectedQuest} />
            ))}
          </div>
        </div>

        {/* Unavailable Quests */}
        {unavailableQuests.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-slate-700" />
              <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                쿨다운 중 ({unavailableQuests.length})
              </span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            <div className="space-y-3">
              {unavailableQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onStart={setSelectedQuest} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <UploadModal
            quest={selectedQuest}
            onClose={() => setSelectedQuest(null)}
            onComplete={handleQuestComplete}
          />
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {completedQuest && (
          <SuccessModal quest={completedQuest} onClose={handleSuccessClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
