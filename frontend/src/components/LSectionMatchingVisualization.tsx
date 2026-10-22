import { useState, useEffect, useMemo, useRef } from "react";
import {
  Settings2,
  Cpu,
  Activity,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type * as PlotlyType from "plotly.js";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Plotly: typeof PlotlyType;
  }
}

export interface MatchingSolution {
  id: number;
  name: string;
  topology: "shunt-series" | "series-shunt";
  B: number;
  X: number;
  bNorm: number;
  xNorm: number;

  comp1: {
    role: "shunt" | "series";
    type: "L" | "C" | "None";
    label: string;
    value: number;
    displayValue: string;
    reactance: number;
  };

  comp2: {
    role: "shunt" | "series";
    type: "L" | "C" | "None";
    label: string;
    value: number;
    displayValue: string;
    reactance: number;
  };

  zInt: { r: number; x: number };
  yInt: { g: number; b: number };
  zIntActual: { r: number; x: number };
  yIntActual: { g: number; b: number };

  zIn: { r: number; x: number };
  zInActual: { r: number; x: number };
  matchError: number;
  isMatched: boolean;

  step1: {
    title: string;
    action: string;
    from: string;
    to: string;
    diffSymbol: string;
    diffNorm: string;
    diffActual: string;
    resultingState: string;
    circleDescription: string;
  };
  step2: {
    title: string;
    action: string;
    from: string;
    to: string;
    diffSymbol: string;
    diffNorm: string;
    diffActual: string;
    resultingState: string;
    circleDescription: string;
  };
}

const formatComplex = (
  r: number,
  x: number,
  unit = "",
  decimals = 3,
): string => {
  const sign = x >= 0 ? "+" : "-";
  return `${r.toFixed(decimals)} ${sign} j${Math.abs(x).toFixed(decimals)}${unit ? " " + unit : ""}`;
};

