export const saveMealSQL = `
INSERT INTO
    meals (
        id,
        name,
        portion,
        committed_at,
        created_at,
        updated_at
    )
VALUES
    (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE
SET
    name = excluded.name,
    comment = excluded.comment,
    portion = excluded.portion,
    committed_at = excluded.committed_at,
    updated_at = CURRENT_TIMESTAMP;
`;

export const removeIngredientsSQL = `
DELETE FROM ingredients
WHERE
    meal_id = ?
    AND id NOT IN ($ids);
`;

export const removeAllIngredientsSQL = `
DELETE FROM ingredients
WHERE
    meal_id = ?;
`;

export const insertIngredientsSQL = `
INSERT INTO
    ingredients (id, meal_id, product_id, type, amount)
VALUES
    $ingredients
ON CONFLICT (id) DO UPDATE
SET
    meal_id = excluded.meal_id,
    product_id = excluded.product_id,
    type = excluded.type,
    amount = excluded.amount;
`;
