import type { FullMeal, FullMealIngredient } from '@/domain/entities';
import {
    insertIngredientsSQL,
    removeAllIngredientsSQL,
    removeIngredientsSQL,
    saveMealSQL,
} from './sql/save';

const mealArgs = (meal: FullMeal) => {
    return [meal.id, meal.name, meal.portion, meal.committed_at];
};

const ingredientIdsArgs = (ingredients: FullMeal['ingredients']) => {
    return ingredients.reduce(
        (v, i, index) => {
            if (index > 0) {
                v.pattern += ', ';
            }
            v.pattern += '?';
            v.values.push(i.id);
            return v;
        },
        { pattern: '', values: [] },
    );
};

const ingredientArgs = (mealId: string, ingredient: FullMealIngredient) => {
    return {
        pattern: '(?, ?, ?, ?, ?)',
        values: [
            ingredient.id,
            mealId,
            ingredient.product.id,
            ingredient.type,
            ingredient.amount,
        ],
    };
};

export const buildSaveMealQuery = (meal: FullMeal) => {
    const statements = [{ sql: saveMealSQL, args: mealArgs(meal) }];

    if (!meal.ingredients.length) {
        statements.push({
            sql: removeAllIngredientsSQL,
            args: [meal.id],
        });
    } else {
        const { pattern, values } = ingredientIdsArgs(meal.ingredients);
        statements.push({
            sql: removeIngredientsSQL.replace('$ids', pattern),
            args: [meal.id, ...values],
        });
    }

    if (meal.ingredients.length) {
        const patternParts = [];
        const allValues = [];
        for (const ingredient of meal.ingredients) {
            const { pattern, values } = ingredientArgs(meal.id, ingredient);
            patternParts.push(pattern);
            allValues.push(...values);
        }
        const pattern = patternParts.join(', ');

        statements.push({
            sql: insertIngredientsSQL.replace('$ingredients', pattern),
            args: allValues,
        });
    }

    return statements;
};
