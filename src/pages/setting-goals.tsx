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
import type { MacroCode, MinMaxValue, SettingGoals } from '@/domain/entities';
import { SettingQueries } from '@/domain/queries/setting';
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
    goals: Signal<SettingGoals>;
    code: MacroCode;
    valueKey: keyof MinMaxValue;
};

const getSettingValue = (
    goals: SettingGoals,
    code: MacroCode,
    valueKey: keyof MinMaxValue,
) => {
    return goals.value[code][valueKey];
};

function SettingValue({ valueKey, code, goals }: SettingValueProps) {
    const { locale } = useLocale();

    const { full, short } = locale.settings[valueKey];
    const enabled = useComputed(
        () => getSettingValue(goals.value, code, valueKey) !== null,
    );
    const text = useComputed(() =>
        String(getSettingValue(goals.value, code, valueKey) || ''),
    );

    const { onSwitch } = useSwitch(
        getSettingValue(goals.peek(), code, valueKey) || 0,
    );

    const updateValue = (value: number | null) => {
        goals.value.value[code][valueKey] = value;
        goals.value = { ...goals.value };
    };

    const onInput = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onInput(e.currentTarget.value);
    };
    const onChange = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onChange(e.currentTarget.value);
        updateValue(NumberSanitizer.toNumber(e.currentTarget.value));
    };

    const switchOnClick = () => {
        batch(() =>
            updateValue(onSwitch(getSettingValue(goals.value, code, valueKey))),
        );
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
                    caption={locale.unit[macroUnit(code)]}
                    value={text.value}
                />
            )}
        </List>
    );
}

type SettingValueListProps = {
    goals: Signal<SettingGoals>;
    code: MacroCode;
};

function SettingValueList({ goals, code }: SettingValueListProps) {
    const { locale } = useLocale();
    return (
        <>
            <Section>{locale.macros[code].full}</Section>
            {minMaxValueOrder.map((key) => (
                <SettingValue code={code} valueKey={key} goals={goals} />
            ))}
        </>
    );
}

type BottomSectionProps = {
    goals: Signal<SettingGoals>;
};

function BottomSection({ goals }: BottomSectionProps) {
    const { locale } = useLocale();
    const { route } = useLocation();

    const handleSave = async () => {
        if (!goals.value) {
            return;
        }
        await SettingQueries.updateGoals(goals.value.value);
        route('/settings');
    };

    return (
        <BottomGroup>
            {goals.value !== null && (
                <PrimaryButton onClick={handleSave}>
                    {locale.common.save}
                </PrimaryButton>
            )}
        </BottomGroup>
    );
}

export function SettingGoalsPage() {
    const {
        query: { code },
    } = useRoute();

    const { data: goals } = useQuery(() => {
        return SettingQueries.getGoals(new Date());
    });

    return (
        <Page>
            <HeaderSection />
            {goals.value && (
                <SettingValueList goals={goals} code={code as MacroCode} />
            )}
            <BottomSection goals={goals} />
        </Page>
    );
}
