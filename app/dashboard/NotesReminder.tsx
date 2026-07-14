"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteNoteAction } from "./notes/actions";

const REMINDER_STORAGE_KEY_HALFWAY = "shallal-deadline-reminders-shown-halfway";
const REMINDER_STORAGE_KEY_EXPIRED = "shallal-deadline-reminders-shown-expired";

function formatDeadline(dateString?: string) {
  if (!dateString) return "No deadline";
  return new Date(dateString).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function PriorityBadge({ priority }: { priority: string }) {
  let classes = "bg-muted text-muted-foreground border-border";
  if (priority === "high")
    classes =
      "bg-red-100 text-red-700 border-border dark:bg-red-950/60 dark:text-red-300 ";
  if (priority === "mid")
    classes =
      "bg-yellow-100 text-yellow-700 border-border dark:bg-yellow-950/60 dark:text-yellow-300 ";
  if (priority === "low")
    classes =
      "bg-green-100 text-green-700 border-border dark:bg-green-950/60 dark:text-green-300 ";

  return (
    <span
      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider border ${classes}`}
    >
      {priority}
    </span>
  );
}

function priorityToastClasses(priority: string) {
  switch (priority) {
    case "high":
      return "!bg-red-50 !border-red-300 !text-red-900 dark:!bg-red-950/90 dark:!border-red-800 dark:!text-red-200";
    case "mid":
      return "!bg-yellow-50 !border-yellow-300 !text-yellow-900 dark:!bg-yellow-950/90 dark:!border-yellow-800 dark:!text-yellow-200";
    case "low":
    default:
      return "!bg-emerald-50 !border-emerald-300 !text-emerald-900 dark:!bg-emerald-950/90 dark:!border-emerald-800 dark:!text-emerald-200";
  }
}

export function NotesReminder({ notes }: { notes: any[] }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let alreadyShownHalfway: string[] = [];
    let alreadyShownExpired: string[] = [];
    try {
      alreadyShownHalfway = JSON.parse(
        sessionStorage.getItem(REMINDER_STORAGE_KEY_HALFWAY) || "[]",
      );
      alreadyShownExpired = JSON.parse(
        sessionStorage.getItem(REMINDER_STORAGE_KEY_EXPIRED) || "[]",
      );
    } catch {
      alreadyShownHalfway = [];
      alreadyShownExpired = [];
    }

    const now = Date.now();
    const newlyShownHalfway: string[] = [];
    const newlyShownExpired: string[] = [];

    notes.forEach((note) => {
      if (!note.deadline || !note.created_at) return;

      const created = new Date(note.created_at).getTime();
      const deadline = new Date(note.deadline).getTime();
      if (Number.isNaN(created) || Number.isNaN(deadline)) return;

      if (deadline <= now) {
        if (alreadyShownExpired.includes(note.id)) return;
        // Note is expired! Show a distinctive toast, then delete it.
        newlyShownExpired.push(note.id);
        toast(
          <div className="flex justify-between items-start w-full gap-2">
            <span className="flex-1">{note.title}</span>
            <PriorityBadge priority={note.priority} />
          </div>,
          {
            description: `Deadline passed — ${formatDeadline(note.deadline)}`,
            icon: <Clock className="h-4 w-4" />,
            className: cn(
              "border font-medium [&>div]:w-full",
              "!bg-slate-900 !border-slate-700 !text-slate-100 dark:!bg-slate-950 dark:!border-slate-800 dark:!text-slate-200",
            ),
          }
        );

        // Fire deletion after a very brief delay to ensure toast rendering isn't blocked
        setTimeout(() => {
          deleteNoteAction(note.id);
        }, 500);
        return;
      }

      // If not expired, check if halfway passed
      const midpoint = created + (deadline - created) / 2;
      if (now < midpoint) return;

      if (alreadyShownHalfway.includes(note.id)) return;
      newlyShownHalfway.push(note.id);

      toast(
        <div className="flex justify-between items-start w-full gap-2">
          <span className="flex-1">{note.title}</span>
          <PriorityBadge priority={note.priority} />
        </div>,
        {
          description: `Deadline coming up — ${formatDeadline(note.deadline)}`,
          icon: <AlertCircle className="h-4 w-4" />,
          className: cn("border font-medium [&>div]:w-full", priorityToastClasses(note.priority)),
        }
      );
    });

    if (newlyShownHalfway.length) {
      try {
        sessionStorage.setItem(
          REMINDER_STORAGE_KEY_HALFWAY,
          JSON.stringify([...alreadyShownHalfway, ...newlyShownHalfway]),
        );
      } catch {
        // ignore
      }
    }

    if (newlyShownExpired.length) {
      try {
        sessionStorage.setItem(
          REMINDER_STORAGE_KEY_EXPIRED,
          JSON.stringify([...alreadyShownExpired, ...newlyShownExpired]),
        );
      } catch {
        // ignore
      }
    }
  }, [notes]);

  return null;
}
