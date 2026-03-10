import type { BindableValue, SqlValue } from '@sqlite.org/sqlite-wasm';
import { type Promiser, sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm';
import { MigrationRunner } from './migration-runner';

type SqlResult = Record<string, SqlValue>;

export class DatabaseWrapper {
    private promiserPromise: Promise<Promiser>;
    private migrationRunnerPromise: Promise<void>;

    async init(dbName: string) {
        console.time('db init');
        if (!this.promiserPromise) {
            this.promiserPromise = this.initPromiser(dbName);
        }
        await this.promiserPromise;

        if (!this.migrationRunnerPromise) {
            const migrationRunner = new MigrationRunner(this);
            this.migrationRunnerPromise = migrationRunner.init();
        }
        await this.migrationRunnerPromise;
        console.timeEnd('db init');
    }

    private async initPromiser(dbName: string) {
        try {
            const promiser: Promiser = await new Promise((res) => {
                const _promiser = sqlite3Worker1Promiser({
                    onready: () => res(_promiser),
                });
            });
            await promiser('open', {
                filename: `file:${dbName}.sqlite3?vfs=opfs`,
            });

            await promiser('exec', { sql: 'PRAGMA foreign_keys = ON;' });
            await promiser('exec', { sql: 'PRAGMA synchronous = OFF;' });
            await promiser('exec', { sql: 'PRAGMA journal_mode = WAL;' });
            await promiser('exec', { sql: 'PRAGMA locking_mode = EXCLUSIVE;' });

            return promiser;
        } catch (error) {
            console.error(`failed to initialize db: ${error}`);
            throw error;
        }
    }

    private prepareBind(bind?: Record<string, BindableValue>) {
        if (!bind) {
            return;
        }
        return Object.keys(bind).reduce((v, k) => {
            v[`$${k}`] = bind[k];
            return v;
        }, {});
    }

    async select<T extends SqlResult = SqlResult>(
        sql: string,
        bind?: Record<string, BindableValue>,
    ): Promise<T[]> {
        const promiser = await this.promiserPromise;
        const result = await promiser('exec', {
            sql,
            bind: this.prepareBind(bind),
            returnValue: 'resultRows',
            rowMode: 'object',
        });
        if (result.type === 'error') {
            throw new Error(result.result.message);
        }
        return (result.result.resultRows || []) as T[];
    }

    async selectOne<T extends SqlResult = SqlResult>(
        sql: string,
        bind?: Record<string, BindableValue>,
    ): Promise<T> {
        const result = await this.select<T>(sql, bind);
        return result[0];
    }

    async exec(
        sql: string,
        bind?: Record<string, BindableValue> | Array<BindableValue>,
    ): Promise<void> {
        const promiser = await this.promiserPromise;
        const result = await promiser('exec', {
            sql,
            bind: Array.isArray(bind) ? bind : this.prepareBind(bind),
        });
        if (result.type === 'error') {
            throw new Error(result.result.message);
        }
    }
}

export const db = new DatabaseWrapper();
