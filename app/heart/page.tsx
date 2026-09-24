"use client";

import { useState } from "react";
import Link from "next/link";

type Option = { label: string; points: number };
type Question = { id: string; text: string; options: Option[] };

const questions: Question[] = [
  { id: "age", text: "How old are you?", options: [
    { label: "Under 40", points: 0 },
    { label: "40-54", points: 1 },
    { label: "55-64", points: 2 },
    { label: "65 or older", points: 3 },
  ]},
  { id: "smoke", text: "Do you currently smoke or use nicotine (vaping included)?", options: [
    { label: "No, and never have", points: 0 },
    { label: "No, but used to", points: 1 },
    { label: "Yes", points: 4 },
  ]},
  { id: "active", text: "Do you usually get at least 150 minutes of moderate activity a week (about 20-30 min/day)?", options: [
    { label: "Yes", points: 0 },
    { label: "Some, but less than that", points: 1 },
    { label: "Rarely or never", points: 2 },
  ]},
  { id: "diet", text: "How would you describe your typical diet?", options: [
    { label: "Mostly whole foods, vegetables, fruit, whole grains", points: 0 },
    { label: "A mix of whole and processed foods", points: 1 },
    { label: "Mostly processed or fast food", points: 3 },
  ]},
  { id: "sleep", text: "How many hours do you usually sleep a night?", options: [
    { label: "7-9 hours", points: 0 },
    { label: "6 or under 7 hours", points: 1 },
    { label: "Under 6, or over 9", points: 2 },
  ]},
  { id: "weight", text: "Would you say your weight is in a healthy range for your height?", options: [
    { label: "Yes", points: 0 },
    { label: "Somewhat above", points: 1 },
    { label: "Significantly above", points: 3 },
  ]},
  { id: "family", text: "Has a parent or sibling had a heart attack or stroke before age 60?", options: [
    { label: "No", points: 0 },
    { label: "Yes", points: 3 },
  ]},
];

// Optional clinical inputs
type BPBand = "normal" | "elevated" | "high" | "unknown";
type CholBand = "good" | "borderline" | "high" | "unknown";

function bpPoints(b: BPBand) {
  if (b === "normal") return 0;
  if (b === "elevated") return 1;
  if (b === "high") return 3;
  return 0; // unknown contributes nothing, doesn't penalize
}
function cholPoints(c: CholBand) {
  if (c === "good") return 0;
  if (c === "borderline") return 1;
  if (c === "high") return 3;
  return 0;
}

function band(score: number, usedClinical: boolean) {
  const cap = usedClinical ? 25 : 19;
  const pct = score / cap;
  if (pct < 0.25) return { label: "Low", detail: "Your habits and history put you in a lower-risk range for heart disease and stroke." };
  if (pct < 0.5) return { label: "Moderate", detail: "A few factors are adding to your long-term cardiovascular risk." };
  if (pct < 0.75) return { label: "Elevated", detail: "Several factors are meaningfully raising your long-term risk." };
  return { label: "High", detail: "A number of factors are combining to raise your risk significantly." };
}

const advice: Record<string, string> = {
  smoke: "Quitting smoking or nicotine use is the single biggest change you can make for heart risk.",
  active: "Building up to 150 minutes of moderate activity a week, such as brisk walking.",
  diet: "Shifting toward more whole foods: vegetables, fruit, whole grains, and less processed food.",
  sleep: "Aiming for 7-9 hours of sleep a night.",
  weight: "Gradual weight loss, which also improves blood pressure and cholesterol over time.",
  bp: "Managing blood pressure through diet, activity, and, if needed, medication with a doctor.",
  chol: "Managing cholesterol through diet, activity, and, if needed, medication with a doctor.",
};

export default function HeartQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [bp, setBp] = useState<BPBand>("unknown");
  const [chol, setChol] = useState<CholBand>("unknown");

  const complete = questions.every((q) => answers[q.id] !== undefined);
  const lifestyleScore = questions.reduce(
    (sum, q) => sum + (answers[q.id] !== undefined ? q.options[answers[q.id]].points : 0),
    0
  );
  const usedClinical = bp !== "unknown" || chol !== "unknown";
  const score = lifestyleScore + bpPoints(bp) + cholPoints(chol);
  const result = band(score, usedClinical);

  const improvable = [
    ...questions
      .filter((q) => advice[q.id] && answers[q.id] !== undefined && q.options[answers[q.id]].points > 0)
      .map((q) => ({ id: q.id, points: q.options[answers[q.id]].points, tip: advice[q.id] })),
    ...(bpPoints(bp) > 0 ? [{ id: "bp", points: bpPoints(bp), tip: advice.bp }] : []),
    ...(cholPoints(chol) > 0 ? [{ id: "chol", points: cholPoints(chol), tip: advice.chol }] : []),
  ].sort((a, b2) => b2.points - a.points);

  const selectClass = "rounded border px-3 py-2";

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link href="/" className="text-sm text-gray-500">← Back</Link>
      <h1 className="mb-2 mt-2 text-3xl font-bold">Heart & Cardiovascular Risk Check</h1>
      <p className="mb-8 text-gray-600">
        Educational only, not medical advice. Your answers stay in your browser and are not stored.
      </p>

      {questions.map((q) => (
        <div key={q.id} className="mb-6">
          <p className="mb-2 font-semibold">{q.text}</p>
          {q.options.map((o, i) => (
            <label key={o.label} className="mb-1 block cursor-pointer">
              <input
                type="radio"
                name={q.id}
                className="mr-2"
                checked={answers[q.id] === i}
                onChange={() => setAnswers({ ...answers, [q.id]: i })}
              />
              {o.label}
            </label>
          ))}
        </div>
      ))}

      <div className="mb-6 rounded border p-4">
        <p className="mb-3 font-semibold">
          Optional: if you know your numbers, add them for a more accurate result
        </p>
        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-600">Blood pressure</label>
          <select value={bp} onChange={(e) => setBp(e.target.value as BPBand)} className={selectClass}>
            <option value="unknown">I don&apos;t know / skip</option>
            <option value="normal">Normal (below about 120/80)</option>
            <option value="elevated">Elevated (roughly 120-139 / 80-89)</option>
            <option value="high">High (140/90 or above)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Cholesterol (LDL / total)</label>
          <select value={chol} onChange={(e) => setChol(e.target.value as CholBand)} className={selectClass}>
            <option value="unknown">I don&apos;t know / skip</option>
            <option value="good">In a healthy range</option>
            <option value="borderline">Borderline high</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => setSubmitted(true)}
        disabled={!complete}
        className="rounded bg-black px-6 py-2 text-white disabled:opacity-40"
      >
        See my result
      </button>

      {submitted && complete && (
        <div className="mt-8 rounded border p-6">
          {!usedClinical && (
            <p className="mb-3 text-sm text-gray-500">
              This estimate is based on lifestyle factors only. Adding your blood pressure and
              cholesterol above gives a more accurate result.
            </p>
          )}
          <h2 className="text-2xl font-bold">Risk level: {result.label}</h2>
          <p className="mt-2">{result.detail}</p>

          {improvable.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold">Changes that could lower your risk</h3>
              <ul className="mt-2 list-disc pl-5">
                {improvable.map((item) => (
                  <li key={item.id} className="mb-1">{item.tip}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-500">
            This is a screening estimate, not a diagnosis. Talk to a doctor about testing and next steps.
          </p>
        </div>
      )}
    </main>
  );
}