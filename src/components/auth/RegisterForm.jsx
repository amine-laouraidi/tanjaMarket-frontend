"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiLockLine,
  RiUserLine,
  RiPhoneLine,
} from "react-icons/ri";
import register from "@/app/actions/register";
import { useActionState } from "react";
import { registerSchema } from "@/lib/UserValidationSchemas";

const initialState = {};

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(register, initialState);
  const [clientErrors, setClientErrors] = useState({});

  function handleSubmit(e) {
    const formData = new FormData(e.currentTarget);
    const result = registerSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
    });

    if (!result.success) {
      e.preventDefault();
      const errors = result.error.flatten().fieldErrors;
      setClientErrors({
        fullName: errors.fullName?.[0],
        email: errors.email?.[0],
        phone: errors.phone?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    setClientErrors({});
  }

  function clearField(field) {
    setClientErrors((p) => ({ ...p, [field]: undefined }));
  }

  const errors = {
    fullName: clientErrors.fullName ?? state.error?.fullName,
    email: clientErrors.email ?? state.error?.email,
    phone: clientErrors.phone ?? state.error?.phone,
    password: clientErrors.password ?? state.error?.password,
  };

  const inputClass = (field) =>
    `w-full h-11 pl-9 pr-3 text-[13px] border rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white transition-colors ${
      errors[field]
        ? "border-red-400 focus:border-red-400"
        : "border-gray-200 focus:border-blue-500"
    }`;

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Tanja<span className="text-blue-700">Market</span>
          </h1>
          <p className="text-[12px] text-gray-400 mt-1">
            Créez votre compte gratuitement
          </p>
        </div>

        <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Global error */}
          {state.error?._form && (
            <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {state.error._form}
            </p>
          )}

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">Nom complet</label>
            <div className="relative">
              <RiUserLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="fullName"
                placeholder="Sara Mourad"
                maxLength={50}
                onChange={() => clearField("fullName")}
                className={inputClass("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">Email</label>
            <div className="relative">
              <RiMailLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                onChange={() => clearField("email")}
                className={inputClass("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">Téléphone</label>
            <div className="relative">
              <RiPhoneLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                name="phone"
                placeholder="+212 6XX XXX XXX"
                onChange={() => clearField("phone")}
                className={inputClass("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">Mot de passe</label>
            <div className="relative">
              <RiLockLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                minLength={6}
                onChange={() => clearField("password")}
                className={`w-full h-11 pl-9 pr-9 text-[13px] border rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white transition-colors ${
                  errors.password
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-lg transition-all mt-1"
          >
            {isPending ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-[10px] text-gray-300 mt-3 leading-relaxed">
          En créant un compte vous acceptez nos{" "}
          <Link href="/cgu" className="text-blue-700 hover:underline">CGU</Link>{" "}
          et notre{" "}
          <Link href="/privacy" className="text-blue-700 hover:underline">
            politique de confidentialité
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-[12px] text-gray-400 mt-4">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-blue-700 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}