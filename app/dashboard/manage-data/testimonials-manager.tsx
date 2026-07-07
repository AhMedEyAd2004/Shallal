"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Trash,
  ChevronLeft,
  ChevronRight,
  LinkIcon,
} from "lucide-react";
import {
  updateTestimonialStatusAction,
  deleteTestimonialAction,
} from "./actions";
import Link from "next/link";

const PAGE_SIZE = 4;

export function TestimonialsManager({ testimonials }: { testimonials: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);

  const visible = testimonials.filter((t) => t.status === "approved");
  const hidden = testimonials.filter((t) => t.status !== "approved");

  const totalPages = Math.max(1, Math.ceil(testimonials.length / PAGE_SIZE));
  const paginated = testimonials.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  console.log(testimonials);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-stack">Testimonials</h2>
        <p className="text-sm text-muted-foreground">
          {visible.length} shown · {hidden.length} hidden
        </p>
      </div>

      <p className="text-sm text-muted-foreground -mt-2">
        Testimonials are created from within each project. Here you can control
        which ones appear on the home page.
      </p>

      <div className="space-y-3">
        {testimonials.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No testimonials yet. Add them from the Projects section above.
          </p>
        )}
        {Array.from({ length: PAGE_SIZE }).map((_, i) => {
          const t = paginated[i];

          // If no testimonial exists for this slot, render an invisible placeholder
          if (!t) {
            return (
              <div
                key={`placeholder-${i}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-transparent invisible"
                aria-hidden="true"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">&nbsp;</p>
                  </div>
                  <p className="text-sm line-clamp-2">&nbsp;</p>
                  <p className="text-[11px] mt-1">&nbsp;</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="ghost" className="opacity-0">
                    &nbsp;
                  </Button>
                </div>
              </div>
            );
          }

          const isVisible = t.status === "approved";

          return (
            <div
              key={t.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                isVisible
                  ? "bg-card border-border"
                  : "bg-muted/30 border-border/50 opacity-60"
              }`}
            >
              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{t.person_name}</p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground">
                    {t.person_role}
                  </p>
                </div>
                <p className="text-sm italic text-foreground/80 line-clamp-2">
                  &ldquo;{t.comment}&rdquo;
                </p>
                {t.links && t.links.length > 0 && (
                  <div className="flex gap-3">
                    {t.links.map((link: { url: string; title: string }) => (
                      <Link
                        key={link.url}
                        href={link.url}
                        className="text-sm flex gap-1 underline hover:text-muted-foreground transition-colors"
                      >
                        <LinkIcon className="size-4" />
                        {link.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {isVisible ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() =>
                        updateTestimonialStatusAction(t.id, "pending"),
                      )
                    }
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    Hide
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() =>
                        updateTestimonialStatusAction(t.id, "approved"),
                      )
                    }
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Show
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => deleteTestimonialAction(t.id))
                  }
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} &nbsp;·&nbsp; {testimonials.length}{" "}
            total
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={page === 1 || isPending}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="icon"
                variant={p === page ? "default" : "ghost"}
                className="h-8 w-8 text-sm"
                onClick={() => setPage(p)}
                disabled={isPending}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </Button>
            ))}

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={page === totalPages || isPending}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
