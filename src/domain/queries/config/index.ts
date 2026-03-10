import { db } from '@/domain/db';
import type {
    Config,
    ConfigDailyGoalReduced,
    ConfigSection,
    MacroCode,
    MinMaxValue,
} from '@/domain/entities';
import { macroCodeOrder } from '@/domain/utils';
import { getSQL } from './sql/get';
import { getManySQL } from './sql/get-many';
import { updateSQL } from './sql/update';

type InternalConfig = Omit<Config, 'value'> & {
    value: string;
};

export const ConfigQueries = new (class {
    private map(setting: InternalConfig): Config {
        return {
            ...setting,
            value: JSON.parse(setting.value),
        };
    }

    async getMany(section: ConfigSection): Promise<Config[]> {
        const settings = await db.select<InternalConfig>(getManySQL, {
            section,
        });
        return settings.map(this.map);
    }

    async get(section: ConfigSection, code: MacroCode): Promise<Config> {
        const setting = await db.selectOne<InternalConfig>(getSQL, {
            section,
            code,
        });
        return this.map(setting);
    }

    async update(section: ConfigSection, code: MacroCode, value: MinMaxValue) {
        const valueStr = JSON.stringify(value);
        await db.exec(updateSQL, { section, code, value: valueStr });
    }

    getEmptyDailyGoals() {
        const value = { min: 0, max: 0 };
        return macroCodeOrder.reduce((v, code) => {
            v[code] = value;
            return v;
        }, {} as ConfigDailyGoalReduced);
    }
})();
