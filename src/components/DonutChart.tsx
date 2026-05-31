import { useEffect, useRef } from 'react';

interface Segment { value: number; color: string; }

interface Props {
  segments: Segment[];
  size?: number;
}

export default function DonutChart({ segments, size = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const cx = size / 2, cy = size / 2;
    const r = size * 0.38, innerR = size * 0.24;
    const gap = 0.03;
    const total = segments.reduce((s, seg) => s + seg.value, 0);

    ctx.clearRect(0, 0, size, size);

    if (total === 0) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#e2e8f0'; ctx.fill();
    } else {
      let angle = -Math.PI / 2;
      segments.forEach(seg => {
        if (seg.value === 0) return;
        const sweep = (seg.value / total) * (Math.PI * 2) - gap;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle + gap / 2, angle + sweep + gap / 2);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        angle += (seg.value / total) * Math.PI * 2;
      });
    }

    ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
  }, [segments, size]);

  return <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />;
}
