import type { MacroCode, MinMaxValue } from '@/domain/entities';
import { DayPosition, ProgressStatus } from '@/domain/utils';
import type { Locale } from '@/i18n';
import { cn } from '@/utils';

const bold = 'font-bold';
const bigBold = 'text-3xl font-bold';

const macroEmoji: Omit<Record<MacroCode, string>, 'kcal'> = {
    protein: '🥩',
    fat: '🫒',
    carbs: '🍌',
};

export const DashboardText = {
    KcalTitle: (locale: Locale, total: number) => (
        <>
            <span className={bigBold}>{Math.floor(total)}</span>
            {` ${locale.unit.kcal}`}
        </>
    ),

    KcalDescription: (
        locale: Locale,
        status: ProgressStatus,
        dayPositon: DayPosition,
        value: number,
    ) => {
        let prefix: string | undefined;
        if (status === ProgressStatus.less) {
            if (dayPositon === DayPosition.past) {
                prefix = locale.dashboard.progress.under;
            }
            if (dayPositon === DayPosition.current) {
                prefix = locale.dashboard.progress.needMore;
            }
        } else if (status === ProgressStatus.between) {
            if (dayPositon === DayPosition.current) {
                prefix = locale.dashboard.progress.canMore;
            }
        } else if (status === ProgressStatus.more) {
            if (dayPositon !== DayPosition.future) {
                prefix = locale.dashboard.progress.over;
            }
        }

        if (!prefix) {
            if (
                (status === ProgressStatus.ok ||
                    status === ProgressStatus.between) &&
                dayPositon !== DayPosition.future
            ) {
                return <span className={cn(bigBold, 'text-chart-ok')}>✓</span>;
            }
            return;
        }

        return (
            <>
                {`${prefix} `}
                <span className={bigBold}>{Math.floor(value)}</span>
                {` ${locale.unit.kcal}`}
            </>
        );
    },

    MacroTitle: (locale: Locale, code: MacroCode) => (
        <span className={bold}>
            {macroEmoji[code]} {locale.macros[code].full[0]}
        </span>
    ),

    MacroDescription: (
        status: ProgressStatus,
        dayPosition: DayPosition,
        total: number,
        goal: MinMaxValue,
    ) => {
        const parts = [String(Math.floor(total))];
        if (status === ProgressStatus.less) {
            parts.push(String(goal.min));
        } else if (goal.max !== null) {
            parts.push(String(goal.max));
        }
        const text = parts.join('/');
        if (dayPosition === DayPosition.future) {
            return text;
        }

        if (status === ProgressStatus.less) {
            return (
                <>
                    <span className="text-chart-warn">↓</span> {text}
                </>
            );
        }
        if (status === ProgressStatus.more) {
            return (
                <>
                    <span className="text-chart-danger">↑</span> {text}
                </>
            );
        }
        return (
            <>
                <span className="text-chart-ok">✓</span> {text}
            </>
        );
    },
};
