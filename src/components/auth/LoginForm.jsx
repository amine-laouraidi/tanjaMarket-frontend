"use client";

import Link from "next/link";
import {
  RiMailLine,
  RiLockLine,
} from "react-icons/ri";
import login from "@/app/actions/login";
import { useActionState } from "react";
const initialState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Tanja<span className="text-blue-700">Market</span>
          </h1>
          <p className="text-[12px] text-gray-400 mt-1">
            Bienvenue ! Connectez-vous à votre compte
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">

          {/* Global error */}
          {state.error?._form && (
            <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {state.error._form}
            </p>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <RiMailLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                className="w-full h-11 pl-9 pr-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            {state.error?.email && (
              <p className="text-[11px] text-red-500">{state.error.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-gray-600">
                Mot de passe
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-blue-700 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <RiLockLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full h-11 pl-9 pr-9 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            {state.error?.password && (
              <p className="text-[11px] text-red-500">{state.error.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-lg transition-all mt-1"
          >
            {isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-gray-100" />
          <span className="text-[11px] text-gray-300">ou</span>
          <hr className="flex-1 border-gray-100" />
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-gray-400">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="text-blue-700 font-medium hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}