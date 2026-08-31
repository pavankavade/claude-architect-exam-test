import Link from "next/link";
import { Headphones, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#23344e] bg-[#090e17] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-100 text-base">Claude Certified Architect Practice Exam</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-4">
            An open-source interactive exam prep tool featuring 88 scenario-based practice questions with high-definition
            Microsoft Edge Andrew Neural text-to-speech audio narration and architectural explanations.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Free &amp; Open Access • Zero Sign-up Required</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Exam Scenarios</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/exam?scenario=Multi-agent+Research+System" className="hover:text-sky-400 transition-colors">
                Multi-agent Research Systems
              </Link>
            </li>
            <li>
              <Link href="/exam?scenario=Customer+Support+Agent" className="hover:text-sky-400 transition-colors">
                Customer Support Agents
              </Link>
            </li>
            <li>
              <Link href="/exam?scenario=Code+Generation+with+Claude+Code" className="hover:text-sky-400 transition-colors">
                Code Generation with Claude Code
              </Link>
            </li>
            <li>
              <Link href="/exam?scenario=Claude+Code+for+Continuous+Integration" className="hover:text-sky-400 transition-colors">
                Claude Code in CI/CD Pipelines
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/exam" className="hover:text-sky-400 transition-colors font-semibold text-sky-400">
                🚀 Launch Full 88-Question Exam
              </Link>
            </li>
            <li>
              <a
                href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                Official Anthropic Exam Portal ↗
              </a>
            </li>
            <li>
              <a
                href="https://github.com/pavankavade/claude-architect-exam-test"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                GitHub Repository ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#1c2a42] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} Claude Certified Architect Exam Prep Simulator. Community-driven resource.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI architects &amp; developers worldwide.
        </p>
      </div>
    </footer>
  );
}
