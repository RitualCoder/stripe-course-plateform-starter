import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import type { LoginRequest } from "../../types/auth";
import { authApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ access_token, user }) => {
      login(access_token, user);
      navigate("/courses");
    },
  });

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email requis",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email invalide",
                  },
                })}
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                {...register("password", {
                  required: "Mot de passe requis",
                  minLength: {
                    value: 6,
                    message:
                      "Le mot de passe doit contenir au moins 6 caractères",
                  },
                })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {loginMutation.error && (
            <div className="text-red-600 text-sm text-center">
              Erreur de connexion. Vérifiez vos identifiants.
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loginMutation.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas de compte ?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
