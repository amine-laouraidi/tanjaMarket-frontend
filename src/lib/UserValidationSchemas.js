import { z } from "zod";

export const fullNameSchema = z
  .string({ required_error: "Veuillez entrer votre nom complet" })
  .trim()
  .min(3, "Le nom complet est trop court — 3 caractères minimum")
  .max(50, "Le nom complet est trop long — 50 caractères maximum");

export const emailSchema = z
  .string({ required_error: "Veuillez entrer votre adresse email" })
  .trim()
  .toLowerCase()
  .email("Veuillez entrer une adresse email valide");

export const phoneSchema = z
  .string({ required_error: "Veuillez entrer votre numéro de téléphone" })
  .regex(
    /^(\+212|0)([ \-]?\d){9}$/,
    "Veuillez entrer un numéro de téléphone marocain valide (ex: 0612345678)"
  );

export const passwordSchema = z
  .string({ required_error: "Veuillez entrer un mot de passe" })
  .min(6, "Le mot de passe est trop court — 6 caractères minimum");

// ── Composed schemas ──────────────────────────────────────

export const registerSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  fullName: fullNameSchema,
  phone: phoneSchema,
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est obligatoire"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });