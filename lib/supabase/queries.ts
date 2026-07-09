import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Stateless client for public cached data (no cookies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: { persistSession: false },
  },
);

/**
 * Fetch social links in a single query.
 */
export const getSocialLinks = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("social_links")
      .select("id,platform,url_or_number")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching social links:", error);
      return [];
    }
    return data;
  },
  ["social-links"],
  { tags: ["social-links"], revalidate: 86400 },
);

/**
 * Fetch projects and their approved testimonials in a single query.
 * Newest projects first.
 */
export const getProjects = unstable_cache(
  async () => {
    // We join the testimonials table to avoid N+1 queries.
    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        testimonials (*)
      `,
      )
      .eq("testimonials.status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
    return projects;
  },
  ["projects-and-testimonials"],
  { tags: ["projects", "testimonials"], revalidate: 86400 }, // Long cache, invalidate on demand
);

/**
 * Fetch purely testimonials for the standalone section, if needed without projects
 */
export const getApprovedTestimonials = unstable_cache(
  async () => {
    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select("*, projects(links)")
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching testimonials:", error);
      return [];
    }
    return testimonials;
  },
  ["approved-testimonials"],
  { tags: ["testimonials"], revalidate: 86400 },
);

/**
 * Fetch the serving platforms (service_provided table)
 */
export const getServiceProvided = unstable_cache(
  async () => {
    const { data: services, error } = await supabase
      .from("service_provided")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching service_provided:", error);
      return [];
    }
    return services;
  },
  ["service-provided"],
  { tags: ["service_provided"], revalidate: 86400 },
);
