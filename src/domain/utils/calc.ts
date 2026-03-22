import { differenceInYears } from 'date-fns';
import {
    ActivityLevel,
    type Ingredient,
    IngredientType,
    type Macros,
    type Product,
    type SettingGoalsValue,
    type SettingProfileValue,
    Sex,
} from '../entities';
import { macroCodeOrder, profileOrder } from './order';

export const reduceByKey = <T, K extends keyof T>(arr: T[], key: K) => {
    return arr.reduce(
        (v, s) => {
            v[s[key] as T[K] & PropertyKey] = s;
            return v;
        },
        {} as Record<T[K] & PropertyKey, T>,
    );
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

const activityLevelMod = {
    [ActivityLevel.sedentary]: 1.2,
    [ActivityLevel.light]: 1.375,
    [ActivityLevel.moderate]: 1.55,
    [ActivityLevel.heavy]: 1.725,
    [ActivityLevel.athlete]: 1.9,
};

export const isProfileValidForTDEE = (profile: SettingProfileValue) => {
    for (const key of profileOrder) {
        if (profile[key] === null) {
            return false;
        }
    }
    return true;
};

export const calcTDEE = (profile: SettingProfileValue) => {
    const sexMod = profile.sex === Sex.male ? 5 : -161;
    const age = differenceInYears(new Date(), profile.birth_date);
    const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * age + sexMod;
    return bmr * activityLevelMod[profile.activity_level];
};

export const calcSurplusAndTDEE = (
    profile: SettingProfileValue,
    goals: SettingGoalsValue,
) => {
    let minSurplus: number | null = null;
    let maxSurplus: number | null = null;
    let minWeightSurplus: number | null = null;
    let maxWeightSurplus: number | null = null;
    if (!isProfileValidForTDEE(profile)) {
        return {
            tdee: null,
            minSurplus,
            maxSurplus,
            minWeightSurplus,
            maxWeightSurplus,
        };
    }
    const tdee = calcTDEE(profile);
    if (goals.kcal.min !== null) {
        minSurplus = goals.kcal.min - tdee;
        minWeightSurplus = calcWeeklyWeightSurplus(minSurplus);
    }
    if (goals.kcal.max !== null) {
        maxSurplus = goals.kcal.max - tdee;
        maxWeightSurplus = calcWeeklyWeightSurplus(maxSurplus);
    }
    return { tdee, minSurplus, maxSurplus, minWeightSurplus, maxWeightSurplus };
};

export const calcWeeklyWeightSurplus = (surplusKcal: number) => {
    return ((surplusKcal * 7) / 3500) * 0.45;
};
