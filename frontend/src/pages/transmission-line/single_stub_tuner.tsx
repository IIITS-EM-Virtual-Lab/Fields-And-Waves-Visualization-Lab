import { Button } from "@/components/ui/button";
import { BlockMath, InlineMath } from "react-katex";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import "katex/dist/katex.min.css";
import SingleStubTunerVisualization from "@/components/SingleStubTunerVisualization.tsx";

const SingleStubTuner = () => {
      const isAuthenticated = useSelector(selectIsAuthenticated);
      const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Single Stub Tuner
      </div>

      {/* Interactive Demo */}
      <div className="pb-12">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>

        <div className="flex justify-center">
          <SingleStubTunerVisualization />
        </div>
      </div>

      {/* 1 Introduction */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Introduction to Single-Stub Matching
        </h2>

        <p className="mb-4">
          The main disadvantage of the quarter-wave transformer is that it is a
          narrow-band device and requires inserting a transmission line
          component directly in series with the main feedline. This drawback is
          eliminated by using a <strong>single-stub tuner</strong>.
        </p>

        <p>
          A single-stub tuner consists of an open or shorted section of
          transmission line of length <InlineMath math="l" /> connected in
          parallel (shunt) with the main line at some distance{" "}
          <InlineMath math="d" /> from the load. Notably, the stub usually has
          the <em>same characteristic impedance</em> (<InlineMath math="Z_0" />)
          as the main line.
        </p>
      </div>

      {/* 2 Why Shunt and Short-Circuited? */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Why Shunt and Short-Circuited Stubs?
        </h2>

        <p className="mb-4">
          While it is theoretically possible to use a series stub, it is
          significantly more difficult to physically implement and wire in
          coaxial or microstrip circuits. Therefore,{" "}
          <strong>shunt (parallel) stubs</strong> are overwhelmingly preferred.
        </p>

        <p className="mb-4">
          Furthermore, stubs can be terminated in either an open circuit or a
          short circuit. However, an open-circuited stub acts like an antenna
          and <strong>radiates some energy at high frequencies</strong>.
          Consequently, <strong>shunt short-circuited parallel stubs</strong>{" "}
          are the most common configuration in high-frequency RF and microwave
          engineering.
        </p>
      </div>

      {/* 3 The Admittance Viewpoint */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          The Admittance Viewpoint
        </h2>

        <p className="mb-4">
          Because the stub is connected in parallel with the main transmission
          line, it is mathematically much easier to work with{" "}
          <strong>admittance</strong> (<InlineMath math="Y" />) rather than
          impedance (<InlineMath math="Z" />
          ). Admittances in parallel simply add together.
        </p>

        <p className="mb-4">
          Our ultimate goal for perfect matching is to make the input admittance
          equal to the characteristic admittance of the line (
          <InlineMath math="Y_{in} = Y_0" />
          ). Using normalized admittance (<InlineMath math="y = Y / Y_0" />
          ), the matching condition becomes:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="y_{in} = 1 + j0" />
        </div>
      </div>

      {/* 4 Finding the Distance (d) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Finding the Distance (<InlineMath math="d" />)
        </h2>

        <p className="mb-4">
          We must first locate a point on the transmission line where the real
          part of the normalized admittance is exactly equal to 1. On an
          Admittance Smith Chart, this corresponds to the locus{" "}
          <InlineMath math="g = 1" /> (which geometrically looks like the{" "}
          <InlineMath math="r=1" /> circle rotated 180 degrees).
        </p>

        <p className="mb-4">
          By moving away from the normalized load admittance (
          <InlineMath math="y_L" />) toward the generator along a constant VSWR
          circle, we will eventually intersect the <InlineMath math="g = 1" />{" "}
          circle. At this intersection point, located at a distance{" "}
          <InlineMath math="d" /> from the load, the admittance of the line is:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="y(d) = 1 + jb" />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <span className="font-semibold">Multiple Solutions:</span> Because the
          VSWR circle intersects the <InlineMath math="g = 1" /> circle at two
          distinct points, there are always{" "}
          <strong>two mathematical solutions</strong> for the distance{" "}
          <InlineMath math="d" /> (often referred to as{" "}
          <InlineMath math="d_1" /> and <InlineMath math="d_2" />) within the
          first half-wavelength.
        </div>
      </div>

      {/* 5 Finding the Stub Length (l) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Finding the Stub Length (<InlineMath math="l" />)
        </h2>

        <p className="mb-4">
          Once we are at distance <InlineMath math="d" />, our line has an
          unwanted reactive component, <InlineMath math="+jb" />. To cancel this
          out, we attach a parallel stub designed to provide an input
          susceptance of exactly the opposite value:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="y_s = -jb" />
        </div>

        <p className="mb-4">
          When connected in parallel, the total normalized input admittance
          becomes perfectly matched:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="y_{in} = y(d) + y_s = (1 + jb) + (-jb) = 1 + j0" />
        </div>

        <p className="mb-4">
          The length of the stub <InlineMath math="l" /> is determined by
          finding the distance from the stub's termination point to the desired
          susceptance <InlineMath math="y_s = -jb" /> on the outer edge of the
          Smith Chart (where <InlineMath math="g = 0" />
          ).
        </p>

        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>For a Shorted Stub:</strong> The termination point is{" "}
            <InlineMath math="y_L' = \infty" /> (the far right edge of the
            admittance chart).
          </li>
          <li>
            <strong>For an Open Stub:</strong> The termination point is{" "}
            <InlineMath math="y_L' = 0" /> (the far left edge of the admittance
            chart).
          </li>
        </ul>
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
              navigate("/quiz/transmission-lines/single-stub-tuner")
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

export default SingleStubTuner;