import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";

const FaradayLawPage = () => {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-10 bg-gray-50 text-gray-800">
      {/* Title Section */}
      <div className="text-3xl font-bold uppercase text-center py-6 text-gray-900">
        Faraday's Law
      </div>

      {/* Introduction Section */}
      <div className="text-lg text-justify mb-6">
        Faraday's Law is one of the four Maxwell’s equations, which form the
        foundation of classical electromagnetism. It describes how a changing
        magnetic field can induce an electric field, which is the principle
        behind electromagnetic induction.
      </div>

      {/* Law Description */}
      <div className="space-y-4">
        <div className="text-xl font-semibold">Faraday's Law Forms</div>
        <p className="text-justify">
          The general statement of Faraday's Law can be given in both integral
          and differential forms.
        </p>

        {/* Integral Form */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Integral Form</h3>
          <BlockMath math="\oint_{\partial S} \mathbf{E} \cdot d\mathbf{l} = -\frac{d}{dt} \int_{S} \mathbf{B} \cdot d\mathbf{A}" />
        </div>

        {/* Differential Form */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Differential Form
          </h3>
          <p className="mb-2">
            Using Stokes’ theorem, Faraday's Law in differential form is:
          </p>
          <BlockMath math="\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}" />
        </div>
      </div>

      {/* Cases Section */}
      <div className="space-y-6 mt-8">
        {/* Case 1 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            1. Stationary Loop in a Time-Varying Magnetic Field (Transformer
            EMF)
          </h3>
          <p className="text-justify">
            In this case, the loop is fixed in space, but the magnetic field
            through it changes with time. According to Faraday’s Law, this
            induces an EMF:
          </p>
          <BlockMath math="\text{EMF} = -\frac{\mathrm{d}}{\mathrm{d}t} \int_{s} \vec{B} \cdot d\vec{A}" />
          <BlockMath math="V_{EMF} = \oint_{L} E \cdot dl = -\int_{s} \frac{\partial B}{\partial t} \, ds" />
        </div>

        {/* Case 2 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            2. Moving Loop in a Static Magnetic Field (Motional EMF)
          </h3>
          <p className="text-justify">
            When a loop moves in a static magnetic field, charges within the
            loop experience a force due to the field, generating an EMF. The
            Lorentz force acting on a charge is:
          </p>
          <BlockMath math="\mathbf{F} = q(\mathbf{E} + \mathbf{v} \times \mathbf{B})" />
          <p className="text-justify">
            This leads to the motional electric field:
          </p>
          <BlockMath math="\mathcal{E} = \int_{C} (\mathbf{v} \times \mathbf{B}) \cdot d\mathbf{l}" />
        </div>

        {/* Case 3 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            3. Moving Loop in a Time-Varying Magnetic Field
          </h3>
          <p className="text-justify">
            In this case, both the loop is moving, and the magnetic field is
            changing with time. This induces both motional EMF and transformer
            EMF, leading to the total EMF:
          </p>
          <BlockMath math="\mathcal{E}_{\text{total}} = \mathcal{E}_{\text{motional}} + \mathcal{E}_{\text{transformer}}" />
        </div>
      </div>
      <div className="p-10 flex justify-center items-center">
        <iframe
          src="https://www.geogebra.org/material/iframe/id/fv9Yf2Y5//width/800/height/600/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
          width="800"
          height="600"
          allowFullScreen
          style={{
            border: "1px solid #e4e4e4",
            borderRadius: "4px",
          }}
        ></iframe>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-10">
        <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded">
          Next
        </Button>
      </div>
    </div>
  );
};

export default FaradayLawPage;
