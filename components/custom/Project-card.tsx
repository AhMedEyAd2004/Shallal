"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LinkIcon } from "lucide-react";
import { ResponsiveDrawer } from "./responsiveDrawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { ImageCarousel } from "./ImageCarousel";
import { getCountryLabel } from "./CountrySelect";
import { FlagImage } from "./FlagImage";
import { ProjectLinks } from "@/components/project-links";

interface ProjectCardProps {
  image?: string;
  title: string;
  description: string;
  year?: string | number;
  country?: string;
  href?: string;
  tags?: string[];
  drawerContent?: React.ReactNode;
  drawerTitle?: React.ReactNode;
  dashboardActions?: React.ReactNode;
}

export default function ProjectCard({
  image = "",
  title,
  description,
  year = "",
  country,
  href = "",
  tags = [],
  drawerContent,
  drawerTitle,
  dashboardActions,
  ...rest
}: ProjectCardProps & {
  links?: { title: string; url: string }[];
  images?: string[];
  testimonials?: any[];
}) {
  const [expandedTestimonials, setExpandedTestimonials] = useState(false);
  const imagesArray =
    rest.images && rest.images.length > 0 ? rest.images : [image];
  const visibleTestimonials = expandedTestimonials
    ? rest.testimonials
    : rest.testimonials?.slice(0, 2);

  // Default public drawer content (Matches Edit Drawer exactly)
  const defaultDrawerContent = (
    <div className="space-y-6 pt-4 pb-12">
      <ImageCarousel images={imagesArray} alt={title} />

      <div className="text-center space-y-4 mb-6">
        <h3 className="text-2xl font-bold font-stack">{title}</h3>
      </div>

      <div className="space-y-4">
        {country && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Country</p>
            <div className="flex items-center gap-2">
              <FlagImage
                countryCode={country}
                countryName={country}
                width={20}
                height={20}
                className="shrink-0"
              />
              <p className="text-muted-foreground text-sm">
                {getCountryLabel(country)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Description</p>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-base">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags && tags.length > 0 ? (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Links</p>
          {rest.links && rest.links.length > 0 ? (
            <ProjectLinks links={rest.links} />
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t pt-8 mt-8">
        <h4 className="font-semibold text-lg">Project Testimonials</h4>

        {rest.testimonials && rest.testimonials.length > 0 ? (
          <div className="space-y-2">
            {visibleTestimonials?.map((t: any) => (
              <div
                key={t.id}
                className="bg-muted p-3 rounded-lg text-sm relative group text-left"
              >
                <span className="font-semibold">{t.person_name || t.name}</span>
                {(t.person_role || t.role) && (
                  <span className="text-muted-foreground text-xs ml-1">
                    ({t.person_role || t.role})
                  </span>
                )}
                : &ldquo;{t.comment || t.text}&rdquo;
              </div>
            ))}

            {!expandedTestimonials && rest.testimonials.length > 2 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full text-xs mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedTestimonials(true);
                }}
              >
                View More ({rest.testimonials.length - 2})
              </Button>
            )}
            {expandedTestimonials && rest.testimonials.length > 2 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full text-xs mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedTestimonials(false);
                }}
              >
                Show Less
              </Button>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No Testimonials yet</p>
        )}
      </div>
    </div>
  );

  return (
    <ResponsiveDrawer
      content={drawerContent || defaultDrawerContent}
      title={drawerTitle || title}
    >
      <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/50 cursor-pointer">
        {/* Image */}
        <div className="relative grow overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-2000 ease-out group-hover:scale-110"
          />
        </div>

        {/* Bottom info panel */}
        <div className="flex flex-col gap-2 bg-muted/50 p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium tracking-wide text-muted-foreground">
              {year}
            </span>
            {country && (
              <div className="flex items-center gap-1.5">
                <FlagImage
                  countryCode={country}
                  countryName={country}
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span className="text-xs font-medium tracking-wide text-muted-foreground">
                  {getCountryLabel(country)}
                </span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-card-foreground truncate">
            {title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground min-h-[46px]">
            {description || " "}
          </p>

          <div className="flex justify-between items-center mt-2 h-6">
            <div className="flex gap-2 items-center overflow-hidden max-w-[70%]">
              {tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium uppercase tracking-wider truncate shrink-0 max-w-[80px]"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap shrink-0">
                  +{tags.length - 2} more
                </span>
              )}
            </div>

            {dashboardActions ? (
              <div className="flex gap-2 z-10">{dashboardActions}</div>
            ) : (
              <Button
                variant={null}
                className="inline-flex items-center gap-1.5 rounded-full bg-transparent px-0 py-1 text-sm font-medium text-card-foreground/80 transition-colors hover:text-card-foreground pointer-events-none shrink-0"
              >
                Open
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </ResponsiveDrawer>
  );
}
