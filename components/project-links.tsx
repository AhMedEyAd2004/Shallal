"use client";

import { cn } from "@/lib/utils";
import { Link2 } from "lucide-react";
import { ComponentType, useId, type SVGProps } from "react";

export function GooglePlayIcon(props: SVGProps<SVGSVGElement>) {
  const uid = useId();
  const m = `mask-${uid}`;
  const p0 = `p0-${uid}`;
  const p1 = `p1-${uid}`;
  const p2 = `p2-${uid}`;
  const p3 = `p3-${uid}`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id={m}
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="7"
        y="3"
        width="24"
        height="26"
      >
        <path
          d="M30.0484 14.4004C31.3172 15.0986 31.3172 16.9014 30.0484 17.5996L9.75627 28.7659C8.52052 29.4459 7 28.5634 7 27.1663L7 4.83374C7 3.43657 8.52052 2.55415 9.75627 3.23415L30.0484 14.4004Z"
          fill="#C4C4C4"
        />
      </mask>
      <g mask={`url(#${m})`}>
        <path
          d="M7.63473 28.5466L20.2923 15.8179L7.84319 3.29883C7.34653 3.61721 7 4.1669 7 4.8339V27.1664C7 27.7355 7.25223 28.2191 7.63473 28.5466Z"
          fill={`url(#${p0})`}
        />
        <path
          d="M30.048 14.4003C31.3169 15.0985 31.3169 16.9012 30.048 17.5994L24.9287 20.4165L20.292 15.8175L24.6923 11.4531L30.048 14.4003Z"
          fill={`url(#${p1})`}
        />
        <path
          d="M24.9292 20.4168L20.2924 15.8179L7.63477 28.5466C8.19139 29.0232 9.02389 29.1691 9.75635 28.766L24.9292 20.4168Z"
          fill={`url(#${p2})`}
        />
        <path
          d="M7.84277 3.29865L20.2919 15.8177L24.6922 11.4533L9.75583 3.23415C9.11003 2.87878 8.38646 2.95013 7.84277 3.29865Z"
          fill={`url(#${p3})`}
        />
      </g>
      <defs>
        <linearGradient
          id={p0}
          x1="15.6769"
          y1="10.874"
          x2="7.07106"
          y2="19.5506"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00C3FF" />
          <stop offset="1" stopColor="#1BE2FA" />
        </linearGradient>
        <linearGradient
          id={p1}
          x1="20.292"
          y1="15.8176"
          x2="31.7381"
          y2="15.8176"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE00" />
          <stop offset="1" stopColor="#FFEA00" />
        </linearGradient>
        <linearGradient
          id={p2}
          x1="7.36932"
          y1="30.1004"
          x2="22.595"
          y2="17.8937"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DE2453" />
          <stop offset="1" stopColor="#FE3944" />
        </linearGradient>
        <linearGradient
          id={p3}
          x1="8.10725"
          y1="1.90137"
          x2="22.5971"
          y2="13.7365"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#11D574" />
          <stop offset="1" stopColor="#01F176" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
        fill="#4285F4"
      />
      <path
        d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
        fill="#34A853"
      />
      <path
        d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
        fill="#FBBC05"
      />
      <path
        d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
        fill="#EB4335"
      />
    </svg>
  );
}

export function AppStoreIcon(props: SVGProps<SVGSVGElement>) {
  const uid = useId();
  const gradId = `appstore-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="16" cy="16" r="14" fill={`url(#${gradId})`} />
      <path
        d="M18.4468 8.65403C18.7494 8.12586 18.5685 7.45126 18.0428 7.14727C17.5171 6.84328 16.8456 7.02502 16.543 7.55318L16.0153 8.47442L15.4875 7.55318C15.1849 7.02502 14.5134 6.84328 13.9877 7.14727C13.462 7.45126 13.2811 8.12586 13.5837 8.65403L14.748 10.6864L11.0652 17.1149H8.09831C7.49173 17.1149 7 17.6089 7 18.2183C7 18.8277 7.49173 19.3217 8.09831 19.3217H18.4324C18.523 19.0825 18.6184 18.6721 18.5169 18.2949C18.3644 17.7279 17.8 17.1149 16.8542 17.1149H13.5997L18.4468 8.65403Z"
        fill="white"
      />
      <path
        d="M11.6364 20.5419C11.449 20.3328 11.0292 19.9987 10.661 19.8888C10.0997 19.7211 9.67413 19.8263 9.45942 19.9179L8.64132 21.346C8.33874 21.8741 8.51963 22.5487 9.04535 22.8527C9.57107 23.1567 10.2425 22.975 10.5451 22.4468L11.6364 20.5419Z"
        fill="white"
      />
      <path
        d="M22.2295 19.3217H23.9017C24.5083 19.3217 25 18.8277 25 18.2183C25 17.6089 24.5083 17.1149 23.9017 17.1149H20.9653L17.6575 11.3411C17.4118 11.5757 16.9407 12.175 16.8695 12.8545C16.778 13.728 16.9152 14.4636 17.3271 15.1839C18.7118 17.6056 20.0987 20.0262 21.4854 22.4468C21.788 22.975 22.4594 23.1567 22.9852 22.8527C23.5109 22.5487 23.6918 21.8741 23.3892 21.346L22.2295 19.3217Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id={gradId}
          x1="16"
          y1="2"
          x2="16"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2AC9FA" />
          <stop offset="1" stopColor="#1F65EB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type ProjectLink = { title: string; url: string };

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface LinkConfigEntry {
  label: string;
  icon: IconComponent;
  className: string;
}

type LinkConfigMap = {
  [key: string]: LinkConfigEntry;
};

export const LINK_CONFIG: LinkConfigMap = {
  google: {
    label: "Google",
    icon: GoogleIcon,
    className:
      "bg-white h-8 min-w-30 flex justify-center text-gray-700 border border-gray-200 hover:bg-gray-50",
  },
  playstore: {
    label: "Play Store",
    icon: GooglePlayIcon,
    className:
      "bg-black h-8 min-w-30 flex justify-center text-white hover:bg-neutral-800",
  },
  appstore: {
    label: "App Store",
    icon: AppStoreIcon,
    className:
      "bg-black h-8 min-w-30 flex justify-center text-white hover:bg-neutral-800",
  },
  other: {
    label: "Other",
    icon: Link2,
    className:
      "bg-muted h-8 min-w-30 flex justify-center text-foreground hover:bg-muted/70",
  },
};

export function ProjectLinks({
  links,
  className,
}: {
  links: ProjectLink[] | Record<string, string> | null | undefined;
  className?: string;
}) {
  let normalized: ProjectLink[] = [];
  if (Array.isArray(links)) {
    normalized = links.filter((l) => l?.title && l?.url);
  } else if (links && typeof links === "object") {
    normalized = Object.entries(links).map(([title, url]) => ({
      title,
      url: String(url),
    }));
  }

  if (normalized.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {normalized.map((link, idx) => {
        const config = LINK_CONFIG[link.title] || LINK_CONFIG.other;
        const Icon = config.icon;
        return (
          <a
            key={`${link.title}-${idx}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors shadow-sm",
              config.className,
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {config.label}
          </a>
        );
      })}
    </div>
  );
}
