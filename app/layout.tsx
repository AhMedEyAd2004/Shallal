import { ThemeProvider } from "@/providers/theme-provide";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter, Stack_Sans_Notch } from "next/font/google";
import "./globals.css";

const stackSansNotch = Stack_Sans_Notch({
  variable: "--font-stack-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-sanserif",
  subsets: ["latin"],
  display: "swap",
});

//next js commit bugged

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000",
  ),
  title: {
    template: "%s | Shallal",
    default: "Shallal | Mobile & Web Management Systems",
  },
  description:
    "Shallal is a software development company building custom mobile and web management systems for businesses and organizations.",
  keywords: [
    "Shallal",
    "شلال",
    "برمجة",
    "تطبيقات",
    "برامج",
    "شركة تطوير",
    "تطوير برمجيات",
    "تطوير تطبيقات",
    "شلال للبرمجة",
    "شركة شلال",
    "software development",
    "web management system",
    "mobile app development",
    "business management software",
    "custom software solutions",
    "shallal",
    "shallal soft",
    "software companies",
    "app development companies",
    "web development companies",
    "business management software companies",
    "custom software development companies",
    "software development services",
    "app development services",
    "web development services",
    "business management software services",
    "custom software development services",
  ],
  authors: [{ name: "Ahmed Eyad" }],
  creator: "Ahmed Eyad",
  publisher: "Shallal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    title: "Shallal | Mobile & Web Management Systems",
    description:
      "Shallal is a software development company building custom mobile and web management systems for businesses and organizations.",
    siteName: "Shallal",
    images: [
      {
        url: "/metaDataLogo.jpg",
        width: 1200,
        height: 630,
        alt: "Shallal Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shallal | Mobile & Web Management Systems",
    description:
      "Shallal is a software development company building custom mobile and web management systems for businesses and organizations.",
    images: ["/metaDataLogo.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${stackSansNotch.variable} h-full font-inter antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
