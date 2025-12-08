import "./tow.css";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import WavesLab from "../../components/WavesLab";

const WavesInGeneral: React.FC = () => {
  return (
    <div className="wave-container wave-container--wide hc">
      <div className="wave-title">Waves in General</div>

      <div className="wave-text">
        A wave is a disturbance that propagates while carrying energy but not matter.
        Electromagnetic (EM) waves are transverse and can travel in free space without a material medium.
      </div>

      <div className="wave-visual">
        <WavesLab />
      </div>

      <div className="wave-subtitle">General Form (Sinusoidal Plane Wave)</div>
      <div className="wave-text">A wave traveling in the +z direction is represented as:</div>
      <div className="wave-equation">
        <BlockMath math={"E(z,t) = E_0 \\cos(\\omega t - \\beta z + \\phi)"} />
      </div>

      <div className="wave-text">
        <b>Parameters:</b>
        <ul className="wave-list">
          <li><InlineMath math={"E_0"} /> — amplitude</li>
          <li><InlineMath math={"\\omega = 2\\pi f"} /> — angular frequency (rad/s)</li>
          <li><InlineMath math={"\\beta = \\tfrac{2\\pi}{\\lambda}"} /> — phase constant (rad/m)</li>
          <li><InlineMath math={"\\phi"} /> — phase shift</li>
          <li><InlineMath math={"v_p = \\tfrac{\\omega}{\\beta}"} /> — phase velocity</li>
        </ul>
      </div>

      <div className="wave-subtitle">Electromagnetic Plane Wave Relations</div>
      <div className="wave-text">
        For a uniform plane electromagnetic wave in an isotropic medium:
      </div>
      <div className="wave-equation">
        <BlockMath math={"\\eta = \\sqrt{\\tfrac{\\mu}{\\varepsilon}}\\quad\\text{(intrinsic impedance)}"} />
        <BlockMath math={"\\lVert \\mathbf{E} \\rVert = \\eta\\, \\lVert \\mathbf{H} \\rVert"} />
        <BlockMath math={"\\langle \\mathbf{S} \\rangle = \\tfrac{1}{2}\\,\\Re\\{\\mathbf{E} \\times \\mathbf{H}^*\\}"} />
      </div>

      <div className="wave-subtitle">Standing Wave</div>
      <div className="wave-text">Superposition of equal-amplitude waves in opposite directions results in:</div>
      <div className="wave-equation">
        <BlockMath math={"y(z,t) = 2A\\,\\sin(\\omega t)\\,\\cos(k z)"} />
        <BlockMath math={"\\text{Nodes at } \\cos(kz)=0 \\Rightarrow kz = \\tfrac{(2n+1)\\pi}{2}"} />
      </div>

      <div className="wave-subtitle">Transverse vs Longitudinal Waves</div>
      <div className="wave-text">
        <ul className="wave-list">
          <li><b>Transverse:</b> oscillations ⟂ direction of propagation (e.g., EM waves).</li>
          <li><b>Longitudinal:</b> oscillations ∥ direction of propagation (e.g., sound waves).</li>
        </ul>
      </div>

      <div className="wave-subtitle">Attenuation in a Lossy Medium</div>
      <div className="wave-text">
        With complex propagation constant <InlineMath math={"\\gamma = \\alpha + j\\beta"} />:
      </div>
      <div className="wave-equation">
        <BlockMath math={"E(z,t) = E_0\\, e^{-\\alpha z}\\, \\cos(\\omega t - \\beta z)"} />
      </div>
    </div>
  );
};

export default WavesInGeneral;
