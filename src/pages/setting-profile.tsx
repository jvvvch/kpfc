import { type Signal, useSignal, useSignalEffect } from '@preact/signals';
import { startOfDay } from 'date-fns';
import type { TargetedEvent } from 'preact';
import {
    Header,
    Hint,
    IconButton,
    List,
    PrimaryButton,
    type SelectOption,
} from '@/components/atomic';
import {
    BottomGroup,
    FeatureItemDatePicker,
    FeatureItemSelect,
    FeatureItemTextInput,
    HeaderActions,
    HeaderGroup,
    Page,
} from '@/components/feature';
import { useLocale } from '@/contexts';
import {
    type ActivityLevel,
    type SettingProfile,
    Sex,
} from '@/domain/entities';
import { SettingQueries } from '@/domain/queries/setting';
import { activityLevelOrder } from '@/domain/utils';
import { useQuery } from '@/hooks';
import { NumberSanitizer } from '@/utils';

function HeaderSection() {
    const { locale } = useLocale();

    return (
        <HeaderGroup>
            <HeaderActions>
                <IconButton.ChevronLeft onClick={() => window.history.back()} />
            </HeaderActions>
            <Header>{locale.settings.profile.title}</Header>
        </HeaderGroup>
    );
}

type SettingProfileProps = {
    profile: Signal<SettingProfile>;
};

function SettingValueSex({ profile }: SettingProfileProps) {
    const { locale } = useLocale();
    const options: SelectOption<Sex | ''>[] = [
        { label: locale.settings.profile.unspecified, value: '' },
        { label: locale.settings.profile.sex.male, value: Sex.male },
        { label: locale.settings.profile.sex.female, value: Sex.female },
    ];

    const onChange = (value: Sex | '') => {
        profile.value.value.sex = value || null;
        profile.value = { ...profile.value };
    };

    return (
        <FeatureItemSelect
            variant="noBorder"
            title={locale.settings.profile.sexHeader}
            options={options}
            selected={profile.value.value.sex}
            onChange={onChange}
        />
    );
}

function SettingValueBirthDate({ profile }: SettingProfileProps) {
    const { locale } = useLocale();
    const onChange = (value: Date) => {
        profile.value.value.birth_date = startOfDay(value);
        profile.value = { ...profile.value };
    };

    return (
        <FeatureItemDatePicker
            title={locale.settings.profile.birthDate}
            value={profile.value.value.birth_date}
            placeholder={locale.settings.profile.unspecified}
            onChange={onChange}
        />
    );
}

type SettingHeightWeightProps = SettingProfileProps & {
    type: 'weight' | 'height';
};

function SettingValueHeightWeight({ profile, type }: SettingHeightWeightProps) {
    const { locale } = useLocale();

    const onInput = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onInput(e.currentTarget.value, {
            float: type === 'weight',
        });
    };

    const onChange = (e: TargetedEvent<HTMLInputElement>) => {
        e.currentTarget.value = NumberSanitizer.onChange(e.currentTarget.value);
        profile.value.value[type] =
            NumberSanitizer.toNumber(e.currentTarget.value) || null;
        profile.value = { ...profile.value };
    };

    const unit = locale.unit[type === 'weight' ? 'kg' : 'cm'];

    return (
        <FeatureItemTextInput
            title={locale.settings.profile[type]}
            onChange={onChange}
            onInput={onInput}
            value={String(profile.value.value[type] || '')}
            placeholder={locale.settings.profile.unspecified}
            caption={unit}
        />
    );
}

function SettingValueActivityLevel({ profile }: SettingProfileProps) {
    const { locale } = useLocale();
    const options: SelectOption<ActivityLevel | ''>[] = [
        { label: locale.settings.profile.unspecified, value: '' },
        ...activityLevelOrder.map((value) => ({
            label: locale.settings.profile.activityLevel[value],
            value,
        })),
    ];

    const onChange = (level: ActivityLevel | '') => {
        profile.value.value.activity_level = level || null;
        profile.value = { ...profile.value };
    };

    return (
        <FeatureItemSelect
            variant="noBorder"
            onChange={onChange}
            title={locale.settings.profile.activityLevelHeader}
            options={options}
            selected={profile.value.value.activity_level}
        />
    );
}

function SettingValueList({ profile }: SettingProfileProps) {
    return (
        <List>
            <SettingValueSex profile={profile} />
            <SettingValueBirthDate profile={profile} />
            <SettingValueHeightWeight type="height" profile={profile} />
            <SettingValueHeightWeight type="weight" profile={profile} />
            <SettingValueActivityLevel profile={profile} />
        </List>
    );
}

function ActivityLevelHintSection() {
    const { locale } = useLocale();

    return (
        <>
            <Hint>{locale.settings.profile.activityLevelHint.title}:</Hint>
            <div className="flex flex-col gap-1">
                {activityLevelOrder.map((level) => (
                    <HeaderActions>
                        <span className="animate-in-from-top pl-1 text-muted-foreground">
                            {locale.settings.profile.activityLevel[level]}
                        </span>
                        <span className="animate-in-from-top text-muted-foreground">
                            {locale.settings.profile.activityLevelHint[level]}
                        </span>
                    </HeaderActions>
                ))}
            </div>
        </>
    );
}

function BottomSection({ profile }: SettingProfileProps) {
    const { locale } = useLocale();

    const showSave = useSignal<boolean | null>(null);

    useSignalEffect(() => {
        if (profile.value === null) {
            return;
        }
        if (showSave.peek() === null) {
            showSave.value = false;
            return;
        }
        if (showSave.peek() === false) {
            showSave.value = true;
            return;
        }
    });

    const saveOnClick = async () => {
        await SettingQueries.updateProfile(profile.value.value);
        showSave.value = false;
    };

    return (
        <BottomGroup>
            {showSave.value && (
                <PrimaryButton onClick={saveOnClick}>
                    {locale.common.save}
                </PrimaryButton>
            )}
        </BottomGroup>
    );
}

export function SettingProfilePage() {
    const { data: profile } = useQuery(() => {
        return SettingQueries.getProfile(new Date());
    });

    return (
        <Page>
            <HeaderSection />
            {profile.value && <SettingValueList profile={profile} />}
            {profile.value && <BottomSection profile={profile} />}
            <ActivityLevelHintSection />
        </Page>
    );
}
