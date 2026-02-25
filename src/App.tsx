import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopBar, Navigation, ProofFooter, type ChecklistItem } from './components/layout';
import { Dashboard, Saved, Digest, Settings, Proof, NotFound } from './pages';
import './App.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default checklist for the proof footer
  const checklist: ChecklistItem[] = [
    { label: 'UI Built', checked: true },
    { label: 'Logic Working', checked: false },
    { label: 'Test Passed', checked: false },
    { label: 'Deployed', checked: false },
  ];

  return (
    <div className="app">
      <TopBar
        appName="Job Notification App"
        currentStep={2}
        totalSteps={5}
        status="in-progress"
      />
      <div className="app__navigation-bar">
        <div className="app__navigation-container">
          <Navigation />
        </div>
      </div>
      <main className="app__main">{children}</main>
      <ProofFooter items={checklist} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Navigate to="/dashboard" replace />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/saved"
          element={
            <Layout>
              <Saved />
            </Layout>
          }
        />
        <Route
          path="/digest"
          element={
            <Layout>
              <Digest />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/proof"
          element={
            <Layout>
              <Proof />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
