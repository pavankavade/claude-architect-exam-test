import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Claude Certified Architect Practice Exam — 88 Practice Questions & Audio TTS",
  description:
    "Free interactive practice test for the Anthropic Claude Certified Architect — Foundations certification. Includes 88 real-world exam scenario questions, Microsoft Edge Andrew Neural audio narration, and deep architectural rationale.",
  keywords: [
    "Claude Certified Architect",
    "Claude Certified Architect exam",
    "Claude certification practice test",
    "Anthropic certification practice questions",
    "Claude Code exam dumps",
    "Claude Agent SDK practice test",
    "Claude Architect foundations exam questions",
    "Claude TTS practice exam",
  ],
  authors: [{ name: "Claude Certified Architect Community" }],
  creator: "Claude Certified Architect Community",
  publisher: "Claude Certified Architect Practice Simulator",
  metadataBase: new URL("https://claude-architect-exam.pages.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claude-architect-exam.pages.dev",
    siteName: "Claude Certified Architect Practice Exam",
    title: "Claude Certified Architect Practice Exam — 88 Real Exam Scenario Questions with Audio",
    description:
      "Pass the Anthropic Claude Certified Architect — Foundations certification on your first attempt with 88 interactive practice questions, instant solution rationales, and voice narration.",
    images: [
      {
        url: "https://claude-architect-exam.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Claude Certified Architect Practice Exam Simulator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Certified Architect Practice Exam — 88 Questions & Audio TTS",
    description:
      "Interactive practice exam with 88 scenario-based questions, Andrew Neural voice narration, and in-depth architectural explanations.",
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
  verification: {
    google: "zzczwXhQbMkNmbPxPNv21zp5Hfgni7f-7Uo0-bnpnAU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured JSON-LD Data for Google Search Engine Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://claude-architect-exam.pages.dev/#website",
        url: "https://claude-architect-exam.pages.dev",
        name: "Claude Certified Architect Practice Exam Simulator",
        description: "Interactive exam simulator with audio text-to-speech for Claude Certified Architect Foundations",
        publisher: {
          "@type": "Organization",
          name: "Claude Certified Architect Community",
        },
      },
      {
        "@type": "Course",
        "@id": "https://claude-architect-exam.pages.dev/#course",
        name: "Claude Certified Architect — Foundations Practice Exam",
        description: "Comprehensive exam prep containing 88 scenario-based questions across 4 core Claude architectural domains.",
        provider: {
          "@type": "Organization",
          name: "Claude Certified Architect Community",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT2H",
        },
      },
      {
        "@type": "Quiz",
        name: "Claude Certified Architect Foundations Practice Test",
        description: "88 realistic multiple-choice questions covering Multi-Agent Systems, Customer Support, Claude Code in CI/CD, and Enterprise Architecture.",
        educationalLevel: "Advanced",
        typicalAgeRange: "18+",
      },
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090e17] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
