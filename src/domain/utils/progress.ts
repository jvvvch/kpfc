import type {
    CalculatedMeal,
    ConfigDailyGoal,
    MacroCode,
    MinMaxValue,
} from '../entities';
import { reduceDailyGoals, sumTotals } from './calc';
import { macroCodeOrder } from './order';

export enum ProgressStatus {
    less = 'less',
    ok = 'ok',
    between = 'between',
    more = 'more',
}

export type CalculatedProgress = {
    status: ProgressStatus;
    value: number;
    progress: number;
};

export type CalculatedDashboard = Record<
    MacroCode,
    {
        total: number;
        progress: CalculatedProgress;
        goal: MinMaxValue;
    }
>;

export const ProgressCalculator = new (class {
    calculateDashboard(
        goals: ConfigDailyGoal[],
        meals: CalculatedMeal[],
    ): CalculatedDashboard {
        const goalsReduced = reduceDailyGoals(goals);
        const totals = sumTotals(meals);
        return macroCodeOrder.reduce((v, code) => {
            const total = totals[code];
            const goal = goalsReduced[code];
            v[code] = {
                progress: this.calculateProgressState(goal, total),
                total,
                goal,
            };
            return v;
        }, {} as CalculatedDashboard);
    }

    private calculateProgressState(
        goal: MinMaxValue,
        total: number,
    ): CalculatedProgress {
        let { min, max } = goal;
        if (min === null) {
            min = 0;
        }
        if (max === null) {
            max = total;
        }
        if (total < min) {
            return {
                status: ProgressStatus.less,
                value: min - total,
                progress: total / min,
            };
        }
        if (total < max) {
            return {
                status: ProgressStatus.between,
                value: max - total,
                progress: total / max,
            };
        }
        if (total === max) {
            return {
                status: ProgressStatus.ok,
                value: total,
                progress: total > 0 ? 1 : 0,
            };
        }
        return {
            status: ProgressStatus.more,
            value: total - max,
            progress: 1,
        };
    }
})();
