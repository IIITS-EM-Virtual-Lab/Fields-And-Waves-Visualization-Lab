import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";

const ElectricFluxPage = () => {
  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Electric Flux Density
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
      <div className="flex justify-center py-10">
        <iframe
          scrolling="no"
          src="https://www.geogebra.org/material/iframe/id/2270909/width/1180/height/627/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
          width="1180px"
          height="627px"
        ></iframe>
      </div>
      {/* 
      <div>
        1. The Differential elements in spherical coordinates can be found as:
      </div>
      <div>2. The Differential normal surface area is</div>
      <div>3. The Differential Volume is</div> */}

      <div className="flex justify-end mb-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default ElectricFluxPage;
