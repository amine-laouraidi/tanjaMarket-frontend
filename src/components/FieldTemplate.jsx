"use client";

export default function FieldTemplate({ field, value, onChange, error }) {
  const inputBase =
    "w-full h-11 px-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors";

  const label = (
    <label className="text-[11px] font-medium text-gray-600">
      {field.label}
      {field.required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );

  const errorEl = error && <p className="text-[11px] text-red-500">{error}</p>;

  if (field.type === "select") {
    return (
      <div className="flex flex-col gap-1.5">
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        >
          <option value="" disabled>
            {field.placeholder || `Choisir ${field.label.toLowerCase()}`}
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errorEl}
      </div>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (opt) => {
      const next = selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt];
      onChange(next);
    };
    return (
      <div className="flex flex-col gap-1.5">
        {label}
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-3 h-8 rounded-lg text-[12px] font-medium border transition-colors ${
                selected.includes(opt)
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errorEl}
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex flex-col gap-1.5">
        {label}
        <div className="flex gap-4 h-11 items-center">
          {[true, false].map((v) => (
            <label key={v} className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
              <input
                type="radio"
                checked={value === v}
                onChange={() => onChange(v)}
                className="accent-blue-700"
              />
              {v === true ? "Oui" : "Non"}
            </label>
          ))}
        </div>
        {errorEl}
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="flex flex-col gap-1.5">
        {label}
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
        {errorEl}
      </div>
    );
  }

  // text | number
  return (
    <div className="flex flex-col gap-1.5">
      {label}
      <div className="relative">
        <input
          type={field.type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ""}
          min={field.min}
          max={field.max}
          className={`${inputBase} ${field.unit ? "pr-14" : ""}`}
        />
        {field.unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-medium">
            {field.unit}
          </span>
        )}
      </div>
      {errorEl}
    </div>
  );
}