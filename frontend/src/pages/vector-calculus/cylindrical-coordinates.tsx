import { Button } from "@/components/ui/button";

const CylindricalCoordinatesPage = () => {
  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Cylindrical Co-ordinate System
      </div>

      <div>
        The differential length element along the φ direction is the length of
        the arc subtended by the angle. This length ρdφ, appears in all
        differential elements in cylindrical coordinates. The differential
        elements in cylindrical elements in cylindrical coordinates can be found
        as follows:
      </div>
      <div className="flex justify-center">
        <img src="assets/vector-calculus/ccs-1.png" className="w-[400px]" />
      </div>

      <div className="font-semibold text-lg">
        1. Differential displacement is given by
      </div>
      <div className="flex justify-center items-center p-8">
        <span className="text-3xl pt-2 font-semibold">dL =</span>
        <img src="assets/vector-calculus/ccs-2.png" className=" h-[50px]" />
      </div>

      <div className="font-semibold text-lg">
        2. Differential normal surface area is given by
      </div>
      <div className="flex justify-center items-center p-8">
        <img
          src="assets/vector-calculus/ccs-3.png"
          alt=""
          className="w-[600px]"
        />
      </div>
      <div className="font-semibold text-lg">
        3. Differential Volume is given by
      </div>
      <img
        src="assets/vector-calculus/ccs-4.png"
        alt=""
        className="w-[200px] mx-auto p-8"
      />

      <div className="flex justify-end mb-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default CylindricalCoordinatesPage;
