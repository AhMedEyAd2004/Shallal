import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import { ProjectForm } from "../ProjectForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

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
      ? `Edit Project: ${project.title} | Dashboard`
      : "Edit Project | Dashboard",
  };
}

export default async function EditProjectPage({
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/manage-data">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold font-stack">Edit Project</h1>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
