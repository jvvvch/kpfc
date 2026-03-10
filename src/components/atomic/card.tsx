import type { ChildrenProps } from '@/types';

export function Card({ children }: ChildrenProps) {
    return (
        <div className="flex bg-card rounded-4xl border-none gap-4 py-4 animate-in-from-top-sm">
            {children}
        </div>
    );
}
