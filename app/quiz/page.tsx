"use client";

import { useState } from "react";

type Option = { label: string; points: number };
type Question = {
  id: string;
  text: string;
  options: Option[];
  showIf?: (a: Record<string, number>) => boolean;
};

const questions: Question[] = [
  { id: "age", text: "How old are you?", options: [
    { label: "Under 45", points: 0 },
    { label: "45-54", points: 2 },
    { label: "55-64", points: 3 },
    { label: "Over 64", points: 4 },
  ]},
  { id: "sex", text: "What is your sex? (used for waist measurement thresholds)", options: [
    { label: "Male", points: 0 },
    { label: "Female", points: 0 },
  ]},
  { id: "bmi", text: "What is your body mass index (BMI)?", options: [
    { label: "Under 25", points: 0 },
    { label: "25-30", points: 1 },
    { label: "Over 30", points: 3 },
  ]},
  { id: "waist_m", text: "What is your waist circumference (measured at the navel)?",
    showIf: (a) => a.sex === 0,
    options: [
      { label: "Under 94 cm (37 in)", points: 0 },
      { label: "94-102 cm (37-40 in)", points: 3 },
      { label: "Over 102 cm (40 in)", points: 4 },
    ]},
  { id: "waist_f", text: "What is your waist circumference (measured at the navel)?",
    showIf: (a) => a.sex === 1,
    options: [
      { label: "Under 80 cm (31.5 in)", points: 0 },
      { label: "80-88 cm (31.5-34.5 in)", points: 3 },
      { label: "Over 88 cm (34.5 in)", points: 4 },
    ]},
  { id: "active", text: "Do you usually get at least 30 minutes of physical activity a day?", options: [
    { label: "Yes", points: 0 },
    { label: "No", points: 2 },
  ]},
  { id: "veg", text: "How often do you eat vegetables, fruit, or berries?", options: [
    { label: "Every day", points: 0 },
    { label: "Not every day", points: 1 },
  ]},
  { id: "bpmeds", text: "Have you ever regularly taken medication for high blood pressure?", options: [
    { label: "No", points: 0 },
    { label: "Yes", points: 2 },
  ]},
  { id: "glucose", text: "Have you ever been found to have high blood glucose (for example, in a health exam or during illness or pregnancy)?", options: [
    { label: "No", points: 0 },
    { label: "Yes", points: 5 },
  ]},
  { id: "family", text: "Has anyone in your family been diagnosed with diabetes?", options: [
    { label: "No", points: 0 },
    { label: "Yes: grandparent, aunt, uncle, or first cousin", points: 3 },
    { label: "Yes: parent, brother, sister, or own child", points: 5 },
  ]},
];

const advice: Record<string, string> = {
  bmi: "Gradual weight loss. Losing around 5-7% of your body weight has strong evidence for lowering diabetes risk.",
  waist_m: "Reducing your waist size, mostly through steady activity combined with gradual weight loss.",
  waist_f: "Reducing your waist size, mostly through steady activity combined with gradual weight loss.",
  active: "Building up to 30 minutes of movement a day (150 minutes a week is a common target), such as brisk walking.",
  veg: "Adding vegetables, fruit, or berries to your meals every day.",
};

function band(score: number) {
  if (score < 7) return { label: "Low", detail: "About 1 in 100 people with this score develop type 2 diabetes within 10 years." };
  if (score <= 11) return { label: "Slightly elevated", detail: "About 1 in 25 people with this score develop type 2 diabetes within 10 years." };
  if (score <= 14) return { label: "Moderate", detail: "About 1 in 6 people with this score develop type 2 diabetes within 10 years." };
  if (score <= 20) return { label: "High", detail: "About 1 in 3 people with this score develop type 2 diabetes within 10 years." };
  return { label: "Very high", detail: "About 1 in 2 people with this score develop type 2 diabetes within 10 years." };
}

type Unit = "imperial" | "metric";

function calcBmi(unit: Unit, h1: string, h2: string, w: string): number | null {
  const weight = parseFloat(w);
  let heightM: number;
  let weightKg: number;
  if (unit === "metric") {
    heightM = parseFloat(h1) / 100;
    weightKg = weight;
  } else {
    const inches = (parseFloat(h1) || 0) * 12 + (parseFloat(h2) || 0);
    heightM = inches * 0.0254;
    weightKg = weight * 0.45359237;
  }
  if (!heightM || !weightKg) return null;
  const bmi = weightKg / (heightM * heightM);
  if (!isFinite(bmi) || bmi < 10 || bmi > 80) return null;
  return bmi;
}

