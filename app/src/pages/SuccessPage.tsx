// src/pages/SuccessPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

interface SessionInfo {
  payment_status: string;
  amount_total: number;
  currency: string;
}

type PageState = "loading" | "success" | "error" | "invalid";

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [pageState, setPageState] = useState<PageState>("loading");
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setPageState("invalid");
      setErrorMessage("Identifiant de session manquant dans l'URL.");
      return;
    }

    // Vérifier le statut de la session
    const checkSession = async () => {};

    checkSession();
  }, [sessionId]);

  const LoadingState = () => (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Vérification en cours...
      </h2>
      <p className="mt-2 text-gray-600">
        Nous vérifions votre paiement, veuillez patienter.
      </p>
    </div>
  );

  const SuccessState = () => (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
      </div>

      <h2 className="mt-6 text-3xl font-bold text-green-800">
        Paiement Réussi ! 🎉
      </h2>

      {sessionInfo && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
          <p className="text-green-700 font-medium">
            Montant payé :{" "}
            <span className="text-2xl font-bold">
              {(sessionInfo.amount_total / 100).toFixed(2)}€
            </span>
          </p>
        </div>
      )}

      <p className="mt-4 text-gray-600 max-w-md mx-auto">
        Votre achat a été confirmé avec succès ! Vous pouvez maintenant accéder
        à votre cours.
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => navigate("/purchases")}
          className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 transform hover:scale-105"
        >
          Voir mes achats
        </button>
        <Link
          to="/courses"
          className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Retour aux cours
        </Link>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-bold text-red-800">
        Problème de Paiement
      </h2>

      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{errorMessage}</p>
      </div>

      <p className="mt-4 text-gray-600 max-w-md mx-auto">
        Il semble y avoir un problème avec votre paiement. Veuillez réessayer ou
        contacter notre support.
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => navigate("/courses")}
          className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Réessayer l'achat
        </button>
        <Link
          to="/courses"
          className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Retour aux cours
        </Link>
      </div>
    </div>
  );

  const InvalidState = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-10 h-10 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="mt-6 text-2xl font-bold text-yellow-800">
        Session Invalide
      </h2>

      <p className="mt-4 text-gray-600 max-w-md mx-auto">{errorMessage}</p>

      <div className="mt-6">
        <Link
          to="/courses"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Retour aux cours
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Stripe Course Platform
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto"></div>
          </div>

          {pageState === "loading" && <LoadingState />}
          {pageState === "success" && <SuccessState />}
          {pageState === "error" && <ErrorState />}
          {pageState === "invalid" && <InvalidState />}

          {sessionId && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Session ID: {sessionId.substring(0, 20)}...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
