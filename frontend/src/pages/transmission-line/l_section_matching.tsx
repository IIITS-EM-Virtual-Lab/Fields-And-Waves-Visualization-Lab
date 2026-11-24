import { BlockMath, InlineMath } from "react-katex";
import { Link } from "react-router-dom";
import "katex/dist/katex.min.css";
import LSectionMatchingVisualization from "@/components/LSectionMatchingVisualization";

const LSectionMatchingPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center pt-10 pb-4 tracking-wide text-slate-900">
        L-Section Impedance Matching
      </div>

      <div className="pb-12">
        <div className="text-xl font-black uppercase text-center py-6 text-slate-800">
          Interactive Demo
        </div>

        <div className="flex justify-center">
          <LSectionMatchingVisualization />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900 flex items-center gap-2">
          <span>1. Introduction to Lumped-Element L-Networks</span>
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          Impedance matching is one of the most fundamental requirements in microwave engineering. When a transmission line with characteristic impedance <InlineMath math="Z_0" /> is terminated in an arbitrary complex load impedance <InlineMath math="Z_L = R_L + jX_L \neq Z_0" />, reflections occur on the line, resulting in standing waves, power loss in the feed line, and reduced system efficiency.
        </p>

        <p className="mb-4 leading-relaxed text-slate-700">
          An impedance matching network is placed between the transmission line and the load. The matching network is designed to be lossless so that no power is wasted, transforming the load impedance into:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="Z_{in} = Z_0 + j0" />
        </div>

        <p className="mb-4 leading-relaxed text-slate-700">
          Probably the simplest type of matching network is the <strong>L-section</strong>, which uses two reactive lumped elements (inductors and/or capacitors) in an L-shaped configuration - one connected in series and one connected in shunt (parallel).
        </p>

        <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
          <div>
            <strong>Why match impedances?</strong> 
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Maximum power is delivered from the generator to the load, minimizing feed line loss.</li>
              <li>Improves signal-to-noise ratio in sensitive receiver components (antennas, low-noise amplifiers).</li>
              <li>Reduces amplitude and phase errors in microwave power distribution networks.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          2. Topologies &amp; The <InlineMath math="1 + jx" /> Circle Rule
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          There are two distinct circuit configurations for an L-section matching network, uniquely governed by whether the normalized load impedance <InlineMath math="z_L = Z_L / Z_0" /> lies <strong>inside</strong> or <strong>outside</strong> the <InlineMath math="1 + jx" /> resistance circle on the Smith Chart:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              Shunt at Load (<InlineMath math="R_L > Z_0" />)
            </h3>
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
              Used when the normalized load <InlineMath math="z_L" /> is <strong>inside the <InlineMath math="1+jx" /> circle</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              A <strong>shunt reactive susceptance <InlineMath math="jB" /></strong> is placed directly in parallel across the load, followed by a <strong>series reactive element <InlineMath math="jX" /></strong> toward the transmission line.
            </p>
          </div>

          <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-xl">
            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              Series at Load (<InlineMath math="R_L < Z_0" />)
            </h3>
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
              Used when the normalized load <InlineMath math="z_L" /> is <strong>outside the <InlineMath math="1+jx" /> circle</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              A <strong>series reactive element <InlineMath math="jX" /></strong> is connected directly in series with the load, followed by a <strong>shunt reactive susceptance <InlineMath math="jB" /></strong> toward the transmission line.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-900">
          <strong>Key Insight:</strong> The choice of topology depends <strong>solely on the load resistance</strong> relative to characteristic impedance (<InlineMath math="R_L > Z_0" /> vs. <InlineMath math="R_L < Z_0" />). It <strong>does not depend on the load reactance <InlineMath math="X_L" /></strong> because for both topologies, the arguments of the square roots in closed-form equations are guaranteed to be positive for any real <InlineMath math="X_L" />.
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          3. Analytic Solution: <InlineMath math="R_L > Z_0" /> 
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          The input impedance seen looking into the matching network must equal <InlineMath math="Z_0" />:
        </p>

        <div className="flex justify-center my-4 overflow-x-auto">
          <BlockMath math="Z_0 = jX + \frac{1}{jB + \frac{1}{R_L + jX_L}}" />
        </div>

        <p className="mb-4 leading-relaxed text-slate-700">
          Rearranging and equating real and imaginary parts yields two simultaneous equations for <InlineMath math="X" /> and <InlineMath math="B" />:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-center">
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm font-mono">
            <BlockMath math="B(X R_L - X_L Z_0) = R_L - Z_0" />
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm font-mono">
            <BlockMath math="X(1 - B X_L) = B Z_0 R_L - X_L" />
          </div>
        </div>

        <p className="mb-4 leading-relaxed text-slate-700">
          Solving for <InlineMath math="X" /> and substituting yields a quadratic equation in <InlineMath math="B" />. The exact closed-form solutions are:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
              Shunt Susceptance
            </p>
            <BlockMath math="B = \frac{X_L \pm \sqrt{R_L / Z_0} \sqrt{R_L^2 + X_L^2 - Z_0 R_L}}{R_L^2 + X_L^2}" />
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
              Series Reactance
            </p>
            <BlockMath math="X = \frac{1}{B} + \frac{X_L Z_0}{R_L} - \frac{Z_0}{B R_L}" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          4. Analytic Solution: <InlineMath math="R_L < Z_0" />
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          The admittance seen looking into the matching network must equal <InlineMath math="1/Z_0" />:
        </p>

        <div className="flex justify-center my-4 overflow-x-auto">
          <BlockMath math="\frac{1}{Z_0} = jB + \frac{1}{R_L + j(X + X_L)}" />
        </div>

        <p className="mb-4 leading-relaxed text-slate-700">
          Separating into real and imaginary parts yields:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-center">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm font-mono">
            <BlockMath math="B Z_0 (X + X_L) = Z_0 - R_L" />
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm font-mono">
            <BlockMath math="(X + X_L) = B Z_0 R_L" />
          </div>
        </div>

        <p className="mb-4 leading-relaxed text-slate-700">
          Solving for <InlineMath math="X" /> and <InlineMath math="B" /> gives closed-form expressions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
              Series Reactance
            </p>
            <BlockMath math="X = \pm \sqrt{R_L(Z_0 - R_L)} - X_L" />
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
              Shunt Susceptance
            </p>
            <BlockMath math="B = \pm \frac{\sqrt{(Z_0 - R_L)/R_L}}{Z_0}" />
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>Note:</strong> Because <InlineMath math="R_L < Z_0" />, the arguments of the square roots are always positive, again yielding two distinct solutions.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          5. Conversion to Physical Inductor &amp; Capacitor Values
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          At an operating angular frequency <InlineMath math="\omega = 2\pi f" />, the signs of the calculated reactance <InlineMath math="X" /> and susceptance <InlineMath math="B" /> determine the physical component types:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">
              Series Element (<InlineMath math="jX" />)
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                <strong>Inductive (<InlineMath math="X > 0" />):</strong>{" "}
                <InlineMath math="L = \frac{X}{\omega} = \frac{X}{2\pi f}" />
              </li>
              <li>
                <strong>Capacitive (<InlineMath math="X < 0" />):</strong>{" "}
                <InlineMath math="C = \frac{1}{-\omega X} = \frac{1}{2\pi f (-X)}" />
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">
              Shunt Element (<InlineMath math="jB" />)
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                <strong>Capacitive (<InlineMath math="B > 0" />):</strong>{" "}
                <InlineMath math="C = \frac{B}{\omega} = \frac{B}{2\pi f}" />
              </li>
              <li>
                <strong>Inductive (<InlineMath math="B < 0" />):</strong>{" "}
                <InlineMath math="L = \frac{1}{-\omega B} = \frac{1}{2\pi f (-B)}" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <Link
          to="/smith-chart"
          className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-slate-50 hover:shadow transition-all"
        >
          ← Back to Smith Chart Fundamentals
        </Link>
      </div>
    </div>
  );
};

export default LSectionMatchingPage;
