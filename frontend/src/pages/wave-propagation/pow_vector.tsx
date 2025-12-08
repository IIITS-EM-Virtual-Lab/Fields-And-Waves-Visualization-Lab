import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./pow_vector.css";
import PoyntingVisualizer from "../../components/PoyntingVisualizer";

const PowVector: React.FC = () => {
  return (
    <div className="pow-container hc">
      <div className="pow-title">Power and the Poynting Vector</div>

      {/* Maxwell curl equations */}
      <div className="pow-subtitle">Starting from Maxwell’s Equations</div>
      <div className="pow-equation">
        <BlockMath math={"\\nabla \\times \\mathbf{E} = -\\mu\\,\\dfrac{\\partial \\mathbf{H}}{\\partial t}"} />
        <BlockMath math={"\\nabla \\times \\mathbf{H} = \\sigma\\,\\mathbf{E} + \\varepsilon\\,\\dfrac{\\partial \\mathbf{E}}{\\partial t}"} />
      </div>

      {/* Poynting theorem (differential form) */}
      <div className="pow-subtitle">Poynting’s Theorem (Local Form)</div>
      <div className="pow-text">
        Dot the second equation with <InlineMath math={"\\mathbf{E}"} /> and the first with{" "}
        <InlineMath math={"\\mathbf{H}"} />, use{" "}
        <InlineMath math={"\\nabla\\cdot(\\mathbf{A}\\times\\mathbf{B}) = \\mathbf{B}\\cdot(\\nabla\\times\\mathbf{A}) - \\mathbf{A}\\cdot(\\nabla\\times\\mathbf{B})"} />, and collect terms:
      </div>
      <div className="pow-equation">
        <BlockMath math={
          "\\nabla\\cdot(\\mathbf{E}\\times\\mathbf{H}) = -\\,\\dfrac{\\partial}{\\partial t}\\left(\\tfrac{1}{2}\\,\\varepsilon E^{2} + \\tfrac{1}{2}\\,\\mu H^{2}\\right) - \\sigma E^{2}"
        } />
      </div>
      <div className="pow-text">
        LHS: divergence of power flow <InlineMath math={"\\mathbf{S}=\\mathbf{E}\\times\\mathbf{H}"} />.  
        RHS: decrease of stored energy densities <InlineMath math={"u_e=\\tfrac{1}{2}\\varepsilon E^{2},\\; u_m=\\tfrac{1}{2}\\mu H^{2}"} /> and Ohmic loss <InlineMath math={"\\sigma E^{2}"} />.
      </div>

      {/* Integral form */}
      <div className="pow-subtitle">Integral (Global) Form</div>
      <div className="pow-equation">
        <BlockMath math={
          "\\oint_S (\\mathbf{E}\\times\\mathbf{H})\\cdot d\\mathbf{S} = -\\dfrac{d}{dt}\\int_V \\left(\\tfrac{1}{2}\\varepsilon E^{2} + \\tfrac{1}{2}\\mu H^{2}\\right) dV - \\int_V \\sigma E^{2} dV"
        } />
      </div>
      <div className="pow-text">
        Total power leaving a volume equals the rate of decrease of stored field energy minus Ohmic power dissipated.
      </div>

      {/* Poynting vector definitions */}
      <div className="pow-subtitle">Poynting Vector</div>
      <div className="pow-equation">
        <BlockMath math={"\\boxed{\\;\\mathbf{S} = \\mathbf{E}\\times\\mathbf{H}\\;}"} />
      </div>
      <div className="pow-text">
        Instantaneous power density (W/m²). For time-harmonic fields:
      </div>
      <div className="pow-equation">
        <BlockMath math={"\\boxed{\\;\\langle \\mathbf{S} \\rangle = \\tfrac{1}{2}\\,\\Re\\{\\mathbf{E}\\times\\mathbf{H}^*\\}\\;}"} />
      </div>

      {/* Lossy uniform plane wave */}
      <div className="pow-subtitle">Uniform Plane Wave in a Lossy Medium</div>
      <div className="pow-text">
        Propagation along +z, attenuation <InlineMath math={"\\alpha"} />, complex impedance <InlineMath math={"\\eta = |\\eta|\\angle\\theta_{\\eta}"} />:
      </div>
      <div className="pow-equation">
        <BlockMath math={"\\mathbf{E}(z,t)=E_0 e^{-\\alpha z}\\cos(\\omega t-\\beta z)\\,\\mathbf{a}_x"} />
        <BlockMath math={"\\mathbf{H}(z,t)=\\dfrac{E_0}{|\\eta|} e^{-\\alpha z}\\cos(\\omega t-\\beta z-\\theta_{\\eta})\\,\\mathbf{a}_y"} />
      </div>
      <div className="pow-text">Time-average Poynting vector:</div>
      <div className="pow-equation">
        <BlockMath math={"\\boxed{\\;\\langle\\mathbf{S}\\rangle(z)=\\dfrac{E_0^{2}}{2|\\eta|}\\,e^{-2\\alpha z}\\cos\\theta_{\\eta}\\,\\mathbf{a}_z\\;}"} />
      </div>

      {/* Visual */}
      <div className="pow-subtitle">Interactive Visual</div>
      <div className="pow-text">
        Adjust <b>E₀</b>, <b>f</b>, <b>α</b>, <b>|η|</b>, <b>θη</b>, and <b>σ</b>. Green = instantaneous <InlineMath math={"\\mathbf{S}"} />, purple = ⟨<InlineMath math={"\\mathbf{S}"} />⟩. Bars show <InlineMath math={"u_e"} />, <InlineMath math={"u_m"} />, and <InlineMath math={"\\sigma E^2"} /> at z=0.
      </div>

      <div className="pow-visual">
        <PoyntingVisualizer />
      </div>
    </div>
  );
};

export default PowVector;
