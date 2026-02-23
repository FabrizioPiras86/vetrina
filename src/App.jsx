import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Detail from "./pages/Detail.jsx";

export default function App() {
  return (
    <div className="appRoot">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/splash/:id" element={<Detail />} />
        <Route path="/showcase/:id" element={<Detail />} />
      </Routes>
    </div>
  );
}
