type C = { re: number; im: number };
type V3 = [number, number, number];
type View = { az: number; el: number; cx: number; cy: number; S: number };

export type SceneParams = {
distanceRatio: number;
theta: number; // degrees
phi: number; // degrees
phase: number; // degrees
showE: boolean;
showH: boolean;
buildup: boolean;
/** "full" (default): rings on many rays, brightness = true |Hφ|.  "cone": two illustrative cones. */
hStyle?: "full" | "cone";
};

const TWO_PI = Math.PI * 2;
const LY = 13; // field window half-sizes, in units of 1/β
const LZ = 10;
const NY = 96;
const NZ = 72;
const DY = (2 * LY) / NY;
const DZ = (2 * LZ) / NZ;
const VALS = new Float32Array((NY + 1) * (NZ + 1));
// Equal increments of the flux function Ψ: every loop carries the same flux, so the
// local density of loops is proportional to the field strength (standard field-line rule).
const PSI_STEP = 0.3;
const LEVELS = Array.from({ length: 7 }, (_, k) => (k + 0.5) * PSI_STEP).flatMap((c) => [c, -c]);
// polar angles (deg) of the rays the H rings travel along; symmetric about the equator
const H_ANGLES = [45, 135]; // half-angle of each cone from the z-axis (deg)
const H_RINGS_PER_WAVELENGTH = 6;
// extra faint rings near the equator, where Hφ is actually strongest (pattern ∝ sinθ)
const H_FAINT_ANGLES = [90];
// "full" style: rays covering the whole sphere; brightness is the true |Hφ| (∝ sinθ)
const H_FULL_ANGLES = [20, 40, 60, 80, 100, 120, 140, 160];
const E_COL = "#ea580c";
const H_RGB = "8,145,178";

const mul = (a: C, b: C): C => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const realAt = (a: C, ph: number) => a.re * Math.cos(ph) - a.im * Math.sin(ph);

// smooth source switch-on as a function of retarded phase u = ωt − βr
const smoothOn = (u: number) => {
if (u <= 0) return 0;
if (u >= TWO_PI) return 1;
const s = u / TWO_PI;
return s * s * (3 - 2 * s);
};

const hNorm = (x: number, sinT: number): C =>
mul({ re: sinT / (x * x), im: sinT / x }, { re: Math.cos(x), im: -Math.sin(x) });

const streamE = (y: number, z: number, phase: number, startT: number | null) => {
const rTrue = Math.hypot(y, z) || 1e-6;
const x = Math.max(rTrue, 0.45);
const on = startT === null ? 1 : smoothOn(startT - x);
if (on === 0) return 0;
return Math.abs(y) * realAt(hNorm(x, Math.abs(y) / rTrue), phase - Math.PI / 2) * on;
};

const project = (p: V3, v: View): V3 => {
const ca = Math.cos(v.az), sa = Math.sin(v.az), ce = Math.cos(v.el), se = Math.sin(v.el);
const x1 = ca * p[0] - sa * p[1];
const y1 = sa * p[0] + ca * p[1]; // larger = farther away
return [v.cx + x1 * v.S, v.cy - (p[2] * ce + y1 * se) * v.S, y1];
};

const arrow = (
g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, col: string, hs = 5
) => {
g.strokeStyle = col;
g.fillStyle = col;
g.lineWidth = 1.4;
g.beginPath();
g.moveTo(x1, y1);
g.lineTo(x2, y2);
g.stroke();
const a = Math.atan2(y2 - y1, x2 - x1);
g.beginPath();
g.moveTo(x2, y2);
g.lineTo(x2 - hs * Math.cos(a - 0.45), y2 - hs * Math.sin(a - 0.45));
g.lineTo(x2 - hs * Math.cos(a + 0.45), y2 - hs * Math.sin(a + 0.45));
g.closePath();
g.fill();
};

// marching squares on VALS -> segments [y1, z1, y2, z2]
const contour = (c: number, out: number[][]) => {
for (let j = 0; j < NZ; j++) {
for (let i = 0; i < NY; i++) {
const a = VALS[j * (NY + 1) + i];
const b = VALS[j * (NY + 1) + i + 1];
const d = VALS[(j + 1) * (NY + 1) + i];
const e = VALS[(j + 1) * (NY + 1) + i + 1];
const y0 = -LY + i * DY;
const z0 = -LZ + j * DZ;
const pts: number[] = [];
const cross = (p: number, q: number, xa: number, ya: number, xb: number, yb: number) => {
if ((p - c) * (q - c) < 0) {
const t = (c - p) / (q - p);
pts.push(xa + (xb - xa) * t, ya + (yb - ya) * t);
}
};
cross(a, b, y0, z0, y0 + DY, z0);
cross(b, e, y0 + DY, z0, y0 + DY, z0 + DZ);
cross(d, e, y0, z0 + DZ, y0 + DY, z0 + DZ);
cross(a, d, y0, z0, y0, z0 + DZ);
if (pts.length === 4) out.push([pts[0], pts[1], pts[2], pts[3]]);
else if (pts.length === 8) {
out.push([pts[0], pts[1], pts[6], pts[7]]);
out.push([pts[2], pts[3], pts[4], pts[5]]);
}
}
}
};

