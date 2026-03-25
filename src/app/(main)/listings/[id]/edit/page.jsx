import { notFound } from "next/navigation";
import UpdateAdForm from "@/components/UpdateAdForm";

export default async function EditAdPage({ params }) {
  const { id } = await params;

  const adRes = await fetch(`${process.env.BACKEND_URL}/ads/${id}`, { cache: "no-store" });
  if (!adRes.ok) notFound();

  const ad = await adRes.json();

  const fieldsRes = await fetch(
    `${process.env.BACKEND_URL}/fields?subcategory=${ad.subcategory._id}`
  );
  const fieldTemplates = fieldsRes.ok ? await fieldsRes.json() : [];

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <UpdateAdForm ad={ad} initialFieldTemplates={fieldTemplates} />
    </main>
  );
}