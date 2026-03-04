import { Button } from "@/components/ui/button";
import SphericalVisualizer from "@/components/SphericalVisualizer";
import { BlockMath } from "react-katex";

const SphericalCoordinatesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Spherical coordinate systems
      </div>
      <div className="pb-20">
        <div className="text-xl font-black uppercase text-center py-10">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center">
          <SphericalVisualizer />
        </div>
      </div>
      <div>
        1. The Differential elements in spherical coordinates can be found as:
      </div>
      <div className="flex justify-center items-center">
        <img src="assets/vector-calculus/scs-1.png" alt="image" className="w-[300px] h-[300px]"/>
      </div>
      <div>2. The Differential normal surface area is</div>
      <div className="flex justify-center items-center">
        <img src="assets/vector-calculus/scs-3.png" alt="image" className="w-[700px] h-[400px] p-10"/>
      </div>
      <div>3. The Differential Volume is</div>
      <div className="flex justify-center gap-4 text-xl items-center">
        dV = <div className="text-lg sm:text-xl md:text-2xl">
    <BlockMath math={`r^2 \\sin\\theta\\, dr\\, d\\theta\\, d\\phi`} />
  </div>
      </div>



    </div>
  );
};

export default SphericalCoordinatesPage;
