"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_OPTS, REFRESH_OPTS } from "@/lib/cookie";
import { loginSchema } from "@/lib/UserValidationSchemas";

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
      return { error: { _form: json.error ?? "Identifiants incorrects" } };
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

  redirect("/");
}