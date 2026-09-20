import React from 'react';
import Latex from 'react-latex-next';
import TransformerEMFVisualizer from '@/components/TransformerEMFVisualizer';
import MotionalEMFVisualizer from '@/components/MotionalEMFVisualizer';

const EMFS: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">

            <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-center py-8 text-gray-900">
                Electromotive Forces (EMFs)
            </div>

            <div className="space-y-10 sm:space-y-14 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-800">

                {/* Transformer EMF Section */}
                <div className="space-y-6">

                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        1. Transformer EMF
                    </h2>

                    <div className="space-y-4">

                        <p>
                            Transformer EMF is the electromotive force generated in a transformer due to the changing magnetic flux.
                            According to Faraday's Law of Induction, a time-varying magnetic field induces an EMF in a coil.
                            This principle is the basis for the operation of transformers, which are used to step up or step down AC voltages in power systems.
                        </p>

                        <p>
                            The induced EMF{' '}
                            <span className="overflow-x-auto inline-block">
                                <Latex>{`$\\mathcal{E}$`}</Latex>
                            </span>{' '}
                            in a coil is given by Faraday's Law:
                        </p>

                        <div className="overflow-x-auto">
                            <div className="min-w-[250px] text-center text-base sm:text-lg lg:text-xl py-4 font-semibold">
                                <Latex>{`$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$`}</Latex>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 font-medium">where:</p>

                            <ul className="list-disc ml-4 sm:ml-6 space-y-1">

                                <li>
                                    <span className="overflow-x-auto inline-block">
                                        <Latex>{`$N$`}</Latex>
                                    </span>{' '}
                                    is the number of turns in the coil
                                </li>

                                <li>
                                    <span className="overflow-x-auto inline-block">
                                        <Latex>{`$\\Phi_B$`}</Latex>
                                    </span>{' '}
                                    is the magnetic flux through the core
                                </li>

                            </ul>
                        </div>

                        {/* Interactive Transformer Visualizer */}
                        <div className="my-6">
                            <TransformerEMFVisualizer />
                        </div>

                    </div>
                </div>

                {/* Motional EMF Section */}
                <div className="space-y-6">

                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        2. Motional EMF
                    </h2>

                    <div className="space-y-4">

                        <p>
                            Motional EMF is the electromotive force induced in a conductor moving through a magnetic field.
                            According to Faraday's Law, the motion of the conductor through the magnetic field changes the magnetic flux through the circuit loop,
                            inducing an EMF. This principle is used in devices like electric generators and speed sensors.
                        </p>

                        <p>
                            The induced EMF{' '}
                            <span className="overflow-x-auto inline-block">
                                <Latex>{`$\\mathcal{E}$`}</Latex>
                            </span>{' '}
                            in a moving conductor of length <Latex>{`$\\ell$`}</Latex> at velocity <Latex>{`$v$`}</Latex> is given by:
                        </p>

                        <div className="overflow-x-auto">
                            <div className="min-w-[250px] text-center text-base sm:text-lg lg:text-xl py-4 font-semibold">
                                <Latex>{`$\\mathcal{E} = B \\ell v \\sin \\theta$`}</Latex>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 font-medium">where:</p>

                            <ul className="list-disc ml-4 sm:ml-6 space-y-1">

                                <li>
                                    <span className="overflow-x-auto inline-block">
                                        <Latex>{`$B$`}</Latex>
                                    </span>{' '}
                                    is the magnetic field strength
                                </li>

                                <li>
                                    <span className="overflow-x-auto inline-block">
                                        <Latex>{`$\\ell$`}</Latex>
                                    </span>{' '}
                                    is the length of the moving conductor
                                </li>

                                <li>
                                    <span className="overflow-x-auto inline-block">
                                        <Latex>{`$v$`}</Latex>
                                    </span>{' '}
                                    is the velocity of the conductor
                                </li>

                                <li>
                                    <span className="overflow-x-auto inline-block">
                                        <Latex>{`$\\theta$`}</Latex>
                                    </span>{' '}
                                    is the angle between the magnetic field vector and the velocity vector
                                </li>

                            </ul>
                        </div>

                        {/* Interactive Motional EMF Visualizer */}
                        <div className="my-6">
                            <MotionalEMFVisualizer />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default EMFS;