import React from 'react';
import { X, Thermometer, FlaskConical, Weight, Zap, Atom, Activity } from 'lucide-react';
import { ElementData } from '../types';
import { AtomVisualizer } from './AtomVisualizer';
import { kelvinToCelsius, predictIon, getValency, getElectronConfiguration } from '../utils/chemistry';

interface DetailViewProps {
  element: ElementData;
  onClose: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ element, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md">
      <div className="w-full h-full max-w-7xl bg-slate-900/90 rounded-2xl border border-slate-700 shadow-2xl flex flex-col md:flex-row overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 3D View Container */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative border-b md:border-b-0 md:border-r border-slate-700">
          <AtomVisualizer element={element} />
          <div className="absolute top-6 left-6 pointer-events-none">
            <h2 className="text-6xl font-bold text-white opacity-20">{element.symbol}</h2>
          </div>
        </div>

        {/* Data Panel */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-8 overflow-y-auto bg-slate-900">
          <div className="mb-8">
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl font-bold text-white">{element.name}</h1>
              <span className="text-2xl text-cyan-400 font-mono">#{element.number}</span>
            </div>
            <p className="text-slate-400 uppercase tracking-widest text-sm mt-2">{element.category.replace(/-/g, ' ')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Weight className="w-5 h-5" />
                <span className="font-semibold">Atomic Mass</span>
              </div>
              <p className="text-2xl text-white font-mono">{element.mass} u</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Likely Ion</span>
              </div>
              <p className="text-lg text-white font-mono">{predictIon(element)}</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Activity className="w-5 h-5" />
                <span className="font-semibold">Common Valency</span>
              </div>
              <p className="text-xl text-white font-mono">{getValency(element)}</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <Thermometer className="w-5 h-5" />
                <span className="font-semibold">Melting Point</span>
              </div>
              <p className="text-xl text-white font-mono">{kelvinToCelsius(element.melt)}°C</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <FlaskConical className="w-5 h-5" />
                <span className="font-semibold">Boiling Point</span>
              </div>
              <p className="text-xl text-white font-mono">{kelvinToCelsius(element.boil)}°C</p>
            </div>
             
             <div className="col-span-1 md:col-span-2 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
               <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Atom className="w-4 h-4" />
                  <h3 className="text-sm font-semibold">ELECTRON CONFIGURATION (BOHR SHELLS)</h3>
               </div>
               <div className="flex flex-wrap gap-2">
                 {getElectronConfiguration(element.number).map((shell, i) => (
                    <div key={i} className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-slate-700 border border-slate-600">
                        <span className="text-xs text-slate-400">n={shell.shell}</span>
                        <span className="font-bold text-white">{shell.electrons}</span>
                    </div>
                ))}
               </div>
               <p className="text-xs text-slate-500 mt-2 italic">
                 *Simplified shell model used for visualization. 
               </p>
             </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h3 className="text-blue-400 font-bold mb-1">Did you know?</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                  {element.category === 'noble-gas' 
                    ? `${element.name} is a Noble Gas, making it extremely stable and unreactive due to its full valence electron shell.`
                    : element.category.includes('alkali')
                    ? `${element.name} is highly reactive, especially with water, because it has a single valence electron it wants to lose.`
                    : `Elements in Group ${element.group} like ${element.name} share similar chemical properties due to their electron configurations.`}
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};