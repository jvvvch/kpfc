export const getFullSQL = `
SELECT
    m.id,
    m.name,
    m.comment,
    m.portion,
    m.committed_at,
    m.created_at,
    m.updated_at,
    i.id AS ingredient_id,
    i.type AS ingredient_type,
    i.amount AS ingredient_amount,
    p.id AS product_id,
    p.name AS product_name,
    p.unit AS product_unit,
    p.brand AS product_brand,
    p.piece AS product_piece,
    SUM(
        p.kcal * i.amount * CASE
            WHEN i.type == 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) AS kcal,
    SUM(
        p.protein * i.amount * CASE
            WHEN i.type == 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) AS protein,
    SUM(
        p.fat * i.amount * CASE
            WHEN i.type == 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) AS fat,
    SUM(
        p.carbs * i.amount * CASE
            WHEN i.type == 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) AS carbs
FROM
    meals m
    LEFT JOIN ingredients i ON i.meal_id = m.id
    LEFT JOIN products p ON i.product_id = p.id
WHERE
    m.id == $id
GROUP BY
    i.id
ORDER BY
    i.id ASC;
`;
