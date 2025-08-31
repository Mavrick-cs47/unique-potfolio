import { useEffect, useState } from "react";

interface Props {
  phrases: string[];
  typingSpeed?: number; // ms per char
  pause?: number; // ms between phrases
}

export default function Typewriter({
  phrases,
  typingSpeed = 40,
  pause = 1200,
}: Props) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    const atEnd = text === current;
    const atStart = text.length === 0;

    let delay = deleting ? typingSpeed / 2 : typingSpeed;
    if (atEnd && !deleting) delay = pause; // pause at full word

    const id = window.setTimeout(() => {
      if (!deleting) {
        if (!atEnd) setText(current.slice(0, text.length + 1));
        else setDeleting(true);
      } else {
        if (!atStart) setText(current.slice(0, text.length - 1));
        else {
          setDeleting(false);
          setIndex((i) => (i + 1) % phrases.length);
        }
      }
    }, delay);

    return () => window.clearTimeout(id);
  }, [text, deleting, index, phrases, typingSpeed, pause]);

  return (
    <span className="inline-flex items-center">
      <span className="text-gradient">{text}</span>
      <span className="ml-1 inline-block h-6 w-[2px] animate-pulseSoft bg-foreground/70" />
    </span>
  );
}
