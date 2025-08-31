import { useRef, useState } from "react";

export default function HRMode() {
  const [active, setActive] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string, rate = 1) => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    utterRef.current = u;
    speechSynthesis.speak(u);
    return new Promise<void>((resolve) => {
      u.onend = () => resolve();
    });
  };

  const run = async () => {
    if (active) return;
    setActive(true);
    document.body.classList.add("hr-mode");
    await speak("Hi, I'm Chirag Sharma. Welcome to my interactive portfolio.");
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
    await speak(
      "Here are a few projects where design meets engineering.",
      1.05,
    );
    document.querySelector("#skills")?.scrollIntoView({ behavior: "smooth" });
    await speak(
      "A quick snapshot of my skills, from TypeScript to 3D on the web.",
    );
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    await speak(
      "If you like what you hear, let's connect. Thanks for watching.",
      1,
    );
    document.body.classList.remove("hr-mode");
    setActive(false);
  };

  return (
    <button
      aria-label="HR Mode"
      onClick={run}
      className="fixed bottom-6 right-6 z-40 btn-neon shadow-xl"
    >
      {active ? "Narrating…" : "HR Mode"}
    </button>
  );
}
