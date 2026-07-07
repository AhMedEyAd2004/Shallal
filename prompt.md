I have a Supabase database for a Next.js 16 App Router site with these tables:

- site_settings (singleton: logo_url)
- social_links (list: platform, url_or_number, order_index)
- hero_section (singleton: title, description, cta_1/2 text+link)
- service_provided (list: company_image_url, country_image_url, title, order_index)
- info_slides (3 rows by slug: about_us, our_vision, why_choose_us — title, description)
- why_choose_us_cards (list: title, description, order_index)
- projects (list: title, description, images jsonb, tags text[], links jsonb, order_index)
- project_pdfs (dashboard-only, private, linked to projects)
- testimonials (linked to project_id: person_name, person_role, person_image_url, country, comment, video_url, source, status — only status='approved' should ever be shown publicly)
- footer_link_groups (list: label, links jsonb, order_index)

Stack: Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, GSAP for animations, Supabase (@supabase/ssr for server/browser clients).

I need you to:

1. Set up the Supabase client architecture correctly for App Router:
   - A server client (for Server Components / Server Actions) using @supabase/ssr with cookies from next/headers
   - A browser client (for any client-side realtime or interactive needs)
   - A separate admin client using the service role key, server-only, for dashboard writes and private project_pdfs access — never bundled to the client

2. Decide and implement the correct rendering/caching strategy PER SECTION, not one blanket strategy for the whole page. Specifically:
   - Content that rarely changes (hero_section, info_slides, why_choose_us_cards, footer_link_groups, site_settings, social_links) should be statically generated at build time or use a long revalidate window (ISR) — pick sensible revalidate seconds and explain the tradeoff.
   - Content that changes more often or needs freshness (projects, service_provided) should use a shorter ISR revalidate window.
   - testimonials must always be filtered server-side by status='approved' — never fetch unapproved rows in a client-exposed query, and explain whether this data belongs in the same ISR bucket as projects or needs its own revalidate tag.
   - Explain where Next.js `fetch` cache options don't apply (since Supabase JS client doesn't go through Next's fetch cache automatically) and show me how to use Next's `unstable_cache` or route segment config (`export const revalidate = X`) correctly with the Supabase client to actually get ISR behav8ior.
   - Show me how to use on-demand revalidation (revalidatePath / revalidateTag) triggered from a Server Action, so that when I edit content in the dashboard, the public site updates without waiting for the next scheduled revalidation.

3. For the testimonial submission form (public users submitting via source='user_submitted', status='pending'), tell me whether that mutation should be a Server Action or a Route Handler, and why, given it's a public write.

4. Flag anywhere my table/column design would cause an N+1 query problem or an unnecessary waterfall in a Server Component (e.g. fetching testimonials per-project in a loop vs a single joined query), and fix the query shape.

5. Give me the final file structure: where Supabase client files live, where each data-fetching function lives (e.g. lib/supabase/queries.ts or split per-section), and how Server Components import and call them.

Be explicit about WHY each caching decision was made, not just the code — I want to actually understand the reasoning so I can extend this myself later.
