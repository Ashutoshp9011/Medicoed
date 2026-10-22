import { useEffect, useRef } from "react";
import "./scratch_video.css";

type ScratchVideoProps = {
  src: string;
};

export default function scratch_video({ src }: scratch_videoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !video || !context) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.fillStyle = "#080808";
      context.fillRect(0, 0, rect.width, rect.height);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  function erase(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!scratching.current && event.type !== "pointerdown") return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.save();
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 34, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  return (
    <div className="scratch-video">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
      />

      <canvas
        ref={canvasRef}
        className="scratch-layer"
        onPointerDown={(event) => {
          scratching.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          erase(event);
        }}
        onPointerMove={erase}
        onPointerUp={() => {
          scratching.current = false;
        }}
        onPointerCancel={() => {
          scratching.current = false;
        }}
        aria-label="Scratch the black surface to reveal the video"
      />
    </div>
  );
}
