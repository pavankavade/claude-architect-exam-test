export interface ScenarioDetail {
  slug: string;
  scenarioFilter: string | string[];
  title: string;
  badge: string;
  questionCount: number;
  color: string;
  bgGradient: string;
  borderClass: string;
  metaTitle: string;
  metaDescription: string;
  overview: string;
  examWeight: string;
  coreTopics: {
    topic: string;
    description: string;
    bestPractice: string;
  }[];
  keyTakeaways: string[];
}

export const SCENARIO_DETAILS: ScenarioDetail[] = [
  {
    slug: "customer-support-agent",
    scenarioFilter: "Customer Support Agent",
    title: "Customer Support Agent Architecture",
    badge: "Deterministic Logic & Tool Guardrails",
    questionCount: 18,
    color: "from-emerald-500 to-teal-500",
    bgGradient: "bg-teal-950/20",
    borderClass: "border-teal-500/30",
    metaTitle: "Customer Support Agent Questions — Claude Certified Architect Exam Prep",
    metaDescription:
      "Master the Customer Support Agent domain for the Anthropic Claude Certified Architect exam. Practice 18 scenario questions covering deterministic preconditions, tool boundaries, and error recovery.",
    overview:
      "Enterprise customer support agents require strict boundaries between generative reasoning and business-critical operations. The Claude Certified Architect exam heavily tests your ability to favor programmatic guarantees over prompt-only approaches.",
    examWeight: "20% of Exam Score",
    coreTopics: [
      {
        topic: "Programmatic Preconditions vs. System Prompts",
        description:
          "Critical operations like issuing refunds or modifying orders must never rely solely on Claude following prompt instructions.",
        bestPractice:
          "Enforce sequential dependencies in application code (e.g. blocking process_refund until get_customer returns a verified ID).",
      },
      {
        topic: "Tool Boundary Definition & Disambiguation",
        description:
          "When tools have overlapping domains, agents frequently invoke the wrong action or query sub-optimally.",
        bestPractice:
          "Document detailed parameter schemas, clear input formats, usage examples, and explicit anti-goals in each tool description.",
      },
      {
        topic: "Graceful Escalation & Human-in-the-Loop (HITL)",
        description:
          "When user intent falls outside the agent's safe operational domain or confidence drops below thresholds.",
        bestPractice:
          "Implement calibrated confidence gates that pause execution and hand off context cleanly to human representatives.",
      },
    ],
    keyTakeaways: [
      "Code-level deterministic guarantees always beat prompt-level instructions for critical state mutations.",
      "Tool descriptions are the primary routing mechanism for model tool selection — keep them exhaustive.",
      "Never let an autonomous agent retry a failing external API call in an unbounded loop.",
    ],
  },
  {
    slug: "code-generation-with-claude-code",
    scenarioFilter: "Code Generation with Claude Code",
    title: "Code Generation with Claude Code",
    badge: "Developer Tooling & Agentic Coding",
    questionCount: 18,
    color: "from-purple-500 to-indigo-500",
    bgGradient: "bg-indigo-950/20",
    borderClass: "border-indigo-500/30",
    metaTitle: "Code Generation with Claude Code Questions — Practice Exam Simulator",
    metaDescription:
      "Study Claude Code architecture for the Claude Certified Architect certification. Learn Planning Mode, .claude/rules/ glob scoping, subagent worktrees, and tool sandboxing.",
    overview:
      "Claude Code is Anthropic's agentic CLI tool designed for autonomous engineering tasks. This domain tests your architectural understanding of planning workflows, codebase indexing, custom slash commands, and safety boundaries.",
    examWeight: "20% of Exam Score",
    coreTopics: [
      {
        topic: "Planning Mode vs. Direct Execution",
        description:
          "Complex multi-file refactors require separating the discovery/planning phase from code mutation.",
        bestPractice:
          "Require the agent to generate an implementation_plan.md and obtain explicit developer sign-off before making edits.",
      },
      {
        topic: ".claude/rules/ Directory & Path Scoping",
        description:
          "Global system prompts dilute context when working across diverse polyglot codebases.",
        bestPractice:
          "Use scoped rule files with glob pattern headers (e.g., paths: ['**/*.ts', 'src/api/**']) to inject domain rules only when relevant.",
      },
      {
        topic: "Subagent Worktree Isolation",
        description:
          "Concurrent agents modifying the same git working tree cause file corruption and merge conflicts.",
        bestPractice:
          "Isolate subagents in separate git worktrees (`git worktree add`) or branched workspaces to allow parallel execution safely.",
      },
    ],
    keyTakeaways: [
      "Always inspect and verify before mutating code in large enterprise repositories.",
      "Scope rules hierarchically using path globbing rather than one massive system prompt.",
      "Use subagents for narrow, isolated exploration tasks to protect main context window budgets.",
    ],
  },
  {
    slug: "multi-agent-research-system",
    scenarioFilter: "Multi-agent Research System",
    title: "Multi-Agent Research System Design",
    badge: "Agent Topologies & Orchestration",
    questionCount: 18,
    color: "from-blue-500 to-cyan-500",
    bgGradient: "bg-cyan-950/20",
    borderClass: "border-cyan-500/30",
    metaTitle: "Multi-Agent Research Systems — Claude Certified Architect Exam Questions",
    metaDescription:
      "Explore Multi-Agent Research Systems for the Claude Certified Architect exam. Learn coordinator-worker topologies, fan-out/fan-in parallel tools, and context compaction.",
    overview:
      "High-throughput autonomous research requires coordinating specialized models without suffering from context window explosion, hallucination cascading, or communication deadlocks.",
    examWeight: "20% of Exam Score",
    coreTopics: [
      {
        topic: "Coordinator-Worker Topologies",
        description:
          "A lead coordinator decomposes complex queries and delegates subtasks to specialized worker agents.",
        bestPractice:
          "Keep the coordinator prompt focused purely on task planning, routing, and synthesis. Do not burden it with raw research data.",
      },
      {
        topic: "Fan-out / Fan-in Parallel Tool Execution",
        description:
          "Executing research searches sequentially introduces unacceptable latency in deep investigations.",
        bestPractice:
          "Emit parallel tool calls across subagents and synthesize structured outputs in a synchronized aggregation step.",
      },
      {
        topic: "Context Window Compaction & Truncation",
        description:
          "Subagent search transcripts quickly consume hundreds of thousands of tokens if returned raw.",
        bestPractice:
          "Enforce worker agents to summarize their findings into concise, citation-backed digests before returning to the lead coordinator.",
      },
    ],
    keyTakeaways: [
      "Coordinator models must never receive raw unstructured tool outputs from sub-agents.",
      "Set hard recursion depth limits on sub-agent spawning to avoid exponential call tree runaway.",
      "Use structured JSON outputs for inter-agent communication to ensure deterministic parsing.",
    ],
  },
  {
    slug: "claude-code-ci-cd-pipelines",
    scenarioFilter: ["Claude Code for Continuous Integration", "Multi-file Code Review"],
    title: "Claude Code in CI/CD & Batch APIs",
    badge: "Production Automation & Cost Optimization",
    questionCount: 18,
    color: "from-amber-500 to-orange-500",
    bgGradient: "bg-amber-950/20",
    borderClass: "border-amber-500/30",
    metaTitle: "Claude Code in CI/CD & Batch APIs — Practice Questions & Exam Guide",
    metaDescription:
      "Prepare for Claude Code CI/CD and Batch API questions. Learn non-interactive CLI flags, Message Batches 50% discount API, and automated PR review architectures.",
    overview:
      "Integrating LLMs into automated GitHub Actions, GitLab CI, and batch processing pipelines requires architectural discipline regarding timeouts, cost predictability, and non-interactive execution.",
    examWeight: "20% of Exam Score",
    coreTopics: [
      {
        topic: "Non-Interactive Execution (`--print`)",
        description:
          "Interactive CLIs block CI/CD runners indefinitely waiting for terminal user input.",
        bestPractice:
          "Always run Claude Code with `--print` or non-interactive flags alongside pre-configured system instructions.",
      },
      {
        topic: "Anthropic Message Batches API (50% Cost Savings)",
        description:
          "Nightly code reviews, vulnerability scans, and large-scale migrations don't require immediate sub-second latency.",
        bestPractice:
          "Dispatch non-urgent asynchronous workloads via the Message Batches API to receive a guaranteed 50% pricing discount with 24-hour turnaround.",
      },
      {
        topic: "Multi-Pass Architecture Review",
        description:
          "Single-pass reviews often miss subtle edge-case interactions across large diffs.",
        bestPractice:
          "Use a two-pass pipeline: Pass 1 identifies affected modules and interfaces; Pass 2 performs deep semantic and security analysis.",
      },
    ],
    keyTakeaways: [
      "Async batch workloads should always use the Message Batches API for 50% cost reductions.",
      "CI pipelines must specify deterministic exit codes and strict execution timeouts.",
      "Always execute automated tests to validate agent code changes before committing.",
    ],
  },
  {
    slug: "conversational-ai-architecture",
    scenarioFilter: "Conversational AI Architecture Patterns",
    title: "Conversational AI Architecture Patterns",
    badge: "Context Caching & Latency Optimization",
    questionCount: 16,
    color: "from-rose-500 to-pink-500",
    bgGradient: "bg-pink-950/20",
    borderClass: "border-pink-500/30",
    metaTitle: "Conversational AI Architecture Patterns — Claude Certified Architect Exam",
    metaDescription:
      "Practice Conversational AI Architecture questions for the Claude Architect exam. Learn prompt caching breakpoints, context window truncation, and routing classifiers.",
    overview:
      "Architecting low-latency, stateful conversational systems with Claude requires smart token economics, efficient cache reuse, and reliable session persistence.",
    examWeight: "20% of Exam Score",
    coreTopics: [
      {
        topic: "Anthropic Prompt Caching Breakpoints",
        description:
          "Re-sending large system prompts and tool schemas on every turn wastes money and increases Time to First Token (TTFT).",
        bestPractice:
          "Place `cache_control: {'type': 'ephemeral'}` breakpoints on static system prompts and persistent reference documentation for 90% cost savings and 80% lower latency.",
      },
      {
        topic: "Sliding Window & Context Compaction",
        description:
          "As conversation history expands, older turns dilute the model's attention and hit context limits.",
        bestPractice:
          "Compact older turns into a rolling summary while preserving recent user and assistant exchanges verbatim.",
      },
      {
        topic: "Routing Classifiers & Latency Tiering",
        description:
          "Sending trivial queries to Claude 3.7 Sonnet creates unnecessary latency and expense.",
        bestPractice:
          "Route routine queries to Claude 3.5 Haiku, reserving flagship Sonnet models for complex reasoning, tool planning, and code generation.",
      },
    ],
    keyTakeaways: [
      "Structure prompts so static content appears first to maximize cache hits.",
      "Never re-send full tool definitions if the conversation domain can be pre-classified.",
      "Use model tiering (Haiku for triage, Sonnet for deep execution) for optimal price-performance.",
    ],
  },
];
