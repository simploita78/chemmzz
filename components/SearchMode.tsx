import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ELEMENTS } from '../constants';
import { ElementData } from '../types';

interface SearchModeProps {
  onSelectElement: (element: ElementData) => void;
}

export const SearchMode: React.FC<SearchModeProps> = ({ onSelectElement }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query) return [];
    const lowerQ = query.toLowerCase();
    return ELEMENTS.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerQ) ||
        e.symbol.toLowerCase().includes(lowerQ) ||
        e.number.toString().startsWith(query)
    ).slice(0, 10); // Limit results
  }, [query]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
      <div className="max-w-xl w-full relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-8 text-center tracking-tight">
          AtomCraft
        </h1>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-slate-900 rounded-lg">
            <Search className="w-6 h-6 ml-4 text-slate-400" />
            <input
              type="text"
              className="w-full p-4 bg-transparent text-white text-lg focus:outline-none placeholder-slate-500"
              placeholder="Search Element (e.g., Li, Carbon, 6)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
            {results.map((el) => (
              <button
                key={el.number}
                onClick={() => onSelectElement(el)}
                className="w-full text-left p-4 hover:bg-slate-700 flex items-center justify-between border-b border-slate-700/50 last:border-0 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-600 font-bold text-cyan-300">
                    {el.symbol}
                  </span>
                  <div>
                    <div className="text-white font-medium">{el.name}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">{el.category.replace(/-/g, ' ')}</div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-600">#{el.number}</span>
              </button>
            ))}
          </div>
        )}
        
        {query === '' && (
            <div className="mt-12 text-center text-slate-500">
                <p>Start typing to explore the building blocks of the universe.</p>
            </div>
        )}
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};