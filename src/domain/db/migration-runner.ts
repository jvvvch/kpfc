import type { DatabaseWrapper } from './db';
import { migrations } from './migrations';

const createMigrationsTableSQL = `
CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY);
`;

const selectLatestMigrationSQL = `
SELECT
    *
FROM
    migrations
ORDER BY
    id DESC
LIMIT
    1;
`;

const insertMigrationSQL = `
INSERT INTO
    migrations (id)
VALUES
    ($id);
`;

const _dropEverythingSQL = `
DROP TABLE IF EXISTS ingredients;

DROP TABLE IF EXISTS product_tags;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS configs;

DROP TABLE IF EXISTS meals;

DROP TABLE IF EXISTS tags;

DROP TABLE IF EXISTS migrations;
`;

export class MigrationRunner {
    constructor(private readonly db: DatabaseWrapper) {}

    async init() {
        if (!migrations.length) {
            console.log('no migrations to run');
            return;
        }

        await this.db.exec(createMigrationsTableSQL);

        const latest = await this.db.selectOne<{ id: number }>(
            selectLatestMigrationSQL,
        );

        if (!latest || latest.id + 1 < migrations.length) {
            const startIndex = latest ? latest.id + 1 : 0;
            console.log(`running migration from index ${startIndex}`);
            for (let i = startIndex; i < migrations.length; i++) {
                await this.db.exec(migrations[i]);
                await this.db.exec(insertMigrationSQL, { id: i });
                console.log(`applied migration #${i}`);
            }
        } else {
            console.log(
                `no migrations to run (latest run: ${latest?.id}, last migration: ${migrations.length - 1})`,
            );
        }

        console.log('initialized migrations');
    }
}
