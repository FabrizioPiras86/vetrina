import React from "react";

export default function Chrome() {
  return (
    <div className="chrome" aria-hidden="true">
      <img src="/logo-ap.svg" alt="" className="chromeBrand" />
      <div className="chromeDot red" />
      <div className="chromeDot yellow" />
      <div className="chromeDot green" />
      <div className="chromeLine" />
    </div>
  );
}
