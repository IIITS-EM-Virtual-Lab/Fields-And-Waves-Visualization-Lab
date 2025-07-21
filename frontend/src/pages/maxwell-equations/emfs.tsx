import React from 'react';
import Latex from 'react-latex-next';
import './emf.css';

const EMFS: React.FC = () => {

    return (
        <div className="container">
            <div  className="text-2xl font-extrabold uppercase text-center py-6 text-gray-900">
                <h1>Electromotive Forces (EMFs)</h1>
            </div>
            <div className="content">
                {/* Transformer EMF Section */}
                <div className="section-container">
                    <div className="theory">
                        <h2>Transformer EMF</h2>
                        <p>
                            Transformer EMF is the electromotive force generated in a transformer due to the changing magnetic flux.
                            According to Faraday's Law of Induction, a time-varying magnetic field induces an EMF in a coil.
                            This principle is the basis for the operation of transformers, which are used to step up or step down AC voltages in power systems.
                        </p>
                        <p>
                            The induced EMF (<Latex>{`$\\mathcal{E}$`}</Latex>) in a coil is given by Faraday's Law:
                        </p>
                        <p className="equation">
                            <Latex>{`$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$`}</Latex>
                        </p>
                        <p>
                            where:
                            <ul>
                                <li><Latex>{`$N$`}</Latex> is the number of turns in the coil</li>
                                <li><Latex>{`$\\Phi_B$`}</Latex> is the magnetic flux</li>
                            </ul>
                        </p>
                        <p className="figure-caption">Figure 1: Visualization of Transformer EMF</p>
                    </div>
                </div>

                {/* Motional EMF Section */}
                <div className="section-container">
                    <div className="theory">
                        <h2>Motional EMF</h2>
                        <p>
                            Motional EMF is the electromotive force induced in a conductor moving through a magnetic field.
                            According to Faraday's Law, the motion of the conductor through the magnetic field changes the magnetic flux through the conductor,
                            inducing an EMF. This principle is used in devices like electric generators and certain types of sensors.
                        </p>
                        <p>
                            The induced EMF (<Latex>{`$\\mathcal{E}$`}</Latex>) in a moving conductor is given by:
                        </p>
                        <p className="equation">
                            <Latex>{`$\\mathcal{E} = B \\ell v \\sin \\theta$`}</Latex>
                        </p>
                        <p>
                            where:
                            <ul>
                                <li><Latex>{`$B$`}</Latex> is the magnetic field strength</li>
                                <li><Latex>{`$\\ell$`}</Latex> is the length of the conductor</li>
                                <li><Latex>{`$v$`}</Latex> is the velocity of the conductor</li>
                                <li><Latex>{`$\\theta$`}</Latex> is the angle between the magnetic field and the velocity of the conductor</li>
                            </ul>
                        </p>
                        <p className="figure-caption">Figure 2: Visualization of Motional EMF</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMFS;