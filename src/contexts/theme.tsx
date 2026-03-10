import { type Signal, useSignal, useSignalEffect } from '@preact/signals';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { ChildrenProps } from '@/types';
import { LocalStorage } from '@/utils';

export enum Theme {
    light = 'light',
    dark = 'dark',
}

const ThemeState = createContext<{
    theme: Signal<Theme>;
}>(undefined);

const storageKey = 'theme';

export function ThemeProvider({ children }: ChildrenProps) {
    const theme = useSignal(LocalStorage.get<Theme>(storageKey) || Theme.light);

    useSignalEffect(() => {
        const root = window.document.documentElement;
        root.dataset.theme = theme.value;
        LocalStorage.save(storageKey, theme.value);
    });

    return (
        <ThemeState.Provider value={{ theme }}>{children}</ThemeState.Provider>
    );
}

export const useTheme = () => useContext(ThemeState);
