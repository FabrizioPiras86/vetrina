import React, { useId, useMemo } from "react";

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function buildHeartPoints(outlineTotal = 320, fillTotal = 180) {
  const outline = Array.from({ length: outlineTotal }).map((_, index) => {
    const t = (index / (outlineTotal - 1)) * Math.PI * 2;
    const hx = 16 * Math.sin(t) ** 3;
    const hy =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    const x = hx * 3.95;
    const y = -hy * 3.95;

    const launch = Math.random() * Math.PI * 2;
    const spread = 170 + Math.random() * 130;

    return {
      x,
      y,
      sx: Math.cos(launch) * spread,
      sy: Math.sin(launch) * (spread * 0.8),
      delay: Math.floor(120 + (index / outlineTotal) * 620 + Math.random() * 540),
      size: (1.5 + Math.random() * 2.5).toFixed(2),
      alpha: (0.44 + Math.random() * 0.5).toFixed(2),
      layer: "edge",
    };
  });

  const fill = [];
  let guard = 0;
  while (fill.length < fillTotal && guard < fillTotal * 30) {
    guard += 1;
    const px = randomBetween(-58, 58);
    const py = randomBetween(-62, 52);
    const nx = px / 54;
    const ny = (py + 6) / 52;
    const test = (nx * nx + ny * ny - 1) ** 3 - nx * nx * ny ** 3;
    if (test > 0) continue;

    const launch = Math.random() * Math.PI * 2;
    const spread = 112 + Math.random() * 170;
    fill.push({
      x: px,
      y: py,
      sx: Math.cos(launch) * spread,
      sy: Math.sin(launch) * spread + randomBetween(26, 84),
      delay: Math.floor(260 + Math.random() * 980),
      size: (0.9 + Math.random() * 1.8).toFixed(2),
      alpha: (0.14 + Math.random() * 0.38).toFixed(2),
      layer: "fill",
    });
  }

  return [...outline, ...fill];
}

function buildMoonDust(total = 300) {
  return Array.from({ length: total }).map((_, index) => {
    const t = index / (total - 1);
    const angle = -Math.PI * 0.16 + t * Math.PI * 1.42;
    const outerRadius = 94 + Math.sin(t * Math.PI) * 10;
    const innerRadius = 58 + Math.sin(t * Math.PI) * 8;
    const depth = Math.pow(Math.random(), 0.65);
    const radius = outerRadius - (outerRadius - innerRadius) * depth;

    const x = Math.cos(angle) * radius - 18 + randomBetween(-2.5, 2.5);
    const y = Math.sin(angle) * radius + randomBetween(-2.2, 2.2);

    const launchAngle = Math.random() * Math.PI * 2;
    const launchRadius = 154 + Math.random() * 144;

    return {
      x,
      y,
      sx: Math.cos(launchAngle) * launchRadius + 46,
      sy: Math.sin(launchAngle) * launchRadius + 16,
      delay: Math.floor(110 + t * 1120 + Math.random() * 420),
      size: (1 + Math.random() * 2.4).toFixed(2),
      alpha: (0.24 + Math.random() * 0.56).toFixed(2),
    };
  });
}

function buildRocketSparks(total = 140) {
  return Array.from({ length: total }).map((_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const row = Math.floor(index / 2);

    return {
      x: side * (18 + row * 2.8 + Math.random() * 8),
      y: 36 + row * 1.4 + Math.random() * 30,
      delay: Math.floor((index / total) * 2100),
      size: (1 + Math.random() * 1.9).toFixed(2),
    };
  });
}

function buildOrbitShards(total = 44) {
  return Array.from({ length: total }).map((_, index) => {
    const t = index / (total - 1);
    const angle = t * Math.PI * 2 + randomBetween(-0.28, 0.28);
    const targetRadius = 52 + Math.random() * 34;
    const launchRadius = 170 + Math.random() * 110;
    const launchAngle = angle + randomBetween(-0.9, 0.9);

    return {
      tx: Math.cos(angle) * targetRadius,
      ty: Math.sin(angle) * targetRadius,
      sx: Math.cos(launchAngle) * launchRadius,
      sy: Math.sin(launchAngle) * launchRadius,
      delay: Math.floor(180 + t * 960 + Math.random() * 260),
      size: (0.9 + Math.random() * 2.2).toFixed(2),
      alpha: (0.28 + Math.random() * 0.46).toFixed(2),
    };
  });
}

