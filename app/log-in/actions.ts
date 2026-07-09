"use server";

import { createClient } from "@/lib/server";

export type LoginState = {
  error?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  // Server-side validation
  const fieldErrors: LoginState["fieldErrors"] = {};

  if (!email || !email.trim()) {
    fieldErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address";
  }

  if (!password) {
    fieldErrors.password = "Password is required";
  } else if (password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: undefined };
}