export default function LSectionMatchingVisualization() {
  const [z0, setZ0] = useState<string>("50");
  const [rL, setRL] = useState<string>("100");
  const [xL, setXL] = useState<string>("-50");
  const [frequency, setFrequency] = useState<string>("500");
  const [freqUnit, setFreqUnit] = useState<"MHz" | "GHz" | "kHz">("MHz");
  const [selectedTopology, setSelectedTopology] = useState<
    "shunt-series" | "series-shunt"
  >("shunt-series");
  const [activeSolutionIndex, setActiveSolutionIndex] = useState<number>(0);

  const [plotlyLoaded, setPlotlyLoaded] = useState<boolean>(false);
  const plotRef = useRef<HTMLDivElement>(null);

  const handleTopologyChange = (
    newTopology: "shunt-series" | "series-shunt",
  ) => {
    setSelectedTopology(newTopology);
    setActiveSolutionIndex(0);

    const numZ0 = parseFloat(z0) || 50;
    const numRL = parseFloat(rL) || 50;

    if (newTopology === "shunt-series" && numRL < numZ0) {
      setZ0("50");
      setRL("100");
      setXL("-50");
      setFrequency("500");
      setFreqUnit("MHz");
    } else if (newTopology === "series-shunt" && numRL > numZ0) {
      setZ0("50");
      setRL("25");
      setXL("50");
      setFrequency("500");
      setFreqUnit("MHz");
    }
  };

  useEffect(() => {
    if (document.getElementById("plotly-script")) {
      if (window.Plotly) setPlotlyLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "plotly-script";
    script.src = "https://cdn.plot.ly/plotly-2.27.0.min.js";
    script.async = true;
    script.onload = () => setPlotlyLoaded(true);
    document.body.appendChild(script);
  }, []);

  const formatComponentValue = (
    value: number,
    type: "L" | "C" | "None",
  ): string => {
    if (type === "None" || value <= 0 || !isFinite(value)) return "—";
    if (type === "C") {
      if (value >= 1e-6) return `${(value * 1e6).toFixed(2)} µF`;
      if (value >= 1e-9) return `${(value * 1e9).toFixed(3)} nF`;
      if (value >= 1e-12) return `${(value * 1e12).toFixed(2)} pF`;
      return `${(value * 1e15).toFixed(2)} fF`;
    } else {
      if (value >= 1) return `${value.toFixed(2)} H`;
      if (value >= 1e-3) return `${(value * 1e3).toFixed(2)} mH`;
      if (value >= 1e-6) return `${(value * 1e6).toFixed(2)} µH`;
      if (value >= 1e-9) return `${(value * 1e9).toFixed(2)} nH`;
      return `${(value * 1e12).toFixed(2)} pH`;
    }
  };

  const calculationData = useMemo(() => {
    const EPS = 1e-12;
    const numZ0 = parseFloat(z0);
    const numRL = parseFloat(rL);
    const numXL = parseFloat(xL);
    const numFreq = parseFloat(frequency);

    if (
      isNaN(numZ0) ||
      numZ0 <= 0 ||
      isNaN(numRL) ||
      numRL <= 0 ||
      isNaN(numFreq) ||
      numFreq <= 0
    ) {
      return {
        isValid: false,
        errorMessage:
          "Please enter valid positive values for Z₀, R_L, and Frequency.",
        solutions: [] as MatchingSolution[],
        activeTopology: "shunt-series" as "shunt-series" | "series-shunt",
        Z0: 50,
        RL: 50,
        XL: 0,
        fHz: 1e9,
        omega: 2 * Math.PI * 1e9,
        loadMetrics: {
          zLNorm: { r: 1, x: 0 },
          yLNorm: { g: 1, b: 0 },
          yLActual: { G: 0.02, B: 0 },
          gammaMag: 0,
          gammaAngleDeg: 0,
          swr: 1,
        },
      };
    }

    const safeXL = isNaN(numXL) ? 0 : numXL;
    let multiplier = 1e6;
    if (freqUnit === "GHz") multiplier = 1e9;
    if (freqUnit === "kHz") multiplier = 1e3;
    const fHz = numFreq * multiplier;
    const omega = 2 * Math.PI * fHz;

    const zLNorm = { r: numRL / numZ0, x: safeXL / numZ0 };
    const denL = zLNorm.r * zLNorm.r + zLNorm.x * zLNorm.x;
    const yLNorm = {
      g: denL > EPS ? zLNorm.r / denL : 0,
      b: denL > EPS ? -zLNorm.x / denL : 0,
    };
    const denZLActual = numRL * numRL + safeXL * safeXL;
    const yLActual = {
      G: denZLActual > EPS ? numRL / denZLActual : 0,
      B: denZLActual > EPS ? -safeXL / denZLActual : 0,
    };

    const gNumR = zLNorm.r - 1;
    const gNumI = zLNorm.x;
    const gDenR = zLNorm.r + 1;
    const gDenI = zLNorm.x;
    const denGamma = gDenR * gDenR + gDenI * gDenI;
    const gammaR =
      denGamma > EPS ? (gNumR * gDenR + gNumI * gDenI) / denGamma : 0;
    const gammaI =
      denGamma > EPS ? (gNumI * gDenR - gNumR * gDenI) / denGamma : 0;
    const gammaMag = Math.sqrt(gammaR * gammaR + gammaI * gammaI);
    const gammaAngleDeg = (Math.atan2(gammaI, gammaR) * 180) / Math.PI;
    const swr = gammaMag < 0.9999 ? (1 + gammaMag) / (1 - gammaMag) : 999;

    const loadMetrics = {
      zLNorm,
      yLNorm,
      yLActual,
      gammaMag,
      gammaAngleDeg,
      swr,
    };

    const activeTopology = selectedTopology;
    const solutions: MatchingSolution[] = [];

    if (activeTopology === "shunt-series") {
      if (numRL < numZ0 - EPS) {
        return {
          isValid: false,
          errorMessage: `Topology 1 (Shunt at load) requires R_L > Z₀. Since R_L = ${numRL} < Z₀ = ${numZ0}, use Topology 2 (Series at load).`,
          solutions: [],
          activeTopology,
          Z0: numZ0,
          RL: numRL,
          XL: safeXL,
          fHz,
          omega,
          loadMetrics,
        };
      }

      const zMagSq = numRL * numRL + safeXL * safeXL;
      const signs = [+1, -1];
      signs.forEach((sign, idx) => {
        const B =
          (safeXL +
            sign *
              Math.sqrt(numRL / numZ0) *
              Math.sqrt(Math.max(0, zMagSq - numZ0 * numRL))) /
          zMagSq;
        const X =
          sign *
          Math.sqrt((numZ0 / numRL) * Math.max(0, zMagSq - numZ0 * numRL));

        const bNorm = B * numZ0;
        const xNorm = X / numZ0;

        let comp1Type: "L" | "C" | "None" = "None",
          comp1Val = 0;
        if (B > EPS) {
          comp1Type = "C";
          comp1Val = B / omega;
        } else if (B < -EPS) {
          comp1Type = "L";
          comp1Val = 1 / (-B * omega);
        }

        let comp2Type: "L" | "C" | "None" = "None",
          comp2Val = 0;
        if (X > EPS) {
          comp2Type = "L";
          comp2Val = X / omega;
        } else if (X < -EPS) {
          comp2Type = "C";
          comp2Val = 1 / (-X * omega);
        }

        const gL = yLNorm.g;
        const bL = yLNorm.b;
        const gInt = gL;
        const bInt = bL + bNorm;
        const denYInt = gInt * gInt + bInt * bInt;
        const rInt = denYInt > EPS ? gInt / denYInt : 1;
        const xInt = denYInt > EPS ? -bInt / denYInt : 0;
        const rIn = rInt;
        const xIn = xInt + xNorm;
        const matchError = Math.sqrt(
          Math.pow(rIn * numZ0 - numZ0, 2) + Math.pow(xIn * numZ0, 2),
        );

        solutions.push({
          id: idx + 1,
          name: `Solution ${idx + 1}`,
          topology: "shunt-series",
          B,
          X,
          bNorm,
          xNorm,
          comp1: {
            role: "shunt",
            type: comp1Type,
            label: comp1Type === "C" ? `C_shunt` : `L_shunt`,
            value: comp1Val,
            displayValue: formatComponentValue(comp1Val, comp1Type),
            reactance: B,
          },
          comp2: {
            role: "series",
            type: comp2Type,
            label: comp2Type === "L" ? `L_series` : `C_series`,
            value: comp2Val,
            displayValue: formatComponentValue(comp2Val, comp2Type),
            reactance: X,
          },
          zInt: { r: rInt, x: xInt },
          yInt: { g: gInt, b: bInt },
          zIntActual: { r: rInt * numZ0, x: xInt * numZ0 },
          yIntActual: { g: gInt / numZ0, b: bInt / numZ0 },
          zIn: { r: rIn, x: xIn },
          zInActual: { r: rIn * numZ0, x: xIn * numZ0 },
          matchError,
          isMatched: matchError < 0.05,
          step1: {
            title: "Stage 1: Shunt Susceptance Shift (Δb)",
            action: `Add shunt susceptance b = ${bNorm >= 0 ? "+" : ""}${bNorm.toFixed(3)} (B = ${B >= 0 ? "+" : ""}${B.toFixed(4)} S)`,
            from: `y_L = ${formatComplex(yLNorm.g, yLNorm.b)}`,
            to: `y_int = ${formatComplex(gInt, bInt)}`,
            diffSymbol: "Δb",
            diffNorm: `${bNorm >= 0 ? "+" : ""}${bNorm.toFixed(3)}`,
            diffActual: `${B >= 0 ? "+" : ""}${B.toFixed(4)} S`,
            resultingState: `y_int = ${formatComplex(gInt, bInt)}`,
            circleDescription: `Moves along constant conductance circle g = ${yLNorm.g.toFixed(3)} to intersect the rotated 1+jx circle`,
          },
          step2: {
            title: "Stage 2: Invert to Impedance & Cancel Reactance (Δx)",
            action: `Invert to z_int = 1/y_int on r = 1 circle, then add series reactance x = ${xNorm >= 0 ? "+" : ""}${xNorm.toFixed(3)} (X = ${X >= 0 ? "+" : ""}${X.toFixed(2)} Ω)`,
            from: `z_int = ${formatComplex(rInt, xInt)}`,
            to: `z_in = ${formatComplex(rIn, xIn)}`,
            diffSymbol: "Δx",
            diffNorm: `${xNorm >= 0 ? "+" : ""}${xNorm.toFixed(3)}`,
            diffActual: `${X >= 0 ? "+" : ""}${X.toFixed(2)} Ω`,
            resultingState: `z_in = 1.000 + j0.000 (Z_in = ${numZ0.toFixed(1)} Ω)`,
            circleDescription: `Inverts across origin to r = 1 circle, then moves along r = 1 circle to cancel reactance`,
          },
        });
      });
    } else {
      if (numRL > numZ0 + EPS) {
        return {
          isValid: false,
          errorMessage: `Topology 2 (Series at load) requires R_L < Z₀. Since R_L = ${numRL} > Z₀ = ${numZ0}, use Topology 1 (Shunt at load).`,
          solutions: [],
          activeTopology,
          Z0: numZ0,
          RL: numRL,
          XL: safeXL,
          fHz,
          omega,
          loadMetrics,
        };
      }

      const sqrtTerm = Math.sqrt(Math.max(0, numRL * (numZ0 - numRL)));
      const signs = [+1, -1];

      signs.forEach((sign, idx) => {
        const X = -safeXL + sign * sqrtTerm;
        const B =
          (sign * Math.sqrt(Math.max(0, (numZ0 - numRL) / numRL))) / numZ0;

        const xNorm = X / numZ0;
        const bNorm = B * numZ0;

        let comp1Type: "L" | "C" | "None" = "None",
          comp1Val = 0;
        if (X > EPS) {
          comp1Type = "L";
          comp1Val = X / omega;
        } else if (X < -EPS) {
          comp1Type = "C";
          comp1Val = 1 / (-X * omega);
        }

        let comp2Type: "L" | "C" | "None" = "None",
          comp2Val = 0;
        if (B > EPS) {
          comp2Type = "C";
          comp2Val = B / omega;
        } else if (B < -EPS) {
          comp2Type = "L";
          comp2Val = 1 / (-B * omega);
        }

        const rL = zLNorm.r;
        const xL = zLNorm.x;
        const rInt = rL;
        const xInt = xL + xNorm;
        const denZInt = rInt * rInt + xInt * xInt;
        const gInt = denZInt > EPS ? rInt / denZInt : 1;
        const bInt = denZInt > EPS ? -xInt / denZInt : 0;
        const gIn = gInt;
        const bIn = bInt + bNorm;
        const denYIn = gIn * gIn + bIn * bIn;
        const rIn = denYIn > EPS ? gIn / denYIn : 1;
        const xIn = denYIn > EPS ? -bIn / denYIn : 0;
        const matchError = Math.sqrt(
          Math.pow(rIn * numZ0 - numZ0, 2) + Math.pow(xIn * numZ0, 2),
        );

        solutions.push({
          id: idx + 1,
          name: `Solution ${idx + 1}`,
          topology: "series-shunt",
          B,
          X,
          bNorm,
          xNorm,
          comp1: {
            role: "series",
            type: comp1Type,
            label: comp1Type === "L" ? `L_series` : `C_series`,
            value: comp1Val,
            displayValue: formatComponentValue(comp1Val, comp1Type),
            reactance: X,
          },
          comp2: {
            role: "shunt",
            type: comp2Type,
            label: comp2Type === "C" ? `C_shunt` : `L_shunt`,
            value: comp2Val,
            displayValue: formatComponentValue(comp2Val, comp2Type),
            reactance: B,
          },
          zInt: { r: rInt, x: xInt },
          yInt: { g: gInt, b: bInt },
          zIntActual: { r: rInt * numZ0, x: xInt * numZ0 },
          yIntActual: { g: gInt / numZ0, b: bInt / numZ0 },
          zIn: { r: rIn, x: xIn },
          zInActual: { r: rIn * numZ0, x: xIn * numZ0 },
          matchError,
          isMatched: matchError < 0.05,
          step1: {
            title: "Stage 1: Series Reactance Shift (Δx)",
            action: `Add series reactance x = ${xNorm >= 0 ? "+" : ""}${xNorm.toFixed(3)} (X = ${X >= 0 ? "+" : ""}${X.toFixed(2)} Ω)`,
            from: `z_L = ${formatComplex(zLNorm.r, zLNorm.x)}`,
            to: `z_int = ${formatComplex(rInt, xInt)}`,
            diffSymbol: "Δx",
            diffNorm: `${xNorm >= 0 ? "+" : ""}${xNorm.toFixed(3)}`,
            diffActual: `${X >= 0 ? "+" : ""}${X.toFixed(2)} Ω`,
            resultingState: `z_int = ${formatComplex(rInt, xInt)}`,
            circleDescription: `Moves along constant resistance circle r = ${zLNorm.r.toFixed(3)} to intersect rotated 1+jb circle`,
          },
          step2: {
            title: "Stage 2: Invert to Admittance & Cancel Susceptance (Δb)",
            action: `Invert to y_int = 1/z_int on g = 1 circle, then add shunt susceptance b = ${bNorm >= 0 ? "+" : ""}${bNorm.toFixed(3)} (B = ${B >= 0 ? "+" : ""}${B.toFixed(4)} S)`,
            from: `y_int = ${formatComplex(gInt, bInt)}`,
            to: `y_in = ${formatComplex(gIn, bIn)}`,
            diffSymbol: "Δb",
            diffNorm: `${bNorm >= 0 ? "+" : ""}${bNorm.toFixed(3)}`,
            diffActual: `${B >= 0 ? "+" : ""}${B.toFixed(4)} S`,
            resultingState: `y_in = 1.000 + j0.000 (Z_in = ${numZ0.toFixed(1)} Ω)`,
            circleDescription: `Inverts across origin to g = 1 circle, then moves along g = 1 circle to cancel susceptance`,
          },
        });
      });
    }

    return {
      isValid: solutions.length > 0,
      errorMessage: "",
      solutions,
      activeTopology,
      Z0: numZ0,
      RL: numRL,
      XL: safeXL,
      fHz,
      omega,
      loadMetrics,
    };
  }, [z0, rL, xL, frequency, freqUnit, selectedTopology]);

  const activeSolution =
    calculationData.solutions[activeSolutionIndex] ||
    calculationData.solutions[0];

  const smithChartData = useMemo(() => {
    if (!calculationData.isValid || !activeSolution) {
      return {
        r1Circle: { r: [], x: [] },
        g1Circle: { r: [], x: [] },
        swrCircle: { r: [], x: [] },
        paths: null,
        points: null,
        labels: null,
        arrows: [],
      };
    }

    const { Z0, RL, XL, activeTopology } = calculationData;
    const { B, X } = activeSolution;
    const numPts = 40;

    const r1R: number[] = [],
      r1X: number[] = [];
    const g1R: number[] = [],
      g1X: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * 2 * Math.PI;
      const u = 0.5 + 0.5 * Math.cos(theta),
        v = 0.5 * Math.sin(theta);
      const u2 = -0.5 + 0.5 * Math.cos(theta);
      const denom = Math.pow(1 - u, 2) + Math.pow(v, 2);
      const denom2 = Math.pow(1 - u2, 2) + Math.pow(v, 2);
      if (denom > 1e-6) {
        r1R.push((1 - u * u - v * v) / denom);
        r1X.push((2 * v) / denom);
      }
      if (denom2 > 1e-6) {
        g1R.push((1 - u2 * u2 - v * v) / denom2);
        g1X.push((2 * v) / denom2);
      }
    }

    const zLNorm = { r: RL / Z0, x: XL / Z0 };

    const gammaToZ = (gR: number, gI: number) => {
      const den = Math.pow(1 - gR, 2) + Math.pow(gI, 2);
      if (den < 1e-10) return { r: 999, x: 0 };
      return { r: (1 - gR * gR - gI * gI) / den, x: (2 * gI) / den };
    };
    const zToGamma = (r: number, x: number) => {
      const den = Math.pow(r + 1, 2) + Math.pow(x, 2);
      return { gR: (r * r + x * x - 1) / den, gI: (2 * x) / den };
    };
    const getGammaLine = (
      zStart: { r: number; x: number },
      zEnd: { r: number; x: number },
    ) => {
      const gStart = zToGamma(zStart.r, zStart.x),
        gEnd = zToGamma(zEnd.r, zEnd.x);
      const rArr = [],
        xArr = [];
      for (let i = 0; i <= numPts; i++) {
        const t = i / numPts;
        const z = gammaToZ(
          gStart.gR * (1 - t) + gEnd.gR * t,
          gStart.gI * (1 - t) + gEnd.gI * t,
        );
        rArr.push(z.r);
        xArr.push(z.x);
      }
      return { r: rArr, x: xArr };
    };

    const swrR: number[] = [],
      swrX: number[] = [];
    const gammaL = zToGamma(zLNorm.r, zLNorm.x);
    const rho = Math.sqrt(gammaL.gR ** 2 + gammaL.gI ** 2);
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * 2 * Math.PI;
      const z = gammaToZ(rho * Math.cos(theta), rho * Math.sin(theta));
      swrR.push(z.r);
      swrX.push(z.x);
    }

    const bNorm = B * Z0,
      xNorm = X / Z0;
    const paths = {
      line1: { r: [] as number[], x: [] as number[] },
      arc1: { r: [] as number[], x: [] as number[] },
      line2: { r: [] as number[], x: [] as number[] },
      arc2: { r: [] as number[], x: [] as number[] },
    };
    const points = {
      p1: zLNorm,
      p2: { r: 1, x: 0 },
      p3: { r: 1, x: 0 },
      p4: { r: 1, x: 0 },
      p5: { r: 1, x: 0 },
    };
    const labels = {
      arc1: { r: 1, x: 0, text: "" },
      arc2: { r: 1, x: 0, text: "" },
    };

    if (activeTopology === "shunt-series") {
      const denL = zLNorm.r ** 2 + zLNorm.x ** 2;
      points.p2 = { r: zLNorm.r / denL, x: -zLNorm.x / denL };
      points.p3 = { r: points.p2.r, x: points.p2.x + bNorm };
      const denInt = points.p3.r ** 2 + points.p3.x ** 2;
      points.p4 = { r: points.p3.r / denInt, x: -points.p3.x / denInt };
      points.p5 = { r: 1, x: 0 };

      paths.line1 = getGammaLine(points.p1, points.p2);
      for (let i = 0; i <= numPts; i++) {
        paths.arc1.r.push(points.p2.r);
        paths.arc1.x.push(points.p2.x + (i / numPts) * bNorm);
      }
      paths.line2 = getGammaLine(points.p3, points.p4);
      for (let i = 0; i <= numPts; i++) {
        paths.arc2.r.push(points.p4.r);
        paths.arc2.x.push(points.p4.x + (i / numPts) * xNorm);
      }

      labels.arc1 = {
        r: points.p2.r,
        x: points.p2.x + bNorm / 2,
        text: `${bNorm >= 0 ? "+" : "-"}j${Math.abs(bNorm).toFixed(2)}`,
      };
      labels.arc2 = {
        r: points.p4.r,
        x: points.p4.x + xNorm / 2,
        text: `${xNorm >= 0 ? "+" : "-"}j${Math.abs(xNorm).toFixed(2)}`,
      };
    } else {
      points.p2 = { r: points.p1.r, x: points.p1.x + xNorm };
      const denInt = points.p2.r ** 2 + points.p2.x ** 2;
      points.p3 = { r: points.p2.r / denInt, x: -points.p2.x / denInt };
      points.p4 = { r: 1, x: 0 };

      for (let i = 0; i <= numPts; i++) {
        paths.arc1.r.push(points.p1.r);
        paths.arc1.x.push(points.p1.x + (i / numPts) * xNorm);
      }
      paths.line1 = getGammaLine(points.p2, points.p3);
      for (let i = 0; i <= numPts; i++) {
        paths.arc2.r.push(points.p3.r);
        paths.arc2.x.push(points.p3.x + (i / numPts) * bNorm);
      }

      labels.arc1 = {
        r: points.p1.r,
        x: points.p1.x + xNorm / 2,
        text: `${xNorm >= 0 ? "+" : "-"}j${Math.abs(xNorm).toFixed(2)}`,
      };
      labels.arc2 = {
        r: points.p3.r,
        x: points.p3.x + bNorm / 2,
        text: `${bNorm >= 0 ? "+" : "-"}j${Math.abs(bNorm).toFixed(2)}`,
      };
    }

    const getArrowData = (
      r1: number,
      x1: number,
      r2: number,
      x2: number,
      color: string,
    ) => {
      const g1 = zToGamma(r1, x1);
      const g2 = zToGamma(r2, x2);
      const du = g2.gR - g1.gR;
      const dv = g2.gI - g1.gI;
      const angle = 90 - (Math.atan2(dv, du) * 180) / Math.PI;
      return { r: r1, x: x1, angle, color };
    };

    const arrows = [];
    if (
      activeTopology === "shunt-series" &&
      paths.line1.r.length > 31 &&
      paths.arc1.r.length > 21
    ) {
      arrows.push(
        getArrowData(
          paths.line1.r[10],
          paths.line1.x[10],
          paths.line1.r[11],
          paths.line1.x[11],
          "#475569",
        ),
      );
      arrows.push(
        getArrowData(
          paths.line1.r[30],
          paths.line1.x[30],
          paths.line1.r[31],
          paths.line1.x[31],
          "#475569",
        ),
      );

      arrows.push(
        getArrowData(
          paths.arc1.r[20],
          paths.arc1.x[20],
          paths.arc1.r[21],
          paths.arc1.x[21],
          "#d97706",
        ),
      );

      if (paths.line2.r.length > 31) {
        arrows.push(
          getArrowData(
            paths.line2.r[10],
            paths.line2.x[10],
            paths.line2.r[11],
            paths.line2.x[11],
            "#475569",
          ),
        );
        arrows.push(
          getArrowData(
            paths.line2.r[30],
            paths.line2.x[30],
            paths.line2.r[31],
            paths.line2.x[31],
            "#475569",
          ),
        );
      }

      arrows.push(
        getArrowData(
          paths.arc2.r[20],
          paths.arc2.x[20],
          paths.arc2.r[21],
          paths.arc2.x[21],
          "#6d28d9",
        ),
      );
    } else if (paths.line1.r.length > 31 && paths.arc1.r.length > 21) {
      arrows.push(
        getArrowData(
          paths.arc1.r[20],
          paths.arc1.x[20],
          paths.arc1.r[21],
          paths.arc1.x[21],
          "#d97706",
        ),
      );
      arrows.push(
        getArrowData(
          paths.line1.r[10],
          paths.line1.x[10],
          paths.line1.r[11],
          paths.line1.x[11],
          "#475569",
        ),
      );
      arrows.push(
        getArrowData(
          paths.line1.r[30],
          paths.line1.x[30],
          paths.line1.r[31],
          paths.line1.x[31],
          "#475569",
        ),
      );
      arrows.push(
        getArrowData(
          paths.arc2.r[20],
          paths.arc2.x[20],
          paths.arc2.r[21],
          paths.arc2.x[21],
          "#6d28d9",
        ),
      );
    }

    return {
      r1Circle: { r: r1R, x: r1X },
      g1Circle: { r: g1R, x: g1X },
      swrCircle: { r: swrR, x: swrX },
      paths,
      points,
      labels,
      arrows,
    };
  }, [calculationData, activeSolution]);

  useEffect(() => {
    if (
      !plotlyLoaded ||
      !plotRef.current ||
      !window.Plotly ||
      !smithChartData.paths
    )
      return;
    const traces: PlotlyType.Data[] = [];

    if (smithChartData.r1Circle.r.length > 0) {
      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: "1 + jx Circle",
        real: smithChartData.r1Circle.r,
        imag: smithChartData.r1Circle.x,
        line: { color: "#2e3237ff", width: 1.5, dash: "solid" },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);

      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: "Rotated 1+jx Circle",
        real: smithChartData.g1Circle.r,
        imag: smithChartData.g1Circle.x,
        line: { color: "#16a34a", width: 1.5, dash: "solid" },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);

      traces.push({
        type: "scattersmith",
        mode: "text",
        real: [0.3],
        imag: [1.3],
        text: ["Rotated 1+jx circle<br>on admittance chart"],
        textfont: { size: 10, color: "#16a34a" },
        textposition: "middle left",
        showlegend: false,
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);
    }

    if (smithChartData.swrCircle.r.length > 0) {
      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: "SWR Circle",
        real: smithChartData.swrCircle.r,
        imag: smithChartData.swrCircle.x,
        line: { color: "#cbd5e1", width: 1.5, dash: "solid" },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);

      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: "z to y conversion",
        real: smithChartData.paths.line1.r,
        imag: smithChartData.paths.line1.x,
        line: { color: "#64748b", width: 1.5, dash: "dot" },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);

      if (smithChartData.paths.line2.r.length > 0) {
        traces.push({
          type: "scattersmith",
          mode: "lines",
          showlegend: false,
          real: smithChartData.paths.line2.r,
          imag: smithChartData.paths.line2.x,
          line: { color: "#64748b", width: 1.5, dash: "dot" },
          hoverinfo: "skip",
        } as unknown as PlotlyType.Data);
      }
    }

    if (smithChartData.paths.arc1.r.length > 0) {
      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: "Shunt Transformation",
        real: smithChartData.paths.arc1.r,
        imag: smithChartData.paths.arc1.x,
        line: { color: "#f59e0b", width: 3 },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);

      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: "Series Transformation",
        real: smithChartData.paths.arc2.r,
        imag: smithChartData.paths.arc2.x,
        line: { color: "#8b5cf6", width: 3 },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);

      traces.push({
        type: "scattersmith",
        mode: "text",
        showlegend: false,
        real: [smithChartData.labels!.arc1.r, smithChartData.labels!.arc2.r],
        imag: [smithChartData.labels!.arc1.x, smithChartData.labels!.arc2.x],
        text: [
          smithChartData.labels!.arc1.text,
          smithChartData.labels!.arc2.text,
        ],
        textfont: { size: 14, color: "#0f172a", weight: "bold" },
        textposition: "middle left",
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);
    }

    if (smithChartData.arrows.length > 0) {
      smithChartData.arrows.forEach((arr) => {
        traces.push({
          type: "scattersmith",
          mode: "markers",
          showlegend: false,
          real: [arr.r],
          imag: [arr.x],
          marker: {
            symbol: "triangle-up",
            color: "#475569",
            size: 7,
            angle: arr.angle,
          },
          hoverinfo: "skip",
        } as unknown as PlotlyType.Data);
      });
    }

    if (calculationData.isValid && smithChartData.points) {
      traces.push({
        type: "scattersmith",
        mode: "markers+text",
        name: "Points",
        showlegend: false,
        real: [
          smithChartData.points.p1.r,
          smithChartData.points.p2.r,
          smithChartData.points.p3.r,
          smithChartData.points.p4.r,
          1,
        ],
        imag: [
          smithChartData.points.p1.x,
          smithChartData.points.p2.x,
          smithChartData.points.p3.x,
          smithChartData.points.p4.x,
          0,
        ],
        text:
          calculationData.activeTopology === "shunt-series"
            ? [
                "z<sub>L</sub>",
                "y<sub>L</sub>",
                "y<sub>int</sub>",
                "z<sub>int</sub>",
                "Match",
              ]
            : [
                "z<sub>L</sub>",
                "z<sub>int</sub>",
                "y<sub>int</sub>",
                "Match",
                "",
              ],
        textposition: "bottom center",
        marker: { color: "#0f172a", size: 9, symbol: "circle" },
        hovertemplate: `<b>%{text}</b><br>Re: %{real:.3f}<br>Im: %{imag:.3f}<extra></extra>`,
      } as unknown as PlotlyType.Data);
    }

    const layout = {
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      autosize: true,
      height: 580,
      width: 580,
      smith: {
        realaxis: {
          tickcolor: "#94a3b8",
          tickangle: 0,
          gridcolor: "#e2e8f0",
          linecolor: "#cbd5e1",
          tickfont: { color: "#64748b" },
        },
        imagaxis: {
          tickcolor: "#94a3b8",
          gridcolor: "#e2e8f0",
          linecolor: "#cbd5e1",
          tickfont: { color: "#3b82f6" },
        },
      },
      margin: { l: 30, r: 30, t: 70, b: 30 },
      showlegend: true,
      legend: {
        orientation: "h",
        x: 0.5,
        xanchor: "center",
        y: 1.15,
        yanchor: "bottom",
        font: { color: "#475569", size: 11 },
        bgcolor: "rgba(255,255,255,0.85)",
      },
    };

    const config = { responsive: true, displayModeBar: false };
    window.Plotly.newPlot(
      plotRef.current,
      traces,
      layout as unknown as PlotlyType.Layout,
      config,
    );
  }, [calculationData, smithChartData, plotlyLoaded, activeSolutionIndex]);

  return (
    <div className="w-full bg-slate-50 text-slate-900 font-sans p-4 md:p-6 flex flex-col gap-6 rounded-2xl border border-slate-200">
      <style>{`input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { opacity: 1 !important; display: flex !important; }`}</style>
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        <div className="w-full xl:w-[440px] flex flex-col gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-800">
                  Parameters
                </h2>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Topology Selection
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleTopologyChange("shunt-series")}
                  className={`py-1.5 px-2 text-sm font-medium rounded-md transition-all cursor-pointer ${selectedTopology === "shunt-series" ? "bg-white text-blue-700 shadow-xs font-bold border border-slate-200/80" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Shunt at Load
                </button>
                <button
                  type="button"
                  onClick={() => handleTopologyChange("series-shunt")}
                  className={`py-1.5 px-2 text-sm font-medium rounded-md transition-all cursor-pointer ${selectedTopology === "series-shunt" ? "bg-white text-blue-700 shadow-xs font-bold border border-slate-200/80" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Series at Load
                </button>
              </div>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Line Characteristic Impedance (Z<sub>0</sub>)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={z0}
                    onChange={(e) => setZ0(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3.5 pr-10 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3.5 top-1.5 text-sm text-slate-400 pointer-events-none">
                    Ω
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Load Res. (R<sub>L</sub>)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={rL}
                      onChange={(e) => setRL(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-1.5 text-sm text-slate-400 pointer-events-none">
                      Ω
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Load React. (X<sub>L</sub>)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={xL}
                      onChange={(e) => setXL(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-1.5 text-sm text-slate-400 pointer-events-none">
                      Ω
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Frequency (f)
                  </label>
                  <input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Unit
                  </label>
                  <select
                    value={freqUnit}
                    onChange={(e) =>
                      setFreqUnit(e.target.value as "MHz" | "GHz" | "kHz")
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="MHz">MHz</option>
                    <option value="GHz">GHz</option>
                    <option value="kHz">kHz</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" />
                <h2 className="text-base font-semibold text-slate-800">
                  L-Section Solutions
                </h2>
              </div>
            </div>
            {!calculationData.isValid ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 mb-1">
                    Configuration Error
                  </h4>
                  <p>{calculationData.errorMessage}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Normalized Load
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                        z<sub>L</sub> = r<sub>L</sub> + jx<sub>L</sub>
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {formatComplex(
                          calculationData.loadMetrics.zLNorm.r,
                          calculationData.loadMetrics.zLNorm.x,
                        )}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                        y<sub>L</sub> = g<sub>L</sub> + jb<sub>L</sub>
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {formatComplex(
                          calculationData.loadMetrics.yLNorm.g,
                          calculationData.loadMetrics.yLNorm.b,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {calculationData.solutions.map((sol, index) => (
                    <button
                      key={sol.id}
                      onClick={() => setActiveSolutionIndex(index)}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg border text-sm font-bold transition-all cursor-pointer ${
                        activeSolutionIndex === index
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Solution {sol.id}
                    </button>
                  ))}
                </div>

                {activeSolution && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Component Values
                      </span>
                      <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-amber-900">
                            Component 1 (
                            {activeSolution.comp1.role === "shunt"
                              ? "Shunt at Load"
                              : "Series at Load"}
                            )
                          </span>
                          <span className="text-sm font-bold text-amber-700">
                            {activeSolution.comp1.role === "shunt"
                              ? `B = ${activeSolution.B >= 0 ? "+" : ""}${activeSolution.B.toFixed(4)} S`
                              : `X = ${activeSolution.X >= 0 ? "+" : ""}${activeSolution.X.toFixed(2)} Ω`}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-slate-700">
                            {activeSolution.comp1.type === "L"
                              ? "Inductor (L₁)"
                              : "Capacitor (C₁)"}
                          </span>
                          <span className="text-sm font-bold text-amber-900">
                            {activeSolution.comp1.displayValue}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-purple-50/60 border border-purple-200 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-purple-900">
                            Component 2 (
                            {activeSolution.comp2.role === "series"
                              ? "Series at Line"
                              : "Shunt at Line"}
                            )
                          </span>
                          <span className="text-sm font-bold text-purple-700">
                            {activeSolution.comp2.role === "series"
                              ? `X = ${activeSolution.X >= 0 ? "+" : ""}${activeSolution.X.toFixed(2)} Ω`
                              : `B = ${activeSolution.B >= 0 ? "+" : ""}${activeSolution.B.toFixed(4)} S`}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-slate-700">
                            {activeSolution.comp2.type === "L"
                              ? "Inductor (L₂)"
                              : "Capacitor (C₂)"}
                          </span>
                          <span className="text-sm font-bold text-purple-900">
                            {activeSolution.comp2.displayValue}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-sm">
                      <span className="font-semibold text-emerald-900">
                        Z<sub>in</sub> after matching
                      </span>
                      <span className="font-bold text-emerald-800 text-sm">
                        {calculationData.Z0.toFixed(1)} + j0.00 Ω
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-xs border border-slate-200 flex flex-col items-center p-5 gap-6">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="text-center">
              <h2 className="text-base font-semibold text-slate-800">
                Smith Chart
              </h2>
            </div>
            <div className="relative flex justify-center items-center w-full min-h-[580px]">
              {!plotlyLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 rounded-2xl">
                  <Cpu className="w-8 h-8 text-blue-500 animate-pulse mb-2" />
                  <p className="text-sm text-slate-500 font-medium">
                    Loading Smith Chart Engine...
                  </p>
                </div>
              )}
              <div
                ref={plotRef}
                className="w-[580px] h-[580px] max-w-full"
                style={{
                  opacity: plotlyLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out",
                }}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (plotRef.current && window.Plotly) {
                  window.Plotly.downloadImage(plotRef.current, {
                    format: "png",
                    filename: "l_section_textbook_chart",
                    height: 700,
                    width: 700,
                  });
                }
              }}
            >
              Download
            </Button>
          </div>
        </div>
      </div>

      {calculationData.isValid && activeSolution && (
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span className="text-base font-semibold text-slate-800">
                Transformation Differences
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Stage-by-stage theoretical verification values
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSolution.topology === "shunt-series" ? (
              <>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="text-sm">
                      1. Admittance: y<sub>L</sub> → y<sub>int</sub>
                    </span>
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-sm font-bold">
                      Δb = {activeSolution.bNorm >= 0 ? "+" : ""}
                      {activeSolution.bNorm.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span>
                      y<sub>L</sub> ={" "}
                      {formatComplex(
                        calculationData.loadMetrics.yLNorm.g,
                        calculationData.loadMetrics.yLNorm.b,
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-800">
                      y<sub>int</sub> ={" "}
                      {formatComplex(
                        activeSolution.yInt.g,
                        activeSolution.yInt.b,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 px-1 pt-1">
                    <span>
                      Δb = b<sub>int</sub> − b<sub>L</sub> ={" "}
                      {activeSolution.bNorm >= 0 ? "+" : ""}
                      {activeSolution.bNorm.toFixed(3)}
                    </span>
                    <span className="font-bold text-amber-900 text-sm">
                      B = Δb / Z<sub>0</sub> ={" "}
                      {activeSolution.B >= 0 ? "+" : ""}
                      {activeSolution.B.toFixed(4)} S
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="text-sm">
                      2. Impedance: z<sub>int</sub> → Match
                    </span>
                    <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-sm font-bold">
                      Δx = {activeSolution.xNorm >= 0 ? "+" : ""}
                      {activeSolution.xNorm.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span>
                      z<sub>int</sub> ={" "}
                      {formatComplex(
                        activeSolution.zInt.r,
                        activeSolution.zInt.x,
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-800">
                      z<sub>in</sub> = 1.000 + j0.000
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 px-1 pt-1">
                    <span>
                      Δx = x<sub>in</sub> − x<sub>int</sub> ={" "}
                      {activeSolution.xNorm >= 0 ? "+" : ""}
                      {activeSolution.xNorm.toFixed(3)}
                    </span>
                    <span className="font-bold text-purple-900 text-sm">
                      X = Δx · Z<sub>0</sub> ={" "}
                      {activeSolution.X >= 0 ? "+" : ""}
                      {activeSolution.X.toFixed(2)} Ω
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="text-sm">
                      1. Impedance: z<sub>L</sub> → z<sub>int</sub>
                    </span>
                    <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-sm font-bold">
                      Δx = {activeSolution.xNorm >= 0 ? "+" : ""}
                      {activeSolution.xNorm.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span>
                      z<sub>L</sub> ={" "}
                      {formatComplex(
                        calculationData.loadMetrics.zLNorm.r,
                        calculationData.loadMetrics.zLNorm.x,
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-800">
                      z<sub>int</sub> ={" "}
                      {formatComplex(
                        activeSolution.zInt.r,
                        activeSolution.zInt.x,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 px-1 pt-1">
                    <span>
                      Δx = x<sub>int</sub> − x<sub>L</sub> ={" "}
                      {activeSolution.xNorm >= 0 ? "+" : ""}
                      {activeSolution.xNorm.toFixed(3)}
                    </span>
                    <span className="font-bold text-purple-900 text-sm">
                      X = Δx · Z<sub>0</sub> ={" "}
                      {activeSolution.X >= 0 ? "+" : ""}
                      {activeSolution.X.toFixed(2)} Ω
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="text-sm">
                      2. Admittance: y<sub>int</sub> → Match
                    </span>
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-sm font-bold">
                      Δb = {activeSolution.bNorm >= 0 ? "+" : ""}
                      {activeSolution.bNorm.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span>
                      y<sub>int</sub> ={" "}
                      {formatComplex(
                        activeSolution.yInt.g,
                        activeSolution.yInt.b,
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-800">
                      y<sub>in</sub> = 1.000 + j0.000
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 px-1 pt-1">
                    <span>
                      Δb = b<sub>in</sub> − b<sub>int</sub> ={" "}
                      {activeSolution.bNorm >= 0 ? "+" : ""}
                      {activeSolution.bNorm.toFixed(3)}
                    </span>
                    <span className="font-bold text-amber-900 text-sm">
                      B = Δb / Z<sub>0</sub> ={" "}
                      {activeSolution.B >= 0 ? "+" : ""}
                      {activeSolution.B.toFixed(4)} S
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
