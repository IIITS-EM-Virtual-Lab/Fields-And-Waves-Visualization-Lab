import { BlockMath } from "react-katex";
import DistributedModelSimulator from "../../components/DistributedModelSimulator";




const CharacteristicImpedancePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-center py-8 text-gray-900">
        Characteristic Impedance
      </div>

      {/*  definition  */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-4">
        Definition
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        The characteristic impedance of a transmission line is defined as the
        ratio of the positively traveling voltage wave to the current wave at
        any point on the line.
      </div>

      <div className="overflow-x-auto mb-6">
        <div className="min-w-[200px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="Z_0 = \frac{V^{+}}{I^{+}}" />
        </div>
      </div>

      {/* general expression  */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-4">
        General Expression
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        For a transmission line characterized by distributed parameters
        resistance <b>R</b>, inductance <b>L</b>, conductance <b>G</b>, and
        capacitance <b>C</b>, the characteristic impedance is given by:
      </div>

      <div className="overflow-x-auto mb-6">
        <div className="min-w-[350px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="Z_0 = \sqrt{\frac{R + j\omega L}{G + j\omega C}} = R_0 + jX_0" />
        </div>
      </div>

      {/* physical interpretation */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-4">
        Physical Interpretation
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        Characteristic impedance represents the impedance that a transmission
        line presents to a travelling wave. If the line is terminated in a load
        equal to <b>Z₀</b>, no reflections occur and all the incident power is
        absorbed by the load.
      </div>

      {/*  matching */}
      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-4">
        Impedance Matching
      </div>
      <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
        When the load impedance{" "}
        <b>
          Z<sub>L</sub>
        </b>{" "}
        is equal to the characteristic impedance <b>Z₀</b>, the transmission
        line is said to be matched. In this case, the reflected wave is zero.
      </div>

      <div className="overflow-x-auto mb-6">
        <div className="min-w-[200px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath math="Z_L = Z_0 \Rightarrow \Gamma = 0" />
        </div>
      </div>

      {/* table */}

      <div className="text-lg sm:text-xl font-bold text-gray-900 mt-10 mb-4">
        Transmission Line Characteristics
      </div>

      <div className="overflow-x-auto mt-10 mb-10">
        <div className="min-w-[700px] text-center text-lg sm:text-xl lg:text-2xl">
          <BlockMath
            math={`
                \\begin{array}{|c|c|c|}
                \\hline
                \\textbf{Case} 
                & \\textbf{Propagation Constant } \\gamma = \\alpha + j\\beta 
                & \\textbf{Characteristic Impedance } Z_0 = R_0 + jX_0 \\\\
                \\hline
                \\text{General} 
                & \\sqrt{(R + j\\omega L)(G + j\\omega C)} 
                & \\sqrt{\\dfrac{R + j\\omega L}{G + j\\omega C}} \\\\
                \\hline
                \\text{Lossless} 
                & j\\omega \\sqrt{LC} 
                & \\sqrt{\\dfrac{L}{C}} + j0 \\\\
                \\hline
                \\text{Distortionless} 
                & \\sqrt{RG} + j\\omega \\sqrt{LC} 
                & \\sqrt{\\dfrac{L}{C}} + j0 \\\\
                \\hline
                \\end{array}
                `}
          />
        </div>
      </div>

      <DistributedModelSimulator />
      
     

    </div>
  );
};

export default CharacteristicImpedancePage;
