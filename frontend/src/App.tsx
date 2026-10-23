import {useCallback, useEffect, useRef, useState,
  type MouseEvent, type TouchEvent,} from "react";

import { Routes, Route } from "react-router-dom";
import Login from "./login";
import Welcome from "./Welcome";
import Signup from "./signup"; 
import "./App.css";

const REVEAL_THRESHOLD = 0.40;
const BRUSH_RADIUS = 105;
const GRID_SIZE = 16;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const revealedCellsRef = useRef(new Set<number>());
  const gridRef = useRef({ columns: 0, rows: 0 });
  const completedRef = useRef(false);

  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "#FFF3D1";
    ctx.fillRect(0, 0, width, height);

    contextRef.current = ctx;

    const columns = Math.ceil(width / GRID_SIZE);
    const rows = Math.ceil(height / GRID_SIZE);

    gridRef.current = { columns, rows };
    revealedCellsRef.current.clear();
  }, []);

  useEffect(() => {
    setupCanvas();

    const handleResize = () => {
      // Never cover the video again after completion.
      if (!completedRef.current) {
        setupCanvas();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setupCanvas]);

  const eraseAt = useCallback((x: number, y: number) => {
    if (completedRef.current) return;

    const ctx = contextRef.current;
    if (!ctx) return;

    // Create a soft, feathered brush.
    const gradient = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      BRUSH_RADIUS
    );

    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.65, "rgba(0,0,0,0.95)");
    gradient.addColorStop(0.85, "rgba(0,0,0,0.55)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.save();

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Track the area visited by the brush.
    const { columns, rows } = gridRef.current;

    const minCol = Math.max(
      0,
      Math.floor((x - BRUSH_RADIUS) / GRID_SIZE)
    );

    const maxCol = Math.min(
      columns - 1,
      Math.floor((x + BRUSH_RADIUS) / GRID_SIZE)
    );

    const minRow = Math.max(
      0,
      Math.floor((y - BRUSH_RADIUS) / GRID_SIZE)
    );

    const maxRow = Math.min(
      rows - 1,
      Math.floor((y + BRUSH_RADIUS) / GRID_SIZE)
    );

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const cellX = (col + 0.5) * GRID_SIZE;
        const cellY = (row + 0.5) * GRID_SIZE;

        const dx = cellX - x;
        const dy = cellY - y;

        if (dx * dx + dy * dy <= BRUSH_RADIUS * BRUSH_RADIUS) {
          revealedCellsRef.current.add(row * columns + col);
        }
      }
    }

    const totalCells = columns * rows;

    const coverage = totalCells
      ? revealedCellsRef.current.size / totalCells
      : 0;

    // When 65% of the screen has been explored,
    // fade away the entire remaining overlay.
    if (coverage >= REVEAL_THRESHOLD) {
      completedRef.current = true;

      // Remove the remaining overlay completely.
      const canvas = canvasRef.current;
      const ctx = contextRef.current;

      if (canvas && ctx) {
        canvas.style.transition = "opacity 1.2s ease";
        canvas.style.opacity = "0";
      }

      setIsFullyRevealed(true);
    }
  }, []);

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    eraseAt(event.clientX, event.clientY);
  };

  const handleTouchMove = (
    event: TouchEvent<HTMLDivElement>
  ) => {
    const touch = event.touches[0];

    if (touch) {
      eraseAt(touch.clientX, touch.clientY);
    }
  };

  return (
    <div
      className="app-root"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
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

      <canvas
        ref={canvasRef}
        className={`app-erase-canvas ${
          isFullyRevealed ? "is-revealed" : ""
        }`}
        aria-hidden="true"
      />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </div>
  );
}