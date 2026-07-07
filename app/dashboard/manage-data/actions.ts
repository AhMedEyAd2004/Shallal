"use server";

import { normalizeLinksInput, ProjectLink } from "@/app/(main)/home/page";
import { createClient } from "@/lib/server";
import { updateTag } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadThingFilesAction(urls: string[]) {
  if (!urls || urls.length === 0) return { success: true };
  const fileKeys = urls
    .map((u) => {
      const parts = u.split("/f/");
      return parts.length === 2 ? parts[1] : null;
    })
    .filter(Boolean) as string[];

  if (fileKeys.length > 0) {
    await utapi.deleteFiles(fileKeys);
  }
  return { success: true };
}

// PROJECTS
export async function addProjectAction(formData: FormData) {
  const supabase = await createClient();

  // Parse tags (comma separated)
  const tagsStr = formData.get("tags") as string;
  const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : [];

  const imagesStr = formData.get("images") as string;
  let images: string[] = [];
  try {
    if (imagesStr) images = JSON.parse(imagesStr);
  } catch (e) {}

  if (images.length === 0) images = ["/logo.png"];

  // Parse links
  const linksStr = formData.get("links") as string;
  let links: ProjectLink[] = [];
  try {
    if (linksStr) links = normalizeLinksInput(JSON.parse(linksStr));
  } catch (e) {}

  const { data: proj, error } = await supabase
    .from("projects")
    .insert({
      title: formData.get("title"),
      description: formData.get("description"),
      country: formData.get("country"),
      images,
      tags,
      links,
      order_index: 0,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Handle inline testimonial
  const tName = formData.get("testi_person_name") as string;
  const tRole = formData.get("testi_person_role") as string;
  const tComment = formData.get("testi_comment") as string;
  if (tName && tComment) {
    await supabase.from("testimonials").insert({
      project_id: proj.id,
      person_name: tName,
      person_role: tRole || "",
      comment: tComment,
      status: "approved",
    });
    updateTag("testimonials");
  }

  updateTag("projects");
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);
  updateTag("projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const tagsStr = formData.get("tags") as string;
  const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : [];

  const imagesStr = formData.get("images") as string;
  let images: string[] = [];
  try {
    if (imagesStr) images = JSON.parse(imagesStr);
  } catch (e) {}

  if (images.length === 0) images = ["/logo.png"];

  const linksStr = formData.get("links") as string;
  let links: ProjectLink[] = [];
  try {
    if (linksStr) links = normalizeLinksInput(JSON.parse(linksStr));
  } catch (e) {}

  const { error } = await supabase
    .from("projects")
    .update({
      title: formData.get("title"),
      description: formData.get("description"),
      country: formData.get("country"),
      tags,
      images,
      links,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Handle inline testimonial
  const tName = formData.get("testi_person_name") as string;
  const tRole = formData.get("testi_person_role") as string;
  const tComment = formData.get("testi_comment") as string;
  if (tName && tComment) {
    await supabase.from("testimonials").insert({
      project_id: id,
      person_name: tName,
      person_role: tRole || "",
      comment: tComment,
      status: "approved",
    });
    updateTag("testimonials");
  }

  updateTag("projects");
  return { success: true };
}

// TESTIMONIALS
export async function addTestimonialAction(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    project_id: formData.get("project_id"),
    person_name: formData.get("person_name"),
    person_role: formData.get("person_role"),
    comment: formData.get("comment"),
    status: formData.get("status") || "approved", // auto approve if created by admin
  });
  if (error) return { error: error.message };
  updateTag("testimonials");
  updateTag("projects"); // to refresh related project drawer
  return { success: true };
}

export async function updateTestimonialStatusAction(
  id: string,
  status: "approved" | "rejected" | "pending" | "hidden",
) {
  const supabase = await createClient();
  await supabase.from("testimonials").update({ status }).eq("id", id);
  updateTag("testimonials");
  updateTag("projects");
}

export async function deleteTestimonialAction(id: string) {
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  updateTag("testimonials");
  updateTag("projects");
}

// SERVED COMPANIES
export async function addCompanyAction(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("service_provided").insert({
    title: formData.get("title"),
    company_image_url: formData.get("companyImage") || "/logo.png",
    country_image_url: formData.get("countryImage") || "/egypt.png",
    order_index: 0,
  });

  if (error) return { error: error.message };
  updateTag("service_provided");
  return { success: true };
}

export async function deleteCompanyAction(id: string) {
  const supabase = await createClient();
  await supabase.from("service_provided").delete().eq("id", id);
  updateTag("service_provided");
}

// SOCIAL LINKS
export async function addSocialLinkAction(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_links").insert({
    platform: formData.get("platform"),
    url_or_number: formData.get("url"),
    order_index: 0,
  });

  if (error) return { error: error.message };
  updateTag("social_links");
  return { success: true };
}

export async function updateSocialLinkAction(id: string, url: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("social_links")
    .update({ url_or_number: url })
    .eq("id", id);

  if (error) return { error: error.message };
  updateTag("social_links");
  return { success: true };
}

export async function deleteSocialLinkAction(id: string) {
  const supabase = await createClient();
  await supabase.from("social_links").delete().eq("id", id);
  updateTag("social_links");
}
