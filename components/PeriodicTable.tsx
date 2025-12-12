import React, { useState } from 'react';
import { ElementData, ElementCategory } from '../types';
import { ELEMENTS } from '../constants';
import { getValency } from '../utils/chemistry';

interface PeriodicTableProps {
  onSelectElement: (element: ElementData) => void;
}

const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': 'bg-red-500/80 hover:bg-red-400',
  'alkaline-earth-metal': 'bg-orange-500/80 hover:bg-orange-400',
  'transition-metal': 'bg-yellow-500/80 hover:bg-yellow-400',
  'post-transition-metal': 'bg-green-500/80 hover:bg-green-400',
  'metalloid': 'bg-teal-500/80 hover:bg-teal-400',
  'reactive-nonmetal': 'bg-blue-500/80 hover:bg-blue-400',
  'noble-gas': 'bg-purple-500/80 hover:bg-purple-400',
  'lanthanide': 'bg-pink-500/80 hover:bg-pink-400',
  'actinide': 'bg-rose-500/80 hover:bg-rose-400',
  'unknown': 'bg-slate-500/80 hover:bg-slate-400',
};

interface ElementCardProps {
  element: ElementData;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onClick, onMouseEnter, onMouseLeave }) => {
  // Lanthanides (57-71) and Actinides (89-103) placement logic
  // Standard Period Table has these below.
  let col = element.group;
  let row = element.period;

  // Custom positioning for Lanthanides and Actinides to fit standard wide layout
  if (element.category === 'lanthanide') {
     row = 9;
     col = (element.number - 57) + 4; // Start at col 4
  } else if (element.category === 'actinide') {
     row = 10;
     col = (element.number - 89) + 4;
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        relative p-1 rounded cursor-pointer transition-all duration-200 transform hover:scale-110 hover:z-10 shadow-lg border border-white/10
        flex flex-col items-center justify-center
        ${CATEGORY_COLORS[element.category]}
        h-full w-full min-h-[50px]
      `}
      style={{
        gridColumn: col,
        gridRow: row,
      }}
    >
      <span className="text-[10px] absolute top-0.5 left-1 opacity-70">{element.number}</span>
      <span className="text-sm md:text-lg font-bold text-white shadow-black drop-shadow-md">{element.symbol}</span>
      <span className="text-[8px] truncate max-w-full hidden md:block opacity-90">{element.name}</span>
    </div>
  );
};

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ onSelectElement }) => {
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  };

  // Determine tooltip placement (avoiding screen edges)
  const isRightSide = cursor.x > window.innerWidth - 320; 
  const isBottomSide = cursor.y > window.innerHeight - 200;

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: cursor.x,
    top: cursor.y,
    transform: `translate(${isRightSide ? 'calc(-100% - 20px)' : '20px'}, ${isBottomSide ? 'calc(-100% - 20px)' : '20px'})`,
    zIndex: 100,
  };

  return (
    <div 
      className="w-full h-full overflow-auto p-4 flex justify-center items-start"
      onMouseMove={handleMouseMove}
    >
      <div 
        className="grid gap-1 md:gap-2 auto-rows-fr"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(18, minmax(30px, 1fr))',
          gridTemplateRows: 'repeat(10, minmax(50px, 1fr))',
          maxWidth: '1400px',
        }}
      >
        {ELEMENTS.map((el) => (
          <ElementCard 
            key={el.number} 
            element={el} 
            onClick={() => onSelectElement(el)}
            onMouseEnter={() => setHoveredElement(el)}
            onMouseLeave={() => setHoveredElement(null)}
          />
        ))}
        
        {/* Labels for groups (optional, skipping for space to focus on grid) */}
        <div className="col-start-4 row-start-6 text-slate-500 text-xs text-center flex items-center justify-center opacity-50 pointer-events-none">
          57-71
        </div>
        <div className="col-start-4 row-start-7 text-slate-500 text-xs text-center flex items-center justify-center opacity-50 pointer-events-none">
          89-103
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredElement && (
        <div 
          style={tooltipStyle}
          className="pointer-events-none w-64 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-600/50 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-3"
        >
          <div className="flex justify-between items-start border-b border-slate-700/50 pb-2">
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">{hoveredElement.name}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                {hoveredElement.category.replace(/-/g, ' ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-bold text-3xl leading-none tracking-tighter">{hoveredElement.symbol}</div>
              <div className="text-slate-500 text-xs font-mono mt-1">#{hoveredElement.number}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs">
             <div className="flex justify-between">
                <span className="text-slate-500">Atomic Mass</span>
                <span className="text-slate-200 font-mono">{hoveredElement.mass}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">Density</span>
                <span className="text-slate-200 font-mono">{hoveredElement.density ? hoveredElement.density.toFixed(2) : '-'}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">Valency</span>
                <span className="text-slate-200 font-mono">{getValency(hoveredElement)}</span>
             </div>
             <div className="flex justify-between col-span-2 mt-1 pt-1 border-t border-slate-800">
                <span className="text-slate-500">Click for 3D View</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};