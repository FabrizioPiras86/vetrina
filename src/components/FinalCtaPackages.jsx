import React from "react";

const packages = [
  {
    id: "base",
    title: "Base",
    price: "da 490€",
    note: "Presenza online rapida",
    features: ["One-page professionale", "SEO base + analytics", "Consegna in 5 giorni"],
  },
  {
    id: "pro",
    title: "Pro",
    price: "da 1.200€",
    note: "Sito completo per conversioni",
    features: ["Multi-page con CMS", "Animazioni e performance tuning", "Setup lead form + tracciamenti"],
    featured: true,
  },
  {
    id: "custom",
    title: "Su misura",
    price: "preventivo",
    note: "Flussi custom e integrazioni",
    features: ["Area riservata / e-commerce", "Automazioni API", "Supporto continuativo"],
  },
];

export default function FinalCtaPackages() {
  return (
    <div className="finalCtaBlock">
      <div className="packageGrid">
        {packages.map((item) => (
          <article key={item.id} className={`packageCard${item.featured ? " is-featured" : ""}`}>
            <h3>{item.title}</h3>
            <p className="packagePrice">{item.price}</p>
            <p className="packageNote">{item.note}</p>
            <ul className="packageFeatures">
              {item.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="finalActionRow">
        <div>
          <h3>Vuoi partire subito?</h3>
          <p>Ti preparo una proposta rapida in base al pacchetto che scegli.</p>
        </div>

        <div className="finalActionButtons">
          <button type="button" className="finalActionButton finalActionButton--primary">
            Richiedi proposta
          </button>
          <button type="button" className="finalActionButton finalActionButton--ghost">
            Pianifica demo
          </button>
        </div>
      </div>
    </div>
  );
}
