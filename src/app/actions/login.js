"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ACCESS_OPTS, REFRESH_OPTS } from "@/lib/cookie";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est obligatoire")
    .refine(
      (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
      "Veuillez fournir une adresse email valide",
    ),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default async function login(prevState, formData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      error: {
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: { _form: json.error ?? "Identifiants incorrect" } };
    }

    const cookieStore = await cookies();
    cookieStore.set("accessToken", json.accessToken, ACCESS_OPTS);
    cookieStore.set("refreshToken", json.refreshToken, REFRESH_OPTS); 
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

  return redirect("/");
}