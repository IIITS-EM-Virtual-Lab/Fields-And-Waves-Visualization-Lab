import './wave_analysis.css'; // Ensure the CSS file name and path are correct
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const WaveAnalysis: React.FC = () => {
  return (
    <div className="wave-container">
      {/* Title Section */}
      <div className="text-2xl font-extrabold uppercase text-center py-6 text-gray-900">
        Wave Analysis
      </div>
      {/* Plane Waves in Lossless Dielectrics Section */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Plane Waves in Lossless Dielectrics
        </div>
        <div className="text-lg leading-relaxed mb-6">
          In lossless dielectrics, the conductivity <InlineMath math="\sigma" /> is zero, which means there is no energy loss as the wave propagates through the medium. The wave equation in a lossless dielectric is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\nabla^2 \mathbf{E} - \mu \epsilon \frac{\partial^2 \mathbf{E}}{\partial t^2} = 0" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\mathbf{E}" /> is the electric field, <InlineMath math="\mu" /> is the permeability, and <InlineMath math="\epsilon" /> is the permittivity of the medium.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The solution to this wave equation is a plane wave of the form:
        </div>
        <div className="text-2xl">
          <BlockMath math="\mathbf{E}(z, t) = \mathbf{E}_0 e^{j(\omega t - \beta z)}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\mathbf{E}_0" /> is the amplitude of the electric field, <InlineMath math="\omega" /> is the angular frequency, and <InlineMath math="\beta" /> is the phase constant.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For example, consider a plane wave with an angular frequency of <InlineMath math="\omega = 2\pi \times 10^9" /> rad/s propagating through a lossless dielectric with a permittivity of <InlineMath math="\epsilon = 8.85 \times 10^{-12}" /> F/m and a permeability of <InlineMath math="\mu = 4\pi \times 10^{-7}" /> H/m. The phase constant <InlineMath math="\beta" /> can be calculated as:
        </div>
        <div className="text-2xl">
          <BlockMath math="\beta = \omega \sqrt{\mu \epsilon}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Substituting the values, we get:
        </div>
        <div className="text-2xl">
          <BlockMath math="\beta = 2\pi \times 10^9 \times \sqrt{4\pi \times 10^{-7} \times 8.85 \times 10^{-12}}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          This results in a phase constant of approximately <InlineMath math="\beta \approx 188.5" /> rad/m.
        </div>
      </div>
      {/* Plane Waves in Free Space Section */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Plane Waves in Free Space
        </div>
        <div className="text-lg leading-relaxed mb-6">
          In free space, the permittivity <InlineMath math="\epsilon" /> is <InlineMath math="\epsilon_0" /> and the permeability <InlineMath math="\mu" /> is <InlineMath math="\mu_0" />. The wave equation in free space is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\nabla^2 \mathbf{E} - \mu_0 \epsilon_0 \frac{\partial^2 \mathbf{E}}{\partial t^2} = 0" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The solution to this wave equation is a plane wave of the form:
        </div>
        <div className="text-2xl">
          <BlockMath math="\mathbf{E}(z, t) = \mathbf{E}_0 e^{j(\omega t - \beta z)}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\beta = \frac{\omega}{c}" /> and <InlineMath math="c = \frac{1}{\sqrt{\mu_0 \epsilon_0}}" /> is the speed of light in free space.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For example, consider a plane wave with an angular frequency of <InlineMath math="\omega = 2\pi \times 10^9" /> rad/s propagating through free space. The speed of light <InlineMath math="c" /> is approximately <InlineMath math="3 \times 10^8" /> m/s. The phase constant <InlineMath math="\beta" /> can be calculated as:
        </div>
        <div className="text-2xl">
          <BlockMath math="\beta = \frac{\omega}{c}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Substituting the values, we get:
        </div>
        <div className="text-2xl">
          <BlockMath math="\beta = \frac{2\pi \times 10^9}{3 \times 10^8}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          This results in a phase constant of approximately <InlineMath math="\beta \approx 20.94" /> rad/m.
        </div>
      </div>
      {/* Plane Waves in Good Conductors Section */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Plane Waves in Good Conductors
        </div>
        <div className="text-lg leading-relaxed mb-6">
          In good conductors, the conductivity <InlineMath math="\sigma" /> is very high. The wave equation in a good conductor is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\nabla^2 \mathbf{E} - \mu \epsilon \frac{\partial^2 \mathbf{E}}{\partial t^2} = \mu \sigma \frac{\partial \mathbf{E}}{\partial t}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The solution to this wave equation is a plane wave of the form:
        </div>
        <div className="text-2xl">
          <BlockMath math="\mathbf{E}(z, t) = \mathbf{E}_0 e^{-\alpha z} e^{j(\omega t - \beta z)}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\alpha" /> is the attenuation constant and <InlineMath math="\beta" /> is the phase constant. For good conductors, these constants are given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\alpha = \beta = \sqrt{\frac{\pi f \mu \sigma}{2}}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="f" /> is the frequency of the wave.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For example, consider a plane wave with a frequency of <InlineMath math="f = 10^9" /> Hz propagating through a good conductor with a conductivity of <InlineMath math="\sigma = 5.8 \times 10^7" /> S/m, a permeability of <InlineMath math="\mu = 4\pi \times 10^{-7}" /> H/m, and a permittivity of <InlineMath math="\epsilon = 8.85 \times 10^{-12}" /> F/m. The attenuation constant <InlineMath math="\alpha" /> and phase constant <InlineMath math="\beta" /> can be calculated as:
        </div>
        <div className="text-2xl">
          <BlockMath math="\alpha = \beta = \sqrt{\frac{\pi \times 10^9 \times 4\pi \times 10^{-7} \times 5.8 \times 10^7}{2}}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          This results in an attenuation constant and phase constant of approximately <InlineMath math="\alpha = \beta \approx 1.37 \times 10^4" /> m<sup>-1</sup>.
        </div>
      </div>
    </div>
  );
};

export default WaveAnalysis;