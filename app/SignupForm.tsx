"use client";

import { useState } from "react";

const FORM_URL = "https://formspree.io/f/xzezerka";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="mt-4 font-semibold">Thanks! We'll be in touch when new checks launch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded border px-4 py-2"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded bg-black px-6 py-2 text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Notify me"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600 sm:basis-full">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}