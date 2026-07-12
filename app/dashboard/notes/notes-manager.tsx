"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Trash,
  Pen,
  Eye,
  CalendarIcon,
  AlertCircle,
} from "lucide-react";
import { addNoteAction, updateNoteAction, deleteNoteAction } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DrawerClose } from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ResponsiveDrawer } from "@/components/custom/responsiveDrawer";

const REMINDER_STORAGE_KEY = "shallal-deadline-reminders-shown";

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

function priorityGradient(priority: string) {
  switch (priority) {
    case "high":
      return "from-red-500/35 via-red-500/12 to-transparent dark:from-red-500/30 dark:via-red-500/10";
    case "mid":
      return "from-amber-500/60 via-amber-500/25 to-transparent dark:from-amber-500/50 dark:via-amber-500/20";
    case "low":
      return "from-emerald-500/60 via-emerald-500/25 to-transparent dark:from-emerald-500/50 dark:via-emerald-500/20";
    default:
      return "from-muted-foreground/15 via-transparent to-transparent";
  }
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

/**
 * Fires a themed toast for any note that's past the halfway point
 * between its creation and its deadline. Requires `created_at` and
 * `deadline` on the note. Only shows a given note's reminder once per
 * browser session so it doesn't nag on every remount/navigation.
 */
function showDeadlineReminders(notes: any[]) {
  if (typeof window === "undefined") return;

  let alreadyShown: string[] = [];
  try {
    alreadyShown = JSON.parse(
      sessionStorage.getItem(REMINDER_STORAGE_KEY) || "[]",
    );
  } catch {
    alreadyShown = [];
  }

  const now = Date.now();
  const newlyShown: string[] = [];

  notes.forEach((note) => {
    if (!note.deadline || !note.created_at) return;
    if (alreadyShown.includes(note.id)) return;

    const created = new Date(note.created_at).getTime();
    const deadline = new Date(note.deadline).getTime();
    if (Number.isNaN(created) || Number.isNaN(deadline)) return;
    if (deadline <= now) return; // expired notes get swept server-side

    const midpoint = created + (deadline - created) / 2;
    if (now < midpoint) return;

    newlyShown.push(note.id);

    toast(note.title, {
      description: `Deadline coming up — ${formatDeadline(note.deadline)}`,
      icon: <AlertCircle className="h-4 w-4" />,
      className: cn("border font-medium", priorityToastClasses(note.priority)),
    });
  });

  if (newlyShown.length) {
    try {
      sessionStorage.setItem(
        REMINDER_STORAGE_KEY,
        JSON.stringify([...alreadyShown, ...newlyShown]),
      );
    } catch {
      // sessionStorage unavailable (private mode, etc.) — safe to ignore
    }
  }
}

function NoteForm({
  note,
  onSubmitAction,
  isPending,
  closeRef,
}: {
  note?: any;
  onSubmitAction: (formData: FormData) => void;
  isPending: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [date, setDate] = useState<Date | undefined>(
    note?.deadline ? new Date(note.deadline) : undefined,
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <form action={onSubmitAction} className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          defaultValue={note?.title || ""}
          name="title"
          required
          dir="auto"
          placeholder="Note Title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          defaultValue={note?.description || ""}
          name="description"
          rows={5}
          dir="auto"
          placeholder="Write your note details here..."
          className="max-h-48 overflow-y-auto resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 flex flex-col justify-end">
          <Label>Priority</Label>
          <Select name="priority" defaultValue={note?.priority || "low"}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="mid">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex flex-col justify-end">
          <Label>Deadline</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  formatDeadline(date.toISOString())
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[10000]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          <input
            type="hidden"
            name="deadline"
            value={date ? date.toISOString() : ""}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t mt-8">
        <Button type="submit" disabled={isPending} className="px-8">
          {note ? "Save Changes" : "Create Note"}
        </Button>
      </div>
      <DrawerClose asChild>
        <button
          ref={closeRef}
          type="button"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </DrawerClose>
    </form>
  );
}

function NoteView({ note }: { note: any }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Title</Label>
        <p className="text-base font-semibold whitespace-pre-wrap" dir="auto">
          {note.title}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <p
          className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto"
          dir="auto"
        >
          {note.description || "No description provided."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
        <div className="space-y-2 pt-4">
          <Label className="text-xs text-muted-foreground">Priority</Label>
          <div>
            <PriorityBadge priority={note.priority} />
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Label className="text-xs text-muted-foreground">Deadline</Label>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{formatDeadline(note.deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotesManager({ notes }: { notes: any[] }) {
  const [search, setSearch] = useState("");
  const [isPending, setIsPending] = useState(false);
  const createCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    showDeadlineReminders(notes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredNotes = notes.filter((n) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const matchTitle = n.title?.toLowerCase().includes(term);
    const matchDesc = n.description?.toLowerCase().includes(term);
    return matchTitle || matchDesc;
  });

  const handleAction = async (
    actionFn: () => Promise<any>,
    successText?: string,
    closeRef?: React.RefObject<HTMLButtonElement | null>,
  ) => {
    const result = await actionFn();
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      if (successText) toast.success(successText);
      closeRef?.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-stack">Notes</h2>

        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              dir="auto"
            />
          </div>

          <ResponsiveDrawer
            title="Create New Note"
            content={
              <NoteForm
                onSubmitAction={(formData) =>
                  (async () => {
                    setIsPending(true);
                    await handleAction(
                      () => addNoteAction(formData),
                      "Note created successfully!",
                      createCloseRef,
                    );
                    setIsPending(false);
                  })()
                }
                isPending={isPending}
                closeRef={createCloseRef}
              />
            }
          >
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" /> Add Note
            </Button>
          </ResponsiveDrawer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-10 text-center text-sm text-muted-foreground bg-muted/20 border border-dashed rounded-xl">
            {search
              ? `No notes matching "${search}" found.`
              : "No notes yet. Click 'Add Note' to create one."}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} handleAction={handleAction} />
          ))
        )}
      </div>
    </div>
  );
}

function NoteCard({
  note,
  handleAction,
}: {
  note: any;
  handleAction: (
    actionFn: () => Promise<any>,
    successText?: string,
    closeRef?: React.RefObject<HTMLButtonElement | null>,
  ) => Promise<void>;
}) {
  const [isPending, setIsPending] = useState(false);
  const editCloseRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="group relative flex flex-col gap-3 p-5 border border-border rounded-xl hover:shadow-lg transition-all bg-card h-[280px] overflow-hidden">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${priorityGradient(note.priority)}`}
        style={{
          backgroundSize: "100% 220%",
          backgroundPosition: "top",
        }}
      />

      <div className="relative z-10 flex flex-col gap-3 h-full">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-base line-clamp-2" dir="auto">
            {note.title}
          </h3>
          <PriorityBadge priority={note.priority} />
        </div>

        <p
          className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1 whitespace-pre-wrap"
          dir="auto"
        >
          {note.description || "No description provided."}
        </p>

        <div className="space-y-3 mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{formatDeadline(note.deadline)}</span>
          </div>

          <div className="flex justify-end items-center gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <ResponsiveDrawer
                title="Note Details"
                content={<NoteView note={note} />}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 bg-muted/50 hover:bg-primary hover:text-primary-foreground "
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </ResponsiveDrawer>

              <ResponsiveDrawer
                title="Edit Note"
                content={
                  <NoteForm
                    note={note}
                    onSubmitAction={(formData) =>
                      (async () => {
                        setIsPending(true);
                        await handleAction(
                          () => updateNoteAction(note.id, formData),
                          "Note updated successfully!",
                          editCloseRef,
                        );
                        setIsPending(false);
                      })()
                    }
                    isPending={isPending}
                    closeRef={editCloseRef}
                  />
                }
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 bg-muted/50 hover:bg-primary hover:text-primary-foreground "
                >
                  <Pen className="h-3 w-3" />
                </Button>
              </ResponsiveDrawer>

              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground "
                onClick={() =>
                  (async () => {
                    setIsPending(true);
                    await handleAction(
                      () => deleteNoteAction(note.id),
                      "Note deleted.",
                    );
                    setIsPending(false);
                  })()
                }
                disabled={isPending}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
