import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './app/page';
import NotesPage from './app/notes/page';
import NoteDetailPage from './app/notes/[slug]/page';
import UserPortfolioPage from './app/u/[username]/page';

import AdminLoginPage from './app/admin/login/page';
import AdminRegisterPage from './app/admin/register/page';
import AdminLayout from './app/admin/layout';
import AdminDashboardPage from './app/admin/dashboard/page';
import AdminProfilePage from './app/admin/profile/page';
import AdminSkillsPage from './app/admin/skills/page';
import AdminProjectsPage from './app/admin/projects/page';
import AdminExperiencePage from './app/admin/experience/page';
import AdminNotesPage from './app/admin/notes/page';
import AdminMessagesPage from './app/admin/messages/page';
import AdminUsersPage from './app/admin/users/page';

import GlobalErrorPage from './components/GlobalErrorPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:slug" element={<NoteDetailPage />} />
        <Route path="/u/:username" element={<UserPortfolioPage />} />

        {/* Admin Auth Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminLayout>
              <AdminProfilePage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <AdminLayout>
              <AdminSkillsPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminLayout>
              <AdminProjectsPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/experience"
          element={
            <AdminLayout>
              <AdminExperiencePage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <AdminLayout>
              <AdminNotesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <AdminLayout>
              <AdminMessagesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          }
        />

        {/* Global Error Fallback Route */}
        <Route path="*" element={<GlobalErrorPage title="Page Not Found" message="The requested page route could not be found." code="404" />} />
      </Routes>
    </Router>
  );
}
