import { Button } from "@/components/ui/button";
import { BlockMath, InlineMath } from "react-katex";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import "katex/dist/katex.min.css";
import QuarterWaveTransformerVisualization from "@/components/QuarterWaveTransformerVisualization.tsx";

const QuarterWaveTransformer = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Quarter Wave Transformer
      </div>

      {/* Interactive Demo */}
      <div className="pb-12">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>

        <div className="flex justify-center">
          <QuarterWaveTransformerVisualization />
        </div>
      </div>

      {/* 1 Introduction */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Introduction to Quarter-Wave Matching
        </h2>

        <p className="mb-3">
          The quarter-wave transformer is a simple and practical transmission
          line circuit used for impedance matching. It employs a lossless piece
          of transmission line that is exactly one-quarter wavelength long at
          the design frequency:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\ell = \frac{\lambda}{4}" />
        </div>

        <p>
          Its primary purpose is to match a real load impedance to a feedline,
          effectively eliminating standing waves on the main line and making the
          reflection coefficient zero.
        </p>
      </div>

      {/* 2 The Impedance Viewpoint */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          The Impedance Viewpoint
        </h2>

        <p className="mb-4">
          Consider a load resistance <InlineMath math="R_L" /> connected to a
          feedline of characteristic impedance <InlineMath math="Z_0" />. These
          are connected by a matching section of unknown characteristic
          impedance <InlineMath math="Z_1" /> and length{" "}
          <InlineMath math="\ell = \lambda/4" />. The general input impedance
          equation is:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="Z_{in} = Z_1 \frac{R_L + j Z_1 \tan \beta \ell}{Z_1 + j R_L \tan \beta \ell}" />
        </div>

        <p className="mb-4">
          For a quarter-wave section, we evaluate the electrical length{" "}
          <InlineMath math="\beta \ell" />:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\beta \ell = \left(\frac{2\pi}{\lambda}\right)\left(\frac{\lambda}{4}\right) = \frac{\pi}{2}" />
        </div>

        <p className="mb-4">
          By dividing the numerator and denominator by{" "}
          <InlineMath math="\tan \beta \ell" /> and taking the limit as{" "}
          <InlineMath math="\beta \ell \to \pi/2" />, the input impedance
          simplifies significantly to:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="Z_{in} = \frac{Z_1^2}{R_L}" />
        </div>
      </div>

      {/* 3 The Matching Condition */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          The Matching Condition
        </h2>

        <p className="mb-4">
          To achieve a perfect match and eliminate reflections (
          <InlineMath math="\Gamma = 0" />) looking into the matching section,
          the input impedance must equal the characteristic impedance of the
          main line:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="Z_{in} = Z_0" />
        </div>

        <p className="mb-4">
          Substituting our simplified impedance equation yields the required
          characteristic impedance of the matching section:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math="Z_1 = \sqrt{Z_0 R_L}" />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <p className="font-semibold mb-2">Key Insights:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              The required impedance <InlineMath math="Z_1" /> is the{" "}
              <strong>geometric mean</strong> of the load and source impedances.
            </li>
            <li>
              This method is strictly limited to{" "}
              <strong>real load impedances</strong>. Complex loads can be
              matched, but they must first be transformed to a real impedance at
              a single frequency by adding an appropriate length of line.
            </li>
            <li>
              When matched, there are no standing waves on the main feedline (
              <InlineMath math="\text{SWR} = 1" />
              ), but standing waves <em>do</em> exist on the matching section
              itself.
            </li>
          </ul>
        </div>
      </div>

      {/* 4 Frequency Response */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Frequency Response
        </h2>

        <p className="mb-4">
          The exact matching condition applies perfectly only when the section
          is exactly <InlineMath math="\lambda/4" /> long, which occurs at the
          design frequency <InlineMath math="f_0" />. At other frequencies, the
          electrical length changes, resulting in an impedance mismatch.
        </p>

        <p className="mb-4">
          The electrical length <InlineMath math="\beta \ell" /> can be
          expressed in terms of the normalized frequency{" "}
          <InlineMath math="f/f_0" />:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\beta \ell = \left(\frac{2\pi}{\lambda}\right)\left(\frac{\lambda_0}{4}\right) = \left(\frac{2\pi f}{v_p}\right)\left(\frac{v_p}{4 f_0}\right) = \frac{\pi f}{2 f_0}" />
        </div>

        <p className="mb-4">
          The magnitude of the reflection coefficient at any frequency is then
          given by substituting this back into the standard reflection
          coefficient equation:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="|\Gamma| = \left| \frac{Z_{in} - Z_0}{Z_{in} + Z_0} \right|" />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <span className="font-semibold">Bandwidth Implications:</span> For
          higher frequencies (<InlineMath math="f > f_0" />
          ), the matching section looks electrically longer. For lower
          frequencies (<InlineMath math="f < f_0" />
          ), it looks shorter. Perfect matches are repeated periodically at odd
          multiples of <InlineMath math="f_0" /> (where the line behaves as{" "}
          <InlineMath math="3\lambda/4" />, <InlineMath math="5\lambda/4" />,
          etc.).
        </div>
      </div>
      {/* Back to Smith Chart */}
      <div className="flex justify-center mb-10">
        <Link
          to="/smith-chart"
          className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-slate-50 hover:shadow transition-all"
        >
          ← Back to Smith Chart Fundamentals
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="flex justify-center mt-6 pb-10">
          <Button
            onClick={() =>
              navigate("/quiz/transmission-lines/types-of-transmission-line")
            }
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

export default QuarterWaveTransformer;
