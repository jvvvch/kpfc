import { cva, type VariantProps } from 'cva';
import type { ChildrenProps, ClickableProps } from '@/types';
import { cn } from '@/utils';

const variants = cva(
    'py-2 px-3 border rounded-3xl inline-flex justify-center items-center w-fit gap-2',
    {
        variants: {
            color: {
                default: 'bg-card text-foreground border-border',
                destructive:
                    'bg-destructive text-destructive-foreground border-destructive',
            },
        },
        defaultVariants: {
            color: 'default',
        },
    },
);

export type ButtonProps = ChildrenProps &
    ClickableProps &
    VariantProps<typeof variants>;

export function Button({ children, onClick, color }: ButtonProps) {
    return (
        <button className={cn(variants({ color }))} onClick={onClick}>
            {children}
        </button>
    );
}
