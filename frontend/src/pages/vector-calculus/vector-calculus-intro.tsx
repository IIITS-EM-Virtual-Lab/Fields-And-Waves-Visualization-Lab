import { Button } from "@/components/ui/button";

const VectorCalculusIntro = () => {
  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Differential Length , Area and Volume
      </div>

      <div className="">
        Differential elements in length ,area, and volume are useful in Vector
        Calculus, They are defined in the Cartesian, cylindrical, and spherical
        coordinate systems. These concepts are fundamental to understanding
        vector calculus and its applications in various fields, such as physics,
        engineering, and mathematics.
      </div>
      <div className="flex justify-center pl-20">
        <svg width="500" height="300">
          <rect
            x="50"
            y="50"
            width="300"
            height="200"
            fill="lightgray"
            stroke="black"
          />
          <line x1="50" y1="150" x2="350" y2="150" stroke="black" />
          <line x1="200" y1="50" x2="200" y2="250" stroke="black" />
          <text x="60" y="140" font-size="16">
            x
          </text>
          <text x="210" y="240" font-size="16">
            y
          </text>
          <text x="180" y="170" font-size="20">
            Cartesian Coordinate System
          </text>
        </svg>
      </div>

      <div className="text-xl font-black uppercase text-center py-10">
        CARTESIAN COORDINATE SYSTEMS
      </div>
      <div>
        We notice that the differential displacement dl at the point S is the
        vector from point S(x ,y, z) to point B(x + dx, y + dy, z + dz)
      </div>
      <div className="flex justify-center">
        <img
          src="assets/vector-calculus/diff-1.png"
          alt="differential"
          className="h-[400px] w-[600px]"
        />
      </div>
      <div> 1. Differential displacement is given by</div>
      <div>2.Differential normal surface area is given by</div>
      <img
        src="assets/vector-calculus/diff-2.png"
        alt=""
        className="h-[400px] w-[600px] mx-auto p-8"
      />
      <div>3. Differential Volume is given by</div>
      <div className="p-10 flex justify-center text-xl font-bold">
        dV = dx dy dz
      </div>

      <div className="flex justify-end mb-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default VectorCalculusIntro;
