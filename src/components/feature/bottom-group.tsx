import { useLayout } from '@/contexts';
import type { ChildrenProps } from '@/types';

export function BottomGroup({ children }: ChildrenProps) {
    const { bottomGroupRef } = useLayout();

    return (
        <div
            ref={bottomGroupRef}
            className="m-0 p-0 w-full absolute px-0 left-0 bottom-0 items-center inline-flex justify-center z-10 bg-transparent flex-col gap-3 overflow-y-hidden"
        >
            {children}
        </div>
    );
}
