import type { ChildrenProps } from '@/types';

export function HeaderGroup({ children }: ChildrenProps) {
    return (
        <header className="w-full flex flex-col gap-3 pb-3">{children}</header>
    );
}

export function HeaderActions({ children }: ChildrenProps) {
    return (
        <div className="flex flex-row w-full justify-between">{children}</div>
    );
}
