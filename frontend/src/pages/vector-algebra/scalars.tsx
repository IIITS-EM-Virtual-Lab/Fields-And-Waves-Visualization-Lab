import { Button } from "@/components/ui/button";
import VectorVisualizer from "@/components/VectorVisualizer"; 

const Scalars = () => {

  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Scalars And Vectors
      </div>
      <div>
        <div className="font-semibold text-lg underline underline-offset-2 mb-6">
          SCALARS
        </div>
        <ul className="list-disc list-inside pl-10">
          <li>
            <span className="font-semibold">SCALAR</span>, a physical quantity
            that is completely described by its magnitude.
          </li>
          <div className="italic pt-4">
            Ex: Quantities Such as time, mass, distance, temperature, entropy,
            electric potential, population are scalars.
          </div>
        </ul>
      </div>
      <div>
        <div className="font-semibold text-lg underline underline-offset-2 mb-6  mt-12">
          VECTORS
        </div>
        <div className="pb-10">
          <div className="text-xl font-black uppercase text-center py-10">
            INTERACTIVE DEMO
          </div>
          <div className="flex justify-center">
            <VectorVisualizer />
          </div>
        </div>
        <div className="flex justify-between    ">
          <ul className="list-disc list-inside pl-10 w-1/2">
            <li>
              <span className="font-semibold">VECTOR, </span> a physical
              quantity that has both magnitude and direction.
            </li>
            <div className="italic pt-4">
              Ex: Quantities Such as time, mass, distance, temperature, entropy,
              electric potential, population are scalars.
            </div>
            <div className="pt-12">
              To distinguish between a scalar and a vector it is a customary to
              represent a vector by a letter with an arrow the top of it, such
              as A-bar and B-bar, or by a letter in boldface type such as A and
              B.
            </div>
          </ul>
          <img src="/assets/vector-algebra/vector-image.png" className="" />
        </div>
      </div>

      <div className="uppercase font-black text-xl text-center mt-40">
        Unit Vector
      </div>
      <div>
        <div className="py-4">
          A Vector <span className="font-bold">V</span> has both magnitude and
          direction. The magnitude of <span className="font-bold">V</span> is a
          scalar written as <span className="font-bold">V</span> or{" "}
          <span className="font-bold">|V|</span>. A unit vector v along V is
          defined as a vector whose magnitude is unity (i.e.,1) and it's
          direction is along V, that is
        </div>
        <div className="flex justify-center py-8">
          <img
            src="/assets/vector-algebra/unit-vector.png"
            className=""
            width={200}
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <div>
            Note that <span>|v^|</span> = 1.
          </div>
          <div>
            A vector V in cartesian (or rectangular) coordinates may be
            represented as
          </div>
          <div className="py-8">
            <img src="/assets/vector-algebra/unit-v.png" className="" />
          </div>
        </div>
        <div className="p-10 flex w-1/2">
          <img
            src="/assets/vector-algebra/unit-vector-graph.png"
            alt=""
            className="p-24"
          />
        </div>
      </div>

      <div className="flex justify-end m-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default Scalars;
