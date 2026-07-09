"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const parseAndCheckInvite = async () => {
      if (typeof window === "undefined") return;

      // 1. Manually extract parameters from the full window.location.href string
      const fullUrl = new URL(window.location.href.replace("#", "?"));
      const accessToken = fullUrl.searchParams.get("access_token");
      const refreshToken = fullUrl.searchParams.get("refresh_token");

      // 2. HARD SAFETY GATE: If no invitation hash variables are present, deny entry
      if (!accessToken || !refreshToken) {
        if (active) {
          router.replace("/log-in?error=unauthorized-access-attempt");
        }
        return;
      }

      // 3. SECURE RE-AUTHENTICATION: Force set the active session using the hash tokens
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      console.log(session);
      if (!active) return;

      if (sessionError || !session) {
        router.replace("/log-in?error=invalid-or-expired-token");
        return;
      }

      // 4. FIXED CASING METADATA PROTECTION: Match the exact 'needs_Password' casing from your logs
      const needsPassword = session.user.user_metadata?.needs_Password;

      if (needsPassword !== true) {
        // If false, they already made a password. Redirect them to data space.
        router.replace("/dashboard/manage-data");
        return;
      }

      // 5. APPROVAL
      setEmail(session.user.email ?? null);
      setAllowed(true);
      setChecking(false);
    };

    parseAndCheckInvite();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // 6. ATOMIC SAVE: Change password and turn needs_Password to false simultaneously
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
      data: {
        needs_Password: false, // Disables this route portal permanently for this user
      },
    });

    if (updateError) {
      toast.error(updateError.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/dashboard/manage-data");
  };

  if (checking || !allowed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Verifying profile setup permissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">Set up your password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set password for{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="w-full rounded-md border border-input bg-transparent pl-3 pr-16 py-2 text-sm outline-none focus:border-foreground"
            />
            <button
              type="button" // Critical to prevent this button from firing a form submit
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 select-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" strokeWidth={2} />
              ) : (
                <Eye className="size-4" strokeWidth={2} />
              )}
            </button>
          </div>
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
