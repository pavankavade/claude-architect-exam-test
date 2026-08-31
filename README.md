# 🎧 Claude Certified Architect — Practice Exam & Audio Simulator

A production Next.js 15 application designed to help developers and AI architects prepare for the **Anthropic Claude Certified Architect — Foundations** certification.

Live Demo URL: **`https://claude-architect-exam.pages.dev`**

---

## ⚡ Features

- **88 Realistic Exam Scenario Questions**: Covers Multi-agent Research Systems, Customer Support Deterministic Guards, Code Generation with Claude Code, and CI/CD Pipelines.
- **⚡ Zero-Latency Pre-Rendered Voice Audio**: 176 pre-synthesized audio tracks using **Microsoft Edge Andrew Neural (`en-US-AndrewNeural`)**.
- **💡 Immediate Inline Solution Explanations**: Select any option to immediately reveal whether your answer is correct, along with in-depth engineering rationales.
- **📑 Question Palette & Scenario Filter**: Easily filter questions by scenario domain, track progress, bookmark questions, and jump directly to any question.
- **📊 Finish & Review Score Report**: Scenario performance breakdown, celebratory score confetti, and "Retake Incorrect Questions" mode.
- **🔍 Full Google SEO Optimization**: Pre-rendered static pages, OpenGraph social preview tags, `robots.txt`, `sitemap.xml`, and Google Rich Snippet JSON-LD schemas (`Quiz`, `FAQPage`, `Course`).

---

## 🚀 How to Deploy on Cloudflare Pages (Free Tier)

### Step 1: Push this repo to GitHub
```bash
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**.
2. Click **Create Application** → **Pages** → **Connect to Git**.
3. Select this repository: `claude-architect-exam-test`.
4. Configure Build Settings:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/`
5. Click **Save and Deploy**.

Cloudflare will automatically build and assign your free subdomain:  
**`https://claude-architect-exam.pages.dev`**

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build static export for Cloudflare Pages
npm run build
```

---

## 📂 Project Structure

```
├── public/
│   ├── audio/              # 176 pre-rendered Edge Andrew Neural .mp3 files
│   ├── sitemap.xml         # Google search console sitemap
│   └── robots.txt          # Search crawler index rules
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with fonts, OpenGraph & JSON-LD schemas
│   │   ├── page.tsx        # High-converting SEO Landing Page
│   │   ├── exam/page.tsx   # Interactive Practice Exam route
│   │   └── globals.css     # Tailwind & theme variables
│   ├── components/
│   │   ├── Navbar.tsx      # Navigation & theme toggle
│   │   ├── Footer.tsx      # SEO links & partner certification links
│   │   └── ExamRunner.tsx  # Interactive test engine with audio player & inline explanations
│   ├── data/
│   │   └── questions.ts    # Type-safe dataset of all 88 questions
│   └── types/
│       └── exam.ts         # TypeScript interfaces
├── next.config.ts          # Static export configuration (output: 'export')
└── tailwind.config.ts
```
