export const getManyCommittedByDaySQL = `
SELECT
    m.*,
    SUM(
        p.kcal * i.amount * CASE
            WHEN i.type = 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) * m.portion AS kcal,
    SUM(
        p.protein * i.amount * CASE
            WHEN i.type = 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) * m.portion AS protein,
    SUM(
        p.fat * i.amount * CASE
            WHEN i.type = 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) * m.portion AS fat,
    SUM(
        p.carbs * i.amount * CASE
            WHEN i.type = 'piece' THEN p.piece
            ELSE 1
        END / 100
    ) * m.portion AS carbs
FROM
    meals m
    LEFT JOIN ingredients i ON i.meal_id = m.id
    LEFT JOIN products p ON i.product_id = p.id
WHERE
    m.committed_at >= $start
    AND m.committed_at <= $end
GROUP BY
    m.id
ORDER BY
    m.committed_at ASC
`;
