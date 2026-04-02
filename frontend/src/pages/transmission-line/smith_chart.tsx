import SmithChartCalculator from "@/components/SmithChartCalculator.tsx";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const SmithChart = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">

      {/* Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Smith Chart
      </div>

      {/* Interactive Demo */}
      <div className="pb-12">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>

        <div className="flex justify-center">
          <SmithChartCalculator />
        </div>
      </div>

      {/* 1 Definition */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Definition
        </h2>

        <p>
          The Smith Chart is a graphical representation of the reflection
          coefficient and impedance of a transmission line.  
          The chart is drawn inside a circle of unit radius.
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="|\Gamma| \le 1" />
        </div>
      </div>

      {/* 2 Reflection Coefficient */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Reflection Coefficient
        </h2>

        <p className="mb-4">
          The Smith Chart is based on the relationship between load
          impedance and the reflection coefficient.
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\Gamma = \frac{Z_L - Z_0}{Z_L + Z_0}" />
        </div>
      </div>

      {/* 3 Normalized Impedance */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Normalized Impedance
        </h2>

        <p className="mb-4">
          To make the chart independent of the characteristic impedance,
          the impedance is normalized as
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="z_L = \frac{Z_L}{Z_0}" />
        </div>

        <p>
          Substituting in the reflection coefficient equation gives
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\Gamma = \frac{z_L - 1}{z_L + 1}" />
        </div>
      </div>

      {/* 4 Complex Impedance Representation */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Complex Form of Impedance
        </h2>

        <p>
          The normalized impedance is expressed as
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="z_L = r + jx" />
        </div>

        <p>
          where
        </p>

        <ul className="list-disc pl-6 mt-3">
          <li><InlineMath math="r" /> = normalized resistance</li>
          <li><InlineMath math="x" /> = normalized reactance</li>
        </ul>
      </div>

      {/* 5 Real and Imaginary Components */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Real and Imaginary Parts of Reflection Coefficient
        </h2>

        <p>
          The reflection coefficient is expressed as
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\Gamma = \Gamma_r + j\Gamma_i" />
        </div>

        <p>
          where
        </p>

        <ul className="list-disc pl-6 mt-3">
          <li><InlineMath math="\Gamma_r" /> = real part</li>
          <li><InlineMath math="\Gamma_i" /> = imaginary part</li>
        </ul>
      </div>

      {/* 6 Constant Resistance Circles */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Constant Resistance Circles
        </h2>

        <p className="mb-4">
          The equation of constant resistance circle is obtained as
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="(\Gamma_r - \frac{r}{1+r})^2 + \Gamma_i^2 = (\frac{1}{1+r})^2" />
        </div>

        <p>
          This represents a circle with center
          <InlineMath math="(\frac{r}{1+r},0)" /> and radius
          <InlineMath math="\frac{1}{1+r}" />.
        </p>
      </div>

      {/* 7 Constant Reactance Circles */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Constant Reactance Circles
        </h2>

        <p className="mb-4">
          The equation for constant reactance is
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="(\Gamma_r - 1)^2 + (\Gamma_i - \frac{1}{x})^2 = (\frac{1}{x})^2" />
        </div>

        <p>
          This circle has center
          <InlineMath math="(1,\frac{1}{x})" /> and radius
          <InlineMath math="\frac{1}{|x|}" />.
        </p>
      </div>

      {/* 8 Plotting on Smith Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Procedure to Plot a Point on the Smith Chart
        </h2>

        <ol className="list-decimal pl-6 space-y-3">
          <li>
            Normalize the load impedance, {" "}
            <InlineMath math=" z_L = \frac{Z_L}{Z_0}" />.
          </li>
          <li>
            Express the normalized impedance in complex form, {" "}
            <InlineMath math=" z_L = r + jx" />.
          </li>
          <li>
            Locate the constant resistance circle corresponding
            to <InlineMath math="r" />.
          </li>
          <li>
            Locate the constant reactance arc corresponding
            to <InlineMath math="x" />.
          </li>
          <li>
            The intersection of the resistance circle and
            reactance arc represents the normalized impedance
            point on the Smith Chart.
          </li>
          <li>
            The distance of this point from the origin represents
            the magnitude of the reflection coefficient
            <InlineMath math="|\Gamma|" />.
          </li>
        </ol>
      </div>

      {/* 9 Introduction to Admittance */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Introduction to Admittance
        </h2>

        <p className="mb-4">
          In many transmission line problems, especially those involving parallel connections (shunt components), it is mathematically simpler to work with admittance instead of impedance. Admittance is the reciprocal of impedance:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="Y = \frac{1}{Z}" />
        </div>

        <p>
          Where the characteristic admittance is <InlineMath math="Y_0 = \frac{1}{Z_0}" />.
        </p>
      </div>

      {/* 10 Normalized Admittance */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Normalized Admittance
        </h2>

        <p className="mb-4">
          Similar to impedance, admittance is normalized relative to the characteristic admittance of the line:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="y_L = \frac{Y_L}{Y_0} = \frac{Z_0}{Z_L} = \frac{1}{z_L}" />
        </div>

        <p>
          The reflection coefficient expressed in terms of normalized admittance becomes:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="\Gamma = \frac{1 - y_L}{1 + y_L} = -\frac{y_L - 1}{y_L + 1}" />
        </div>
      </div>

      {/* 11 Complex Form of Admittance */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-10">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Complex Form of Admittance
        </h2>

        <p>
          The normalized admittance is expressed in rectangular coordinates as:
        </p>

        <div className="flex justify-center my-4">
          <BlockMath math="y_L = g + jb" />
        </div>

        <p>
          where
        </p>

        <ul className="list-disc pl-6 mt-3">
          <li><InlineMath math="g" /> = normalized conductance</li>
          <li><InlineMath math="b" /> = normalized susceptance</li>
        </ul>
      </div>

      {/* 12 Admittance Chart Geometry */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-12">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          Admittance Chart Geometry
        </h2>

        <p className="mb-4">
          Because <InlineMath math="\Gamma(y_L) = -\Gamma(z_L)" />, an Admittance (Y) Smith Chart is geometrically identical to an Impedance (Z) Smith Chart, but rotated by <InlineMath math="180^\circ" /> (<InlineMath math="\pi" /> radians).
        </p>

        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Constant Conductance (<InlineMath math="g" />) Circles:</strong> These are identical in shape to the constant resistance circles but are tangent to the extreme <em>left</em> side of the chart (at <InlineMath math="\Gamma = -1" />).
          </li>
          <li>
            <strong>Constant Susceptance (<InlineMath math="b" />) Arcs:</strong> These mirror the reactance arcs but originate from the left side. Positive susceptance (<InlineMath math="+jb" />, capacitive) is on the top half, and negative susceptance (<InlineMath math="-jb" />, inductive) is on the bottom half.
          </li>
          <li>
            <strong>Graphical Conversion:</strong> Converting <InlineMath math="z_L" /> to <InlineMath math="y_L" /> graphically simply requires drawing a line through the origin (center) to the diametrically opposite point on the constant VSWR circle.
          </li>
        </ul>
      </div>

    </div>
  );
};

export default SmithChart;