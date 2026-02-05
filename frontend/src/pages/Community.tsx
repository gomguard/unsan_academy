import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  Eye,
  Send,
  Plus,
  X,
  ChevronRight,
  Award,
  TrendingUp,
  Verified,
  Clock,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Post, PostCategory, PostAuthor, TierType } from '@/types';
import { postCategoryInfo } from '@/types';

// ============ MOCK DATA ============
const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      id: 1,
      name: '김정비',
      tier: 'Diamond',
      avatar_url: undefined,
      stats: { Tech: 92, Hand: 85, Speed: 78, Art: 65, Biz: 70 },
      stat_tech: 92, stat_hand: 85, stat_speed: 78, stat_art: 65, stat_biz: 70,
    },
    category: 'Tech',
    category_display: '🔧 기술 Q&A',
    title: 'EV 고전압 배터리 진단 시 주의사항 공유',
    content: '최근 테슬라 모델Y 작업하면서 경험한 내용입니다. 고전압 시스템 작업 전 반드시 서비스 플러그를 분리하고 최소 10분간 대기해야 합니다. 그리고 절연 장갑은 1000V 등급 이상을 사용하세요.',
    likes: 45,
    views: 234,
    comment_count: 12,
    is_liked: false,
    is_mine: false,
    verified_card: 1,
    verified_card_title: 'EV 고전압 배터리 진단사',
    is_pinned: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    author: {
      id: 2,
      name: '이PPF',
      tier: 'Platinum',
      avatar_url: undefined,
      stats: { Tech: 65, Hand: 95, Speed: 82, Art: 90, Biz: 60 },
      stat_tech: 65, stat_hand: 95, stat_speed: 82, stat_art: 90, stat_biz: 60,
    },
    category: 'Salary',
    category_display: '💸 연봉 대나무숲',
    title: 'PPF 인스톨러 3년차 연봉 공개합니다',
    content: '서울 강남 샵에서 근무 중입니다. 기본급 4500 + 인센티브로 작년 총 6800 받았어요. PPF 시장이 커지면서 연봉도 같이 올랐네요.',
    likes: 89,
    views: 567,
    comment_count: 34,
    is_liked: true,
    is_mine: false,
    attached_salary_data: {
      currentSalary: 6800,
      marketValue: 6500,
      gap: 300,
      percentile: 72,
      jobTitle: 'PPF 인스톨러',
      years: 3,
    },
    is_pinned: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    author: {
      id: 3,
      name: '박튜닝',
      tier: 'Gold',
      avatar_url: undefined,
      stats: { Tech: 78, Hand: 72, Speed: 70, Art: 55, Biz: 82 },
      stat_tech: 78, stat_hand: 72, stat_speed: 70, stat_art: 55, stat_biz: 82,
    },
    category: 'Career',
    category_display: '🚀 이직/커리어',
    title: '테슬라 공인샵 이직 후기 (퍼포먼스 튜너 → EV 진단)',
    content: '기존 퍼포먼스 튜닝샵에서 7년 근무하다가 테슬라 공인샵으로 이직했습니다. 처음엔 막막했는데 운산 아카데미에서 EV 기초 과정 들으면서 많이 배웠어요.',
    likes: 56,
    views: 345,
    comment_count: 23,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    author: {
      id: 4,
      name: '최디테일',
      tier: 'Silver',
      avatar_url: undefined,
      stats: { Tech: 45, Hand: 68, Speed: 55, Art: 75, Biz: 40 },
      stat_tech: 45, stat_hand: 68, stat_speed: 55, stat_art: 75, stat_biz: 40,
    },
    category: 'Free',
    category_display: '🗣️ 자유게시판',
    title: '오늘 첫 PPF 작업 완료했습니다!',
    content: '드디어 연습만 하다가 오늘 실제 고객 차량 첫 작업 완료했네요. 긴장했는데 생각보다 잘 됐어요. 선배들 조언 덕분입니다 감사합니다!',
    likes: 23,
    views: 89,
    comment_count: 8,
    is_liked: false,
    is_mine: true,
    is_pinned: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============ TIER BADGE ============
