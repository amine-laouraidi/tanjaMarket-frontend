"use client";

import { useState, useRef, useTransition } from "react";
import {
  RiPriceTag3Line,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiBuildingLine,
  RiArrowRightLine,
  RiArrowLeftLine,
} from "react-icons/ri";
import postAd from "@/app/actions/postAd";
import { step1Schema, step2Schema } from "@/lib/postAdSchema";
import DynamicFields from "./DynamicFields";
import ImageUploader from "./ImageUploader";

const STEPS = [
  { number: 1, label: "Catégorie" },
  { number: 2, label: "Détails" },
  { number: 3, label: "Localisation" },
];

export default function PostAdForm({ categories, subcategories ,defaultPhone }) {
  const [step, setStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const imageUploaderRef = useRef(null);

  // Step 1
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [dynamicValues, setDynamicValues] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);

  // Step 2
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState(defaultPhone);

  // Step 3
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Tanger");

  const filteredSubcategories = subcategories.filter(
    (sub) =>
      sub.category === selectedCategory ||
      sub.category?._id === selectedCategory,
  );

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

  const validateStep = (s) => {
    let result;

    if (s === 1) {
      result = step1Schema.safeParse({
        category: selectedCategory,
        subcategory: selectedSubcategory,
      });
    }

    if (s === 2) {
      result = step2Schema.safeParse({
        title,
        description: description || undefined,
        price: Number(price),
        phone: phone,
      });
    }

    if (s === 1 && result?.success) {
      const dynErrors = {};

      for (const field of dynamicFields) {
        const val = dynamicValues[field.name];
        const isEmpty =
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0);

        // required check
        if (field.required && isEmpty) {
          dynErrors[field.name] = `"${field.label}" est obligatoire`;
          continue;
        }

        if (isEmpty) continue;

        // type validation — mirrors backend validateFields exactly
        switch (field.type) {
          case "number": {
            if (isNaN(val)) {
              dynErrors[field.name] = `"${field.label}" doit être un nombre`;
            } else {
              const num = Number(val);
              if (field.min !== undefined && num < field.min)
                dynErrors[field.name] =
                  `"${field.label}" doit être au moins ${field.min}`;
              else if (field.max !== undefined && num > field.max)
                dynErrors[field.name] =
                  `"${field.label}" doit être au maximum ${field.max}`;
            }
            break;
          }
          case "select": {
            if (!field.options.includes(val))
              dynErrors[field.name] = `Valeur invalide pour "${field.label}"`;
            break;
          }
          case "multiselect": {
            if (!Array.isArray(val))
              dynErrors[field.name] = `"${field.label}" doit être un tableau`;
            else if (!val.every((v) => field.options.includes(v)))
              dynErrors[field.name] =
                `Valeur(s) invalide(s) pour "${field.label}"`;
            break;
          }
          case "boolean": {
            if (val !== "true" && val !== "false" && typeof val !== "boolean")
              dynErrors[field.name] = `"${field.label}" doit être Oui ou Non`;
            break;
          }
        }
      }

      if (Object.keys(dynErrors).length) {
        return dynErrors;
      }
    }

    if (!result || result.success) return {};

    // flatten arrays to first error per field
    return Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [
        k,
        v[0],
      ]),
    );
  };

  const next = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStep((s) => s + 1);
  };

  const back = () => {
    setFieldErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setServerError(null);
    setFieldErrors({});

    let images = [];
    try {
      images = await imageUploaderRef.current.uploadAll();
    } catch {
      setServerError("Erreur lors de l'upload des images, veuillez réessayer");
      return;
    }
    if (!images.length) {
      setFieldErrors({ images: "Veuillez ajouter au moins une photo" });
      return;
    }
    
    startTransition(async () => {
      const result = await postAd({
        title,
        description,
        price: Number(price),
        phone,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        address,
        city,
        images,
        fields: dynamicValues,
      });

      if (!result?.error) return;

      if (result.error._form) {
        setServerError(result.error._form);
        return;
      }

      // Server returned field errors — show them
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
            Publiez votre annonce gratuitement
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-7">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                    step === s.number
                      ? "bg-blue-700 text-white"
                      : step > s.number
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.number ? "✓" : s.number}
                </div>
                <span
                  className={`text-[10px] font-medium ${step === s.number ? "text-blue-700" : "text-gray-400"}`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-16 h-px mb-4 mx-1 transition-colors ${step > s.number ? "bg-blue-200" : "bg-gray-100"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {serverError && (
            <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {serverError}
            </p>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Catégorie" required error={fieldErrors.category}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory("");
                      setDynamicValues({});
                      setDynamicFields([]);
                    }}
                    className={inputBase}
                  >
                    <option value="" disabled>
                      Choisir...
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Sous-catégorie"
                  required
                  error={fieldErrors.subcategory}
                >
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setDynamicValues({});
                      setDynamicFields([]);
                    }}
                    disabled={!selectedCategory}
                    className={`${inputBase} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="" disabled>
                      Choisir...
                    </option>
                    {filteredSubcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <DynamicFields
                subcategoryId={selectedSubcategory}
                values={dynamicValues}
                onChange={(name, value) =>
                  setDynamicValues((prev) => ({ ...prev, [name]: value }))
                }
                onFieldsLoaded={setDynamicFields}
                fieldErrors={fieldErrors}
              />
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Field label="Titre" required error={fieldErrors.title}>
                <div className="relative">
                  <RiPriceTag3Line
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Renault Clio 4, iPhone 14, Appartement meublé..."
                    className={`${inputBase} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Description" error={fieldErrors.description}>
                <div className="relative">
                  <RiFileTextLine
                    size={14}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Décrivez votre article en détail..."
                    className="w-full pl-9 pr-3 py-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                  />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix (MAD)" required error={fieldErrors.price}>
                  <div className="relative">
                    <RiMoneyDollarCircleLine
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
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

                <Field label="Téléphone" required error={fieldErrors.phone}>
                  <div className="relative">
                    <RiPhoneLine
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
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
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Adresse" error={fieldErrors.address}>
                  <div className="relative">
                    <RiMapPin2Line
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
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
                    <RiBuildingLine
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
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

              <ImageUploader ref={imageUploaderRef} error={fieldErrors.images}/>
            </div>
          )}

          {/* Navigation */}
          <div
            className={`flex gap-3 mt-1 ${step > 1 ? "justify-between" : "justify-end"}`}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                disabled={isPending}
                className="flex items-center gap-1.5 h-11 px-5 border border-gray-200 hover:border-gray-300 text-gray-600 text-[13px] font-medium rounded-lg transition-all disabled:opacity-50"
              >
                <RiArrowLeftLine size={14} /> Retour
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-1.5 h-11 px-5 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white text-[13px] font-medium rounded-lg transition-all"
              >
                Suivant <RiArrowRightLine size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-lg transition-all"
              >
                {isPending ? "Publication en cours..." : "Publier l'annonce"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
