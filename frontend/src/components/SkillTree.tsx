import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, X, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { trackInfo, rankInfo } from '@/types';
import type { JobCard, JobTrack } from '@/types';
import { cn } from '@/lib/utils';
import { isCardUnlockable } from '@/lib/mockData';

interface SkillNodeProps {
  card: JobCard;
  isUnlocked: boolean;
  isUnlockable: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}

function SkillNode({ card, isUnlocked, isUnlockable, isHighlighted, onClick, onHover }: SkillNodeProps) {
  const isLegend = card.track === 'Hybrid';
  const isHiddenLegend = isLegend && card.isHidden && !isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        'relative cursor-pointer transition-all duration-300',
        isLegend ? 'w-20 h-20' : 'w-16 h-16',
      )}
    >
      {/* Glow effect for highlighted */}
      {isHighlighted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundColor: card.color,
            filter: 'blur(12px)',
            opacity: 0.4,
          }}
        />
      )}

      {/* Main node */}
      <div
        className={cn(
          'relative w-full h-full rounded-2xl border-2 flex items-center justify-center',
          'transition-all duration-300',
          isUnlocked
            ? 'bg-white shadow-md'
            : isUnlockable
              ? 'bg-white/80 border-dashed'
              : 'bg-gray-100',
          isHighlighted && 'ring-2 ring-offset-2',
        )}
        style={{
          borderColor: isUnlocked ? card.color : isUnlockable ? card.color : '#e5e7eb',
          boxShadow: isHighlighted ? `0 0 0 2px white, 0 0 0 4px ${card.color}` : undefined,
        }}
      >
        {/* Icon or silhouette */}
        {isHiddenLegend ? (
          <div className="text-2xl opacity-30">❓</div>
        ) : (
          <span className={cn(
            'text-2xl',
            isLegend && 'text-3xl',
            !isUnlocked && !isUnlockable && 'grayscale opacity-40'
          )}>
            {card.icon}
          </span>
        )}

        {/* Status badge */}
        <div className="absolute -top-1 -right-1">
          {isUnlocked ? (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          ) : !isUnlockable ? (
            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-gray-500" />
            </div>
          ) : null}
        </div>

        {/* Rank badge */}
        <div
          className={cn(
            'absolute -bottom-1 left-1/2 -translate-x-1/2',
            'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
          )}
          style={{ backgroundColor: card.color }}
        >
          Lv.{card.rank}
        </div>
      </div>
    </motion.div>
  );
}

interface CardDetailModalProps {
  card: JobCard | null;
  isUnlocked: boolean;
  isUnlockable: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

function CardDetailModal({ card, isUnlocked, isUnlockable, onClose, onUnlock }: CardDetailModalProps) {
  const { profile, jobCards } = useStore();

  if (!card || !profile) return null;

  const prereqCards = card.prerequisiteCardIds.map(id => jobCards.find(c => c.id === id)).filter(Boolean);
  const isHiddenLegend = card.track === 'Hybrid' && card.isHidden && !isUnlocked;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="h-2"
            style={{ backgroundColor: card.color }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl',
                  isUnlocked ? 'bg-gray-50' : 'bg-gray-100'
                )}
                style={{
                  borderColor: card.color,
                  borderWidth: 2,
                }}
              >
                {isHiddenLegend ? '❓' : card.icon}
              </div>
            </div>

