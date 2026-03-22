export const getSQL = `
SELECT
    *
FROM
    settings
WHERE
    code = $code
    AND (
        valid_from IS NULL
        OR valid_from <= $date
    )
    AND (
        valid_to IS NULL
        OR valid_to > $date
    );
`;
