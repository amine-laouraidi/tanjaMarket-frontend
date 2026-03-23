"use client";

import { useActionState, useEffect, useState } from "react";
import { updatePassword } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { updatePasswordSchema } from "@/lib/UserValidationSchemas";

const initialState = { success: false, error: null };

function PasswordInput({ id, name, label, placeholder, error, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          required
          onChange={onChange}
          className={`w-full h-9 px-3 pr-9 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-destructive focus:ring-destructive/20"
              : "focus:ring-primary/30 focus:border-primary"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

export default function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (state.success) toast.success("Mot de passe modifié !");
    if (state.error) toast.error(state.error);
  }, [state]);

  function handleSubmit(e) {
    const formData = new FormData(e.currentTarget);
    const result = updatePasswordSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
      e.preventDefault();
      const fieldErrors = result.error.flatten().fieldErrors;
      const formErrors = result.error.flatten().formErrors;
      setClientErrors({
        currentPassword: fieldErrors.currentPassword?.[0],
        newPassword: fieldErrors.newPassword?.[0],
        // .refine() (password match) lands in formErrors, assign to confirmPassword
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? formErrors?.[0],
      });
      return;
    }

    setClientErrors({});
  }

  function clearField(field) {
    setClientErrors((p) => ({ ...p, [field]: undefined }));
  }

  return (
    <div className="bg-background border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <FiLock size={15} className="text-muted-foreground" />
        <h2 className="text-sm font-medium">Modifier le mot de passe</h2>
      </div>

      <div className="p-6">
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            label="Mot de passe actuel"
            placeholder="••••••••"
            error={clientErrors.currentPassword}
            onChange={() => clearField("currentPassword")}
          />
          <PasswordInput
            id="newPassword"
            name="newPassword"
            label="Nouveau mot de passe"
            placeholder="••••••••"
            error={clientErrors.newPassword}
            onChange={() => clearField("newPassword")}
          />
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmer le nouveau mot de passe"
            placeholder="••••••••"
            error={clientErrors.confirmPassword}
            onChange={() => clearField("confirmPassword")}
          />

          <p className="text-[11px] text-muted-foreground">Au moins 6 caractères.</p>

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
              Mot de passe modifié avec succès.
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={isPending} size="sm" variant="outline">
              {isPending ? (
                <>
                  <FiLoader size={13} className="mr-2 animate-spin" />
                  Modification…
                </>
              ) : (
                "Modifier le mot de passe"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}