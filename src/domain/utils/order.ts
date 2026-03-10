import type { MacroCode, MinMaxValue } from '../entities';

export const macroCodeOrder: MacroCode[] = ['kcal', 'protein', 'fat', 'carbs'];

export const minMaxValueOrder: (keyof MinMaxValue)[] = ['min', 'max'];
