import { Button } from "@/components/ui/button";
import VectorVisualizer from "@/components/VectorVisualizer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/slices/authSlice";

const Scalars = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8">
        Scalars And Vectors
      </div>

      {/* Scalars Section */}
      <div>
        <div className="font-semibold text-lg underline underline-offset-2 mb-4">
          SCALARS
        </div>
        <ul className="list-disc list-inside pl-4 sm:pl-10">
          <li>
            <span className="font-semibold">SCALAR</span>, a physical quantity
            that is completely described by its magnitude.
          </li>
          <div className="italic pt-4">
            Ex: Quantities such as time, mass, distance, temperature, entropy,
            electric potential, population are scalars.
          </div>
        </ul>
      </div>

      {/* Vectors Section */}
      <div>
        <div className="font-semibold text-lg underline underline-offset-2 my-8">
          VECTORS
        </div>

        {/* Interactive Demo */}
        <div className="pb-10">
          <div className="text-xl font-black uppercase text-center py-6">
            INTERACTIVE DEMO
          </div>
          <div className="flex justify-center overflow-x-auto">
            <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
              <VectorVisualizer />
            </div>
          </div>
        </div>

        {/* Vector Explanation */}
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <ul className="list-disc list-inside pl-4 sm:pl-10 w-full lg:w-1/2">
            <li>
              <span className="font-semibold">VECTOR, </span> a physical
              quantity that has both magnitude and direction.
            </li>
            <div className="italic pt-4">
              Ex: Force, velocity, displacement, acceleration, etc.
            </div>
            <div className="pt-8">
              To distinguish between a scalar and a vector, it is customary to
              represent a vector by a letter with an arrow on top, such as A̅
              and B̅, or by a letter in boldface type such as **A** and **B**.
            </div>
          </ul>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/assets/vector-algebra/vector-image.png"
              alt="Vector Example"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Unit Vector Section */}
      <div className="uppercase font-black text-xl sm:text-2xl text-center mt-20">
        Unit Vector
      </div>

      <div className="py-4">
        A vector <span className="font-bold">V</span> has both magnitude and
        direction. The magnitude of <span className="font-bold">V</span> is a
        scalar written as <span className="font-bold">V</span> or{" "}
        <span className="font-bold">|V|</span>. A unit vector **v** along V is
        defined as a vector whose magnitude is unity (i.e., 1) and its direction
        is along V, that is:
      </div>

      <div className="flex justify-center py-8">
        <img
          src="/assets/vector-algebra/unit-vector.png"
          alt="Unit Vector Formula"
          className="w-[200px] max-w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            Note that <span>|v̂|</span> = 1.
          </div>
          <div>
            A vector V in Cartesian (or rectangular) coordinates may be
            represented as:
          </div>
          <div>
            <img
              src="/assets/vector-algebra/unit-v.png"
              alt="Vector Representation"
              className="max-w-full h-auto py-4"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/assets/vector-algebra/unit-vector-graph.png"
            alt="Unit Vector Graph"
            className="max-w-full h-auto px-4 sm:px-12 md:px-24"
          />
        </div>
      </div>

      {/* Button or Login Notice */}
      {isAuthenticated ? (
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/quiz/vector-algebra/scalars")}>
            Take Test
          </Button>
        </div>
      ) : (
        <div className="text-center text-sm sm:text-base text-[#a00032] mt-6">
          Please log in to take the test.
        </div>
      )}
    </div>
  );
};

export default Scalars;