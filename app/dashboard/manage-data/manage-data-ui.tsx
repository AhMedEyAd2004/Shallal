import { ProjectsManager } from "./projects-manager";
import { TestimonialsManager } from "./testimonials-manager";
import { CompaniesManager } from "./companies-manager";
import { SocialsManager } from "./socials-manager";

export function ManageDataUI({
  projects,
  testimonials,
  companies,
  socialLinks,
}: any) {
  return (
    <div className="space-y-12 pb-12">
      <ProjectsManager projects={projects} />
      <div className="border-t border-border pt-12">
        <TestimonialsManager testimonials={testimonials} />
      </div>
      <div className="border-t border-border pt-12">
        <CompaniesManager companies={companies} />
      </div>
      <div className="border-t border-border pt-12">
        <SocialsManager socialLinks={socialLinks} />
      </div>
    </div>
  );
}

/*-- ============================================
-- SITE SETTINGS
-- ============================================
update site_settings
set logo_url = '/logo.png'
where singleton = true;

-- ============================================
-- HERO SECTION
-- ============================================
update hero_section
set
  title = 'We engineer high-growth digital products',
  description = 'We transform ideas into fast, secure, and scalable digital products that help businesses grow. From mobile apps and websites to complete business management systems, we deliver software designed for long-term success.',
  cta_1_text = 'Book a discovery call',
  cta_1_link = '#',
  cta_2_text = 'Let''s talk',
  cta_2_link = '#'
where singleton = true;

-- ============================================
-- INFO SLIDES (about_us, our_vision descriptions)
-- ============================================
update info_slides
set description = 'We are a team of builders obsessed with craft. From web platforms to mobile apps and full-scale management systems, we design and engineer digital products that feel fast, look sharp, and hold up under real-world pressure.'
where slug = 'about_us';

update info_slides
set description = 'We are engineering an open, lightning-fast digital backbone built for everyone. By rewriting modern architectural standards, our goal is to empower organizations to build accessible, secure, and incredibly immersive interfaces that move human progress forward.'
where slug = 'our_vision';

-- why_choose_us has no description — title only, already seeded

-- ============================================
-- WHY CHOOSE US CARDS
-- ============================================
insert into why_choose_us_cards (title, description, order_index) values
  ('Web Applications', 'We build web apps that outperform the competition on speed, accessibility, and scale, engineered right from the first line of code.', 1),
  ('Mobile Applications', 'Our mobile apps deliver smoother performance and a more polished experience than anything else on the market.', 2),
  ('Management Systems', 'We design management systems that are more reliable, more secure, and easier to scale than the alternatives.', 3);

-- ============================================
-- SERVICE PROVIDED (serving platforms)
-- ============================================
insert into service_provided (company_image_url, country_image_url, title, order_index) values
  ('/logo.png', '/egypt.png', 'Acme Corp', 1);

-- ============================================
-- PROJECTS
-- ============================================
insert into projects (title, description, images, tags, links, order_index) values
  ('Project 1', 'Placeholder description for project 1 — replace with real content.', '["/logo.png"]', '{}', '[]', 1),
  ('Project 2', 'Placeholder description for project 2 — replace with real content.', '["/logo.png"]', '{}', '[]', 2),
  ('Project 3', 'Placeholder description for project 3 — replace with real content.', '["/logo.png"]', '{}', '[]', 3);

-- ============================================
-- TESTIMONIALS (linked to Project 1 as a placeholder)
-- ============================================
insert into testimonials (project_id, person_name, person_role, person_image_url, country, comment, source, status)
select id, 'Sara Ahmed', 'Product Lead, Nimbus', null, null,
  'Working with this team completely changed how fast we ship. The attention to detail is unreal.',
  'admin', 'approved'
from projects where title = 'Project 1';

insert into testimonials (project_id, person_name, person_role, person_image_url, country, comment, source, status)
select id, 'Omar Khaled', 'Founder, Driftline', null, null,
  'Every interaction felt intentional. It''s rare to see motion design used this precisely.',
  'admin', 'approved'
from projects where title = 'Project 1';

insert into testimonials (project_id, person_name, person_role, person_image_url, country, comment, source, status)
select id, 'Leila Nasser', 'CMO, Faroui', null, null,
  'We asked for something different and got exactly that — a site that actually feels alive.',
  'admin', 'approved'
from projects where title = 'Project 1';

insert into testimonials (project_id, person_name, person_role, person_image_url, country, comment, source, status)
select id, 'Yusuf Adel', 'CTO, Marisol', null, null,
  'The best collaborator we''ve had. Fast, sharp, and obsessed with getting the small things right.',
  'admin', 'approved'
from projects where title = 'Project 1';

-- ============================================
-- FOOTER LINK GROUPS
-- ============================================
insert into footer_link_groups (label, links, order_index) values
  ('Product', '[{"title":"Payments","href":"#"},{"title":"Pricing","href":"/pricing"},{"title":"Insurance","href":"#"}]', 1),
  ('Resources', '[{"title":"Blog","href":"#"},{"title":"Documentation","href":"#"},{"title":"API Reference","href":"#"}]', 2),
  ('Company', '[{"title":"About Us","href":"#"},{"title":"Careers","href":"#"},{"title":"Privacy Policy","href":"#"}]', 3); */