function buildMatrixStreams(total = 30) {
  return Array.from({ length: total }).map((_, index) => {
    const glyphTotal = Math.floor(randomBetween(18, 34));
    const content = Array.from({ length: glyphTotal })
      .map(() => (Math.random() > 0.5 ? "1" : "0"))
      .join("\n");

    return {
      left: ((index + 0.5) / total) * 100 + randomBetween(-1.6, 1.6),
      size: randomBetween(11, 19).toFixed(2),
      opacity: randomBetween(0.22, 0.9).toFixed(2),
      blur: randomBetween(0, 0.9).toFixed(2),
      duration: randomBetween(3.6, 9).toFixed(2),
      delay: (-randomBetween(0, 8.8)).toFixed(2),
      content,
    };
  });
}

const SIGNATURE_VARIANTS = {
  heart: {
    path: "M120 60 Q300 38 490 60 Q680 82 860 60",
    text: "FP SOLUZIONI INFORMATICHE",
    startOffset: "50%",
  },
  moon: {
    path: "M120 60 Q490 44 860 60",
    text: "FP SOLUZIONI INFORMATICHE",
    startOffset: "50%",
  },
  rocket: {
    path: "M120 60 Q490 56 860 60",
    text: "FP SOLUZIONI INFORMATICHE",
    startOffset: "50%",
  },
  orbit: {
    path: "M120 60 Q300 74 490 60 Q680 46 860 60",
    text: "FP SOLUZIONI INFORMATICHE",
    startOffset: "50%",
  },
  matrix: {
    path: "M48 60 Q490 52 932 60",
    text: "FP SOLUZIONI INFORMATICHE",
    startOffset: "50%",
  },
};

