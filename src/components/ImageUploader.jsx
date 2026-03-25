"use client";

import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { RiImageAddLine, RiCloseLine } from "react-icons/ri";

const ImageUploader = forwardRef(function ImageUploader({ error }, ref) {
  const [files, setFiles] = useState([]); // { file, preview }
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    async uploadAll() {
      if (!files.length) return [];
      setUploading(true);
      try {
        const sigRes = await fetch("/api/sign-upload");
        const { signature, timestamp, cloudName, apiKey } = await sigRes.json();
        const urls = await Promise.all(
        files.map(async ({ file }) => {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("api_key", apiKey);
            fd.append("timestamp", timestamp);
            fd.append("signature", signature);
            fd.append("folder", "tangamarket");
            const res = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
              { method: "POST", body: fd }
            );
            const data = await res.json();
            
            return { url: data.secure_url, public_id: data.public_id };
          })
        );
        return urls;
      } finally {
        setUploading(false);
      }
    },
  }));

  const handleFiles = (incoming) => {
    const remaining = 10 - files.length;
    const selected = Array.from(incoming).slice(0, remaining);
    if (!selected.length) return;
    setFiles((prev) => [
      ...prev,
      ...selected.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const remove = (index) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-gray-600">
        Photos <span className="text-gray-400">(max 10)</span>
      </label>

      <div className="flex flex-wrap gap-2">
        {files.map((entry, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <img src={entry.preview} alt="" className="w-full h-full object-cover" />
            {!uploading && (
              <button type="button" onClick={() => remove(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors">
                <RiCloseLine size={12} className="text-white" />
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ))}

        {files.length < 10 && !uploading && (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 flex flex-col items-center justify-center gap-1 transition-colors">
            <RiImageAddLine size={20} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">Ajouter</span>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => handleFiles(e.target.files)} />

      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
});

export default ImageUploader;