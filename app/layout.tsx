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

export const metadata: Metadata = {
  title: "Harold Madjos | Automation & AI Systems Specialist",
  description: "Portfolio of Harold Madjos, an automation and AI systems specialist building GoHighLevel workflows, integrations, dashboards, and growth systems.",
  keywords: ["GHL Expert", "Automation", "WordPress", "Web Development", "Integration"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
