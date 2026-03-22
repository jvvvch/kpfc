import type { MacroCode } from './macros';

export enum SettingCode {
    goals = 'goals',
    profile = 'profile',
}

export type Setting<
    TCode extends SettingCode = SettingCode,
    TValue extends object = object,
> = {
    code: TCode;
    value: TValue;
    valid_from: number | null;
    valid_to: number | null;
};

export type MinMaxValue = {
    min: number | null;
    max: number | null;
};
export type SettingGoalsValue = Record<MacroCode, MinMaxValue>;
export type SettingGoals = Setting<SettingCode.goals, SettingGoalsValue>;

export enum Sex {
    male = 'male',
    female = 'female',
}
export enum ActivityLevel {
    sedentary = 'sedentary',
    light = 'light',
    moderate = 'moderate',
    heavy = 'heavy',
    athlete = 'athlete',
}
export type SettingProfileValue = {
    sex: Sex | null;
    birth_date: Date | null;
    height: number;
    weight: number;
    activity_level: ActivityLevel;
};
export type SettingProfile = Setting<SettingCode.profile, SettingProfileValue>;
