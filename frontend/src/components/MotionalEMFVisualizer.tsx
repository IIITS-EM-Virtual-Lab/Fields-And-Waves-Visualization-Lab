import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, HelpCircle } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

type VisualizerMode = 'moving-loop' | 'conductor-rails';

const MotionalEMFVisualizer: React.FC = () => {
  const [mode, setMode] = useState<VisualizerMode>('moving-loop');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [velocity, setVelocity] = useState<number>(4.0); // m/s
  const [bField, setBField] = useState<number>(1.5); // Tesla
  const [loopSize, setLoopSize] = useState<number>(0.5); // meters (width/length)
  const [resistance, setResistance] = useState<number>(2.0); // Ohms
  const [loopX, setLoopX] = useState<number>(0.05); // normalized position across canvas

  const [time, setTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setTime((prev) => prev + dt);

        setLoopX((prev) => {
          let next = prev + velocity * dt * 0.07;
          if (next > 0.98) {
            next = 0.02;
          } else if (next < 0.02) {
            next = 0.98;
          }
          return next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, velocity]);

  // Derived physics for Moving Closed Loop mode
  // Field region is defined between 0.32 and 0.72 of canvas width
  const loopWidthNorm = 0.22 * (loopSize / 0.5);
  const fieldStartNorm = 0.32;
  const fieldEndNorm = 0.72;

  const leadEdge = loopX + loopWidthNorm;
  const trailEdge = loopX;

  // Fraction of loop inside field
  const overlapStart = Math.max(trailEdge, fieldStartNorm);
  const overlapEnd = Math.min(leadEdge, fieldEndNorm);
  const overlap = Math.max(0, overlapEnd - overlapStart);
  const fractionInField = Math.min(1, overlap / loopWidthNorm);

  // Status for Moving Loop
  let loopStatus: 'outside' | 'entering' | 'inside' | 'exiting' = 'outside';
  let leadInField = leadEdge >= fieldStartNorm && leadEdge <= fieldEndNorm;
  let trailInField = trailEdge >= fieldStartNorm && trailEdge <= fieldEndNorm;

  if (leadEdge < fieldStartNorm || trailEdge > fieldEndNorm) {
    loopStatus = 'outside';
  } else if (leadEdge >= fieldStartNorm && trailEdge < fieldStartNorm) {
    loopStatus = 'entering';
  } else if (leadEdge > fieldEndNorm && trailEdge <= fieldEndNorm) {
    loopStatus = 'exiting';
  } else if (trailEdge >= fieldStartNorm && leadEdge <= fieldEndNorm) {
    loopStatus = 'inside';
  }

  // Motional EMF for Moving Loop: E = - dPhi/dt
  // When entering: E = - B * w * v
  // When inside: E = 0 (opposing sides cancel)
  // When exiting: E = + B * w * v
  let loopEmf = 0;
  if (loopStatus === 'entering') {
    loopEmf = -bField * loopSize * velocity;
  } else if (loopStatus === 'exiting') {
    loopEmf = bField * loopSize * velocity;
  } else {
    loopEmf = 0;
  }

  const loopCurrent = loopEmf / resistance;
  const loopFlux = bField * loopSize * (fractionInField * loopSize); // Wb
  const loopDragForce = Math.abs(loopCurrent * loopSize * bField);

  // Derived physics for Expanding Loop (Conductor on Rails) mode
  const railsEmf = bField * loopSize * velocity;
  const railsCurrent = railsEmf / resistance;
  const railsDragForce = Math.abs(railsCurrent * loopSize * bField);
  const railsFlux = bField * loopSize * (loopX * 1.5);

  // Current active metrics
  const activeEmf = mode === 'moving-loop' ? loopEmf : railsEmf;
  const activeCurrent = mode === 'moving-loop' ? loopCurrent : railsCurrent;
  const activeDrag = mode === 'moving-loop' ? loopDragForce : railsDragForce;
  const activeFlux = mode === 'moving-loop' ? loopFlux : railsFlux;
  const pElec = activeCurrent * activeCurrent * resistance;

  // Main Canvas Rendering
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

    const isInto = bField >= 0;

    if (mode === 'moving-loop') {
      // MODE 1: MOVING CLOSED RECTANGULAR LOOP (Sadiku Ch. 9)
      const fX1 = w * fieldStartNorm;
      const fX2 = w * fieldEndNorm;
      const fY1 = h * 0.15;
      const fY2 = h * 0.85;

      // Draw Defined Magnetic Field Zone
      ctx.fillStyle = isInto ? 'rgba(2, 132, 199, 0.08)' : 'rgba(225, 29, 72, 0.08)';
      ctx.fillRect(fX1, fY1, fX2 - fX1, fY2 - fY1);

      ctx.strokeStyle = isInto ? '#38bdf8' : '#fb7185';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(fX1, fY1, fX2 - fX1, fY2 - fY1);
      ctx.setLineDash([]);

      // B-field field markers inside zone
      ctx.fillStyle = isInto ? 'rgba(2, 132, 199, 0.4)' : 'rgba(225, 29, 72, 0.4)';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      for (let x = fX1 + 20; x <= fX2 - 15; x += 36) {
        for (let y = fY1 + 25; y <= fY2 - 15; y += 36) {
          ctx.fillText(isInto ? '⊗' : '⊙', x, y);
        }
      }

      // Field zone banner
      ctx.fillStyle = isInto ? '#0284c7' : '#e11d48';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Uniform B-Field Region: B = ${Math.abs(bField).toFixed(2)} T (${isInto ? 'INTO PAGE ⊗' : 'OUT OF PAGE ⊙'})`,
        (fX1 + fX2) / 2,
        fY1 - 10
      );

      // Boundary indicators
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('x = X₁ (Entry)', fX1, fY2 + 16);
      ctx.fillText('x = X₂ (Exit)', fX2, fY2 + 16);

      // Draw Rigid Closed Rectangular Loop
      const lX1 = w * loopX;
      const lW = w * loopWidthNorm;
      const lX2 = lX1 + lW;
      const lH = (h * 0.45) * (loopSize / 0.5);
      const lY1 = (h - lH) / 2;
      const lY2 = lY1 + lH;

      // Loop wire shadow/glow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      // Closed Wire Loop Outline
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.strokeRect(lX1, lY1, lW, lH);
      ctx.shadowColor = 'transparent';

      // Load Resistor on Bottom Wire
      const rWidth = 36;
      const rX = lX1 + lW / 2 - rWidth / 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rX, lY2 - 8, rWidth, 16);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(rX, lY2 - 7, rWidth, 14);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`R=${resistance.toFixed(1)}Ω`, lX1 + lW / 2, lY2 + 18);

      // Leading & Trailing edge labels
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Trailing Edge', lX1, lY1 - 8);
      ctx.fillText('Leading Edge', lX2, lY1 - 8);

      // Velocity Arrow for entire rigid loop
      const velArrowLen = velocity * 9;
      if (Math.abs(velocity) > 0.1) {
        drawArrow(ctx, lX2, (lY1 + lY2) / 2, lX2 + velArrowLen, (lY1 + lY2) / 2, '#16a34a', 3);
        ctx.fillStyle = '#15803d';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, lX2 + velArrowLen / 2, (lY1 + lY2) / 2 - 12);
      }

      // Motional EMF Lorentz vectors along sides in field
      // On leading edge:
      const leadInside = lX2 >= fX1 && lX2 <= fX2;
      const trailInside = lX1 >= fX1 && lX1 <= fX2;

      if (leadInside && Math.abs(velocity) > 0.1) {
        // Lorentz force on positive charge: u x B
        // v along +x, B into (+z) -> v x B is +y (upwards on screen in math coords, which is -y canvas)
        const vCrossBUp = (velocity * bField) >= 0;
        const arrowDir = vCrossBUp ? -1 : 1;
        drawArrow(ctx, lX2 + 8, (lY1 + lY2) / 2 - arrowDir * 20, lX2 + 8, (lY1 + lY2) / 2 + arrowDir * 20, '#d97706', 2.5);
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('u×B', lX2 + 20, (lY1 + lY2) / 2 + 3);
      }

      if (trailInside && Math.abs(velocity) > 0.1) {
        const vCrossBUp = (velocity * bField) >= 0;
        const arrowDir = vCrossBUp ? -1 : 1;
        drawArrow(ctx, lX1 - 8, (lY1 + lY2) / 2 - arrowDir * 20, lX1 - 8, (lY1 + lY2) / 2 + arrowDir * 20, '#d97706', 2.5);
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('u×B', lX1 - 20, (lY1 + lY2) / 2 + 3);
      }

      // Induced Current Flow Animation around Loop
      if (Math.abs(loopCurrent) > 0.005) {
        const isCCW = loopCurrent > 0;
        const currColor = '#ea580c';

        // Animate circulating dots / arrows
        const tOffset = (time * 80 * (isCCW ? 1 : -1)) % 100;
        drawLoopCirculation(ctx, lX1, lY1, lW, lH, tOffset, isCCW, currColor);

        ctx.fillStyle = currColor;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`I = ${Math.abs(loopCurrent).toFixed(2)} A (${isCCW ? 'Counter-Clockwise' : 'Clockwise'})`, lX1 + lW / 2, lY1 - 22);
      } else if (loopStatus === 'inside') {
        // Special Callout when inside uniform field
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⊜ Opposing edges cancel: Net EMF = 0 V', lX1 + lW / 2, lY1 - 22);
      }

      // Magnetic Drag Force on loop segments inside field
      if (loopDragForce > 0.01 && Math.abs(velocity) > 0.1) {
        const dragDir = velocity > 0 ? -1 : 1;
        const dragLen = dragDir * Math.min(45, loopDragForce * 12);
        const dragX = loopStatus === 'entering' ? lX2 : lX1;

        drawArrow(ctx, dragX, (lY1 + lY2) / 2 + 30, dragX + dragLen, (lY1 + lY2) / 2 + 30, '#dc2626', 2.5);
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`F_drag = ${loopDragForce.toFixed(2)} N`, dragX + dragLen / 2, (lY1 + lY2) / 2 + 45);
      }

      // Dimension labels
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(lX1, lY2 + 30);
      ctx.lineTo(lX2, lY2 + 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Width w = ${loopSize.toFixed(2)} m`, (lX1 + lX2) / 2, lY2 + 42);

      // Status Badge Top Right
      drawStatusBadge(ctx, loopStatus, w, h);

    } else {
      // MODE 2: EXPANDING LOOP (CONDUCTOR ON RAILS)
      const railX1 = w * 0.12;
      const railX2 = w * 0.88;
      const railY1 = h * 0.28;
      const railY2 = h * 0.74;
      const railWidth = railX2 - railX1;
      const rodX = railX1 + loopX * railWidth;

      // Uniform Magnetic Field Everywhere
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
      ctx.fillText(
        `B = ${Math.abs(bField).toFixed(2)} T (${isInto ? 'INTO PAGE ⊗' : 'OUT OF PAGE ⊙'})`,
        railX1,
        railY1 - 45
      );

      // Highlight the Enclosed Loop Area S(t)
      ctx.fillStyle = isInto ? 'rgba(2, 132, 199, 0.08)' : 'rgba(225, 29, 72, 0.08)';
      ctx.fillRect(railX1, railY1, rodX - railX1, railY2 - railY1);

      // Enclosed Area Label
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Closed Loop Area S(t) = ℓ · x(t)`,
        (railX1 + rodX) / 2,
        (railY1 + railY2) / 2 - 20
      );

      // Draw Conducting U-Rails (Stationary Contour Segments: u = 0)
      ctx.strokeStyle = '#64748b';
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

      // Contour Velocity labels (u = 0 on stationary parts)
      ctx.fillStyle = '#64748b';
      ctx.font = '9px sans-serif';
      ctx.fillText('Stationary (u = 0)', (railX1 + rodX) / 2, railY1 - 10);
      ctx.fillText('Stationary (u = 0)', (railX1 + rodX) / 2, railY2 + 18);

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

      // Draw Moving Conductor Rod (Moving Segment: u != 0)
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

      // Lorentz force direction
      const topIsPositive = (velocity * bField) >= 0;

      // Terminal Polarity Markers
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = topIsPositive ? '#dc2626' : '#2563eb';
      ctx.fillText(topIsPositive ? '+' : '−', rodX, railY1 - 18);

      ctx.fillStyle = topIsPositive ? '#2563eb' : '#dc2626';
      ctx.fillText(topIsPositive ? '−' : '+', rodX, railY2 + 24);

      // Current Circulation Animation
      if (Math.abs(railsCurrent) > 0.01) {
        const currentSpeed = (time * 90 * (topIsPositive ? 1 : -1)) % 100;
        const arrowX = railX1 + ((currentSpeed / 100) * (rodX - railX1));

        if (arrowX > railX1 + 15 && arrowX < rodX - 15) {
          drawSmallArrow(ctx, arrowX, railY1, topIsPositive ? -1 : 1, 0);
          drawSmallArrow(ctx, arrowX, railY2, topIsPositive ? 1 : -1, 0);
        }
        drawSmallArrow(ctx, railX1, midY, 0, topIsPositive ? 1 : -1);
        drawSmallArrow(ctx, rodX, midY, 0, topIsPositive ? -1 : 1);

        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`I = ${Math.abs(railsCurrent).toFixed(2)} A`, (railX1 + rodX) / 2, railY1 + 16);
      }

      // Opposing Magnetic Drag Force Arrow
      if (railsDragForce > 0.01 && Math.abs(velocity) > 0.1) {
        const dragDir = velocity > 0 ? -1 : 1;
        const dragLen = dragDir * Math.min(50, railsDragForce * 12);
        drawArrow(ctx, rodX, midY + 28, rodX + dragLen, midY + 28, '#dc2626', 2.5);
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`F_drag = ${railsDragForce.toFixed(2)} N`, rodX + dragLen / 2, midY + 44);
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
      ctx.fillText(`ℓ = ${loopSize.toFixed(2)} m`, railX2 + 50, midY + 4);
    }
  }, [
    mode,
    time,
    loopX,
    velocity,
    bField,
    loopSize,
    resistance,
    activeCurrent,
    activeDrag,
    activeEmf,
    loopStatus,
    loopWidthNorm
  ]);

  const drawStatusBadge = (
    ctx: CanvasRenderingContext2D,
    status: 'outside' | 'entering' | 'inside' | 'exiting',
    w: number,
    h: number
  ) => {
    const badgeX = w - 180;
    const badgeY = 20;
    const badgeW = 165;
    const badgeH = 46;

    let bgColor = '#f1f5f9';
    let textColor = '#475569';
    let label = 'OUTSIDE B-FIELD';
    let sub = 'Flux Φ = 0, EMF = 0 V';

    if (status === 'entering') {
      bgColor = '#fef3c7';
      textColor = '#b45309';
      label = '1. ENTERING FIELD';
      sub = 'dΦ/dt > 0 → CCW Current';
    } else if (status === 'inside') {
      bgColor = '#dcfce7';
      textColor = '#15803d';
      label = '2. FULLY INSIDE';
      sub = 'Flux = Const → Net EMF = 0 V';
    } else if (status === 'exiting') {
      bgColor = '#fee2e2';
      textColor = '#b91c1c';
      label = '3. EXITING FIELD';
      sub = 'dΦ/dt < 0 → CW Current';
    }

    ctx.fillStyle = bgColor;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, badgeX + 10, badgeY + 18);

    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(sub, badgeX + 10, badgeY + 34);
  };

  const drawLoopCirculation = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    offset: number,
    isCCW: boolean,
    color: string
  ) => {
    ctx.fillStyle = color;
    // Four circulating arrows along the 4 edges
    const topDirX = isCCW ? -1 : 1;
    const botDirX = isCCW ? 1 : -1;
    const leftDirY = isCCW ? 1 : -1;
    const rightDirY = isCCW ? -1 : 1;

    drawSmallArrow(ctx, x + w / 2, y, topDirX, 0);
    drawSmallArrow(ctx, x + w / 2, y + h, botDirX, 0);
    drawSmallArrow(ctx, x, y + h / 2, 0, leftDirY);
    drawSmallArrow(ctx, x + w, y + h / 2, 0, rightDirY);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    width: number
  ) => {
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
    ctx.fillStyle = '#ea580c';
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
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-wide text-slate-900 uppercase">
            Figure 2: Motional EMF Visualizer
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Electromagnetics textbook model (Sadiku / Pozar): Closed line contour{' '}
            <span className="font-semibold text-slate-700">∮ (u × B) · dl = −dΦ/dt</span>
          </p>
        </div>

        {/* Mode Selector Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setMode('moving-loop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'moving-loop'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mode A: Closed Moving Loop
          </button>
          <button
            onClick={() => setMode('conductor-rails')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'conductor-rails'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mode B: Expanding Loop on Rails
          </button>
        </div>
      </div>

      {/* Physics Insight Callout Banner */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          {mode === 'moving-loop' ? (
            <span>
              <strong>Textbook Rigor (Sadiku Ch. 9):</strong> When a rigid closed loop moves inside a{' '}
              <em>uniform magnetic field</em>, the net EMF is <strong>0 V</strong> because opposing edge voltages{' '}
              <InlineMath math="(\mathbf{u} \times \mathbf{B}) \cdot d\mathbf{l}" /> cancel. EMF is induced{' '}
              <strong>only during entry or exit</strong> across the field boundary where magnetic flux{' '}
              <InlineMath math="\Phi_B(t)" /> changes with time.
            </span>
          ) : (
            <span>
              <strong>Closed Contour Rigor:</strong> In the sliding conductor problem, the rails, resistor, and moving
              rod form a <strong>closed expanding loop</strong> with area <InlineMath math="S(t) = \ell \cdot x(t)" />.
              Because the rails are stationary (<InlineMath math="\mathbf{u} = 0" />), only the moving bar contributes
              to <InlineMath math="\oint_L (\mathbf{u} \times \mathbf{B}) \cdot d\mathbf{l} = B \ell v" />.
            </span>
          )}
        </div>
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
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition shadow-sm"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    setTime(0);
                    setLoopX(0.05);
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
                <div className="text-slate-500 font-medium">Net Motional EMF</div>
                <div className="text-lg font-black text-amber-600 font-mono">
                  {Math.abs(activeEmf).toFixed(2)} V
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`\\mathcal{E} = \\oint (\\mathbf{u}\\times\\mathbf{B})\\cdot d\\mathbf{l}`} />
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Magnetic Flux</div>
                <div className="text-lg font-black text-sky-600 font-mono">
                  {activeFlux.toFixed(3)} Wb
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`\\Phi_B = \\iint \\mathbf{B}\\cdot d\\mathbf{S}`} />
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Induced Current</div>
                <div className="text-lg font-black text-blue-600 font-mono">
                  {Math.abs(activeCurrent).toFixed(2)} A
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`I = \\mathcal{E}/R`} />
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-slate-500 font-medium">Lenz Drag Force</div>
                <div className="text-lg font-black text-rose-600 font-mono">
                  {activeDrag.toFixed(2)} N
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  <InlineMath math={`F = I \\ell B`} />
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
                <span className="text-slate-700 font-medium">Velocity (v)</span>
                <span className="font-mono text-amber-600 font-bold">{velocity.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
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
                <span className="text-slate-700 font-medium">
                  {mode === 'moving-loop' ? 'Loop Width (w)' : 'Conductor Length (ℓ)'}
                </span>
                <span className="font-mono text-emerald-600 font-bold">{loopSize.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={loopSize}
                onChange={(e) => setLoopSize(parseFloat(e.target.value))}
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