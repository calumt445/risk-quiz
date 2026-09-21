import Link from "next/link";

import SignupForm from "./SignupForm";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Know your health risks. Then change them.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Answer a few questions about your lifestyle and get a risk estimate
          based on a validated screening questionnaire, plus the habits that
          would lower it the most.
        </p>
        <Link
          href="/quiz"
          className="mt-8 inline-block rounded bg-black px-8 py-3 text-white"
        >
          Take the diabetes risk check
        </Link>
        <p className="mt-3 text-sm text-gray-500">
          Takes about 2 minutes. Your answers stay in your browser.
        </p>
      </section>

      <section className="mt-20 grid gap-8 sm:grid-cols-3">
        <div>
          <h2 className="font-semibold">1. Answer a few questions</h2>
          <p className="mt-1 text-gray-600">
            Age, activity, diet, and family history. No account needed.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">2. See your risk level</h2>
          <p className="mt-1 text-gray-600">
            Get a clear score and what it means in plain language.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">3. Learn what to change</h2>
          <p className="mt-1 text-gray-600">
            See which habits would lower your risk the most.
          </p>
        </div>
      </section>

      <section className="mt-20 rounded border p-6">
        <h2 className="text-xl font-bold">More conditions coming soon</h2>
        <p className="mt-2 text-gray-600">
          We're adding heart health, cancer risk factors, and brain health. Leave
          your email and we'll let you know when they launch.
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