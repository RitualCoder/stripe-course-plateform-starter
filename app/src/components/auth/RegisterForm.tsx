import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import type { RegisterRequest } from "../../types/auth";
import { authApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const RegisterForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ token, user }) => {
      login(token, user);
      navigate("/courses");
    },
  });

  const onSubmit = (data: RegisterRequest & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Nom
              </label>
              <input
                {...register("name", {
                  required: "Nom requis",
                  minLength: {
                    value: 2,
                    message: "Le nom doit contenir au moins 2 caractères",
                  },
                })}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nom complet"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmer le mot de passe
              </label>
              <input
                {...register("confirmPassword", {
                  required: "Confirmation du mot de passe requise",
                  validate: (value) =>
                    value === password ||
                    "Les mots de passe ne correspondent pas",
                })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirmer le mot de passe"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {registerMutation.error && (
            <div className="text-red-600 text-sm text-center">
              Erreur lors de l'inscription. Vérifiez vos informations.
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {registerMutation.isPending ? "Inscription..." : "S'inscrire"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
