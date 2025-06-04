// src/components/CourseCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description?: string;
  price: number;
  isPurchased?: boolean;
  purchaseId?: string | null;
}

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  const handlePurchase = async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      navigate("/login");
      return;
    }
  };

  const handleStartCourse = () => {
    // Redirection vers la page de formation
    navigate(`/courses/${course.id}/learn`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Badge pour les cours achetés */}
      {course.isPurchased && (
        <div className="bg-green-500 text-white px-3 py-1 text-xs font-medium">
          ✓ Acheté
        </div>
      )}

      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="text-white text-center">
          <svg
            className="w-16 h-16 mx-auto mb-2 opacity-80"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm opacity-90">Formation</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
            {course.title}
          </h3>
          {!course.isPurchased && (
            <div className="ml-3 text-right">
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(course.price)}
              </span>
            </div>
          )}
        </div>

        {course.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
        )}

        {/* Informations supplémentaires */}
        <div className="flex items-center text-xs text-gray-500 mb-6 space-x-4">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span>Formation complète</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Accès illimité</span>
          </div>
        </div>

        {/* Bouton d'action */}
        {course.isPurchased ? (
          <button
            onClick={handleStartCourse}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Commencer la formation</span>
          </button>
        ) : (
          <button
            onClick={handlePurchase}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5a2 2 0 100 4 2 2 0 000-4zm-4 4a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <span>Acheter maintenant</span>
          </button>
        )}

        {/* Informations sur l'achat */}
        {course.isPurchased && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-sm text-green-700">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Vous avez accès à cette formation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
