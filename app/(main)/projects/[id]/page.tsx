import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { ImageCarousel } from "@/components/custom/ImageCarousel";
import { ProjectLinks } from "@/components/project-links";
import { FlagImage } from "@/components/custom/FlagImage";
import { getCountryLabel } from "@/lib/country-utils";
import { Button } from "@/components/ui/button";

// Stateless public client (no auth cookies needed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false } },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { data } = await supabase
    .from("projects")
    .select("title, description")
    .eq("id", (await params).id)
    .single();

  return {
    title: data?.title ?? "Project",
    description: data?.description ?? undefined,
  };
}

export default async function PublicProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("*, testimonials(*)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const images: string[] = Array.isArray(project.images) ? project.images : [];
  const tags: string[] = Array.isArray(project.tags) ? project.tags : [];
  const testimonials = (project.testimonials ?? []).filter(
    (t: any) => t.status === "approved",
  );

  return (
    <main className="min-h-screen text-foreground overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-10">
        {/* Back */}
        <Link href="/#projects">
          <Button
            variant="ghost"
            className="gap-2 -ml-3 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold font-stack" dir="auto">
          {project.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: carousel + testimonials */}
          <div className="space-y-8">
            {images.length > 0 && (
              <ImageCarousel images={images} alt={project.title} />
            )}

            {testimonials.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Testimonials</h2>
                <div className="space-y-3">
                  {testimonials.map((t: any) => (
                    <div
                      key={t.id}
                      className="bg-muted/40 border border-border rounded-xl p-4 space-y-1 text-sm"
                      dir="auto"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{t.person_name}</span>
                        {t.person_role && (
                          <span className="text-xs text-muted-foreground">
                            · {t.person_role}
                          </span>
                        )}
                      </div>
                      <p className="text-foreground/80 italic leading-relaxed">
                        &ldquo;{t.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: meta */}
          <div className="space-y-7">
            {/* Country */}
            {project.country && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Country
                </h2>
                <div className="flex items-center gap-2">
                  <FlagImage
                    countryCode={project.country}
                    countryName={project.country}
                    width={22}
                    height={22}
                    className="shrink-0"
                  />
                  <span className="text-sm">
                    {getCountryLabel(project.country)}
                  </span>
                </div>
              </div>
            )}

            {/* Year */}
            {project.created_at && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Year
                </h2>
                <p className="text-sm">
                  {new Date(project.created_at).getFullYear()}
                </p>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </h2>
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80"
                  dir="auto"
                >
                  {project.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                      dir="auto"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {project.links && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Links
                </h2>
                <ProjectLinks links={project.links} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
