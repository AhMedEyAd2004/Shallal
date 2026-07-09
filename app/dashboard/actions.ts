"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/log-in");
}

export async function inviteUserByEmailAction(email: string) {
  if (!email || !email.trim()) {
    return { error: "Email is required" };
  }

  // inviteUserByEmail requires the service_role key (admin privileges)
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/set-password`,
    data: {
      needs_Password: true,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
