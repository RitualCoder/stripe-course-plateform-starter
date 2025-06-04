import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import CoursesPage from "./pages/CoursesPage";
import PurchasesPage from "./pages/PurchasesPage";
import CourseLearnPage from "./pages/CourseLearnPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <CoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/learn"
                element={
                  <ProtectedRoute>
                    <CourseLearnPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/purchases"
                element={
                  <ProtectedRoute>
                    <PurchasesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/courses" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
