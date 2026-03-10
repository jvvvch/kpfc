import type { Ingredient } from './ingredient';
import type { Macros } from './macros';
import type { Product } from './product';

export type Meal = {
    id: string;
    name: string;
    comment: string | null;
    portion: number;
    committed_at: number | null;

    created_at?: number;
    updated_at?: number;
};

export type CalculatedMeal = Meal & Macros;

export type FullMealIngredient = Macros &
    Pick<Ingredient, 'id' | 'type' | 'amount'> & {
        product: Pick<Product, 'id' | 'name' | 'piece' | 'unit'>;
    };
export type FullMeal = CalculatedMeal & {
    ingredients: FullMealIngredient[];
};
