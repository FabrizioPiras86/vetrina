import React, { useEffect, useRef } from "react";

export default function MagneticButton({
  children,
  onClick,
  className = "",
  variant = "primary",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const strength = 18;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${(x / r.width) * strength}px, ${(y / r.height) * strength}px, 0)`;
    };

    const reset = () => {
      el.style.transform = "translate3d(0,0,0)";
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`btn ${variant} ${className}`}
      type="button"
    >
      <span className="btnInner">{children}</span>
    </button>
  );
}
