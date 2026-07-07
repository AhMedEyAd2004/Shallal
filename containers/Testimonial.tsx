import { CardStackCarousel } from "@/gsap-wrappers/animated-testimonials";
import Link from "next/link";
import { LinkIcon, UserRound } from "lucide-react";

type Testimonial = {
  id: string;
  text: string;
  name: string;
  role: string;
  img: string;
  links?: { title: string; url: string }[];
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-xl">
      <p className="text-base italic sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {testimonial.links && testimonial.links.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <p className=" text-sm font-semibold">Links:</p>
            <div className="flex gap-2">
              {testimonial.links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sm flex underline hover:text-muted-foreground transition-colors"
                >
                  <LinkIcon className=" size-4" />
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted border border-border text-muted-foreground">
            <UserRound className="size-10 sm:size-12 stroke-[1.3] opacity-80 mt-3 " />
          </div>

          <div>
            <p className="font-medium text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonial({
  testimonials = [],
}: {
  testimonials?: Testimonial[];
}) {
  return (
    <section id="blogs" className="py-24 bg-background text-foreground">
      <h3 className="text-center font-stack text-2xl sm:text-3xl md:text-4xl font-semibold">
        You&apos;re in good company
      </h3>

      <p className="mt-2 px-2 text-center text-sm sm:text-base text-muted-foreground">
        Don&apos;t just take our word for it—hear from our customers.
      </p>

      <div className="mt-16 mx-2 sm:mx-4">
        {testimonials.length === 0 ? (
          <div className=" min-h-[40dvh] flex items-center justify-center text-center text-muted-foreground">
            <p>No testimonials yet.</p>
          </div>
        ) : (
          <CardStackCarousel>
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </CardStackCarousel>
        )}
      </div>
    </section>
  );
}
