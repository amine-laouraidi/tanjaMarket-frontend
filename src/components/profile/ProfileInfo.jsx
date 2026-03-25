"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { FiUser, FiCheck, FiAlertCircle, FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { updateProfileSchema } from "@/lib/UserValidationSchemas";

const initialState = { success: false, error: null };

export default function ProfileInfo({ user }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);
  const [clientErrors, setClientErrors] = useState({});



  function handleSubmit(e) {
    const formData = new FormData(e.currentTarget);
    const result = updateProfileSchema.safeParse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
    });

    if (!result.success) {
      e.preventDefault();
      const errors = result.error.flatten().fieldErrors;
      setClientErrors({
        fullName: errors.fullName?.[0],
        phone: errors.phone?.[0],
      });
      return;
    }

    setClientErrors({});
  }

  const errors = {
    fullName: clientErrors.fullName,
    phone: clientErrors.phone,
  };

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <div className="bg-background border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <FiUser size={15} className="text-muted-foreground" />
        <h2 className="text-sm font-medium">Informations personnelles</h2>
      </div>

      <div className="p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground text-lg font-semibold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-medium text-sm">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium">
              Nom complet
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              defaultValue={user.fullName}
              maxLength={50}
              onChange={() => setClientErrors((p) => ({ ...p, fullName: undefined }))}
              className={`w-full h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? "border-destructive focus:ring-destructive/20"
                  : "focus:ring-primary/30 focus:border-primary"
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-destructive">{errors.fullName}</p>
            )}
          </div>

          {/* Email — read only */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Adresse email
              <span className="ml-1.5 text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                non modifiable
              </span>
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="w-full h-9 px-3 rounded-md border bg-muted text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone}
              onChange={() => setClientErrors((p) => ({ ...p, phone: undefined }))}
              placeholder="06 00 00 00 00"
              className={`w-full h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? "border-destructive focus:ring-destructive/20"
                  : "focus:ring-primary/30 focus:border-primary"
              }`}
            />
            {errors.phone ? (
              <p className="text-[11px] text-destructive">{errors.phone}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Format marocain: 06, 07 ou +212...
              </p>
            )}
          </div>

          {/* Server error */}
          {state.error && !state.success && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
              <FiAlertCircle size={14} className="shrink-0" />
              {state.error}
            </div>
          )}

          {/* Success */}
          {state.success && (
            <div className="flex items-center gap-2 text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              <FiCheck size={14} className="shrink-0" />
              Profil mis à jour avec succès.
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={isPending} size="sm">
              {isPending ? (
                <>
                  <FiLoader size={13} className="mr-2 animate-spin" />
                  Enregistrement…
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}