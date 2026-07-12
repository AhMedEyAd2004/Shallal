"use client";

import { CountrySelect } from "@/components/custom/CountrySelect";
import { ImageCarousel } from "@/components/custom/ImageCarousel";
import ProjectCard from "@/components/custom/Project-card";
import { ResponsiveDrawer } from "@/components/custom/responsiveDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { Eye, ImageIcon, Pen, Plus, Search, Trash, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  addProjectAction,
  deleteProjectAction,
  deleteTestimonialAction,
  deleteUploadThingFilesAction,
  updateProjectAction,
} from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LINK_CONFIG } from "../../../components/project-links";

function TestimonialsList({
  testimonials,
  handleAction,
  startTransition,
}: any) {
  const [expanded, setExpanded] = useState(false);
  const visibleTestimonials = expanded
    ? testimonials
    : testimonials?.slice(0, 2);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="space-y-3 mt-4">
      {visibleTestimonials.map((t: any) => (
        <div
          key={t.id}
          className="bg-muted p-3 rounded-lg text-sm relative group"
          dir="auto"
        >
          <span className="font-semibold" dir="auto">{t.person_name}</span>: &ldquo;
          {t.comment}&rdquo;
          <div className="mt-2 flex gap-2 items-center">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
            >
              {t.status}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-destructive px-2 py-0 hover:bg-destructive/10"
              onClick={() =>
                startTransition(() =>
                  handleAction(() => deleteTestimonialAction(t.id)),
                )
              }
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      {!expanded && testimonials.length > 2 && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full text-xs"
          onClick={() => setExpanded(true)}
        >
          View More ({testimonials.length - 2})
        </Button>
      )}
      {expanded && testimonials.length > 2 && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full text-xs"
          onClick={() => setExpanded(false)}
        >
          Show Less
        </Button>
      )}
    </div>
  );
}

