export const getManySQL = `
SELECT
    *
FROM
    configs
WHERE
    section = $section;
`;
