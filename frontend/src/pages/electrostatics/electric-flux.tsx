import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";
import { useNavigate } from "react-router-dom";
import ElectricFluxDensityVisualizer from "@/components/ElectricFluxDensityVisualizer";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

const ElectricFluxPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  return (
  <div className="max-w-4xl mx-auto px-6 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Electric Flux Density
      </div>
        <div className="pb-20">
          <div className="text-xl font-black uppercase text-center py-10">
            INTERACTIVE DEMO
          </div>
          <div className="flex justify-center">
            <ElectricFluxDensityVisualizer />
          </div>
        </div>
      <div className="text-lg">
        <div>
          Electric flux is defined as the total number of electric lines of
          force emanating from a charged body. An electric field is represented
          by electric flux.
        </div>
        <div className="pt-8">Vector Field is defined by</div>
        <div className=" text-2xl">
          <BlockMath math="D=\varepsilon{E}" />
        </div>
        <div>We can write the Electric Flux Density &#936; in terms of D</div>
        <div className=" text-2xl">
          <BlockMath
            math="\psi=\int_{s}D.dS
"
          />
        </div>{" "}
        <div>
          Electric Flux Density is measured in coulombs per square meter. The
          electric flux density is also called as Electric displacement.
        </div>
        <div>
          <div className="pt-8">For an infinite sheet of charge,</div>
          <div className=" text-2xl">
            <BlockMath
              math="
            D=\frac{\rho_{s}a_{n}}{2}
"
            />
          </div>
          <div>For a volume charge distributions, eqs are</div>
        </div>
      </div>
      {/* 
      <div>
        1. The Differential elements in spherical coordinates can be found as:
      </div>
      <div>2. The Differential normal surface area is</div>
      <div>3. The Differential Volume is</div> */}
 {isAuthenticated ? (
  <div className="flex justify-center mt-4 pr-20">
    <Button onClick={() => navigate('/quiz/electrostatics/electric-flux')}>
      Take Test
    </Button>
  </div>
) : (
  <div className="text-center text-medium text-[#a00032] mt-4">
    Please log in to take the test.
  </div>
)}
    </div>
  );
};

export default ElectricFluxPage;
