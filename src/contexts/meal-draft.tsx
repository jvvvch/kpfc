import {
    createModel,
    type Model,
    type ReadonlySignal,
    signal,
} from '@preact/signals';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { uuidv7 } from 'uuidv7';
import type {
    FullMeal,
    FullMealIngredient,
    Ingredient,
    Macros,
    Meal,
    Product,
} from '@/domain/entities';
import { ingredientMacros, sumTotals } from '@/domain/utils';
import type { ChildrenProps } from '@/types';

type FlatIngredient = Pick<Ingredient, 'id' | 'type' | 'amount'>;
type UpdateableIngredient = Partial<Omit<FlatIngredient, 'id'>>;
type FlatProduct = Pick<Product, 'id' | 'name' | 'piece' | 'brand' | 'unit'> &
    Macros;

type MealDraftModel = {
    meal: ReadonlySignal<FullMeal | null>;
    currentIngredient: ReadonlySignal<FlatIngredient | null>;

    isActive(): boolean;

    start(meal?: FullMeal): void;
    cancel(): void;
    update(update: Partial<Meal>): void;

    setCurrentIngredient(ingredient: FlatIngredient): void;
    clearCurrentIngredient(): void;
    updateCurrentIngredient(update: UpdateableIngredient): void;
    commitCurrentIngredient(product: FlatProduct): void;

    removeIngredient(id: string): void;
};

const MealDraftContext = createContext<Model<MealDraftModel>>(undefined);

const model = new (createModel<MealDraftModel>(() => {
    const meal = signal<FullMeal | null>(null);
    const currentIngredient = signal<FlatIngredient | null>(null);

    return {
        meal,
        currentIngredient,

        isActive() {
            return meal.value !== null;
        },

        start(newMeal) {
            if (!newMeal) {
                newMeal = {
                    id: uuidv7(),
                    name: '',
                    comment: null,
                    portion: 1,
                    ingredients: [],
                    kcal: 0,
                    protein: 0,
                    fat: 0,
                    carbs: 0,
                    committed_at: Date.now(),
                };
            }
            meal.value = JSON.parse(JSON.stringify(newMeal));
            currentIngredient.value = null;
        },
        cancel() {
            meal.value = null;
            currentIngredient.value = null;
        },

        update(update) {
            if (!meal.value) {
                return;
            }
            meal.value = { ...meal.value, ...update };
        },

        setCurrentIngredient(ingredient) {
            currentIngredient.value = ingredient;
        },
        clearCurrentIngredient() {
            currentIngredient.value = null;
        },
        updateCurrentIngredient(update) {
            currentIngredient.value = { ...currentIngredient.value, ...update };
        },
        commitCurrentIngredient(product) {
            if (!meal.value || !currentIngredient.value) {
                return;
            }

            const fullIngredient: FullMealIngredient = {
                ...currentIngredient.value,
                ...ingredientMacros(product, currentIngredient.value),
                product,
            };

            const ingredients = [...meal.value.ingredients];
            const existing = meal.value.ingredients.find(
                (i) => i.id === currentIngredient.value.id,
            );
            if (existing) {
                Object.assign(existing, fullIngredient);
            } else {
                ingredients.push(fullIngredient);
            }

            meal.value = {
                ...meal.value,
                ...sumTotals(ingredients),
                ingredients,
            };
        },

        removeIngredient(id) {
            const ingredients = meal.value.ingredients.filter(
                (i) => i.id !== id,
            );
            meal.value = {
                ...meal.value,
                ...sumTotals(ingredients),
                ingredients,
            };
        },
    };
}))();

export function MealDraftProvider({ children }: ChildrenProps) {
    return (
        <MealDraftContext.Provider value={model}>
            {children}
        </MealDraftContext.Provider>
    );
}

export const useMealDraft = () => useContext(MealDraftContext);