function SignatureWriter({ tone = "ice", cycle = 5.2, variant = "orbit" }) {
  const uid = useId().replace(/:/g, "");
  const duration = `${cycle}s`;
  const current = SIGNATURE_VARIANTS[variant] || SIGNATURE_VARIANTS.orbit;
  const pathId = `signature-line-${uid}`;

  return (
    <div
      className={`signatureWriter signatureWriter--${tone} signatureWriter--${variant}`}
      style={{ "--sig-cycle": duration }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 980 84" preserveAspectRatio="xMidYMid meet">
        <path id={pathId} className="signatureGuide" d={current.path} />

        <text className="signatureText signatureTextStroke" textAnchor="middle">
          <textPath href={`#${pathId}`} startOffset={current.startOffset}>
            {current.text}
          </textPath>
        </text>
        <text className="signatureText signatureTextFill" textAnchor="middle">
          <textPath href={`#${pathId}`} startOffset={current.startOffset}>
            {current.text}
          </textPath>
        </text>

        <circle r="4.6" className="signaturePenDot">
          <animateMotion dur={duration} repeatCount="indefinite">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}

function HeartScene() {
  const dots = useMemo(() => buildHeartPoints(320, 180), []);

  return (
    <div className="scene scene--heart" aria-hidden="true">
      <span className="heartHalo" />
      <span className="heartVeil" />

      {dots.map((dot, index) => (
        <span
          key={`heart-dot-${index}`}
          className={`heartMicroDot${dot.layer === "fill" ? " is-fill" : ""}`}
          style={{
            "--tx": `${dot.x}px`,
            "--ty": `${dot.y}px`,
            "--sx": `${dot.sx}px`,
            "--sy": `${dot.sy}px`,
            "--size": `${dot.size}px`,
            "--delay": `${dot.delay}ms`,
            "--alpha": dot.alpha,
          }}
        />
      ))}

      <span className="heartShard heartShardA" />
      <span className="heartShard heartShardB" />

      <span className="heartCore" />
      <span className="heartPulseRing heartPulseRingA" />
      <span className="heartPulseRing heartPulseRingB" />

      <SignatureWriter tone="rose" cycle={5.8} variant="heart" />
    </div>
  );
}

function MoonScene() {
  const dust = useMemo(() => buildMoonDust(300), []);

  return (
    <div className="scene scene--moon" aria-hidden="true">
      <span className="moonHalo" />
      <span className="moonBody" />
      <span className="moonCut" />
      <span className="moonSweep moonSweepA" />
      <span className="moonSweep moonSweepB" />
      <span className="moonSweep moonSweepC" />

      {dust.map((dot, index) => (
        <span
          key={`moon-dust-${index}`}
          className="moonParticle"
          style={{
            "--tx": `${dot.x}px`,
            "--ty": `${dot.y}px`,
            "--sx": `${dot.sx}px`,
            "--sy": `${dot.sy}px`,
            "--size": `${dot.size}px`,
            "--delay": `${dot.delay}ms`,
            "--alpha": dot.alpha,
          }}
        />
      ))}

      <SignatureWriter tone="amber" cycle={5} variant="moon" />
    </div>
  );
}

function RocketScene() {
  const sparks = useMemo(() => buildRocketSparks(140), []);

  return (
    <div className="scene scene--rocket" aria-hidden="true">
      <span className="rocketBeam rocketBeamLeft" />
      <span className="rocketBeam rocketBeamRight" />
      <span className="rocketBeam rocketBeamBottom" />
      <span className="rocketLine" />

      <span className="rocketModel">
        <span className="rocketNose" />
        <span className="rocketBody" />
        <span className="rocketWindow" />
        <span className="rocketFin rocketFinLeft" />
        <span className="rocketFin rocketFinRight" />
        <span className="rocketFire" />
      </span>

      {sparks.map((spark, index) => (
        <span
          key={`rocket-spark-${index}`}
          className="rocketSpark"
          style={{
            "--x": `${spark.x}px`,
            "--y": `${spark.y}px`,
            "--size": `${spark.size}px`,
            "--delay": `${spark.delay}ms`,
          }}
        />
      ))}

      <SignatureWriter tone="mint" cycle={4.4} variant="rocket" />
    </div>
  );
}

function OrbitScene() {
  const shards = useMemo(() => buildOrbitShards(44), []);

  return (
    <div className="scene scene--orbit" aria-hidden="true">
      <span className="orbitGlow" />
      <span className="orbitCenter" />
      <span className="orbitRing orbitRingA" />
      <span className="orbitRing orbitRingB" />
      <span className="orbitRing orbitRingC" />
      <span className="orbitDot orbitDotA" />
      <span className="orbitDot orbitDotB" />
      <span className="orbitDot orbitDotC" />
      <span className="orbitConverge orbitConvergeA" />
      <span className="orbitConverge orbitConvergeB" />

      {shards.map((shard, index) => (
        <span
          key={`orbit-shard-${index}`}
          className="orbitShard"
          style={{
            "--tx": `${shard.tx}px`,
            "--ty": `${shard.ty}px`,
            "--sx": `${shard.sx}px`,
            "--sy": `${shard.sy}px`,
            "--size": `${shard.size}px`,
            "--delay": `${shard.delay}ms`,
            "--alpha": shard.alpha,
          }}
        />
      ))}

      <SignatureWriter tone="ice" cycle={5.2} variant="orbit" />
    </div>
  );
}

function MatrixScene({ full = false }) {
  const streams = useMemo(() => buildMatrixStreams(full ? 52 : 32), [full]);

  return (
    <div className="scene scene--matrix" aria-hidden="true">
      <span className="matrixGlow matrixGlowTop" />
      <span className="matrixGlow matrixGlowBottom" />
      <span className="matrixGridVeil" />

      {streams.map((stream, index) => (
        <span
          key={`matrix-stream-${index}`}
          className="matrixStream"
          style={{
            "--left": `${stream.left}%`,
            "--size": `${stream.size}px`,
            "--opacity": stream.opacity,
            "--blur": `${stream.blur}px`,
            "--duration": `${stream.duration}s`,
            "--delay": `${stream.delay}s`,
          }}
        >
          {stream.content}
        </span>
      ))}

      <SignatureWriter tone="matrix" cycle={5.6} variant="matrix" />
    </div>
  );
}

export default function SplashScene({ id, full = false }) {
  const sceneClass = full ? "is-full" : "is-preview";

  if (id === "heart") {
    return (
      <div className={sceneClass}>
        <HeartScene />
      </div>
    );
  }

  if (id === "moon") {
    return (
      <div className={sceneClass}>
        <MoonScene />
      </div>
    );
  }

  if (id === "rocket") {
    return (
      <div className={sceneClass}>
        <RocketScene />
      </div>
    );
  }

  if (id === "orbit") {
    return (
      <div className={sceneClass}>
        <OrbitScene />
      </div>
    );
  }

  if (id === "matrix") {
    return (
      <div className={sceneClass}>
        <MatrixScene full={full} />
      </div>
    );
  }

  return (
    <div className={sceneClass}>
      <OrbitScene />
    </div>
  );
}
