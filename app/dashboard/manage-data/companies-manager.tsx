"use client";

import { useState, useTransition, useOptimistic, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import countriesData from "@/lib/countries.json";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X, ImageIcon } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "react-dropzone";
import {
  addCompanyAction,
  deleteCompanyAction,
  deleteUploadThingFilesAction,
} from "./actions";
import { FlagImage } from "@/components/custom/FlagImage";



export function CompaniesManager({ companies, allProjectsMinimal = [] }: { companies: any[]; allProjectsMinimal?: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const [optimisticCompanies, addOptimisticCompany] = useOptimistic(
    companies,
    (state, newCompany: any) => {
      if (newCompany.action === "delete") {
        return state.filter((c: any) => c.id !== newCompany.id);
      }
      return [newCompany, ...state];
    },
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-stack">Served Companies</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ADD FORM */}
        <div className="w-full md:w-1/3 border border-border rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-lg mb-4">Add Company</h3>
          <form
            ref={formRef}
            action={async (formData) => {
              if (!selectedProject) {
                toast.error("Please select a project.");
                return;
              }

              addOptimisticCompany({
                id: Math.random().toString(),
                project_id: selectedProject.id,
                projects: selectedProject,
              });

              const res = await addCompanyAction(formData);
              if (res?.error) {
                toast.error(`Error adding project: ${res.error}`);
                return;
              }
              toast.success("Project linked successfully");
              setSelectedProject(null);
              formRef.current?.reset();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <input type="hidden" name="project_id" value={selectedProject?.id || ""} />
              <Label>Link a Project</Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className={cn(
                      "w-full justify-between font-normal",
                      !selectedProject && "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {selectedProject ? (
                        <span className="truncate">{selectedProject.title}</span>
                      ) : (
                        <span>Select a project...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search project..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {allProjectsMinimal.map((p) => (
                          <CommandItem
                            key={p.id}
                            value={p.title || p.id}
                            onSelect={() => {
                              setSelectedProject(p);
                              setComboboxOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProject?.id === p.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span className="truncate">{p.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Button className="w-full">Save Company</Button>
          </form>
        </div>

        {/* LIST */}
        <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4 items-start content-start">
          {optimisticCompanies
            .filter((c: any) => c.projects || c.project_id)
            .map((c: any) => {
            const project = c.projects || {};
            const imagesArray = Array.isArray(project.images) ? project.images : [];
            const logoSrc = imagesArray.length > 0 ? imagesArray[0] : "/logo.png";
            
            return (
              <div
                key={c.id}
                className={`relative group border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors h-fit ${c.action === "delete" ? "opacity-50" : ""}`}
              >
                <div
                  className="relative shrink-0 size-12 lg:size-16"
                  title={`${project.title}`}
                >
                  <Image
                    src={logoSrc}
                    alt={project.title || "Project Logo"}
                    fill
                    className="object-contain rounded-lg"
                  />
                  {project.country && (
                    <FlagImage
                      countryCode={project.country}
                      countryName={project.title}
                      className="absolute bottom-0 -right-1"
                    />
                  )}
                </div>

                <p className="font-medium text-sm text-center" dir="auto">{project.title}</p>

              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  startTransition(() => {
                    addOptimisticCompany({ id: c.id, action: "delete" });
                    deleteCompanyAction(c.id);
                  });
                }}
              >
                Delete
              </Button>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
