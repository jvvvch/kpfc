import type { ChildrenProps } from '@/types';

export function StackRow({ children }: ChildrenProps) {
    return <div className="flex flex-row gap-2">{children}</div>;
}

export function StackCol({ children }: ChildrenProps) {
    return <div className="flex flex-col gap-1">{children}</div>;
}
