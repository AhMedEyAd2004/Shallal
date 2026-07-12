"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import {
  addProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { projectFormFields, TestimonialsList } from "../projects-manager";
import { ImageCarousel } from "@/components/custom/ImageCarousel";
import { ProjectLinks } from "@/components/project-links";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, X } from "lucide-react";

function NewTestimonialsManager() {
  const [items, setItems] = useState([{ name: "", role: "", comment: "" }]);

  const updateItem = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems as any)[idx][field] = value;
    setItems(newItems);
  };

  const addItem = () =>
    setItems([...items, { name: "", role: "", comment: "" }]);
  const removeItem = (idx: number) =>
    setItems(items.filter((_, i) => i !== idx));

  const validItems = items.filter((t) => t.name.trim() && t.comment.trim());

  return (
    <div className="space-y-4 border-t pt-6 mt-6">
      <h4 className="font-semibold text-lg">Add New Testimonials</h4>
      <input
        type="hidden"
        name="new_testimonials"
        value={JSON.stringify(validItems)}
      />

      {items.map((t, idx) => (
        <div
          key={idx}
          className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border relative"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(idx)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="grid grid-cols-2 gap-3 pr-8">
            <Input
              placeholder="Person Name"
              className="h-8 text-sm"
              dir="auto"
              value={t.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
            />
            <Input
              placeholder="Role (e.g. CEO)"
              className="h-8 text-sm"
              dir="auto"
              value={t.role}
              onChange={(e) => updateItem(idx, "role", e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Testimonial comment..."
            rows={2}
            className="text-sm min-h-[60px]"
            dir="auto"
            value={t.comment}
            onChange={(e) => updateItem(idx, "comment", e.target.value)}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={addItem}
        className="text-xs"
      >
        <Plus className="h-3 w-3 mr-1" /> Add Another Testimonial
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Valid testimonials will be saved when you submit the project.
      </p>
    </div>
  );
}

export function ProjectForm({ project }: { project?: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = async (
    actionFn: () => Promise<any>,
    successText: string,
  ) => {
    const result = await actionFn();
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success || result === undefined) {
      toast.success(successText);
      router.push("/dashboard/manage-data");
      router.refresh();
    }
  };

  const isEdit = !!project;

  return (
    <form
      action={(formData) =>
        startTransition(() => {
          if (isEdit) {
            handleAction(
              () => updateProjectAction(project.id, formData),
              "Project updated!",
            );
          } else {
            handleAction(() => addProjectAction(formData), "Project created!");
          }
        })
      }
      className={`pt-4 pb-8 ${isEdit ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-4"}`}
    >
      {isEdit && (
        <div className="space-y-6">
          {project.images && project.images.length > 0 && (
            <ImageCarousel images={project.images} alt={project.title} />
          )}

          {project.links && (
            <div className="space-y-4 border-t pt-6 mt-6">
              <h4 className="font-semibold text-lg">Existing Links</h4>
              <ProjectLinks links={project.links} />
            </div>
          )}

          <div className="space-y-4 border-t pt-6 mt-6">
            <h4 className="font-semibold text-lg">Existing Testimonials</h4>

            <div className="space-y-2">
              {(!project.testimonials || project.testimonials.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No testimonials yet.
                </p>
              )}
              <TestimonialsList
                testimonials={project.testimonials}
                handleAction={async (fn: any) => {
                  const r = await fn();
                  if (r?.error) toast.error(r.error);
                  else {
                    toast.success("Testimonial removed");
                    router.refresh();
                  }
                }}
                startTransition={startTransition}
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {isEdit && (
          <div className="space-y-4 mb-4">
            <h3 className="text-3xl font-bold font-stack" dir="auto">
              {project.title}
            </h3>
            <div className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Created at:</span>{" "}
              {new Date(project.created_at).toLocaleString()}
            </div>
          </div>
        )}

        <div className="space-y-4">{projectFormFields(project)}</div>

        <NewTestimonialsManager />

        <div className="flex justify-between items-center pt-6 border-t mt-8">
          {isEdit ? (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  startTransition(() =>
                    handleAction(
                      () => deleteProjectAction(project.id),
                      "Project deleted!",
                    ),
                  )
                }
              >
                Delete Project
              </Button>
              <Button type="submit" disabled={isPending} className="px-8">
                Save Changes
              </Button>
            </>
          ) : (
            <Button type="submit" disabled={isPending} className="w-full">
              Create Project
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
