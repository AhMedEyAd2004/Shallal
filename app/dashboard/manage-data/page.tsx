import { createClient } from "@/lib/server";
import { ManageDataUI } from "./manage-data-ui";

export const dynamic = "force-dynamic";

export default async function ManageDataPage() {
  const supabase = await createClient();

  const [
    { data: projects, count: projectsCount },
    { data: testimonials },
    { data: companies },
    { data: socialLinks },
    { data: allProjectsMinimal, error: projectsError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*, testimonials(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(0, 5),
    supabase
      .from("testimonials")
      .select("*, projects(links)")
      .order("created_at", { ascending: false }),
    supabase
      .from("service_provided")
      .select("*, projects(*)")
      .order("id", { ascending: true }),
    supabase.from("social_links").select("*").order("id", { ascending: true }),
    supabase.from("projects").select("id, title, images, country").order("created_at", { ascending: false }),
  ]);

  if (projectsError) {
    console.error("Error fetching allProjectsMinimal:", projectsError);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-stack">Manage Data</h1>
        <p className="text-muted-foreground mt-2">
          Add, edit, or remove content across the website.
        </p>
      </div>

      <ManageDataUI
        projects={projects || []}
        projectsCount={projectsCount || 0}
        testimonials={(testimonials || []).map((t) => ({
          ...t,
          links: t.projects?.links || [],
        }))}
        companies={companies || []}
        socialLinks={socialLinks || []}
        allProjectsMinimal={allProjectsMinimal || []}
      />
    </div>
  );
}
