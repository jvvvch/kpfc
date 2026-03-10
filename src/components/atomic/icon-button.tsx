import { cva, type VariantProps } from 'cva';
import type { FunctionalComponent } from 'preact';
import type { ClickableProps } from '@/types';
import { cn } from '@/utils';
import { Icon, type IconProps } from './icon';

const variants = cva(
    'icon-button size-11 border-border shadow-xs rounded-full flex items-center justify-center animate-in-from-top-sm',
    {
        variants: {
            color: {
                default: 'bg-card text-foreground',
                destructive: 'bg-destructive text-destructive-foreground',
                inactive: 'bg-muted text-muted-foreground',
            },
        },
        defaultVariants: {
            color: 'default',
        },
    },
);

export type IconButtonProps = ClickableProps & VariantProps<typeof variants>;

function BaseIconButton(
    icon: FunctionalComponent<IconProps>,
    { color, onClick }: IconButtonProps,
) {
    return (
        <button className={cn(variants({ color }))} onClick={onClick}>
            {icon?.({ className: 'text-inherit' })}
        </button>
    );
}

type IconKey = keyof typeof Icon;

export const IconButton = Object.keys(Icon).reduce(
    (v, key: IconKey) => {
        v[key] = (args: IconButtonProps) => BaseIconButton(Icon[key], args);
        return v;
    },
    {} as Record<IconKey, FunctionalComponent<IconButtonProps>>,
);
