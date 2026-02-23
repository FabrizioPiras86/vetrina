import React, { useEffect, useRef } from "react";

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default function Particles({ density = 0.00009 }) {
  const ref = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let w = 0;
    let h = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let particles = [];

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      w = Math.max(320, parent.clientWidth);
      h = Math.max(320, parent.clientHeight);

      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      const count = Math.floor(w * h * density);
      particles = Array.from({ length: count }).map(() => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 1.9),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.18, 0.18),
        a: rand(0.15, 0.6),
      }));
    };

    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (prefersReduced) return;

      // soft fade
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    resize();
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [density]);

  return <canvas className="particles" ref={ref} aria-hidden="true" />;
}
