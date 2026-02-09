
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { Assistant } from './pages/Assistant';
import { Portfolio } from './pages/Portfolio';
import { Autopilot } from './pages/Autopilot';
import { Devices } from './pages/Devices';
import { Team } from './pages/Team';
import { Reports } from './pages/Reports';
import { Insights } from './pages/Insights';
import { StaffProfilePage } from './pages/StaffProfilePage';

const AppRoutes = () => {
  const { isOnboarded } = useApp();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/autopilot" element={<Autopilot />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/team" element={<Team />} />
        <Route path="/profiles/:id" element={<StaffProfilePage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
