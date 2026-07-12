import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { Metadata } from "next";
import { ImageCarousel } from "@/components/custom/ImageCarousel";
import { ProjectLinks } from "@/components/project-links";
import { FlagImage } from "@/components/custom/FlagImage";
import { getCountryLabel } from "@/lib/country-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("title")
    .eq("id", (await params).id)
    .single();

  return {
    title: project
      ? `${project.title} | Dashboard`
      : "View Project | Dashboard",
  };
}

export default async function ViewProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*, testimonials(*)")
    .eq("id", (await params).id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/manage-data">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold font-stack" dir="auto">
            {project.title}
          </h1>
        </div>
        <Link href={`/dashboard/manage-data/projects/${project.id}`}>
          <Button className="gap-2">
            <Pencil className="w-4 h-4" />
            Edit Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Left: media + testimonials */}
        <div className="space-y-6">
          {project.images && project.images.length > 0 && (
            <ImageCarousel images={project.images} alt={project.title} />
          )}

          {/* Testimonials */}
          <div className="space-y-3 border rounded-xl p-5">
            <h3 className="font-semibold text-lg">
              Testimonials ({project.testimonials?.length ?? 0})
            </h3>
            {!project.testimonials || project.testimonials.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No testimonials yet.
              </p>
            ) : (
              project.testimonials.map((t: any) => (
                <div
                  key={t.id}
                  className="bg-muted/40 p-3 rounded-lg text-sm space-y-1"
                  dir="auto"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.person_name}</span>
                    {t.person_role && (
                      <span className="text-xs text-muted-foreground">
                        · {t.person_role}
                      </span>
                    )}
                    <span
                      className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                        t.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-foreground/80 italic">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: details */}
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Created at:</span>{" "}
            {new Date(project.created_at).toLocaleString()}
          </div>

          {/* Description */}
          {project.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p
                className="text-sm text-muted-foreground whitespace-pre-wrap"
                dir="auto"
              >
                {project.description}
              </p>
            </div>
          )}

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
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {project.links && (
            <div className="space-y-2">
              <h3 className="font-semibold">Links</h3>
              <ProjectLinks links={project.links} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
