import { createClient } from "@/lib/server";
import { NotesManager } from "./notes-manager";
import { redirect } from "next/navigation";
import { deleteExpiredNotesAction } from "./actions";

export const metadata = {
  title: "Notes - Shallal Admin",
};

export default async function NotesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching notes:", error);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <NotesManager notes={notes || []} />
    </div>
  );
}
