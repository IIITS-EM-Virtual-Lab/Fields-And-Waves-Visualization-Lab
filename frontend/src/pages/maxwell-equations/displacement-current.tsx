import React from 'react';
import Latex from 'react-latex-next';
import DisplacementCurrentVisualizer from '@/components/DisplacementCurrentVisualizer';

const DisplacementCurrent: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-center py-8 text-gray-900">
                Displacement Current
            </div>

            <div className="pb-10 sm:pb-20">
                <div className="text-xl font-black uppercase text-center py-6">
                    INTERACTIVE DEMO
                </div>
                <div className="flex justify-center overflow-x-auto">
                    <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
                        <DisplacementCurrentVisualizer />
                    </div>
                </div>
            </div>

            <div className="space-y-6 sm:space-y-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                <p>
                    The concept of displacement current was introduced by James Clerk Maxwell to modify Ampère's Law and make it consistent with the continuity equation. 
                    Displacement current is not an actual current of moving charges, but a term added to Ampère's Law to account for the changing electric field in situations where there is no physical current.
                </p>

                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Maxwell's Equations:</h3>
                    <ul className="space-y-3 sm:space-y-4">
                        <li className="overflow-x-auto">
                            <div className="min-w-[300px]">
                                <Latex>{`Gauss's Law for Electricity: \\( \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0} \\)`}</Latex>
                            </div>
                        </li>
                        <li className="overflow-x-auto">
                            <div className="min-w-[200px]">
                                <Latex>{`Gauss's Law for Magnetism: \\( \\nabla \\cdot \\mathbf{B} = 0 \\)`}</Latex>
                            </div>
                        </li>
                        <li className="overflow-x-auto">
                            <div className="min-w-[350px]">
                                <Latex>{`Faraday's Law of Induction: \\( \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} \\)`}</Latex>
                            </div>
                        </li>
                        <li className="overflow-x-auto">
                            <div className="min-w-[450px]">
                                <Latex>{`Ampère's Law (with Maxwell's correction): \\( \\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\)`}</Latex>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Displacement Current Density:</h3>
                    <div className="overflow-x-auto">
                        <div className="min-w-[400px] text-sm sm:text-base lg:text-lg">
                            <Latex>{`
                                The displacement current density \\( \\mathbf{J}_D \\) is given by:
                                \\( \\mathbf{J}_D = \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\).
                                This term is added to the conduction current density \\( \\mathbf{J} \\) in Ampère's Law to form the modified equation:
                                \\( \\nabla \\times \\mathbf{B} = \\mu_0 (\\mathbf{J} + \\mathbf{J}_D) \\).
                            `}</Latex>
                        </div>
                    </div>
                </div>

                <p>
                    The inclusion of the displacement current term allows Maxwell's equations to predict the existence of electromagnetic waves, which propagate through space at the speed of light. 
                    This was a significant theoretical development that unified the theories of electricity and magnetism into a single framework.
                </p>
            </div>
        </div>
    );
};

export default DisplacementCurrent;