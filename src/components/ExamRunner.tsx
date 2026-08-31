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
  Lightbulb,
  Zap,
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Audio State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [ttsStatus, setTtsStatus] = useState<string>("Andrew Neural Audio Ready");

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      const saved = localStorage.getItem("cca_nextjs_exam_state_v2");
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
    }
  }, [filteredQuestions.length]);

  // Save State
  useEffect(() => {
    try {
      const data = {
        answers,
        flagged: Array.from(flagged),
        autoRead,
        lastIndex: currentIndex,
      };
      localStorage.setItem("cca_nextjs_exam_state_v2", JSON.stringify(data));
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
    if (!currentQ || answers[currentQ.global_n] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [currentQ.global_n]: letter }));
  };

  const handleClearAnswer = () => {
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
    setSidebarOpen(false);
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
      localStorage.removeItem("cca_nextjs_exam_state_v2");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between bg-[#090e17] select-none">
      {/* Top Progress Bar */}
      <div className="w-full bg-[#1c2a42] h-1.5 fixed top-16 left-0 z-40">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-[1680px] mx-auto w-full px-3 sm:px-6 py-4 flex-1 flex flex-col">
        {!showSummary ? (
          currentQ && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* =========================================
                  LEFT COLUMN (7 of 12 cols): QUESTION & OPTIONS
              ========================================= */}
              <div className="lg:col-span-7 flex flex-col gap-3.5">
                {/* Meta Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-[#131d2e] border border-[#23344e] text-xs font-bold text-sky-400 flex items-center gap-1 hover:bg-[#1c2a42]"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" /> Palette ({answeredCount}/{total})
                    </button>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400">
                      {currentQ.scenario}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      Q {currentIndex + 1}/{total} (Q#{currentQ.global_n})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleToggleFlag}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                        isFlagged
                          ? "bg-amber-500/20 border-amber-500 text-amber-400"
                          : "bg-[#131d2e] border-[#23344e] text-slate-400 hover:text-white"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? "fill-amber-400" : ""}`} />
                      {isFlagged ? "Flagged" : "Flag"}
                    </button>

                    <button
                      onClick={() => setShowSummary(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#131d2e] border border-[#23344e] hover:border-sky-500 text-xs font-semibold text-sky-400 hover:text-white transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" /> Results
                    </button>
                  </div>
                </div>

                {/* Compact Audio Bar */}
                <div
                  className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    isSpeaking
                      ? "bg-purple-950/20 border-purple-500/50 shadow-md shadow-purple-500/10"
                      : "bg-[#131d2e] border-[#23344e]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-md bg-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
                      {isSpeaking ? (
                        <div className="flex items-center gap-0.5 h-3">
                          <div className="w-0.5 bg-purple-400 wave-bar-1" />
                          <div className="w-0.5 bg-purple-400 wave-bar-2" />
                          <div className="w-0.5 bg-purple-400 wave-bar-3" />
                        </div>
                      ) : (
                        <Headphones className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="font-semibold text-slate-200 truncate">
                      {isSpeaking ? ttsStatus : "Microsoft Andrew Neural Voice Audio"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => speakQuestion(false)}
                      className="px-2.5 py-1 rounded-lg font-bold bg-sky-500 hover:bg-sky-400 text-slate-900 shadow-sm flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" /> Listen
                    </button>

                    <button
                      onClick={() => speakQuestion(true)}
                      className="px-2 py-1 rounded-lg font-medium bg-[#1c2a42] hover:bg-[#23344e] border border-[#23344e] text-slate-200"
                    >
                      <Play className="w-3 h-3 text-indigo-400 inline mr-0.5" /> + Choices
                    </button>

                    {isSpeaking && (
                      <>
                        <button
                          onClick={pauseResumeAudio}
                          className="p-1 rounded-lg bg-[#1c2a42] text-slate-200"
                          title="Pause"
                        >
                          {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
                        </button>
                        <button onClick={stopAudio} className="p-1 rounded-lg bg-rose-950/40 text-rose-300" title="Stop">
                          <Square className="w-3 h-3 fill-rose-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Situation Context Card */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#131d2e] border border-[#23344e] shadow-sm space-y-1.5 text-xs sm:text-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-sky-400" /> Situation Context
                  </div>
                  <div
                    className="text-slate-100 leading-relaxed format-code"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(currentQ.situation) }}
                  />
                </div>

                {/* Question Prompt */}
                <h2
                  className="text-sm sm:text-base font-bold text-white leading-snug format-code"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(currentQ.question) }}
                />

                {/* 4 Options Grid (Compact & Clear) */}
                <div className="grid grid-cols-1 gap-2">
                  {currentQ.options.map((opt) => {
                    let cardBorder = "border-[#23344e] bg-[#131d2e] hover:border-sky-500/50 hover:bg-[#162236]";
                    let badgeClass = "bg-[#1c2a42] text-slate-300 border-[#23344e]";

                    if (isAnswered) {
                      if (opt.letter === currentQ.correct) {
                        cardBorder = "border-emerald-500 bg-emerald-950/25 shadow-sm shadow-emerald-500/10";
                        badgeClass = "bg-emerald-500 text-slate-900 font-bold border-emerald-400";
                      } else if (opt.letter === chosen) {
                        cardBorder = "border-rose-500 bg-rose-950/25 shadow-sm shadow-rose-500/10";
                        badgeClass = "bg-rose-500 text-white font-bold border-rose-400";
                      } else {
                        cardBorder = "border-[#23344e]/50 bg-[#131d2e]/40 opacity-55";
                      }
                    }

                    return (
                      <div
                        key={opt.letter}
                        onClick={() => handleSelectOption(opt.letter)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${cardBorder}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${badgeClass}`}
                        >
                          {opt.letter}
                        </div>
                        <div className="flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-center justify-between flex-wrap gap-1.5">
                          <span
                            className="format-code"
                            dangerouslySetInnerHTML={{ __html: formatMarkdown(opt.text) }}
                          />

                          {isAnswered && opt.letter === currentQ.correct && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-600/60 px-2 py-0.5 rounded-full">
                              <Check className="w-2.5 h-2.5" /> Correct Answer
                            </span>
                          )}

                          {isAnswered && opt.letter === chosen && opt.letter !== currentQ.correct && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-600/60 px-2 py-0.5 rounded-full">
                              <XCircle className="w-2.5 h-2.5" /> Your Selection
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* =========================================
                  RIGHT COLUMN (5 of 12 cols): INSTANT RATIONALE & SOLUTION PANEL
              ========================================= */}
              <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
                {isAnswered ? (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xl space-y-3.5 animate-fadeIn ${
                      isCorrect
                        ? "bg-[#131d2e] border-emerald-500 shadow-emerald-500/10"
                        : "bg-[#131d2e] border-rose-500 shadow-rose-500/10"
                    }`}
                  >
                    {/* Status Header Banner */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isCorrect
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>🎉 Correct! Option {currentQ.correct} is the right answer.</span>
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
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#1c2a42] hover:bg-[#23344e] border border-[#23344e] text-slate-200 flex-shrink-0"
                      >
                        <Volume2 className="w-3 h-3 text-sky-400" /> Read
                      </button>
                    </div>

                    {/* Detailed Explanation Text */}
                    <div className="p-3.5 rounded-xl bg-[#1c2a42] border-l-4 border-emerald-500 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                      <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Architectural Rationale:
                      </div>
                      <div
                        className="format-code"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(currentQ.explanation) }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Placeholder before answer is selected */
                  <div className="p-6 rounded-2xl bg-[#131d2e]/70 border border-[#23344e] text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Live Architectural Rationale</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Select an option on the left (or press <kbd className="px-1.5 py-0.5 rounded bg-[#1c2a42] border border-[#23344e] text-slate-300 font-mono text-[10px]">A-D</kbd>) to instantly inspect the engineering rationale and solution analysis.
                    </p>
                    <div className="pt-2 border-t border-[#23344e]/50 text-[11px] text-slate-400 text-left space-y-1">
                      <div>⌨️ <strong>Shortcuts</strong>: <span className="font-mono text-sky-400">Space</span> (Play/Pause) • <span className="font-mono text-sky-400">N / →</span> (Next) • <span className="font-mono text-sky-400">P / ←</span> (Prev)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          /* =========================================
              FINISH & REVIEW SUMMARY SCREEN
          ========================================= */
          <div className="space-y-6 max-w-3xl mx-auto w-full py-4">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#131d2e] border border-[#23344e] text-center shadow-xl">
              <div className="text-5xl font-black bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent mb-2">
                {Math.round((correctCount / total) * 100)}%
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Practice Exam Results</h3>
              <p className="text-xs text-slate-400 mb-6">
                You answered {correctCount} of {total} questions correctly ({total - answeredCount} unanswered)
              </p>

              <div className="grid grid-cols-4 gap-2.5 max-w-lg mx-auto mb-6 text-center">
                <div className="p-3 rounded-xl bg-[#1c2a42] border border-[#23344e]">
                  <div className="text-xl font-bold text-white">{total}</div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Total</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/50">
                  <div className="text-xl font-bold text-emerald-400">{correctCount}</div>
                  <div className="text-[10px] font-semibold text-emerald-300 uppercase">Correct</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-700/50">
                  <div className="text-xl font-bold text-rose-400">{wrongCount}</div>
                  <div className="text-[10px] font-semibold text-rose-300 uppercase">Wrong</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/50">
                  <div className="text-xl font-bold text-amber-400">{flagged.size}</div>
                  <div className="text-[10px] font-semibold text-amber-300 uppercase">Flagged</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={handleRetakeIncorrect}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md hover:scale-105 transition-all"
                >
                  🔁 Retake Incorrect ({wrongCount})
                </button>
                <button
                  onClick={() => setShowSummary(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-[#1c2a42] hover:bg-[#23344e] border border-[#23344e] text-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Back to Test
                </button>
                <button
                  onClick={handleResetExam}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-rose-950/40 border border-rose-700/50 text-rose-300"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          SLIDE-OVER QUESTION PALETTE DRAWER
      ========================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-80 max-w-full bg-[#0d1522] border-r border-[#23344e] p-4 flex flex-col h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#23344e]">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <LayoutGrid className="w-4 h-4 text-sky-400" />
                Question Palette
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scenario Filter */}
            <div className="mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Filter Scenario
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => {
                  stopAudio();
                  setSelectedScenario(e.target.value);
                  setCurrentIndex(0);
                }}
                className="w-full text-xs font-semibold bg-[#131d2e] border border-[#23344e] text-slate-200 rounded-xl px-2.5 py-2 outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="ALL">All Scenarios ({QUESTIONS_DATA.length} Questions)</option>
                {SCENARIOS.map((sc, i) => (
                  <option key={i} value={sc}>
                    {sc} ({QUESTIONS_DATA.filter((q) => q.scenario === sc).length})
                  </option>
                ))}
              </select>
            </div>

            {/* 88 Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 gap-1.5">
                {filteredQuestions.map((q, idx) => {
                  const ans = answers[q.global_n];
                  const active = idx === currentIndex;
                  const isFlag = flagged.has(q.global_n);

                  let btnClass = "bg-[#131d2e] text-slate-400 border-[#23344e] hover:border-sky-500 hover:text-white";
                  if (active) btnClass = "bg-sky-500/20 text-sky-400 border-sky-500 font-bold shadow-sm";
                  else if (ans !== undefined) {
                    btnClass = ans === q.correct ? "bg-emerald-950/40 text-emerald-400 border-emerald-600/60 font-bold" : "bg-rose-950/40 text-rose-400 border-rose-600/60 font-bold";
                  }

                  return (
                    <button
                      key={q.global_n}
                      onClick={() => handleGoto(idx)}
                      className={`relative aspect-square rounded-lg border text-xs font-semibold transition-all flex items-center justify-center ${btnClass}`}
                    >
                      {q.global_n}
                      {isFlag && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          FIXED BOTTOM NAVIGATION FOOTER
      ========================================= */}
      <footer className="sticky bottom-0 z-40 h-14 bg-[#090e17]/95 backdrop-blur-md border-t border-[#23344e] px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigate(-1)}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-[#23344e] bg-[#131d2e] hover:bg-[#1c2a42] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-200 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <button
            onClick={() => handleNavigate(1)}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="px-3.5 py-1.5 rounded-lg border border-[#23344e] bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-bold text-slate-400 ml-2 hidden sm:inline">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
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
              className="px-2.5 py-1 rounded-lg border border-[#23344e] bg-[#131d2e] hover:bg-[#1c2a42] text-xs font-semibold text-slate-400 hover:text-white"
            >
              Clear Selection
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
