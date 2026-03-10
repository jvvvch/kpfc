export const LocalStorage = new (class {
    get<T extends string>(key: string) {
        if (!window) {
            return;
        }
        return localStorage.getItem(key) as T;
    }

    save(key: string, value: string) {
        if (!window) {
            return;
        }
        localStorage.setItem(key, value);
    }
})();
