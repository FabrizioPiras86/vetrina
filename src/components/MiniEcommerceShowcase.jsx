import React, { useMemo, useState } from "react";

const products = [
  { id: "p1", name: "Aurora Buds X", category: "Audio", price: 89, rating: 4.7, badge: "Best seller" },
  { id: "p2", name: "Pulse Smartwatch", category: "Wearable", price: 179, rating: 4.5, badge: "New" },
  { id: "p3", name: "Nimbus Lamp Pro", category: "Casa", price: 64, rating: 4.8, badge: "Eco" },
  { id: "p4", name: "Dock Flex 7-in-1", category: "Ufficio", price: 99, rating: 4.4, badge: "Pro" },
  { id: "p5", name: "Soundbar Nova", category: "Audio", price: 149, rating: 4.6, badge: "Top" },
  { id: "p6", name: "Air Purifier Mini", category: "Casa", price: 119, rating: 4.3, badge: "Smart" },
];

const categories = ["Tutti", "Audio", "Casa", "Wearable", "Ufficio"];

const sortOptions = [
  { id: "featured", label: "In evidenza" },
  { id: "priceAsc", label: "Prezzo: basso-alto" },
  { id: "priceDesc", label: "Prezzo: alto-basso" },
  { id: "rating", label: "Valutazione" },
  { id: "name", label: "Nome A-Z" },
];

function tintClassByCategory(category) {
  if (category === "Audio") return "shopItem--audio";
  if (category === "Casa") return "shopItem--home";
  if (category === "Wearable") return "shopItem--wearable";
  return "shopItem--office";
}

export default function MiniEcommerceShowcase() {
  const [activeCategory, setActiveCategory] = useState("Tutti");
  const [sortBy, setSortBy] = useState("featured");
  const [quickView, setQuickView] = useState(null);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "Tutti"
        ? [...products]
        : products.filter((item) => item.category === activeCategory);

    if (sortBy === "priceAsc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [activeCategory, sortBy]);

  return (
    <>
      <div className="shopShowcase">
        <div className="shopControls">
          <div className="shopFilterRow">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`shopFilterButton${activeCategory === category ? " is-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="shopSortLabel">
            Ordina
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="shopGrid">
          {visibleProducts.map((item) => (
            <article key={item.id} className={`shopItem ${tintClassByCategory(item.category)}`}>
              <div className="shopItemVisual">
                <span>{item.category}</span>
              </div>

              <div className="shopItemBody">
                <div className="shopItemTop">
                  <h3>{item.name}</h3>
                  <span className="shopItemBadge">{item.badge}</span>
                </div>

                <p>
                  € {item.price}
                  <span> · ★ {item.rating}</span>
                </p>

                <button type="button" className="shopQuickButton" onClick={() => setQuickView(item)}>
                  Quick view
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {quickView ? (
        <div
          className="shopModalBackdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Quick view prodotto"
          onClick={() => setQuickView(null)}
        >
          <div className={`shopModalPanel ${tintClassByCategory(quickView.category)}`} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="shopModalClose" onClick={() => setQuickView(null)}>
              Chiudi
            </button>

            <div className="shopModalBody">
              <h3>{quickView.name}</h3>
              <p className="shopModalMeta">
                {quickView.category} · ★ {quickView.rating}
              </p>
              <p className="shopModalPrice">€ {quickView.price}</p>
              <p className="shopModalDesc">
                Scheda rapida per testare overlay, focus visivo e micro-copy prodotto senza cambiare pagina.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
