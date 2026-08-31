export interface QuestionOption {
  letter: "A" | "B" | "C" | "D";
  text: string;
  correct: boolean;
}

export interface Question {
  id: number;
  global_n: number;
  q_num: number;
  scenario: string;
  situation: string;
  question: string;
  options: QuestionOption[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface ExamState {
  answers: Record<number, "A" | "B" | "C" | "D">;
  flagged: number[];
  selectedScenario: string;
  autoRead: boolean;
  theme: "dark" | "light";
  currentIndex: number;
}
