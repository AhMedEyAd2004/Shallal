"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

export function ImageCarousel({
  images,
  alt = "Project image",
  className = "",
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Single image — just render directly, no carousel chrome
  if (images.length === 1) {
    return (
      <div
        className={`relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-muted/20 shadow-sm ${className}`}
      >
        <img
          src={images[0]}
          alt={`${alt} 1`}
          className="object-contain w-full h-full"
        />
      </div>
    );
  }

  return (
    <div data-vaul-no-drag className={`flex flex-col gap-2 ${className}`}>
      {/* Embla viewport + arrows */}
      <div className="relative group">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="relative flex-[0_0_100%] min-w-0 h-48 sm:h-64 bg-muted/20"
              >
                <img
                  src={src}
                  alt={`${alt} ${idx + 1}`}
                  className="object-contain w-full h-full pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev button */}
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 disabled:opacity-20"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 disabled:opacity-20"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dot indicators — below the image, always visible */}
      <div className="flex justify-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === selectedIndex
                ? "w-4 bg-foreground"
                : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
