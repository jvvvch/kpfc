const initSQL = `
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    comment TEXT,
    brand TEXT,
    unit TEXT NOT NULL,
    piece REAL,
    kcal REAL NOT NULL,
    protein REAL NOT NULL,
    fat REAL NOT NULL,
    carbs REAL NOT NULL,
    created_at DATETIME DEFAULT (strftime('%s', 'now')),
    updated_at DATETIME DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE meals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    comment TEXT,
    portion REAL NOT NULL,
    committed_at DATETIME,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE ingredients (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    meal_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES meals (id) ON DELETE CASCADE
);

CREATE TABLE tags (id TEXT PRIMARY KEY, title TEXT NOT NULL);

CREATE TABLE product_tags (
    product_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
    UNIQUE (product_id, tag_id)
);

CREATE TABLE configs (
    section TEXT NOT NULL,
    code TEXT NOT NULL,
    value TEXT NOT NULL
);

INSERT INTO
    configs (section, code, value)
VALUES
    ('daily_goal', 'kcal', '{"min":null,"max":null}');

INSERT INTO
    configs (section, code, value)
VALUES
    (
        'daily_goal',
        'protein',
        '{"min":null,"max":null}'
    );

INSERT INTO
    configs (section, code, value)
VALUES
    ('daily_goal', 'fat', '{"min":null,"max":null}');

INSERT INTO
    configs (section, code, value)
VALUES
    ('daily_goal', 'carbs', '{"min":null,"max":null}');
`;

export const migrations = [initSQL];
