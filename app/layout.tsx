import type { Metadata } from "next";
import { Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
  || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Harold Madjos | Automation & AI Systems Specialist",
  description: "Portfolio of Harold Madjos, an automation and AI systems specialist building GoHighLevel workflows, integrations, dashboards, and growth systems.",
  keywords: ["GHL Expert", "Automation", "WordPress", "Web Development", "Integration"],
  applicationName: "Harold Madjos Portfolio",
  openGraph: {
    type: "website",
    siteName: "Harold Madjos Portfolio",
    title: "Harold Madjos | Automation & AI Systems Specialist",
    description: "Automation, integrations, and AI systems. Explore Harold's projects and skills.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harold Madjos | Automation & AI Systems Specialist",
    description: "Automation, integrations, and AI systems. Explore Harold's projects and skills.",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
