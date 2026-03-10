export const saveSQL = `
INSERT INTO
    products (
        id,
        name,
        brand,
        comment,
        kcal,
        protein,
        fat,
        carbs,
        unit,
        piece,
        created_at,
        updated_at
    )
VALUES
    (
        $id,
        $name,
        $brand,
        $comment,
        $kcal,
        $protein,
        $fat,
        $carbs,
        $unit,
        $piece,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (id) DO UPDATE
SET
    name = excluded.name,
    brand = excluded.brand,
    comment = excluded.comment,
    kcal = excluded.kcal,
    protein = excluded.protein,
    fat = excluded.fat,
    carbs = excluded.carbs,
    unit = excluded.unit,
    piece = excluded.piece,
    updated_at = CURRENT_TIMESTAMP;
`;
