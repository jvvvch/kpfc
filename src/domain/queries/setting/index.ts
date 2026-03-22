import { startOfDay } from 'date-fns';
import { db } from '@/domain/db';
import {
    type Setting,
    SettingCode,
    type SettingGoals,
    type SettingGoalsValue,
    type SettingProfile,
    type SettingProfileValue,
} from '@/domain/entities';
import {
    SettingGoalsValueMapper,
    SettingProfileValueMapper,
    type SettingValueMapper,
} from './mapper';
import { getSQL } from './sql/get';
import { insertSQL, removeCurrentSQL, updatePreviousSQL } from './sql/update';

export type InternalSetting<TSetting extends Setting<SettingCode, object>> =
    Omit<TSetting, 'value'> & {
        value: string;
    };

export const SettingQueries = new (class {
    private async internalGet<TSetting extends Setting>(
        code: SettingCode,
        date: Date,
        mapper: SettingValueMapper<TSetting>,
    ) {
        const setting = await db.selectOne<InternalSetting<TSetting>>(getSQL, {
            code,
            date: date.getTime(),
        });
        return {
            ...setting,
            value: mapper.fromDB(setting.value),
        };
    }

    private async internalUpdate<TSetting extends Setting>(
        code: SettingCode,
        value: TSetting['value'],
        mapper: SettingValueMapper<TSetting>,
    ) {
        const date = startOfDay(new Date()).getTime();
        const mappedValue = mapper.toDB(value);
        await db.exec('BEGIN TRANSACTION;');
        try {
            await db.exec(updatePreviousSQL, { code, date });
            await db.exec(removeCurrentSQL, { code, date });
            await db.exec(insertSQL, { code, date, value: mappedValue });
        } catch (e) {
            await db.exec('ROLLBACK;');
            throw e;
        }
        await db.exec('COMMIT;');
    }

    async getGoals(date: Date): Promise<SettingGoals> {
        return this.internalGet<SettingGoals>(
            SettingCode.goals,
            date,
            SettingGoalsValueMapper,
        );
    }

    async getProfile(date: Date): Promise<SettingProfile> {
        return this.internalGet<SettingProfile>(
            SettingCode.profile,
            date,
            SettingProfileValueMapper,
        );
    }

    async updateGoals(value: SettingGoalsValue) {
        return this.internalUpdate<SettingGoals>(
            SettingCode.goals,
            value,
            SettingGoalsValueMapper,
        );
    }

    async updateProfile(value: SettingProfileValue) {
        return this.internalUpdate<SettingProfile>(
            SettingCode.profile,
            value,
            SettingProfileValueMapper,
        );
    }
})();
