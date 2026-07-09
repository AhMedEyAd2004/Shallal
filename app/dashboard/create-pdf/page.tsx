"use client";

import { useState } from "react";
import { DocumentData } from "./pdf";
import { CompanySettingsForm } from "./company-settings-form";
import { PdfPreview } from "./pdf-preview";
import { useCompanySettings } from "./useCompanySettings";
import { DocumentFormPanel } from "./document-form-panel";
import { ExistingPdfsPanel } from "./exisiting-pdf-panel";

const INITIAL_DOCUMENT_DATA: DocumentData = {
  title: "عرض سعر المشروع",
  client: { name: "", phone: "", email: "" },
  content: "تفاصيل عرض السعر...",
  tags: [],
};

// Shared fixed height for both the form panel and PDF viewer
const PANEL_HEIGHT = "h-[680px]";

export default function PdfCreatorDashboard() {
  const { settings, saveSettings, isLoaded } = useCompanySettings();
  const [tab, setTab] = useState<"settings" | "document" | "existing">(
    "document",
  );
  const [documentData, setDocumentData] = useState(INITIAL_DOCUMENT_DATA);

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-screen-xl mx-auto  text-foreground min-h-screen">
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-muted p-1 rounded-xl w-fit">
        {(["document", "settings", "existing"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "document"
              ? "Create Document"
              : t === "settings"
                ? "Company Settings"
                : "Existing PDFs"}
          </button>
        ))}
      </div>

      {tab === "settings" ? (
        <div
          className={` overflow-auto bg-card text-card-foreground border relative border-border rounded-2xl p-6 shadow-sm`}
        >
          <h2 className="text-base font-semibold ">Company Settings</h2>
          <CompanySettingsForm
            initialSettings={settings}
            onSave={saveSettings}
          />
        </div>
      ) : tab === "existing" ? (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4">Existing PDFs</h2>
          <ExistingPdfsPanel />
        </div>
      ) : (
        <div className={`flex flex-col lg:flex-row gap-5 ${PANEL_HEIGHT}`}>
          {/* Form panel — dominant, ~62% on large screens */}
          <div className="w-full lg:flex-[3] shrink-0 bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm overflow-y-auto flex flex-col">
            <h2 className="text-base font-semibold mb-5">Document Details</h2>
            <DocumentFormPanel
              initialData={documentData}
              onChange={setDocumentData}
            />
          </div>

          {/* PDF viewer — narrower, ~38%, with its own download action */}
          <div className="w-full lg:flex-[2] rounded-2xl overflow-hidden border border-border shadow-sm">
            <PdfPreview company={settings} data={documentData} />
          </div>
        </div>
      )}
    </div>
  );
}
