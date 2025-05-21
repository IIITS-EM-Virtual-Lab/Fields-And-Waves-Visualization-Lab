import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './pow_vector.css'; // Ensure the CSS file name and path are correct

const PowVector: React.FC = () => {
  return (
    <div className="pow-container">
      {/* Title Section */}
      <div className="text-2xl font-extrabold uppercase text-center py-6 text-gray-900">
        Power and the Poynting Vector
      </div>
      {/* Power Section */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Power
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Power is the rate at which energy is transferred or converted. In the context of electromagnetic waves, power is the amount of energy transferred per unit time by the wave. The power <InlineMath math="P" /> can be calculated using the formula:
        </div>
        <div className="text-2xl">
          <BlockMath math="P = \frac{dW}{dt}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="W" /> is the energy and <InlineMath math="t" /> is the time.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          In electrical circuits, power can also be calculated using the voltage <InlineMath math="V" /> and current <InlineMath math="I" />:
        </div>
        <div className="text-2xl">
          <BlockMath math="P = VI" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For example, consider an electromagnetic wave transferring energy at a rate of 100 Joules per second. The power of the wave is:
        </div>
        <div className="text-2xl">
          <BlockMath math="P = 100 \, \text{W}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          Another example is a circuit with a voltage of 10 volts and a current of 2 amperes. The power in the circuit is:
        </div>
        <div className="text-2xl">
          <BlockMath math="P = 10 \, \text{V} \times 2 \, \text{A} = 20 \, \text{W}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          In the context of electromagnetic waves, power density is often used. Power density is the power per unit area and is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="S = \frac{P}{A}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="S" /> is the power density and <InlineMath math="A" /> is the area.
        </div>
      </div>
      {/* Poynting Vector Section */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Poynting Vector
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The Poynting vector represents the directional energy flux (the rate of energy transfer per unit area) of an electromagnetic field. It is defined as the cross product of the electric field <InlineMath math="\mathbf{E}" /> and the magnetic field <InlineMath math="\mathbf{H}" />:
        </div>
        <div className="text-2xl">
          <BlockMath math="\mathbf{S} = \mathbf{E} \times \mathbf{H}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\mathbf{S}" /> is the Poynting vector.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The magnitude of the Poynting vector gives the power per unit area carried by the wave. The direction of the Poynting vector indicates the direction of energy propagation.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For example, consider an electromagnetic wave with an electric field <InlineMath math="\mathbf{E} = 50 \, \text{V/m}" /> and a magnetic field <InlineMath math="\mathbf{H} = 0.1 \, \text{A/m}" />. The Poynting vector is:
        </div>
        <div className="text-2xl">
          <BlockMath math="\mathbf{S} = 50 \, \text{V/m} \times 0.1 \, \text{A/m} = 5 \, \text{W/m}^2" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          This means that the wave carries 5 watts of power per square meter in the direction of the Poynting vector.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The Poynting vector is crucial in understanding how electromagnetic waves transport energy through space. It is used in various applications, including wireless communication, antenna design, and energy harvesting.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          The time-averaged Poynting vector, also known as the average power density, is given by:
        </div>
        <div className="text-2xl">
          <BlockMath math="\langle \mathbf{S} \rangle = \frac{1}{2} \text{Re} (\mathbf{E} \times \mathbf{H}^*)" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\mathbf{H}^*" /> is the complex conjugate of the magnetic field.
        </div>
        <div className="text-lg leading-relaxed mb-6">
          For a plane wave propagating in the z-direction, the Poynting vector can be simplified to:
        </div>
        <div className="text-2xl">
          <BlockMath math="\mathbf{S} = \frac{1}{\eta} |\mathbf{E}|^2 \hat{z}" />
        </div>
        <div className="text-lg leading-relaxed mb-6">
          where <InlineMath math="\eta" /> is the intrinsic impedance of the medium and <InlineMath math="\hat{z}" /> is the unit vector in the z-direction.
        </div>
      </div>
    </div>
  );
};

export default PowVector;