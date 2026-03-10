export const updateSQL = `
UPDATE configs
SET
    value = $value
WHERE
    code = $code
    AND section = $section;
`;
