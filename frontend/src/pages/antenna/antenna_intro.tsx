import React from "react";
import { Link } from "react-router-dom";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Radio, Layers, Compass, Zap, Activity, ArrowRight } from "lucide-react";

const AntennaIntro: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Antenna Fundamentals & Radiation
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-start gap-4">          
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Chapter Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              An <strong>antenna</strong> is a specialized transducer that converts guided electromagnetic waves (propagating along transmission lines or waveguides) into unbounded, radiating electromagnetic waves traveling through free space, and vice-versa.
            </p>
          </div>
        </div>
      </div>      

      {/* Theoretical Foundation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Card 1: Radiation Mechanism */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Zap className="w-6 h-6" />
            <h3 className="text-lg font-bold text-slate-800">1. Radiation Mechanism</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Radiation occurs when electric charges experience acceleration or time-varying currents flow along open conductors:
          </p>
          <div className="bg-slate-50 border rounded-lg p-3 text-center mb-3">
            <BlockMath math="\nabla \times \mathbf{H} = \mathbf{J} + \frac{\partial \mathbf{D}}{\partial t}" />
          </div>
          <p className="text-xs text-slate-500">
            Time-varying currents create expanding electric and magnetic fields that decouple from the structure and radiate outward.
          </p>
        </div>

        {/* Card 2: Key Antenna Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Compass className="w-6 h-6" />
            <h3 className="text-lg font-bold text-slate-800">2. Key Antenna Parameters</h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center justify-between border-b pb-1">
              <span>Radiation Resistance:</span>
              <span className="font-semibold text-slate-800"><InlineMath math="R_{rad}" /></span>
            </li>
            <li className="flex items-center justify-between border-b pb-1">
              <span>Directivity:</span>
              <span className="font-semibold text-slate-800"><InlineMath math="D = \frac{4\pi U_{max}}{P_{rad}}" /></span>
            </li>
            <li className="flex items-center justify-between border-b pb-1">
              <span>Gain:</span>
              <span className="font-semibold text-slate-800"><InlineMath math="G = \eta_{rad} D" /></span>
            </li>
            <li className="flex items-center justify-between">
              <span>Far-Field Distance:</span>
              <span className="font-semibold text-slate-800"><InlineMath math="r \ge \frac{2D^2}{\lambda}" /></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Simulation Link */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full mb-3 border border-cyan-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive 3D Simulation Ready</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Hertzian Dipole Field Visualizer</h3>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Experiment with an infinitesimal dipole in 3D. Control current, frequency, element length, and observe near vs. far fields, radiation resistance, and 2D/3D radiation patterns in real-time.
          </p>
        </div>
        <Link
          to="/hertzian-dipole"
          className="whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition shadow-md hover:shadow-cyan-400/20"
        >
          <span>Launch Simulation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default AntennaIntro;
