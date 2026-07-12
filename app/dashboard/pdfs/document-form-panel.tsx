"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { DocumentData } from "./pdf";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FilePlus } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";

const DynamicQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-[130px] w-full bg-muted/40 animate-pulse rounded-md border" />
    ),
  },
);

const DEBOUNCE_MS = 600;

interface DocumentFormPanelProps {
  initialData: DocumentData;
  onChange: (data: DocumentData) => void;
  readOnly?: boolean;
}

export function DocumentFormPanel({
  initialData,
  onChange,
  readOnly = false,
}: DocumentFormPanelProps) {
  const [formData, setFormData] = useState<DocumentData>(() => ({
    ...initialData,
    pages: initialData.pages || [[initialData.content || ""]],
    tags: initialData.tags || [],
  }));
  const [tagsText, setTagsText] = useState((initialData.tags || []).join(", "));

  const blockIdCounter = useRef(0);
  const [blockIds, setBlockIds] = useState<string[][]>(() =>
    (initialData.pages || [[initialData.content || ""]]).map((page) =>
      page.map(() => `b${blockIdCounter.current++}`),
    ),
  );

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onChange(formData);
    }, DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [formData, onChange]);

  function updateField(field: keyof DocumentData, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleTagsTextChange(value: string) {
    setTagsText(value);
    const parsed = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateField("tags", parsed);
  }

  function updateClientField(
    field: keyof DocumentData["client"],
    value: string,
  ) {
    setFormData((prev) => ({
      ...prev,
      client: { ...prev.client, [field]: value },
    }));
  }

  function handleAddPage() {
    setFormData((prev) => ({
      ...prev,
      pages: [...(prev.pages || []), [""]],
    }));
    setBlockIds((prev) => [...prev, [`b${blockIdCounter.current++}`]]);
  }

  function handleRemovePage(pageIndex: number) {
    setFormData((prev) => ({
      ...prev,
      pages: (prev.pages || []).filter((_, idx) => idx !== pageIndex),
    }));
    setBlockIds((prev) => prev.filter((_, idx) => idx !== pageIndex));
  }

  function handleAddBlock(pageIndex: number, afterBlockIndex: number = -1) {
    const insertAt = afterBlockIndex + 1;
    setFormData((prev) => {
      const updatedPages = [...(prev.pages || [])];
      const blocks = [...updatedPages[pageIndex]];
      blocks.splice(insertAt, 0, "");
      updatedPages[pageIndex] = blocks;
      return { ...prev, pages: updatedPages };
    });
    setBlockIds((prev) => {
      const updated = [...prev];
      const ids = [...updated[pageIndex]];
      ids.splice(insertAt, 0, `b${blockIdCounter.current++}`);
      updated[pageIndex] = ids;
      return updated;
    });
  }

  function handleRemoveBlock(pageIndex: number, blockIndex: number) {
    setFormData((prev) => {
      const updatedPages = [...(prev.pages || [])];
      updatedPages[pageIndex] = updatedPages[pageIndex].filter(
        (_, bIdx) => bIdx !== blockIndex,
      );
      return { ...prev, pages: updatedPages };
    });
    setBlockIds((prev) => {
      const updated = [...prev];
      updated[pageIndex] = updated[pageIndex].filter(
        (_, bIdx) => bIdx !== blockIndex,
      );
      return updated;
    });
  }

  function handleBlockChange(
    pageIndex: number,
    blockIndex: number,
    content: string,
    delta: any,
    source: string,
    editor: any,
  ) {
    if (!editor) return;

    const deltaJson = editor.getContents();
    const jsonString = JSON.stringify(deltaJson);

    setFormData((prev) => {
      const updatedPages = [...(prev.pages || [])];
      updatedPages[pageIndex] = updatedPages[pageIndex].map(
        (blockText, bIdx) => (bIdx === blockIndex ? jsonString : blockText),
      );
      return { ...prev, pages: updatedPages };
    });
  }

  const currentPages = formData.pages || [[""]];

  const quillModules = {
    toolbar: [
      ["underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: "" }, { align: "center" }, { align: "right" }],
      [{ header: [false, 1, 2] }],
      [{ direction: "rtl" }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "header",
    "direction",
  ];

  return (
    <form
      className="w-full flex flex-col h-full gap-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <style>{`
        /* 1. Base Editor Formatting Wrappers */
        .quill-tailwind-reset .ql-toolbar.ql-snow {
          border-color: hsl(var(--border)) !important;
          border-top-left-radius: var(--radius) !important;
          border-top-right-radius: var(--radius) !important;
          background-color: hsl(var(--background)) !important;
          padding: 8px 12px !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 6px !important;
          line-height: normal !important;
        }
        .quill-tailwind-reset .ql-container.ql-snow {
          border-color: hsl(var(--border)) !important;
          border-bottom-left-radius: var(--radius) !important;
          border-bottom-right-radius: var(--radius) !important;
          background-color: hsl(var(--background)) !important;
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .quill-tailwind-reset .ql-editor {
          min-height: 110px;
          color: hsl(var(--foreground)) !important;
        }

        /* 2. Critical Icon Reset Layer: Forces buttons and SVGs to bypass Tailwind's resets */
        .quill-tailwind-reset .ql-snow.ql-toolbar button,
        .quill-tailwind-reset .ql-snow .ql-toolbar button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 28px !important;
          height: 24px !important;
          padding: 0 !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          box-sizing: content-box !important; /* Fixes squashed element padding */
        }

        .quill-tailwind-reset .ql-snow.ql-toolbar svg,
        .quill-tailwind-reset .ql-snow .ql-toolbar svg,
        .quill-tailwind-reset .ql-toolbar.ql-snow svg {
          width: 18px !important;
          height: 18px !important;
          display: inline-block !important; /* Re-establishes normal rendering bounds */
          vertical-align: middle !important;
          visibility: visible !important;   /* Pulls invisible vectors back to life */
          opacity: 1 !important;
          max-width: none !important;        /* Halts Tailwind from squishing sizes down */
          max-height: none !important;
          box-sizing: content-box !important;
          position: static !important;
          transform: none !important;
        }

        /* 3. High-Contrast Vector Fill Rulesets */
        .quill-tailwind-reset .ql-snow .ql-stroke {
          stroke: hsl(var(--foreground)) !important;
          stroke-width: 2px !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          fill: none !important;
        }
        .quill-tailwind-reset .ql-snow .ql-fill {
          fill: hsl(var(--foreground)) !important;
          stroke: none !important;
        }
        .quill-tailwind-reset .ql-snow .ql-picker {
          color: hsl(var(--foreground)) !important;
        }

        /* 4. Active Hover & Toggle Accent Changes */
        .quill-tailwind-reset .ql-snow.ql-toolbar button:hover .ql-stroke,
        .quill-tailwind-reset .ql-snow .ql-toolbar button:hover .ql-stroke {
          stroke: hsl(var(--primary)) !important;
        }
        .quill-tailwind-reset .ql-snow.ql-toolbar button:hover .ql-fill,
        .quill-tailwind-reset .ql-snow .ql-toolbar button:hover .ql-fill {
          fill: hsl(var(--primary)) !important;
        }
        .quill-tailwind-reset .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .quill-tailwind-reset .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary)) !important;
        }
        .quill-tailwind-reset .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .quill-tailwind-reset .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary)) !important;
        }
      `}</style>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Document Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="text-xs text-muted-foreground">
              Document Title
            </Label>
            <Input
              id="title"
              dir="auto"
              readOnly={readOnly}
              placeholder="مثال: عرض سعر المشروع — مايو 2025"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tags" className="text-xs text-muted-foreground">
              Tags
            </Label>
            <Input
              id="tags"
              dir="auto"
              readOnly={readOnly}
              placeholder="VIP مثال: عاجل، عميل"
              value={tagsText}
              onChange={(e) => handleTagsTextChange(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Comma-separated — used for search later
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Client Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="client-name"
              className="text-xs text-muted-foreground"
            >
              Name
            </Label>
            <Input
              id="client-name"
              dir="auto"
              readOnly={readOnly}
              placeholder="اسم العميل الكامل"
              value={formData.client.name}
              onChange={(e) => updateClientField("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="client-phone"
              className="text-xs text-muted-foreground"
            >
              Phone
            </Label>
            <Input
              id="client-phone"
              dir="auto"
              readOnly={readOnly}
              placeholder="+20 100 000 0000"
              type="tel"
              value={formData.client.phone}
              onChange={(e) => updateClientField("phone", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="client-email"
              className="text-xs text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="client-email"
              dir="auto"
              readOnly={readOnly}
              placeholder="client@email.com"
              type="email"
              value={formData.client.email}
              onChange={(e) => updateClientField("email", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Document Template Builder
          </h3>
          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1"
              onClick={handleAddPage}
            >
              <FilePlus className="w-3.5 h-3.5" />
              Add New Page
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6 pb-5 overflow-y-auto max-h-[500px] pr-1">
          {currentPages.map((blocks, pageIdx) => (
            <div
              key={pageIdx}
              className="flex flex-col gap-4 border-2 p-4 rounded-xl bg-muted/30 shadow-sm relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground bg-secondary px-2.5 py-1 rounded-md">
                  PAGE
                </span>
                {!readOnly && pageIdx > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemovePage(pageIdx)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-3 pl-2 border-l-2 border-dashed">
                {blocks.map((blockContent, blockIdx) => (
                  <div
                    key={blockIds[pageIdx]?.[blockIdx] ?? blockIdx}
                    className="flex flex-col justify-center items-center"
                  >
                    <div className="flex w-full flex-col gap-1.5 bg-card border p-3 rounded-lg relative">
                      <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs text-muted-foreground font-medium">
                          Content Block #{blockIdx + 1}
                        </Label>
                        {!readOnly && blocks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveBlock(pageIdx, blockIdx)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      <div className="w-full">
                        <style>
                          {`
                            .ql-editor.ql-blank::before { color: hsl(var(--foreground)) !important; opacity: 0.45 !important; font-style: normal !important; }
                            .ql-editor p,
                            .ql-editor li {
                              margin: 0 !important;
                              padding: 0 !important;
                            }
                          `}
                        </style>
                        <DynamicQuill
                          theme="snow"
                          readOnly={readOnly}
                          defaultValue={
                            blockContent.startsWith('{"ops"')
                              ? JSON.parse(blockContent)
                              : blockContent
                          }
                          modules={readOnly ? { toolbar: false } : quillModules}
                          formats={quillFormats}
                          placeholder="Type separate chunk description details…"
                          onChange={(
                            content: string,
                            delta: any,
                            source: string,
                            editor: any,
                          ) =>
                            handleBlockChange(
                              pageIdx,
                              blockIdx,
                              content,
                              delta,
                              source,
                              editor,
                            )
                          }
                        />
                      </div>
                    </div>
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        title="Add Content Block"
                        className="h-8 rounded-full text-xs gap-1 mt-2"
                        onClick={() => handleAddBlock(pageIdx, blockIdx)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
