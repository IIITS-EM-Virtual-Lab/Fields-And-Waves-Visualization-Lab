import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";

const ElectricPotentialPage = () => {
  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Electric Potential
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
      <div className="p-10 flex justify-center items-center">
        <iframe
          src="https://www.geogebra.org/material/iframe/id/gpTWDmv3//width/800/height/600/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
          width="800"
          height="600"
          allowFullScreen
          style={{
            border: "1px solid #e4e4e4",
            borderRadius: "4px",
          }}
        ></iframe>
      </div>

      <div className="flex justify-end mb-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default ElectricPotentialPage;
