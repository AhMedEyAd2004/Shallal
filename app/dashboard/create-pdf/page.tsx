"use client";

import { useState } from "react";
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
import { Plus, ArrowLeft, Settings, RefreshCw } from "lucide-react";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isLoaded) return null;

  const activeCompany = documentCompany || settings;

  function handleCreateNew() {
    setDocumentData(INITIAL_DOCUMENT_DATA);
    setEditingId(null);
    setDocumentCompany(null);
    setView("document");
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto text-foreground min-h-screen flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {view === "existing"
            ? "PDF Documents"
            : editingId
              ? "Edit PDF"
              : "Create New PDF"}
        </h1>
        <div className="flex items-center gap-2">
          {view === "document" && (
            <>
              {documentCompany && (
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
                  ? "!w-screen !max-w-none rounded-none border-0 !top-16 !h-[calc(100vh-4rem)]"
                  : "max-h-[95vh]"
              }
            >
              <DrawerHeader
                className={
                  isDesktop
                    ? "max-w-screen-xl mx-auto w-full flex flex-row items-center gap-4"
                    : ""
                }
              >
                {isDesktop && (
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
                )}
              </DrawerHeader>
              <div
                className={
                  isDesktop
                    ? "max-w-screen-xl mx-auto w-full p-4 md:py-0 sm:px-6 overflow-y-visibile"
                    : "p-4 sm:p-6 overflow-y-auto"
                }
              >
                <CompanySettingsForm
                  initialSettings={settings}
                  onSave={(newSettings) => {
                    saveSettings(newSettings);
                    setIsSettingsOpen(false);
                  }}
                />
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
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
          <ExistingPdfsPanel
            onEdit={(doc) => {
              setDocumentData({
                title: doc.title || "",
                client: doc.client || { name: "", phone: "", email: "" },
                tags: doc.tags || [],
                pages: doc.pages || [[""]],
                content: "", // add this
              });
              setDocumentCompany(doc.company_snapshot || null);
              setEditingId(doc.id);
              setView("document");
            }}
          />
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
            <PdfPreview
              company={activeCompany}
              data={documentData}
              editingId={editingId}
              setEditingId={setEditingId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
