"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import countriesData from "@/lib/countries.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FlagImage } from "./FlagImage";

const countryOptions = Object.entries(countriesData)
  .map(([code, name]) => ({ value: code.toUpperCase(), label: name as string }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function getFlagUrl(code: string) {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

/** Looks up country name from ISO alpha-2 code */
export function getCountryLabel(code: string) {
  return countryOptions.find((c) => c.value === code)?.label ?? code;
}

interface CountrySelectProps {
  name?: string;
  defaultValue?: string;
}

export function CountrySelect({ name = "country", defaultValue }: CountrySelectProps) {
  const initial = defaultValue
    ? countryOptions.find((c) => c.value === defaultValue || c.label === defaultValue) ?? null
    : null;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ value: string; label: string } | null>(initial);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setSearch("");
    }
  }, [open]);

  const filtered = search.trim()
    ? countryOptions.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : countryOptions;

  return (
    <div ref={wrapperRef} className="relative" data-vaul-no-drag>
      {/* Hidden input carries the ISO code to the server action */}
      <input type="hidden" name={name} value={selected?.value ?? ""} />

      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full justify-between font-normal",
          !selected && "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selected ? (
            <>
              <FlagImage
                countryCode={selected.value}
                countryName={selected.label}
              />
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span>Select country...</span>
          )}
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div
          data-vaul-no-drag
          className="absolute left-0 right-0 top-full mt-1 z-[9999] w-full rounded-md border border-border bg-popover shadow-md overflow-hidden"
        >
          {/* Search */}
          <div className="flex items-center border-b px-3">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No country found.</p>
            )}
            {filtered.map((c) => (
              <button
                key={c.value}
                type="button"
                data-vaul-no-drag
                onClick={() => {
                  setSelected(c);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground text-left"
              >
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0",
                    selected?.value === c.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <FlagImage
                  countryCode={c.value}
                  countryName={c.label}
                />
                <span className="truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
