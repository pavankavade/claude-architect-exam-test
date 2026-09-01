import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Headphones,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SCENARIO_DETAILS, ScenarioDetail } from "@/data/scenarioData";
import { QUESTIONS_DATA } from "@/data/questions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SCENARIO_DETAILS.map((sc) => ({
    slug: sc.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scenario = SCENARIO_DETAILS.find((s) => s.slug === slug);
  if (!scenario) return { title: "Scenario Not Found" };

  return {
    title: `${scenario.title} — Claude Certified Architect Exam Prep`,
    description: scenario.metaDescription,
    alternates: {
      canonical: `/scenarios/${scenario.slug}/`,
    },
    openGraph: {
      title: `${scenario.title} Practice Questions & Architectural Guide`,
      description: scenario.metaDescription,
      url: `https://claude-architect-prep.pages.dev/scenarios/${scenario.slug}/`,
      type: "article",
    },
  };
}

export default async function ScenarioPage({ params }: Props) {
  const { slug } = await params;
  const scenario = SCENARIO_DETAILS.find((s) => s.slug === slug);

  if (!scenario) {
    notFound();
  }

  // Filter questions for this scenario
  const matchingQuestions = QUESTIONS_DATA.filter((q) => {
    if (Array.isArray(scenario.scenarioFilter)) {
      return scenario.scenarioFilter.includes(q.scenario);
    }
    return q.scenario.toLowerCase() === scenario.scenarioFilter.toLowerCase();
  });

  const examScenarioParam = Array.isArray(scenario.scenarioFilter)
    ? scenario.scenarioFilter[0]
    : scenario.scenarioFilter;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://claude-architect-prep.pages.dev/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Scenarios",
            item: "https://claude-architect-prep.pages.dev/#scenarios",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: scenario.title,
            item: `https://claude-architect-prep.pages.dev/scenarios/${scenario.slug}/`,
          },
        ],
      },
      {
        "@type": "Quiz",
        name: `${scenario.title} Practice Quiz`,
        description: scenario.metaDescription,
        educationalLevel: "Advanced",
        numberOfQuestions: matchingQuestions.length,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-sky-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/#scenarios" className="hover:text-sky-400 transition-colors">
          Scenarios
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-sky-400">{scenario.title}</span>
      </nav>

      {/* Hero Section */}
      <div className={`p-6 sm:p-10 rounded-3xl bg-[#101726] border ${scenario.borderClass} shadow-2xl relative overflow-hidden`}>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-xs font-bold text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{scenario.badge}</span>
            <span className="text-slate-500">•</span>
            <span>{scenario.examWeight}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {scenario.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {scenario.overview}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/exam?scenario=${encodeURIComponent(examScenarioParam)}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Practice All {matchingQuestions.length} Questions (Exam Mode)</span>
            </Link>

            <Link
              href="/exam"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-[#131d2e] hover:bg-[#1c2a42] border border-[#23344e] text-slate-200"
            >
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>Full 88-Question Simulator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Architectural Syllabus & Best Practices */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            Exam Syllabus Deep Dive
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Core Architectural Principles Tested
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scenario.coreTopics.map((topic, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#131d2e] border border-[#23344e] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Topic {i + 1}
                </div>
                <h4 className="font-bold text-slate-100 text-base">{topic.topic}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1c2a42] border-l-4 border-emerald-500 text-xs text-slate-200">
                <strong className="text-emerald-400 block mb-1">Architectural Best Practice:</strong>
                {topic.bestPractice}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways Card */}
      <section className="p-6 rounded-2xl bg-[#131d2e] border border-[#23344e] space-y-3">
        <h4 className="font-bold text-slate-200 text-sm sm:text-base flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          High-Yield Exam Rules to Remember:
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
          {scenario.keyTakeaways.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sample Scenario Practice Questions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
              Interactive Practice
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Sample Questions from this Domain ({matchingQuestions.length} Total)
            </h3>
          </div>

          <Link
            href={`/exam?scenario=${encodeURIComponent(examScenarioParam)}`}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            Open in Full Exam Simulator <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {matchingQuestions.slice(0, 3).map((q, idx) => (
            <div
              key={q.global_n}
              className="p-5 rounded-2xl bg-[#131d2e] border border-[#23344e] space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="text-sky-400 font-bold">Sample Question #{idx + 1} (Q#{q.global_n})</span>
                <span className="px-2 py-0.5 rounded bg-[#1c2a42] text-slate-300">
                  {q.scenario}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 bg-[#162236] p-3 rounded-xl border border-[#23344e]/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Situation Context:
                </span>
                {q.situation}
              </div>

              <h4 className="font-bold text-white text-sm sm:text-base">{q.question}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt) => (
                  <div
                    key={opt.letter}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                      opt.correct
                        ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-semibold"
                        : "border-[#23344e] bg-[#101726] text-slate-300"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        opt.correct ? "bg-emerald-500 text-slate-900" : "bg-[#1c2a42] text-slate-400"
                      }`}
                    >
                      {opt.letter}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#1c2a42]/80 border-l-4 border-emerald-500 text-xs text-slate-300">
                <strong className="text-emerald-400 block mb-0.5">Explanation &amp; Architectural Rationale:</strong>
                {q.explanation}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href={`/exam?scenario=${encodeURIComponent(examScenarioParam)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch All {matchingQuestions.length} Questions with Voice Audio</span>
          </Link>
        </div>
      </section>

      {/* Explore Other Scenarios */}
      <section className="pt-8 border-t border-[#23344e] space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Other Exam Domains:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {SCENARIO_DETAILS.filter((s) => s.slug !== scenario.slug).map((sc) => (
            <Link
              key={sc.slug}
              href={`/scenarios/${sc.slug}/`}
              className="p-3.5 rounded-xl bg-[#131d2e] border border-[#23344e] hover:border-sky-500 text-xs font-semibold text-slate-200 hover:text-white transition-all block group"
            >
              <div className="text-sky-400 group-hover:underline font-bold mb-1 truncate">
                {sc.title}
              </div>
              <div className="text-[11px] text-slate-400">{sc.questionCount} Questions</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
