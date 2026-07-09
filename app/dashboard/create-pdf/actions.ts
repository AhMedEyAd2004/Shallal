"use server";

import { unstable_cache, revalidateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { ClientInfo, CompanySettings } from "./pdf";

// Stateless client for public cached data (no cookies) — same pattern used
// for getSocialLinks / getProjects / etc.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: { persistSession: false },
  },
);

export interface StoredPdfDocument {
  id: string;
  filepath: string; // UploadThing URL
  filename: string;
  title: string;
  client: ClientInfo;
  tags: string[];
  updated_at: string;
}

/**
 * Fetch previously generated PDF documents, most recently updated first.
 *
 * Assumes a `pdf_documents` table (see the SQL provided earlier) with:
 *   id, filepath, filename, title, client (jsonb), tags (text[]), updated_at
 *
 * We intentionally fetch the *full* list here and let the panel filter by
 * name/tags client-side — the table is small and this avoids adding a new
 * cache key per search query. Revalidate is short since new PDFs can land
 * at any time; `createPdfDocument` below also calls `revalidateTag` so a
 * fresh save shows up immediately instead of waiting on this window.
 */
export const getPdfDocuments = unstable_cache(
  async (): Promise<StoredPdfDocument[]> => {
    const { data, error } = await supabase
      .from("pdf_documents")
      .select("id, filepath, filename, title, client, tags, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching pdf_documents:", error);
      return [];
    }
    return data ?? [];
  },
  ["pdf-documents"],
  { tags: ["pdf_documents"], revalidate: 60 },
);

export interface CreatePdfDocumentInput {
  filepath: string; // UploadThing URL, already uploaded by the client
  filename: string;
  title: string;
  client: ClientInfo;
  tags: string[];
  companySnapshot: CompanySettings;
  pages: string[][];
}

/**
 * Insert a row for a PDF that has already been uploaded to UploadThing.
 * Called from the client right after `startUpload` resolves.
 */
export async function createPdfDocument(
  input: CreatePdfDocumentInput,
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabase.from("pdf_documents").insert({
    filepath: input.filepath,
    filename: input.filename,
    title: input.title,
    client: input.client,
    tags: input.tags,
    company_snapshot: input.companySnapshot,
    pages: input.pages,
  });

  if (error) {
    console.error("Error inserting pdf_documents row:", error);
    return { success: false, error: error.message };
  }

  revalidateTag("pdf_documents");
  return { success: true };
}
