import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Link } from "react-router-dom";
import { Radio, Zap, Activity, Compass, ArrowRight, ShieldAlert, BookOpen, Layers } from "lucide-react";
import HertzianDipoleVisualizer from "@/components/HertzianDipoleVisualizer";

const HertzianDipolePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Breadcrumb Navigation */}
      <div className="pt-6 pb-2 text-xs sm:text-sm text-slate-500 flex items-center gap-2">
        <Link to="/antenna-intro" className="hover:text-blue-600 transition">
          Antennas
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Hertzian Dipole</span>
      </div>

      {/* Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8 tracking-wide text-slate-900">
        Hertzian Dipole (Infinitesimal Current Element)
      </div>

      {/* Subtitle / Lead */}
      <p className="text-center text-slate-600 max-w-3xl mx-auto -mt-4 mb-8 text-sm sm:text-base leading-relaxed">
        Explore the fundamental building block of antenna theory: an infinitesimal, time-harmonic current filament radiating electromagnetic waves into free space.
      </p>

      {/* Interactive Demo Section */}
      <div className="pb-12">
        <div className="flex items-center justify-center gap-2 text-xl font-black uppercase text-center py-6 text-slate-900">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Interactive 3D Simulation & Field Calculator</span>
        </div>
        <div className="flex justify-center w-full">
          <HertzianDipoleVisualizer />
        </div>
      </div>

      {/* 1. Introduction to the Hertzian Dipole */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-blue-600">
          <Zap className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            1. What is a Hertzian Dipole?
          </h2>
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          A <strong>Hertzian dipole</strong> (also termed an <em>infinitesimal current element</em>) is an idealized, straight conductor of length <InlineMath math="dl" /> that is very small compared to the operating wavelength:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="dl \ll \lambda \quad \left(\text{typically } dl \le \frac{\lambda}{10} \text{ or } dl \le \frac{\lambda}{50}\right)" />
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          Because the wire length is microscopic relative to the wavelength, the spatial phase variation along the conductor is negligible. Consequently, the current <InlineMath math="I(t)" /> can be assumed to be <strong>spatially uniform</strong> along its entire length:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="I(t) = I_0 \cos(\omega t) = \text{Re}\left\{ I_0 e^{j\omega t} \right\}" />
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-4">
          <p className="font-semibold text-blue-950 mb-1">Why is this ideal element so important?</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            While no practical, isolated physical antenna can have a truly uniform non-zero current ending abruptly at open ends, the Hertzian dipole serves as the <strong>Green's function</strong> of linear antenna theory. Any practical antenna of arbitrary length or shape (such as half-wave dipoles, monopoles, and loop antennas) can be accurately analyzed as a continuous cascade of Hertzian dipoles using the principle of linear superposition.
          </p>
        </div>
      </div>

      {/* 2. Vector Magnetic Potential Formulation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-indigo-600">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            2. Magnetic Vector Potential & Field Derivation
          </h2>
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          Consider an infinitesimal dipole centered at the coordinate origin and aligned along the <InlineMath math="z" />-axis. Because the current flows solely in the <InlineMath math="\hat{\mathbf{a}}_z" /> direction, the <strong>retarded magnetic vector potential</strong> <InlineMath math="\mathbf{A}" /> at an observation point <InlineMath math="P(r, \theta, \phi)" /> has only a <InlineMath math="z" />-component:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\mathbf{A}(\mathbf{r}) = \frac{\mu_0 I_0 dl}{4\pi r} e^{-j\beta r} \, \hat{\mathbf{a}}_z" />
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          where <InlineMath math="\beta = \frac{2\pi}{\lambda} = \frac{\omega}{c}" /> is the phase constant of the medium. To evaluate the curl in spherical coordinates, we transform <InlineMath math="\mathbf{A}" /> using the transformation <InlineMath math="\hat{\mathbf{a}}_z = \cos\theta \hat{\mathbf{a}}_r - \sin\theta \hat{\mathbf{a}}_\theta" />:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="A_r = A_z \cos\theta = \frac{\mu_0 I_0 dl}{4\pi r} e^{-j\beta r} \cos\theta" />
        </div>
        <div className="flex justify-center my-4">
          <BlockMath math="A_\theta = -A_z \sin\theta = -\frac{\mu_0 I_0 dl}{4\pi r} e^{-j\beta r} \sin\theta, \qquad A_\phi = 0" />
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          The magnetic field is calculated from <InlineMath math="\mathbf{B} = \mu_0 \mathbf{H} = \nabla \times \mathbf{A}" />:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="H_\phi = \frac{1}{\mu_0 r} \left[ \frac{\partial}{\partial r}(r A_\theta) - \frac{\partial A_r}{\partial \theta} \right] = \frac{I_0 dl}{4\pi} \sin\theta \left( \frac{j\beta}{r} + \frac{1}{r^2} \right) e^{-j\beta r}" />
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          From Maxwell's equation in a source-free region, <InlineMath math="\nabla \times \mathbf{H} = j\omega\varepsilon_0 \mathbf{E}" />, the electric field components are obtained:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="E_r = \frac{\eta_0 I_0 dl}{2\pi} \cos\theta \left( \frac{1}{r^2} - \frac{j}{\beta r^3} \right) e^{-j\beta r}" />
        </div>
        <div className="flex justify-center my-4">
          <BlockMath math="E_\theta = \frac{\eta_0 I_0 dl}{4\pi} \sin\theta \left( \frac{j\beta}{r} + \frac{1}{r^2} - \frac{j}{\beta r^3} \right) e^{-j\beta r}" />
        </div>

        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Note: Due to the azimuthal symmetry of a <InlineMath math="z" />-directed dipole, <InlineMath math="E_\phi = 0" />, <InlineMath math="H_r = 0" />, and <InlineMath math="H_\theta = 0" /> everywhere. Here <InlineMath math="\eta_0 = \sqrt{\mu_0/\varepsilon_0} \approx 376.73\,\Omega \approx 120\pi\,\Omega" /> is the intrinsic impedance of free space.
        </p>
      </div>

      {/* 3. Near-Field, Intermediate, and Far-Field Zones */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-teal-600">
          <Layers className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            3. The Three Distinct Field Zones
          </h2>
        </div>

        <p className="mb-6 text-slate-700 leading-relaxed">
          Examining the radial dependence in <InlineMath math="E_r, E_\theta" />, and <InlineMath math="H_\phi" /> reveals three terms proportional to <InlineMath math="1/r^3" />, <InlineMath math="1/r^2" />, and <InlineMath math="1/r" />. As the observation distance <InlineMath math="r" /> varies relative to <InlineMath math="\lambda / (2\pi)" />, the character of the field shifts completely:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Near Field */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="inline-block px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded mb-2">
              Near-Field / Reactive Zone
            </span>
            <h3 className="font-bold text-slate-800 mb-2">
              <InlineMath math="r \ll \frac{\lambda}{2\pi} \quad (\beta r \ll 1)" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              The <InlineMath math="1/r^3" /> term dominates in <InlineMath math="E" /> and <InlineMath math="1/r^2" /> in <InlineMath math="H" />:
            </p>
            <div className="text-xs bg-slate-50 p-2 rounded border mb-2 font-mono">
              <InlineMath math="E_r \approx \frac{q dl}{4\pi\varepsilon_0 r^3} 2\cos\theta" />
            </div>
            <p className="text-xs text-slate-500">
              The fields are in phase quadrature (90° apart). Energy is stored reactively and oscillates back and forth into the antenna without net real power loss.
            </p>
          </div>

          {/* Intermediate */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="inline-block px-2.5 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded mb-2">
              Induction / Intermediate Zone
            </span>
            <h3 className="font-bold text-slate-800 mb-2">
              <InlineMath math="r \approx \frac{\lambda}{2\pi} \quad (\beta r \approx 1)" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              The induction <InlineMath math="1/r^2" /> terms are of comparable magnitude to radiation and reactive terms.
            </p>
            <p className="text-xs text-slate-500">
              The boundary <InlineMath math="r = \lambda / (2\pi) \approx 0.159\lambda" /> is known as the <em>radian sphere</em>. Inside this sphere, the reactive energy dominates; outside, radiated power begins to take over.
            </p>
          </div>

          {/* Far Field */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="inline-block px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded mb-2">
              Far-Field / Radiation Zone
            </span>
            <h3 className="font-bold text-slate-800 mb-2">
              <InlineMath math="r \gg \frac{\lambda}{2\pi} \quad (\beta r \gg 1)" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Only the <InlineMath math="1/r" /> radiation terms survive as higher-order terms decay rapidly:
            </p>
            <div className="text-xs bg-slate-50 p-2 rounded border mb-2 font-mono">
              <InlineMath math="E_\theta \approx j\frac{\eta_0 I_0 dl}{4\pi r}\beta\sin\theta e^{-j\beta r}" />
            </div>
            <p className="text-xs text-slate-500">
              <InlineMath math="E_r \approx 0" />: The radiated wave is a transverse electromagnetic (TEM) spherical wave with <InlineMath math="E_\theta / H_\phi = \eta_0" />.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Radiated Power & Radiation Resistance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-purple-600">
          <Compass className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            4. Radiated Power & Radiation Resistance (<InlineMath math="R_{rad}" />)
          </h2>
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          In the far-field zone, the time-average Poynting vector gives the radial power flow per unit area:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\mathbf{\mathcal{P}}_{\text{avg}} = \frac{1}{2} \text{Re}\left\{ \mathbf{E} \times \mathbf{H}^* \right\} = \frac{1}{2} \frac{|E_\theta|^2}{\eta_0} \hat{\mathbf{a}}_r = \frac{\eta_0 \beta^2 I_0^2 (dl)^2}{32 \pi^2 r^2} \sin^2\theta \, \hat{\mathbf{a}}_r" />
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          Integrating this power flux over a closed sphere of radius <InlineMath math="r" /> gives the total power radiated into free space:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="P_{\text{rad}} = \int_{\theta=0}^\pi \int_{\phi=0}^{2\pi} \mathcal{P}_{\text{avg}} \cdot (r^2 \sin\theta \, d\theta \, d\phi \, \hat{\mathbf{a}}_r) = \frac{\eta_0 \beta^2 I_0^2 (dl)^2}{16 \pi} \int_0^\pi \sin^3\theta \, d\theta" />
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          Evaluating the definite integral <InlineMath math="\int_0^\pi \sin^3\theta \, d\theta = \frac{4}{3}" /> and substituting <InlineMath math="\beta = 2\pi/\lambda" /> and <InlineMath math="\eta_0 = 120\pi" />:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="P_{\text{rad}} = 40 \pi^2 I_0^2 \left( \frac{dl}{\lambda} \right)^2 \quad \text{[Watts]}" />
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          By definition, the equivalent <strong>radiation resistance</strong> <InlineMath math="R_{\text{rad}}" /> is the fictitious resistance that dissipates the same power when carrying current <InlineMath math="I_0" /> (i.e., <InlineMath math="P_{\text{rad}} = \frac{1}{2} I_0^2 R_{\text{rad}}" />):
        </p>

        <div className="flex justify-center my-6">
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl px-6 py-3 text-center">
            <BlockMath math="R_{\text{rad}} = 80 \pi^2 \left( \frac{dl}{\lambda} \right)^2 \approx 789.6 \left( \frac{dl}{\lambda} \right)^2 \quad [\Omega]" />
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md mt-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span className="font-semibold text-amber-900">Engineering Consequence: High Inefficiency</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            For an electrically small element of length <InlineMath math="dl = \lambda / 50" />, the radiation resistance is only:
            <br />
            <span className="font-mono text-xs block my-1">
              R_rad ≈ 789.6 / 2500 ≈ 0.316 Ω
            </span>
            Because the ohmic loss resistance of the metallic conductor can easily approach or exceed this tiny value, short dipoles have very low radiation efficiency and severe impedance matching challenges unless resonant matching networks are employed.
          </p>
        </div>
      </div>

      {/* 5. Radiation Pattern & Directivity */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-blue-600">
          <Radio className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            5. Radiation Pattern & Directivity
          </h2>
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          The radiation intensity <InlineMath math="U(\theta, \phi) = r^2 \mathcal{P}_{\text{avg}}" /> describes the angular power distribution:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="U(\theta, \phi) = U_{\max} \sin^2\theta" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-white border rounded-lg p-5">
            <h3 className="font-bold text-slate-800 mb-2">E-Plane Pattern (Elevation Cut)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In any plane containing the dipole axis (such as the <InlineMath math="xz" /> or <InlineMath math="yz" /> plane), the radiation pattern follows a <strong>figure-8</strong> shape with:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
              <li><strong>Broadside maximum:</strong> at <InlineMath math="\theta = 90^\circ" /> (perpendicular to the wire)</li>
              <li><strong>Nulls (zero radiation):</strong> along the wire axis at <InlineMath math="\theta = 0^\circ" /> and <InlineMath math="\theta = 180^\circ" /></li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-5">
            <h3 className="font-bold text-slate-800 mb-2">H-Plane Pattern (Azimuthal Cut)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In the equatorial plane (<InlineMath math="\theta = 90^\circ" />), the pattern has <strong>no variation with respect to <InlineMath math="\phi" /></strong>:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
              <li>The pattern is purely circular (<strong>omnidirectional</strong>) in azimuth.</li>
              <li>Receivers located anywhere around the horizon at the same distance receive equal power.</li>
            </ul>
          </div>
        </div>

        <p className="mb-4 text-slate-700 leading-relaxed">
          The <strong>directivity</strong> <InlineMath math="D" /> measures how concentrated the radiated power is in the direction of maximum intensity compared to an ideal isotropic antenna:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="D_{\max} = \frac{4\pi U_{\max}}{P_{\text{rad}}} = \frac{4\pi U_{\max}}{\frac{8\pi}{3} U_{\max}} = \frac{3}{2} = 1.5 \implies 10 \log_{10}(1.5) \approx 1.76 \text{ dBi}" />
        </div>
      </div>

      {/* 6. Key Takeaways & Summary Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-12 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4 text-slate-900">
          6. Summary of Hertzian Dipole Characteristics
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-50">
                <th className="py-3 px-4 font-bold text-slate-900">Parameter</th>
                <th className="py-3 px-4 font-bold text-slate-900">Formula / Expression</th>
                <th className="py-3 px-4 font-bold text-slate-900">Physical Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-4 font-semibold">Element Length</td>
                <td className="py-3 px-4"><InlineMath math="dl \ll \lambda" /> (<InlineMath math="\le \lambda/10" />)</td>
                <td className="py-3 px-4">Infinitesimal current filament; uniform amplitude and phase.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Far-Field Electric Field</td>
                <td className="py-3 px-4"><InlineMath math="E_\theta = j\frac{\eta_0 I_0 dl \beta}{4\pi r}\sin\theta e^{-j\beta r}" /></td>
                <td className="py-3 px-4">Transverse wave linearly polarized along <InlineMath math="\hat{\mathbf{a}}_\theta" />.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Far-Field Magnetic Field</td>
                <td className="py-3 px-4"><InlineMath math="H_\phi = \frac{E_\theta}{\eta_0}" /></td>
                <td className="py-3 px-4">Azimuthal magnetic field in phase with <InlineMath math="E_\theta" />.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Radiation Resistance</td>
                <td className="py-3 px-4"><InlineMath math="R_{rad} = 80\pi^2 (dl/\lambda)^2" /></td>
                <td className="py-3 px-4">Proportional to electrical length squared. Small for short dipoles.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Directivity</td>
                <td className="py-3 px-4"><InlineMath math="D = 1.5 \ (1.76 \text{ dBi})" /></td>
                <td className="py-3 px-4">3 dB higher than isotropic in the broadside direction.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Pattern Shape</td>
                <td className="py-3 px-4"><InlineMath math="F(\theta, \phi) = \sin^2\theta" /></td>
                <td className="py-3 px-4">Figure-8 in elevation, omnidirectional doughnut in 3D.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
          <Link
            to="/antenna-intro"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            ← Back to Antenna Fundamentals
          </Link>

          <Link
            to="/module/antennas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <span>Explore Antennas Module</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HertzianDipolePage;
