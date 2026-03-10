export const deleteSQL = `
DELETE FROM products
WHERE
    id = $id;
`;
