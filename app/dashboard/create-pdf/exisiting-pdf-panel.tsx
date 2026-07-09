"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, ExternalLink, Loader2, Search } from "lucide-react";
import { getPdfDocuments, type StoredPdfDocument } from "./actions";
import { Input } from "@/components/ui/input";

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

export function ExistingPdfsPanel() {
  const [documents, setDocuments] = useState<StoredPdfDocument[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

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
        <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden">
          {filtered.map((doc) => (
            <a
              key={doc.id}
              href={doc.filepath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" dir="auto">
                  {doc.title || doc.filename}
                </p>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <p className="text-xs text-muted-foreground shrink-0">
                    {formatUpdatedAt(doc.updated_at)}
                  </p>
                  {doc.tags?.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
