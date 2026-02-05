import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { mockDashboardData } from '@/lib/mockData';
import { BottomNav, ToastContainer } from '@/components';
import { Landing, Dashboard, Cards, Tasks, Profile } from '@/pages';

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

  const isLandingPage = location.pathname === '/';
  const showBottomNav = !isLandingPage;

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      {isLandingPage ? (
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      ) : (
        <main className="max-w-lg mx-auto px-4 pt-4 pb-20 bg-white min-h-screen">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      )}

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
