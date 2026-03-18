export const countMealUsageSQL = `
SELECT
    COUNT(DISTINCT (meal_id)) AS count
FROM
    ingredients
WHERE
    product_id = $id;
`;