export function renderScene(
g: CanvasRenderingContext2D,
w: number,
h: number,
p: SceneParams,
time: number, // accumulated source phase, radians
cam: { az: number; el: number }
) {
const phase = time + (p.phase * Math.PI) / 180;
const startT = p.buildup ? time : null;
const left = 0;
const vw: View = {
az: cam.az,
el: cam.el,
cx: left + (w - left) / 2,
cy: h * 0.52,
S: Math.min((w - left - 8) / 27, (h - 40) / 21.5),
};

g.clearRect(0, 0, w, h);
const bg = g.createLinearGradient(0, 0, w, h);
bg.addColorStop(0, "#ffffff");
bg.addColorStop(1, "#e8eef6");
g.fillStyle = bg;
g.fillRect(0, 0, w, h);
g.textAlign = "center";

/* ---- reference rings and axes ---- */
g.font = "11px sans-serif";
g.fillStyle = "#64748b";
g.fillText("E loops (YZ plane) and H rings, propagating outward at c", vw.cx, 18);
g.strokeStyle = "rgba(71,85,105,0.18)";
g.lineWidth = 1;
for (const z of [-5, 0, 5]) {
g.beginPath();
for (let i = 0; i <= 90; i++) {
const a = (TWO_PI * i) / 90;
const q = project([12 * Math.cos(a), 12 * Math.sin(a), z], vw);
if (i) g.lineTo(q[0], q[1]);
else g.moveTo(q[0], q[1]);
}
g.stroke();
}
const axes: [V3, string, number][] = [[[1, 0, 0], "x", 11], [[0, 1, 0], "y", 12], [[0, 0, 1], "z", 10]];
g.font = "bold 13px sans-serif";
for (const [d, label, len] of axes) {
const a = project([-d[0] * len, -d[1] * len, -d[2] * len], vw);
const b = project([d[0] * len, d[1] * len, d[2] * len], vw);
g.setLineDash([6, 5]);
g.strokeStyle = "rgba(71,85,105,0.55)";
g.beginPath();
g.moveTo(a[0], a[1]);
g.lineTo(b[0], b[1]);
g.stroke();
g.setLineDash([]);
const n = project([d[0] * (len - 1.3), d[1] * (len - 1.3), d[2] * (len - 1.3)], vw);
arrow(g, n[0], n[1], b[0], b[1], "rgba(51,65,85,0.9)", 6);
const lp = project([d[0] * (len + 1.1), d[1] * (len + 1.1), d[2] * (len + 1.1)], vw);
g.fillStyle = "#334155";
g.fillText(label, lp[0], lp[1] + 4);
}

/* ---- H rings: circles that are born at the element and grow outward with the wave ---- */
if (p.showH) {
// "full": rings on rays covering all angles; brightness is the true |Hφ|, so the picture
// shows the sinθ pattern (bright equator, dark poles) and spherical wavefronts.
// "cone": two rays only, an illustrative double cone.
// Each H ring marks a fixed phase of the wave, (ωt − βr) = 2πk/N (mod 2π), on a radial
// ray at polar angle θ. As t increases every ring moves outward at c along the ray,
// so ρ = r sinθ and z = r cosθ both grow: the rings stack up as a cone (θ and π−θ
// give the double cone / "damru"). Brightness = |Hφ| at that ring, so rings passing
// through a node fade out; the arrowhead shows the sign of Hφ (±φ̂).
const hAt = (r: number, sT: number) => {
const on = startT === null ? 1 : smoothOn(startT - r);
return realAt(hNorm(Math.max(r, 0.45), sT), phase) * r * on;
};
const ring = (rho: number, z: number, sg: number, strength: number, scale = 1) => {
const alpha = (0.12 + 0.88 * Math.min(1, strength)) * scale;
g.strokeStyle = `rgba(${H_RGB},${alpha.toFixed(3)})`;
g.lineWidth = 1.6;
g.beginPath();
for (let i = 0; i <= 72; i++) {
const a = (TWO_PI * i) / 72;
const q = project([rho * Math.cos(a), rho * Math.sin(a), z], vw);
if (i) g.lineTo(q[0], q[1]);
else g.moveTo(q[0], q[1]);
}
g.stroke();
if (alpha < 0.25) return;
const ang = 0.9;
const a0 = project([rho * Math.cos(ang), rho * Math.sin(ang), z], vw);
const a1 = project(
[rho * Math.cos(ang) - sg * Math.sin(ang) * 0.5, rho * Math.sin(ang) + sg * Math.cos(ang) * 0.5, z], vw
);
const m = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) || 1;
arrow(g, a0[0], a0[1], a0[0] + ((a1[0] - a0[0]) / m) * 6, a0[1] + ((a1[1] - a0[1]) / m) * 6,
`rgba(${H_RGB},${Math.min(1, alpha + 0.2)})`, 4);
};
const rays =
(p.hStyle ?? "full") === "cone"
? [
...H_ANGLES.map((deg) => ({ deg, scale: 1, norm: true })), // main cones, normalised per cone
...H_FAINT_ANGLES.map((deg) => ({ deg, scale: 0.4, norm: false })), // faint context rings
]
: H_FULL_ANGLES.map((deg) => ({ deg, scale: 1, norm: false })); // true |Hφ| everywhere
for (const { deg, scale, norm } of rays) {
const th = (deg * Math.PI) / 180;
const sT = Math.sin(th);
const cT = Math.cos(th);
for (let k = 0; k < H_RINGS_PER_WAVELENGTH; k++) {
const psi = (TWO_PI * k) / H_RINGS_PER_WAVELENGTH;
const r0 = (((phase - psi) % TWO_PI) + TWO_PI) % TWO_PI; // first radius with this phase
for (let r = r0; r <= 12.5; r += TWO_PI) {
if (r < 0.4) continue;
if (startT !== null && startT - r <= 0) continue; // wave has not reached r yet
const hv = hAt(r, sT);
ring(r * sT, r * cT, Math.sign(hv) || 1, Math.abs(hv) / (norm ? sT : 1), scale);
}
}
}
}

