import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplashScene from "../components/SplashScene.jsx";
import { getSplashById, splashItems } from "../data/splashes.js";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const current = getSplashById(id);

  return (
    <div className="splashDetailPage">
      <main className="splashDetailShell">
        <header className="splashDetailHeader">
          <button type="button" className="detailBackButton" onClick={() => navigate("/")}>
            Vetrina
          </button>

          <div className="detailTitleGroup">
            <img src="/logo-ap.svg" alt="Logo Fabrizio Piras" className="detailHeaderLogo" />
            <div>
              <h1>{current.title}</h1>
              <p>FP SOLUZIONI INFORMATICHE</p>
            </div>
          </div>

          <div className="detailNavChips">
            {splashItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`detailChip${current.id === item.id ? " is-active" : ""}`}
                onClick={() => navigate(`/splash/${item.id}`)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </header>

        <section className="splashDetailStage">
          <SplashScene id={current.id} full />
        </section>
      </main>
    </div>
  );
}
