import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { mockDashboardData } from '@/lib/mockData';
import { BottomNav, ToastContainer } from '@/components';
import { Landing, Dashboard, Cards, Tasks, Profile, JobLibrary, SkillTree } from '@/pages';

function App() {
  const location = useLocation();
  const { setProfile, setJobCards, setDailyTasks, setTodayCompletions } = useStore();

  useEffect(() => {
    // Load mock data on mount
    setProfile(mockDashboardData.profile);
    setJobCards(mockDashboardData.job_cards);
    setDailyTasks(mockDashboardData.daily_tasks);
    setTodayCompletions(mockDashboardData.today_completions);
  }, [setProfile, setJobCards, setDailyTasks, setTodayCompletions]);

  // Pages that don't need bottom nav
  const noBottomNavPages = ['/', '/jobs', '/skill-tree'];
  const showBottomNav = !noBottomNavPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<JobLibrary />} />
        <Route path="/skill-tree" element={<SkillTree />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
