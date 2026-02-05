import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  backTo?: string;
  showHome?: boolean;
  variant?: 'light' | 'dark';
}

export function PageHeader({
  title,
  subtitle,
  icon,
  backTo,
  showHome = true,
  variant = 'light',
}: PageHeaderProps) {
  const isDark = variant === 'dark';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 backdrop-blur-sm border-b',
        isDark
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-slate-200'
      )}
    >
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Back/Home button */}
          {(backTo || showHome) && (
            <Link
              to={backTo || '/'}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isDark
                  ? 'hover:bg-slate-800 text-slate-400'
                  : 'hover:bg-slate-100 text-slate-500'
              )}
            >
              {backTo ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <Home className="w-5 h-5" />
              )}
            </Link>
          )}

          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                isDark ? 'bg-slate-800' : 'bg-slate-100'
              )}
            >
              {icon}
            </div>
          )}

          {/* Title */}
          <div className="flex-1">
            <h1
              className={cn(
                'font-bold text-lg',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-500'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
