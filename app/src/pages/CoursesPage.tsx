import React from "react";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { CourseCard } from "../components/course/CourseCard";
import { Link } from "react-router-dom";

const CoursesPage: React.FC = () => {
  const { user, logout } = useAuth();

  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses-with-purchase-status"],
    queryFn: coursesApi.getCoursesWithPurchaseStatus,
    enabled: !!user,
  });

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur de chargement
          </h2>
          <p className="text-gray-600">
            Impossible de charger les cours. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Formations disponibles
              </h1>
              <p className="text-gray-600">
                Bienvenue {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/purchases"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Mes achats
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Aucune formation disponible
              </h2>
              <p className="text-gray-600">
                Les formations seront bientôt disponibles.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;
