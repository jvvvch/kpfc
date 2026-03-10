import type { Signal } from '@preact/signals';
import { useSignalRef } from '@preact/signals/utils';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { ChildrenProps } from '@/types';

const LayoutState = createContext<{
    bottomGroupRef: Signal<HTMLDivElement> & { current: HTMLDivElement };
}>(undefined);

export const LayoutProvider = ({ children }: ChildrenProps) => {
    const bottomGroupRef = useSignalRef<HTMLDivElement | null>(null);

    return (
        <LayoutState.Provider value={{ bottomGroupRef }}>
            {children}
        </LayoutState.Provider>
    );
};

export const useLayout = () => useContext(LayoutState);
