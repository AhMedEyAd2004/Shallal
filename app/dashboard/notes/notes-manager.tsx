"use client";

import { useState, useTransition } from "react";
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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Native formatting
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

// Dialog/Drawer Wrapper
function ResponsiveNoteDialog({
  title,
  children,
  trigger,
  open,
  setOpen,
}: {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="pt-2">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 overflow-y-auto max-h-[85vh]">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}

// Separate component for the form so it can hold DatePicker state
function NoteForm({
  note,
  onSubmitAction,
  onCancel,
  isPending,
}: {
  note?: any;
  onSubmitAction: (formData: FormData) => void;
  onCancel?: () => void;
  isPending: boolean;
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
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <div />
        )}
        <Button type="submit" disabled={isPending} className="px-8">
          {note ? "Save Changes" : "Create Note"}
        </Button>
      </div>
    </form>
  );
}

// Read-only view of a note's full details (no truncation)
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
  const [isPending, startTransition] = useTransition();

  // Track dialog open states individually
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpenId, setEditOpenId] = useState<string | null>(null);
  const [viewOpenId, setViewOpenId] = useState<string | null>(null);

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
    closeDialog?: () => void,
  ) => {
    const result = await actionFn();
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      if (successText) toast.success(successText);
      if (closeDialog) closeDialog();
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

          <ResponsiveNoteDialog
            title="Create New Note"
            open={createOpen}
            setOpen={setCreateOpen}
            trigger={
              <Button className="shrink-0 gap-2">
                <Plus className="h-4 w-4" /> Add Note
              </Button>
            }
          >
            <NoteForm
              onSubmitAction={(formData) =>
                startTransition(() =>
                  handleAction(
                    () => addNoteAction(formData),
                    "Note created successfully!",
                    () => setCreateOpen(false),
                  ),
                )
              }
              onCancel={() => setCreateOpen(false)}
              isPending={isPending}
            />
          </ResponsiveNoteDialog>
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
          filteredNotes.map((note) => {
            return (
              <div
                key={note.id}
                className="group relative flex flex-col gap-3 p-5 border border-border rounded-xl hover:shadow-lg transition-all bg-card h-[280px] overflow-hidden"
              >
                {/* Priority gradient, sits behind everything */}
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
                    <h3
                      className="font-semibold text-base line-clamp-2"
                      dir="auto"
                    >
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
                        <ResponsiveNoteDialog
                          title="Note Details"
                          open={viewOpenId === note.id}
                          setOpen={(open) =>
                            setViewOpenId(open ? note.id : null)
                          }
                          trigger={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 bg-muted/50 hover:bg-primary hover:text-primary-foreground "
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          }
                        >
                          <NoteView note={note} />
                        </ResponsiveNoteDialog>

                        <ResponsiveNoteDialog
                          title="Edit Note"
                          open={editOpenId === note.id}
                          setOpen={(open) =>
                            setEditOpenId(open ? note.id : null)
                          }
                          trigger={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 bg-muted/50 hover:bg-primary hover:text-primary-foreground "
                            >
                              <Pen className="h-3 w-3" />
                            </Button>
                          }
                        >
                          <NoteForm
                            note={note}
                            onSubmitAction={(formData) =>
                              startTransition(() =>
                                handleAction(
                                  () => updateNoteAction(note.id, formData),
                                  "Note updated successfully!",
                                  () => setEditOpenId(null),
                                ),
                              )
                            }
                            onCancel={() => setEditOpenId(null)}
                            isPending={isPending}
                          />
                        </ResponsiveNoteDialog>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground "
                          onClick={() =>
                            startTransition(() =>
                              handleAction(
                                () => deleteNoteAction(note.id),
                                "Note deleted.",
                              ),
                            )
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
          })
        )}
      </div>
    </div>
  );
}
