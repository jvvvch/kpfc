import type {
    Setting,
    SettingCode,
    SettingGoals,
    SettingGoalsValue,
    SettingProfile,
    SettingProfileValue,
} from '@/domain/entities';

export type SettingValueMapper<TSetting extends Setting<SettingCode, object>> =
    {
        fromDB: (value: string) => TSetting['value'];
        toDB: (value: TSetting['value']) => string;
    };

export const SettingGoalsValueMapper: SettingValueMapper<SettingGoals> = {
    fromDB: (value: string) => {
        return JSON.parse(value);
    },
    toDB: (value: SettingGoalsValue) => {
        return JSON.stringify(value);
    },
};

export const SettingProfileValueMapper: SettingValueMapper<SettingProfile> = {
    fromDB: (value: string) => {
        const v = JSON.parse(value);
        return {
            ...v,
            birth_date: v.birth_date ? new Date(v.birth_date) : null,
        };
    },
    toDB: (value: SettingProfileValue) => {
        return JSON.stringify({
            ...value,
            birth_date: value.birth_date ? value.birth_date.getTime() : null,
        });
    },
};
