import { Metadata } from "next";
import ExamRunner from "@/components/ExamRunner";

export const metadata: Metadata = {
  title: "Interactive Practice Exam — Claude Certified Architect Foundations",
  description:
    "Take the full 88-question scenario-based Claude Certified Architect practice test with Microsoft Edge Andrew Neural audio narration, real-time feedback, and solution rationales.",
};

export default function ExamPage() {
  return <ExamRunner />;
}
