import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useCommandPalette } from "@/contexts/command-palette-context";
import { useAuth } from "@/contexts/auth-context";

import AuthLayout from "@/layouts/auth-layout";
import DashboardLayout from "@/layouts/dashboard-layout";

import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";

import DashboardPage from "@/pages/dashboard/dashboard";
import NotesPage from "@/pages/dashboard/notes";
import TasksPage from "@/pages/dashboard/tasks";
import CalendarPage from "@/pages/dashboard/calendar";
import AiChatPage from "@/pages/dashboard/ai-chat";
import RevisionPage from "@/pages/dashboard/revision";
import SummaryPage from "@/pages/dashboard/summary";
import AnalyticsPage from "@/pages/dashboard/analytics";
import ProfilePage from "@/pages/dashboard/profile";
import SettingsPage from "@/pages/dashboard/settings";

import NotFoundPage from "@/pages/errors/not-found";
import ServerErrorPage from "@/pages/errors/server-error";
import UnauthorizedPage from "@/pages/errors/unauthorized";
import NetworkErrorPage from "@/pages/errors/network-error";

import CommandPalette from "@/components/common/command-palette";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { toggle } = useCommandPalette();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  return (
    <>
      <Routes>
        {/* Authentication */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/app/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/app/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />

          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />

          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* Dashboard */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/app/dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="notes"
            element={<NotesPage />}
          />

          <Route
            path="tasks"
            element={<TasksPage />}
          />

          <Route
            path="calendar"
            element={<CalendarPage />}
          />

          <Route
            path="ai-chat"
            element={<AiChatPage />}
          />

          <Route
            path="revision"
            element={<RevisionPage />}
          />

          <Route
            path="summary"
            element={<SummaryPage />}
          />

          <Route
            path="analytics"
            element={<AnalyticsPage />}
          />

          <Route
            path="profile"
            element={<ProfilePage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>

        {/* Error Pages */}
        <Route
          path="/500"
          element={<ServerErrorPage />}
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        <Route
          path="/network-error"
          element={<NetworkErrorPage />}
        />

        {/* Root */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? "/app/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>

      <CommandPalette />
    </>
  );
}