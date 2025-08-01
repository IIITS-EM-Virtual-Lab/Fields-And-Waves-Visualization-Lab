import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";
import AmpereLawVisualizer from "@/components/AmpereLawVisualizer";

const AmpereLawPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Title Section */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-center py-8 text-gray-900">
        Ampere's Circuit Law
      </div>
      
      <div className="pb-10 sm:pb-20">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <AmpereLawVisualizer />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        Ampère's Law states that the line integral of the magnetic field{" "}
        <b>H</b> around any closed loop is equal to the total current enclosed
        by that loop.
      </div>

      {/* General Form Section */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-4">
        Ampère's Law (in Terms of Magnetic Field Intensity H)
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[250px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="\oint_{L} H \cdot dl = I_{enc}" />
        </div>
      </div>
      
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        Ampère's law is similar to Gauss's law, as it is most easily applied to
        determine <b>H</b> when the current distribution is symmetrical.
        Although the equation always holds regardless of symmetry, it is
        practically useful only when symmetry exists. Ampère's law is a special
        case of the Biot-Savart law.
      </div>
      
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        By applying Stokes's theorem to the left-hand side of the equation, we
        obtain:
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[350px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="I_{enc} = \oint_{L} H \cdot dl = \int_{S} (\nabla \times H) \cdot dS" />
        </div>
      </div>
      
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        Comparing the surface integrals in the above equations gives us further
        insights.
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[150px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="\nabla \times H = J" />
        </div>
      </div>

      {/* Applications Section */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-4">
        Applications of Ampère's Law
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        Ampère's Law can be used to determine <b>H</b> for symmetrical current
        distributions, much like how Gauss's Law is applied. We will consider:
        <ul className="list-disc ml-4 sm:ml-6 mt-3 space-y-2">
          <li>An infinite sheet of current.</li>
          <li>An infinitely long coaxial transmission line.</li>
        </ul>
      </div>

      {/* Infinite Sheet of Current */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-4">
        A. Infinite Sheet of Current
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        For an infinite current sheet in the plane <b>z = 0</b> with a uniform
        surface current density <b>K</b> (A/m):
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        <b>Amperian Path (p):</b> Use a rectangular loop that crosses the sheet
        symmetrically, with segments above and below the sheet.
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        Choosing a concentric circular Amperian path ensures <b>H</b> is
        constant if <b>K</b> is constant. Since this path encloses the entire
        current <b>I</b>, Ampère's law applies directly.
      </div>
      
      <div className="overflow-x-auto space-y-4">
        <div className="min-w-[400px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="I = \int H_{\phi} a_{\phi} \cdot \rho \, d\phi \, a_{\phi} = H_{\phi} \int \rho \, d\phi = H_{\phi} \cdot 2\pi \rho" />
        </div>
        <div className="min-w-[200px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="H = \frac{I}{2\pi \rho} a_{\phi}" />
        </div>
      </div>

      {/* Infinite Coaxial Transmission Line */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-4">
        B. Infinitely Long Coaxial Transmission Line
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        Consider an infinitely long coaxial transmission line with:
        <ul className="list-disc ml-4 sm:ml-6 mt-3 space-y-2">
          <li>
            An inner conductor of radius <b>a</b> carrying a current <b>I</b> in
            the +z-direction.
          </li>
          <li>
            An outer cylindrical conductor with an inner radius <b>b</b> and
            outer radius <b>c</b>, carrying a current <b>I</b> in the
            −z-direction.
          </li>
        </ul>
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        For this configuration, we examine the magnetic field <b>H</b> in three
        regions:
        <ol className="list-decimal ml-4 sm:ml-6 mt-3 space-y-2">
          <li>
            Inside the inner conductor (<b>r &lt; a</b>).
          </li>
          <li>
            Between the inner and outer conductors (<b>a &lt; r &lt; b</b>).
          </li>
          <li>
            Outside the outer conductor (<b>r &gt; c</b>).
          </li>
        </ol>
      </div>

      <div className="space-y-8 sm:space-y-10">
        {/* Region 1 */}
        <div className="text-sm sm:text-base lg:text-lg">
          <div className="text-lg sm:text-xl font-bold mb-2">Region 1:</div>
          <div className="text-base sm:text-lg font-semibold mb-3">
            r &lt; a (Inside the Inner Conductor)
          </div>
          <div className="leading-relaxed mb-4">
            If the current <b>I</b> is uniformly distributed across the
            cross-sectional area of the inner conductor, then:
          </div>

          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[150px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="J = \frac{I}{\pi a^{2}}" />
            </div>
          </div>
          
          <div className="leading-relaxed my-4">
            The enclosed current at a distance <b>r</b> is:
          </div>

          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[200px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="I_{enc} = J \cdot \pi r^{2} = I \frac{r^{2}}{a^{2}}" />
            </div>
          </div>
          
          <div className="leading-relaxed my-4">Applying Ampère's Law:</div>

          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[300px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="\oint H \cdot dl = H \cdot (2\pi r) = I \frac{r^{2}}{a^{2}}" />
            </div>
          </div>
          
          <div className="leading-relaxed my-4">
            Solving for <b>H</b>:
          </div>

          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[150px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="H = \frac{I r}{2\pi a^{2}}" />
            </div>
          </div>

          <div className="leading-relaxed my-4">So, inside the inner conductor:</div>

          <div className="overflow-x-auto">
            <div className="min-w-[200px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="H = \frac{I r}{2\pi a^{2}} \hat{\phi}" />
            </div>
          </div>
        </div>

        {/* Region 2 */}
        <div className="text-sm sm:text-base lg:text-lg">
          <div className="text-lg sm:text-xl font-bold mb-2">Region 2:</div>
          <div className="text-base sm:text-lg font-semibold mb-3">
            a &lt; r &lt; b (Between the Conductors)
          </div>
          <div className="leading-relaxed mb-4">
            In this region, the enclosed current is <b>I</b>, and Ampère's Law
            becomes:
          </div>

          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[250px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="\oint H \cdot dl = H \cdot (2\pi r) = I" />
            </div>
          </div>
          
          <div className="leading-relaxed my-4">
            Solving for <b>H</b>:
          </div>

          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[150px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="H = \frac{I}{2\pi r}" />
            </div>
          </div>
          
          <div className="leading-relaxed my-4">
            So, in the region between the conductors:
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[150px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="H = \frac{I}{2\pi r} \hat{\phi}" />
            </div>
          </div>
        </div>

        {/* Region 3 */}
        <div className="text-sm sm:text-base lg:text-lg">
          <div className="text-lg sm:text-xl font-bold mb-2">Region 3:</div>
          <div className="text-base sm:text-lg font-semibold mb-3">
            r &gt; c (Outside the Outer Conductor)
          </div>
          <div className="leading-relaxed mb-4">
            Since the currents in the inner and outer conductors are equal and
            opposite, the total enclosed current for any radius <b>r &gt; c</b>{" "}
            is zero. By Ampère's Law:
          </div>

          <div className="overflow-x-auto space-y-4">
            <div className="min-w-[250px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="\oint H \cdot dl = 0 \Rightarrow H = 0" />
            </div>
          </div>
          
          <div className="leading-relaxed my-4">
            Thus, outside the coaxial transmission line:
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[100px] text-center text-lg sm:text-xl lg:text-2xl">
              <BlockMath math="H = 0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmpereLawPage;