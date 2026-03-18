import type { ReadonlySignal } from '@preact/signals';
import type { ChildrenProps } from '@/types';

type DialogProps = ChildrenProps & {
    isOpen: ReadonlySignal<boolean>;
    onClose: () => void;
};

export function Dialog({ isOpen, onClose, children }: DialogProps) {
    if (!isOpen.value) {
        return;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full">
            <div
                className="fixed inset-0 bg-black opacity-50 animate-in fade-in duration-300"
                onClick={onClose}
            ></div>
            <div className="z-100 flex flex-col bg-background border-none gap-4 p-5 animate-in-from-top-sm rounded-4xl mx-5">
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ children }: ChildrenProps) {
    return <div className="flex flex-col gap-4">{children}</div>;
}

export function DialogTitle({ children }: ChildrenProps) {
    return <p className="font-semibold text-xl">{children}</p>;
}

export function DialogDescription({ children }: ChildrenProps) {
    return <div className="w-full text-foreground/50">{children}</div>;
}

export function DialogActions({ children }: ChildrenProps) {
    return (
        <div className="flex flex-row w-full justify-between">{children}</div>
    );
}
