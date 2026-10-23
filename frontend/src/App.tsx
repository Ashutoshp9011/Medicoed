import { useRef, type MouseEvent } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./login";
import Welcome from "./Welcome";
import "./App.css";


export default function App() {
  const revealLayerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const overlay = revealLayerRef.current;
    if (!overlay) return;

    overlay.style.setProperty("--mouse-x", `${event.clientX}px`);
    overlay.style.setProperty("--mouse-y", `${event.clientY}px`);
  }

  function handleMouseLeave() {
    const overlay = revealLayerRef.current;
    if (!overlay) return;

    overlay.style.setProperty("--mouse-x", "-1000px");
    overlay.style.setProperty("--mouse-y", "-1000px");
  }

  return (
    <div
      className="app-root"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        className="app-background-video"
        src="/dandk7sciencefacts_ssspin.io_1792676016.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      <div
        ref={revealLayerRef}
        className="app-video-overlay"
        aria-hidden="true"
      />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </div>
  );
}