/* ---- E loops ---- */
if (p.showE) {
for (let j = 0; j <= NZ; j++)
for (let i = 0; i <= NY; i++) VALS[j * (NY + 1) + i] = streamE(-LY + i * DY, -LZ + j * DZ, phase, startT);
g.lineCap = "round";
for (const c of LEVELS) {
const segs: number[][] = [];
contour(c, segs);
// set per level: arrow() below changes strokeStyle / lineWidth
g.strokeStyle = E_COL;
g.lineWidth = 2.1;
g.beginPath();
for (const s of segs) {
const a = project([0, s[0], s[1]], vw);
const b = project([0, s[2], s[3]], vw);
g.moveTo(a[0], a[1]);
g.lineTo(b[0], b[1]);
}
g.stroke();
// direction arrows: E ∝ (−∂Ψ/∂z, ∂Ψ/∂y)
for (let k = 12; k < segs.length; k += 40) {
const s = segs[k];
const y = (s[0] + s[2]) / 2, z = (s[1] + s[3]) / 2, e = 0.04;
const Ey = -(streamE(y, z + e, phase, startT) - streamE(y, z - e, phase, startT));
const Ez = streamE(y + e, z, phase, startT) - streamE(y - e, z, phase, startT);
const m = Math.hypot(Ey, Ez);
if (m < 1e-9) continue;
const a = project([0, y, z], vw);
const b = project([0, y + (Ey / m) * 0.5, z + (Ez / m) * 0.5], vw);
const mm = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
const ux = (b[0] - a[0]) / mm, uy = (b[1] - a[1]) / mm;
arrow(g, a[0] - ux * 4, a[1] - uy * 4, a[0] + ux * 5, a[1] + uy * 5, "#9a3412", 5);
}
}
}

/* ---- dipole, current arrow, observation point ---- */
const d0 = project([0, 0, -0.55], vw);
const d1 = project([0, 0, 0.55], vw);
g.strokeStyle = "#0f172a";
g.lineWidth = 4;
g.beginPath();
g.moveTo(d0[0], d0[1]);
g.lineTo(d1[0], d1[1]);
g.stroke();
const iNow = Math.cos(phase) * (p.buildup ? smoothOn(time) : 1);
const c0 = project([0, 0, 1.3], vw);
const c1 = project([0, 0, 1.3 + iNow * 1.1], vw);
arrow(g, c0[0], c0[1], c1[0], c1[1], E_COL, 6);
g.font = "11px sans-serif";
g.fillStyle = "#0f172a";
g.textAlign = "left";
g.fillText("I(t)", d1[0] + 10, d1[1] - 6);

const rKr = p.distanceRatio * TWO_PI; // βr
const onScale = rKr <= 12;
const rd = Math.min(rKr, 12);
const th = (p.theta * Math.PI) / 180, ph = (p.phi * Math.PI) / 180;
const dir: V3 = [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
const o = project([0, 0, 0], vw);
const P = project([dir[0] * rd, dir[1] * rd, dir[2] * rd], vw);
g.setLineDash([3, 4]);
g.strokeStyle = "rgba(15,23,42,0.5)";
g.lineWidth = 1;
g.beginPath();
g.moveTo(o[0], o[1]);
g.lineTo(P[0], P[1]);
g.stroke();
g.setLineDash([]);
g.beginPath();
g.arc(P[0], P[1], 4.5, 0, TWO_PI);
if (onScale) {
g.fillStyle = "#0f172a";
g.fill();
} else {
g.strokeStyle = "#0f172a";
g.lineWidth = 1.6;
g.stroke();
}
g.fillStyle = "#0f172a";
g.fillText(onScale ? "P" : `P (r = ${p.distanceRatio.toFixed(1)} λ, beyond view)`, P[0] + 8, P[1] - 7);

g.fillStyle = "#64748b";
g.fillText(`t = ${(time / TWO_PI).toFixed(2)} T`, left + 10, h - 10);
}