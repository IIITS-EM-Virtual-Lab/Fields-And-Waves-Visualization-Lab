import { Button } from "@/components/ui/button";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useNavigate } from "react-router-dom";
import ElectricDipoleVisualizer from "@/components/ElectricDipoleVisualizer";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';


const ElectricDipolePage = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();
    return (
        <div className="max-w-4xl mx-auto px-6 flex flex-col border-t border-slate-300">
            <div className="text-xl font-black uppercase text-center py-10">
                Electric Dipole
            </div>
            <div className="pb-20">
                <div className="text-xl font-black uppercase text-center py-10">
                    INTERACTIVE DEMO
                </div>
                <div className="flex justify-center">
                    <ElectricDipoleVisualizer />
                </div>
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
                        <BlockMath math="E = \frac{p}{4 \pi \varepsilon_0 r^{3}} \left(2 \cos \theta \, \mathbf{a}_{r} + \sin \theta \, \mathbf{a}_{\theta}\right)"/>
                    </div>
                </div>
            </div>
            <div className="text-xl font-black  py-10">Electric Flux Lines</div>
            <div>
                Electric flux lines, also known as electric field lines, visually
                represent the direction and strength of an electric field in space.
            </div>
              {isAuthenticated ? (
                <div className="flex justify-center mt-4 pr-20">
                    <Button onClick={() => navigate('/quiz/electrostatics/electric-dipole')}>
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

export default ElectricDipolePage;
