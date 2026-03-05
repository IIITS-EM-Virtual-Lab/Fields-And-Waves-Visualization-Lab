import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TransmissionLineTypesVisualizer from "@/components/TransmissionLineTypesVisualizer.tsx"
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const TypesOfTransmissionLine = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">

      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Types of Transmission Line
      </div>

      <div className="pb-10">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center">
          <TransmissionLineTypesVisualizer />
        </div>
      </div>

      {/* 1) Lossless Transmission Line */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          1) Lossless Transmission Line
        </h2>

        <p className="mb-3">
          A transmission line is lossless if the conductors are perfect and the dielectric is lossless:
        </p>

        <div className="flex justify-center my-3">
          <InlineMath math="R = 0, \quad G = 0." />
        </div>

        <p className="mt-4 font-medium">Results:</p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math="\alpha = 0" />
          <BlockMath math="\gamma = j\beta = j\omega\sqrt{LC}" />
          <BlockMath math="Z_0 = \sqrt{\dfrac{L}{C}}" />
          <BlockMath math="u = \dfrac{\omega}{\beta} = \dfrac{1}{\sqrt{LC}}" />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <p className="font-semibold mb-2">Implications:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>No attenuation (<InlineMath math="\alpha = 0" />)</li>
            <li>Phase constant <InlineMath math="\beta" /> is proportional to frequency</li>
            <li><InlineMath math="Z_0" /> is real</li>
            <li>No distortion of waveform due to frequency-dependent attenuation</li>
          </ul>
        </div>
      </div>

      {/* 2) Distortionless Transmission Line */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          2) Distortionless Transmission Line
        </h2>

        <p className="mb-2">A distortionless line is one in which:</p>

        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>The attenuation constant <InlineMath math="\alpha" /> is independent of frequency</li>
          <li>The phase constant <InlineMath math="\beta" /> is linearly dependent on frequency</li>
        </ul>

        <p className="font-medium">Heaviside condition:</p>
        <div className="flex justify-center my-3">
          <InlineMath math="\dfrac{R}{L} = \dfrac{G}{C}" />
        </div>

        <p className="mt-4 font-medium">Results:</p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math="\alpha = \sqrt{RG}" />
          <BlockMath math="\beta = \omega\sqrt{LC}" />
          <BlockMath math="Z_0 = \sqrt{\dfrac{L}{C}} = \sqrt{\dfrac{R}{G}}" />
          <BlockMath math="u = \dfrac{1}{\sqrt{LC}}" />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <p className="font-semibold mb-2">Implications:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Waveform shape is preserved (no distortion)</li>
            <li>Attenuation occurs but is frequency independent</li>
            <li>Phase velocity is independent of frequency</li>
            <li>
              <InlineMath math="u" /> and <InlineMath math="Z_0" /> are the same as for lossless lines
            </li>
          </ul>
        </div>
      </div>

      {/* 3) Lossy Transmission Line */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          3) Lossy Transmission Line (General Case)
        </h2>

        <p className="mb-3">
          The transmission line considered in general has imperfect conductors and a lossy dielectric:
        </p>

        <div className="flex justify-center my-3">
          <InlineMath math="R \neq 0, \quad G \neq 0." />
        </div>

        <p className="mt-4 font-medium">
          Propagation constant and characteristic impedance:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math="\gamma = \sqrt{(R + j\omega L)(G + j\omega C)}" />
          <BlockMath math="Z_0 = \sqrt{\dfrac{R + j\omega L}{G + j\omega C}}" />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <span className="font-semibold">Physical implication:</span>{" "}
          Since the attenuation constant <InlineMath math="\alpha" /> is frequency dependent,
          different frequency components are attenuated differently. Hence, signal distortion occurs in a lossy line.
        </div>
      </div>

      {isAuthenticated ? (
        <div className="flex justify-center mt-6 pb-10">
          <Button
            onClick={() => navigate("/quiz/transmission-lines/types-of-transmission-line")}
            className="px-8 py-5 text-base"
          >
            Take Test
          </Button>
        </div>
      ) : (
        <div className="text-center text-sm sm:text-base text-[#a00032] mt-6 pb-10">
          Please log in to take the test.
        </div>
      )}
    </div>
  );
};

export default TypesOfTransmissionLine;
