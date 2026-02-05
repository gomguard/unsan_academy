import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Home, Trophy, ClipboardList, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: Home, label: '대시보드' },
  { path: '/cards', icon: Trophy, label: '카드' },
  { path: '/tasks', icon: ClipboardList, label: '미션' },
  { path: '/profile', icon: User, label: '프로필' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
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
                  'flex flex-col items-center py-2 px-4 relative',
                  'transition-colors duration-200',
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