const tierColors: Record<TierType, { bg: string; text: string; glow: string }> = {
  Unranked: { bg: 'bg-slate-600', text: 'text-slate-300', glow: '' },
  Bronze: { bg: 'bg-amber-700', text: 'text-amber-200', glow: '' },
  Silver: { bg: 'bg-slate-400', text: 'text-slate-900', glow: '' },
  Gold: { bg: 'bg-yellow-500', text: 'text-yellow-900', glow: 'shadow-yellow-500/30' },
  Platinum: { bg: 'bg-cyan-400', text: 'text-cyan-900', glow: 'shadow-cyan-400/30' },
  Diamond: { bg: 'bg-purple-400', text: 'text-purple-900', glow: 'shadow-purple-400/50' },
};

function TierBadge({ tier }: { tier: TierType }) {
  const colors = tierColors[tier];
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${colors.bg} ${colors.text} ${colors.glow ? `shadow-lg ${colors.glow}` : ''}`}>
      {tier}
    </span>
  );
}

// ============ AUTHOR CARD ============
function AuthorInfo({ author, showStat }: { author: PostAuthor; showStat?: keyof typeof author.stats }) {
  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold">
        {author.avatar_url ? (
          <img src={author.avatar_url} alt={author.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          author.name[0]
        )}
      </div>

      {/* Name & Tier */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">{author.name}</span>
          <TierBadge tier={author.tier} />
        </div>
        {showStat && (
          <div className="flex items-center gap-1 text-xs">
            <Award className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400 font-medium">{showStat} {author.stats[showStat]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ POST CARD ============
function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const categoryInfo = postCategoryInfo[post.category];
  const showStat = post.category === 'Tech' ? 'Tech' : undefined;

  const timeAgo = getTimeAgo(post.created_at);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-slate-600 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <AuthorInfo author={post.author} showStat={showStat} />
        <div className="flex items-center gap-2">
          {post.is_pinned && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-[10px] font-bold rounded">
              PINNED
            </span>
          )}
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
          >
            {categoryInfo.icon} {categoryInfo.name}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold mb-2 line-clamp-2">
        {post.verified_card_title && (
          <Verified className="w-4 h-4 inline mr-1 text-blue-400" />
        )}
        {post.title}
      </h3>

      {/* Content Preview */}
      <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.content}</p>

      {/* Salary Data Badge */}
      {post.attached_salary_data && (
        <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400 font-medium">
              연봉 {post.attached_salary_data.currentSalary.toLocaleString()}만원 공개
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              상위 {100 - post.attached_salary_data.percentile}%
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comment_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============ POST DETAIL MODAL ============
function PostDetailModal({
  post,
  onClose,
  onLike,
}: {
  post: Post | null;
  onClose: () => void;
  onLike: (postId: number) => void;
}) {
  const [comment, setComment] = useState('');

  if (!post) return null;

  const categoryInfo = postCategoryInfo[post.category];
  const showStat = post.category === 'Tech' ? 'Tech' : undefined;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 w-full sm:max-w-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <span
              className="px-3 py-1 rounded-lg text-sm font-bold"
              style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
            >
              {categoryInfo.icon} {categoryInfo.name}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Author */}
            <div className="flex items-center justify-between mb-4">
              <AuthorInfo author={post.author} showStat={showStat} />
              <span className="text-xs text-slate-500">{getTimeAgo(post.created_at)}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-4">
              {post.verified_card_title && (
                <div className="flex items-center gap-2 mb-2">
                  <Verified className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-400">{post.verified_card_title} 인증</span>
                </div>
              )}
              {post.title}
            </h2>

            {/* Content */}
            <div className="text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</div>

            {/* Salary Data */}
            {post.attached_salary_data && (
              <div className="mb-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  연봉 리포트
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">현재 연봉</p>
                    <p className="text-white font-bold">{post.attached_salary_data.currentSalary.toLocaleString()}만원</p>
                  </div>
                  <div>
                    <p className="text-slate-500">시장 가치</p>
                    <p className="text-yellow-300 font-bold">{post.attached_salary_data.marketValue.toLocaleString()}만원</p>
                  </div>
                  <div>
                    <p className="text-slate-500">경력</p>
                    <p className="text-white">{post.attached_salary_data.years}년차</p>
                  </div>
                  <div>
                    <p className="text-slate-500">시장 내 위치</p>
                    <p className={post.attached_salary_data.gap >= 0 ? 'text-green-400' : 'text-red-400'}>
                      상위 {100 - post.attached_salary_data.percentile}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 py-3 border-t border-slate-700">
              <button
                onClick={() => onLike(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.is_liked
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <div className="flex items-center gap-2 text-slate-500">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
              <h4 className="text-sm font-bold text-white mb-3">
                댓글 {post.comment_count}개
              </h4>

              {/* Comment placeholder */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white font-bold">
                      김
                    </div>
                    <span className="text-sm text-white font-medium">김정비</span>
                    <TierBadge tier="Diamond" />
                    <span className="text-xs text-slate-500">2시간 전</span>
                  </div>
                  <p className="text-sm text-slate-300">좋은 정보 감사합니다! 저도 다음에 작업할 때 참고하겠습니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-slate-700 bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 h-10 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400/50"
              />
              <button className="h-10 px-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============ WRITE POST MODAL ============
function WritePostModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: PostCategory; title: string; content: string }) => void;
}) {
  const [category, setCategory] = useState<PostCategory>('Free');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ category, title, content });
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 w-full sm:max-w-lg sm:rounded-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">새 글 작성</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Category */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">카테고리</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(postCategoryInfo) as [PostCategory, typeof postCategoryInfo[PostCategory]][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    category === key
                      ? 'ring-2 ring-yellow-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                  style={{
                    backgroundColor: category === key ? `${info.color}20` : undefined,
                    color: category === key ? info.color : undefined,
                  }}
                >
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full h-12 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400/50"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={6}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400/50 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            게시하기
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ HELPER ============
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

// ============ MAIN COMPONENT ============
export function Community() {
  const { profile, posts, setPosts, selectedCategory, setSelectedCategory, togglePostLike } = useStore();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Load mock posts on mount
  useEffect(() => {
    setPosts(mockPosts);
  }, [setPosts]);

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((post) => post.category === selectedCategory);

  // Handle like
  const handleLike = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const newLiked = !post.is_liked;
    const newLikes = newLiked ? post.likes + 1 : post.likes - 1;
    togglePostLike(postId, newLiked, newLikes);

    // Update selected post if it's the same
    if (selectedPost?.id === postId) {
      setSelectedPost({ ...selectedPost, is_liked: newLiked, likes: newLikes });
    }
  };

  // Handle new post
  const handleNewPost = (data: { category: PostCategory; title: string; content: string }) => {
    const newPost: Post = {
      id: Date.now(),
      author: {
        id: profile?.id || 0,
        name: profile?.name || '익명',
        tier: profile?.tier || 'Unranked',
        avatar_url: profile?.avatar_url,
        stats: profile?.stats || { Tech: 10, Hand: 10, Speed: 10, Art: 10, Biz: 10 },
        stat_tech: profile?.stat_tech || 10,
        stat_hand: profile?.stat_hand || 10,
        stat_speed: profile?.stat_speed || 10,
        stat_art: profile?.stat_art || 10,
        stat_biz: profile?.stat_biz || 10,
      },
      category: data.category,
      category_display: postCategoryInfo[data.category].icon + ' ' + postCategoryInfo[data.category].name,
      title: data.title,
      content: data.content,
      likes: 0,
      views: 0,
      comment_count: 0,
      is_liked: false,
      is_mine: true,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
  };

  const categories = ['all', ...Object.keys(postCategoryInfo)] as const;

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold text-white">커뮤니티</h1>
            <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-xs font-bold rounded-full">
              {posts.length}개 글
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const info = cat === 'all' ? null : postCategoryInfo[cat as PostCategory];

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as PostCategory | 'all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? '전체' : `${info?.icon} ${info?.name}`}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Posts List */}
      <div className="p-4 space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard post={post} onClick={() => setSelectedPost(post)} />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">아직 글이 없습니다.</p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              첫 글 작성하기
            </button>
          </div>
        )}
      </div>

      {/* FAB - Write Post Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsWriteModalOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/30 flex items-center justify-center text-gray-900 z-40"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
        />
      )}

      {/* Write Post Modal */}
      <WritePostModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleNewPost}
      />
    </div>
  );
}
