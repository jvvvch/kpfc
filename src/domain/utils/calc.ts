import {
    type ConfigDailyGoal,
    type ConfigDailyGoalReduced,
    type Ingredient,
    IngredientType,
    type Macros,
    type Product,
} from '../entities';
import { macroCodeOrder } from './order';

export const reduceByKey = <T, K extends keyof T>(arr: T[], key: K) => {
    return arr.reduce(
        (v, s) => {
            v[s[key] as T[K] & PropertyKey] = s;
            return v;
        },
        {} as Record<T[K] & PropertyKey, T>,
    );
};

export const reduceDailyGoals = (goals: ConfigDailyGoal[]) => {
    return goals.reduce((v, goal) => {
        v[goal.code] = goal.value;
        return v;
    }, {} as ConfigDailyGoalReduced);
};

export const portionedMacros = (macros: Macros, portion: number): Macros => {
    return macroCodeOrder.reduce(
        (v, code) => {
            v[code] = Number(((macros[code] || 0) * portion).toFixed(2));
            return v;
        },
        { kcal: 0, protein: 0, fat: 0, carbs: 0 },
    );
};

export const weightedMacros = (macros: Macros, weight: number) => {
    const portion = weight / 100;
    return portionedMacros(macros, portion);
};

export const ingredientMacros = (
    { piece, ...macros }: Pick<Product, 'piece'> & Macros,
    { type, amount }: Pick<Ingredient, 'type' | 'amount'>,
) => {
    const weight = type === IngredientType.weight ? amount : amount * piece;
    return weightedMacros(macros, weight);
};

export const sumTotals = (items: Macros[]): Macros => {
    const totals = items.reduce(
        (v, item) => {
            macroCodeOrder.map((code) => (v[code] += item[code]));
            return v;
        },
        {
            kcal: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
        },
    );
    Object.keys(totals).map(
        (code) => (totals[code] = Number(totals[code].toFixed(1))),
    );
    return totals;
};
