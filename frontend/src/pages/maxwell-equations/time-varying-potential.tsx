import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import './time_varying_potential.css';

const TimeVaryingPotential: React.FC = () => {
  return (
    <div className="time-varying-potential">
      <h1>Time-Varying Potential</h1>

      <p>
        The concept of time-varying potentials is a cornerstone of Maxwell's equations, as it provides the foundation for understanding
        electromagnetic wave propagation. According to Sadiku's <i>Elements of Electromagnetics</i>, time-varying potentials are directly
        linked to the dynamic behavior of electric and magnetic fields.
      </p>

      <p>
        In Maxwell's equations, the electric and magnetic fields are expressed in terms of the scalar potential <Latex>{`\\( \phi \\)`}</Latex>
        and the vector potential <Latex>{`\\( \mathbf{A} \\)`}</Latex>:
      </p>

      <p className="formulas">
        <Latex>{`\\( \mathbf{E} = -\\nabla \\phi - \\frac{\\partial \\mathbf{A}}{\\partial t} \\)`}</Latex>
        <br />
        <Latex>{`\\( \mathbf{B} = \\nabla \\times \\mathbf{A} \\)`}</Latex>
      </p>

      <p>
        This inclusion of time-varying potentials enables the prediction of electromagnetic waves, which propagate through space at
        the speed of light—an achievement that unified electricity and magnetism in a single theoretical framework.
      </p>

      <p>
        Sadiku emphasizes that these potentials have physical significance, describing the dynamic coupling between the fields,
        essential for understanding electromagnetic radiation and wave phenomena.
      </p>
    </div>
  );
};

export default TimeVaryingPotential;