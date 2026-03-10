import { endOfDay, startOfDay } from 'date-fns';
import { db } from '@/domain/db';
import type {
    CalculatedMeal,
    FullMeal,
    IngredientType,
} from '@/domain/entities';
import type { Unit } from '@/domain/utils';
import { sumTotals } from '@/domain/utils';
import { buildSaveMealQuery } from './save-meal-builder';
import { deleteSQL } from './sql/delete';
import { getFullSQL } from './sql/get-full';
import { getManyCommittedByDaySQL } from './sql/get-many-by-day';

type InternalMealWithIngredients = CalculatedMeal & {
    ingredient_id: string;
    ingredient_type: IngredientType;
    ingredient_amount: number;
    product_id: string;
    product_name: string;
    product_brand: string | null;
    product_piece: number | null;
    product_unit: Unit;
};

export const MealQueries = new (class {
    async save(meal: FullMeal) {
        const statements = buildSaveMealQuery(meal);
        await db.exec('BEGIN TRANSACTION;');
        try {
            for (const { sql, args } of statements) {
                await db.exec(sql, args);
            }
        } catch (e) {
            await db.exec('ROLLBACK;');
            throw e;
        }
        await db.exec('COMMIT;');
    }

    async getManyCommittedByDay(date: Date): Promise<CalculatedMeal[]> {
        const start = startOfDay(date).getTime();
        const end = endOfDay(date).getTime();

        const res = await db.select<CalculatedMeal>(getManyCommittedByDaySQL, {
            start,
            end,
        });

        return res;
    }

    async getFull(id: string): Promise<FullMeal | null> {
        const rows = await db.select<InternalMealWithIngredients>(getFullSQL, {
            id,
        });

        if (rows.length === 0) {
            return null;
        }

        const firstRow = rows[0];

        return {
            id: firstRow.id,
            name: firstRow.name,
            comment: firstRow.comment,
            portion: firstRow.portion,
            committed_at: firstRow.committed_at,
            created_at: firstRow.created_at,
            updated_at: firstRow.updated_at,

            ingredients: rows
                .map((row) => ({
                    id: row.ingredient_id,
                    amount: row.ingredient_amount,
                    type: row.ingredient_type,
                    kcal: row.kcal,
                    protein: row.protein,
                    fat: row.fat,
                    carbs: row.carbs,
                    product: {
                        id: row.product_id,
                        brand: row.product_brand,
                        name: row.product_name,
                        piece: row.product_piece,
                        unit: row.product_unit,
                    },
                }))
                .filter((row) => row.id),

            ...sumTotals(rows),
        };
    }

    async delete(id: string) {
        await db.exec(deleteSQL, { id });
    }
})();
