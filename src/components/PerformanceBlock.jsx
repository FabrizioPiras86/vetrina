import React from "react";

const lighthouseScores = [
  {
    id: "performance",
    title: "Performance",
    score: 98,
    hint: "LCP 1.7s · TBT 70ms · CLS 0.02",
    tone: "mint",
  },
  {
    id: "seo",
    title: "SEO",
    score: 100,
    hint: "Meta complete · Sitemap · Structured data",
    tone: "sky",
  },
  {
    id: "accessibility",
    title: "Accessibilita",
    score: 96,
    hint: "Contrasti AA · Focus visibile · Form labels",
    tone: "amber",
  },
];

const optimizationItems = [
  "Image delivery in WebP/AVIF",
  "Code splitting sulle pagine principali",
  "Preload delle font critiche",
  "Caching aggressivo static assets",
];

function scoreState(score) {
  if (score >= 90) return "Eccellente";
  if (score >= 75) return "Buono";
  return "Da migliorare";
}

export default function PerformanceBlock() {
  return (
    <div className="perfBoard">
      <div className="perfScoreGrid">
        {lighthouseScores.map((item) => (
          <article key={item.id} className={`perfCard perfCard--${item.tone}`}>
            <div className="perfCardHead">
              <h3>{item.title}</h3>
              <span>{scoreState(item.score)}</span>
            </div>

            <div className="perfGauge" style={{ "--score": item.score }}>
              <span className="perfGaugeValue">{item.score}</span>
            </div>

            <p>{item.hint}</p>
          </article>
        ))}
      </div>

      <div className="perfChecklist">
        <h3>Ottimizzazioni incluse</h3>
        <ul>
          {optimizationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
