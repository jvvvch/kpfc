import { cva, type VariantProps } from 'cva';
import type { ChildrenProps, ClickableProps } from '@/types';
import { cn } from '@/utils';

const variants = cva(
    'm-auto inline-flex justify-center items-center py-7 w-full text-lg rounded-full h-9 font-medium animate-in-from-bottom',
    {
        variants: {
            color: {
                active: 'bg-primary text-primary-foreground',
                inactive: 'bg-muted text-muted-foreground',
            },
        },
        defaultVariants: {
            color: 'active',
        },
    },
);

export type PrimaryButtonProps = ChildrenProps &
    ClickableProps &
    VariantProps<typeof variants>;

export function PrimaryButton({
    children,
    onClick,
    color,
}: PrimaryButtonProps) {
    return (
        <button className={cn(variants({ color }))} onClick={onClick}>
            {children}
        </button>
    );
}
