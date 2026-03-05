
// Core Mathematical Engine for Transmission Line Module


export type Complex = {
  re: number;
  im: number;
};

// -----------------------------
// Complex Utilities
// -----------------------------
export const complex = (re: number, im: number): Complex => ({
  re,
  im,
});

export const add = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const multiply = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const divide = (a: Complex, b: Complex): Complex => {
  const denom = b.re * b.re + b.im * b.im;

  if (denom === 0) {
    return { re: 0, im: 0 }; // prevent crash
  }

  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
};

export const magnitude = (a: Complex): number =>
  Math.sqrt(a.re * a.re + a.im * a.im);

export const phase = (a: Complex): number =>
  Math.atan2(a.im, a.re);

export const complexSqrt = (a: Complex): Complex => {
  const r = magnitude(a);
  const theta = phase(a);

  const sqrtR = Math.sqrt(r);
  const halfTheta = theta / 2;

  return {
    re: sqrtR * Math.cos(halfTheta),
    im: sqrtR * Math.sin(halfTheta),
  };
};


// Transmission Line Core Calculations


export type TransmissionLineResults = {
  Z0: Complex;
  alpha: number;
  beta: number;
  vp: number;
  wavelength: number;
};

// Angular frequency ω = 2πf
export const calculateOmega = (f: number): number =>
  2 * Math.PI * f;

// Characteristic Impedance Z0
export const calculateZ0 = (
  R: number,
  L: number,
  G: number,
  C: number,
  f: number
): Complex => {
  const omega = calculateOmega(f);

  const numerator = complex(R, omega * L);
  const denominator = complex(G, omega * C);

  const ratio = divide(numerator, denominator);
  return complexSqrt(ratio);
};

// Propagation Constant γ = sqrt((R+jωL)(G+jωC))
export const calculateGamma = (
  R: number,
  L: number,
  G: number,
  C: number,
  f: number
): Complex => {
  const omega = calculateOmega(f);

  const term1 = complex(R, omega * L);
  const term2 = complex(G, omega * C);

  const product = multiply(term1, term2);
  return complexSqrt(product);
};

// Master Function (Lossy + Lossless)
export const calculateDerivedValues = (
  R: number,
  L: number,
  G: number,
  C: number,
  f: number,
  lossless: boolean
): TransmissionLineResults => {
  const omega = calculateOmega(f);

  // -----------------------------
  

  // -----------------------------
  // GENERAL LOSSY CASE
  // -----------------------------
  const Z0 = calculateZ0(R, L, G, C, f);
  const gamma = calculateGamma(R, L, G, C, f);

  const alpha = gamma.re;
  const beta = gamma.im;

  const vp = beta !== 0 ? omega / beta : 0;
  const wavelength = beta !== 0 ? (2 * Math.PI) / beta : 0;

  return {
    Z0,
    alpha,
    beta,
    vp,
    wavelength,
  };
};