export default function Quiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [unit, setUnit] = useState<Unit>("imperial");
  const [h1, setH1] = useState("");
  const [h2, setH2] = useState("");
  const [w, setW] = useState("");

  const bmi = calcBmi(unit, h1, h2, w);
  const bmiIndex = bmi === null ? undefined : bmi < 25 ? 0 : bmi <= 30 ? 1 : 2;
  const effective: Record<string, number> =
    bmiIndex === undefined ? answers : { ...answers, bmi: bmiIndex };

  const visible = questions.filter((q) => !q.showIf || q.showIf(effective));
  const complete = visible.every((q) => effective[q.id] !== undefined);
  const score = visible.reduce(
    (sum, q) =>
      sum + (effective[q.id] !== undefined ? q.options[effective[q.id]].points : 0),
    0
  );
  const result = band(score);

  const improvable = visible
    .filter(
      (q) =>
        advice[q.id] &&
        effective[q.id] !== undefined &&
        q.options[effective[q.id]].points > 0
    )
    .map((q) => ({
      id: q.id,
      points: q.options[effective[q.id]].points,
      tip: advice[q.id],
    }))
    .sort((a, b) => b.points - a.points);

  function switchUnit(next: Unit) {
    setUnit(next);
    setH1("");
    setH2("");
    setW("");
  }

  const inputClass = "w-28 rounded border px-3 py-2";

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Type 2 Diabetes Risk Check</h1>
      <p className="mb-8 text-gray-600">
        Educational only, not medical advice. Your answers stay in your browser and are not stored.
      </p>

      {visible.map((q) => (
        <div key={q.id} className="mb-6">
          <p className="mb-2 font-semibold">{q.text}</p>

          {q.id === "bmi" && (
            <div className="mb-3 rounded border p-4">
              <p className="mb-2 text-sm text-gray-600">
                Not sure? Enter your height and weight and we'll work it out.
              </p>
              <div className="mb-3 flex gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => switchUnit("imperial")}
                  className={
                    unit === "imperial"
                      ? "rounded bg-black px-3 py-1 text-white"
                      : "rounded border px-3 py-1"
                  }
                >
                  ft / in / lb
                </button>
                <button
                  type="button"
                  onClick={() => switchUnit("metric")}
                  className={
                    unit === "metric"
                      ? "rounded bg-black px-3 py-1 text-white"
                      : "rounded border px-3 py-1"
                  }
                >
                  cm / kg
                </button>
              </div>

              {unit === "imperial" ? (
                <div className="flex flex-wrap gap-3">
                  <input type="number" min="0" inputMode="decimal" placeholder="Feet"
                    value={h1} onChange={(e) => setH1(e.target.value)} className={inputClass} />
                  <input type="number" min="0" inputMode="decimal" placeholder="Inches"
                    value={h2} onChange={(e) => setH2(e.target.value)} className={inputClass} />
                  <input type="number" min="0" inputMode="decimal" placeholder="Weight (lb)"
                    value={w} onChange={(e) => setW(e.target.value)} className={inputClass} />
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <input type="number" min="0" inputMode="decimal" placeholder="Height (cm)"
                    value={h1} onChange={(e) => setH1(e.target.value)} className={inputClass} />
                  <input type="number" min="0" inputMode="decimal" placeholder="Weight (kg)"
                    value={w} onChange={(e) => setW(e.target.value)} className={inputClass} />
                </div>
              )}

              {bmi !== null && (
                <p className="mt-3">
                  Your BMI: <strong>{bmi.toFixed(1)}</strong>
                </p>
              )}
              {bmi === null && (h1 || w) && (
                <p className="mt-3 text-sm text-gray-500">
                  Enter your full height and weight to calculate.
                </p>
              )}
              <p className="mt-3 text-sm text-gray-500">
                Already know your BMI? Clear the boxes above and choose a range below.
              </p>
            </div>
          )}

          {q.options.map((o, i) => (
            <label key={o.label} className="mb-1 block cursor-pointer">
              <input
                type="radio"
                name={q.id}
                className="mr-2"
                checked={effective[q.id] === i}
                disabled={q.id === "bmi" && bmiIndex !== undefined}
                onChange={() => setAnswers({ ...answers, [q.id]: i })}
              />
              {o.label}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={() => setSubmitted(true)}
        disabled={!complete}
        className="rounded bg-black px-6 py-2 text-white disabled:opacity-40"
      >
        See my result
      </button>

      {submitted && complete && (
        <div className="mt-8 rounded border p-6">
          <p className="text-sm text-gray-500">Your score: {score} out of 26</p>
          <h2 className="text-2xl font-bold">Risk level: {result.label}</h2>
          <p className="mt-2">{result.detail}</p>

          {improvable.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold">Changes that could lower your score</h3>
              <ul className="mt-2 list-disc pl-5">
                {improvable.map((item) => (
                  <li key={item.id} className="mb-1">
                    {item.tip}{" "}
                    <span className="text-gray-500">(up to {item.points} points)</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                Weight and waist size overlap, so these points don't fully add up.
              </p>
            </div>
          )}

          {score >= 15 && (
            <p className="mt-4 font-semibold">
              With a score this high, it's worth asking a doctor about a blood
              sugar test (such as an A1C).
            </p>
          )}

          <p className="mt-4 text-sm text-gray-500">
            This is a screening estimate. Talk to a doctor about testing and next steps.
          </p>
        </div>
      )}
    </main>
  );
}