import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

const TimeVaryingPotential: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-center py-8 text-gray-900">
        Time-Varying Potential
      </div>

      <div className="space-y-6 sm:space-y-8 text-sm sm:text-base lg:text-lg leading-relaxed">
        <p>
          The concept of time-varying potentials is a cornerstone of Maxwell's equations, as it provides the foundation for understanding
          electromagnetic wave propagation. According to Sadiku's <i>Elements of Electromagnetics</i>, time-varying potentials are directly
          linked to the dynamic behavior of electric and magnetic fields.
        </p>

        <div className="space-y-4">
          <p>
            In Maxwell's equations, the electric and magnetic fields are expressed in terms of the scalar potential{' '}
            <span className="overflow-x-auto inline-block">
              <Latex>{`\\( \\phi \\)`}</Latex>
            </span>{' '}
            and the vector potential{' '}
            <span className="overflow-x-auto inline-block">
              <Latex>{`\\( \\mathbf{A} \\)`}</Latex>
            </span>:
          </p>

          <div className="space-y-4 text-center">
            <div className="overflow-x-auto">
              <div className="min-w-[300px] text-base sm:text-lg lg:text-xl">
                <Latex>{`\\( \\mathbf{E} = -\\nabla \\phi - \\frac{\\partial \\mathbf{A}}{\\partial t} \\)`}</Latex>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[200px] text-base sm:text-lg lg:text-xl">
                <Latex>{`\\( \\mathbf{B} = \\nabla \\times \\mathbf{A} \\)`}</Latex>
              </div>
            </div>
          </div>
        </div>

        <p>
          This inclusion of time-varying potentials enables the prediction of electromagnetic waves, which propagate through space at
          the speed of light—an achievement that unified electricity and magnetism in a single theoretical framework.
        </p>

        <p>
          Sadiku emphasizes that these potentials have physical significance, describing the dynamic coupling between the fields,
          essential for understanding electromagnetic radiation and wave phenomena.
        </p>
      </div>
    </div>
  );
};

export default TimeVaryingPotential;