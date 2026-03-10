import { batch, type Signal, useComputed } from '@preact/signals';
import type { TargetedEvent } from 'preact';
import { useLocation, useRoute } from 'preact-iso';
import {
    Header,
    IconButton,
    List,
    PrimaryButton,
    Section,
} from '@/components/atomic';
import {
    BottomGroup,
    FeatureItemSwitch,
    FeatureItemTextInput,
    HeaderActions,
    HeaderGroup,
    Page,
} from '@/components/feature';
import { useLocale } from '@/contexts';
import {
    type ConfigDailyGoal,
    ConfigSection,
    type MacroCode,
    type MinMaxValue,
} from '@/domain/entities';
import { ConfigQueries } from '@/domain/queries/config';
import { macroUnit, minMaxValueOrder } from '@/domain/utils';
import { useQuery, useSwitch } from '@/hooks';
import { NumberSanitizer } from '@/utils';

function HeaderSection() {
    const { locale } = useLocale();

    return (
        <HeaderGroup>
            <HeaderActions>
                <IconButton.ChevronLeft onClick={() => window.history.back()} />
            </HeaderActions>
            <Header>{locale.settings.dailyGoals}</Header>
        </HeaderGroup>
    );
}

type SettingValueProps = {
    goal: Signal<ConfigDailyGoal>;
    valueKey: keyof MinMaxValue;
};

function SettingValue({ valueKey, goal }: SettingValueProps) {
    const { locale } = useLocale();

    const { full, short } = locale.settings[valueKey];
    const enabled = useComputed(() => goal.value.value[valueKey] !== null);
    const text = useComputed(() => String(goal.value.value[valueKey] || ''));

    const { onSwitch } = useSwitch(goal.peek().value[valueKey] || 0);

    const updateValue = (value: number | null) => {
        goal.value = {
            ...goal.value,
            value: {
                ...goal.value.value,
                [valueKey]: value,
            },
        };
    };

    const onInput = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onInput(e.currentTarget.value);
    };
    const onChange = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onChange(e.currentTarget.value);
        updateValue(NumberSanitizer.toNumber(e.currentTarget.value));
    };

    const switchOnClick = () => {
        batch(() => updateValue(onSwitch(goal.value.value[valueKey])));
    };

    return (
        <List>
            <FeatureItemSwitch
                title={full}
                checked={enabled.value}
                onClick={switchOnClick}
            />
            {enabled.value && (
                <FeatureItemTextInput
                    title={short}
                    onInput={onInput}
                    onChange={onChange}
                    placeholder="0"
                    caption={locale.unit[macroUnit(goal.value.code)]}
                    value={text.value}
                />
            )}
        </List>
    );
}

type SettingValueListProps = {
    goal: Signal<ConfigDailyGoal>;
};

function SettingValueList({ goal }: SettingValueListProps) {
    const { locale } = useLocale();
    return (
        <>
            <Section>{locale.macros[goal.value.code].full}</Section>
            {minMaxValueOrder.map((key) => (
                <SettingValue valueKey={key} goal={goal} />
            ))}
        </>
    );
}

type BottomSectionProps = {
    goal: Signal<ConfigDailyGoal>;
};

function BottomSection({ goal }: BottomSectionProps) {
    const { locale } = useLocale();
    const { route } = useLocation();

    const handleSave = async () => {
        if (!goal.value) {
            return;
        }
        await ConfigQueries.update(
            goal.value.section,
            goal.value.code,
            goal.value.value,
        );
        route('/settings');
    };

    return (
        <BottomGroup>
            {goal.value !== null && (
                <PrimaryButton onClick={handleSave}>
                    {locale.common.save}
                </PrimaryButton>
            )}
        </BottomGroup>
    );
}

export function SettingPage() {
    const {
        params: { code },
    } = useRoute();

    const { data: goal } = useQuery(() => {
        return ConfigQueries.get(ConfigSection.daily_goal, code as MacroCode);
    });

    return (
        <Page>
            <HeaderSection />
            {goal.value && <SettingValueList goal={goal} />}
            <BottomSection goal={goal} />
        </Page>
    );
}
