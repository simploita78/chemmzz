import { ElementData, ShellConfig } from '../types';

/**
 * Calculates electron shells based on the Bohr model (2n^2 capacity rule).
 * Note: This is a simplified educational model suitable for visualization.
 * Real quantum mechanics (s,p,d,f orbitals) is more complex.
 */
export const getElectronConfiguration = (atomicNumber: number): ShellConfig[] => {
  const shells: ShellConfig[] = [];
  let remainingElectrons = atomicNumber;
  let shellLevel = 1;

  while (remainingElectrons > 0) {
    // Capacity of shell n is 2*n^2
    const capacity = 2 * Math.pow(shellLevel, 2);
    
    // For visualization stability (and slightly better accuracy to real periodic trends in lower periods),
    // we limit outer shells for heavier elements in this simplified visualizer 
    // to prevent overcrowding, but sticking to the request's math requirement:
    
    let take = 0;
    
    // Simplified logic to handle the fact that outer shells rarely hold full 2n^2 immediately
    // For the sake of the visualizer prompt "mathematically calculate shells (2, 8, 18, etc.)":
    if (remainingElectrons >= capacity) {
      take = capacity;
    } else {
      take = remainingElectrons;
    }

    // Special handling to make it look more like the periodic table rows (2, 8, 8, 18...)
    // This is a heuristic to match standard school Bohr diagrams better than raw 2n^2 for Z > 20
    if (atomicNumber > 2 && shellLevel === 2) take = Math.min(8, remainingElectrons);
    if (atomicNumber > 10 && shellLevel === 3 && remainingElectrons > 8) take = 8; // Argon stability
    if (atomicNumber > 18 && shellLevel === 3) take = Math.min(18, remainingElectrons + 8) - 8; // Backfill 3rd
    
    // Reverting to strict prompt requirement: "mathematically calculate shells (2, 8, 18, etc.)"
    // The prompt asks explicitly for shells 2, 8, 18.
    // Let's use the standard max capacity logic for the visualizer circles.
    
    const strictCapacity = 2 * shellLevel * shellLevel;
    const electronsInShell = Math.min(remainingElectrons, strictCapacity);

    shells.push({ shell: shellLevel, electrons: electronsInShell });
    remainingElectrons -= electronsInShell;
    shellLevel++;
  }
  return shells;
};

/**
 * Predicts likely ion charge based on Group number.
 */
export const predictIon = (element: ElementData): string => {
  if (element.group === 18) return 'Neutral (Noble Gas)';
  
  if (element.group === 1) return 'Cation (+1)';
  if (element.group === 2) return 'Cation (+2)';
  
  if (element.group === 13) return 'Cation (+3)';
  
  if (element.group === 17) return 'Anion (-1)';
  if (element.group === 16) return 'Anion (-2)';
  if (element.group === 15) return 'Anion (-3)';

  if (element.category.includes('transition') || element.category.includes('lanthanide') || element.category.includes('actinide')) {
    return 'Variable Cation (+2, +3, etc.)';
  }

  return 'Variable / Complex';
};

/**
 * Determines the most common valency for an element based on its group and category.
 */
export const getValency = (element: ElementData): string => {
  // Special handling for Hydrogen
  if (element.number === 1) return '1';
  
  // Noble Gases
  if (element.group === 18) return '0';

  // Main Groups
  if (element.group === 1) return '1';
  if (element.group === 2) return '2';
  if (element.group === 13) return '3';
  if (element.group === 14) return '4';
  if (element.group === 15) return '3, 5'; // Nitrogen/Phosphorus often 3 or 5
  if (element.group === 16) return '2, 6'; // Oxygen is 2, Sulfur can be 2,4,6
  if (element.group === 17) return '1';

  // Transition Metals & Inner Transition
  if (element.category.includes('transition')) return 'Variable (often 2)';
  if (element.category === 'lanthanide') return '3';
  if (element.category === 'actinide') return '3, 4';

  return 'Variable';
};

export const kelvinToCelsius = (k: number | null): string => {
  if (k === null) return 'N/A';
  return (k - 273.15).toFixed(2);
};