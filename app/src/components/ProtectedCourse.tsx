// src/components/ProtectedCourse.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { purchaseApi } from "../services/purchaseApi";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedCourseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedCourse: React.FC<ProtectedCourseProps> = ({
  children,
  fallback,
}) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) {
      setHasAccess(false);
      setLoading(false);
      return;
    }
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const result = await purchaseApi.checkCourseAccess(courseId);
        setHasAccess(result.hasAccess);
      } catch {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Vérification de l'accès...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Connexion requise
        </h3>
        <p className="text-yellow-700 mb-4">
          Vous devez être connecté pour accéder à ce cours.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
        >
          Se connecter
        </button>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Accès restreint
        </h3>
        <p className="text-blue-700 mb-4">
          Vous devez acheter ce cours pour y accéder.
        </p>
        <button
          onClick={() => navigate(`/courses`)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Acheter le cours
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
