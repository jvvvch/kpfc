import { readdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const dirs = [
    'components/atomic',
    'components/feature',
    'contexts',
    'hooks',
    'pages',
    'domain/entities',
    'domain/utils',
    'utils',
];

function generateBarrelExports(dir) {
    const dirName = join(process.cwd(), 'src', dir);
    const files = readdirSync(dirName);
    const tsx = files.filter(
        (file) =>
            file.endsWith('.tsx') ||
            (file.endsWith('.ts') && !file.includes('index.ts')),
    );
    const exports = tsx
        .map((file) => {
            const fileName = basename(file, extname(file));
            return `export * from './${fileName}';`;
        })
        .join('\n');

    writeFileSync(join(dirName, 'index.ts'), exports);
    console.log(`generated barrel exports for: ${dir}`);
}

dirs.forEach((dir) => {
    generateBarrelExports(dir);
});
