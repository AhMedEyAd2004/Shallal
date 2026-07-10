"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { CompanySettings } from "./pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, X } from "lucide-react";

interface CompanySettingsFormProps {
  initialSettings: CompanySettings;
  onSave: (settings: CompanySettings) => void;
}

// Same fallback used in default-company-settings.ts — treated as "no logo set yet".
const DEFAULT_LOGO = "/logo.png";
const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2MB — this gets base64-encoded into localStorage/JSON, so keep it small

const COMPANY_FIELDS: {
  key: keyof CompanySettings;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "companyName", label: "Company Name", placeholder: "Acme Corp" },
  { key: "phone", label: "Phone", placeholder: "+1 234 567 8900" },
  {
    key: "email",
    label: "Email",
    placeholder: "info@company.com",
    type: "email",
  },
  { key: "website", label: "Website", placeholder: "www.company.com" },
  {
    key: "address",
    label: "Address",
    placeholder: "123 Main St, City, Country",
  },
];

const MANAGER_FIELDS: {
  key: keyof CompanySettings;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "managerName", label: "Manager Name", placeholder: "John Doe" },
  {
    key: "managerPhone",
    label: "Manager Phone",
    placeholder: "+1 234 567 8901",
  },
  {
    key: "managerEmail",
    label: "Manager Email",
    placeholder: "manager@company.com",
    type: "email",
  },
];

/**
 * Drag-and-drop logo picker. This only ever needs to end up embedded in the
 * generated PDF, so there's no server upload step (no UploadThing etc.) —
 * the file is read client-side and stored as a base64 data URL, which
 * react-pdf's <Image> component can render directly.
 */
function LogoUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const hasCustomLogo = !!value && value !== DEFAULT_LOGO;

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const reason = rejections[0].errors[0]?.code;
        setError(
          reason === "file-too-large"
            ? "That image is too large — please use one under 2MB."
            : "That file isn't a supported image type.",
        );
        return;
      }

      const file = accepted[0];
      if (!file) return;

      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.onerror = () =>
        setError("Couldn't read that file, please try again.");
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: MAX_LOGO_BYTES,
    onDrop,
  });

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">Company Logo</Label>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border hover:bg-muted/50"
        }`}
      >
        <input {...getInputProps()} />
        <ImageIcon
          className={`h-6 w-6 mx-auto mb-1.5 transition-colors ${
            isDragActive ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <p className="text-xs font-medium">
          {isDragActive ? "Drop the image here" : "Click or drag a logo here"}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          PNG, JPG, or WEBP — up to 2MB
        </p>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-center gap-3 bg-muted border border-border rounded-lg p-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value || DEFAULT_LOGO}
          alt="Company logo preview"
          className="h-12 w-12 object-contain border border-border rounded-lg bg-background p-1 shrink-0"
        />
        <span className="text-xs text-muted-foreground flex-1">
          {hasCustomLogo
            ? "Custom logo uploaded"
            : "Using default placeholder logo"}
        </span>
        {hasCustomLogo && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => onChange(DEFAULT_LOGO)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function CompanySettingsForm({
  initialSettings,
  onSave,
}: CompanySettingsFormProps) {
  const [values, setValues] = useState(initialSettings);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function updateField(key: keyof CompanySettings, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSavedAt(null);
  }

  function handleSave() {
    onSave(values);
    setSavedAt(Date.now());
  }

  return (
    <div className="w-full relative px-1 flex flex-col h-full">
      {/* Save */}
      <div className=" absolute top-0 right-0 -translate-y-1/2 md:-translate-y-full flex items-center gap-3">
        <Button type="button" onClick={handleSave}>
          Save Settings
        </Button>
        {savedAt && (
          <span className="text-xs text-green-600 font-medium">✓ Saved</span>
        )}
      </div>
      {/* Company Info */}
      <div className="mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {COMPANY_FIELDS.map(({ key, label, placeholder, type }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={key} className="text-xs text-muted-foreground">
                {label}
              </Label>
              <Input
                dir="auto"
                id={key}
                type={type ?? "text"}
                placeholder={placeholder}
                value={values[key]}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <LogoUploader
          value={values.logo}
          onChange={(url) => updateField("logo", url)}
        />
      </div>

      {/* Manager Info */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Manager / Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MANAGER_FIELDS.map(({ key, label, placeholder, type }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={key} className="text-xs text-muted-foreground">
                {label}
              </Label>
              <Input
                id={key}
                dir="auto"
                type={type ?? "text"}
                placeholder={placeholder}
                value={values[key]}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
