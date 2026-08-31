"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Headphones,
  Play,
  Pause,
  Square,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  Volume2,
  LayoutGrid,
  Filter,
  Check,
  HelpCircle,
  ArrowLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QUESTIONS_DATA, SCENARIOS } from "@/data/questions";
import { Question } from "@/types/exam";

function formatMarkdown(text: string) {
  if (!text) return "";
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

function cleanTextForSpeech(text: string) {
  if (!text) return "";
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[-*]\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ExamRunnerContent() {
  const searchParams = useSearchParams();
  const initialScenario = searchParams.get("scenario") || "ALL";

  // State
  const [selectedScenario, setSelectedScenario] = useState<string>(initialScenario);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [autoRead, setAutoRead] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState<boolean>(false);

  // Audio State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [ttsStatus, setTtsStatus] = useState<string>("Andrew Neural Audio Ready");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadedRef = useRef(false);

  // Filtered Questions
  const filteredQuestions: Question[] = useMemo(() => {
    if (selectedScenario === "ALL") return QUESTIONS_DATA;
    return QUESTIONS_DATA.filter((q) => q.scenario.toLowerCase() === selectedScenario.toLowerCase());
  }, [selectedScenario]);

  const currentQ: Question | undefined = filteredQuestions[currentIndex];
  const total = filteredQuestions.length;

  // Load Saved State
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cca_nextjs_exam_state_v6");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.answers) setAnswers(data.answers);
        if (data.flagged) setFlagged(new Set(data.flagged));
        if (data.autoRead !== undefined) setAutoRead(data.autoRead);
        if (data.lastIndex !== undefined && data.lastIndex < filteredQuestions.length) {
          setCurrentIndex(data.lastIndex);
        }
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    } finally {
      isLoadedRef.current = true;
    }
  }, [filteredQuestions.length]);

  // Save State
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      const data = {
        answers,
        flagged: Array.from(flagged),
        autoRead,
        lastIndex: currentIndex,
      };
      localStorage.setItem("cca_nextjs_exam_state_v6", JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [answers, flagged, autoRead, currentIndex]);

  // Audio Control Methods
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setTtsStatus("Andrew Neural Audio Ready");
  };

  const pauseResumeAudio = () => {
    if (!audioRef.current) return;
    if (isSpeaking && !isPaused) {
      audioRef.current.pause();
      setIsPaused(true);
      setTtsStatus("Audio Paused");
    } else if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
      setTtsStatus("Reading Aloud (Andrew Neural)...");
    }
  };

  const playAudioFile = (src: string, onComplete?: () => void) => {
    stopAudio();
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.onplay = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setTtsStatus("Reading Aloud (Andrew Neural)...");
    };

    audio.onended = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setTtsStatus("Andrew Neural Audio Ready");
      if (onComplete) onComplete();
    };

    audio.onerror = () => {
      console.warn("Audio file missing, falling back to Web Speech", src);
      speakWebSpeech(currentQ ? `${currentQ.situation} ${currentQ.question}` : "");
    };

    audio.play().catch((e) => console.log("Audio playback interrupted", e));
  };

  const speakWebSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    stopAudio();
    const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setTtsStatus("Reading Aloud (Browser Speech)...");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setTtsStatus("Andrew Neural Audio Ready");
    };
    window.speechSynthesis.speak(utterance);
  };

  const speakQuestion = (includeOptions = false) => {
    if (!currentQ) return;
    const file = includeOptions ? `/audio/q_${currentQ.global_n}_opts.mp3` : `/audio/q_${currentQ.global_n}.mp3`;
    playAudioFile(file);
  };

  const speakExplanation = () => {
    if (!currentQ) return;
    const speech = `Correct answer is Option ${currentQ.correct}. Explanation: ${currentQ.explanation}`;
    speakWebSpeech(speech);
  };

  // Option selection
  const handleSelectOption = (letter: "A" | "B" | "C" | "D") => {
    stopAudio(); // Stop any active TTS audio immediately when an answer is chosen
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.global_n]: letter }));
  };

  const handleClearAnswer = () => {
    stopAudio();
    if (!currentQ) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.global_n];
      return next;
    });
  };

  const handleToggleFlag = () => {
    if (!currentQ) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.global_n)) next.delete(currentQ.global_n);
      else next.add(currentQ.global_n);
      return next;
    });
  };

  const handleNavigate = (dir: number) => {
    stopAudio();
    const next = currentIndex + dir;
    if (next >= 0 && next < filteredQuestions.length) {
      setCurrentIndex(next);
      if (autoRead && filteredQuestions[next]) {
        setTimeout(() => {
          const file = `/audio/q_${filteredQuestions[next].global_n}.mp3`;
          playAudioFile(file);
        }, 150);
      }
    }
  };

  const handleGoto = (idx: number) => {
    stopAudio();
    setCurrentIndex(idx);
    setShowSummary(false);
    setMobilePaletteOpen(false); // Auto-close drawer on mobile
  };

  // Confetti on Summary
  useEffect(() => {
    if (showSummary) {
      let correct = 0;
      filteredQuestions.forEach((q) => {
        if (answers[q.global_n] === q.correct) correct++;
      });
      const pct = Math.round((correct / filteredQuestions.length) * 100);
      if (pct >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  }, [showSummary, answers, filteredQuestions]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key)) {
        handleSelectOption(key as "A" | "B" | "C" | "D");
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        const map: Record<string, "A" | "B" | "C" | "D"> = { "1": "A", "2": "B", "3": "C", "4": "D" };
        handleSelectOption(map[e.key]);
      } else if (e.code === "Space") {
        e.preventDefault();
        if (isSpeaking) pauseResumeAudio();
        else speakQuestion(false);
      } else if (key === "S") {
        stopAudio();
      } else if (e.key === "ArrowRight" || key === "N") {
        handleNavigate(1);
      } else if (e.key === "ArrowLeft" || key === "P") {
        handleNavigate(-1);
      } else if (key === "F") {
        handleToggleFlag();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const chosen = currentQ ? answers[currentQ.global_n] : undefined;
  const isAnswered = chosen !== undefined;
  const isCorrect = chosen === currentQ?.correct;
  const isFlagged = currentQ ? flagged.has(currentQ.global_n) : false;

  // Stats
  const answeredCount = filteredQuestions.filter((q) => answers[q.global_n] !== undefined).length;
  const correctCount = filteredQuestions.filter((q) => answers[q.global_n] === q.correct).length;
  const wrongCount = answeredCount - correctCount;
  const progressPct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  // Retake
  const handleRetakeIncorrect = () => {
    const wrongIds = filteredQuestions
      .filter((q) => answers[q.global_n] && answers[q.global_n] !== q.correct)
      .map((q) => q.global_n);

    if (wrongIds.length === 0) {
      alert("No incorrect questions to retake!");
      return;
    }

    setAnswers((prev) => {
      const next = { ...prev };
      wrongIds.forEach((id) => delete next[id]);
      return next;
    });

    setShowSummary(false);
    setCurrentIndex(0);
  };

  const handleResetExam = () => {
    if (confirm("Are you sure you want to reset all answers and progress?")) {
      setAnswers({});
      setFlagged(new Set());
      setShowSummary(false);
      setCurrentIndex(0);
      localStorage.removeItem("cca_nextjs_exam_state_v6");
    }
  };

  // Common Question Grid Component
  const renderQuestionGrid = () => (
    <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
      {filteredQuestions.map((q, idx) => {
        const ans = answers[q.global_n];
        const active = idx === currentIndex;
        const isFlag = flagged.has(q.global_n);

        let btnClass = "bg-[#131d2e] text-slate-300 border-[#23344e] hover:border-sky-500 hover:text-white";
        if (active) btnClass = "bg-sky-500/25 text-sky-300 border-sky-500 font-bold shadow-md shadow-sky-500/20";
        else if (ans !== undefined) {
          btnClass =
            ans === q.correct
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-600/60 font-bold"
              : "bg-rose-950/40 text-rose-400 border-rose-600/60 font-bold";
        }

        return (
          <button
            key={q.global_n}
            onClick={() => handleGoto(idx)}
            className={`relative aspect-square rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${btnClass}`}
            title={`Q${q.global_n}: ${q.scenario}`}
          >
            {q.global_n}
            {isFlag && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] flex flex-col justify-between bg-[#090e17] overflow-x-hidden md:overflow-hidden">
      {/* Top Progress Bar */}
      <div className="w-full bg-[#1c2a42] h-1.5 fixed top-14 sm:top-16 left-0 z-40">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Workspace */}
      <div className="max-w-[1520px] mx-auto w-full px-3 sm:px-6 py-3.5 flex gap-5 flex-1 items-stretch overflow-y-auto md:overflow-hidden pb-20 md:pb-0">
        {/* =========================================
            DESKTOP DOCKED SIDEBAR (w-72)
        ========================================= */}
        {sidebarOpen && (
          <aside className="w-72 min-w-[280px] bg-[#101726] border border-[#23344e] rounded-2xl p-3.5 flex flex-col gap-3 shadow-xl hidden md:flex h-[calc(100vh-145px)] sticky top-20 flex-shrink-0">
            {/* Header & Stats */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#23344e]">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-200">
                <LayoutGrid className="w-4 h-4 text-sky-400" />
                Question Palette
              </div>
              <span className="text-xs font-bold text-sky-400 bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 rounded-full">
                {answeredCount}/{total}
              </span>
            </div>

            {/* Scenario Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-sky-400" /> Filter Domain
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => {
                  stopAudio();
                  setSelectedScenario(e.target.value);
                  setCurrentIndex(0);
                }}
                className="w-full text-xs font-semibold bg-[#162236] border border-[#23344e] text-slate-200 rounded-xl px-2.5 py-2 outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="ALL">All Scenarios ({QUESTIONS_DATA.length})</option>
                {SCENARIOS.map((sc, i) => (
                  <option key={i} value={sc}>
                    {sc} ({QUESTIONS_DATA.filter((q) => q.scenario === sc).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Mini Stats Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs bg-[#162236] p-2 rounded-xl border border-[#23344e]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-semibold">Done</span>
                <strong className="text-white text-sm">{answeredCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-semibold">Correct</span>
                <strong className="text-emerald-400 text-sm">{correctCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-semibold">Flagged</span>
                <strong className="text-amber-400 text-sm">{flagged.size}</strong>
              </div>
            </div>

            {/* 88 Question Button Grid */}
            <div className="flex-1 overflow-y-auto pr-1.5 palette-scrollbar min-h-0">
              {renderQuestionGrid()}
            </div>
          </aside>
        )}

        {/* =========================================
            MOBILE SLIDE-OVER PALETTE DRAWER
        ========================================= */}
        {mobilePaletteOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setMobilePaletteOpen(false)}
            />

            {/* Drawer Content */}
            <div className="relative w-4/5 max-w-xs bg-[#101726] border-r border-[#23344e] h-full p-4 flex flex-col gap-3 shadow-2xl z-10 animate-slideRight">
              <div className="flex items-center justify-between pb-3 border-b border-[#23344e]">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-200">
                  <LayoutGrid className="w-4 h-4 text-sky-400" />
                  Question Palette
                </div>
                <button
                  onClick={() => setMobilePaletteOpen(false)}
                  className="p-1 rounded-lg bg-[#162236] text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scenario Filter */}
              <div>
                <select
                  value={selectedScenario}
                  onChange={(e) => {
                    stopAudio();
                    setSelectedScenario(e.target.value);
                    setCurrentIndex(0);
                  }}
                  className="w-full text-xs font-semibold bg-[#162236] border border-[#23344e] text-slate-200 rounded-xl px-2.5 py-2 outline-none focus:border-sky-500"
                >
                  <option value="ALL">All Scenarios ({QUESTIONS_DATA.length})</option>
                  {SCENARIOS.map((sc, i) => (
                    <option key={i} value={sc}>
                      {sc} ({QUESTIONS_DATA.filter((q) => q.scenario === sc).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs bg-[#162236] p-2 rounded-xl border border-[#23344e]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Done</span>
                  <strong className="text-white">{answeredCount}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Correct</span>
                  <strong className="text-emerald-400">{correctCount}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Flagged</span>
                  <strong className="text-amber-400">{flagged.size}</strong>
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto pr-1 palette-scrollbar">
                {renderQuestionGrid()}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            MAIN QUESTION WORKSPACE
        ========================================= */}
        <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col justify-between overflow-y-auto pr-0 sm:pr-1">
          {!showSummary ? (
            currentQ && (
              <div className="space-y-3">
                {/* Meta Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {/* Desktop Toggle Button */}
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="hidden md:flex px-2.5 py-1 rounded-lg bg-[#131d2e] border border-[#23344e] text-xs font-bold text-slate-300 hover:text-sky-400 items-center gap-1.5 transition-colors"
                      title="Toggle Palette Sidebar"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                      <span>{sidebarOpen ? "Hide Palette" : "Show Palette"}</span>
                    </button>

                    {/* Mobile Open Palette Button */}
                    <button
                      onClick={() => setMobilePaletteOpen(true)}
                      className="md:hidden px-2.5 py-1 rounded-lg bg-[#131d2e] border border-[#23344e] text-xs font-bold text-sky-400 flex items-center gap-1.5"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Palette ({answeredCount}/{total})</span>
                    </button>

                    <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 truncate max-w-[160px] sm:max-w-none">
                      {currentQ.scenario}
                    </span>

                    <span className="text-xs sm:text-sm font-semibold text-slate-300">
                      Q{currentIndex + 1} <span className="text-slate-500">/ {total}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={handleToggleFlag}
                      className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                        isFlagged
                          ? "bg-amber-500/20 border-amber-500 text-amber-400"
                          : "bg-[#131d2e] border-[#23344e] text-slate-400 hover:text-white"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? "fill-amber-400" : ""}`} />
                      <span>{isFlagged ? "Flagged" : "Flag"}</span>
                    </button>

                    <button
                      onClick={() => setShowSummary(true)}
                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg bg-[#131d2e] border border-[#23344e] hover:border-sky-500 text-xs font-semibold text-sky-400 hover:text-white transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Finish &amp;</span> Review
                    </button>
                  </div>
                </div>

                {/* Audio Bar */}
                <div
                  className={`p-2.5 sm:px-3.5 sm:py-2 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
                    isSpeaking
                      ? "bg-purple-950/20 border-purple-500/50 shadow-md"
                      : "bg-[#131d2e] border-[#23344e]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
                      {isSpeaking ? (
                        <div className="flex items-center gap-0.5 h-3.5">
                          <div className="w-0.5 bg-purple-400 wave-bar-1" />
                          <div className="w-0.5 bg-purple-400 wave-bar-2" />
                          <div className="w-0.5 bg-purple-400 wave-bar-3" />
                        </div>
                      ) : (
                        <Headphones className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-semibold text-slate-200 text-xs sm:text-sm truncate">
                      {isSpeaking ? ttsStatus : "Microsoft Andrew Neural Voice Audio"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => speakQuestion(false)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-900 shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </button>

                    <button
                      onClick={() => speakQuestion(true)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1c2a42] hover:bg-[#23344e] border border-[#23344e] text-slate-200 flex items-center justify-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-400 inline" /> + Choices
                    </button>

                    {isSpeaking && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={pauseResumeAudio}
                          className="px-2.5 py-1.5 rounded-lg text-xs bg-[#1c2a42] text-slate-200"
                          title="Pause"
                        >
                          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                        <button onClick={stopAudio} className="px-2.5 py-1.5 rounded-lg text-xs bg-rose-950/40 text-rose-300" title="Stop">
                          <Square className="w-3.5 h-3.5 fill-rose-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Situation Context Box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131d2e] border border-[#23344e] shadow-sm space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-400" /> Situation Context
                  </div>
                  <div
                    className="text-slate-100 text-xs sm:text-[14px] leading-relaxed format-code"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(currentQ.situation) }}
                  />
                </div>

                {/* Question Prompt */}
                <h2
                  className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug format-code my-1"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(currentQ.question) }}
                />

                {/* 4 Options Grid */}
                <div className="space-y-2">
                  {currentQ.options.map((opt) => {
                    let cardBorder = "border-[#23344e] bg-[#131d2e] hover:border-sky-500/50 hover:bg-[#162236] active:scale-[0.99]";
                    let badgeClass = "bg-[#1c2a42] text-slate-300 border-[#23344e]";

                    if (isAnswered) {
                      if (opt.letter === currentQ.correct) {
                        cardBorder = "border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10";
                        badgeClass = "bg-emerald-500 text-slate-900 font-bold border-emerald-400";
                      } else if (opt.letter === chosen) {
                        cardBorder = "border-rose-500 bg-rose-950/20 shadow-md shadow-rose-500/10";
                        badgeClass = "bg-rose-500 text-white font-bold border-rose-400";
                      } else {
                        cardBorder = "border-[#23344e]/60 bg-[#131d2e]/50 opacity-60";
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={opt.letter}
                        onClick={() => handleSelectOption(opt.letter)}
                        className={`w-full text-left py-2.5 px-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${cardBorder}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${badgeClass}`}
                        >
                          {opt.letter}
                        </div>
                        <div className="flex-1 text-xs sm:text-[14px] text-slate-200 leading-snug flex items-center justify-between flex-wrap gap-2">
                          <span
                            className="format-code"
                            dangerouslySetInnerHTML={{ __html: formatMarkdown(opt.text) }}
                          />

                          {isAnswered && opt.letter === currentQ.correct && (
                            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-600/60 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Correct
                            </span>
                          )}

                          {isAnswered && opt.letter === chosen && opt.letter !== currentQ.correct && (
                            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-600/60 px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" /> Your Choice
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* =========================================
                    INLINE EXPLANATION CARD
                ========================================= */}
                {isAnswered && (
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all shadow-lg space-y-2.5 mt-2 animate-fadeIn ${
                      isCorrect
                        ? "bg-[#131d2e] border-emerald-500 shadow-emerald-500/10"
                        : "bg-[#131d2e] border-rose-500 shadow-rose-500/10"
                    }`}
                  >
                    {/* Header Banner */}
                    <div
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border flex-wrap gap-2 ${
                        isCorrect
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>🎉 Correct! Option {currentQ.correct} is right.</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            <span>
                              ❌ Incorrect. Correct is{" "}
                              <strong className="text-emerald-400">Option {currentQ.correct}</strong>.
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={speakExplanation}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#1c2a42] hover:bg-[#23344e] border border-[#23344e] text-slate-200 flex-shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-sky-400" /> Read Rationale
                      </button>
                    </div>

                    {/* Explanation Body */}
                    <div className="p-3 rounded-xl bg-[#1c2a42] border-l-4 border-emerald-500 text-xs sm:text-[13.5px] text-slate-200 leading-relaxed space-y-1">
                      <div className="font-bold text-slate-100 text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Architectural Rationale:
                      </div>
                      <div
                        className="format-code"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(currentQ.explanation) }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            /* =========================================
                FINISH & REVIEW SUMMARY SCREEN
            ========================================= */
            <div className="space-y-4 animate-fadeIn py-4 max-w-2xl mx-auto text-center">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#131d2e] border border-[#23344e] shadow-2xl">
                <div className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent mb-1">
                  {Math.round((correctCount / total) * 100)}%
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Exam Results Summary</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-5">
                  You answered {correctCount} of {total} questions correctly ({total - answeredCount} unanswered)
                </p>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg mx-auto mb-5 text-center">
                  <div className="p-3 rounded-xl bg-[#1c2a42] border border-[#23344e]">
                    <div className="text-lg sm:text-xl font-bold text-white">{total}</div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Total</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/50">
                    <div className="text-lg sm:text-xl font-bold text-emerald-400">{correctCount}</div>
                    <div className="text-[10px] font-semibold text-emerald-300 uppercase">Correct</div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-700/50">
                    <div className="text-lg sm:text-xl font-bold text-rose-400">{wrongCount}</div>
                    <div className="text-[10px] font-semibold text-rose-300 uppercase">Wrong</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/50">
                    <div className="text-lg sm:text-xl font-bold text-amber-400">{flagged.size}</div>
                    <div className="text-[10px] font-semibold text-amber-300 uppercase">Flagged</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={handleRetakeIncorrect}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    🔁 Retake Incorrect ({wrongCount})
                  </button>

                  <button
                    onClick={() => setShowSummary(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs bg-[#1c2a42] hover:bg-[#23344e] border border-[#23344e] text-slate-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Back to Test
                  </button>

                  <button
                    onClick={handleResetExam}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          FIXED / STICKY BOTTOM NAVIGATION FOOTER
      ========================================= */}
      <footer className="fixed md:sticky bottom-0 left-0 right-0 h-14 bg-[#090e17]/95 backdrop-blur-md border-t border-[#23344e] px-3 sm:px-6 flex items-center justify-between shadow-xl z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={() => handleNavigate(-1)}
            disabled={currentIndex === 0}
            className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-[#23344e] bg-[#131d2e] hover:bg-[#1c2a42] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-200 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <button
            onClick={() => handleNavigate(1)}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="px-3.5 sm:px-4 py-1.5 rounded-lg border border-[#23344e] bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-bold text-slate-300 ml-1 sm:ml-2">
            {currentIndex + 1} <span className="text-slate-500">/ {total}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3.5">
          <label className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRead}
              onChange={(e) => setAutoRead(e.target.checked)}
              className="rounded bg-[#131d2e] border-[#23344e] text-sky-500"
            />
            Auto-read next
          </label>

          {isAnswered && (
            <button
              onClick={handleClearAnswer}
              className="px-2.5 sm:px-3 py-1 rounded-lg border border-[#23344e] bg-[#131d2e] hover:bg-[#1c2a42] text-xs font-semibold text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function ExamRunner() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Exam Simulator...</div>}>
      <ExamRunnerContent />
    </Suspense>
  );
}
