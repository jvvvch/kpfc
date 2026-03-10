export enum IngredientType {
    weight = 'weight',
    piece = 'piece',
}

export type Ingredient = {
    id: string;
    product_id: string;
    type: IngredientType;
    meal_id: string;
    amount: number;
};
