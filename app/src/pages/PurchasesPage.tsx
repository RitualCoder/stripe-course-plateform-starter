// src/pages/PurchasesPage.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { purchaseApi } from "../services/purchaseApi";
import { Link } from "react-router-dom";
import type { Purchase } from "../types/purchase";

const PurchasesPage: React.FC = () => {
  const {
    data: purchases = [],
    isLoading,
    isError,
  } = useQuery<Purchase[], Error>({
    queryKey: ["user-purchases"],
    queryFn: purchaseApi.getUserPurchases,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Impossible de charger vos achats
          </h2>
          <p className="text-gray-600">Veuillez réessayer plus tard.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Mes achats</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {purchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {purchase.course.title}
                    </h2>
                    <p className="text-gray-700 mb-4">
                      {purchase.course.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-900 font-bold mb-2">
                      {purchase.course.price.toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Acheté le{" "}
                      {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <Link
                      to={`/courses/${purchase.courseId}/learn`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Accéder au cours
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Aucun achat pour le moment
              </h2>
              <p className="text-gray-600">
                Parcourez nos formations et revenez ici pour accéder à vos
                cours.
              </p>
              <Link
                to="/courses"
                className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Voir les formations
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PurchasesPage;
