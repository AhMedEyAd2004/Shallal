"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { login } from "./actions";

export default function Login() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [state, formAction, isPending] = useActionState(login, {});
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (message) toast.success(message);
  }, [message]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state.error]);

  useEffect(() => {
    const errors: Record<string, string> = {};

    if (touched.email) {
      if (!email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (touched.password) {
      if (!password) {
        errors.password = "Password is required";
      } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    setClientErrors(errors);
  }, [email, password, touched]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string) => {
    return (
      state.fieldErrors?.[field as keyof typeof state.fieldErrors] ||
      clientErrors[field]
    );
  };

  return (
    <section className="bg-background grid min-h-screen grid-rows-[auto_1fr] px-4 pt-24 pb-12">
      <div className="m-auto h-full w-full max-w-sm">
        <Link
          href={"/home"}
          className="flex my-4 rounded-2xl w-fit mx-auto overflow-hidden justify-center"
        >
          <Image src={"/logo.png"} alt="Logo" width={96} height={96} />
        </Link>
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
          <h1 className="font-stack text-4xl font-medium">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="mt-6 p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 ease-out fill-mode-both">
          <form action={formAction} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!getFieldError("email")}
                aria-describedby={
                  getFieldError("email") ? "email-error" : undefined
                }
                className={
                  getFieldError("email")
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : ""
                }
              />
              {getFieldError("email") && (
                <p
                  id="email-error"
                  className="text-destructive text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <AlertCircle className="size-3" />
                  {getFieldError("email")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!getFieldError("password")}
                  aria-describedby={
                    getFieldError("password") ? "password-error" : undefined
                  }
                  className={`pr-10 ${getFieldError("password") ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {getFieldError("password") && (
                <p
                  id="password-error"
                  className="text-destructive text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <AlertCircle className="size-3" />
                  {getFieldError("password")}
                </p>
              )}
            </div>

            <Button
              className="w-full transition-all active:scale-98 will-change-transform"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
