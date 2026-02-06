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
  Shield,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Post, PostCategory, PostAuthor, TierType, SalaryReport, Comment } from '@/types';
import { postCategoryInfo, verificationStatusInfo } from '@/types';
import { ReportCard } from '@/components/ReportCard';
import { ReportSelectDrawer } from '@/components/ReportSelectDrawer';

// ============ MOCK DATA ============
const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      id: 1,
      name: '김정비',
      tier: 'S-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 92, Mechanical: 85, Efficiency: 78, Quality: 65, Communication: 70 },
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
      tier: 'A-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 65, Mechanical: 95, Efficiency: 82, Quality: 90, Communication: 60 },
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
      tier: 'B-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 78, Mechanical: 72, Efficiency: 70, Quality: 55, Communication: 82 },
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
      tier: 'C-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 45, Mechanical: 68, Efficiency: 55, Quality: 75, Communication: 40 },
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
  {
    id: 5,
    author: {
      id: 5,
      name: '정ADAS',
      tier: 'A-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 88, Mechanical: 70, Efficiency: 75, Quality: 50, Communication: 65 },
      stat_tech: 88, stat_hand: 70, stat_speed: 75, stat_art: 50, stat_biz: 65,
    },
    category: 'Tech',
    category_display: '🔧 기술 Q&A',
    title: 'ADAS 캘리브레이션 장비 추천 부탁드립니다',
    content: '현재 Autel IA900WA 사용 중인데, Hunter Hawkeye Elite로 업그레이드 고민 중입니다. 혹시 두 장비 모두 써보신 분 계신가요? 정확도랑 사용 편의성 차이가 궁금합니다.',
    likes: 32,
    views: 189,
    comment_count: 18,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    author: {
      id: 6,
      name: '한덴트',
      tier: 'B-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 55, Mechanical: 92, Efficiency: 80, Quality: 70, Communication: 55 },
      stat_tech: 55, stat_hand: 92, stat_speed: 80, stat_art: 70, stat_biz: 55,
    },
    category: 'Salary',
    category_display: '💸 연봉 대나무숲',
    title: 'PDR 기술자 5년차 솔직 연봉',
    content: '대구 지역에서 PDR 전문으로 5년째 일하고 있습니다. 보험사 협력이라 안정적인 물량 있고, 월 평균 450-500 정도 벌어요. 연으로 치면 5400-6000 사이입니다.',
    likes: 67,
    views: 423,
    comment_count: 29,
    is_liked: false,
    is_mine: false,
    attached_salary_data: {
      currentSalary: 5700,
      marketValue: 5500,
      gap: 200,
      percentile: 65,
      jobTitle: 'PDR 기술자',
      years: 5,
    },
    is_pinned: false,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    author: {
      id: 7,
      name: '윤하이브리드',
      tier: 'S-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 95, Mechanical: 78, Efficiency: 82, Quality: 45, Communication: 60 },
      stat_tech: 95, stat_hand: 78, stat_speed: 82, stat_art: 45, stat_biz: 60,
    },
    category: 'Tech',
    category_display: '🔧 기술 Q&A',
    title: '프리우스 4세대 인버터 냉각수 교환 주기',
    content: '매뉴얼상 16만km인데, 실제로 10만km 넘어가면 냉각수 상태가 많이 안 좋아지더라고요. 혼합해서 쓰면 안 되고, 반드시 Toyota Super Long Life Coolant 사용하세요.',
    likes: 38,
    views: 267,
    comment_count: 15,
    is_liked: true,
    is_mine: false,
    verified_card: 2,
    verified_card_title: '하이브리드 전문가',
    is_pinned: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    author: {
      id: 8,
      name: '송랩핑',
      tier: 'C-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 50, Mechanical: 85, Efficiency: 70, Quality: 88, Communication: 45 },
      stat_tech: 50, stat_hand: 85, stat_speed: 70, stat_art: 88, stat_biz: 45,
    },
    category: 'Free',
    category_display: '🗣️ 자유게시판',
    title: '요즘 컬러 랩핑 인기 색상이 뭔가요?',
    content: '작년엔 새틴 그레이가 대세였는데, 요즘은 손님들 취향이 좀 바뀐 것 같아요. 혹시 요즘 많이 찾는 색상 있으면 공유해주세요!',
    likes: 19,
    views: 134,
    comment_count: 22,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    author: {
      id: 9,
      name: '오SA',
      tier: 'A-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 72, Mechanical: 55, Efficiency: 68, Quality: 50, Communication: 90 },
      stat_tech: 72, stat_hand: 55, stat_speed: 68, stat_art: 50, stat_biz: 90,
    },
    category: 'Career',
    category_display: '🚀 이직/커리어',
    title: '정비사에서 서비스 어드바이저로 전직한 후기',
    content: '정비 현장에서 6년 일하다가 BMW 공식 딜러 SA로 전직했습니다. 연봉은 비슷한데 체력적으로 훨씬 편해요. 대신 고객 응대 스트레스는 있습니다. 정비 경험 있으니까 고객 설명할 때 신뢰도가 높아요.',
    likes: 78,
    views: 512,
    comment_count: 41,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    author: {
      id: 10,
      name: '임휠',
      tier: 'B-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 60, Mechanical: 88, Efficiency: 75, Quality: 82, Communication: 50 },
      stat_tech: 60, stat_hand: 88, stat_speed: 75, stat_art: 82, stat_biz: 50,
    },
    category: 'Tech',
    category_display: '🔧 기술 Q&A',
    title: '다이아컷팅 휠 복원 시 클리어코트 추천',
    content: '2K 우레탄 클리어 쓰다가 파우더 클리어로 바꿨는데 내구성이 확실히 좋아졌어요. 비용은 좀 더 들지만 재작업 줄어서 결국 이득입니다. 어떤 제품 쓰시나요?',
    likes: 27,
    views: 156,
    comment_count: 13,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    author: {
      id: 11,
      name: '강충전',
      tier: 'C-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 75, Mechanical: 60, Efficiency: 70, Quality: 40, Communication: 55 },
      stat_tech: 75, stat_hand: 60, stat_speed: 70, stat_art: 40, stat_biz: 55,
    },
    category: 'Salary',
    category_display: '💸 연봉 대나무숲',
    title: 'EV 충전 인프라 유지보수 1년차 연봉',
    content: '전기기사 자격증으로 충전기 유지보수 시작했습니다. 신입인데 연봉 3800 받고 있고, 출장비 별도라 실수령은 더 됩니다. 블루오션이라 그런지 야근도 거의 없어요.',
    likes: 45,
    views: 289,
    comment_count: 19,
    is_liked: false,
    is_mine: false,
    attached_salary_data: {
      currentSalary: 3800,
      marketValue: 4000,
      gap: -200,
      percentile: 45,
      jobTitle: '충전 인프라 유지보수',
      years: 1,
    },
    is_pinned: false,
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    author: {
      id: 12,
      name: '배캠퍼',
      tier: 'B-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 68, Mechanical: 80, Efficiency: 65, Quality: 75, Communication: 72 },
      stat_tech: 68, stat_hand: 80, stat_speed: 65, stat_art: 75, stat_biz: 72,
    },
    category: 'Free',
    category_display: '🗣️ 자유게시판',
    title: '캠핑카 빌드 첫 프로젝트 완성!',
    content: '스타렉스 기반으로 3개월 걸려서 완성했습니다. 전기 배선이 제일 어려웠는데 유튜브 보면서 독학했어요. 사진 공유합니다! 다음엔 카니발로 도전해볼 예정입니다.',
    likes: 112,
    views: 678,
    comment_count: 47,
    is_liked: true,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 13,
    author: {
      id: 13,
      name: '조ECU',
      tier: 'S-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 98, Mechanical: 65, Efficiency: 72, Quality: 55, Communication: 68 },
      stat_tech: 98, stat_hand: 65, stat_speed: 72, stat_art: 55, stat_biz: 68,
    },
    category: 'Tech',
    category_display: '🔧 기술 Q&A',
    title: 'WinOLS 맵 분석 기초 강좌 공유',
    content: '제가 ECU 튜닝 배우면서 정리한 WinOLS 기초 자료입니다. 맵 찾는 방법부터 기본적인 수정 방법까지 담았어요. 입문자분들께 도움이 됐으면 좋겠습니다.',
    likes: 156,
    views: 892,
    comment_count: 63,
    is_liked: false,
    is_mine: false,
    verified_card: 3,
    verified_card_title: 'ECU 튜너',
    is_pinned: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 14,
    author: {
      id: 14,
      name: '신틴팅',
      tier: 'Trainee',
      avatar_url: undefined,
      stats: { Diagnostic: 40, Mechanical: 72, Efficiency: 65, Quality: 68, Communication: 35 },
      stat_tech: 40, stat_hand: 72, stat_speed: 65, stat_art: 68, stat_biz: 35,
    },
    category: 'Career',
    category_display: '🚀 이직/커리어',
    title: '틴팅에서 PPF로 전환 고민 중입니다',
    content: '틴팅 2년차인데, 선배들 말로는 PPF가 수익성이 더 좋다고 하더라고요. 근데 진입장벽이 높다고도 하고... 혹시 틴팅에서 PPF로 전환하신 분 조언 부탁드려요.',
    likes: 34,
    views: 201,
    comment_count: 28,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 15,
    author: {
      id: 15,
      name: '문판금',
      tier: 'A-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 70, Mechanical: 95, Efficiency: 78, Quality: 72, Communication: 55 },
      stat_tech: 70, stat_hand: 95, stat_speed: 78, stat_art: 72, stat_biz: 55,
    },
    category: 'Salary',
    category_display: '💸 연봉 대나무숲',
    title: '알루미늄 바디 수리 전문 8년차',
    content: '테슬라/아우디 알루미늄 바디 전문으로 하고 있습니다. 일반 판금보다 단가가 높아서 연봉 7200까지 올렸어요. 인증 받는 게 어렵긴 한데 투자할 가치가 있습니다.',
    likes: 98,
    views: 634,
    comment_count: 38,
    is_liked: false,
    is_mine: false,
    attached_salary_data: {
      currentSalary: 7200,
      marketValue: 6800,
      gap: 400,
      percentile: 82,
      jobTitle: '알루미늄 바디 전문',
      years: 8,
    },
    is_pinned: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 16,
    author: {
      id: 16,
      name: '양세라믹',
      tier: 'B-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 58, Mechanical: 88, Efficiency: 72, Quality: 85, Communication: 60 },
      stat_tech: 58, stat_hand: 88, stat_speed: 72, stat_art: 85, stat_biz: 60,
    },
    category: 'Free',
    category_display: '🗣️ 자유게시판',
    title: '세라믹 코팅 vs 유리막 코팅 차이점 정리',
    content: '손님들이 자주 물어보셔서 정리해봤습니다. 세라믹은 SiO2 비율이 높고 유리막은 폴리실라잔 기반이에요. 지속력은 세라믹이 좋고, 광택은 유리막이 더 좋은 것 같아요.',
    likes: 87,
    views: 456,
    comment_count: 31,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 17,
    author: {
      id: 17,
      name: '권진단',
      tier: 'A-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 90, Mechanical: 72, Efficiency: 80, Quality: 48, Communication: 65 },
      stat_tech: 90, stat_hand: 72, stat_speed: 80, stat_art: 48, stat_biz: 65,
    },
    category: 'Tech',
    category_display: '🔧 기술 Q&A',
    title: '벤츠 W213 에어매틱 고장 진단 팁',
    content: 'E클래스 에어매틱 문제 많이들 겪으시죠. XENTRY로 레벨링 센서 값이랑 컴프레셔 작동 시간 먼저 체크하세요. 한쪽만 처지면 대부분 에어스프링 누유입니다.',
    likes: 54,
    views: 312,
    comment_count: 19,
    is_liked: true,
    is_mine: false,
    verified_card: 4,
    verified_card_title: '수입차 진단 전문가',
    is_pinned: false,
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 18,
    author: {
      id: 18,
      name: '홍브레이크',
      tier: 'C-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 55, Mechanical: 78, Efficiency: 70, Quality: 45, Communication: 50 },
      stat_tech: 55, stat_hand: 78, stat_speed: 70, stat_art: 45, stat_biz: 50,
    },
    category: 'Career',
    category_display: '🚀 이직/커리어',
    title: '경정비에서 브레이크 전문으로 특화하려고 합니다',
    content: '경정비 3년 했는데 전문성을 키우고 싶어요. 브레이크 튜닝 쪽으로 가려는데, 어떤 교육이나 자격증이 도움이 될까요? 경험자분들 조언 부탁드립니다.',
    likes: 21,
    views: 145,
    comment_count: 16,
    is_liked: false,
    is_mine: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 19,
    author: {
      id: 19,
      name: '유광택',
      tier: 'B-Class',
      avatar_url: undefined,
      stats: { Diagnostic: 52, Mechanical: 90, Efficiency: 75, Quality: 92, Communication: 58 },
      stat_tech: 52, stat_hand: 90, stat_speed: 75, stat_art: 92, stat_biz: 58,
    },
    category: 'Salary',
    category_display: '💸 연봉 대나무숲',
    title: '디테일링샵 창업 1년 수익 공개',
    content: '작년에 독립해서 1인 샵 운영 중입니다. 월 평균 매출 800, 순수익 500 정도예요. 광택/코팅 위주로 하고 있고, 인스타 마케팅이 효과가 좋았어요.',
    likes: 134,
    views: 789,
    comment_count: 52,
    is_liked: false,
    is_mine: false,
    attached_salary_data: {
      currentSalary: 6000,
      marketValue: 5000,
      gap: 1000,
      percentile: 78,
      jobTitle: '디테일링 샵 대표',
      years: 6,
    },
    is_pinned: false,
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============ MOCK COMMENTS ============
const mockCommentAuthors: PostAuthor[] = [
  { id: 101, name: '김정비', tier: 'S-Class', stats: { Diagnostic: 92, Mechanical: 85, Efficiency: 78, Quality: 65, Communication: 70 }, stat_tech: 92, stat_hand: 85, stat_speed: 78, stat_art: 65, stat_biz: 70 },
  { id: 102, name: '이PPF', tier: 'A-Class', stats: { Diagnostic: 65, Mechanical: 95, Efficiency: 82, Quality: 90, Communication: 60 }, stat_tech: 65, stat_hand: 95, stat_speed: 82, stat_art: 90, stat_biz: 60 },
  { id: 103, name: '박튜닝', tier: 'B-Class', stats: { Diagnostic: 78, Mechanical: 72, Efficiency: 70, Quality: 55, Communication: 82 }, stat_tech: 78, stat_hand: 72, stat_speed: 70, stat_art: 55, stat_biz: 82 },
  { id: 104, name: '최디테일', tier: 'C-Class', stats: { Diagnostic: 45, Mechanical: 68, Efficiency: 55, Quality: 75, Communication: 40 }, stat_tech: 45, stat_hand: 68, stat_speed: 55, stat_art: 75, stat_biz: 40 },
  { id: 105, name: '정ADAS', tier: 'A-Class', stats: { Diagnostic: 88, Mechanical: 70, Efficiency: 75, Quality: 50, Communication: 65 }, stat_tech: 88, stat_hand: 70, stat_speed: 75, stat_art: 50, stat_biz: 65 },
  { id: 106, name: '한덴트', tier: 'B-Class', stats: { Diagnostic: 55, Mechanical: 92, Efficiency: 80, Quality: 70, Communication: 55 }, stat_tech: 55, stat_hand: 92, stat_speed: 80, stat_art: 70, stat_biz: 55 },
  { id: 107, name: '윤하이브리드', tier: 'S-Class', stats: { Diagnostic: 95, Mechanical: 78, Efficiency: 82, Quality: 45, Communication: 60 }, stat_tech: 95, stat_hand: 78, stat_speed: 82, stat_art: 45, stat_biz: 60 },
  { id: 108, name: '송랩핑', tier: 'C-Class', stats: { Diagnostic: 50, Mechanical: 85, Efficiency: 70, Quality: 88, Communication: 45 }, stat_tech: 50, stat_hand: 85, stat_speed: 70, stat_art: 88, stat_biz: 45 },
  { id: 109, name: '오SA', tier: 'A-Class', stats: { Diagnostic: 72, Mechanical: 55, Efficiency: 68, Quality: 50, Communication: 90 }, stat_tech: 72, stat_hand: 55, stat_speed: 68, stat_art: 50, stat_biz: 90 },
  { id: 110, name: '임휠', tier: 'B-Class', stats: { Diagnostic: 60, Mechanical: 88, Efficiency: 75, Quality: 82, Communication: 50 }, stat_tech: 60, stat_hand: 88, stat_speed: 75, stat_art: 82, stat_biz: 50 },
];

const commentTemplates = [
  '좋은 정보 감사합니다! 많이 배웠어요.',
  '저도 비슷한 경험 있는데, 정말 공감됩니다.',
  '혹시 구체적으로 어떤 장비 쓰셨나요?',
  '이 방법 써봤는데 효과 좋았어요!',
  '와 이건 몰랐네요. 메모해둡니다.',
  '저도 다음에 시도해봐야겠어요.',
  '현직자 의견 들으니 도움이 많이 됩니다.',
  '혹시 관련 교육 과정 추천해주실 수 있나요?',
  '정말 유용한 팁이네요. 감사합니다!',
  '저희 샵에서도 이렇게 하고 있어요.',
  '비용 대비 효과가 좋은가요?',
  '초보자도 할 수 있을까요?',
  '어느 정도 경력이면 가능할까요?',
  '자격증 없이도 가능한가요?',
  '인증 받으시는 데 얼마나 걸리셨어요?',
  '수도권 외 지역도 수요가 있나요?',
  '창업 비용은 대략 어느 정도 드나요?',
  '후속 글도 기대하겠습니다!',
  '이거 북마크 해둬야겠네요.',
  '실무에 바로 적용할 수 있겠어요.',
];

function generateMockComments(postId: number, count: number): Comment[] {
  const comments: Comment[] = [];
  const usedTemplates = new Set<number>();

  for (let i = 0; i < Math.min(count, 8); i++) {
    let templateIdx: number;
    do {
      templateIdx = Math.floor(Math.random() * commentTemplates.length);
    } while (usedTemplates.has(templateIdx) && usedTemplates.size < commentTemplates.length);
    usedTemplates.add(templateIdx);

    const authorIdx = Math.floor(Math.random() * mockCommentAuthors.length);
    const hoursAgo = Math.floor(Math.random() * 72) + 1;

    comments.push({
      id: postId * 100 + i,
      post: postId,
      author: mockCommentAuthors[authorIdx],
      content: commentTemplates[templateIdx],
      likes: Math.floor(Math.random() * 20),
      is_mine: false,
      created_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
    });
  }

  return comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// Add comments to posts
mockPosts.forEach(post => {
  post.comments = generateMockComments(post.id, post.comment_count);
});

// ============ CLASS BADGE (Professional Grading) ============
const classColors: Record<TierType, { bg: string; text: string; glow: string }> = {
  Trainee: { bg: 'bg-slate-600', text: 'text-slate-300', glow: '' },
  'C-Class': { bg: 'bg-violet-500', text: 'text-violet-100', glow: '' },
  'B-Class': { bg: 'bg-cyan-400', text: 'text-cyan-900', glow: 'shadow-cyan-400/30' },
  'A-Class': { bg: 'bg-amber-400', text: 'text-amber-900', glow: 'shadow-amber-400/30' },
  'S-Class': { bg: 'bg-pink-400', text: 'text-pink-900', glow: 'shadow-pink-400/40' },
  Master: { bg: 'bg-purple-400', text: 'text-purple-900', glow: 'shadow-purple-400/50' },
};
// Legacy tier alias
const tierColors = classColors;

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

      {/* Attached Salary Report */}
      {post.attached_report ? (
        <div className="mb-3">
          <ReportCard report={post.attached_report} compact />
        </div>
      ) : post.attached_salary_data && (
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

            {/* Attached Salary Report */}
            {post.attached_report ? (
              <div className="mb-4">
                <ReportCard report={post.attached_report} />
              </div>
            ) : post.attached_salary_data && (
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

              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white font-bold">
                          {comment.author.name[0]}
                        </div>
                        <span className="text-sm text-white font-medium">{comment.author.name}</span>
                        <TierBadge tier={comment.author.tier} />
                        <span className="text-xs text-slate-500">{getTimeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-slate-300">{comment.content}</p>
                      {comment.likes > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <Heart className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {post.comment_count > (post.comments?.length || 0) && (
                    <p className="text-center text-xs text-slate-500 py-2">
                      +{post.comment_count - (post.comments?.length || 0)}개의 댓글 더보기
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-sm text-slate-500 py-4">아직 댓글이 없습니다.</p>
              )}
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
  onSubmit: (data: { category: PostCategory; title: string; content: string; attached_report?: number }) => void;
}) {
  const { salaryReports } = useStore();
  const [category, setCategory] = useState<PostCategory>('Free');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedReport, setSelectedReport] = useState<SalaryReport | null>(null);
  const [showReportDrawer, setShowReportDrawer] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      category,
      title,
      content,
      attached_report: selectedReport?.id,
    });
    setTitle('');
    setContent('');
    setSelectedReport(null);
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

          {/* Report Attachment */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">연봉 리포트 첨부 (선택)</label>
            {selectedReport ? (
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <ReportCard report={selectedReport} compact />
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowReportDrawer(true)}
                className="w-full p-3 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                연봉 리포트 첨부하기
              </button>
            )}
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

      {/* Report Select Drawer */}
      <ReportSelectDrawer
        isOpen={showReportDrawer}
        onClose={() => setShowReportDrawer(false)}
        reports={salaryReports}
        selectedReportId={selectedReport?.id || null}
        onSelect={(report) => {
          setSelectedReport(report);
          setShowReportDrawer(false);
        }}
      />
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
  const { profile, posts, setPosts, selectedCategory, setSelectedCategory, togglePostLike, salaryReports } = useStore();
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
  const handleNewPost = (data: { category: PostCategory; title: string; content: string; attached_report?: number }) => {
    // Find attached report if provided
    const attachedReport = data.attached_report
      ? salaryReports.find(r => r.id === data.attached_report)
      : undefined;

    const newPost: Post = {
      id: Date.now(),
      author: {
        id: profile?.id || 0,
        name: profile?.name || '익명',
        tier: profile?.tier || 'Trainee',
        avatar_url: profile?.avatar_url,
        stats: profile?.stats || { Diagnostic: 10, Mechanical: 10, Efficiency: 10, Quality: 10, Communication: 10 },
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
      attached_report: attachedReport,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
  };

  const categories = ['all', ...Object.keys(postCategoryInfo)] as const;

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold text-white">커뮤니티</h1>
            <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-xs font-bold rounded-full">
              {posts.length}개 글
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-4">
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
