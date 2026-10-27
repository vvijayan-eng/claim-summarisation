import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ClaimsProvider, useClaims } from './context/ClaimsContext';
import { getAppTheme } from './theme';
import { Layout } from './components/Layout';

import { Dashboard } from './pages/Dashboard';
import { ClaimsQueue } from './pages/ClaimsQueue';
import { ClaimWorkbench } from './pages/ClaimWorkbench';
import { ClaimIntake } from './pages/ClaimIntake';
import { ValidationCenter } from './pages/ValidationCenter';
import { FraudReview } from './pages/FraudReview';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { SettingsPage } from './pages/Settings';
import { LoginPage } from './pages/Login';

const ThemedApp: React.FC = () => {
  const { mode } = useClaims();
  const theme = getAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          <Route
            path="/queue"
            element={
              <Layout>
                <ClaimsQueue />
              </Layout>
            }
          />

          <Route
            path="/workbench"
            element={
              <Layout>
                <ClaimWorkbench />
              </Layout>
            }
          />

          <Route
            path="/intake"
            element={
              <Layout>
                <ClaimIntake />
              </Layout>
            }
          />

          <Route
            path="/validation"
            element={
              <Layout>
                <ValidationCenter />
              </Layout>
            }
          />

          <Route
            path="/fraud"
            element={
              <Layout>
                <FraudReview />
              </Layout>
            }
          />

          <Route
            path="/analytics"
            element={
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            }
          />

          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <ClaimsProvider>
      <ThemedApp />
    </ClaimsProvider>
  );
};

export default App;
