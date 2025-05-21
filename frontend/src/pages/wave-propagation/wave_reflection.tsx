
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './wave_reflection.css'; // Ensure the CSS file name and path are correct

const WaveReflection: React.FC = () => {
  return (
    <div className="wave-container">
      {/* Title Section */}
      <div className="text-2xl font-extrabold uppercase text-center py-6 text-gray-900">
        Wave Reflection in Electromagnetism
      </div>
      {/* Reflection of a Plane Wave at Normal Incidence Section */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Reflection of a Plane Wave at Normal Incidence
        </div>
        <div className="text-lg leading-relaxed mb-6">
          When a plane wave is incident normally (perpendicularly) on the boundary between two different media, part of the wave is reflected back into the original medium, and part is transmitted into the second medium. The reflection coefficient <InlineMath math="\Gamma" /> and transmission coefficient <InlineMath math="T" /> can be used to describe the amplitudes of the reflected and transmitted waves.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The reflection coefficient at normal incidence is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\Gamma = \frac{Z_2 - Z_1}{Z_2 + Z_1}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="Z_1" /> and <InlineMath math="Z_2" /> are the impedances of the first and second media, respectively.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The transmission coefficient at normal incidence is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="T = \frac{2Z_2}{Z_2 + Z_1}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For example, consider an electromagnetic wave traveling from air (impedance <InlineMath math="Z_1 \approx 377 \, \Omega" />) to glass (impedance <InlineMath math="Z_2 \approx 50 \, \Omega" />). The reflection coefficient is:
        </div>
        <div className="text-2xl">
          <BlockMath math="\Gamma = \frac{50 - 377}{50 + 377} \approx -0.764" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          This means that approximately 76.4% of the wave's amplitude is reflected back into the air. The transmission coefficient is:
        </div>
        <div className="text-2xl">
          <BlockMath math="T = \frac{2 \times 50}{50 + 377} \approx 0.236" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          This means that approximately 23.6% of the wave's amplitude is transmitted into the glass.
        </div>
      </div>
      {/* Reflection of a Plane Wave at Oblique Incidence Section */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Reflection of a Plane Wave at Oblique Incidence
        </div>
        <div className="text-lg leading-relaxed mb-6">
          When a plane wave is incident obliquely (at an angle) on the boundary between two different media, the reflection and transmission coefficients depend on the angle of incidence and the polarization of the wave. The incident, reflected, and transmitted waves follow Snell's law:
        </div>
        <div className="text-2xl">
          <BlockMath math="\frac{\sin \theta_i}{\sin \theta_t} = \frac{v_1}{v_2}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\theta_i" /> is the angle of incidence, <InlineMath math="\theta_t" /> is the angle of transmission, and <InlineMath math="v_1" /> and <InlineMath math="v_2" /> are the velocities of the wave in the first and second media, respectively.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For perpendicular (s-polarized) waves, the reflection coefficient is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\Gamma_\perp = \frac{Z_2 \cos \theta_i - Z_1 \cos \theta_t}{Z_2 \cos \theta_i + Z_1 \cos \theta_t}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For parallel (p-polarized) waves, the reflection coefficient is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\Gamma_\parallel = \frac{Z_2 \cos \theta_t - Z_1 \cos \theta_i}{Z_2 \cos \theta_t + Z_1 \cos \theta_i}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The transmission coefficients for perpendicular and parallel polarizations are given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="T_\perp = \frac{2Z_2 \cos \theta_i}{Z_2 \cos \theta_i + Z_1 \cos \theta_t}" />
        </div>
        <div className="text-2xl">
          <BlockMath math="T_\parallel = \frac{2Z_2 \cos \theta_i}{Z_2 \cos \theta_t + Z_1 \cos \theta_i}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For example, consider an electromagnetic wave traveling from air to glass with an angle of incidence of 45 degrees. The reflection and transmission coefficients can be calculated using the above formulas.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Let's calculate the reflection and transmission coefficients for s-polarized waves. Assume the impedances are the same as before: <InlineMath math="Z_1 \approx 377 \, \Omega" /> for air and <InlineMath math="Z_2 \approx 50 \, \Omega" /> for glass.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Using Snell's law, we find the angle of transmission <InlineMath math="\theta_t" />:
        </div>
        <div className="text-2xl">
          <BlockMath math="\sin \theta_t = \frac{v_1}{v_2} \sin \theta_i" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Given <InlineMath math="v_1 \approx 3 \times 10^8 \, \text{m/s}" /> (speed of light in air) and <InlineMath math="v_2 \approx 2 \times 10^8 \, \text{m/s}" /> (approximate speed of light in glass), we get:
        </div>
        <div className="text-2xl">
          <BlockMath math="\sin \theta_t = \frac{3 \times 10^8}{2 \times 10^8} \sin 45^\circ \approx 1.06 \times 0.707 \approx 0.75" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Therefore, <InlineMath math="\theta_t \approx \sin^{-1}(0.75) \approx 48.6^\circ" />.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Now, we can calculate the reflection coefficient for s-polarized waves:
        </div>
        <div className="text-2xl">
          <BlockMath math="\Gamma_\perp = \frac{50 \cos 45^\circ - 377 \cos 48.6^\circ}{50 \cos 45^\circ + 377 \cos 48.6^\circ}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Using <InlineMath math="\cos 45^\circ \approx 0.707" /> and <InlineMath math="\cos 48.6^\circ \approx 0.662" />, we get:
        </div>
        <div className="text-2xl">
          <BlockMath math="\Gamma_\perp \approx \frac{50 \times 0.707 - 377 \times 0.662}{50 \times 0.707 + 377 \times 0.662} \approx \frac{35.35 - 249.74}{35.35 + 249.74} \approx \frac{-214.39}{285.09} \approx -0.752" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Therefore, the reflection coefficient for s-polarized waves is approximately <InlineMath math="-0.752" />.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Similarly, the transmission coefficient for s-polarized waves is:
        </div>
        <div className="text-2xl">
          <BlockMath math="T_\perp = \frac{2 \times 50 \times 0.707}{50 \times 0.707 + 377 \times 0.662} \approx \frac{70.7}{285.09} \approx 0.248" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Therefore, the transmission coefficient for s-polarized waves is approximately <InlineMath math="0.248" />.
        </div>
      </div>
    </div>
  );
};

export default WaveReflection;