"use server";

import { authFetch } from "@/lib/authFetch";
import { revalidatePath } from "next/cache";

export default async function saveAd(id) {
  console.log(id);
  try {
    const res = await authFetch(`/saved/${id}`, {
      method: "POST",
    });
    const json = await res.json();
    revalidatePath("/saved", "page");
    return json.saved;
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
}
