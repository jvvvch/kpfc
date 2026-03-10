export const getSQL = `
SELECT
    *
FROM
    products
WHERE
    id = $id;
`;
