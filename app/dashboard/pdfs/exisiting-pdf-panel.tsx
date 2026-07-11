"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Eye, Loader2, Search, Trash2 } from "lucide-react";
import {
  getPdfDocuments,
  deletePdfDocument,
  type StoredPdfDocument,
} from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function matchesQuery(doc: StoredPdfDocument, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const inTitle = doc.title?.toLowerCase().includes(q);
  const inTags = doc.tags?.some((tag) => tag.toLowerCase().includes(q));
  return Boolean(inTitle || inTags);
}

interface ExistingPdfsPanelProps {
  onView?: (doc: StoredPdfDocument) => void;
}

export function ExistingPdfsPanel({ onView }: ExistingPdfsPanelProps) {
  const [documents, setDocuments] = useState<StoredPdfDocument[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<StoredPdfDocument | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    getPdfDocuments()
      .then((data) => {
        if (!cancelled) setDocuments(data);
      })
      .catch((err) => {
        console.error("Failed to load existing PDFs:", err);
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Server already orders by updated_at desc — this just narrows by query.
  const filtered = useMemo(
    () => (documents ?? []).filter((doc) => matchesQuery(doc, query)),
    [documents, query],
  );

  async function confirmDelete() {
    if (!itemToDelete) return;
    const id = itemToDelete.id;
    setIsDeleting(id);
    setItemToDelete(null);
    const result = await deletePdfDocument(id);
    if (result.success) {
      toast.success("PDF deleted successfully");
      setDocuments((prev) => prev?.filter((doc) => doc.id !== id) || null);
    } else {
      toast.error(result.error || "Failed to delete PDF");
    }
    setIsDeleting(null);
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-destructive">
        Couldn&apos;t load existing PDFs. Please try again.
      </div>
    );
  }

  if (!documents) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading documents…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or tags…"
          className="pl-9"
          dir="auto"
        />
      </div>

      {documents.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No documents yet — PDFs you generate will show up here.
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No documents match &quot;{query}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-3 p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors bg-card shadow-sm"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 bg-muted rounded-lg shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold" dir="auto">
                    {doc.title || "Untitled document"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatUpdatedAt(doc.updated_at)}
                  </p>
                </div>
              </div>

              {doc.tags?.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {doc.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border font-medium"
                      dir="auto"
                    >
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 2 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border font-medium">
                      +{doc.tags.length - 2} more
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-[22px]" />
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => onView?.(doc)}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setItemToDelete(doc)}
                  disabled={isDeleting === doc.id}
                  title="Delete Document"
                >
                  {isDeleting === doc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription dir="auto">
              Are you sure you want to delete "
              {itemToDelete?.title || "this document"}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              disabled={!!isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!!isDeleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
