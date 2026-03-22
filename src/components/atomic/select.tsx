import { cva, type VariantProps } from 'cva';
import { cn } from '@/utils';
import { Icon } from './icon';

const variants = cva('flex-1 rounded-full relative', {
    variants: {
        variant: {
            default: 'border-border border',
            noBorder: 'border-none',
        },
        animate: {
            none: '',
            right: 'animate-in-from-right',
        },
    },
    defaultVariants: {
        variant: 'default',
        animate: 'none',
    },
});

const selectVariants = cva(
    'h-full p-0 m-0 bg-card rounded-full w-full border-transparent border-r-10 outline-none text-foreground appearance-none text-lg',
    {
        variants: {
            variant: {
                default: 'px-4',
                noBorder: 'pr-4.5 text-right',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const iconVariants = cva('pointer-events-none absolute select-none', {
    variants: {
        variant: {
            default: 'top-2.5 right-3',
            noBorder: 'top-1 right-0.25',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

export type SelectOption<T> = { label: string; value: T };

export type SelectProps<T> = {
    options: SelectOption<T>[];
    selected: T;
    disabled?: boolean;
    onChange?: (option: T) => void;
} & VariantProps<typeof variants>;

export function Select<T>({
    options,
    selected,
    onChange,
    disabled,
    variant,
    animate,
}: SelectProps<T>) {
    const noSelect = disabled || options.length < 2;
    return (
        <div className={variants({ variant, animate })}>
            <select
                disabled={noSelect}
                className={cn(selectVariants({ variant }))}
                onChange={(e) => onChange(e.currentTarget.value as T)}
            >
                {options.map((option) => (
                    <option
                        selected={selected === option.value}
                        value={option.value as string}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <Icon.ChevronDown className={cn(iconVariants({ variant }))} />
        </div>
    );
}
