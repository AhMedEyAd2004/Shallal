"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { LogOut, Mail, UserPlus, ChevronDown, Loader2 } from "lucide-react";
import {
  signOutAction,
  inviteUserByEmailAction,
} from "@/app/dashboard/actions";

type UserProfileDropdownProps = {
  email: string;
  createdAt?: string;
};

export function UserProfileDropdown({
  email,
  createdAt,
}: UserProfileDropdownProps) {
  // Split into independent transition states
  const [isLoggingOut, startSignOutTransition] = useTransition();
  const [isInviting, startInviteTransition] = useTransition();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteResult, setInviteResult] = useState<{
    error?: string;
    success?: boolean;
  } | null>(null);

  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      await signOutAction();
    });
  };

  const handleInvite = () => {
    setInviteResult(null);
    startInviteTransition(async () => {
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
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full px-2 py-1 h-auto hover:bg-muted/80 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </div>
            <span className="hidden lg:inline text-sm font-medium text-foreground max-w-[140px] truncate">
              {email}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:inline" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 z-[99]">
          {/* User info header */}
          <DropdownMenuLabel className="flex flex-col gap-1 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{email}</p>
                {createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Joined{" "}
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Invite user */}
          <DropdownMenuItem
            onClick={() => setInviteOpen(true)}
            disabled={isLoggingOut}
            className="gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Invite User by Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Sign out */}
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isLoggingOut}
            variant="destructive"
            className="gap-2 cursor-pointer flex items-center"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin text-destructive-foreground" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>{isLoggingOut ? "Signing out…" : "Sign Out"}</span>
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
              disabled={isInviting}
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
              disabled={isInviting}
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
              disabled={isInviting || !inviteEmail.trim()}
            >
              {isInviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Invite"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
