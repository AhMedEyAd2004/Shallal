"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FlagImageProps {
  countryCode: string;
  countryName: string;
  className?: string;
  width?: number;
  height?: number;
}

export function FlagImage({
  countryCode,
  countryName,
  className,
  width = 24,
  height = 24,
}: FlagImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden shrink-0 rounded-full border-2 border-border bg-background flex items-center justify-center",
        className,
        !isLoaded && "animate-pulse",
      )}
      style={{ width, height }}
    >
      <Image
        src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
        alt={`${countryName} flag`}
        width={width}
        height={height}
        loading="lazy"
        className={cn(
          "object-cover w-full h-full transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
