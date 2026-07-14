import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ThemeToggle } from "@/components/static/theme-toggle";
import { createClient } from "@/lib/server";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import { MobileMenu } from "@/components/custom/MobileMenu";
import { NotesReminder } from "./NotesReminder";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email || "admin";
  const createdAt = user?.created_at;

  const { data: notes } = await supabase.from("notes").select("*");

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-98 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex gap-3 justify-center items-center">
          <Link href="/home" className="flex gap-2 items-center">
            <Image
              src={"/logo.png"}
              alt="Logo"
              width={48}
              height={48}
              className="rounded-md overflow-hidden"
            />
          </Link>
          <h1 className="font-stack flex gap-1 italic font-bold tracking-wider">
            Shallal <p className="underline">Admin</p>
          </h1>
        </div>

        {/* Desktop nav — hidden below md */}
        <nav className="ml-6 hidden md:flex items-center gap-2 text-sm font-medium">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/home">Home</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/manage-data">Manage Data</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/pdfs">PDFs</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/notes">Notes</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />

          {/* Desktop profile dropdown */}
          <div className="hidden md:flex">
            <UserProfileDropdown email={email} createdAt={createdAt} />
          </div>

          {/* Mobile: single hamburger with nav + profile combined */}
          <div className="md:hidden">
            <MobileMenu email={email} createdAt={createdAt} />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">{children}</main>
      <NotesReminder notes={notes || []} />
    </div>
  );
}
