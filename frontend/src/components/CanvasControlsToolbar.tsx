import React from 'react';
import { Hand, Rotate3d, RefreshCcw, ZoomIn, ZoomOut } from 'lucide-react';

export interface CanvasControlsToolbarProps {
  interactionMode: 'rotate' | 'pan';
  setInteractionMode: (mode: 'rotate' | 'pan') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

export default function CanvasControlsToolbar({
  interactionMode,
  setInteractionMode,
  onZoomIn,
  onZoomOut,
  onReset,
  className = 'absolute top-3 right-3 z-10',
}: CanvasControlsToolbarProps) {
  return (
    <div className={`${className} flex items-center gap-1 shadow-sm rounded-lg bg-white/95 backdrop-blur-sm p-1 border border-gray-200/80 select-none`}>
      {/* Rotate Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => setInteractionMode('rotate')}
          className={`p-1.5 rounded-md transition-colors ${
            interactionMode === 'rotate' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Rotate"
        >
          <Rotate3d size={15} />
        </button>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
          Rotate
        </span>
      </div>

      {/* Pan Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => setInteractionMode('pan')}
          className={`p-1.5 rounded-md transition-colors ${
            interactionMode === 'pan' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Pan"
        >
          <Hand size={15} />
        </button>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
          Pan
        </span>
      </div>

      <div className="w-px h-4 bg-gray-200 mx-0.5"></div>

      {/* Zoom In Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
          Zoom In
        </span>
      </div>

      {/* Zoom Out Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={onZoomOut}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
          Zoom Out
        </span>
      </div>

      <div className="w-px h-4 bg-gray-200 mx-0.5"></div>

      {/* Reset Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          title="Reset View"
        >
          <RefreshCcw size={15} />
        </button>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
          Reset View
        </span>
      </div>
    </div>
  );
}
