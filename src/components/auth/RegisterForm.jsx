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
  RiMapPinLine,
  RiBuilding2Line,
} from "react-icons/ri";

const REGIONS = [
  "Casablanca-Settat",
  "Rabat-Salé-Kénitra",
  "Marrakech-Safi",
  "Fès-Meknès",
  "Tanger-Tétouan-Al Hoceïma",
  "Souss-Massa",
  "Oriental",
  "Béni Mellal-Khénifra",
  "Drâa-Tafilalet",
  "Guelmim-Oued Noun",
];

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    region: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call your register API
    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      location: {
        city: form.city || undefined,
        region: form.region || undefined,
      },
    };
    console.log(payload);
  };

  const inputClass =
    "w-full h-11 pl-9 pr-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors";

  const selectClass =
    "w-full h-11 pl-9 pr-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none";

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">
              Nom complet
            </label>
            <div className="relative">
              <RiUserLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Sara Mourad"
                required
                maxLength={50}
                className={inputClass}
              />
            </div>
          </div>

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
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">
              Téléphone
            </label>
            <div className="relative">
              <RiPhoneLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+212 6XX XXX XXX"
                required
                className={inputClass}
              />
            </div>
            <p className="text-[10px] text-gray-400">
              Format : +212 6XX XXX XXX ou 06XX XXX XXX
            </p>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">
              Mot de passe
            </label>
            <div className="relative">
              <RiLockLine
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full h-11 pl-9 pr-9 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <RiEyeOffLine size={14} />
                ) : (
                  <RiEyeLine size={14} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400">Minimum 6 caractères</p>
          </div>

          {/* Location — optional */}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
            <p className="text-[11px] text-gray-400">
              Localisation{" "}
              <span className="text-gray-300">(optionnel)</span>
            </p>

            {/* Region */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-gray-600">
                Région
              </label>
              <div className="relative">
                <RiMapPinLine
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Sélectionner une région</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-gray-600">
                Ville
              </label>
              <div className="relative">
                <RiBuilding2Line
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ex: Tanger, Casablanca..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white text-[13px] font-medium rounded-lg transition-all mt-1"
          >
            Créer mon compte
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-[10px] text-gray-300 mt-3 leading-relaxed">
          En créant un compte vous acceptez nos{" "}
          <Link href="/cgu" className="text-blue-700 hover:underline">
            CGU
          </Link>{" "}
          et notre{" "}
          <Link href="/privacy" className="text-blue-700 hover:underline">
            politique de confidentialité
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-[12px] text-gray-400 mt-4">
          Déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="text-blue-700 font-medium hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
