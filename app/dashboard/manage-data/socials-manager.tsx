"use client";

import { useTransition, useOptimistic, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  addSocialLinkAction,
  deleteSocialLinkAction,
  updateSocialLinkAction,
} from "./actions";
import { SOCIAL_PLATFORMS } from "@/components/social-links";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESERVED_PLATFORMS = ["hero-btn-whatsapp", "hero-btn-call"];

export function SocialsManager({ socialLinks }: { socialLinks: any[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [platform, setPlatform] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [optimisticLinks, addOptimisticLink] = useOptimistic(
    socialLinks,
    (state, newLink: any) => {
      if (newLink.action === "delete") {
        return state.filter((link) => link.id !== newLink.id);
      }
      if (newLink.action === "edit") {
        return state.map((link) =>
          link.id === newLink.id
            ? { ...link, url_or_number: newLink.url_or_number }
            : link,
        );
      }
      return [newLink, ...state];
    },
  );

  const startEditing = (link: any) => {
    setEditingId(link.id);
    setEditValue(link.url_or_number);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = (id: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;

    startTransition(() => {
      addOptimisticLink({ id, action: "edit", url_or_number: trimmed });
      updateSocialLinkAction(id, trimmed);
    });
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-stack">Social Media Links</h2>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 border border-border rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-lg mb-4">Add Link</h3>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            <span className="font-semibold text-foreground">Note:</span>{" "}
            <span className="font-bold italic">
              &quot;hero-btn-whatsapp&quot;
            </span>{" "}
            and{" "}
            <span className="font-bold italic">&quot;hero-btn-call&quot;</span>{" "}
            are reserved platform names used elsewhere on the site. They
            can&apos;t be deleted, but you can edit their value anytime.
          </p>

          <form
            ref={formRef}
            action={async (formData) => {
              addOptimisticLink({
                id: Math.random().toString(), // Temp ID
                platform: formData.get("platform"),
                url_or_number: formData.get("url"),
              });
              await addSocialLinkAction(formData);
              formRef.current?.reset();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Platform</Label>

              <Select value={platform} onValueChange={setPlatform} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>

                <SelectContent>
                  {SOCIAL_PLATFORMS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Hidden input so the server action receives `platform` */}
              <input type="hidden" name="platform" value={platform} />
            </div>
            <div className="space-y-2">
              <Label>URL or Phone</Label>
              <Input
                name="url"
                type="text"
                required
                placeholder="https://... or +123456789"
              />
            </div>
            <Button className="w-full">Save Link</Button>
          </form>
        </div>

        <div className="w-full md:w-2/3 space-y-3 max-h-[400px] overflow-y-auto">
          {optimisticLinks.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No social links configured.
            </p>
          )}
          {optimisticLinks.map((s: any) => {
            const isReserved = RESERVED_PLATFORMS.includes(
              s.platform?.toLowerCase?.(),
            );
            const isEditing = editingId === s.id;

            return (
              <div
                key={s.id}
                className={`flex justify-between items-center bg-muted/50 p-4 rounded-xl border border-border/50 gap-4 ${s.action === "delete" ? "opacity-50" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold capitalize text-base flex items-center gap-2">
                    {s.platform}
                    {isReserved && (
                      <span className="text-[10px] font-bold bg-orange-300 text-orange-800 uppercase tracking-wide border border-border/50 rounded-full px-2 py-0.5">
                        Reserved
                      </span>
                    )}
                  </p>

                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(s.id);
                          if (e.key === "Escape") cancelEditing();
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                  ) : (
                    <a
                      href={s.url_or_number}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-500 hover:underline break-all"
                    >
                      {s.url_or_number}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(s.id)}>
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(s)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isReserved}
                        title={
                          isReserved
                            ? "This platform is reserved and can't be deleted"
                            : undefined
                        }
                        onClick={() => {
                          startTransition(() => {
                            addOptimisticLink({ id: s.id, action: "delete" });
                            deleteSocialLinkAction(s.id);
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
