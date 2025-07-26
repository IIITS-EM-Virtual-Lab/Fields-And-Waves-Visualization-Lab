import GaussApplicationVisualizer from "@/components/GaussApplicationVisualizer";
import { BlockMath } from "react-katex";

const GaussLawContdPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Title Section */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-center py-8 text-gray-900">
        Applications of Gauss Law
      </div>

      <div className="pb-10 sm:pb-20">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <GaussApplicationVisualizer />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-8 sm:space-y-10 text-sm sm:text-base lg:text-lg leading-relaxed">
        {/* 1. Point Charge Section */}
        <div>
          <div className="font-bold text-lg sm:text-xl text-gray-900 mb-4">1. Point Charge</div>
          <div className="space-y-3 sm:space-y-4">
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
        </div>

        <div className="text-lg sm:text-xl lg:text-2xl my-6 text-center overflow-x-auto">
          <div className="min-w-[300px]">
            <BlockMath math="\oint E \cdot dA = \oint E \cdot \hat{n} \, dA" />
            <BlockMath math="\oint E(r)\hat{r} \cdot \hat{n} \, dA" />
            <BlockMath math="\oint E(r) \, dA" />
            <BlockMath math="E(r) \oint dA" />
            <BlockMath math="E(r) 4\pi r^{2}" />
          </div>
        </div>

        <div className="text-lg sm:text-xl font-bold">After Applying Gauss Law:</div>
        <div className="text-lg sm:text-xl lg:text-2xl my-6 text-center overflow-x-auto">
          <div className="min-w-[300px]">
            <BlockMath math="\oint E \cdot dA = \frac{q_{\text{enc}}}{\varepsilon_0}" />
            <BlockMath math="E(r) 4\pi r^{2} = \frac{Q}{\varepsilon_0}" />
            <BlockMath math="E(r) = \frac{1}{4\pi\varepsilon_0} \times \frac{Q}{r^{2}}" />
          </div>
        </div>

        {/* 2. Infinite Line Charge Section */}
        <div>
          <div className="font-bold text-lg sm:text-xl text-gray-900 mb-4">
            2. Infinite Line Charge
          </div>
          <div className="space-y-3 sm:space-y-4">
            <p>
              To apply <b>Gauss' Law</b>, we choose a cylindrical surface of
              radius <i>a</i> along the <b>z-axis</b>, which is symmetric with the charge
              distribution. Initially, consider a finite cylinder of length{" "}
              <i>l</i>. For the infinite case, we take the limit as <i>l → ∞</i>.
            </p>
            <p className="text-lg sm:text-xl font-semibold text-center">
              D = ρ<sup>D</sup>ρ(ρ)
            </p>
          </div>
        </div>

        {/* 3. Infinite Sheet of Charge Section */}
        <div>
          <div className="font-bold text-lg sm:text-xl text-gray-900 mb-4">
            3. Infinite Sheet of Charge
          </div>
          <div className="space-y-3 sm:space-y-4">
            <p>
              An infinite plane sheet of charge carries a uniformly distributed
              positive charge with surface charge density <b>σ</b>, defined as the
              charge per unit area:
              <b>σ = q/A</b>. Using Gauss' Law, the electric field is calculated
              as:
            </p>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl my-6 text-center overflow-x-auto">
            <div className="min-w-[300px]">
              <BlockMath math="\phi = \frac{\sigma A}{\varepsilon_0}" />
              <BlockMath math="\phi = 2EA" />
              <BlockMath math="2EA = \frac{\sigma A}{\varepsilon_0}" />
              <BlockMath math="E = \frac{\sigma}{2\varepsilon_0}" />
              <BlockMath math="E = \frac{\sigma}{2\varepsilon_0} \hat{n}" />
            </div>
          </div>
        </div>

        {/* 4. Uniformly Charged Sphere Section */}
        <div>
          <div className="font-bold text-lg sm:text-xl text-gray-900 mb-4">
            4. Uniformly Charged Sphere
          </div>
          <p className="mb-6">
            Consider a uniform spherical distribution of charge (held in an
            insulator). The charge density is uniform throughout the sphere.
            Using Gauss' Law:
          </p>
          <div className="flex flex-col lg:flex-row justify-around gap-6 lg:gap-8">
            <div className="flex-1">
              <div className="font-bold text-base sm:text-lg mb-4">For r {"<"} a</div>
              <div className="text-sm sm:text-base lg:text-lg overflow-x-auto">
                <div className="min-w-[250px]">
                  <BlockMath math="Q_{\text{enc}} = \rho_{0} \frac{4}{3} \pi r^{3}" />
                  <BlockMath math="\psi = \int_{s} D \cdot ds" />
                  <BlockMath math="= D_{r} 4\pi r^{2}" />
                  <BlockMath math="\psi = Q_{\text{enc}}" />
                  <BlockMath math="D_{r} 4\pi r^{2} = \frac{4\pi r^{3}}{3} \rho_{0}" />
                  <BlockMath math="D = \frac{r}{3} \rho_{0} a_{r}" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-base sm:text-lg mb-4">For r {">"} a</div>
              <div className="text-sm sm:text-base lg:text-lg overflow-x-auto">
                <div className="min-w-[250px]">
                  <BlockMath math="Q_{\text{enc}} = \rho_{0} \frac{4}{3} \pi a^{3}" />
                  <BlockMath math="\psi = \oint_{s} D \cdot ds = D_{r} 4\pi r^{2}" />
                  <BlockMath math="D_{r} 4\pi r^{2} = \frac{4}{3} \pi a^{3} \rho_{0}" />
                  <BlockMath math="D = \frac{a^{3}}{3r^{2}} \rho_{0} a_{r}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaussLawContdPage;