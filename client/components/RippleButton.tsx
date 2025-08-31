import { ButtonHTMLAttributes, MouseEvent, ReactNode, useRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function RippleButton({ children, className = "", onMouseEnter, onClick, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const addRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <button
      ref={ref}
      {...rest}
      onMouseEnter={(e) => { addRipple(e); onMouseEnter?.(e); }}
      onClick={(e) => { addRipple(e); onClick?.(e); }}
      className={`btn-neon ${className}`}
    >
      {children}
    </button>
  );
}
