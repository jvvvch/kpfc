import { useSignal } from '@preact/signals';
import { useLayoutEffect } from 'preact/hooks';
import { useLayout } from '@/contexts';
import type { ChildrenProps } from '@/types';

export function ScrollableContent({ children }: ChildrenProps) {
    const { bottomGroupRef } = useLayout();
    const padding = useSignal('0px');

    useLayoutEffect(() => {
        const element = bottomGroupRef.current;
        if (!element) {
            return;
        }

        const updatePadding = () => {
            if (!element) {
                padding.value = '0px';
                return;
            }
            padding.value = `calc(${element.offsetHeight}px + 2 * var(--spacing))`;
        };

        const observer = new ResizeObserver(updatePadding);
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            className="overflow-y-auto relative scroll-auto flex-1"
            style={{ paddingBottom: padding.value }}
        >
            {children}
        </div>
    );
}
