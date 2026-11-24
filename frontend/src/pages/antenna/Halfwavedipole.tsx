import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import HalfWaveDipoleVisualization from "../../components/HalfWaveDipoleVisualization";

const H = "text-base font-bold mt-10 mb-2 text-slate-900";
const P = "text-sm text-slate-700 leading-relaxed mb-3";
const EQ = "overflow-x-auto my-4";

export default function HalfwaveDipole() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", lineHeight: 1.6 }}>
      <h1>Half-wave dipole antenna</h1>
      <p>
        A thin wire of length l = λ/2, fed at its midpoint. Treating it as a chain of Hertzian dipoles with
        current I = I₀ cos βz gives the far-field radiation below. Drag to rotate, scroll to zoom.
      </p>

      <HalfWaveDipoleVisualization />

      {/* ---------------- notes: derivation following Sadiku §13.3 ---------------- */}
      <section className="max-w-3xl mx-auto mt-12">
        <h2 className="text-xl font-black text-slate-900 border-t border-slate-200 pt-8">
          Notes: deriving the far field of the half-wave dipole
        </h2>
        <p className={P + " mt-2"}>
          The half-wave dipole is a thin wire whose length is half a wavelength, <InlineMath math="l=\lambda/2" />,
          fed at its midpoint through a transmission line. The idea behind the derivation is to treat it as a chain
          of Hertzian dipoles and add up their contributions.
        </p>

        <h3 className={H}>1. Current distribution</h3>
        <p className={P}>
          The exact current on a real antenna comes from solving Maxwell&apos;s equations with the boundary
          conditions on the wire, which is mathematically complex. The usual approach is to assume a sinusoidal
          distribution. It follows from the transmission-line model of the dipole, and it makes the current go to
          zero at both ends, as it must. A triangular distribution is also possible, but it gives less accurate results.
        </p>
        <div className={EQ}>
          <BlockMath math="I_s = I_0\cos\beta z,\qquad -\frac{\lambda}{4}\le z\le\frac{\lambda}{4}" />
        </div>

        <h3 className={H}>2. Vector potential of one small element</h3>
        <p className={P}>
          Take a small piece of the wire of length <InlineMath math="dz" /> at height <InlineMath math="z" />. It
          behaves like a Hertzian dipole carrying <InlineMath math="I_0\cos\beta z" />, so its contribution to the
          magnetic vector potential at the point P is
        </p>
        <div className={EQ}>
          <BlockMath math="dA_{zs}=\frac{\mu I_0\cos\beta z\,dz}{4\pi r'}\,e^{-j\beta r'}" />
        </div>
        <p className={P}>
          where <InlineMath math="r'" /> is the distance from this element to P.
        </p>

        <h3 className={H}>3. Far-field approximations</h3>
        <p className={P}>
          When the observation point is far away (<InlineMath math="r\gg l" />), the lines from every element to P are
          almost parallel, so the distances differ only by the projection of the element&apos;s position onto the
          direction of P:
        </p>
        <div className={EQ}>
          <BlockMath math="r' = r - z\cos\theta" />
        </div>
        <p className={P}>
          In the denominator this small difference does not matter, so we use <InlineMath math="r'\approx r" />. In the
          phase term it does matter, because the phase constant multiplies it by <InlineMath math="\beta" /> and the
          waves from different elements add with different phases. So there we keep <InlineMath math="r-z\cos\theta" />.
          Summing over the whole wire gives
        </p>
        <div className={EQ}>
          <BlockMath math="A_{zs}=\frac{\mu I_0\,e^{-j\beta r}}{4\pi r}\int_{-\lambda/4}^{\lambda/4} e^{\,j\beta z\cos\theta}\cos\beta z\,dz" />
        </div>

        <h3 className={H}>4. Evaluating the integral</h3>
        <p className={P}>The integral is standard:</p>
        <div className={EQ}>
          <BlockMath math="\int e^{az}\cos bz\,dz=\frac{e^{az}\,(a\cos bz+b\sin bz)}{a^{2}+b^{2}}+c" />
        </div>
        <p className={P}>
          Here <InlineMath math="a=j\beta\cos\theta" /> and <InlineMath math="b=\beta" />, so{" "}
          <InlineMath math="a^2+b^2=\beta^2\sin^2\theta" />. At the two ends <InlineMath math="\beta z=\pm\pi/2" />, so
          the cosine is 0 and the sine is ±1. The result of putting in the limits is
        </p>
        <div className={EQ}>
          <BlockMath math="A_{zs}=\frac{\mu I_0\,e^{-j\beta r}}{4\pi r\,\beta^{2}\sin^{2}\theta}\Big[\beta\,e^{\,j\frac{\pi}{2}\cos\theta}+\beta\,e^{-j\frac{\pi}{2}\cos\theta}\Big]" />
        </div>
        <p className={P}>
          Using <InlineMath math="e^{jx}+e^{-jx}=2\cos x" />:
        </p>
        <div className={EQ}>
          <BlockMath math="A_{zs}=\frac{\mu I_0\,e^{-j\beta r}\cos\!\left(\frac{\pi}{2}\cos\theta\right)}{2\pi r\,\beta\,\sin^{2}\theta}" />
        </div>

        <h3 className={H}>5. Far-zone fields</h3>
        <p className={P}>
          The magnetic field follows from <InlineMath math="\mathbf B=\mu\mathbf H=\nabla\times\mathbf A" />, and the
          electric field from <InlineMath math="\nabla\times\mathbf H=j\omega\varepsilon\mathbf E" />. In the far zone
          only the terms that vary as 1/r survive; the 1/r² and 1/r³ terms are discarded:
        </p>
        <div className={EQ}>
          <BlockMath math="H_{\phi s}=\frac{j\,I_0\,e^{-j\beta r}\cos\!\left(\frac{\pi}{2}\cos\theta\right)}{2\pi r\,\sin\theta},\qquad E_{\theta s}=\eta\,H_{\phi s}" />
        </div>
        <p className={P}>
          As for the Hertzian dipole, the radiation fields <InlineMath math="H_{\phi s}" /> and{" "}
          <InlineMath math="E_{\theta s}" /> are in time phase and orthogonal to each other. The angular dependence{" "}
          <InlineMath math="\cos\!\big(\tfrac{\pi}{2}\cos\theta\big)/\sin\theta" /> is the pattern shown in the
          visualization above.
        </p>

        <h3 className={H}>6. Time-average power density</h3>
        <p className={P}>
          The time-average power per unit area flows radially outward, with{" "}
          <InlineMath math="\eta=120\pi" /> for free space:
        </p>
        <div className={EQ}>
          <BlockMath math="\mathbf S_{ave}=\tfrac12\,\eta\,|H_{\phi s}|^{2}\,\mathbf a_r=\frac{\eta I_0^{2}\cos^{2}\!\left(\frac{\pi}{2}\cos\theta\right)}{8\pi^{2}r^{2}\sin^{2}\theta}\,\mathbf a_r" />
        </div>

        <h3 className={H}>7. Total radiated power</h3>
        <p className={P}>
          Integrating the power density over a sphere of radius r, the factor <InlineMath math="r^2" /> cancels:
        </p>
        <div className={EQ}>
          <BlockMath math="P_{rad}=\oint \mathbf S_{ave}\cdot d\mathbf S=\frac{\eta I_0^{2}}{8\pi^{2}}\,2\pi\int_0^{\pi}\frac{\cos^{2}\!\left(\frac{\pi}{2}\cos\theta\right)}{\sin\theta}\,d\theta=30\,I_0^{2}\int_0^{\pi}\frac{\cos^{2}\!\left(\frac{\pi}{2}\cos\theta\right)}{\sin\theta}\,d\theta" />
        </div>
        <p className={P}>
          The integrand is symmetric about <InlineMath math="\theta=\pi/2" />, so the two halves are equal. Doubling
          the first half gives
        </p>
        <div className={EQ}>
          <BlockMath math="P_{rad}=60\,I_0^{2}\int_0^{\pi/2}\frac{\cos^{2}\!\left(\frac{\pi}{2}\cos\theta\right)}{\sin\theta}\,d\theta" />
        </div>
        <p className={P}>
          Now let <InlineMath math="u=\cos\theta" /> and split the result with partial fractions,{" "}
          <InlineMath math="\frac{1}{1-u^2}=\frac12\left[\frac{1}{1+u}+\frac{1}{1-u}\right]" />:
        </p>
        <div className={EQ}>
          <BlockMath math="P_{rad}=60\,I_0^{2}\int_0^{1}\frac{\cos^{2}\!\left(\frac{\pi}{2}u\right)}{1-u^{2}}\,du=30\,I_0^{2}\left[\int_0^{1}\frac{\cos^{2}\!\left(\frac{\pi}{2}u\right)}{1+u}\,du+\int_0^{1}\frac{\cos^{2}\!\left(\frac{\pi}{2}u\right)}{1-u}\,du\right]" />
        </div>
        <p className={P}>
          Substituting <InlineMath math="v=1+u" /> in the first integral and <InlineMath math="v=1-u" /> in the second,
          both become <InlineMath math="\sin^2(\pi v/2)/v" />, over the ranges 1 to 2 and 0 to 1, which join into one
          integral. Then <InlineMath math="w=\pi v" /> gives
        </p>
        <div className={EQ}>
          <BlockMath math="P_{rad}=30\,I_0^{2}\int_0^{2}\frac{\sin^{2}\!\left(\frac{\pi}{2}v\right)}{v}\,dv=15\,I_0^{2}\int_0^{2\pi}\frac{1-\cos w}{w}\,dw" />
        </div>
        <p className={P}>
          Expanding <InlineMath math="\cos w" /> as a power series and integrating term by term:
        </p>
        <div className={EQ}>
          <BlockMath math="P_{rad}=15\,I_0^{2}\left[\frac{(2\pi)^{2}}{2\cdot 2!}-\frac{(2\pi)^{4}}{4\cdot 4!}+\frac{(2\pi)^{6}}{6\cdot 6!}-\frac{(2\pi)^{8}}{8\cdot 8!}+\cdots\right]\approx 36.56\,I_0^{2}" />
        </div>

        <h3 className={H}>8. Radiation resistance and input impedance</h3>
        <p className={P}>
          Since <InlineMath math="P_{rad}=\tfrac12 I_0^{2}R_{rad}" />:
        </p>
        <div className={EQ}>
          <BlockMath math="R_{rad}=\frac{2P_{rad}}{I_0^{2}}\approx 73\ \Omega" />
        </div>
        <p className={P}>
          This is far larger than the radiation resistance of a Hertzian dipole, so the half-wave dipole can deliver much
          more power to space. The impedance seen at the terminals is{" "}
          <InlineMath math="Z_{in}=R_{in}+jX_{in}" />, with <InlineMath math="R_{in}=R_{rad}" /> for a lossless antenna.
          Finding the reactance is a longer calculation that the book does not carry out; it reports{" "}
          <InlineMath math="X_{in}=42.5\ \Omega" />, so
        </p>
        <div className={EQ}>
          <BlockMath math="Z_{in}=73+j42.5\ \Omega\quad (l=\lambda/2)" />
        </div>
        <p className={P}>
          The inductive reactance drops quickly to zero as the wire is shortened slightly. At{" "}
          <InlineMath math="l=0.485\lambda" /> the dipole is resonant (<InlineMath math="X_{in}=0" />), so in practice a
          half-wave dipole is cut so that <InlineMath math="Z_{in}\approx 73\ \Omega" />. This value is one reason for the
          standard 75 Ω coaxial cable, and it is also easy to match to transmission lines.
        </p>
      </section>

      <h2>Key results</h2>
      <p>Far-field (Sadiku eq. 13.19):</p>
      <pre>
{`H_φ = j I₀ e^(−jβr) cos((π/2)cosθ) / (2π r sinθ)
E_θ = η H_φ`}
      </pre>
      <p>
        The pattern is a doughnut: maximum at θ = 90° (broadside), a null along the wire axis (θ = 0°, 180°),
        and no dependence on φ.
      </p>
      <ul>
        <li>Radiated power: P_rad ≈ 36.56 I₀² (eq. 13.26)</li>
        <li>Radiation resistance: R_rad = 2P_rad / I₀² ≈ 73 Ω (eq. 13.27)</li>
        <li>Input impedance at l = λ/2: Z_in = 73 + j42.5 Ω; resonant (X_in = 0) at l ≈ 0.485λ</li>
      </ul>
    </main>
  );
}