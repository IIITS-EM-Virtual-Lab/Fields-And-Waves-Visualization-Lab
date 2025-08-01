import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";
import { useNavigate } from "react-router-dom";
import ElectricPotentialVisualizer from "@/components/ElectricPotentialVisualizer";
import ElectricPotentialGraph from "@/components/ElectricPotentialGraph";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

const ElectricPotentialPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-6 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Electric Potential
      </div>
      <div className="pb-20">
          <div className="text-xl font-black uppercase text-center py-10">
            INTERACTIVE DEMO
          </div>
          <div className="flex justify-center">
            <ElectricPotentialVisualizer />
          </div>
          <div className="flex justify-center">
            <ElectricPotentialGraph />
          </div>
        </div>
      <div>
        Electrical potential, often referred to as voltage, is the measure of
        the electric potential energy per unit charge at a specific point in an
        electric field. In simpler terms, it's the force that pushes electric
        charges along a pathway. Higher voltage means more potential energy
        available to move charges, while lower voltage means less. Voltage is
        essential for powering electronic devices and enabling the flow of
        electricity in circuits.
      </div>
      <div>
        From Coulomb's law, the force on Q is F = QE so that the work done in
        displacing the charge by dl is
      </div>
      <div className="text-2xl">
        <BlockMath math="dW = -F \cdot dl = -qE \cdot dl" />
      </div>
      <div>
        The negative sign indicates that the work is done by an external agent,
        thus the work done or the potential energy required is{" "}
      </div>
      <div className="text-2xl">
        <BlockMath math="W=-Q\int_{A}^{B}E.dl" />
      </div>
      <div>
        If the field is due to a point charge Q located at the origin, then{" "}
      </div>
      <div className="text-2xl">
        <BlockMath
          math="
E = \frac{Q}{4\pi\varepsilon r^{2}}a_{r}
"
        />
      </div>
      <div>
        If the point charge Q is not located at the origin but at a point whose
        position vector is , the potential V(x, y, z) or simply V(r) at r
        becomes
      </div>
      <div className="text-2xl">
        <BlockMath
          math="
V(r) = \frac{Q}{4\pi\varepsilon\begin{vmatrix}r-{r}'\end{vmatrix}}
"
        />
      </div>

 {isAuthenticated ? (
  <div className="flex justify-center mt-4 pr-20">
    <Button onClick={() => navigate('/quiz/electrostatics/electric-potential')}>
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

export default ElectricPotentialPage;
