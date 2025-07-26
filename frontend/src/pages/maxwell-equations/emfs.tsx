import React from 'react';
import Latex from 'react-latex-next';

const EMFS: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
            <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-center py-8 text-gray-900">
                Electromotive Forces (EMFs)
            </div>

            <div className="space-y-8 sm:space-y-12 text-sm sm:text-base lg:text-lg leading-relaxed">
                {/* Transformer EMF Section */}
                <div className="space-y-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Transformer EMF
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
                            <div className="min-w-[250px] text-center text-base sm:text-lg lg:text-xl py-4">
                                <Latex>{`$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$`}</Latex>
                            </div>
                        </div>
                        
                        <div>
                            <p className="mb-2">where:</p>
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
                                    is the magnetic flux
                                </li>
                            </ul>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 italic">
                            Figure 1: Visualization of Transformer EMF
                        </p>
                    </div>
                </div>

                {/* Motional EMF Section */}
                <div className="space-y-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Motional EMF
                    </h2>
                    
                    <div className="space-y-4">
                        <p>
                            Motional EMF is the electromotive force induced in a conductor moving through a magnetic field.
                            According to Faraday's Law, the motion of the conductor through the magnetic field changes the magnetic flux through the conductor,
                            inducing an EMF. This principle is used in devices like electric generators and certain types of sensors.
                        </p>
                        
                        <p>
                            The induced EMF{' '}
                            <span className="overflow-x-auto inline-block">
                                <Latex>{`$\\mathcal{E}$`}</Latex>
                            </span>{' '}
                            in a moving conductor is given by:
                        </p>
                        
                        <div className="overflow-x-auto">
                            <div className="min-w-[250px] text-center text-base sm:text-lg lg:text-xl py-4">
                                <Latex>{`$\\mathcal{E} = B \\ell v \\sin \\theta$`}</Latex>
                            </div>
                        </div>
                        
                        <div>
                            <p className="mb-2">where:</p>
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
                                    is the length of the conductor
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
                                    is the angle between the magnetic field and the velocity of the conductor
                                </li>
                            </ul>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 italic">
                            Figure 2: Visualization of Motional EMF
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMFS;