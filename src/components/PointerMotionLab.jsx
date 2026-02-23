import React, { useEffect, useRef } from "react";

const MODE_MAP = {
  silk: {
    stroke: [208, 72, 66],
    glow: [208, 86, 72],
    particle: [208, 72, 74],
    lineWidth: 4.7,
    lifeDecay: 0.022,
  },
  amber: {
    stroke: [33, 88, 64],
    glow: [34, 96, 72],
    particle: [34, 92, 68],
    lineWidth: 3.4,
    lifeDecay: 0.026,
  },
  violet: {
    stroke: [266, 62, 70],
    glow: [274, 76, 78],
    particle: [270, 70, 74],
    lineWidth: 3.2,
    lifeDecay: 0.024,
  },
  steel: {
    stroke: [196, 24, 70],
    glow: [198, 36, 76],
    particle: [198, 30, 78],
    lineWidth: 3.1,
    lifeDecay: 0.027,
  },
};

function hsla(value, alpha) {
  return `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function spawnParticle(mode, x, y, burst = false) {
  const angle = Math.random() * Math.PI * 2;

  if (mode === "amber") {
    return {
      x,
      y,
      vx: Math.cos(angle) * (0.5 + Math.random() * (burst ? 2.8 : 1.6)),
      vy: Math.sin(angle) * (0.4 + Math.random() * (burst ? 2.2 : 1.2)) - 0.12,
      life: 1,
      decay: 0.016 + Math.random() * 0.024,
      size: 0.9 + Math.random() * 2.1,
      gravity: 0.02,
      friction: 0.984,
      shape: "ember",
    };
  }

  if (mode === "violet") {
    const swirl = (Math.random() > 0.5 ? 1 : -1) * (0.026 + Math.random() * 0.05);
    return {
      x,
      y,
      vx: Math.cos(angle) * (0.72 + Math.random() * (burst ? 3 : 1.8)),
      vy: Math.sin(angle) * (0.72 + Math.random() * (burst ? 2.6 : 1.6)),
      life: 1,
      decay: 0.018 + Math.random() * 0.022,
      size: 1 + Math.random() * 2.4,
      gravity: 0,
      friction: 0.982,
      swirl,
      shape: "filament",
    };
  }

  if (mode === "steel") {
    return {
      x,
      y,
      vx: Math.cos(angle) * (0.5 + Math.random() * (burst ? 2.1 : 1.1)),
      vy: Math.sin(angle) * (0.5 + Math.random() * (burst ? 2.1 : 1.1)),
      life: 1,
      decay: 0.024 + Math.random() * 0.03,
      size: 0.8 + Math.random() * 1.8,
      gravity: 0,
      friction: 0.982,
      shape: "square",
    };
  }

  return {
    x,
    y,
    vx: Math.cos(angle) * (0.8 + Math.random() * (burst ? 2.8 : 1.5)),
    vy: Math.sin(angle) * (0.8 + Math.random() * (burst ? 2.8 : 1.5)),
    life: 1,
    decay: 0.018 + Math.random() * 0.022,
    size: 1 + Math.random() * 2.3,
    gravity: 0,
    friction: 0.986,
    shape: "dot",
  };
}

function drawSilk(ctx, points, config) {
  if (points.length < 2) return;

  ctx.lineCap = "round";
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const point = points[i];
    const alpha = (point.life * i) / points.length;

    ctx.strokeStyle = hsla(config.stroke, alpha * 0.9);
    ctx.lineWidth = config.lineWidth * (0.54 + i / points.length);
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    ctx.strokeStyle = hsla(config.glow, alpha * 0.2);
    ctx.lineWidth *= 2.25;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }
}

function drawAmber(ctx, points, config, time) {
  if (points.length < 2) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const point = points[i];
    const dx = point.x - prev.x;
    const dy = point.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const alpha = (point.life * i) / points.length;
    const width = 2.2 + (i / points.length) * 7.8;
    const grains = 4;

    for (let band = -grains; band <= grains; band += 1) {
      const wobble =
        Math.sin(time * 0.0048 + i * 0.58 + band * 1.33) *
        (1.3 + (i / points.length) * 2.1);
      const spread = band * (width * 0.46) + wobble;
      const px = point.x + nx * spread;
      const py = point.y + ny * spread;
      const strength = grains - Math.abs(band) + 1;

      ctx.fillStyle = hsla(config.stroke, alpha * (0.03 + strength * 0.07));
      ctx.beginPath();
      ctx.arc(px, py, 0.6 + width * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    if (i % 3 === 0) {
      ctx.strokeStyle = hsla(config.glow, alpha * 0.26);
      ctx.lineWidth = Math.max(1, width * 0.3);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }

  const pulse = Math.sin(time * 0.004) * 0.5 + 0.5;
  const pivot = points[points.length - 1];
  if (pivot) {
    const radius = 14 + pulse * 10;
    const gradient = ctx.createRadialGradient(
      pivot.x,
      pivot.y,
      2,
      pivot.x,
      pivot.y,
      radius + 16
    );
    gradient.addColorStop(0, "rgba(255, 220, 164, 0.84)");
    gradient.addColorStop(0.32, "rgba(255, 186, 110, 0.42)");
    gradient.addColorStop(1, "rgba(255, 156, 84, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pivot.x, pivot.y, radius + 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawViolet(ctx, points, config, time) {
  if (points.length < 3) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const drawBand = (side, opacity, widthMul, phaseShift) => {
    ctx.beginPath();
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const point = points[i];
      const dx = point.x - prev.x;
      const dy = point.y - prev.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      const prevWave =
        Math.sin(time * 0.0044 + (i - 1) * 0.72 + phaseShift) *
        (3 + ((i - 1) / points.length) * 7);
      const wave =
        Math.sin(time * 0.0044 + i * 0.72 + phaseShift) * (3 + (i / points.length) * 7);

      const px = prev.x + nx * prevWave * side;
      const py = prev.y + ny * prevWave * side;
      const x = point.x + nx * wave * side;
      const y = point.y + ny * wave * side;

      if (i === 1) ctx.moveTo(px, py);
      ctx.quadraticCurveTo(px, py, (px + x) * 0.5, (py + y) * 0.5);
    }

    ctx.strokeStyle = hsla(side > 0 ? config.stroke : config.glow, opacity);
    ctx.lineWidth = config.lineWidth * widthMul;
    ctx.stroke();
  };

  drawBand(1, 0.48, 1.26, 1.1);
  drawBand(-1, 0.5, 0.9, -1.4);

  ctx.strokeStyle = hsla(config.glow, 0.56);
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  for (let i = 6; i < points.length; i += 6) {
    const point = points[i];
    const alpha = (point.life * i) / points.length;
    const rx = 4 + (i / points.length) * 7;
    const ry = 1.8 + (i / points.length) * 3.6;
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(time * 0.0021 + i * 0.16);
    ctx.strokeStyle = hsla(config.glow, alpha * 0.42);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function drawSteel(ctx, points, config, time) {
  if (points.length < 2) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.setLineDash([8, 7]);
  ctx.strokeStyle = hsla(config.stroke, 0.72);
  ctx.lineWidth = config.lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < points.length; i += 6) {
    const point = points[i];
    const flicker = Math.sin(time * 0.004 + i) * 0.5 + 0.5;
    ctx.fillStyle = hsla(config.glow, 0.25 + flicker * 0.4);
    ctx.fillRect(point.x - 2.1, point.y - 2.1, 4.2, 4.2);
  }
}

export default function PointerMotionLab({ mode = "silk", hint = "Muovi il mouse" }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const particlesRef = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const config = MODE_MAP[mode] || MODE_MAP.silk;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.max(260, rect.width);
      height = Math.max(220, rect.height);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    const spawn = (x, y, burst = false) => {
      const amount =
        mode === "amber"
          ? burst
            ? 42
            : 10
          : mode === "violet"
            ? burst
              ? 30
              : 6
            : mode === "steel"
              ? burst
                ? 16
                : 2
              : burst
                ? 22
                : 4;

      for (let i = 0; i < amount; i += 1) {
        particlesRef.current.push(spawnParticle(mode, x, y, burst));
      }

      if (particlesRef.current.length > 1400) {
        particlesRef.current.splice(0, particlesRef.current.length - 1400);
      }
    };

    const onPointerMove = (event) => {
      if (prefersReduced) return;

      const rect = stage.getBoundingClientRect();
      const x = clamp(event.clientX - rect.left, 0, width);
      const y = clamp(event.clientY - rect.top, 0, height);

      const points = pointsRef.current;
      const last = points[points.length - 1];
      const vx = last ? x - last.x : 0;
      const vy = last ? y - last.y : 0;

      points.push({ x, y, life: 1, vx, vy, speed: Math.hypot(vx, vy) });
      if (pointsRef.current.length > 66) pointsRef.current.shift();

      spawn(x, y, false);
    };

    const onPointerDown = (event) => {
      if (prefersReduced) return;

      const rect = stage.getBoundingClientRect();
      const x = clamp(event.clientX - rect.left, 0, width);
      const y = clamp(event.clientY - rect.top, 0, height);
      spawn(x, y, true);
    };

    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerdown", onPointerDown);

    let raf = 0;

    const drawParticles = () => {
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];

        if (mode === "violet" && particle.swirl) {
          const cos = Math.cos(particle.swirl);
          const sin = Math.sin(particle.swirl);
          const vx = particle.vx * cos - particle.vy * sin;
          const vy = particle.vx * sin + particle.vy * cos;
          particle.vx = vx;
          particle.vy = vy;
        }

        particle.vx *= particle.friction;
        particle.vy = (particle.vy + particle.gravity) * particle.friction;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;

        if (particle.life <= 0.02) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = particle.life * 0.84;
        if (particle.shape === "square") {
          ctx.fillStyle = hsla(config.particle, alpha);
          ctx.fillRect(
            particle.x - particle.size * 0.5,
            particle.y - particle.size * 0.5,
            particle.size,
            particle.size
          );
        } else if (particle.shape === "ember") {
          ctx.fillStyle = hsla(config.particle, alpha);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          const theta = Math.atan2(particle.vy, particle.vx);
          ctx.fillStyle = hsla(config.glow, alpha * 0.44);
          ctx.beginPath();
          ctx.ellipse(
            particle.x - Math.cos(theta) * particle.size * 1.6,
            particle.y - Math.sin(theta) * particle.size * 1.6,
            particle.size * 1.9,
            particle.size * 0.85,
            theta,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else if (particle.shape === "filament") {
          const theta = Math.atan2(particle.vy, particle.vx) + Math.PI / 2;
          const len = particle.size * 2.4;
          const ox = Math.cos(theta) * len;
          const oy = Math.sin(theta) * len;

          ctx.strokeStyle = hsla(config.particle, alpha * 0.9);
          ctx.lineWidth = Math.max(0.8, particle.size * 0.58);
          ctx.beginPath();
          ctx.moveTo(particle.x - ox, particle.y - oy);
          ctx.lineTo(particle.x + ox, particle.y + oy);
          ctx.stroke();

          ctx.strokeStyle = hsla(config.glow, alpha * 0.34);
          ctx.lineWidth *= 2.1;
          ctx.beginPath();
          ctx.moveTo(particle.x - ox, particle.y - oy);
          ctx.lineTo(particle.x + ox, particle.y + oy);
          ctx.stroke();
        } else {
          ctx.fillStyle = hsla(config.particle, alpha);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          if (mode === "silk") {
            ctx.fillStyle = hsla(config.glow, alpha * 0.22);
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const render = (time) => {
      raf = window.requestAnimationFrame(render);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle =
        mode === "amber"
          ? "rgba(16, 10, 4, 0.2)"
          : mode === "violet"
            ? "rgba(8, 6, 19, 0.2)"
            : mode === "steel"
              ? "rgba(8, 14, 24, 0.22)"
              : "rgba(6, 14, 24, 0.16)";
      ctx.fillRect(0, 0, width, height);

      if (prefersReduced) return;

      const points = pointsRef.current;
      for (let i = points.length - 1; i >= 0; i -= 1) {
        points[i].life -= config.lifeDecay;
        if (points[i].life <= 0.01) points.splice(i, 1);
      }

      if (mode === "silk") {
        drawSilk(ctx, points, config);
      } else if (mode === "amber") {
        drawAmber(ctx, points, config, time);
      } else if (mode === "violet") {
        drawViolet(ctx, points, config, time);
      } else {
        drawSteel(ctx, points, config, time);
      }

      drawParticles();
    };

    render(0);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerdown", onPointerDown);
      pointsRef.current = [];
      particlesRef.current = [];
    };
  }, [mode]);

  return (
    <div className={`pointerLab pointerLab--${mode}`} ref={stageRef}>
      <canvas ref={canvasRef} className="pointerCanvas" aria-hidden="true" />
      <span className="pointerHintBadge">{hint}</span>
    </div>
  );
}
