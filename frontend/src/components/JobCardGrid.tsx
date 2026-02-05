import { useState } from 'react';
import { motion } from 'framer-motion';
import { JobCard, JobCardDetailModal } from './JobCard';
import type { JobCard as JobCardType } from '@/types';

interface JobCardGridProps {
  cards: JobCardType[];
}

export function JobCardGrid({ cards }: JobCardGridProps) {
  const [selectedCard, setSelectedCard] = useState<JobCardType | null>(null);

  // Sort: unlocked first, then by title
  const sortedCards = [...cards].sort((a, b) => {
    if (a.is_unlocked && !b.is_unlocked) return -1;
    if (!a.is_unlocked && b.is_unlocked) return 1;
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
            <JobCard card={card} onClick={() => setSelectedCard(card)} />
          </motion.div>
        ))}
      </motion.div>

      <JobCardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </>
  );
}
