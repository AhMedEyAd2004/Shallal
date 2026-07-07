"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function SetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    // The Supabase browser client will automatically parse the #access_token
    // from the URL hash and establish the session behind the scenes.
    // We just need to wait for it to be ready.
    const checkSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!active) return;

      if (sessionError || !session) {
        // If there's no session, they either didn't come from a valid invite link
        // or the link expired.
        router.replace("/log-in?error=invalid-or-expired-invite");
        return;
      }

      setAllowed(true);
      setChecking(false);
    };

    // Sometimes the hash parsing takes a few milliseconds, so listening to auth state
    // change is the most reliable way to catch the new session.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && active) {
          setAllowed(true);
          setChecking(false);
          // Force a hard reload to completely bypass Next.js aggressive Router Cache
          // and guarantee the server re-renders the navbar with the brand new cookies.
          if (typeof window !== "undefined" && !window.location.hash) {
            router.refresh();
          }
        }
      },
    );

    checkSession().then(() => {
      if (active) router.refresh();
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: {
        needs_password: false,
      },
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/manage-data");
  };

  if (checking || !allowed) {
    return (
      <div className="font-stack min-h-[80vh] flex items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying invite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-stack min-h-[80vh] flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">Set up your password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a new password to activate your account.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive animate-in fade-in duration-200">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={loading || password.length < 8}
          className="w-full rounded-md bg-foreground text-background py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Set password"}
        </button>
      </form>
    </div>
  );
}
