import { useEffect, useState } from "react";

export default function NeonToggle() {
  const [on, setOn] = useState<boolean>(false);
  useEffect(() => {
    setOn(document.documentElement.classList.contains("cyberpunk"));
  }, []);
  const toggle = () => {
    document.documentElement.classList.toggle("cyberpunk");
    setOn(document.documentElement.classList.contains("cyberpunk"));
  };
  return (
    <button
      onClick={toggle}
      className="fixed bottom-5 left-5 z-40 btn-neon px-4 py-2 md:hidden"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      aria-label="Toggle Neon Mode"
    >
      {on ? "Neon: On" : "Neon"}
    </button>
  );
}
