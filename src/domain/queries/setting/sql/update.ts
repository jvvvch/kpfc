export const updatePreviousSQL = `
UPDATE settings
SET
    valid_to = $date
WHERE
    code = $code
    AND valid_to IS NULL;
`;

export const removeCurrentSQL = `
DELETE FROM settings
WHERE
    code = $code
    AND valid_from = $date;
`;

export const insertSQL = `
INSERT INTO
    settings (code, value, valid_from, valid_to)
VALUES
    ($code, $value, $date, NULL);
`;
