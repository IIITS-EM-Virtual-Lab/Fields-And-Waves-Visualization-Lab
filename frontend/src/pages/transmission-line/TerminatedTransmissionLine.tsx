import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import TerminatedTransmissionLineVisualizer from "@/components/TerminatedTransmissionLineVisualizer";

const TerminatedTransmissionLine = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      
      {/* Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Terminated Transmission Line
      </div>

      {/* Interactive Demo */}
      <div className="pb-12">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center w-full">
          <TerminatedTransmissionLineVisualizer />
        </div>
      </div>

      {/* 1 Introduction */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          1. Introduction to Terminated Lines
        </h2>

        <p className="mb-4 text-slate-700">
          When a transmission line is terminated with a load impedance <InlineMath math="Z_L" /> that is not equal to the line's characteristic
          impedance <InlineMath math="Z_0" />, the electromagnetic wave traveling
          toward the load (the <strong>incident wave</strong>) cannot be fully absorbed. 
        </p>

        <p className="text-slate-700">
          To satisfy the boundary conditions (Kirchhoff's voltage and current
          laws) at the load, a portion of the a portion of the wave is reflected back toward the
          generator. This is known as the <strong>reflected wave</strong>. The
          superposition of the incident and reflected waves creates a 
          <strong> standing wave</strong> pattern along the line.
        </p>
      </div>

      {/* 2 The Reflection Coefficient */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          2. The Reflection Coefficient (<InlineMath math="\Gamma" />)
        </h2>

        <p className="mb-4 text-slate-700">
          The reflection coefficient at the load, denoted as <InlineMath math="\Gamma_L" />, 
          is defined as the ratio of the reflected voltage phasor to the incident 
          voltage phasor at the load terminals (<InlineMath math="d = 0" />). It is 
          calculated directly from the impedances:
        </p>

        <div className="flex justify-center my-6">
          <BlockMath math="\Gamma_L = \frac{Z_L - Z_0}{Z_L + Z_0}" />
        </div>

        <p className="mb-4 text-slate-700">
          Because <InlineMath math="Z_L" /> can be complex, the reflection coefficient 
          is generally a complex number, possessing both a magnitude and a phase shift:
        </p>
        
        <div className="flex justify-center my-6">
          <BlockMath math="\Gamma_L = |\Gamma| e^{j\theta_\Gamma}" />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-6">
          <p className="font-semibold mb-2 text-indigo-900">Fundamental Load Cases:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            <li>
              <strong>Matched Load (<InlineMath math="Z_L = Z_0" />):</strong>{" "}
              <InlineMath math="\Gamma_L = 0" />. All power is absorbed; no reflection.
            </li>
            <li>
              <strong>Short Circuit (<InlineMath math="Z_L = 0" />):</strong>{" "}
              <InlineMath math="\Gamma_L = -1" />. Total reflection with a 180° phase shift.
            </li>
            <li>
              <strong>Open Circuit (<InlineMath math="Z_L = \infty" />):</strong>{" "}
              <InlineMath math="\Gamma_L = 1" />. Total reflection with no phase shift.
            </li>
          </ul>
        </div>
      </div>

      {/* 3 Voltage Standing Wave Ratio (VSWR) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          3. Voltage Standing Wave Ratio (VSWR)
        </h2>

        <p className="mb-4 text-slate-700">
          As the incident and reflected waves pass through each other, they
          constructively and destructively interfere. The places where they add 
          together perfectly are called <strong>antinodes</strong> (<InlineMath math="V_{max}" />), 
          and the places where they cancel each other out are called <strong>nodes</strong> (<InlineMath math="V_{min}" />).
        </p>

        <p className="mb-4 text-slate-700">
          The ratio of the maximum voltage amplitude to the minimum voltage amplitude 
          is known as the Voltage Standing Wave Ratio (VSWR), or simply <InlineMath math="S" />:
        </p>

        <div className="flex justify-center my-6">
          <BlockMath math="\text{VSWR} = S = \frac{V_{max}}{V_{min}} = \frac{1 + |\Gamma_L|}{1 - |\Gamma_L|}" />
        </div>

        <p className="text-slate-700">
          VSWR is always a real number between 1 (for a perfectly matched line) 
          and <InlineMath math="\infty" /> (for a completely mismatched line, like a short or open circuit).
        </p>
      </div>

      {/* 4 Input Impedance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          4. Input Impedance
        </h2>

        <p className="mb-4 text-slate-700">
          Because of the standing waves, the impedance looking into a transmission 
          line changes depending on how far away you are from the load. A transmission 
          line effectively transforms the load impedance.
        </p>

        <p className="mb-4 text-slate-700">
          At a distance <InlineMath math="d" /> from the load (or length <InlineMath math="\ell" />), 
          the input impedance <InlineMath math="Z_{in}" /> is given by the exact transmission line equation:
        </p>

        <div className="flex justify-center my-6">
          <BlockMath math="Z_{in} = Z_0 \frac{Z_L + j Z_0 \tan(\beta d)}{Z_0 + j Z_L \tan(\beta d)}" />
        </div>

        <p className="mb-4 text-slate-700">
          where <InlineMath math="\beta = \frac{2\pi}{\lambda}" /> is the phase constant. This formulation assumes a lossless transmission line.
          This equation reveals several highly useful repeating properties of transmission lines:
        </p>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-6">
          <ul className="list-disc list-inside space-y-3 text-slate-700">
            <li>
              <strong>Half-Wave Line (<InlineMath math="d = \lambda/2" />):</strong>{" "}
              The tangent terms become zero, yielding <InlineMath math="Z_{in} = Z_L" />. 
              The impedance repeats exactly every half-wavelength.
            </li>
            <li>
              <strong>Quarter-Wave Line (<InlineMath math="d = \lambda/4" />):</strong>{" "}
              The tangent terms approach infinity, yielding <InlineMath math="Z_{in} = \frac{Z_0^2}{Z_L}" />. 
              This is the principle behind the Quarter-Wave Transformer.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default TerminatedTransmissionLine;