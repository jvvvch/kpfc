import { cva, type VariantProps } from 'cva';
import type { SVGProps } from 'preact/compat';
import type { ClickableProps } from '@/types';
import { cn } from '@/utils';

const variants = cva('size-5', {
    variants: {
        color: {
            default: 'text-foreground',
            destructive: 'text-destructive',
            inherit: 'text-inherit',
        },
    },
    defaultVariants: {
        color: 'default',
    },
});

type BaseIconProps = SVGProps<SVGSVGElement> & VariantProps<typeof variants>;

export type IconProps = VariantProps<typeof variants> &
    ClickableProps & {
        className?: string;
    };
export type FillableIconProps = IconProps & { fill?: boolean };

function BaseIcon({
    color,
    className,
    children,
    viewBox = '0 0 24 24',
    ...props
}: BaseIconProps) {
    return (
        <svg
            viewBox={viewBox}
            fill="none"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={cn(variants({ color, className }))}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {children}
        </svg>
    );
}

export const Icon = {
    ChevronDown: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="m6 9 6 6 6-6" />
        </BaseIcon>
    ),

    ChevronLeft: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="m15 18-6-6 6-6" />
        </BaseIcon>
    ),

    ChevronRight: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="m9 18 6-6-6-6" />
        </BaseIcon>
    ),

    Search: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
        </BaseIcon>
    ),

    Edit: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
        </BaseIcon>
    ),

    Cross: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </BaseIcon>
    ),

    Check: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="M20 6 9 17l-5-5" />
        </BaseIcon>
    ),

    Trash: (props: IconProps) => (
        <BaseIcon {...props} viewBox="0.6 0 24.6 24">
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </BaseIcon>
    ),

    Spinner: (props: IconProps) => (
        <BaseIcon {...props} stroke-width="1">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </BaseIcon>
    ),

    Chart: ({ fill = true, ...props }: FillableIconProps) => (
        <BaseIcon {...props}>
            <path
                stroke={fill ? 'var(--icon-color-chart-1)' : 'currentColor'}
                d="M5 21v-6"
            />
            <path
                stroke={fill ? 'var(--icon-color-chart-2)' : 'currentColor'}
                d="M12 21V3"
            />
            <path
                stroke={fill ? 'var(--icon-color-chart-3)' : 'currentColor'}
                d="M19 21V9"
            />
        </BaseIcon>
    ),

    Carrot: ({ fill = true, ...props }: FillableIconProps) => (
        <BaseIcon {...props}>
            <path
                fill={fill ? 'var(--icon-color-carrot-body)' : 'none'}
                d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46"
            />
            <path
                fill={fill ? 'var(--icon-color-carrot-leaves)' : 'none'}
                d="M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z"
            />
            <path
                fill={fill ? 'var(--icon-color-carrot-leaves)' : 'none'}
                d="M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z"
            />
        </BaseIcon>
    ),

    Gear: ({ fill = true, ...props }: FillableIconProps) => (
        <BaseIcon {...props}>
            <path
                fill-rule="evenodd"
                fill={fill ? 'var(--icon-color-gear)' : 'none'}
                d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915 M12 9 a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
            />
        </BaseIcon>
    ),

    Plus: (props: IconProps) => (
        <BaseIcon {...props}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </BaseIcon>
    ),
};
