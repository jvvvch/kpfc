import { type Signal, useComputed } from '@preact/signals';
import { For } from '@preact/signals/utils';
import { useLocation } from 'preact-iso';
import {
    Header,
    Hint,
    List,
    Section,
    type SelectOption,
    StackRow,
} from '@/components/atomic';
import {
    FeatureItem,
    FeatureItemSelect,
    HeaderGroup,
    Page,
} from '@/components/feature';
import { type Language, Theme, useLocale, useTheme } from '@/contexts';
import {
    type ConfigDailyGoal,
    ConfigSection,
    type MacroCode,
    type MinMaxValue,
} from '@/domain/entities';
import { ConfigQueries } from '@/domain/queries/config';
import {
    macroCodeOrder,
    macroUnit,
    minMaxValueOrder,
    reduceDailyGoals,
} from '@/domain/utils';
import { useQuery } from '@/hooks';

function HeaderSection() {
    const { locale } = useLocale();

    return (
        <HeaderGroup>
            <StackRow />
            <Header>{locale.settings.header}</Header>
        </HeaderGroup>
    );
}

type DailyGoalProps = {
    code: MacroCode;
    value: MinMaxValue;
};

function DailyGoal({ code, value }: DailyGoalProps) {
    const { locale } = useLocale();
    const { route } = useLocation();

    const captionParts = [];
    for (const key of minMaxValueOrder) {
        if (value[key] !== null) {
            captionParts.push(`${locale.settings[key].short} ${value[key]}`);
        }
    }
    if (captionParts.length) {
        captionParts.push(locale.unit[macroUnit(code)]);
    }
    const caption = captionParts.join(' ');

    const onClick = () => route(`/settings/${code}`);

    return (
        <FeatureItem
            onClick={onClick}
            title={locale.macros[code].full}
            caption={caption}
        />
    );
}

type DailyGoalSectionProps = {
    goals: Signal<ConfigDailyGoal[]>;
};

function DailyGoalsSection({ goals }: DailyGoalSectionProps) {
    const { locale } = useLocale();

    const goalsReduced = useComputed(() =>
        goals.value
            ? reduceDailyGoals(goals.value)
            : ConfigQueries.getEmptyDailyGoals(),
    );
    return (
        <>
            <Section>{locale.settings.dailyGoals}</Section>
            <List>
                {macroCodeOrder.map((code) => (
                    <DailyGoal code={code} value={goalsReduced.value[code]} />
                ))}
            </List>
        </>
    );
}

const addMacroKcal = (
    current: number | null,
    code: MacroCode,
    value: number,
) => {
    if (value === null || current === null) {
        return null;
    }
    if (code === 'fat') {
        return current + value * 9;
    }
    return current + value * 4;
};

type KcalMismatchHintSectionProps = {
    goals: Signal<ConfigDailyGoal[]>;
};

function KcalMismatchHintSection({ goals }: KcalMismatchHintSectionProps) {
    const { locale } = useLocale();
    const hints = useComputed(() => {
        const hints: { text: string; description: string }[] = [];
        let min = 0,
            max = 0,
            macrosMin = 0,
            macrosMax = 0;
        for (const goal of goals.value) {
            if (goal.code === 'kcal') {
                min = goal.value.min;
                max = goal.value.max;
                continue;
            }
            macrosMin = addMacroKcal(macrosMin, goal.code, goal.value.min);
            macrosMax = addMacroKcal(macrosMax, goal.code, goal.value.max);
        }
        if (max !== null && macrosMin !== null && macrosMin > max) {
            hints.push({
                text: `⚠️ ${locale.settings.minMacrosHigherThanMaxKcal}`,
                description: `${macrosMin} / ${max}`,
            });
        }
        if (min !== null && macrosMax !== null && macrosMax < min) {
            hints.push({
                text: `⚠️ ${locale.settings.maxMacrosLowerThanMinKcal}`,
                description: `${macrosMax} / ${min}`,
            });
        }
        return hints;
    });

    return (
        <For each={hints}>
            {({ text, description }) => (
                <Hint>
                    {text}
                    <br />
                    <span className="text-xs font-bold">{description}</span>
                </Hint>
            )}
        </For>
    );
}

function SystemSettingsSection() {
    const { theme } = useTheme();
    const { language, locale, available } = useLocale();

    const themeOptions: SelectOption<Theme>[] = [
        { label: locale.settings.themes.light, value: Theme.light },
        { label: locale.settings.themes.dark, value: Theme.dark },
    ];

    const themeOnChange = (value: Theme) => {
        theme.value = value;
    };

    const languageOnChange = (value: Language) => {
        language.value = value;
    };

    return (
        <>
            <Section>{locale.settings.system}</Section>
            <List>
                <FeatureItemSelect
                    variant="noBorder"
                    title={locale.settings.theme}
                    onChange={themeOnChange}
                    selected={theme.value}
                    options={themeOptions}
                />
                <FeatureItemSelect
                    variant="noBorder"
                    title={locale.settings.language}
                    onChange={languageOnChange}
                    selected={language.value}
                    options={available}
                />
            </List>
        </>
    );
}

export function SettingListPage() {
    const { data: goals } = useQuery(() => {
        return ConfigQueries.getMany(ConfigSection.daily_goal);
    });

    return (
        <Page>
            <HeaderSection />
            <DailyGoalsSection goals={goals} />
            {goals.value && <KcalMismatchHintSection goals={goals} />}
            <SystemSettingsSection />
        </Page>
    );
}
