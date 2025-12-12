export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  density: number | null; // g/cm3
  melt: number | null; // Kelvin (converted to C in UI)
  boil: number | null; // Kelvin
  category: ElementCategory;
  group: number;
  period: number;
  electron_configuration?: string;
}

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface ShellConfig {
  shell: number;
  electrons: number;
}