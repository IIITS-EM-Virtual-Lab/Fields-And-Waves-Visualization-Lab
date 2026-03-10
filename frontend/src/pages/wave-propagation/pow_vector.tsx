import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import PoyntingVisualizer from "../../components/PoyntingVisualizer";

const PowVector: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      
      {/* Page Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Power and the Poynting Vector
      </div>

      {/* Interactive Demo Section */}
      <div className="pb-10">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center">
          <PoyntingVisualizer />
        </div>
      </div>

      {/* 1) Maxwell curl equations */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Starting from Maxwell’s Equations
        </h2>
        
        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\nabla \\times \\mathbf{E} = -\\mu\\,\\dfrac{\\partial \\mathbf{H}}{\\partial t}"} />
          <BlockMath math={"\\nabla \\times \\mathbf{H} = \\sigma\\,\\mathbf{E} + \\varepsilon\\,\\dfrac{\\partial \\mathbf{E}}{\\partial t}"} />
        </div>
      </div>

      {/* 2) Poynting theorem (differential form) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Poynting’s Theorem (Local Form)
        </h2>

        <p className="mb-3">
          Dot the second equation with <InlineMath math={"\\mathbf{E}"} /> and the first with{" "}
          <InlineMath math={"\\mathbf{H}"} />, use{" "}
          <InlineMath math={"\\nabla\\cdot(\\mathbf{A}\\times\\mathbf{B}) = \\mathbf{B}\\cdot(\\nabla\\times\\mathbf{A}) - \\mathbf{A}\\cdot(\\nabla\\times\\mathbf{B})"} />, and collect terms:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={
            "\\nabla\\cdot(\\mathbf{E}\\times\\mathbf{H}) = -\\,\\dfrac{\\partial}{\\partial t}\\left(\\tfrac{1}{2}\\,\\varepsilon E^{2} + \\tfrac{1}{2}\\,\\mu H^{2}\\right) - \\sigma E^{2}"
          } />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <p className="font-semibold mb-2">Terms Breakdown:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <b>LHS:</b> divergence of power flow <InlineMath math={"\\mathbf{S}=\\mathbf{E}\\times\\mathbf{H}"} />.
            </li>
            <li>
              <b>RHS:</b> decrease of stored energy densities <InlineMath math={"u_e=\\tfrac{1}{2}\\varepsilon E^{2},\\; u_m=\\tfrac{1}{2}\\mu H^{2}"} /> and Ohmic loss <InlineMath math={"\\sigma E^{2}"} />.
            </li>
          </ul>
        </div>
      </div>

      {/* 3) Integral form */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Integral (Global) Form
        </h2>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={
            "\\oint_S (\\mathbf{E}\\times\\mathbf{H})\\cdot d\\mathbf{S} = -\\dfrac{d}{dt}\\int_V \\left(\\tfrac{1}{2}\\varepsilon E^{2} + \\tfrac{1}{2}\\mu H^{2}\\right) dV - \\int_V \\sigma E^{2} dV"
          } />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <span className="font-semibold">Physical implication:</span> Total power leaving a volume equals the rate of decrease of stored field energy minus Ohmic power dissipated.
        </div>
      </div>

      {/* 4) Poynting vector definitions */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Poynting Vector
        </h2>

        <p className="mb-3">
          Instantaneous power density (W/m²):
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\;\\mathbf{S} = \\mathbf{E}\\times\\mathbf{H}\\;"} />
        </div>

        <p className="mt-4 font-medium">For time-harmonic fields:</p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\;\\langle \\mathbf{S} \\rangle = \\tfrac{1}{2}\\,\\Re\\{\\mathbf{E}\\times\\mathbf{H}^*\\}\\;"} />
        </div>
      </div>

      {/* 5) Lossy uniform plane wave */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Uniform Plane Wave in a Lossy Medium
        </h2>

        <p className="mb-3">
          Propagation along +z, attenuation <InlineMath math={"\\alpha"} />, complex impedance <InlineMath math={"\\eta = |\\eta|\\angle\\theta_{\\eta}"} />:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\mathbf{E}(z,t)=E_0 e^{-\\alpha z}\\cos(\\omega t-\\beta z)\\,\\mathbf{a}_x"} />
          <BlockMath math={"\\mathbf{H}(z,t)=\\dfrac{E_0}{|\\eta|} e^{-\\alpha z}\\cos(\\omega t-\\beta z-\\theta_{\\eta})\\,\\mathbf{a}_y"} />
        </div>

        <p className="mt-4 font-medium">Time-average Poynting vector:</p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\;\\langle\\mathbf{S}\\rangle(z)=\\dfrac{E_0^{2}}{2|\\eta|}\\,e^{-2\\alpha z}\\cos\\theta_{\\eta}\\,\\mathbf{a}_z\\;"} />
        </div>
      </div>

    </div>
  );
};

export default PowVector;