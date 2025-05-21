import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";

const GaussLawPage = () => {
  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      {/* Title Section */}
      <div className="text-xl font-black uppercase text-center py-10">
        Gauss Law
      </div>

      {/* Content Section */}
      <div>
        <div>
          The electric flux through an area is defined as the electric field
          multiplied by the area of the surface projected in a plane
          perpendicular to the field.
        </div>
        <div className="text-2xl my-4">
          <BlockMath math="\phi = \frac{Q}{\varepsilon_0}" />
        </div>
      </div>

      {/* Proof Section */}
      <div className="text-3xl font-bold pb-6">Proof of Gauss Law</div>
      <div className="space-y-4">
        <div>
          Consider a point charge <i>Q</i> located in a homogeneous isotropic
          medium of permittivity <i>ε</i>. At any point, the{" "}
          <strong>electric field intensity</strong> at a distance <i>r</i> from
          the charge is:
        </div>
        <div>The flux density is given as,</div>
        <div>The flux through area dA</div>
        <div>Where θ is the angle between D and the normal to dA.</div>
        <div>
          Now, dAcosθ is the projection of dA that is normal to the radius
          vector. Solid angle is given by,
        </div>
        <div>
          dΩ is the solid angle subtended at <i>Q</i> by the elementary surface
          area <i>dA</i>. So the total displacement of flux through the entire
          surface area is:
        </div>
        <div>
          The total electric flux through the entire surface is This is the
          integral form of Gauss theorem. And hence this theorem is proved.
        </div>
      </div>

      {/* Gauss's Law Summary */}
      <div className="text-xl font-semibold text-center italic mt-8">
        Gauss's law is one of the four equations of electricity and magnetism.
        The four applications of Gauss's Law are to find out the field due to a
        uniformly charged straight wire, a uniformly charged infinite plate
        sheet, a uniformly charged thin spherical shell, and a low uniformly
        charged sphere.
      </div>

      {/* Footer Section */}
      <div className="flex justify-end mb-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default GaussLawPage;
