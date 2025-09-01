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
      className="fixed top-4 right-4 z-40 btn-neon px-4 py-2 md:hidden"
      style={{ top: "calc(1rem + env(safe-area-inset-top))" }}
      aria-label="Toggle Neon Mode"
    >
      {on ? "Neon: On" : "Neon"}
    </button>
  );
}
