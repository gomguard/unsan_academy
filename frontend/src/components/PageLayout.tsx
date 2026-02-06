/**
 * PageLayout - 모든 페이지의 일관된 레이아웃 wrapper
 *
 * 모바일/PC 반응형 지원
 * - 모바일: max-w-lg, px-4
 * - 태블릿: max-w-2xl, px-6
 * - PC: max-w-4xl, px-8
 */

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  /** 페이지 제목 (헤더에 표시) */
  title?: string;
  /** 제목 옆 부제목 */
  subtitle?: string;
  /** 우측 액션 버튼 영역 */
  headerRight?: ReactNode;
  /** 컨테이너 최대 너비 - 'narrow' (lg), 'medium' (2xl), 'wide' (5xl), 'full' */
  maxWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  /** 헤더 표시 여부 */
  showHeader?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** 컨텐츠 영역 추가 패딩 없이 (SkillTree 같은 풀스크린 컨텐츠용) */
  noPadding?: boolean;
}

const maxWidthClasses = {
  narrow: 'max-w-lg',      // 모바일 앱 스타일 (Dashboard, Profile 등)
  medium: 'max-w-2xl',     // 중간 (Community, MissionCenter)
  wide: 'max-w-5xl',       // 넓은 (JobLibrary, Landing)
  full: 'max-w-full',      // 전체 너비 (SkillTree)
};

export default function PageLayout({
  children,
  title,
  subtitle,
  headerRight,
  maxWidth = 'narrow',
  showHeader = true,
  className = '',
  noPadding = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-8">
      {/* 메인 컨테이너 */}
      <div
        className={`
          mx-auto
          ${maxWidthClasses[maxWidth]}
          ${noPadding ? '' : 'px-4 sm:px-6 lg:px-8'}
          ${className}
        `}
      >
        {/* 헤더 */}
        {showHeader && title && (
          <header className="py-4 sm:py-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
              )}
            </div>
            {headerRight && (
              <div className="flex items-center gap-2">
                {headerRight}
              </div>
            )}
          </header>
        )}

        {/* 컨텐츠 영역 */}
        <main className={showHeader && title ? '' : noPadding ? '' : 'py-4 sm:py-6'}>
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * 섹션 컴포넌트 - 페이지 내 구분된 영역
 */
interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Section({ children, title, subtitle, className = '' }: SectionProps) {
  return (
    <section className={`mb-6 sm:mb-8 ${className}`}>
      {title && (
        <div className="mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * 카드 컴포넌트 - 통일된 카드 스타일
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
  return (
    <div
      className={`
        bg-slate-800 rounded-xl p-4 sm:p-5
        border border-slate-700/50
        ${hoverable ? 'hover:bg-slate-750 hover:border-slate-600 cursor-pointer transition-colors' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
