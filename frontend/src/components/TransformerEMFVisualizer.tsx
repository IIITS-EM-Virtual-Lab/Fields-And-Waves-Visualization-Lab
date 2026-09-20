import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const TransformerEMFVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [v1Peak, setV1Peak] = useState<number>(120); // Volts
  const [n1, setN1] = useState<number>(20); // Primary turns
  const [n2, setN2] = useState<number>(40); // Secondary turns
  const [frequency, setFrequency] = useState<number>(2.0); // Hz
  const [time, setTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physics calculations
  const turnsRatio = n2 / n1; // V2 / V1 = N2 / N1
  const v2Peak = v1Peak * turnsRatio;
  const omega = 2 * Math.PI * frequency;

  // Live instantaneous values
  const v1Instant = v1Peak * Math.cos(omega * time);
  const phiInstant = (v1Peak / (n1 * omega)) * Math.sin(omega * time); // Magnetic flux
  const v2Instant = -n2 * (v1Peak / n1) * Math.cos(omega * time); // Induced secondary EMF

  // Animation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setTime((prev) => prev + dt);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Main Transformer Canvas Drawing (Clean Light Mode)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clean white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Light grid pattern
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Core Geometry Dimensions
    const coreOuterW = 340;
    const coreOuterH = 240;
    const coreThick = 55;
    const coreX = (w - coreOuterW) / 2;
    const coreY = (h - coreOuterH) / 2 - 15;

    const coreInnerW = coreOuterW - 2 * coreThick;
    const coreInnerH = coreOuterH - 2 * coreThick;
    const innerX = coreX + coreThick;
    const innerY = coreY + coreThick;

    // Draw Laminated Iron Core
    ctx.fillStyle = '#e2e8f0'; // Slate-200
    ctx.strokeStyle = '#94a3b8'; // Slate-400
    ctx.lineWidth = 2.5;

    // Outer rectangle
    ctx.beginPath();
    ctx.roundRect(coreX, coreY, coreOuterW, coreOuterH, 12);
    // Cut out inner window
    ctx.roundRect(innerX + coreInnerW, innerY, -coreInnerW, coreInnerH, 8);
    ctx.fill('evenodd');
    ctx.stroke();

    // Core lamination lines effect
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    for (let y = coreY + 12; y < coreY + coreOuterH; y += 14) {
      ctx.beginPath();
      ctx.moveTo(coreX + 4, y);
      ctx.lineTo(coreX + coreThick - 4, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(coreX + coreOuterW - coreThick + 4, y);
      ctx.lineTo(coreX + coreOuterW - 4, y);
      ctx.stroke();
    }

    // Magnetic Flux Circulation Lines inside the Core
    const fluxFactor = Math.sin(omega * time);
    const fluxAlpha = Math.min(0.95, Math.abs(fluxFactor) * 0.8 + 0.2);
    const fluxColor = fluxFactor >= 0 ? `rgba(2, 132, 199, ${fluxAlpha})` : `rgba(225, 29, 72, ${fluxAlpha})`;

    const fluxMidX1 = coreX + coreThick / 2;
    const fluxMidX2 = coreX + coreOuterW - coreThick / 2;
    const fluxMidY1 = coreY + coreThick / 2;
    const fluxMidY2 = coreY + coreOuterH - coreThick / 2;

    ctx.strokeStyle = fluxColor;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = -time * 50 * (fluxFactor >= 0 ? 1 : -1);

    ctx.beginPath();
    ctx.roundRect(fluxMidX1, fluxMidY1, fluxMidX2 - fluxMidX1, fluxMidY2 - fluxMidY1, 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Primary Coil (Left Leg)
    const primaryTurnCount = Math.min(14, Math.max(4, Math.floor(n1 / 4)));
    const primaryCoilY1 = coreY + coreThick + 10;
    const primaryCoilY2 = coreY + coreOuterH - coreThick - 10;
    const primarySpacing = (primaryCoilY2 - primaryCoilY1) / primaryTurnCount;

    for (let i = 0; i < primaryTurnCount; i++) {
      const ty = primaryCoilY1 + i * primarySpacing;
      ctx.fillStyle = '#f59e0b'; // Amber copper wire
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(coreX - 14, ty, coreThick + 28, primarySpacing * 0.7, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Secondary Coil (Right Leg)
    const secondaryTurnCount = Math.min(18, Math.max(4, Math.floor(n2 / 4)));
    const secondaryCoilY1 = coreY + coreThick + 8;
    const secondaryCoilY2 = coreY + coreOuterH - coreThick - 8;
    const secondarySpacing = (secondaryCoilY2 - secondaryCoilY1) / secondaryTurnCount;

    for (let i = 0; i < secondaryTurnCount; i++) {
      const ty = secondaryCoilY1 + i * secondarySpacing;
      ctx.fillStyle = '#0284c7'; // Sky-600 wire
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(coreX + coreOuterW - coreThick - 14, ty, coreThick + 28, secondarySpacing * 0.7, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Input AC Source Leads (Left)
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(coreX - 14, primaryCoilY1);
    ctx.lineTo(coreX - 60, primaryCoilY1);
    ctx.moveTo(coreX - 14, primaryCoilY2 + primarySpacing * 0.7);
    ctx.lineTo(coreX - 60, primaryCoilY2 + primarySpacing * 0.7);
    ctx.stroke();

    // AC Source Symbol (Left)
    const acCenterX = coreX - 85;
    const acCenterY = (primaryCoilY1 + primaryCoilY2) / 2;
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(acCenterX, acCenterY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Wave inside AC circle
    ctx.beginPath();
    ctx.moveTo(acCenterX - 10, acCenterY);
    ctx.bezierCurveTo(acCenterX - 5, acCenterY - 10, acCenterX, acCenterY - 10, acCenterX, acCenterY);
    ctx.bezierCurveTo(acCenterX, acCenterY + 10, acCenterX + 5, acCenterY + 10, acCenterX + 10, acCenterY);
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`V₁ = ${v1Peak.toFixed(0)}V AC`, acCenterX, acCenterY + 38);
    ctx.fillText(`N₁ = ${n1} Turns`, coreX + coreThick / 2, coreY - 12);

    // Output Load / Bulb (Right)
    const loadCenterX = coreX + coreOuterW + 85;
    const loadCenterY = (secondaryCoilY1 + secondaryCoilY2) / 2;

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(coreX + coreOuterW + 14, secondaryCoilY1);
    ctx.lineTo(coreX + coreOuterW + 60, secondaryCoilY1);
    ctx.lineTo(coreX + coreOuterW + 60, loadCenterY - 20);
    ctx.lineTo(loadCenterX - 15, loadCenterY - 20);

    ctx.moveTo(coreX + coreOuterW + 14, secondaryCoilY2 + secondarySpacing * 0.7);
    ctx.lineTo(coreX + coreOuterW + 60, secondaryCoilY2 + secondarySpacing * 0.7);
    ctx.lineTo(coreX + coreOuterW + 60, loadCenterY + 20);
    ctx.lineTo(loadCenterX - 15, loadCenterY + 20);
    ctx.stroke();

    // Glowing Light Bulb Load
    const bulbGlow = Math.min(1.0, (Math.abs(v2Instant) / 200) * 0.9 + 0.1);
    const glowGrad = ctx.createRadialGradient(loadCenterX, loadCenterY, 5, loadCenterX, loadCenterY, 35);
    glowGrad.addColorStop(0, `rgba(234, 179, 8, ${bulbGlow * 0.8})`);
    glowGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');

    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(loadCenterX, loadCenterY, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(loadCenterX, loadCenterY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Filament
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(loadCenterX - 6, loadCenterY + 6);
    ctx.lineTo(loadCenterX, loadCenterY - 8);
    ctx.lineTo(loadCenterX + 6, loadCenterY + 6);
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`V₂ = ${Math.abs(v2Peak).toFixed(0)}V AC`, loadCenterX, loadCenterY + 38);
    ctx.fillText(`N₂ = ${n2} Turns`, coreX + coreOuterW - coreThick / 2, coreY - 12);

    // Magnetic flux label in core center
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Iron Core (μ_r ≫ 1)', (coreX + innerX + coreInnerW) / 2, innerY + coreInnerH / 2 - 8);
    ctx.fillStyle = fluxFactor >= 0 ? '#0284c7' : '#e11d48';
    ctx.fillText(`Flux Φ(t) = ${(phiInstant * 1000).toFixed(1)} mWb`, (coreX + innerX + coreInnerW) / 2, innerY + coreInnerH / 2 + 10);
  }, [time, v1Peak, n1, n2, frequency, v2Peak, phiInstant, v2Instant, omega]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 text-slate-800 flex flex-col gap-5">
      {/* Header Bar */}
      <div className="pb-3 border-b border-slate-200">
        <h3 className="text-base sm:text-lg font-bold tracking-wide text-slate-900 uppercase">
          Figure 1: AC Transformer EMF Visualizer
        </h3>
      </div>

      {/* Viewport + Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Transformer Schematic Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full aspect-[4/3] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <canvas ref={canvasRef} width={620} height={465} className="w-full h-full object-contain" />

            {/* Play/Pause/Reset Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-lg text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition shadow-sm"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    setTime(0);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
              <span className="text-slate-600 font-mono text-[11px] font-semibold">f = {frequency.toFixed(1)} Hz</span>
            </div>
          </div>
        </div>

        {/* Right: Telemetry & Sliders */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Live Math Telemetry */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Transformer Ratio & Derivation
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Turns Ratio (N₂/N₁)</div>
                <div className="text-lg font-black text-blue-600 font-mono">{turnsRatio.toFixed(2)} : 1</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Peak Secondary EMF</div>
                <div className="text-lg font-black text-amber-600 font-mono">{v2Peak.toFixed(0)} V</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 text-xs">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Interactive Parameters
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">Primary Turns (N₁)</span>
                <span className="font-mono text-amber-600 font-bold">{n1} turns</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={n1}
                onChange={(e) => setN1(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">Secondary Turns (N₂)</span>
                <span className="font-mono text-blue-600 font-bold">{n2} turns</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={n2}
                onChange={(e) => setN2(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">Input Primary Voltage (V₁)</span>
                <span className="font-mono text-emerald-600 font-bold">{v1Peak} V</span>
              </div>
              <input
                type="range"
                min="20"
                max="240"
                step="10"
                value={v1Peak}
                onChange={(e) => setV1Peak(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">AC Frequency (f)</span>
                <span className="font-mono text-purple-600 font-bold">{frequency.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformerEMFVisualizer;
