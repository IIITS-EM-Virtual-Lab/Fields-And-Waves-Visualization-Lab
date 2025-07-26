import GaussLawMagnetismVisualizer from "@/components/GaussLawMagnetismVisualizer";
import { BlockMath } from "react-katex";

const GaussLawMagnestismPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Title Section */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-center py-8 text-gray-900">
        Gauss's Law for Magnetism
      </div>

      <div className="pb-10 sm:pb-20">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <GaussLawMagnetismVisualizer />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-8 sm:space-y-10 lg:space-y-12 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-800">
        {/* Introduction */}
        <div>
          Gauss's Law for Magnetism is one of Maxwell's equations that describes
          the behavior of magnetic fields. It fundamentally states that magnetic
          monopoles do not exist; in other words, there are no isolated
          "magnetic charges" analogous to electric charges.
        </div>

        {/* Section Title */}
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
          Gauss's Law for Magnetism in Differential and Integral Forms
        </div>

        {/* Description */}
        <div>
          The general statement of Gauss's Law for Magnetism can be expressed in
          both integral and differential forms.
        </div>

        {/* Integral Form */}
        <div className="space-y-4">
          <div className="font-bold text-lg sm:text-xl text-gray-900">Integral Form</div>
          <div className="overflow-x-auto">
            <div className="min-w-[300px] text-center">
              <BlockMath math="\oint_{S} \mathbf{B} \cdot d\mathbf{S} = 0" />
            </div>
          </div>
          <div className="text-gray-700">
            where:
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 mt-2">
              <li>
                <strong>S</strong> is any closed surface.
              </li>
              <li>
                <strong>B ⋅ dS</strong> represents the magnetic flux through an
                infinitesimal area dS on the surface.
              </li>
            </ul>
          </div>
        </div>

        {/* Differential Form */}
        <div className="space-y-4">
          <div className="font-bold text-lg sm:text-xl text-gray-900">
            Differential Form
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[300px] text-center">
              <BlockMath math="\nabla \cdot \mathbf{B} = 0" />
            </div>
          </div>
          <div className="text-gray-700 space-y-4">
            <div>
              where:
              <ul className="list-disc ml-4 sm:ml-6 space-y-1 mt-2">
                <li>
                  <strong>B</strong> is the magnetic field vector.
                </li>
                <li>
                  <strong>∇⋅B</strong> represents the divergence of the magnetic
                  field.
                </li>
              </ul>
            </div>
            <p>
              Gauss's Law for Magnetism, ∇⋅B = 0, is a fundamental principle of
              electromagnetism. It reinforces the continuous, loop-like nature of
              magnetic fields and the absence of magnetic monopoles. This law has
              been confirmed by all experimental evidence to date and is crucial
              to understanding magnetic fields and their behavior in various
              physical contexts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaussLawMagnestismPage;