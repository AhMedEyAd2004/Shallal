"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePDF } from "@react-pdf/renderer";
import { toast } from "sonner";
import { CompanySettings, DocumentData } from "./pdf";
import { DynamicPdfDocument } from "./dynamic-pdf-document";
import { createPdfDocument, deletePdfDocument } from "./actions";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Save, Laptop } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Renders the PDF as a blob URL inside a plain <iframe> instead of
 * react-pdf's <PDFViewer>, so we control the "open parameters" (#view=Fit)
 * and show the entire page shrunk to fit.
 *
 * Single `usePDF` instance drives both the preview and the download button
 * — mounting `PDFDownloadLink` alongside `usePDF` creates two competing
 * render-queues that can loop forever, so the download link is built
 * manually from `instance.url` instead.
 *
 * Saving no longer uploads anything (no UploadThing) — we persist the raw
 * document JSON, and the PDF is re-rendered from that JSON wherever it's
 * needed next (including here).
 */
const DEBOUNCE_MS = 400;

export const PdfPreview = React.memo(function PdfPreview({
  company,
  data,
  editingId,
  setEditingId,
  readOnly = false,
}: {
  company: CompanySettings;
  data: DocumentData;
  editingId?: string | null;
  setEditingId?: (id: string | null) => void;
  readOnly?: boolean;
}) {
  const [instance, update] = usePDF({
    document: <DynamicPdfDocument company={company} document={data} />,
  });

  const canShowPreview = useMediaQuery("(min-width: 1024px)");

  const isFirstRender = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      update(<DynamicPdfDocument company={company} document={data} />);
    }, DEBOUNCE_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, data]);

  const canDownload = !instance.loading && !instance.error && !!instance.url;

  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveToLibrary() {
    setIsSaving(true);
    const toastId = toast.loading("Saving…");

    try {
      const result = await createPdfDocument({
        title: data.title || "Untitled document",
        client: data.client,
        tags: data.tags || [],
        companySnapshot: company,
        pages: data.pages || [[data.content || ""]],
      });

      if (!result.success) throw new Error(result.error);

      if (editingId) {
        await deletePdfDocument(editingId);
        setEditingId?.(null);
      }

      toast.success(editingId ? "Updated document" : "Saved to your library", {
        id: toastId,
        description: data.title || "Untitled document",
      });
    } catch (err) {
      console.error("Failed to save document:", err);
      toast.error("Couldn't save the document", {
        id: toastId,
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border-b border-border bg-card shrink-0">
        <span className="text-sm font-medium text-muted-foreground">
          Preview
        </span>
        <div className="flex items-center gap-2 flex-wrap justify-end ml-auto">
          {!readOnly && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5 px-2.5 sm:px-3"
              disabled={isSaving}
              onClick={handleSaveToLibrary}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span className="hidden sm:inline">Saving…</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Save to Database</span>
                </>
              )}
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            className="gap-1.5 px-2.5 sm:px-3"
            disabled={!canDownload}
            asChild={canDownload}
          >
            {canDownload ? (
              <a
                href={instance.url!}
                download={`${data.title || "document"}.pdf`}
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Download PDF</span>
              </a>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span className="hidden sm:inline">Generating…</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {!canShowPreview ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-6 text-sm text-muted-foreground">
            <Laptop className="h-8 w-8 mb-1 opacity-60" />
            <p className="font-medium text-foreground">
              Preview isn&apos;t available on this screen size
            </p>
            <p>
              Use a larger screen to preview the PDF, or use Download above —
              that works here too.
            </p>
          </div>
        ) : instance.loading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            Generating preview…
          </div>
        ) : instance.error || !instance.url ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-destructive">
            Couldn&apos;t render preview.
          </div>
        ) : (
          <iframe
            key={instance.url}
            src={`${instance.url}#view=Fit&toolbar=0`}
            title="PDF preview"
            className="w-full h-full border-0 bg-background"
          />
        )}
      </div>
    </div>
  );
});
