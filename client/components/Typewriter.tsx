import { useEffect, useRef, useState } from "react";

interface Props {
  phrases: string[];
  typingSpeed?: number; // ms per char
  pause?: number; // ms between phrases
}

export default function Typewriter({ phrases, typingSpeed = 40, pause = 1200 }: Props) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    const step = () => {
      setText((prev) => {
        if (!deleting) {
          const next = current.slice(0, prev.length + 1);
          if (next === current) {
            setDeleting(true);
            window.setTimeout(() => step(), pause);
          }
          return next;
        } else {
          const next = current.slice(0, prev.length - 1);
          if (next.length === 0) {
            setDeleting(false);
            setIndex((i) => (i + 1) % phrases.length);
          }
          return next;
        }
      });
    };

    timer.current = window.setTimeout(step, deleting ? typingSpeed / 2 : typingSpeed);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [deleting, index, phrases, typingSpeed, pause]);

  useEffect(() => {
    if (text === phrases[index % phrases.length]) {
      const id = window.setTimeout(() => setDeleting(true), pause);
      return () => window.clearTimeout(id);
    }
  }, [text, index, phrases, pause]);

  return (
    <span className="inline-flex items-center">
      <span className="text-gradient">{text}</span>
      <span className="ml-1 inline-block h-6 w-[2px] animate-pulseSoft bg-foreground/70" />
    </span>
  );
}
