import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import WorkspacePage from './pages/workspace/WorkspacePage';
import DocumentsPage from './pages/workspace/DocumentsPage';
import DocumentViewPage from './pages/workspace/DocumentViewPage';
import DocumentEditPage from './pages/workspace/DocumentEditPage';
import TasksPage from './pages/workspace/TasksPage';
import ChatPage from './pages/workspace/ChatPage';
import MembersPage from './pages/workspace/MembersPage';
import SettingsPage from './pages/settings/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TeamSpace...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard\" replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard\" replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard\" replace />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard\" replace />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login\" replace />} />
        <Route path="/workspaces/:workspaceId" element={user ? <WorkspacePage /> : <Navigate to="/login\" replace />} />
        <Route path="/workspaces/:workspaceId/documents" element={user ? <DocumentsPage /> : <Navigate to="/login\" replace />} />
        <Route path="/workspaces/:workspaceId/documents/:documentId" element={user ? <DocumentViewPage /> : <Navigate to="/login\" replace />} />
        <Route path="/workspaces/:workspaceId/documents/:documentId/edit" element={user ? <DocumentEditPage /> : <Navigate to="/login\" replace />} />
        <Route path="/workspaces/:workspaceId/tasks" element={user ? <TasksPage /> : <Navigate to="/login\" replace />} />
        <Route path="/workspaces/:workspaceId/chat" element={user ? <ChatPage /> : <Navigate to="/login\" replace />} />
        <Route path="/workspaces/:workspaceId/members" element={user ? <MembersPage /> : <Navigate to="/login\" replace />} />
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login\" replace />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;