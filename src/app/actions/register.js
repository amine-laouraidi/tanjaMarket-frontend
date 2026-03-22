"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z
    .string({ required_error: "Veuillez entrer votre nom complet" })
    .trim()
    .min(3, "Le nom complet est trop court — 3 caractères minimum")
    .max(50, "Le nom complet est trop long — 50 caractères maximum"),

  email: z
    .string({ required_error: "Veuillez entrer votre adresse email" })
    .trim()
    .toLowerCase()
    .email("Veuillez entrer une adresse email valide"),

  phone: z
    .string({ required_error: "Veuillez entrer votre numéro de téléphone" })
    .regex(
      /^(\+212|0)([ \-]?\d){9}$/,
      "Veuillez entrer un numéro de téléphone marocain valide (ex: 0612345678)",
    ),

  password: z
    .string({ required_error: "Veuillez entrer un mot de passe" })
    .min(6, "Le mot de passe est trop court — 6 caractères minimum"),
});
export default async function register(prevState, formData) {
  const result = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      error: {
        fullName: errors.fullName?.[0],
        phone: errors.phone?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        error: {
          _form: json.error ?? "Erreur lors de la création du compte",
        },
      };
    }
  } catch (e) {
    if (e.cause?.code === "ECONNREFUSED") {
      return {
        error: {
          _form: "Le serveur est inaccessible, veuillez réessayer plus tard",
        },
      };
    }
    return {
      error: {
        _form: "Une erreur inattendue s'est produite, veuillez réessayer",
      },
    };
  }
  redirect("/");
}
