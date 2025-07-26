import { Button } from "@/components/ui/button";
import CylindricalVisualizer from "@/components/CylindricalVisualizer";

const CylindricalCoordinatesPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8">
        Cylindrical Co-ordinate System
      </div>

      <div className="pb-10">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <CylindricalVisualizer />
          </div>
        </div>
      </div>

      <div className="text-sm sm:text-base mb-6">
        The differential length element along the φ direction is the length of
        the arc subtended by the angle. This length ρdφ, appears in all
        differential elements in cylindrical coordinates. The differential
        elements in cylindrical elements in cylindrical coordinates can be found
        as follows:
      </div>
      
      <div className="flex justify-center mb-8">
        <img 
          src="assets/vector-calculus/ccs-1.png" 
          className="w-[300px] sm:w-[350px] md:w-[400px] max-w-full h-auto" 
          alt="Cylindrical coordinate system diagram"
        />
      </div>

      <div className="font-semibold text-base sm:text-lg mb-4">
        1. Differential displacement is given by
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 p-4 sm:p-8">
        <span className="text-2xl sm:text-3xl font-semibold">dL =</span>
        <img 
          src="assets/vector-calculus/ccs-2.png" 
          className="h-[40px] sm:h-[50px] max-w-full" 
          alt="Differential displacement formula"
        />
      </div>

      <div className="font-semibold text-base sm:text-lg mb-4">
        2. Differential normal surface area is given by
      </div>
      <div className="flex justify-center items-center p-4 sm:p-8">
        <img
          src="assets/vector-calculus/ccs-3.png"
          alt="Differential surface area formula"
          className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] h-auto"
        />
      </div>
      
      <div className="font-semibold text-base sm:text-lg mb-4">
        3. Differential Volume is given by
      </div>
      <div className="flex justify-center">
        <img
          src="assets/vector-calculus/ccs-4.png"
          alt="Differential volume formula"
          className="w-[150px] sm:w-[180px] md:w-[200px] max-w-full h-auto p-4 sm:p-8"
        />
      </div>
    </div>
  );
};

export default CylindricalCoordinatesPage;