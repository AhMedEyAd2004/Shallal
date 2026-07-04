import Image from "next/image";
import { CardStackCarousel } from "@/gsap-wrappers/animated-testimonials";

type Testimonial = {
  id: string;
  text: string;
  name: string;
  role: string;
  img: string;
};

const testimonials: Testimonial[] = [
  {
    id: "t1",
    text: "Working with this team completely changed how fast we ship. The attention to detail is unreal.",
    name: "Sara Ahmed",
    role: "Product Lead, Nimbus",
    img: "/image.png",
  },
  {
    id: "t2",
    text: "Every interaction felt intentional. It's rare to see motion design used this precisely.",
    name: "Omar Khaled",
    role: "Founder, Driftline",
    img: "/image.png",
  },
  {
    id: "t3",
    text: "We asked for something different and got exactly that — a site that actually feels alive.",
    name: "Leila Nasser",
    role: "CMO, Faroui",
    img: "/image.png",
  },
  {
    id: "t4",
    text: "The best collaborator we've had. Fast, sharp, and obsessed with getting the small things right.",
    name: "Yusuf Adel",
    role: "CTO, Marisol",
    img: "/image.png",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-xl">
      <p className="text-base italic sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="mt-8 flex items-center gap-4">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full bg-muted">
          <Image
            src={testimonial.img}
            alt={testimonial.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-medium text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonial() {
  return (
    <section className="py-24 bg-background text-foreground">
      <h3 className="text-center font-stack text-2xl sm:text-3xl md:text-4xl font-semibold">
        You&apos;re in good company
      </h3>

      <p className="mt-2 px-2 text-center text-sm sm:text-base text-muted-foreground">
        Don&apos;t just take our word for it—hear from our customers.
      </p>

      <div className="mt-16 mx-2 sm:mx-4">
        <CardStackCarousel>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </CardStackCarousel>
      </div>
    </section>
  );
}
