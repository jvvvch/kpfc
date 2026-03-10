export const deleteSQL = `
DELETE FROM meals
WHERE
    id = $id;
`;
