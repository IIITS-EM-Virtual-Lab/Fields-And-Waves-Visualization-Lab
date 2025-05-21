import { Button } from "@/components/ui/button";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

const ElectricDipolePage = () => {
  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Electric Dipole
      </div>
      <div>
        <div>
          An electrical dipole consists of two equal and opposite charges
          separated by a small distance. The dipole moment is a vector quantity
          that points from the negative charge to the positive charge and has a
          magnitude equal to the product of the magnitude of one of the charges
          and the distance between them.
        </div>
        <div className="text-lg underline mt-4 font-bold ">
          Applications of Electric Dipole
        </div>
        <div>
          <p>
            Electrical dipoles are used in a variety of applications, including:
          </p>
          <ol className="pl-10 font-bold">
            <li>Antennas</li>
            <li>Motors</li>
            <li>Generators</li>
            <li>Capacitors</li>
            <li>Magnetic resonance imaging (MRI)</li>
          </ol>
        </div>
        <div className="text-lg underline mt-4 font-bold ">
          Electric Field of an Electric Dipole
          <div className="text-2xl">
            <BlockMath math="\vec{E} = \frac{1}{4 \pi \varepsilon_0} \frac{2qs}{r^{3}} \left[\hat{r} - (\hat{r} \cdot \hat{p}) \hat{p}\right]" />
          </div>
        </div>
        <div className="text-lg underline mt-4 font-bold ">
          Potential of an Electric Dipole
          <div className="text-2xl">
            <BlockMath math="V = \frac{1}{4 \pi \varepsilon_0} \frac{2qs}{r^{2}} \left[1 - (\hat{r} \cdot \hat{p})\right]" />
          </div>
        </div>
        <div>
          The electric field due to the dipole with center at the origin, can be
          obtained readily as
          <div className="text-2xl">
            <BlockMath math="E = -\nabla V = -\left[\frac{\partial V}{\partial r} \mathbf{a}_{r} + \frac{1}{r} \frac{\partial V}{\partial \theta} \mathbf{a}_{\theta}\right]" />
          </div>
          <div className="pt-8 text-2xl">
            <BlockMath
              math="
E = \frac{p}{4 \pi \varepsilon_0 r^{3}} \left(2 \cos \theta \, \mathbf{a}_{r} + \sin \theta \, \mathbf{a}_{\theta}\right)
"
            />
          </div>
        </div>
      </div>
      <div className="text-xl font-black  py-10">Electric Flux Lines</div>
      <div>
        Electric flux lines, also known as electric field lines, visually
        represent the direction and strength of an electric field in space.
      </div>
      <div className="p-10 flex justify-center items-center">
        <iframe
          src="https://www.geogebra.org/material/iframe/id/m4sQ9jeT//width/873/height/500/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
          width="873px"
          height="500px"
        ></iframe>
      </div>
      <div className="flex justify-end mb-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default ElectricDipolePage;
