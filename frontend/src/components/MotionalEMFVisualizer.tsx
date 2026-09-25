import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MotionalEMFVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [velocity, setVelocity] = useState<number>(6.0); // m/s
  const [bField, setBField] = useState<number>(1.5); // Tesla (positive into screen, negative out)
  const [rodLength, setRodLength] = useState<number>(0.5); // meters
  const [resistance, setResistance] = useState<number>(2.0); // Ohms
  const [rodPos, setRodPos] = useState<number>(0.25); // normalized 0.1 to 0.85

  const [time, setTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derived physics
  const emf = bField * rodLength * velocity; // Volts
  const current = emf / resistance; // Amperes
  const dragForce = Math.abs(current * rodLength * bField); // Newtons
  const pMech = dragForce * Math.abs(velocity); // Watts
  const pElec = current * current * resistance; // Watts

  // Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setTime((prev) => prev + dt);

        // Move rod across rails
        setRodPos((prev) => {
          let next = prev + velocity * dt * 0.08;
          if (next > 0.85) {
            next = 0.15;
          } else if (next < 0.15) {
            next = 0.85;
          }
          return next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, velocity]);

  // Main Canvas Rendering (Clean Light Mode)
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

    const railX1 = w * 0.12;
    const railX2 = w * 0.88;
    const railY1 = h * 0.28;
    const railY2 = h * 0.74;
    const railWidth = railX2 - railX1;
    const rodX = railX1 + rodPos * railWidth;

    // Magnetic field background symbols
    const isInto = bField >= 0;
    const bColor = isInto ? 'rgba(2, 132, 199, 0.25)' : 'rgba(225, 29, 72, 0.25)';
    ctx.fillStyle = bColor;
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    for (let x = railX1 - 20; x <= railX2 + 20; x += 36) {
      for (let y = railY1 - 30; y <= railY2 + 30; y += 36) {
        ctx.fillText(isInto ? '⊗' : '⊙', x, y);
      }
    }

    // B-field header badge inside canvas
    ctx.fillStyle = isInto ? '#0369a1' : '#be123c';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`B = ${Math.abs(bField).toFixed(2)} T (${isInto ? 'INTO PAGE ⊗' : 'OUT OF PAGE ⊙'})`, railX1, railY1 - 45);

    // Draw Conducting U-Rails
    ctx.strokeStyle = '#64748b'; // Slate-500
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';

    // Left connecting bar
    ctx.beginPath();
    ctx.moveTo(railX1, railY1);
    ctx.lineTo(railX1, railY2);
    ctx.stroke();

    // Top rail
    ctx.beginPath();
    ctx.moveTo(railX1, railY1);
    ctx.lineTo(railX2, railY1);
    ctx.stroke();

    // Bottom rail
    ctx.beginPath();
    ctx.moveTo(railX1, railY2);
    ctx.lineTo(railX2, railY2);
    ctx.stroke();

    // Resistor on left vertical bar
    const midY = (railY1 + railY2) / 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(railX1 - 14, midY - 25, 28, 50);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(railX1 - 12, midY - 23, 24, 46);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`R=${resistance.toFixed(1)}Ω`, railX1 - 32, midY + 4);

    // Draw Moving Rod
    const rodGrad = ctx.createLinearGradient(rodX - 7, 0, rodX + 7, 0);
    rodGrad.addColorStop(0, '#fef08a');
    rodGrad.addColorStop(0.5, '#f59e0b');
    rodGrad.addColorStop(1, '#d97706');

    ctx.fillStyle = rodGrad;
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(rodX - 6, railY1 - 12, 12, (railY2 - railY1) + 24, 3);
    ctx.fill();
    ctx.stroke();

    // Velocity Vector Arrow
    const velArrowLen = velocity * 10;
    if (Math.abs(velocity) > 0.1) {
      drawArrow(ctx, rodX, midY, rodX + velArrowLen, midY, '#16a34a', 3);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, rodX + velArrowLen / 2, midY - 14);
    }

    // Lorentz force direction on positive charges: F = q(v x B)
    // If v > 0 and B > 0 (into screen), v x B points UPWARDS.
    // Top terminal is POSITIVE (+), Bottom terminal is NEGATIVE (-).
    const topIsPositive = (velocity * bField) >= 0;

    // Terminal Polarity Markers
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = topIsPositive ? '#dc2626' : '#2563eb';
    ctx.fillText(topIsPositive ? '+' : '−', rodX, railY1 - 18);

    ctx.fillStyle = topIsPositive ? '#2563eb' : '#dc2626';
    ctx.fillText(topIsPositive ? '−' : '+', rodX, railY2 + 24);

    // Current Circulation Animation (Lenz's law)
    if (Math.abs(current) > 0.01) {
      const currentSpeed = (time * 90 * (topIsPositive ? 1 : -1)) % 100;
      const arrowX = railX1 + ((currentSpeed / 100) * (rodX - railX1));

      // Arrows along rails
      if (arrowX > railX1 + 15 && arrowX < rodX - 15) {
        drawSmallArrow(ctx, arrowX, railY1, topIsPositive ? -1 : 1, 0);
        drawSmallArrow(ctx, arrowX, railY2, topIsPositive ? 1 : -1, 0);
      }
      drawSmallArrow(ctx, railX1, midY, 0, topIsPositive ? 1 : -1);
      drawSmallArrow(ctx, rodX, midY, 0, topIsPositive ? -1 : 1);

      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`I = ${Math.abs(current).toFixed(2)} A`, (railX1 + rodX) / 2, railY1 - 8);
    }

    // Opposing Magnetic Drag Force Arrow (F_mag = I L B)
    if (dragForce > 0.01 && Math.abs(velocity) > 0.1) {
      const dragDir = velocity > 0 ? -1 : 1;
      const dragLen = dragDir * Math.min(50, dragForce * 12);
      drawArrow(ctx, rodX, midY + 28, rodX + dragLen, midY + 28, '#dc2626', 2.5);
      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`F_drag = ${dragForce.toFixed(2)} N`, rodX + dragLen / 2, midY + 44);
    }

    // Conductor length label
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(railX2 + 20, railY1);
    ctx.lineTo(railX2 + 20, railY2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText(`ℓ = ${rodLength.toFixed(2)} m`, railX2 + 50, midY + 4);
  }, [time, rodPos, velocity, bField, rodLength, resistance, current, dragForce, emf]);

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, width: number) => {
    const headLen = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const drawSmallArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, dirX: number, dirY: number) => {
    const angle = Math.atan2(dirY, dirX);
    const size = 5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size, -size * 0.7);
    ctx.lineTo(-size, size * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 text-slate-800 flex flex-col gap-5">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h3 className="text-base sm:text-lg font-bold tracking-wide text-slate-900 uppercase">
          Figure 2: Motional EMF Visualizer (Conductor on Rails)
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full aspect-[4/3] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <canvas ref={canvasRef} width={620} height={465} className="w-full h-full object-contain" />

            {/* Play/Pause Control Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-lg text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded transition shadow-sm"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    setTime(0);
                    setRodPos(0.25);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
              <span className="text-slate-600 font-mono text-[11px] font-semibold">
                v = {velocity.toFixed(1)} m/s | B = {bField.toFixed(2)} T
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Live Physics Metrics */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Induced Motional EMF</div>
                <div className="text-lg font-black text-amber-600 font-mono">{Math.abs(emf).toFixed(2)} V</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`\\mathcal{E} = B\\ell v`} />
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Induced Current</div>
                <div className="text-lg font-black text-blue-600 font-mono">{Math.abs(current).toFixed(2)} A</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`I = \\mathcal{E}/R`} />
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Lenz Drag Force</div>
                <div className="text-lg font-black text-rose-600 font-mono">{dragForce.toFixed(2)} N</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`F = I\\ell B`} />
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Power Balance</div>
                <div className="text-lg font-black text-emerald-600 font-mono">{pElec.toFixed(2)} W</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`P_{\\text{mech}} = P_{\\text{elec}}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 text-xs">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Interactive Parameters
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">Rod Velocity (v)</span>
                <span className="font-mono text-amber-600 font-bold">{velocity.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={velocity}
                onChange={(e) => setVelocity(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">Magnetic Field (B)</span>
                <span className="font-mono text-blue-600 font-bold">{bField.toFixed(2)} T</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.2"
                value={bField}
                onChange={(e) => setBField(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">Conductor Length (ℓ)</span>
                <span className="font-mono text-emerald-600 font-bold">{rodLength.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={rodLength}
                onChange={(e) => setRodLength(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-medium">Circuit Resistance (R)</span>
                <span className="font-mono text-purple-600 font-bold">{resistance.toFixed(1)} Ω</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={resistance}
                onChange={(e) => setResistance(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionalEMFVisualizer;