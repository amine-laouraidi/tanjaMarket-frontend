"use server";

import { redirect } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import getMe from "@/lib/getMe";
import { postAdSchema } from "@/lib/postAdSchema";

export default async function postAd(data) {
  const cleaned = {
    ...data,
    description: data.description || undefined,
    location: {
      address: data.address || undefined,
      city: data.city || "Tanger",
    },
  };

  const result = postAdSchema.safeParse(cleaned);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      error: {
        title: errors.title?.[0],
        description: errors.description?.[0],
        price: errors.price?.[0],
        phone: errors.phone?.[0],
        category: errors.category?.[0],
        subcategory: errors.subcategory?.[0],
      },
    };
  }

  const payload = {
    title: result.data.title,
    description: result.data.description,
    price: result.data.price,
    phone: result.data.phone,
    category: result.data.category,
    subcategory: result.data.subcategory,
    location: result.data.location,
    images: result.data.images,
    fields: result.data.fields,
  };

  try {
    const res = await authFetch("/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: { _form: json.error ?? "Erreur lors de la publication de l'annonce" } };
    }
    
  } catch (e) {
    if (e.cause?.code === "ECONNREFUSED") {
      return { error: { _form: "Le serveur est inaccessible, veuillez réessayer plus tard" } };
    }
    return { error: { _form: "Une erreur inattendue s'est produite, veuillez réessayer" } };
  }

  redirect("/");
}