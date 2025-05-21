import './tow.css'; // Ensure the CSS file name and path are correct
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const WavesInGeneral: React.FC = () => {
  return (
    <div className="wave-container">
      {/* Title Section */}
      <div className="text-2xl font-extrabold uppercase text-center py-6 text-gray-900">
        Waves in General
      </div>
      {/* Description */}
      <div className="text-lg leading-relaxed mb-6">
        Waves are disturbances that transfer energy from one place to another. They can travel through different mediums such as solids, liquids, and gases, or even through a vacuum in the case of electromagnetic waves.
      </div>
      {/* Properties Section */}
      <div className="text-xl font-bold text-gray-900 mt-6 mb-4">
        Properties of Waves
      </div>
      <div className="text-lg leading-relaxed mb-6">
        Some common properties of waves include wavelength, frequency, amplitude, and speed. These properties determine the behavior and effects of waves in different scenarios.
      </div>
      <div className="text-lg leading-relaxed mb-6">
        <ul className="list-disc ml-6 mt-3 space-y-2">
          <li><b>Wavelength:</b> The distance between successive crests or troughs of a wave.</li>
          <li><b>Frequency:</b> The number of waves that pass a given point per unit of time.</li>
          <li><b>Amplitude:</b> The maximum displacement of points on a wave, which is often associated with the wave's energy.</li>
          <li><b>Speed:</b> The rate at which the wave propagates through a medium.</li>
        </ul>
      </div>
      {/* Types of Waves Section */}
      <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Types of Waves
      </div>
      <div className="text-lg leading-relaxed mb-6">
        Waves can be classified into various types based on their characteristics and the medium through which they propagate. Understanding the nature of waves is essential in various fields of science and engineering.
      </div>
      <div className="text-lg leading-relaxed mb-6">
        <ul className="list-disc ml-6 mt-3 space-y-2">
          <li><b>Mechanical Waves:</b> Waves that require a medium to travel through, such as sound waves and water waves.</li>
          <li><b>Electromagnetic Waves:</b> Waves that do not require a medium to travel through, such as light waves, radio waves, and X-rays.</li>
          <li><b>Transverse Waves:</b> Waves in which the particle displacement is perpendicular to the direction of wave propagation.</li>
          <li><b>Longitudinal Waves:</b> Waves in which the particle displacement is parallel to the direction of wave propagation.</li>
        </ul>
      </div>
      {/* Applications Section */}
      <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Applications of Waves
      </div>
      <div className="text-lg leading-relaxed mb-6">
        Waves play a crucial role in various applications across different fields. Some examples include:
        <ul className="list-disc ml-6 mt-3 space-y-2">
          <li>Communication systems, such as radio, television, and mobile phones, which rely on electromagnetic waves.</li>
          <li>Medical imaging techniques, such as ultrasound and X-rays, which use mechanical and electromagnetic waves.</li>
          <li>Seismology, where seismic waves are used to study the Earth's interior.</li>
          <li>Acoustics, which involves the study of sound waves and their interactions with different environments.</li>
        </ul>
      </div>
      {/* Simple Wave Example */}
      <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Example of a Simple Wave
      </div>
      <div className="text-lg leading-relaxed mb-6">
        A simple wave can be represented as a sine wave, which is a mathematical curve that describes a smooth periodic oscillation.
      </div>
      <div className="p-10 flex justify-center items-center">
        <iframe
          src="https://www.geogebra.org/material/iframe/id/nTeKMhr9"
          width="800"
          height="600"
          allowFullScreen
          style={{
            border: "1px solid #e4e4e4",
            borderRadius: "4px",
          }}
        ></iframe>
      </div>
      {/* Electromagnetic Wave Example */}
      <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Example of an Electromagnetic Wave
      </div>
      <div className="text-lg leading-relaxed mb-6">
        An electromagnetic wave consists of oscillating electric and magnetic fields that propagate through space.
      </div>
      <div className="p-10 flex justify-center items-center">
        <iframe
          src="https://www.geogebra.org/material/iframe/id/mc4vXsqF"
          width="800"
          height="600"
          allowFullScreen
          style={{
            border: "1px solid #e4e4e4",
            borderRadius: "4px",
          }}
        ></iframe>
      </div>
      {/* Wave Propagation in Lossy Dielectrics Section */}
      <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Wave Propagation in Lossy Dielectrics
      </div>
      <div className="text-lg leading-relaxed mb-6">
        In lossy dielectrics, electromagnetic waves experience attenuation due to the conductive properties of the medium. This results in a decrease in the amplitude of the wave as it propagates through the material.
      </div>
      <div className="text-lg leading-relaxed mb-6">
        The propagation of waves in lossy dielectrics can be described by the complex propagation constant, which accounts for both the attenuation and phase shift of the wave. The propagation constant is given by:
      </div>
      <div className="text-2xl">
        <BlockMath math="\gamma = \alpha + j\beta" />
      </div>
      <div className="text-lg leading-relaxed mb-6">
        where <InlineMath math="\alpha" /> is the attenuation constant and <InlineMath math="\beta" /> is the phase constant. The attenuation constant represents the rate at which the wave's amplitude decreases, while the phase constant represents the rate at which the phase of the wave changes.
      </div>
      <div className="text-lg leading-relaxed mb-6">
        The attenuation constant <InlineMath math="\alpha" /> and the phase constant <InlineMath math="\beta" /> can be calculated using the following formulas:
      </div>
      <div className="text-2xl">
        <BlockMath math="\alpha = \omega \sqrt{\frac{\mu \epsilon}{2}} \left[ \sqrt{1 + \left( \frac{\sigma}{\omega \epsilon} \right)^2} - 1 \right]^{1/2}" />
      </div>
      <div className="text-2xl">
        <BlockMath math="\beta = \omega \sqrt{\frac{\mu \epsilon}{2}} \left[ \sqrt{1 + \left( \frac{\sigma}{\omega \epsilon} \right)^2} + 1 \right]^{1/2}" />
      </div>
      <div className="text-lg leading-relaxed mb-6">
        where:
        <ul className="list-disc ml-6 mt-3 space-y-2">
          <li><InlineMath math="\omega" /> is the angular frequency</li>
          <li><InlineMath math="\mu" /> is the permeability of the medium</li>
          <li><InlineMath math="\epsilon" /> is the permittivity of the medium</li>
          <li><InlineMath math="\sigma" /> is the conductivity of the medium</li>
        </ul>
      </div>
      <div className="text-lg leading-relaxed mb-6">
        For example, consider a wave propagating through a lossy dielectric with the following properties:
        <ul className="list-disc ml-6 mt-3 space-y-2">
          <li>Angular frequency, <InlineMath math="\omega = 2\pi \times 10^9" /> rad/s</li>
          <li>Permeability, <InlineMath math="\mu = 4\pi \times 10^{-7}" /> H/m</li>
          <li>Permittivity, <InlineMath math="\epsilon = 8.85 \times 10^{-12}" /> F/m</li>
          <li>Conductivity, <InlineMath math="\sigma = 0.01" /> S/m</li>
        </ul>
      </div>
      <div className="text-lg leading-relaxed mb-6">
        Using the formulas for <InlineMath math="\alpha" /> and <InlineMath math="\beta" />, we can calculate the attenuation constant and phase constant for this wave.
      </div>
      <div className="text-lg leading-relaxed mb-6">
        The behavior of waves in lossy dielectrics is important in various applications, such as in the design of transmission lines, antennas, and other communication systems where signal loss needs to be minimized.
      </div>
    </div>
  );
};

export default WavesInGeneral;