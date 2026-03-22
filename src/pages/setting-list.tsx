import { type Signal, useComputed, useSignal } from '@preact/signals';
import { useLocation } from 'preact-iso';
import {
    Header,
    Hint,
    Icon,
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
    ScrollableContent,
} from '@/components/feature';
import { type Language, Theme, useLocale, useTheme } from '@/contexts';
import type {
    MacroCode,
    SettingGoalsValue,
    SettingProfileValue,
} from '@/domain/entities';
import { SettingQueries } from '@/domain/queries/setting';
import {
    calcSurplusAndTDEE,
    isProfileValidForTDEE,
    macroCodeOrder,
    macroUnit,
    minMaxValueOrder,
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

type TDEEItemProps = {
    tdee: number;
    expand: Signal<boolean>;
};

export function TDEEItem({ tdee, expand }: TDEEItemProps) {
    const { locale } = useLocale();

    const onClick = () => {
        expand.value = !expand.value;
    };

    const icon = useComputed(() => {
        const className = expand.value ? 'rotate-90' : '';
        return (
            <Icon.ChevronRight
                className={`transition-transform duration-200 ${className}`}
            />
        );
    });

    return (
        <FeatureItem
            onClick={onClick}
            title={locale.settings.profile.yourTdee}
            description={locale.settings.profile.tdeeFull}
            caption={`${tdee.toFixed(0)} ${locale.unit.kcal}`}
            icon={icon.value}
        />
    );
}

type SurplusItemProps = {
    relation: 'min' | 'max';
    value: number;
    weightValue: number;
};

export function SurplusItem({
    relation,
    value,
    weightValue,
}: SurplusItemProps) {
    if (value === null) {
        return;
    }
    const { locale } = useLocale();
    const title =
        locale.settings.profile.calc[value < 0 ? 'deficit' : 'surplus'];
    const description = locale.settings.profile.calc[relation];
    let weightSign = '+';
    if (value < 0) {
        value = -value;
    }
    if (weightValue < 0) {
        weightValue = -weightValue;
        weightSign = '-';
    }
    const valueStr = `${value.toFixed(0)} ${locale.unit.kcal}`;
    const weightValueStr = `${weightSign}${weightValue.toFixed(1)} ${locale.unit.kg} ${locale.settings.profile.calc.perWeek}`;

    return (
        <FeatureItem
            icon={null}
            title={title}
            description={description}
            caption={valueStr}
            captionDescription={weightValueStr}
        />
    );
}

type ProfileSectionProps = {
    profile: SettingProfileValue;
    goals: SettingGoalsValue;
};

function ProfileSection({ profile, goals }: ProfileSectionProps) {
    const { locale } = useLocale();
    const { route } = useLocation();

    const expand = useSignal(false);

    const isValid = isProfileValidForTDEE(profile);
    const { tdee, minSurplus, maxSurplus, minWeightSurplus, maxWeightSurplus } =
        calcSurplusAndTDEE(profile, goals);

    const profileOnClick = () => {
        route('/settings/profile');
    };

    return (
        <>
            <Section>{locale.settings.profile.header}</Section>
            <List>
                <FeatureItem
                    onClick={profileOnClick}
                    title={locale.settings.profile.title}
                />
                {tdee !== null && <TDEEItem tdee={tdee} expand={expand} />}
                {expand.value && (
                    <>
                        <SurplusItem
                            relation="min"
                            value={minSurplus}
                            weightValue={minWeightSurplus}
                        />
                        <SurplusItem
                            relation="max"
                            value={maxSurplus}
                            weightValue={maxWeightSurplus}
                        />
                    </>
                )}
            </List>
            {!isValid && <Hint>{locale.settings.profile.fillProfileHint}</Hint>}
        </>
    );
}

type GoalItemProps = {
    code: MacroCode;
    goals: SettingGoalsValue;
};

function GoalItem({ code, goals }: GoalItemProps) {
    const { locale } = useLocale();
    const { route } = useLocation();

    const value = goals[code];
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

    const onClick = () => route(`/settings/goals?code=${code}`);

    return (
        <FeatureItem
            onClick={onClick}
            title={locale.macros[code].full}
            caption={caption}
        />
    );
}

type GoalsSectionProps = {
    goals: SettingGoalsValue;
};

function GoalsSection({ goals }: GoalsSectionProps) {
    const { locale } = useLocale();
    return (
        <>
            <Section>{locale.settings.dailyGoals}</Section>
            <List>
                {macroCodeOrder.map((code) => (
                    <GoalItem code={code} goals={goals} />
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
    goals: SettingGoalsValue;
};

function KcalMismatchHintSection({ goals }: KcalMismatchHintSectionProps) {
    const { locale } = useLocale();
    const hints: { text: string; description: string }[] = [];
    let min = 0,
        max = 0,
        macrosMin = 0,
        macrosMax = 0;
    for (const code of macroCodeOrder) {
        if (code === 'kcal') {
            min = goals[code].min;
            max = goals[code].max;
            continue;
        }
        macrosMin = addMacroKcal(macrosMin, code, goals[code].min);
        macrosMax = addMacroKcal(macrosMax, code, goals[code].max);
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

    return (
        <>
            {hints.map(({ text, description }) => (
                <Hint>
                    {text}
                    <br />
                    <span className="font-bold">{description}</span>
                </Hint>
            ))}
        </>
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
        return SettingQueries.getGoals(new Date());
    });
    const { data: profile } = useQuery(() => {
        return SettingQueries.getProfile(new Date());
    });

    return (
        <Page>
            <HeaderSection />
            <ScrollableContent>
                {goals.value && (
                    <>
                        {profile.value && (
                            <ProfileSection
                                profile={profile.value.value}
                                goals={goals.value.value}
                            />
                        )}
                        <GoalsSection goals={goals.value.value} />
                        <KcalMismatchHintSection goals={goals.value.value} />
                    </>
                )}
                <SystemSettingsSection />
            </ScrollableContent>
        </Page>
    );
}
