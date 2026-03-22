import {
    ActivityLevel,
    type MacroCode,
    type MinMaxValue,
    type SettingProfileValue,
} from '../entities';

export const macroCodeOrder: MacroCode[] = ['kcal', 'protein', 'fat', 'carbs'];

export const minMaxValueOrder: (keyof MinMaxValue)[] = ['min', 'max'];

export const profileOrder: (keyof SettingProfileValue)[] = [
    'sex',
    'birth_date',
    'height',
    'weight',
    'activity_level',
];

export const activityLevelOrder: ActivityLevel[] = [
    ActivityLevel.sedentary,
    ActivityLevel.light,
    ActivityLevel.moderate,
    ActivityLevel.heavy,
    ActivityLevel.athlete,
];
