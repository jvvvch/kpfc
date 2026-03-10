import { Navigation } from '@/components/feature';
import { LayoutProvider } from '@/contexts';
import type { ChildrenProps } from '@/types';

export function Page({ children }: ChildrenProps) {
    return (
        <div className="grow flex flex-col gap-3 overflow-y-auto overflow-x-hidden relative h-full">
            <LayoutProvider>{children}</LayoutProvider>
        </div>
    );
}

export function PageWrapper({ children }: ChildrenProps) {
    return (
        <div className="flex flex-col h-screen max-h-screen p-5 gap-3 group">
            {children}
            <Navigation />
        </div>
    );
}
