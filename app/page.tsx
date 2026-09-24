import Link from "next/link";
import SignupForm from "./SignupForm";

type Condition = {
  name: string;
  description: string;
  href?: string; // present = live, absent = coming soon
};

const conditions: Condition[] = [
  {
    name: "Type 2 Diabetes",
    description: "A validated 2-minute screening based on lifestyle and family history.",
    href: "/quiz",
  },
  {
    name: "Heart & Cardiovascular",
    description: "Risk based on activity, diet, blood pressure, and family history."
    ,
    href: "/heart",
  },
  {
    name: "Cancer",
    description: "Risk factors across common cancer types, and what lowers them.",
  },
  {
    name: "Brain Health & Dementia",
    description: "Lifestyle factors linked to long-term brain health.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Know your health risks. Then change them.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Pick a condition below to answer a few questions and get a risk
          estimate based on validated screening questionnaires, plus the
          habits that would lower it the most.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {conditions.map((c) =>
          c.href ? (
            <Link
              key={c.name}
              href={c.href}
              className="rounded border p-6 transition hover:border-black"
            >
              <h2 className="font-semibold">{c.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{c.description}</p>
              <span className="mt-3 inline-block text-sm font-medium">
                Take the check →
              </span>
            </Link>
          ) : (
            <div
              key={c.name}
              className="rounded border border-dashed p-6 opacity-60"
            >
              <h2 className="font-semibold">{c.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{c.description}</p>
              <span className="mt-3 inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium">
                Coming soon
              </span>
            </div>
          )
        )}
      </section>

      <section className="mt-16 rounded border p-6">
        <h2 className="text-xl font-bold">Get notified as new checks launch</h2>
        <p className="mt-2 text-gray-600">
          Leave your email and we'll let you know when heart, cancer, and
          brain health checks are ready.
        </p>
        <SignupForm />
        <p className="mt-2 text-sm text-gray-500">
          We'll only email you about launches. No spam, unsubscribe anytime.
        </p>
      </section>

      <footer className="mt-16 text-center text-sm text-gray-500">
        For education only. This is not medical advice, and it does not
        diagnose any condition. Talk to a doctor about your health.
      </footer>
    </main>
  );
}