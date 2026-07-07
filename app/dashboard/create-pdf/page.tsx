import { createClient } from "@/lib/server";
import { RequestsUI } from "./requests-ui";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const supabase = await createClient();

  // Assuming table is contact_requests
  const { data: requests } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-stack">Customer Requests</h1>
        <p className="text-muted-foreground mt-2">
          View and manage contact form submissions.
        </p>
      </div>

      <RequestsUI requests={requests || []} />
    </div>
  );
}
