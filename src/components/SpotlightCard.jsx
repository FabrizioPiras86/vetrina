import React, { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function SpotlightCard({
  item,
  onClick,
  layoutId,
  index = 0,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const delay = useMemo(() => 0.05 * index, [index]);

  const onMove = (e) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
    const py = clamp(((e.clientY - r.top) / r.height) * 100, 0, 100);

    el.style.setProperty("--mx", px + "%");
    el.style.setProperty("--my", py + "%");

    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const rx = (-dy / r.height) * 10;
    const ry = (dx / r.width) * 10;
    el.style.setProperty("--rx", rx.toFixed(2) + "deg");
    el.style.setProperty("--ry", ry.toFixed(2) + "deg");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "0%");
  };

  return (
    <motion.button
      ref={ref}
      className="card"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      type="button"
      layoutId={layoutId}
    >
      <div className="cardBadge">{item.badge}</div>
      <div className="cardTitle">{item.title}</div>
      <div className="cardKicker">{item.kicker}</div>
      <div className="cardDesc">{item.desc}</div>
      <div className="cardHint">Click →</div>
    </motion.button>
  );
}
