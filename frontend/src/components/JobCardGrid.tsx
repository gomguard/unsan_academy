import { useState } from 'react';
import { motion } from 'framer-motion';
import { JobCard, JobCardDetailModal } from './JobCard';
import type { JobCard as JobCardType } from '@/types';

interface JobCardGridProps {
  cards: JobCardType[];
  unlockedCardIds?: string[];
}

export function JobCardGrid({ cards, unlockedCardIds = [] }: JobCardGridProps) {
  const [selectedCard, setSelectedCard] = useState<JobCardType | null>(null);

  const isUnlocked = (cardId: string) => unlockedCardIds.includes(cardId);

  // Sort: unlocked first, then by rank, then by title
  const sortedCards = [...cards].sort((a, b) => {
    const aUnlocked = isUnlocked(a.id);
    const bUnlocked = isUnlocked(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.title.localeCompare(b.title);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {sortedCards.map((card) => (
          <motion.div key={card.id} variants={itemVariants}>
            <JobCard
              card={card}
              isUnlocked={isUnlocked(card.id)}
              onClick={() => setSelectedCard(card)}
            />
          </motion.div>
        ))}
      </motion.div>

      <JobCardDetailModal
        card={selectedCard}
        isUnlocked={selectedCard ? isUnlocked(selectedCard.id) : false}
        onClose={() => setSelectedCard(null)}
      />
    </>
  );
}
