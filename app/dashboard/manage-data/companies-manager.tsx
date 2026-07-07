"use client";

import { useState, useTransition, useOptimistic, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import countriesData from "@/lib/countries.json";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X, ImageIcon } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "react-dropzone";
import {
  addCompanyAction,
  deleteCompanyAction,
  deleteUploadThingFilesAction,
} from "./actions";
import { FlagImage } from "@/components/custom/FlagImage";

const countryOptions = Object.entries(countriesData)
  .map(([code, name]) => ({ value: code.toUpperCase(), label: name as string }))
  .sort((a, b) => a.label.localeCompare(b.label));

function getFlagUrl(code: string) {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

function SingleImageManager({
  value,
  onUrlChange,
}: {
  value: string;
  onUrlChange: (url: string) => void;
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const existingUrl = value && value !== "/logo.png" ? value : "";

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        onUrlChange(res[0].url);
      }
      setUploadProgress(0);
    },
    onUploadError: (error) => {
      alert(`Upload error: ${error.message}`);
      setUploadProgress(0);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    maxFiles: 1,
    onDrop: async (accepted) => {
      if (accepted.length > 0) {
        if (existingUrl) {
          try {
            await deleteUploadThingFilesAction([existingUrl]);
          } catch (e) {}
        }
        await startUpload([accepted[0]]);
      }
    },
  });

  const removeExisting = async () => {
    if (!existingUrl) return;
    try {
      await deleteUploadThingFilesAction([existingUrl]);
    } catch (e) {}
    onUrlChange("");
  };

  return (
    <div className="space-y-4 border p-4 rounded-md bg-muted/20">
      <div className="flex justify-between items-center">
        <Label>Company Image</Label>
      </div>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border hover:bg-muted/50"
        }`}
      >
        <input {...getInputProps()} />
        <ImageIcon
          className={`h-8 w-8 mx-auto mb-2 transition-colors ${
            isDragActive ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <p className="text-sm font-medium">
          {isUploading ? "Uploading..." : "Click or drag image here"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG, WEBP up to 4MB (1 image only)
        </p>

        {isUploading && (
          <div className="mt-4 space-y-1">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {existingUrl && (
        <div className="flex items-center justify-between bg-background border p-2 rounded-lg">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={existingUrl}
              alt="existing"
              className="h-10 w-10 object-cover rounded"
            />
            <p className="text-sm font-medium truncate">Uploaded Image</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeExisting();
            }}
            disabled={isUploading}
            className="text-destructive h-8 w-8 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function CompaniesManager({ companies }: { companies: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [companyImageUrl, setCompanyImageUrl] = useState("/logo.png");

  const [optimisticCompanies, addOptimisticCompany] = useOptimistic(
    companies,
    (state, newCompany: any) => {
      if (newCompany.action === "delete") {
        return state.filter((c: any) => c.id !== newCompany.id);
      }
      return [newCompany, ...state];
    }
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-stack">Served Companies</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ADD FORM */}
        <div className="w-full md:w-1/3 border border-border rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-lg mb-4">Add Company</h3>
          <form
            ref={formRef}
            action={async (formData) => {
              const countryImg = selectedCountry
                ? getFlagUrl(selectedCountry.value)
                : "/egypt.png";
              formData.set("countryImage", countryImg);
              formData.set("companyImage", companyImageUrl || "/logo.png");

              addOptimisticCompany({
                id: Math.random().toString(),
                title: formData.get("title"),
                company_image_url: formData.get("companyImage"),
                country_image_url: countryImg,
              });

              await addCompanyAction(formData);
              setSelectedCountry(null);
              setCompanyImageUrl("/logo.png"); // Reset
              formRef.current?.reset();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input name="title" required placeholder="e.g. Acme Corp" />
            </div>

            <SingleImageManager
              value={companyImageUrl}
              onUrlChange={setCompanyImageUrl}
            />

            <div className="space-y-2">
              <Label>Country</Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className={cn(
                      "w-full justify-between font-normal",
                      !selectedCountry && "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {selectedCountry ? (
                        <>
                          <FlagImage
                            countryCode={selectedCountry.value}
                            countryName={selectedCountry.label}
                          />
                          <span className="truncate">
                            {selectedCountry.label}
                          </span>
                        </>
                      ) : (
                        <span>Select country...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countryOptions.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.label}
                            onSelect={() => {
                              setSelectedCountry(c);
                              setComboboxOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCountry?.value === c.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <FlagImage
                              countryCode={c.value}
                              countryName={c.label}
                            />
                            <span className="truncate">{c.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Button className="w-full">
              Save Company
            </Button>
          </form>
        </div>

        {/* LIST */}
        <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4 items-start content-start">
          {optimisticCompanies.map((c: any) => (
            <div
              key={c.id}
              className={`relative group border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors h-fit ${c.action === "delete" ? "opacity-50" : ""}`}
            >
              <div
                className="relative shrink-0 size-12 lg:size-16"
                title={`${c.title}`}
              >
                <Image
                  src={c.company_image_url || "/logo.png"}
                  alt={c.title}
                  fill
                  className="object-contain rounded-lg"
                />
                {c.country_image_url &&
                  (() => {
                    const parts = c.country_image_url.split("/");
                    const code = parts[parts.length - 1]
                      .split(".")[0]
                      .toUpperCase();
                    return (
                      <FlagImage
                        countryCode={code}
                        countryName={c.title}
                        className="absolute bottom-0 -right-1"
                      />
                    );
                  })()}
              </div>

              <p className="font-medium text-sm text-center">{c.title}</p>

              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  startTransition(() => {
                  addOptimisticCompany({ id: c.id, action: "delete" });
                    deleteCompanyAction(c.id)} );
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
