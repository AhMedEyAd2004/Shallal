"use client";

import { Globe, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";
import { useId } from "react";

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  const uid = useId();
  const gradId = `whatsapp-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
        fill="#BFC8D0"
      />
      <path
        d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
        fill={`url(#${gradId})`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
        fill="white"
      />
      <path
        d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id={gradId}
          x1="26.5"
          y1="7"
          x2="4"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5BD066" />
          <stop offset="1" stopColor="#27B43E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        fill="#1877F2"
        d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"
      />
      <path
        fill="#ffffff"
        d="M10.725 10.023L11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 002.188 0v-4.892h1.63z"
      />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  const uid = useId();
  const g1 = `ig-grad-1-${uid}`;
  const g2 = `ig-grad-2-${uid}`;
  const g3 = `ig-grad-3-${uid}`;

  return (
    <svg
      viewBox="0 0 551.034 551.034"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id={g1}
          gradientUnits="userSpaceOnUse"
          x1="275.517"
          y1="4.5714"
          x2="275.517"
          y2="549.7202"
          gradientTransform="matrix(1 0 0 -1 0 554)"
        >
          <stop offset="0" stopColor="#E09B3D" />
          <stop offset="0.3" stopColor="#C74C4D" />
          <stop offset="0.6" stopColor="#C21975" />
          <stop offset="1" stopColor="#7024C4" />
        </linearGradient>
        <linearGradient
          id={g2}
          gradientUnits="userSpaceOnUse"
          x1="275.517"
          y1="4.5714"
          x2="275.517"
          y2="549.7202"
          gradientTransform="matrix(1 0 0 -1 0 554)"
        >
          <stop offset="0" stopColor="#E09B3D" />
          <stop offset="0.3" stopColor="#C74C4D" />
          <stop offset="0.6" stopColor="#C21975" />
          <stop offset="1" stopColor="#7024C4" />
        </linearGradient>
        <linearGradient
          id={g3}
          gradientUnits="userSpaceOnUse"
          x1="418.306"
          y1="4.5714"
          x2="418.306"
          y2="549.7202"
          gradientTransform="matrix(1 0 0 -1 0 554)"
        >
          <stop offset="0" stopColor="#E09B3D" />
          <stop offset="0.3" stopColor="#C74C4D" />
          <stop offset="0.6" stopColor="#C21975" />
          <stop offset="1" stopColor="#7024C4" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${g1})`}
        d="M386.878,0H164.156C73.64,0,0,73.64,0,164.156v222.722c0,90.516,73.64,164.156,164.156,164.156h222.722 c90.516,0,164.156-73.64,164.156-164.156V164.156C551.033,73.64,477.393,0,386.878,0z M495.6,386.878c0,60.045-48.677,108.722-108.722,108.722H164.156 c-60.045,0-108.722-48.677-108.722-108.722V164.156c0-60.046,48.677-108.722,108.722-108.722h222.722 c60.045,0,108.722,48.676,108.722,108.722L495.6,386.878L495.6,386.878z"
      />
      <path
        fill={`url(#${g2})`}
        d="M275.517,133C196.933,133,133,196.933,133,275.516 s63.933,142.517,142.517,142.517S418.034,354.1,418.034,275.516S354.101,133,275.517,133z M275.517,362.6 c-48.095,0-87.083-38.988-87.083-87.083s38.989-87.083,87.083-87.083c48.095,0,87.083,38.988,87.083,87.083 C362.6,323.611,323.611,362.6,275.517,362.6z"
      />
      <circle fill={`url(#${g3})`} cx="418.306" cy="134.072" r="34.149" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="currentColor"
      {...props}
    >
      <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z" />
    </svg>
  );
}

export const SOCIAL_PLATFORMS = [
  "whatsapp",
  "facebook",
  "instagram",
  "x",
  "phone_number",
  "other",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface SocialConfigEntry {
  label: string;
  icon: IconComponent;
  className: string;
  getHref: (value: string) => string;
}

type SocialConfigMap = {
  [key in SocialPlatform]: SocialConfigEntry;
};

export const SOCIAL_CONFIG: SocialConfigMap = {
  whatsapp: {
    label: "WhatsApp",
    icon: WhatsappIcon,
    className: "text-foreground hover:underline",
    // Strips out domains like wa.me, ://whatsapp.com, 'tel:', '+', and spaces
    getHref: (v) => {
      const cleanUrl = v.replace(
        /(https?:\/\/)?(www\.)?(wa\.me\/|api\.whatsapp\.com\/send\?phone=)/,
        "",
      );
      const digitsOnly = cleanUrl.replace(/[^0-9+]/g, "");
      return digitsOnly.startsWith("+") ? digitsOnly : `+${digitsOnly}`;
    },
  },
  facebook: {
    label: "Facebook",
    icon: FacebookIcon,
    className: "text-foreground hover:underline",
    // Extracts username from ://facebook.com, ignores tracking queries like ?id=
    getHref: (v) => {
      const match = v.match(
        /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.com\/([^/?#]+)/,
      );
      return match ? match[1] : v;
    },
  },
  instagram: {
    label: "Instagram",
    icon: InstagramIcon,
    className: "text-foreground hover:underline",
    // Extracts username from ://instagram.com
    getHref: (v) => {
      const match = v.match(
        /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)/,
      );
      return match ? match[1] : v;
    },
  },
  x: {
    label: "X",
    icon: XIcon,
    className: " text-foreground hover:underline",
    // Extracts username from ://x.com or ://twitter.com
    getHref: (v) => {
      const match = v.match(
        /(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/([^/?#]+)/,
      );
      return match ? match[1] : v;
    },
  },
  phone_number: {
    label: "Call",
    icon: Phone,
    className: " text-foreground hover:underline",
    getHref: (v) => v.replace(/[^0-9+]/g, ""), // Cleans up spaces/dashes, leaves + for country codes
  },
  other: {
    label: "Link",
    icon: Globe,
    className: " text-foreground hover:underline",
    getHref: (v) => v,
  },
};

export interface RawSocialLink {
  id?: string;
  platform: string;
  url_or_number: string;
}

export function SocialLinks({
  socialLinks,
  className,
}: {
  socialLinks: RawSocialLink[] | null | undefined;
  className?: string;
}) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className={cn("flex flex-col flex-wrap gap-2", className)}>
      {socialLinks.map((link, idx) => {
        const key = link.platform
          .toLowerCase()
          .replace(/\s+/g, "_") as SocialPlatform;
        const config = SOCIAL_CONFIG[key] || SOCIAL_CONFIG.other;
        const Icon = config.icon;
        const isPhone = key === "phone_number";
        return (
          <a
            key={link.id}
            href={config.getHref(link.url_or_number)}
            target={isPhone ? undefined : "_blank"}
            rel={isPhone ? undefined : "noopener noreferrer"}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors shadow-sm",
              config.className,
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {config.getHref(link.url_or_number)}
          </a>
        );
      })}
    </div>
  );
}
