import { en, ru } from './locales';

export const locales = {
    en,
    ru,
};

export type Language = keyof typeof locales;
export * from './type';
