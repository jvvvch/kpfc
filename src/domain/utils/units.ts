import type { MacroCode } from '../entities';

export enum Unit {
    kcal = 'kcal',
    gram = 'gram',
    ml = 'ml',
    percent = 'percent',
    piece = 'piece',
}

export const macroUnit = (macro: MacroCode): Unit => {
    if (macro === 'kcal') {
        return Unit.kcal;
    }
    return Unit.gram;
};
