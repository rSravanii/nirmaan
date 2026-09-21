import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { LanguageProvider } from './context/LanguageContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { MainLayout } from './layouts/MainLayout.js';

import { LandingPage } from './pages/LandingPage.js';
import { ReportProblemPage } from './pages/ReportProblemPage.js';
import { DiscoverProblemsPage } from './pages/DiscoverProblemsPage.js';
import { ProblemDetailsPage } from './pages/ProblemDetailsPage.js';
import { StudentDashboard } from './pages/StudentDashboard.js';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage.js';
import { ProfessorDashboard } from './pages/ProfessorDashboard.js';
import { EvaluatorDashboard } from './pages/EvaluatorDashboard.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { ArchitecturePresentationPage } from './pages/ArchitecturePresentationPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ExpertDashboard } from './pages/ExpertDashboard.js';
import { CompanyDashboard } from './pages/CompanyDashboard.js';
import { MyReportsPage } from './pages/MyReportsPage.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<ReportProblemPage />} />
                <Route path="/my-reports" element={<MyReportsPage />} />
                <Route path="/explore" element={<DiscoverProblemsPage />} />
                <Route path="/problems/:id" element={<ProblemDetailsPage />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/workspace/:id" element={<ProjectWorkspacePage />} />
                <Route path="/professor" element={<ProfessorDashboard />} />
                <Route path="/expert" element={<ExpertDashboard />} />
                <Route path="/company" element={<CompanyDashboard />} />
                <Route path="/evaluator" element={<EvaluatorDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/presentation" element={<ArchitecturePresentationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};
