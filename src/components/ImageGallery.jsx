"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ImageGallery({ images = [], title }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-secondary rounded-xl flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Pas de photos</p>
      </div>
    );
  }

  const slides = images.map((img) => ({ src: img.url}));

  return (
    <div className="flex flex-col gap-2">
      {/* Main image */}
      <div
        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-secondary"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
      >
        <Image
          src={images[0].url}
          alt={title}
          fill
          loading="eager"
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-lg">
            1 / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((src, i) => (
            <div
              key={i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                i === 0
                  ? "border-primary"
                  : "border-transparent hover:border-foreground/20"
              }`}
            >
              <Image
                src={src.url}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
      />
    </div>
  );
}
