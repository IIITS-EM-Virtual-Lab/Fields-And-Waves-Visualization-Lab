import React from 'react';
import Latex from 'react-latex-next';
import './displacement_current.css';
import DisplacementCurrentVisualizer from '@/components/DisplacementCurrentVisualizer';

const DisplacementCurrent: React.FC = () => {
    return (
        <div className="displacement-current">
            <div className="text-3xl font-bold uppercase text-center py-6 text-gray-900">
                Faraday's Law
            </div>

            <div className="pb-20">
                <div className="text-xl font-black uppercase text-center py-10">
                    INTERACTIVE DEMO
                </div>
                <div className="flex justify-center">
                    <DisplacementCurrentVisualizer />
                </div>
            </div>
            <p>
                The concept of displacement current was introduced by James Clerk Maxwell to modify Ampère's Law and make it consistent with the continuity equation. 
                Displacement current is not an actual current of moving charges, but a term added to Ampère's Law to account for the changing electric field in situations where there is no physical current.
            </p>
            <ul>
                <li>
                    <Latex>{`Gauss's Law for Electricity: \\( \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0} \\)`}</Latex>
                </li>
                <li>
                    <Latex>{`Gauss's Law for Magnetism: \\( \\nabla \\cdot \\mathbf{B} = 0 \\)`}</Latex>
                </li>
                <li>
                    <Latex>{`Faraday's Law of Induction: \\( \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} \\)`}</Latex>
                </li>
                <li>
                    <Latex>{`Ampère's Law (with Maxwell's correction): \\( \\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\)`}</Latex>
                </li>
            </ul>
            <Latex>{`
                The displacement current density \\( \\mathbf{J}_D \\) is given by:
                \\( \\mathbf{J}_D = \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\).
                This term is added to the conduction current density \\( \\mathbf{J} \\) in Ampère's Law to form the modified equation:
                \\( \\nabla \\times \\mathbf{B} = \\mu_0 (\\mathbf{J} + \\mathbf{J}_D) \\).
            `}</Latex>
            <p>
                The inclusion of the displacement current term allows Maxwell's equations to predict the existence of electromagnetic waves, which propagate through space at the speed of light. 
                This was a significant theoretical development that unified the theories of electricity and magnetism into a single framework.
            </p>
            <iframe 
                src="https://www.geogebra.org/classic/kapn6jws?embed" 
                width="800" 
                height="600" 
                allowFullScreen 
                style={{ border: '1px solid #e4e4e4', borderRadius: '4px' }} 
                frameBorder="0"
                className="iframe-container"
            ></iframe>
        </div>
    );
};

export default DisplacementCurrent;