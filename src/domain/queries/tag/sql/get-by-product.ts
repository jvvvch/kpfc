export const getByProductSQL = `
SELECT
    t.id AS id,
    t.title AS title
FROM
    product_tags pt
    JOIN tags t ON t.id = pt.tag_id
WHERE
    pt.product_id = $id;
`;
