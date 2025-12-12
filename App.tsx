import React, { useState } from 'react';
import { SearchMode } from './components/SearchMode';
import { PeriodicTable } from './components/PeriodicTable';
import { DetailView } from './components/DetailView';
import { ElementData } from './types';
import { Grid, Search as SearchIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'table'>('search');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-200 overflow-hidden relative font-sans">
      
      {/* Main Content Area */}
      <main className="w-full h-full">
        {view === 'search' ? (
          <SearchMode onSelectElement={setSelectedElement} />
        ) : (
          <PeriodicTable onSelectElement={setSelectedElement} />
        )}
      </main>

      {/* Floating Action Button (FAB) for View Toggle */}
      {!selectedElement && (
        <button
          onClick={() => setView(view === 'search' ? 'table' : 'search')}
          className="fixed bottom-6 right-6 p-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full shadow-lg shadow-cyan-500/40 transition-all duration-300 z-40 group"
        >
            {view === 'search' ? (
                <Grid className="w-6 h-6" />
            ) : (
                <SearchIcon className="w-6 h-6" />
            )}
            <span className="absolute right-full mr-4 bg-slate-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Switch to {view === 'search' ? 'Table' : 'Search'}
            </span>
        </button>
      )}

      {/* Detail Modal Overlay */}
      {selectedElement && (
        <DetailView 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
        />
      )}
    </div>
  );
};

export default App;