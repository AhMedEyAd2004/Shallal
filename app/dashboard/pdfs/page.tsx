"use client";

import { useEffect, useState } from "react";
import { DocumentData, CompanySettings } from "./pdf";
import { CompanySettingsForm } from "./company-settings-form";
import { PdfPreview } from "./pdf-preview";
import { useCompanySettings } from "./useCompanySettings";
import { DocumentFormPanel } from "./document-form-panel";
import { ExistingPdfsPanel } from "./exisiting-pdf-panel";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus, ArrowLeft, Settings, RefreshCw, Pencil } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const [view, setView] = useState<"existing" | "document">("existing");
  const [documentData, setDocumentData] = useState(INITIAL_DOCUMENT_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [documentCompany, setDocumentCompany] =
    useState<CompanySettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Draft copy edited inside the settings drawer; only committed to
  // `settings` when Save is pressed. Seeded fresh from `settings` each time
  // the drawer opens (see effect below).
  const [companyDraft, setCompanyDraft] = useState<CompanySettings | null>(
    null,
  );
  const [settingsSavedAt, setSettingsSavedAt] = useState<number | null>(null);
  // Cards open in read-only "View" mode; the Edit button flips this off.
  const [readOnly, setReadOnly] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isSettingsOpen) {
      setCompanyDraft(settings);
      setSettingsSavedAt(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingsOpen]);

  if (!isLoaded) return null;

  const activeCompany = documentCompany || settings;

  function handleSaveCompanySettings() {
    if (!companyDraft) return;
    saveSettings(companyDraft);
    setSettingsSavedAt(Date.now());
  }

  function handleCreateNew() {
    setDocumentData(INITIAL_DOCUMENT_DATA);
    setEditingId(null);
    setDocumentCompany(null);
    setReadOnly(false);
    setView("document");
  }

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto text-foreground min-h-screen flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold truncate">
          {view === "existing"
            ? "PDF Documents"
            : readOnly
              ? "View PDF"
              : editingId
                ? "Edit PDF"
                : "Create New PDF"}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {view === "document" && (
            <>
              {readOnly && (
                <Button
                  variant="secondary"
                  onClick={() => setReadOnly(false)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
              {!readOnly && documentCompany && (
                <Button
                  variant="secondary"
                  onClick={() => setDocumentCompany(null)}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Use Current Company Details
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setView("existing")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Button>
            </>
          )}

          <Drawer
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            direction={isDesktop ? "right" : "bottom"}
          >
            <DrawerTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Company Settings
              </Button>
            </DrawerTrigger>
            <DrawerContent
              className={
                isDesktop
                  ? "!w-screen !max-w-none rounded-none border-0 !top-16 !h-[calc(100vh-4rem)] flex flex-col"
                  : "max-h-[95vh] flex flex-col"
              }
            >
              <DrawerHeader
                className={
                  isDesktop
                    ? "shrink-0 max-w-screen-xl mx-auto w-full flex flex-row items-center justify-between gap-4"
                    : "shrink-0 flex flex-row items-center justify-between gap-3"
                }
              >
                {isDesktop ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSettingsOpen(false)}
                    title="Go back"
                    className="shrink-0 w-fit ml-3"
                  >
                    <ArrowLeft className="h-5 w-5 " />
                    <DrawerTitle>Back</DrawerTitle>
                  </Button>
                ) : (
                  <DrawerTitle>Company Settings</DrawerTitle>
                )}

                <div className="flex items-center gap-3 mr-3">
                  {settingsSavedAt && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Saved
                    </span>
                  )}
                  <Button type="button" onClick={handleSaveCompanySettings}>
                    Save Settings
                  </Button>
                </div>
              </DrawerHeader>

              <div
                className={
                  isDesktop
                    ? "flex-1 min-h-0 overflow-y-auto max-w-screen-xl mx-auto w-full p-4 md:pt-2 sm:px-6"
                    : "flex-1 min-h-0 overflow-y-auto p-4 sm:p-6"
                }
              >
                {companyDraft && (
                  <CompanySettingsForm
                    value={companyDraft}
                    onChange={setCompanyDraft}
                  />
                )}
              </div>
            </DrawerContent>
          </Drawer>

          {view === "existing" && (
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create PDF
            </Button>
          )}
        </div>
      </div>

      {view === "existing" ? (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
          <ExistingPdfsPanel
            onView={(doc) => {
              setDocumentData({
                title: doc.title || "",
                client: doc.client || { name: "", phone: "", email: "" },
                tags: doc.tags || [],
                pages: doc.pages || [[""]],
                content: "",
              });
              setDocumentCompany(doc.company_snapshot || null);
              setEditingId(doc.id);
              setReadOnly(true);
              setView("document");
            }}
          />
        </div>
      ) : (
        <div className={`flex flex-col lg:flex-row gap-5 ${PANEL_HEIGHT}`}>
          {/* Form panel — dominant, ~62% on large screens */}
          <div className="w-full flex-1 min-h-0 lg:flex-[3] lg:shrink-0 bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-6 shadow-sm overflow-y-auto flex flex-col">
            <h2 className="text-base font-semibold mb-5">Document Details</h2>
            <DocumentFormPanel
              initialData={documentData}
              onChange={setDocumentData}
              readOnly={readOnly}
            />
          </div>

          {/* PDF viewer — narrower, ~38%, with its own download action */}
          <div className="w-full flex-1 min-h-0 lg:flex-[2] rounded-2xl overflow-hidden border border-border shadow-sm">
            <PdfPreview
              company={activeCompany}
              data={documentData}
              editingId={editingId}
              setEditingId={setEditingId}
              readOnly={readOnly}
            />
          </div>
        </div>
      )}
    </div>
  );
}
