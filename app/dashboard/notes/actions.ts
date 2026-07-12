"use server";

import { createClient } from "@/lib/server";
import { updateTag } from "next/cache";

export async function addNoteAction(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const deadlineStr = formData.get("deadline") as string;
  const tagsStr = formData.get("tags") as string;

  const deadline = deadlineStr ? new Date(deadlineStr).toISOString() : null;

  const { error } = await supabase.from("notes").insert({
    title,
    description,
    priority: priority || "low",
    deadline,
  });

  if (error) return { error: error.message };

  updateTag("notes");
  return { success: true };
}

export async function updateNoteAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const deadlineStr = formData.get("deadline") as string;
  const tagsStr = formData.get("tags") as string;

  const deadline = deadlineStr ? new Date(deadlineStr).toISOString() : null;

  const { error } = await supabase
    .from("notes")
    .update({
      title,
      description,
      priority: priority || "low",
      deadline,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  updateTag("notes");
  return { success: true };
}

export async function deleteNoteAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) return { error: error.message };

  updateTag("notes");
  return { success: true };
}

export async function deleteExpiredNotesAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .delete()
    .not("deadline", "is", null)
    .lt("deadline", new Date().toISOString());

  if (error) {
    console.error("Error deleting expired notes:", error);
  }

  if (data && (data as any).length > 0) {
    updateTag("notes");
  }
}
