import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";

const GaussLawMagnestismPage = () => {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-10 bg-gray-50 text-gray-800">
      {/* Title Section */}
      <div className="text-3xl font-extrabold uppercase text-center py-6 text-gray-900">
        Gauss's Law for Magnetism
      </div>

      {/* Content Section */}
      <div className="space-y-12 text-lg leading-relaxed">
        {/* Introduction */}
        <div>
          Gauss's Law for Magnetism is one of Maxwell's equations that describes
          the behavior of magnetic fields. It fundamentally states that magnetic
          monopoles do not exist; in other words, there are no isolated
          "magnetic charges" analogous to electric charges.
        </div>

        {/* Section Title */}
        <div className="text-2xl font-bold text-gray-800">
          Gauss's Law for Magnetism in Differential and Integral Forms
        </div>

        {/* Description */}
        <div>
          The general statement of Gauss's Law for Magnetism can be expressed in
          both integral and differential forms.
        </div>

        {/* Integral Form */}
        <div className="space-y-4">
          <div className="font-bold text-xl text-gray-900">Integral Form</div>
          <BlockMath math="\oint_{S} \mathbf{B} \cdot d\mathbf{S} = 0" />
          <p className="text-gray-700">
            where:
            <ul className="list-disc ml-6 space-y-1">
              <li>
                <strong>S</strong> is any closed surface.
              </li>
              <li>
                <strong>B ⋅ dS</strong> represents the magnetic flux through an
                infinitesimal area dS on the surface.
              </li>
            </ul>
          </p>
        </div>

        {/* Differential Form */}
        <div className="space-y-4">
          <div className="font-bold text-xl text-gray-900">
            Differential Form
          </div>
          <BlockMath math="\nabla \cdot \mathbf{B} = 0" />
          <p className="text-gray-700">
            where:
            <ul className="list-disc ml-6 space-y-1">
              <li>
                <strong>B</strong> is the magnetic field vector.
              </li>
              <li>
                <strong>∇⋅B</strong> represents the divergence of the magnetic
                field.
              </li>
            </ul>
          </p>
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

      {/* Navigation Button */}
      <div className="flex justify-end mt-12">
        <Button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200">
          Next
        </Button>
      </div>
    </div>
  );
};

export default GaussLawMagnestismPage;
