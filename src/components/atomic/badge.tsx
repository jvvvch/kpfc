import { cva, type VariantProps } from 'cva';
import type { ChildrenProps, ClickableProps } from '@/types';
import { cn } from '@/utils';

const badgeVariants = cva(
    'gap-1 rounded-4xl border px-2 py-1 my-0.5 text-s inline-flex w-fit shrink-0 items-centers justify-center font-medium',
    {
        variants: {
            color: {
                default: 'border-muted-foreground bg-muted text-foreground',
                invert: 'border-foreground bg-foreground text-muted',
            },
        },
        defaultVariants: {
            color: 'default',
        },
    },
);

export type BadgeProps = ChildrenProps &
    VariantProps<typeof badgeVariants> &
    ClickableProps<HTMLSpanElement>;

export function Badge({ children, color, onClick }: BadgeProps) {
    return (
        <span onClick={onClick} className={cn(badgeVariants({ color }))}>
            {children}
        </span>
    );
}

const badgeGroupVariants = cva('flex flex-row gap-2', {
    variants: {
        variant: {
            default: 'flex-nowrap overflow-x-auto',
            wrap: 'flex-wrap',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

export type BadgeGroupProps = ChildrenProps &
    VariantProps<typeof badgeGroupVariants>;

export function BadgeGroup({ children, variant }: BadgeGroupProps) {
    return (
        <div className={cn(badgeGroupVariants({ variant }))}>{children}</div>
    );
}
