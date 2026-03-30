"use server";

import { redirect } from "next/navigation";
import { registerSchema } from "@/lib/UserValidationSchemas";
import { ACCESS_OPTS, REFRESH_OPTS } from "@/lib/cookie";
import { cookies } from "next/headers";

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
        email: errors.email?.[0],
        phone: errors.phone?.[0],
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
