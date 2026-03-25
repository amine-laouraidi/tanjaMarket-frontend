"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import {
  RiPriceTag3Line,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiBuildingLine,
  RiCloseLine,
} from "react-icons/ri";
import updateAd from "@/app/actions/updateAd";
import { step2Schema } from "@/lib/postAdSchema";
import DynamicFields from "./DynamicFields";
import ImageUploader from "./ImageUploader";

export default function UpdateAdForm({ ad, initialFieldTemplates }) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const imageUploaderRef = useRef(null);

  // Category / subcategory
  const [selectedCategory, setSelectedCategory] = useState(ad.category._id);
  const [selectedSubcategory, setSelectedSubcategory] = useState(ad.subcategory._id);
  const [dynamicValues, setDynamicValues] = useState(ad.fields ?? {});
  const [dynamicFields, setDynamicFields] = useState(initialFieldTemplates ?? []);

  // Basic fields — pre-filled
  const [title, setTitle] = useState(ad.title ?? "");
  const [description, setDescription] = useState(ad.description ?? "");
  const [price, setPrice] = useState(String(ad.price ?? ""));
  const [phone, setPhone] = useState(ad.phone ?? "");
  const [address, setAddress] = useState(ad.location?.address ?? "");
  const [city, setCity] = useState(ad.location?.city ?? "Tanger");

  // Image management — 3 buckets
  // keptImages: existing images the user hasn't removed
  const [keptImages, setKeptImages] = useState(ad.images ?? []);
  // removedPublicIds: public_ids of images the user removed
  const [removedPublicIds, setRemovedPublicIds] = useState([]);

  const inputBase =
    "w-full h-11 px-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors";

  const Field = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-gray-600">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );

  const removeKeptImage = (index) => {
    const img = keptImages[index];
    setRemovedPublicIds((prev) => [...prev, img.public_id]);
    setKeptImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setServerError(null);
    setFieldErrors({});

    // Validate basic fields
    const basicResult = step2Schema.safeParse({
      title,
      description: description || undefined,
      price: Number(price),
      phone: phone || undefined,
    });

    if (!basicResult.success) {
      const errors = Object.fromEntries(
        Object.entries(basicResult.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
      );
      setFieldErrors(errors);
      return;
    }

    // Upload new images
    let newImages = [];
    try {
      newImages = await imageUploaderRef.current.uploadAll();
    } catch {
      setServerError("Erreur lors de l'upload des images, veuillez réessayer");
      return;
    }

    // Merge kept + new
    const finalImages = [...keptImages, ...newImages];

    if (!finalImages.length) {
      setFieldErrors({ images: "Veuillez ajouter au moins une photo" });
      return;
    }

    startTransition(async () => {
      const result = await updateAd(ad._id, {
        title,
        description,
        price: Number(price),
        phone,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        address,
        city,
        images: finalImages,
        fields: dynamicValues,
        removedPublicIds,
      });

      if (!result?.error) return;

      if (result.error._form) {
        setServerError(result.error._form);
        return;
      }

      setFieldErrors(result.error);
    });
  };

  return (
    <div className="w-full max-w-[620px]">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Tanja<span className="text-blue-700">Market</span>
          </h1>
          <p className="text-[12px] text-gray-400 mt-1">
            Modifier votre annonce
          </p>
        </div>

        <div className="flex flex-col gap-4">

          {serverError && (
            <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {serverError}
            </p>
          )}

          {/* Category + Subcategory — disabled in edit mode */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Catégorie">
              <input
                type="text"
                value={ad.category.name}
                disabled
                className={`${inputBase} opacity-50 cursor-not-allowed`}
              />
            </Field>

            <Field label="Sous-catégorie">
              <input
                type="text"
                value={ad.subcategory.name}
                disabled
                className={`${inputBase} opacity-50 cursor-not-allowed`}
              />
            </Field>
          </div>

          {/* Dynamic fields */}
          <DynamicFields
            subcategoryId={selectedSubcategory}
            values={dynamicValues}
            onChange={(name, value) =>
              setDynamicValues((prev) => ({ ...prev, [name]: value }))
            }
            onFieldsLoaded={setDynamicFields}
            fieldErrors={fieldErrors}
            initialFields={initialFieldTemplates}
          />

          {/* Title */}
          <Field label="Titre" required error={fieldErrors.title}>
            <div className="relative">
              <RiPriceTag3Line size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Renault Clio 4, iPhone 14..."
                className={`${inputBase} pl-9`}
              />
            </div>
          </Field>

          {/* Description */}
          <Field label="Description" error={fieldErrors.description}>
            <div className="relative">
              <RiFileTextLine size={14} className="absolute left-3 top-3.5 text-gray-400" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Décrivez votre article en détail..."
                className="w-full pl-9 pr-3 py-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
              />
            </div>
          </Field>

          {/* Price + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix (MAD)" required error={fieldErrors.price}>
              <div className="relative">
                <RiMoneyDollarCircleLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  placeholder="0"
                  className={`${inputBase} pl-9`}
                />
              </div>
            </Field>

            <Field label="Téléphone" error={fieldErrors.phone}>
              <div className="relative">
                <RiPhoneLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className={`${inputBase} pl-9`}
                />
              </div>
            </Field>
          </div>

          {/* Address + City */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Adresse" error={fieldErrors.address}>
              <div className="relative">
                <RiMapPin2Line size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rue, quartier..."
                  className={`${inputBase} pl-9`}
                />
              </div>
            </Field>

            <Field label="Ville">
              <div className="relative">
                <RiBuildingLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Tanger"
                  className={`${inputBase} pl-9`}
                />
              </div>
            </Field>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-gray-600">
              Photos <span className="text-gray-400">(max 10)</span>
            </label>

            {/* Existing images */}
            {keptImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1">
                {keptImages.map((img, i) => (
                  <div key={img.public_id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeptImage(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                    >
                      <RiCloseLine size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New images uploader */}
            {keptImages.length < 10 && (
              <ImageUploader
                ref={imageUploaderRef}
                error={fieldErrors.images}
                maxFiles={10 - keptImages.length}
              />
            )}

            {fieldErrors.images && (
              <p className="text-[11px] text-red-500">{fieldErrors.images}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-lg transition-all mt-1"
          >
            {isPending ? "Modification en cours..." : "Enregistrer les modifications"}
          </button>

        </div>
      </div>
    </div>
  );
}