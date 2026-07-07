import { Button } from "@/components/ui/button";
import AnimatedContainer from "@/gsap-wrappers/footer-animation";
import Image from "next/image";

type FooterLink = {
  title: string;
  href: string;
};

export async function StickyFooter({
  socialLinks,
}: {
  socialLinks: { id: string; platform: string; url_or_number: string }[];
}) {
  return (
    <footer
      className="relative h-(--footer-height) w-full border-t [--footer-height:420px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 h-(--footer-height) w-full">
        <div className="sticky top-[calc(100vh-var(--footer-height))] h-full overflow-y-auto">
          <div
            aria-hidden
            className="absolute inset-0 isolate z-0 opacity-50 contain-strict dark:opacity-60"
          >
            <div className="absolute top-0 left-0 h-56 w-32 sm:h-320 sm:w-140 -translate-y-[27%] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
            <div className="absolute top-0 left-0 h-56 w-24 sm:h-320 sm:w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
            <div className="absolute top-0 left-0 h-56 w-24 sm:h-320 sm:w-60 -translate-y-[27%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
          </div>

          <div className="relative mx-auto flex size-full max-w-6xl flex-col justify-between gap-5">
            <div className="grid grid-cols-1 gap-8 px-4 pt-12 md:grid-cols-3">
              <AnimatedContainer className="w-full space-y-4">
                <Image
                  src="/logo.png"
                  alt="Shallal Logo"
                  width={120}
                  height={120}
                />
                <p className="mt-8 text-muted-foreground text-sm md:mt-0">
                  Software development company that specializes in building
                  high-quality web and mobile applications. We are committed to
                  delivering innovative solutions that meet the unique needs of
                  our clients.
                </p>
              </AnimatedContainer>

              <AnimatedContainer className="w-full" delay={0.1}>
                <h3 className="text-sm uppercase">Quick Links</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                  {quickLinks.map((link) => (
                    <li key={link.title}>
                      <a className="hover:text-foreground" href={link.href}>
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </AnimatedContainer>

              <AnimatedContainer className="w-full" delay={0.2}>
                <h3 className="text-sm uppercase">Get in Touch</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                  {socialLinks.map((link) => {
                    const isPhone =
                      link.platform.toLowerCase() === "phone number";

                    const safeHref = isPhone
                      ? `tel:${link.url_or_number.replace(/\s+/g, "")}`
                      : link.url_or_number;

                    return (
                      <li key={link.url_or_number + link.platform}>
                        <a
                          className="hover:text-foreground transition-colors"
                          href={safeHref}
                          target={isPhone ? undefined : "_blank"}
                          rel={isPhone ? undefined : "noopener noreferrer"}
                        >
                          <span className="capitalize">{link.platform}</span>:{" "}
                          {link.url_or_number}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </AnimatedContainer>
            </div>

            <div className="flex flex-col items-center justify-between gap-2 border-t p-4 text-muted-foreground text-sm md:flex-row">
              <p>
                &copy; {new Date().getFullYear()} Shallal, All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const quickLinks: FooterLink[] = [
  { title: "Home", href: "#hero" },
  { title: "Projects", href: "#projects" },
  { title: "Services", href: "#services" },
  { title: "Testimonials", href: "#testimonials" },
];
