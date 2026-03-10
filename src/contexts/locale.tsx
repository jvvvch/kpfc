import {
    type Signal,
    useComputed,
    useSignal,
    useSignalEffect,
} from '@preact/signals';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { locales } from '@/i18n';
import type { ChildrenProps } from '@/types';
import { LocalStorage } from '@/utils';

export type Language = keyof typeof locales;

type Locale = (typeof locales)[Language];

const LocaleState = createContext<{
    available: { label: string; value: Language }[];
    language: Signal<Language>;
    locale: Locale;
}>(undefined);

const storageKey = 'language';

export function LocaleProvider({ children }: ChildrenProps) {
    const available = Object.keys(locales).map((language: Language) => ({
        label: locales[language].label,
        value: language,
    }));

    const language = useSignal(
        LocalStorage.get<Language>(storageKey) || available[0].value,
    );
    const locale = useComputed(() => locales[language.value]);

    useSignalEffect(() => {
        LocalStorage.save(storageKey, language.value);
    });

    return (
        <LocaleState.Provider
            value={{ language, locale: locale.value, available }}
        >
            {children}
        </LocaleState.Provider>
    );
}

export const useLocale = () => useContext(LocaleState);
