export const saveSQL = `
INSERT INTO
    tags (id, title)
VALUES
    ($id, $title)
ON CONFLICT (id) DO UPDATE
SET
    title = excluded.title;
`;
