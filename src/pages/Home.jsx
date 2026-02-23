import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScene from "../components/SplashScene.jsx";
import PointerMotionLab from "../components/PointerMotionLab.jsx";
import { splashItems } from "../data/splashes.js";

const mouseModes = [
  {
    id: "silk",
    title: "Silk Trail",
    note: "Linea morbida blu",
  },
  {
    id: "amber",
    title: "Moon Dust",
    note: "Polvere granulare con nucleo caldo",
  },
  {
    id: "violet",
    title: "Violet Ribbon",
    note: "Doppio tubo ondulato con ellissi",
  },
  {
    id: "steel",
    title: "Steel Echo",
    note: "Traccia tecnica desaturata",
  },
];

const buttonItems = [
  { id: "pulse", label: "Pulse Ring", cls: "btnFx-pulse", note: "anello espansivo" },
  { id: "tilt", label: "Soft Tilt", cls: "btnFx-tilt", note: "inclinazione breve" },
  { id: "ripple", label: "Ripple", cls: "btnFx-ripple", note: "onda concentrica" },
  { id: "flip", label: "Axis Flip", cls: "btnFx-flip", note: "flip verticale" },
  { id: "glow", label: "Glow Sweep", cls: "btnFx-glow", note: "luce orizzontale" },
  { id: "snap", label: "Snap Down", cls: "btnFx-snap", note: "pressione elastica" },
  { id: "orbit", label: "Orbit Arc", cls: "btnFx-orbit", note: "arco orbitale" },
  { id: "prism", label: "Prism Shift", cls: "btnFx-prism", note: "sfumatura prismatica" },
  { id: "echo", label: "Echo Wave", cls: "btnFx-echo", note: "doppio eco" },
  { id: "dash", label: "Dash Line", cls: "btnFx-dash", note: "linea rapida" },
];

function MotionButton({ item }) {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const onClick = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setActive(false);
    window.requestAnimationFrame(() => {
      setActive(true);
      timeoutRef.current = window.setTimeout(() => setActive(false), 760);
    });
  };

  return (
    <button
      type="button"
      className={`microButton ${item.cls}${active ? " is-active" : ""}`}
      onClick={onClick}
    >
      <span className="microButtonTitle">{item.label}</span>
      <span className="microButtonNote">{item.note}</span>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [mouseMode, setMouseMode] = useState(mouseModes[0].id);

  return (
    <div className="galleryPage">
      <main className="galleryShell">
        <header className="topBar">
          <img src="/logo-ap.svg" alt="Logo Fabrizio Piras" className="topLogo" />
          <div className="topMeta">
            <div className="topTitleRow">
              <h1>Demo lavori</h1>
              <span className="topLead">alcuni esempi di cosa si può personalizzare il proprio sito</span>
            </div>
            <p>FP Soluzioni Informatiche</p>
          </div>
        </header>

        <section className="panel">
          <div className="panelHead">
            <h2 className="panelTitle">Splash</h2>
            <span className="panelHint">Clicca una card per aprire la pagina completa</span>
          </div>

          <div className="splashCardGrid">
            {splashItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="splashCardButton"
                onClick={() => navigate(`/splash/${item.id}`)}
              >
                <div className="splashPreviewStage">
                  <SplashScene id={item.id} />
                </div>
                <div className="splashCardMeta">
                  <strong>{item.title}</strong>
                  <span>{item.note}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHead">
            <h2 className="panelTitle">Movimenti Mouse</h2>
            <span className="panelHint">Seleziona preset e muovi il mouse nel riquadro</span>
          </div>

          <div className="mouseSectionLayout">
            <div className="mouseModeGrid">
              {mouseModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`mouseModeButton${mouseMode === mode.id ? " is-active" : ""}`}
                  onClick={() => setMouseMode(mode.id)}
                >
                  <span>{mode.title}</span>
                  <small>{mode.note}</small>
                </button>
              ))}
            </div>
            <PointerMotionLab mode={mouseMode} hint="Muovi e clicca nel riquadro" />
          </div>
        </section>

        <section className="panel">
          <div className="panelHead">
            <h2 className="panelTitle">Pulsanti</h2>
            <span className="panelHint">Micro-interazioni al click</span>
          </div>

          <div className="microButtonGrid">
            {buttonItems.map((item) => (
              <MotionButton key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
