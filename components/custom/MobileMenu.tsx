"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import usePathname hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Menu, LogOut, UserPlus, Mail, Loader2 } from "lucide-react";
import {
  signOutAction,
  inviteUserByEmailAction,
} from "@/app/dashboard/actions";

type MobileMenuProps = {
  email: string;
  createdAt?: string;
};

export function MobileMenu({ email, createdAt }: MobileMenuProps) {
  const pathname = usePathname(); // 2. Initialize current pathname string
  const [isPending, startTransition] = useTransition();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteResult, setInviteResult] = useState<{
    error?: string;
    success?: boolean;
  } | null>(null);

  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  // 3. Centralized navigation schema including Home
  const navItems = [
    { label: "Home", href: "/home" },
    { label: "Manage Data", href: "/dashboard/manage-data" },
    { label: "Create PDF", href: "/dashboard/create-pdf" },
  ];

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      await signOutAction();
    });
  };

  const handleInvite = () => {
    setInviteResult(null);
    startTransition(async () => {
      const result = await inviteUserByEmailAction(inviteEmail.trim());
      setInviteResult(result);
      if (result.success) {
        setInviteEmail("");
        setTimeout(() => {
          setInviteOpen(false);
          setInviteResult(null);
        }, 2000);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 z-100">
          {/* User info */}
          <DropdownMenuLabel className="flex items-center gap-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{email}</p>
              {createdAt && (
                <p className="text-[11px] text-muted-foreground font-normal">
                  Joined{" "}
                  {new Date(createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Navigation */}
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <DropdownMenuItem
                key={item.href}
                asChild={!isActive} // Only act as a functional Link block if not active
                disabled={isActive}
                className={`w-full text-sm font-normal py-2 ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium pointer-events-none select-none focus:bg-primary/10 focus:text-primary"
                    : "cursor-pointer"
                }`}
              >
                {isActive ? (
                  // Non-clickable static visual layout branch
                  <span>{item.label}</span>
                ) : (
                  // Clickable Router Anchor Link branch
                  <Link href={item.href}>{item.label}</Link>
                )}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          {/* Account actions */}
          <DropdownMenuItem
            onClick={() => setInviteOpen(true)}
            className="gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Invite User
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isPending}
            variant="destructive"
            className="gap-2 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isPending ? "Signing out…" : "Sign Out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Invite User
            </DialogTitle>
            <DialogDescription>
              Send an email invite to grant dashboard access to another user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Input
              type="email"
              placeholder="user@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inviteEmail.trim()) {
                  e.preventDefault();
                  handleInvite();
                }
              }}
            />
            {inviteResult?.error && (
              <p className="text-sm text-destructive">{inviteResult.error}</p>
            )}
            {inviteResult?.success && (
              <p className="text-sm text-green-600 dark:text-green-400">
                ✓ Invitation sent successfully!
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setInviteOpen(false);
                setInviteResult(null);
                setInviteEmail("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={isPending || !inviteEmail.trim()}
            >
              {isPending ? "Sending…" : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
