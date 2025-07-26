import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";
import FaradayVisualizer from "@/components/FaradayLawVisualizer";

const FaradayLawPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Title Section */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-center py-8 text-gray-900">
        Faraday's Law
      </div>

      <div className="pb-10 sm:pb-20">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <FaradayVisualizer />
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="text-sm sm:text-base lg:text-lg text-justify mb-6">
        Faraday's Law is one of the four Maxwell's equations, which form the
        foundation of classical electromagnetism. It describes how a changing
        magnetic field can induce an electric field, which is the principle
        behind electromagnetic induction.
      </div>

      {/* Law Description */}
      <div className="space-y-4 sm:space-y-6">
        <div className="text-lg sm:text-xl font-semibold">Faraday's Law Forms</div>
        <p className="text-sm sm:text-base lg:text-lg text-justify">
          The general statement of Faraday's Law can be given in both integral
          and differential forms.
        </p>

        {/* Integral Form */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Integral Form</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[350px] text-center">
              <BlockMath math="\oint_{\partial S} \mathbf{E} \cdot d\mathbf{l} = -\frac{d}{dt} \int_{S} \mathbf{B} \cdot d\mathbf{A}" />
            </div>
          </div>
        </div>

        {/* Differential Form */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Differential Form
          </h3>
          <p className="text-sm sm:text-base lg:text-lg mb-2">
            Using Stokes' theorem, Faraday's Law in differential form is:
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[250px] text-center">
              <BlockMath math="\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}" />
            </div>
          </div>
        </div>
      </div>

      {/* Cases Section */}
      <div className="space-y-6 sm:space-y-8 mt-8">
        {/* Case 1 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            1. Stationary Loop in a Time-Varying Magnetic Field (Transformer
            EMF)
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-justify">
            In this case, the loop is fixed in space, but the magnetic field
            through it changes with time. According to Faraday's Law, this
            induces an EMF:
          </p>
          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[300px] text-center">
              <BlockMath math="\text{EMF} = -\frac{\mathrm{d}}{\mathrm{d}t} \int_{s} \vec{B} \cdot d\vec{A}" />
            </div>
            <div className="min-w-[350px] text-center">
              <BlockMath math="V_{EMF} = \oint_{L} E \cdot dl = -\int_{s} \frac{\partial B}{\partial t} \, ds" />
            </div>
          </div>
        </div>

        {/* Case 2 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            2. Moving Loop in a Static Magnetic Field (Motional EMF)
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-justify">
            When a loop moves in a static magnetic field, charges within the
            loop experience a force due to the field, generating an EMF. The
            Lorentz force acting on a charge is:
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[300px] text-center">
              <BlockMath math="\mathbf{F} = q(\mathbf{E} + \mathbf{v} \times \mathbf{B})" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-justify">
            This leads to the motional electric field:
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[300px] text-center">
              <BlockMath math="\mathcal{E} = \int_{C} (\mathbf{v} \times \mathbf{B}) \cdot d\mathbf{l}" />
            </div>
          </div>
        </div>

        {/* Case 3 */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            3. Moving Loop in a Time-Varying Magnetic Field
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-justify">
            In this case, both the loop is moving, and the magnetic field is
            changing with time. This induces both motional EMF and transformer
            EMF, leading to the total EMF:
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[400px] text-center">
              <BlockMath math="\mathcal{E}_{\text{total}} = \mathcal{E}_{\text{motional}} + \mathcal{E}_{\text{transformer}}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaradayLawPage;