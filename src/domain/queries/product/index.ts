import { uuidv7 } from 'uuidv7';
import { db } from '@/domain/db';
import type { Product } from '@/domain/entities';
import { Unit } from '@/domain/utils';
import { countMealUsageSQL } from './sql/count-meal-usage';
import { deleteSQL } from './sql/delete';
import { getSQL } from './sql/get';
import { getManySQL } from './sql/get-many';
import { saveSQL } from './sql/save';

export const ProductQueries = new (class {
    async get(id: string) {
        return await db.selectOne<Product>(getSQL, { id });
    }

    async getMany() {
        return await db.select<Product>(getManySQL);
    }

    async save(product: Product) {
        const { created_at, updated_at, ...value } = product;
        await db.exec(saveSQL, value);
    }

    async delete(id: string) {
        await db.exec(deleteSQL, { id });
    }

    async countMealUsage(id: string) {
        const { count } = await db.selectOne<{ count: number }>(
            countMealUsageSQL,
            { id },
        );
        return count;
    }

    getDefaultProduct(): Product {
        return {
            id: uuidv7(),
            name: '',
            brand: null,
            comment: null,
            kcal: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            unit: Unit.gram,
            piece: null,
        };
    }
})();
