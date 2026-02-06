import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Home, Briefcase, GraduationCap, ClipboardList, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: Home, label: '홈' },
  { path: '/jobs', icon: Briefcase, label: '직업' },
  { path: '/education', icon: GraduationCap, label: '교육' },
  { path: '/missions', icon: ClipboardList, label: '작업일지' },
  { path: '/community', icon: Users, label: '커뮤니티' },
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
                  'flex flex-col items-center py-3 px-3 relative',
                  'transition-colors duration-200',
                  isActive ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
