import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import WaveAnalysisVisualizer from "@/components/WaveAnalysisVisualizer";
import "./wave_analysis.css";

const WaveAnalysis: React.FC = () => {
  return (
    <div className="wave-container">
      <div className="page-title">PLANE WAVES — VISUAL & THEORY</div>

      <div className="figure-wrap">
        <WaveAnalysisVisualizer />
        <div className="figure-caption">
          (a) <b>E</b>, <b>H</b> versus <b>z</b> at <i>t = 0</i> and (b) <b>E</b>, <b>H</b> versus <b>t</b> at <i>z = 0</i>.
          For a conductor the green marker shows the <b>skin depth</b> \( \delta = 1/\alpha \).
        </div>
      </div>

      {/* Lossless dielectric */}
      <section className="topic">
        <h2>10.4 Plane Waves in Lossless Dielectrics</h2>
        <p>For a lossless dielectric, \( \sigma \approx 0 \), \( \epsilon = \epsilon_0 \epsilon_r \), \( \mu = \mu_0 \mu_r \).</p>
        <BlockMath math={`\\alpha = 0,\\quad \\beta = \\omega \\sqrt{\\mu\\,\\epsilon},\\quad
                          v_p = \\frac{\\omega}{\\beta} = \\frac{1}{\\sqrt{\\mu\\epsilon}},\\quad
                          \\lambda = \\frac{2\\pi}{\\beta}`} />
        <BlockMath math={`\\eta = \\sqrt{\\frac{\\mu}{\\epsilon}}\\ \\angle 0^\\circ`} />
        <p>Fields are in phase and mutually orthogonal:</p>
        <BlockMath math={`\\mathbf{E}(z,t) = E_0\\cos(\\omega t - \\beta z)\\,\\hat{\\mathbf{x}},\\qquad
                          \\mathbf{H}(z,t) = \\frac{E_0}{\\eta}\\cos(\\omega t - \\beta z)\\,\\hat{\\mathbf{y}}`} />
        <BlockMath math={`\\hat{\\mathbf{a}}_k = \\hat{\\mathbf{a}}_E \\times \\hat{\\mathbf{a}}_H`} />
      </section>

      {/* Free space */}
      <section className="topic">
        <h2>10.5 Plane Waves in Free Space</h2>
        <p>Set \( \\epsilon = \\epsilon_0,\\ \\mu = \\mu_0,\\ \\sigma=0\\).</p>
        <BlockMath math={`\\alpha = 0,\\quad \\beta = \\omega\\sqrt{\\mu_0\\epsilon_0} = \\frac{\\omega}{c},\\quad
                          v_p = c = \\frac{1}{\\sqrt{\\mu_0\\epsilon_0}}`} />
        <BlockMath math={`\\eta_0 = \\sqrt{\\frac{\\mu_0}{\\epsilon_0}} = 120\\pi \\ \\approx\\ 377\\ \\Omega`} />
        <BlockMath math={`\\mathbf{E} = E_0\\cos(\\omega t - \\beta z)\\,\\hat{\\mathbf{x}},\\qquad
                          \\mathbf{H} = \\frac{E_0}{\\eta_0}\\cos(\\omega t - \\beta z)\\,\\hat{\\mathbf{y}}`} />
      </section>

      {/* Good conductors */}
      <section className="topic">
        <h2>10.6 Plane Waves in Good Conductors</h2>
        <p>For a good conductor \( \\sigma \\gg \\omega\\epsilon \\):</p>
        <BlockMath math={`\\alpha = \\beta = \\sqrt{\\frac{\\pi f\\,\\mu\\,\\sigma}{2}}`} />
        <BlockMath math={`\\eta \\approx (1+j)\\sqrt{\\frac{\\omega\\mu}{2\\sigma}}\\ =\\ |\\eta|\\ \\angle 45^\\circ`} />
        <p>Thus <b>E leads H by 45°</b>, and the fields decay exponentially.</p>
        <BlockMath math={`\\mathbf{E}(z,t) = E_0\\,e^{-\\alpha z}\\cos(\\omega t - \\beta z)\\,\\hat{\\mathbf{x}},
                          \\qquad
                          \\mathbf{H}(z,t) = \\frac{E_0}{|\\eta|}\\,e^{-\\alpha z}\\cos(\\omega t - \\beta z - 45^\\circ)\\,\\hat{\\mathbf{y}}`} />
        <h3>Skin Depth</h3>
        <BlockMath math={`\\delta = \\frac{1}{\\alpha} = \\frac{1}{\\sqrt{\\pi f\\,\\mu\\,\\sigma/2}}`} />
        <p>At \( z=\\delta \), the amplitude reduces to \( E_0 e^{-1} \\approx 0.368 E_0 \).</p>
      </section>

      {/* Summary table */}
      <section className="topic">
        <h2>Summary — Useful Formulas</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Lossless Medium</th>
                <th>Free Space</th>
                <th>Good Conductor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Attenuation \(\\alpha\)</td>
                <td><InlineMath math="0" /></td>
                <td><InlineMath math="0" /></td>
                <td><InlineMath math="\\sqrt{\\pi f\\mu\\sigma/2}" /></td>
              </tr>
              <tr>
                <td>Phase const. \(\\beta\)</td>
                <td><InlineMath math="\\omega\\sqrt{\\mu\\epsilon}" /></td>
                <td><InlineMath math="\\omega/c" /></td>
                <td><InlineMath math="\\sqrt{\\pi f\\mu\\sigma/2}" /></td>
              </tr>
              <tr>
                <td>Impedance \(\\eta\)</td>
                <td><InlineMath math="\\sqrt{\\mu/\\epsilon}" /></td>
                <td><InlineMath math="\\sqrt{\\mu_0/\\epsilon_0}=377\\,\\Omega" /></td>
                <td><InlineMath math="(1+j)\\sqrt{\\omega\\mu/(2\\sigma)}" /></td>
              </tr>
              <tr>
                <td>Phase velocity \(v_p\)</td>
                <td><InlineMath math="1/\\sqrt{\\mu\\epsilon}" /></td>
                <td><InlineMath math="c" /></td>
                <td>—</td>
              </tr>
              <tr>
                <td>Wavelength \(\\lambda\)</td>
                <td><InlineMath math="2\\pi/\\beta" /></td>
                <td><InlineMath math="2\\pi/\\beta" /></td>
                <td>—</td>
              </tr>
              <tr>
                <td>Skin depth \(\\delta\)</td>
                <td>—</td>
                <td>—</td>
                <td><InlineMath math="1/\\alpha" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default WaveAnalysis;
