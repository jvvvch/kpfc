export const NumberSanitizer = {
    onInput: (s, o = { float: false }) => {
        let actualValue = '';
        let dot = false;
        for (const c of s || '') {
            const ch = c === ',' ? '.' : c;

            if (o.float && ch === '.' && !dot && actualValue.length) {
                dot = true;
                actualValue += ch;
            }
            if (ch >= '0' && ch <= '9') {
                actualValue += ch;
            }
        }

        return actualValue;
    },

    onChange: (s: string) => {
        if (s[s.length - 1] === '.') {
            return s.slice(0, s.length - 1);
        }
        return s;
    },

    reduce: (n: number, len: number) => {
        const s = String(n);
        if (s.length <= len) {
            return n;
        }
        const parts = s.split('.');
        const real = parts[0];
        const frac = parts[1];
        const space = len - real.length;
        if (space <= 0 || frac.length <= 0) {
            return Number(real);
        }
        return Number(`${real}.${frac.slice(0, space)}`);
    },

    toNumber: (s: string) => {
        const n = Number(s);
        return Number.isNaN(s) ? 0 : n;
    },

    reduce2: (s: string, len: number) => {
        if (s.length <= len) {
            return s;
        }
        const parts = s.split('.');
        const real = parts[0];
        const frac = parts[1];
        const space = len - real.length;
        if (space <= 0 || frac.length <= 0) {
            return real;
        }
        return `${real}.${frac.slice(0, space)}`;
    },
};