function ImageManager({ initialImages = [] }: { initialImages?: string[] }) {
  const [existing, setExisting] = useState<
    { url: string; name: string; size: number }[]
  >(initialImages.map((u, i) => ({ url: u, name: `Image ${i + 1}`, size: 0 })));
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        setExisting((prev) => [
          ...prev,
          ...res.map((r) => ({ url: r.url, name: r.name, size: r.size })),
        ]);
      }
      setUploadProgress(0);
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadProgress(0);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    onDrop: async (accepted) => {
      if (accepted.length > 0) {
        await startUpload(accepted);
      }
    },
  });

  const removeExisting = async (url: string) => {
    setPendingDeletes((prev) => [...prev, url]);
    try {
      await deleteUploadThingFilesAction([url]);
    } catch (e) {}
    setExisting((prev) => prev.filter((u) => u.url !== url));
    setPendingDeletes((prev) => prev.filter((u) => u !== url));
  };

  const removeAll = async () => {
    setIsDeletingAll(true);
    const urls = existing.map((e) => e.url);
    try {
      await deleteUploadThingFilesAction(urls);
    } catch (e) {}
    setExisting([]);
    setIsDeletingAll(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4 border p-4 rounded-md bg-muted/20">
      <div className="flex justify-between items-center">
        <Label>Images Upload</Label>
        {existing.length > 0 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-7 text-xs"
            onClick={removeAll}
            disabled={isDeletingAll || isUploading}
          >
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </Button>
        )}
      </div>

      <p className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 p-2 rounded">
        💡 <strong>Note:</strong> The first image uploaded will be used as the
        cover image of the project (preferable to be the company image).
      </p>

      {/* Hidden input to pass all images to the server action */}
      <input
        type="hidden"
        name="images"
        value={JSON.stringify(existing.map((e) => e.url))}
      />

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
          {isUploading ? "Uploading..." : "Click or drag images here to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG, WEBP up to 4MB
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

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {existing.map((file, idx) => (
          <div
            key={`ex-${idx}`}
            className={`flex items-center justify-between bg-background border p-2 rounded-lg transition-opacity ${pendingDeletes.includes(file.url) ? "opacity-50" : "opacity-100"}`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={file.url}
                alt="existing"
                className="h-10 w-10 object-cover rounded"
              />
              <div className="truncate">
                <p className="text-sm font-medium truncate" dir="auto">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.size ? formatSize(file.size) : "Uploaded"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                removeExisting(file.url);
              }}
              disabled={pendingDeletes.includes(file.url) || isDeletingAll}
              className="text-destructive h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinksManager({ initialLinks = [] }: { initialLinks?: any }) {
  let initialList: { title: string; url: string }[] = [];
  if (Array.isArray(initialLinks)) {
    initialList = initialLinks
      .filter((l) => l && typeof l === "object" && ("title" in l || "key" in l))
      .map((l) => ({
        title: (l.title || l.key || "").toString(),
        url: (l.url || l.value || "").toString(),
      }));
  } else if (initialLinks && typeof initialLinks === "object") {
    initialList = Object.entries(initialLinks).map(([k, v]) => ({
      title: k,
      url: String(v),
    }));
  }

  const [links, setLinks] = useState(
    initialList.length > 0
      ? initialList
      : [{ title: undefined as string | undefined, url: "" }],
  );

  const updateLink = (idx: number, field: "title" | "url", val: string) => {
    const newLinks = [...links];
    newLinks[idx][field] = val;
    setLinks(newLinks);
  };

  const addLink = () => setLinks([...links, { title: "", url: "" }]);
  const removeLink = (idx: number) =>
    setLinks(links.filter((_, i) => i !== idx));

  const validLinks = links.filter((l) => l.title?.trim() && l.url.trim());

  return (
    <div className="space-y-3">
      <Label>Links</Label>
      <input type="hidden" name="links" value={JSON.stringify(validLinks)} />

      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Select
              value={link.title || undefined}
              onValueChange={(value) => updateLink(idx, "title", value)}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>

              <SelectContent className="z-9999">
                {Object.entries(LINK_CONFIG).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="URL (e.g. https://...)"
              value={link.url}
              onChange={(e) => updateLink(idx, "url", e.target.value)}
              className="flex-1"
              dir="auto"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeLink(idx)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={addLink}
        className="text-xs"
      >
        <Plus className="h-3 w-3 mr-1" /> Add Link
      </Button>
    </div>
  );
}

const projectFormFields = (p?: any) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input defaultValue={p?.title || ""} name="title" required dir="auto" />
      </div>
      <div className="space-y-2">
        <Label>Country</Label>
        <CountrySelect name="country" defaultValue={p?.country || ""} />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Description (Supports long text)</Label>
      <Textarea
        defaultValue={p?.description || ""}
        name="description"
        rows={6}
        dir="auto"
      />
    </div>

    <div className="space-y-2">
      <Label>Tags (Comma separated)</Label>
      <Input
        defaultValue={(p?.tags || []).join(", ")}
        name="tags"
        placeholder="e.g. web, react, frontend"
        dir="auto"
      />
    </div>

    <ImageManager initialImages={p?.images || []} />

    <LinksManager initialLinks={p?.links || {}} />
  </>
);

import Link from "next/link";
import { getPaginatedProjectsAction } from "./actions";
import { useEffect, useCallback } from "react";

export { TestimonialsList, ImageManager, LinksManager, projectFormFields };

export function ProjectsManager({ projects: initialProjects, totalCount }: { projects: any[], totalCount: number }) {
  const PAGE_SIZE = 6;
  const [items, setItems] = useState<any[]>(initialProjects || []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalCount > items.length);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await getPaginatedProjectsAction(1, PAGE_SIZE, search);
        if (res.data) {
          setItems(res.data);
          setPage(1);
          setHasMore((res.count || 0) > res.data.length);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const res = await getPaginatedProjectsAction(nextPage, PAGE_SIZE, search);
      if (res.data) {
        setItems(prev => [...prev, ...res.data!]);
        setPage(nextPage);
        setHasMore((res.count || 0) > items.length + res.data.length);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    actionFn: () => Promise<any>,
    successText?: string,
  ) => {
    const result = await actionFn();
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success || result === undefined) {
      if (successText) toast.success(successText);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-stack">Projects</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              dir="auto"
            />
          </div>
          <Link href="/dashboard/manage-data/projects/new">
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" /> Add Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => {
          const mainImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "/logo.png";
          return (
            <div key={p.id} className="h-[450px]">
              <ProjectCard
                href={`/projects/${p.id}`}
                title={p.title}
                description={p.description}
                year={p.created_at ? new Date(p.created_at).getFullYear() : ""}
                country={p.country}
                tags={p.tags || []}
                links={p.links}
                testimonials={p.testimonials}
                image={mainImage}
                images={p.images}
                dashboardActions={
                  <div className="flex gap-2">
                    <Link href={`/dashboard/manage-data/projects/${p.id}/view`} onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full opacity-100 bg-white shadow-md hover:bg-gray-100 text-black" title="View Project">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/manage-data/projects/${p.id}`} onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full opacity-100 bg-white shadow-md hover:bg-gray-100 text-black" title="Edit Project">
                        <Pen className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-full opacity-100 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        startTransition(() => {
                           handleAction(() => deleteProjectAction(p.id), "Project deleted");
                           setItems(prev => prev.filter(item => item.id !== p.id));
                        });
                      }}
                      title="Delete Project"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
            className="rounded-full px-6"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
