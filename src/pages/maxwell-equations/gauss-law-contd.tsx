import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";

const GaussLawContdPage = () => {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-10 bg-gray-50 text-gray-800">
      {/* Title Section */}
      <div className="text-2xl font-extrabold uppercase text-center py-6 text-gray-900">
        Applications of Gauss Law
      </div>

      {/* Content Section */}
      <div className="space-y-10 text-lg leading-relaxed">
        {/* 1. Point Charge Section */}
        <div>
          <div className="font-bold text-xl text-gray-900">1. Point Charge</div>
          <p>
            All sections of the Gaussian surface should be chosen so that they
            are either parallel or perpendicular to <b>E</b>.
          </p>
          <p>
            <b>|E|</b> should be constant on each surface having non-zero flux.
          </p>
          <p>
            At all points on the spherical surface, the vector associated with
            the infinitesimal surface element <i>dA</i> will point in the same
            direction as the electric field at that point, i.e., radially
            outward. Thus, the integrand of the surface integral for evaluating
            electric flux reduces from <i>E · dA</i> to <i>E dA</i>.
          </p>
          <p>
            Since the sphere is centered about the charge, each point on the
            surface is equidistant from the center. Hence, the electric field
            can be moved outside the integral, and the surface integral reduces
            to the product of the electric field and the surface area of the
            sphere.
          </p>
        </div>

        <div className="text-2xl my-4 text-center">
          <BlockMath math="\oint E \cdot dA = \oint E \cdot \hat{n} \, dA" />
          <BlockMath math="\oint E(r)\hat{r} \cdot \hat{n} \, dA" />
          <BlockMath math="\oint E(r) \, dA" />
          <BlockMath math="E(r) \oint dA" />
          <BlockMath math="E(r) 4\pi r^{2}" />
        </div>

        <div className="text-xl font-bold">After Applying Gauss Law:</div>
        <div className="text-2xl my-4 text-center">
          <BlockMath math="\oint E \cdot dA = \frac{q_{\text{enc}}}{\varepsilon_0}" />
          <BlockMath math="E(r) 4\pi r^{2} = \frac{Q}{\varepsilon_0}" />
          <BlockMath math="E(r) = \frac{1}{4\pi\varepsilon_0} \times \frac{Q}{r^{2}}" />
        </div>

        {/* 2. Infinite Line Charge Section */}
        <div>
          <div className="font-bold text-xl text-gray-900">
            2. Infinite Line Charge
          </div>
          <p>
            To apply <b>Gauss' Law</b>, we choose a cylindrical surface of
            radius <i>a</i>
            along the <b>z-axis</b>, which is symmetric with the charge
            distribution. Initially, consider a finite cylinder of length{" "}
            <i>l</i>. For the infinite case, we take the limit as <i>l → ∞</i>.
          </p>
          <p className="text-xl font-semibold text-center">
            D = ρ<sup>D</sup>ρ(ρ)
          </p>
        </div>

        {/* 3. Infinite Sheet of Charge Section */}
        <div>
          <div className="font-bold text-xl text-gray-900">
            3. Infinite Sheet of Charge
          </div>
          <p>
            An infinite plane sheet of charge carries a uniformly distributed
            positive charge with surface charge density <b>σ</b>, defined as the
            charge per unit area:
            <b>σ = q/A</b>. Using Gauss’ Law, the electric field is calculated
            as:
          </p>
          <div className="text-2xl my-4 text-center">
            <BlockMath math="\phi = \frac{\sigma A}{\varepsilon_0}" />
            <BlockMath math="\phi = 2EA" />
            <BlockMath math="2EA = \frac{\sigma A}{\varepsilon_0}" />
            <BlockMath math="E = \frac{\sigma}{2\varepsilon_0}" />
            <BlockMath math="E = \frac{\sigma}{2\varepsilon_0} \hat{n}" />
          </div>
        </div>

        {/* 4. Uniformly Charged Sphere Section */}
        <div>
          <div className="font-bold text-xl text-gray-900">
            4. Uniformly Charged Sphere
          </div>
          <p>
            Consider a uniform spherical distribution of charge (held in an
            insulator). The charge density is uniform throughout the sphere.
            Using Gauss’ Law:
          </p>
          <div className="flex flex-wrap justify-around gap-6">
            <div>
              <div className="font-bold">For r {"<"} a</div>
              <div className="text-2xl my-4">
                <BlockMath math="Q_{\text{enc}} = \rho_{0} \frac{4}{3} \pi r^{3}" />
                <BlockMath math="\psi = \int_{s} D \cdot ds" />
                <BlockMath math="= D_{r} 4\pi r^{2}" />
                <BlockMath math="\psi = Q_{\text{enc}}" />
                <BlockMath math="D_{r} 4\pi r^{2} = \frac{4\pi r^{3}}{3} \rho_{0}" />
                <BlockMath math="D = \frac{r}{3} \rho_{0} a_{r}" />
              </div>
            </div>
            <div>
              <div className="font-bold">For r {">"} a</div>
              <div className="text-2xl my-4">
                <BlockMath math="Q_{\text{enc}} = \rho_{0} \frac{4}{3} \pi a^{3}" />
                <BlockMath math="\psi = \oint_{s} D \cdot ds = D_{r} 4\pi r^{2}" />
                <BlockMath math="D_{r} 4\pi r^{2} = \frac{4}{3} \pi a^{3} \rho_{0}" />
                <BlockMath math="D = \frac{a^{3}}{3r^{2}} \rho_{0} a_{r}" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 flex justify-center items-center">
        <iframe
          src="https://www.geogebra.org/material/iframe/id/r7Ue9Nac//width/800/height/600/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
          width="800"
          height="600"
          allowFullScreen
          style={{
            border: "1px solid #e4e4e4",
            borderRadius: "4px",
          }}
        ></iframe>
      </div>

      {/* Footer Section */}
      <div className="flex justify-end mt-10">
        <Button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
          Next
        </Button>
      </div>
    </div>
  );
};

export default GaussLawContdPage;
