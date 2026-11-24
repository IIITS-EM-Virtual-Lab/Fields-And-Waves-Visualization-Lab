import { BlockMath, InlineMath } from "react-katex";
import { Link } from "react-router-dom";
import "katex/dist/katex.min.css";
import MicrowaveAmplifierDesignVisualization from "@/components/MicrowaveAmplifierDesignVisualization";

const MicrowaveAmplifierDesign = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center pt-10 pb-4 tracking-wide text-slate-900">
        Microwave Amplifier Design
      </div>

      <div className="pb-12">
        <div className="text-xl font-black uppercase text-center py-6 text-slate-800">
          Interactive Demo
        </div>

        <div className="flex justify-center">
          <MicrowaveAmplifierDesignVisualization />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900 flex items-center gap-2">
          <span>1. Introduction to Microwave Transistor Amplifiers</span>
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          At microwave frequencies, transistor amplifier design differs substantially from low-frequency analog circuit design. Transistors (such as GaAs FETs, GaN HEMTs, or SiGe HBTs) cannot be adequately characterized by simple lumped models due to transit-time delays, package parasitics, and distributed effects. Instead, they are characterized by their <strong>two-port Scattering Parameters (<InlineMath math="[S]" />)</strong> measured at a given DC operating bias and RF frequency with reference to a characteristic impedance <InlineMath math="Z_0" /> (typically <InlineMath math="50\,\Omega" />).
        </p>

        <p className="mb-4 leading-relaxed text-slate-700">
          A single-stage microwave amplifier consists of the active transistor embedded between an <strong>Input Matching Network (<InlineMath math="M_1" />)</strong> and an <strong>Output Matching Network (<InlineMath math="M_2" />)</strong>, connected to a source generator with impedance <InlineMath math="Z_S" /> and a load with impedance <InlineMath math="Z_L" />:
        </p>

        <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 mb-4">
          <div className="font-semibold text-slate-800 mb-2">Core Design Objectives:</div>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Stability:</strong> Ensure the amplifier does not break into spurious oscillations under any operating conditions.</li>
            <li><strong>Power Gain:</strong> Maximize transducer gain or achieve a targeted flat gain over the bandwidth of interest.</li>
            <li><strong>Impedance Matching:</strong> Transform the external <InlineMath math="50\,\Omega" /> terminations into optimal source and load reflection coefficients (<InlineMath math="\Gamma_S" /> and <InlineMath math="\Gamma_L" />).</li>
            <li><strong>Noise Figure &amp; Linearity:</strong> Provide optimal source termination for minimum noise figure (<InlineMath math="F_{\min}" />) or maximum output power (<InlineMath math="P_{1\text{dB}}" />).</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          2. Two-Port Power Gain Definitions
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          Because microwave sources and loads may not be conjugate matched to the amplifier ports, there are three distinct power gain formulations depending on how input and output powers are referenced:
        </p>

        <p className="mb-3 text-slate-700 font-medium">
          The input and output reflection coefficients looking into the active transistor ports are given by:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Input Reflection Coefficient</p>
            <BlockMath math="\Gamma_{in} = S_{11} + \frac{S_{12}S_{21}\Gamma_L}{1 - S_{22}\Gamma_L}" />
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Output Reflection Coefficient</p>
            <BlockMath math="\Gamma_{out} = S_{22} + \frac{S_{12}S_{21}\Gamma_S}{1 - S_{11}\Gamma_S}" />
          </div>
        </div>

        <div className="space-y-4 my-6">
          <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-1">
              1. Operating Power Gain (<InlineMath math="G" />)
            </h3>
            <p className="text-sm text-slate-700 mb-2 leading-relaxed">
              The ratio of power delivered to the load (<InlineMath math="P_L" />) to power delivered to the amplifier input (<InlineMath math="P_{in}" />). Notice that <InlineMath math="G" /> is <strong>independent of <InlineMath math="\Gamma_S" /></strong>, but depends heavily on the load termination <InlineMath math="\Gamma_L" />:
            </p>
            <div className="flex justify-center my-3 overflow-x-auto">
              <BlockMath math="G = \frac{P_L}{P_{in}} = \frac{|S_{21}|^2 (1 - |\Gamma_L|^2)}{(1 - |\Gamma_{in}|^2) |1 - S_{22}\Gamma_L|^2}" />
            </div>
          </div>

          <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
            <h3 className="font-bold text-indigo-900 mb-1">
              2. Available Power Gain (<InlineMath math="G_A" />)
            </h3>
            <p className="text-sm text-slate-700 mb-2 leading-relaxed">
              The ratio of power available from the amplifier network (<InlineMath math="P_{avn}" />) to power available from the source (<InlineMath math="P_{avs}" />). Notice that <InlineMath math="G_A" /> is <strong>independent of <InlineMath math="\Gamma_L" /></strong>, but depends on the source termination <InlineMath math="\Gamma_S" />:
            </p>
            <div className="flex justify-center my-3 overflow-x-auto">
              <BlockMath math="G_A = \frac{P_{avn}}{P_{avs}} = \frac{|S_{21}|^2 (1 - |\Gamma_S|^2)}{(1 - |\Gamma_{out}|^2) |1 - S_{11}\Gamma_S|^2}" />
            </div>
          </div>

          <div className="p-5 bg-indigo-50/60 border border-emerald-200 rounded-xl">
            <h3 className="font-bold text-indigo-900 mb-1">
              3. Transducer Power Gain (<InlineMath math="G_T" />)
            </h3>
            <p className="text-sm text-slate-700 mb-2 leading-relaxed">
              The most fundamental measure in practice: the ratio of real power delivered to the load (<InlineMath math="P_L" />) to the maximum power available from the source generator (<InlineMath math="P_{avs}" />). It accounts for both input and output impedance mismatches:
            </p>
            <div className="flex justify-center my-3 overflow-x-auto">
              <BlockMath math="G_T = \frac{P_L}{P_{avs}} = \frac{|S_{21}|^2 (1 - |\Gamma_S|^2)(1 - |\Gamma_L|^2)}{|1 - \Gamma_S \Gamma_{in}|^2 |1 - S_{22}\Gamma_L|^2} = \frac{|S_{21}|^2 (1 - |\Gamma_S|^2)(1 - |\Gamma_L|^2)}{|(1 - S_{11}\Gamma_S)(1 - S_{22}\Gamma_L) - S_{12}S_{21}\Gamma_S\Gamma_L|^2}" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600">
          <strong>Unilateral Case (<InlineMath math="S_{12} \approx 0" />):</strong> When internal reverse device feedback is negligible, the transducer gain simplifies to the product of three independent gain components:
          <div className="flex justify-center my-2">
            <BlockMath math="G_{TU} = \frac{1 - |\Gamma_S|^2}{|1 - S_{11}\Gamma_S|^2} \cdot |S_{21}|^2 \cdot \frac{1 - |\Gamma_L|^2}{|1 - S_{22}\Gamma_L|^2} = G_S \cdot G_0 \cdot G_L" />
          </div>
        </div>
      </div>

      {/* 3. Stability Considerations & Stability Circles */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          3. Stability &amp; Stability Circles
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          Oscillation is possible if either the input or output port impedance has a negative real part. This corresponds to <InlineMath math="|\Gamma_{in}| > 1" /> or <InlineMath math="|\Gamma_{out}| > 1" />, respectively. Whether oscillation actually occurs depends on the source and load terminations presented to the transistor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              Unconditional Stability
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The network is unconditionally stable if <InlineMath math="|\Gamma_{in}| < 1" /> and <InlineMath math="|\Gamma_{out}| < 1" /> for <strong>all passive source and load terminations</strong> (<InlineMath math="|\Gamma_S| \le 1" /> and <InlineMath math="|\Gamma_L| \le 1" />). No passive impedance can induce oscillation.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              Conditional Stability (Potentially Unstable)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The network is conditionally stable if <InlineMath math="|\Gamma_{in}| < 1" /> and <InlineMath math="|\Gamma_{out}| < 1" /> only for a <strong>specific subset of passive terminations</strong>. Terminations inside the unstable domain will trigger oscillation.
            </p>
          </div>
        </div>

        <p className="mb-4 leading-relaxed text-slate-700">
          The boundary between the stable and unstable regions is determined by the threshold equations <InlineMath math="|\Gamma_{in}| = 1" /> and <InlineMath math="|\Gamma_{out}| = 1" />. When plotted on the Smith chart, these boundaries form <strong>Stability Circles</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-800 mb-2">Output Stability Circle (<InlineMath math="\Gamma_L" /> Plane)</h3>
            <p className="text-xs text-slate-500 mb-3">Sets boundary where <InlineMath math="|\Gamma_{in}| = 1" /></p>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500">Center:</span>
                <BlockMath math="C_L = \frac{(S_{22} - \Delta S_{11}^*)^*}{|S_{22}|^2 - |\Delta|^2}" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Radius:</span>
                <BlockMath math="R_L = \left| \frac{S_{12} S_{21}}{|S_{22}|^2 - |\Delta|^2} \right|" />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-800 mb-2">Input Stability Circle (<InlineMath math="\Gamma_S" /> Plane)</h3>
            <p className="text-xs text-slate-500 mb-3">Sets boundary where <InlineMath math="|\Gamma_{out}| = 1" /></p>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500">Center:</span>
                <BlockMath math="C_S = \frac{(S_{11} - \Delta S_{22}^*)^*}{|S_{11}|^2 - |\Delta|^2}" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Radius:</span>
                <BlockMath math="R_S = \left| \frac{S_{12} S_{21}}{|S_{11}|^2 - |\Delta|^2} \right|" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-900 mt-4">
          <strong>How to identify the stable region on the Smith Chart:</strong>
            <p className="mt-1 leading-relaxed">
              To identify the stable region, test the center of the Smith chart. For the output stability circle, set <InlineMath math="\Gamma_L = 0" />, giving <InlineMath math="|\Gamma_{in}| = |S_{11}|" />. For the input stability circle, set <InlineMath math="\Gamma_S = 0" />, giving <InlineMath math="|\Gamma_{out}| = |S_{22}|" />. If the corresponding magnitude is less than one, the center lies in the stable region; otherwise, it lies in the unstable region. The stable region is the side of the stability circle containing the tested center point.
            </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          4. Analytical Stability Criteria: Rollett (<InlineMath math="K-\Delta" />) &amp; Edwards-Sinsky (<InlineMath math="\mu" />)
        </h2>

        <p className="mb-4 leading-relaxed text-slate-700">
          Instead of graphically plotting stability circles, mathematical criteria provide exact numerical conditions to test for unconditional stability:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Rollett's Criterion (<InlineMath math="K-\Delta" /> Test)</h3>
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                A two-port network is unconditionally stable if and only if both conditions are simultaneously satisfied:
              </p>
              <div className="my-3">
                <BlockMath math="K = \frac{1 - |S_{11}|^2 - |S_{22}|^2 + |\Delta|^2}{2 |S_{12} S_{21}|} > 1" />
              </div>
              <div className="my-3 text-center">
                <BlockMath math="|\Delta| = |S_{11}S_{22} - S_{12}S_{21}| < 1" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              If <InlineMath math="K < 1" />, the amplifier is potentially unstable, regardless of the value of <InlineMath math="|\Delta|" />.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Edwards-Sinsky (<InlineMath math="\mu" /> Test)</h3>
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                A single parameter test that is both necessary and sufficient for unconditional stability:
              </p>
              <div className="my-3">
                <BlockMath math="\mu = \frac{1 - |S_{11}|^2}{|S_{22} - \Delta S_{11}^*| + |S_{12} S_{21}|} > 1" />
              </div>
              <div className="my-3">
                <BlockMath math="\mu' = \frac{1 - |S_{22}|^2}{|S_{11} - \Delta S_{22}^*| + |S_{12} S_{21}|} > 1" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              <strong>Geometric significance:</strong> <InlineMath math="\mu" /> measures the distance from the center of the Smith chart to the closest unstable point on the output stability circle. A larger <InlineMath math="\mu" /> indicates greater stability margin.
            </p>
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

export default MicrowaveAmplifierDesign;
