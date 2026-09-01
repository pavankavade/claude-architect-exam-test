import Link from "next/link";
import {
  Sparkles,
  Headphones,
  BookOpen,
  CheckCircle2,
  Cpu,
  Bot,
  Terminal,
  ShieldAlert,
  ArrowRight,
  Flame,
  Clock,
  Layers,
  HelpCircle,
  Award,
} from "lucide-react";
import { QUESTIONS_DATA } from "@/data/questions";

export default function HomePage() {
  const totalQuestions = QUESTIONS_DATA.length;

  const scenarios = [
    {
      title: "Multi-agent Research Systems",
      slug: "multi-agent-research-system",
      scenarioFilter: "Multi-agent Research System",
      icon: Bot,
      color: "from-blue-500 to-cyan-500",
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20",
      description:
        "Coordinator-subagent topology, deterministic error propagation, task decomposition, and avoiding context dilution in long research outputs.",
      count: 18,
      tag: "Agentic Systems",
    },
    {
      title: "Customer Support Agents",
      slug: "customer-support-agent",
      scenarioFilter: "Customer Support Agent",
      icon: ShieldAlert,
      color: "from-emerald-500 to-teal-500",
      border: "border-teal-500/30",
      bg: "bg-teal-950/20",
      description:
        "Programmatic preconditions, tool description boundary design, deterministic guards over prompt-only approaches, and escalation calibration.",
      count: 18,
      tag: "Deterministic Logic",
    },
    {
      title: "Code Generation with Claude Code",
      slug: "code-generation-with-claude-code",
      scenarioFilter: "Code Generation with Claude Code",
      icon: Terminal,
      color: "from-purple-500 to-indigo-500",
      border: "border-indigo-500/30",
      bg: "bg-indigo-950/20",
      description:
        "Planning mode for large refactors, .claude/rules/ directory scoping with glob patterns, custom slash commands, and subagent worktrees.",
      count: 18,
      tag: "Developer Tooling",
    },
    {
      title: "Claude Code in CI/CD & Batch APIs",
      slug: "claude-code-ci-cd-pipelines",
      scenarioFilter: "Claude Code for Continuous Integration",
      icon: Cpu,
      color: "from-amber-500 to-orange-500",
      border: "border-amber-500/30",
      bg: "bg-amber-950/20",
      description:
        "Non-interactive --print CLI execution, Message Batches API (50% savings) vs synchronous pre-merge hooks, and multi-pass code reviews.",
      count: 18,
      tag: "Production Pipelines",
    },
    {
      title: "Conversational AI Architecture Patterns",
      slug: "conversational-ai-architecture",
      scenarioFilter: "Conversational AI Architecture Patterns",
      icon: Layers,
      color: "from-rose-500 to-pink-500",
      border: "border-pink-500/30",
      bg: "bg-pink-950/20",
      description:
        "Context compaction, Anthropic prompt caching breakpoints (90% savings), routing classifiers, and latency tiering between Haiku and Sonnet.",
      count: 16,
      tag: "Context & Caching",
    },
  ];

  const faqs = [
    {
      q: "What is the Claude Certified Architect — Foundations exam?",
      a: "It is the official certification from Anthropic testing advanced agentic architecture, tool calling, context management, Claude Code workflows, and reliability patterns for enterprise generative AI applications.",
    },
    {
      q: "How many questions are in this practice test?",
      a: "This practice test contains 88 comprehensive scenario-based questions matching the format, depth, and difficulty of the real certification examination.",
    },
    {
      q: "How does the voice audio narration feature work?",
      a: "All questions have been pre-rendered into high-definition audio using Microsoft Edge Andrew Neural voice (`en-US-AndrewNeural`). Questions play with 0ms latency directly in your browser without requiring server synthesis.",
    },
    {
      q: "Why are solution explanations shown immediately in the UI?",
      a: "Immediate feedback is scientifically proven to reinforce architectural reasoning. As soon as you select an option, the system reveals whether your choice is correct, marks the correct answer, and explains the full engineering rationale.",
    },
    {
      q: "Is this practice exam 100% free?",
      a: "Yes! There are no paywalls, subscriptions, or sign-up requirements. You can practice as many times as you like, retake incorrect questions, and filter by scenario.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Glow background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131d2e] border border-[#23344e] text-xs font-semibold text-sky-400 mb-6 shadow-sm">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Updated with {totalQuestions} Scenario-Based Questions</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Microsoft Edge Andrew Neural Audio</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Pass the{" "}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Claude Certified Architect
          </span>{" "}
          Exam with Confidence
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          The ultimate interactive practice simulator. Rehearse real-world agent design, tool boundaries, CI/CD automation,
          and multi-agent topologies with instant solution rationales and natural voice narration.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/exam"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5" />
            Start Practice Test (Free)
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/exam?scenario=Multi-agent+Research+System"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold bg-[#131d2e] hover:bg-[#1c2a42] border border-[#23344e] text-slate-200 hover:text-white transition-colors"
          >
            <Headphones className="w-5 h-5 text-sky-400" />
            Listen with Audio Simulator
          </Link>
        </div>

        {/* Feature Pill Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#131d2e]/80 border border-[#23344e]">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-200">88 Exam Scenarios</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#131d2e]/80 border border-[#23344e]">
            <Headphones className="w-5 h-5 text-sky-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-200">0ms Neural Audio TTS</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#131d2e]/80 border border-[#23344e]">
            <Layers className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-200">Instant Solution Rationale</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#131d2e]/80 border border-[#23344e]">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-200">100% Free &amp; Open Access</span>
          </div>
        </div>
      </section>

      {/* =========================================
          SCENARIOS DEEP DIVE SECTION
      ========================================= */}
      <section id="scenarios" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">Architectural Domains</h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">4 Core Exam Scenarios Tested</h3>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-2">
            The Claude Certified Architect examination evaluates your ability to make deterministic, high-impact design
            decisions across four realistic industry environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <div
                key={i}
                className={`relative rounded-2xl p-6 sm:p-8 bg-[#131d2e] border ${sc.border} flex flex-col justify-between hover:border-sky-500/50 transition-all group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${sc.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1c2a42] text-slate-300 border border-[#23344e]">
                      {sc.tag}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {sc.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">{sc.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#23344e]/60 text-xs flex-wrap gap-2">
                  <Link
                    href={`/scenarios/${sc.slug}/`}
                    className="font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1.5 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>Domain Syllabus &amp; Guide</span>
                  </Link>
                  <Link
                    href={`/exam?scenario=${encodeURIComponent(sc.scenarioFilter)}`}
                    className="font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Practice ({sc.count} Qs)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          WHY THIS SIMULATOR (FEATURES GRID)
      ========================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-b from-[#131d2e] to-[#0d1522] border border-[#23344e] p-8 sm:p-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Designed for Accelerated Learning</h3>
            <p className="text-sm sm:text-base text-slate-400">
              Unlike static PDF dumps, this simulator reinforces deep mental models through active recall, voice listening,
              and instant architectural feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Pre-Rendered Neural Audio</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Listen on your commute or during focused study. Pre-synthesized with Microsoft Andrew Neural for zero loading latency.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Immediate Direct Rationale</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Explanations appear immediately in the UI upon selecting an option, explaining exactly why the right approach succeeds and others fail.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Retake Missed Questions</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Review your performance breakdown by scenario and retake only the questions you got wrong until you achieve 100% mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FAQ SECTION (WITH JSON-LD INTEGRATION)
      ========================================= */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full scroll-mt-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Everything You Need to Know</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group p-5 rounded-2xl bg-[#131d2e] border border-[#23344e] open:border-sky-500/40 transition-all"
            >
              <summary className="font-bold text-slate-100 text-sm sm:text-base cursor-pointer list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-sky-400 text-lg font-mono group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#23344e]/50 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* =========================================
          FINAL BOTTOM CTA BANNER
      ========================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600 p-8 sm:p-12 text-white shadow-2xl shadow-indigo-500/20">
          <h3 className="text-2xl sm:text-4xl font-extrabold mb-4">Ready to Test Your Architectural Skills?</h3>
          <p className="text-sm sm:text-base text-sky-100 max-w-xl mx-auto mb-8">
            Launch the free 88-question simulator now. No login or credit card required.
          </p>
          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-white text-indigo-900 hover:bg-slate-100 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Launch Practice Exam Now
          </Link>
        </div>
      </section>
    </div>
  );
}
