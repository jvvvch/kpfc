import type { MacroCode } from './macros';

export enum ConfigSection {
    daily_goal = 'daily_goal',
}

export type MinMaxValue = {
    min: number | null;
    max: number | null;
};
export type ConfigDailyGoal = {
    section: ConfigSection.daily_goal;
    code: MacroCode;
    value: MinMaxValue;
};
export type ConfigDailyGoalReduced = Record<MacroCode, MinMaxValue>;

export type Config = ConfigDailyGoal;
