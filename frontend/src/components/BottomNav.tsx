import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Home, GitBranch, ClipboardList, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: Home, label: '홈' },
  { path: '/cards', icon: GitBranch, label: '로드맵' },
  { path: '/tasks', icon: ClipboardList, label: '미션' },
  { path: '/community', icon: MessageSquare, label: '커뮤니티' },
  { path: '/profile', icon: User, label: '프로필' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
      <div className="mx-auto max-w-lg">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center py-2 px-3 relative',
                  'transition-colors duration-200',
                  isActive ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-10 h-0.5 bg-yellow-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
