import { ProjectForm } from "../ProjectForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Project | Dashboard",
};

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/manage-data">
           <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
           </Button>
        </Link>
        <h1 className="text-3xl font-bold font-stack">Create New Project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
