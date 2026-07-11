"use server";

import { unstable_cache, updateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { ClientInfo, CompanySettings } from "./pdf";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: { persistSession: false },
  },
);

export interface StoredPdfDocument {
  id: string;
  title: string;
  client: ClientInfo;
  tags: string[];
  pages: string[][];
  company_snapshot: CompanySettings;
  updated_at: string;
}

/**
 * Fetch previously generated PDF documents, most recently updated first.
 *
 * We no longer upload/store a rendered PDF file anywhere (UploadThing) —
 * each row just holds the raw document JSON (title/client/tags/pages/company
 * snapshot). The PDF itself is re-rendered client-side on demand from that
 * JSON, both for the "View" preview and the download button, so there's
 * nothing to fetch here but data.
 */
export const getPdfDocuments = unstable_cache(
  async (): Promise<StoredPdfDocument[]> => {
    const { data, error } = await supabase
      .from("pdf_documents")
      .select("id, title, client, tags, updated_at, pages, company_snapshot")
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
  title: string;
  client: ClientInfo;
  tags: string[];
  companySnapshot: CompanySettings;
  pages: string[][];
}

/**
 * Insert a row for a document. No file upload step anymore — the PDF is
 * derived from this JSON every time it needs to be shown or downloaded.
 */
export async function createPdfDocument(
  input: CreatePdfDocumentInput,
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabase.from("pdf_documents").insert({
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

  updateTag("pdf_documents");
  return { success: true };
}

export async function deletePdfDocument(id: string) {
  const { error } = await supabase.from("pdf_documents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting pdf_document:", error);
    return { success: false, error: error.message };
  }

  updateTag("pdf_documents");
  return { success: true };
}
