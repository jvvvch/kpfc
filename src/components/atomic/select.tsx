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
                className={cn(
                    'h-full p-0 m-0 mr-5 bg-card rounded-full w-full pl-2.5 border-transparent border-r-10 outline-none text-foreground appearance-none',
                )}
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
            <Icon.ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none" />
        </div>
    );
}