            {/* Track & Rank */}
            <div className="flex justify-center gap-2 mb-3">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: card.color }}
              >
                {trackInfo[card.track].name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {rankInfo[card.rank].koreanName}
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="font-bold text-xl text-gray-900">
                {isHiddenLegend ? '???' : card.koreanTitle}
              </h2>
              <p className="text-sm text-gray-500">
                {isHiddenLegend ? '???' : card.title}
              </p>
            </div>

            {/* Description */}
            <p className="text-center text-gray-600 text-sm mb-6">
              {isHiddenLegend
                ? '선행 카드를 획득하면 정체가 드러납니다.'
                : card.description}
            </p>

            {/* Required Stats */}
            {!isHiddenLegend && Object.keys(card.requiredStats).length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 text-center mb-2">필요 스탯</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.entries(card.requiredStats).map(([stat, value]) => {
                    const current = profile.stats[stat as keyof typeof profile.stats] || 0;
                    const met = current >= (value as number);
                    return (
                      <span
                        key={stat}
                        className={cn(
                          'px-3 py-1 rounded-lg text-sm font-medium',
                          met ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        )}
                      >
                        {stat} {current}/{value}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {prereqCards.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 text-center mb-2">선행 카드</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {prereqCards.map((prereq) => {
                    if (!prereq) return null;
                    const hasPrereq = profile.unlockedCardIds.includes(prereq.id);
                    return (
                      <span
                        key={prereq.id}
                        className={cn(
                          'px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1',
                          hasPrereq ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {hasPrereq && <CheckCircle className="w-3 h-3" />}
                        {prereq.koreanTitle}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status / Action */}
            <div className="text-center">
              {isUnlocked ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  획득 완료
                </span>
              ) : isUnlockable ? (
                <button
                  onClick={onUnlock}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  카드 획득하기
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 font-medium">
                  <Lock className="w-4 h-4" />
                  조건 미충족
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function SkillTree() {
  const { profile, jobCards, highlightedPath, setHighlightedPath, unlockCard, addToast } = useStore();
  const [selectedCard, setSelectedCard] = useState<JobCard | null>(null);

  const tracks: JobTrack[] = ['Maintenance', 'BodySkin', 'HighTech', 'Management'];

  const cardsByTrack = useMemo(() => {
    const result: Record<string, JobCard[]> = {};
    for (const track of tracks) {
      result[track] = jobCards.filter(c => c.track === track).sort((a, b) => a.rank - b.rank);
    }
    result['Hybrid'] = jobCards.filter(c => c.track === 'Hybrid');
    return result;
  }, [jobCards]);

  const handleCardHover = (card: JobCard, hovering: boolean) => {
    if (hovering) {
      // Collect all prerequisite card IDs recursively
      const path: string[] = [card.id];
      const collectPrereqs = (id: string) => {
        const c = jobCards.find(x => x.id === id);
        if (!c) return;
        for (const prereqId of c.prerequisiteCardIds) {
          if (!path.includes(prereqId)) {
            path.push(prereqId);
            collectPrereqs(prereqId);
          }
        }
      };
      collectPrereqs(card.id);
      setHighlightedPath(path);
    } else {
      setHighlightedPath([]);
    }
  };

  const handleUnlock = () => {
    if (!selectedCard || !profile) return;

    const unlockable = isCardUnlockable(selectedCard, profile);
    if (!unlockable) return;

    unlockCard(selectedCard.id);
    addToast({
      message: `${selectedCard.koreanTitle} 획득!`,
      type: 'success',
    });
    setSelectedCard(null);
  };

  if (!profile) return null;

  const isUnlocked = (cardId: string) => profile.unlockedCardIds.includes(cardId);
  const isUnlockable = (card: JobCard) => isCardUnlockable(card, profile);

  return (
    <div className="pb-24">
      {/* Track Headers */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {tracks.map((track) => (
          <div
            key={track}
            className="text-center py-2 rounded-xl"
            style={{ backgroundColor: `${trackInfo[track].color}15` }}
          >
            <span className="text-lg">{trackInfo[track].icon}</span>
            <p
              className="text-xs font-semibold mt-1"
              style={{ color: trackInfo[track].color }}
            >
              {trackInfo[track].name}
            </p>
          </div>
        ))}
      </div>

      {/* Skill Tree Grid */}
      <div className="relative">
        {/* Regular Tracks (4 columns) */}
        <div className="grid grid-cols-4 gap-4">
          {tracks.map((track) => (
            <div key={track} className="flex flex-col items-center gap-6">
              {cardsByTrack[track]?.map((card, index) => (
                <div key={card.id} className="relative">
                  {/* Connection line to previous */}
                  {index > 0 && (
                    <div
                      className={cn(
                        'absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6',
                        isUnlocked(card.prerequisiteCardIds[0] || '')
                          ? 'bg-gray-300'
                          : 'bg-gray-200',
                        highlightedPath.includes(card.id) && highlightedPath.includes(card.prerequisiteCardIds[0] || '')
                          && 'bg-blue-400'
                      )}
                      style={{
                        backgroundColor: highlightedPath.includes(card.id) ? card.color : undefined,
                      }}
                    />
                  )}
                  <SkillNode
                    card={card}
                    isUnlocked={isUnlocked(card.id)}
                    isUnlockable={isUnlockable(card)}
                    isHighlighted={highlightedPath.includes(card.id)}
                    onClick={() => setSelectedCard(card)}
                    onHover={(h) => handleCardHover(card, h)}
                  />
                  {/* Card name */}
                  <p className="text-[10px] text-center text-gray-500 mt-1 max-w-16 truncate">
                    {card.koreanTitle}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center mb-6">
            <span className="text-2xl">⭐</span>
            <h3 className="font-bold text-gray-900 mt-1">레전드 클래스</h3>
            <p className="text-xs text-gray-500">여러 트랙을 마스터하면 해금됩니다</p>
          </div>

          <div className="flex justify-center gap-8">
            {cardsByTrack['Hybrid']?.map((card) => (
              <div key={card.id} className="flex flex-col items-center">
                <SkillNode
                  card={card}
                  isUnlocked={isUnlocked(card.id)}
                  isUnlockable={isUnlockable(card)}
                  isHighlighted={highlightedPath.includes(card.id)}
                  onClick={() => setSelectedCard(card)}
                  onHover={(h) => handleCardHover(card, h)}
                />
                <p className="text-xs text-center text-gray-600 mt-2 font-medium">
                  {card.isHidden && !isUnlocked(card.id) ? '???' : card.koreanTitle}
                </p>
                {/* Show prerequisites */}
                <div className="flex gap-1 mt-1">
                  {card.prerequisiteCardIds.map((prereqId) => {
                    const prereq = jobCards.find(c => c.id === prereqId);
                    return prereq ? (
                      <span
                        key={prereqId}
                        className={cn(
                          'w-2 h-2 rounded-full',
                          isUnlocked(prereqId) ? 'bg-green-400' : 'bg-gray-300'
                        )}
                        title={prereq.koreanTitle}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isUnlocked={selectedCard ? isUnlocked(selectedCard.id) : false}
        isUnlockable={selectedCard ? isUnlockable(selectedCard) : false}
        onClose={() => setSelectedCard(null)}
        onUnlock={handleUnlock}
      />
    </div>
  );
}
