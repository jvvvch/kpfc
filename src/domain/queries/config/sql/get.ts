export const getSQL = `
SELECT
    *
FROM
    configs
WHERE
    section = $section
    AND code = $code;
`;
